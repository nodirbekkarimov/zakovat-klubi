import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { evaluateAnswer } from '@/lib/evaluator';
import { calculateXP } from '@/lib/scoring';
import { getLevelInfoFromXP } from '@/lib/levels';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      questionId,
      userAnswer = '',
      timeSpent = 15,
      totalTime = 60,
      hintsUsed = 0,
      mode = 'CLASSIC',
    } = body;

    if (!questionId) {
      return NextResponse.json(
        { success: false, error: 'Savol ID si ko\'rsatilmadi' },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { category: true },
    });

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Savol topilmadi' },
        { status: 404 }
      );
    }

    // 1. Evaluate Answer
    const evaluation = evaluateAnswer(
      userAnswer,
      question.answer,
      question.acceptableAnswers,
      question.keywords
    );

    // 2. Calculate XP
    const scoringBreakdown = calculateXP({
      difficulty: question.difficulty,
      evaluationScore: evaluation.score,
      timeSpent,
      totalTime,
      hintsUsed,
      mode,
    });

    let newXP = 0;
    let newLevel = 1;
    let levelTitle = 'Havaskor';
    let levelUpUnlocked = false;
    const unlockedAchievements: string[] = [];

    // 3. Update User DB metrics if authenticated
    if (session?.user && (session.user as any).id) {
      const userId = (session.user as any).id;
      const currentUser = await prisma.user.findUnique({ where: { id: userId } });

      if (currentUser) {
        const xpEarned = scoringBreakdown.totalXPEarned;
        const oldLevelInfo = getLevelInfoFromXP(currentUser.xp);
        newXP = currentUser.xp + xpEarned;
        const newLevelInfo = getLevelInfoFromXP(newXP);

        newLevel = newLevelInfo.level;
        levelTitle = newLevelInfo.title;

        if (newLevel > oldLevelInfo.level) {
          levelUpUnlocked = true;
        }

        const isCorrect = evaluation.isPassed;
        const newCorrectCount = isCorrect ? currentUser.correctAnswers + 1 : currentUser.correctAnswers;
        const newTotalGames = currentUser.totalGames + 1;

        // Update User Profile
        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: newXP,
            level: newLevel,
            correctAnswers: newCorrectCount,
            totalGames: newTotalGames,
          },
        });

        // Save UserAnswer record
        await prisma.userAnswer.create({
          data: {
            userId,
            questionId,
            userAnswer,
            score: evaluation.score,
            evaluationVerdict: evaluation.verdict,
            xpEarned,
            timeSpent,
            hintsUsed,
            mode,
          },
        });

        // Check Achievements
        if (isCorrect) {
          // First Win
          const firstWinAch = await prisma.achievement.findUnique({ where: { key: 'FIRST_WIN' } });
          if (firstWinAch) {
            const hasAch = await prisma.userAchievement.findUnique({
              where: { userId_achievementId: { userId, achievementId: firstWinAch.id } },
            });
            if (!hasAch) {
              await prisma.userAchievement.create({
                data: { userId, achievementId: firstWinAch.id },
              });
              unlockedAchievements.push(firstWinAch.name);
            }
          }

          // Speed Demon (<10 seconds & correct)
          if (timeSpent <= 10) {
            const speedAch = await prisma.achievement.findUnique({ where: { key: 'SPEED_DEMON' } });
            if (speedAch) {
              const hasAch = await prisma.userAchievement.findUnique({
                where: { userId_achievementId: { userId, achievementId: speedAch.id } },
              });
              if (!hasAch) {
                await prisma.userAchievement.create({
                  data: { userId, achievementId: speedAch.id },
                });
                unlockedAchievements.push(speedAch.name);
              }
            }
          }

          // Perfect Score (100 score)
          if (evaluation.score === 100) {
            const perfectAch = await prisma.achievement.findUnique({ where: { key: 'PERFECT_SCORE' } });
            if (perfectAch) {
              const hasAch = await prisma.userAchievement.findUnique({
                where: { userId_achievementId: { userId, achievementId: perfectAch.id } },
              });
              if (!hasAch) {
                await prisma.userAchievement.create({
                  data: { userId, achievementId: perfectAch.id },
                });
                unlockedAchievements.push(perfectAch.name);
              }
            }
          }
        }
      }
    }

    const acceptableAnswersArray =
      typeof question.acceptableAnswers === 'string'
        ? JSON.parse(question.acceptableAnswers || '[]')
        : question.acceptableAnswers;

    return NextResponse.json({
      success: true,
      evaluation,
      scoring: scoringBreakdown,
      questionDetails: {
        officialAnswer: question.answer,
        acceptableAnswers: acceptableAnswersArray,
        explanation: question.explanation,
        interestingFact: question.interestingFact,
        source: question.source,
      },
      userProgress: {
        newXP,
        newLevel,
        levelTitle,
        levelUpUnlocked,
        unlockedAchievements,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Javobni baholashda xatolik' },
      { status: 500 }
    );
  }
}
