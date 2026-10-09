import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

let liveMatchState = {
  currentRound: '1-Tur (12 ta savol)',
  questionIndex: 0,
  timerSeconds: 60,
  timerRunning: false,
  answerLocked: false,
  answerRevealed: false,
  currentQuestion: null as any,
  submittedAnswers: [] as any[],
};

export async function GET() {
  try {
    if (!liveMatchState.currentQuestion) {
      const q = await prisma.question.findFirst({
        where: { published: true },
        include: { category: true },
      });
      liveMatchState.currentQuestion = q;
    }

    return NextResponse.json({ success: true, matchState: liveMatchState });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Boshlovchi huquqi talab etiladi (Admin)' }, { status: 403 });
    }

    const body = await request.json();
    const { action, round, time } = body;

    if (action === 'START_TIMER') {
      liveMatchState.timerSeconds = time || 60;
      liveMatchState.timerRunning = true;
      liveMatchState.answerLocked = false;
      liveMatchState.answerRevealed = false;
    } else if (action === 'LOCK_ANSWERS') {
      liveMatchState.timerRunning = false;
      liveMatchState.answerLocked = true;
    } else if (action === 'REVEAL_ANSWER') {
      liveMatchState.answerRevealed = true;
    } else if (action === 'NEXT_QUESTION') {
      const questions = await prisma.question.findMany({
        where: { published: true },
        include: { category: true },
      });
      const nextIndex = (liveMatchState.questionIndex + 1) % questions.length;
      liveMatchState.questionIndex = nextIndex;
      liveMatchState.currentQuestion = questions[nextIndex];
      liveMatchState.timerSeconds = 60;
      liveMatchState.timerRunning = false;
      liveMatchState.answerLocked = false;
      liveMatchState.answerRevealed = false;
      liveMatchState.submittedAnswers = [];
    } else if (action === 'SET_ROUND') {
      liveMatchState.currentRound = round;
      liveMatchState.questionIndex = 0;
    }

    return NextResponse.json({
      success: true,
      message: `Boshlovchi buyrug'i bajarildi: ${action}`,
      matchState: liveMatchState,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
