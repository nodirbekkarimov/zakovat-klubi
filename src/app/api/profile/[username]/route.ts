import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getLevelInfoFromXP } from '@/lib/levels';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: username },
          { email: username },
          { name: { equals: decodeURIComponent(username) } },
        ],
      },
      include: {
        userAchievements: {
          include: { achievement: true },
        },
        userAnswers: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            question: {
              select: { text: true, difficulty: true, category: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Foydalanuvchi topilmadi' },
        { status: 404 }
      );
    }

    const levelInfo = getLevelInfoFromXP(user.xp);
    const accuracy = user.totalGames > 0 ? Math.round((user.correctAnswers / user.totalGames) * 100) : 0;

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`,
        role: user.role,
        xp: user.xp,
        streak: user.streak,
        maxStreak: user.maxStreak,
        totalGames: user.totalGames,
        correctAnswers: user.correctAnswers,
        accuracy,
        levelInfo,
        createdAt: user.createdAt,
        achievements: user.userAchievements.map((ua) => ({
          id: ua.achievement.id,
          key: ua.achievement.key,
          name: ua.achievement.name,
          description: ua.achievement.description,
          icon: ua.achievement.icon,
          unlockedAt: ua.unlockedAt,
        })),
        recentAnswers: user.userAnswers.map((ans) => ({
          id: ans.id,
          questionText: ans.question.text,
          category: ans.question.category.name,
          userAnswer: ans.userAnswer,
          score: ans.score,
          verdict: ans.evaluationVerdict,
          xpEarned: ans.xpEarned,
          createdAt: ans.createdAt,
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Profilni olishda xatolik' },
      { status: 500 }
    );
  }
}
