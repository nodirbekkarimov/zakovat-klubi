import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const body = await request.json().catch(() => ({}));
    const { action = 'FIND_MATCH' } = body;

    if (action === 'FIND_MATCH') {
      // 1. Fetch 5 random tournament questions for the blitz duel
      const questions = await prisma.question.findMany({
        where: { published: true },
        include: {
          category: { select: { name: true, slug: true } },
        },
      });

      const shuffled = questions.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5).map((q) => {
        const acceptable = typeof q.acceptableAnswers === 'string'
          ? JSON.parse(q.acceptableAnswers || '[]')
          : q.acceptableAnswers;
        return {
          id: q.id,
          text: q.text,
          answer: q.answer,
          acceptableAnswers: acceptable,
          explanation: q.explanation,
          category: q.category?.name || 'Zakovat',
          difficulty: q.difficulty,
          timeLimit: 30, // 30 seconds rapid blitz
        };
      });

      // 2. Select / Generate Opponent
      const opponentsList = [
        { name: "Bobur Ziyodullayev", title: "Samarqand Chempioni", elo: 1420, avatar: "B", winRate: "68%" },
        { name: "Malika Rustamova", title: "Oliy Liga Bilimdoni", elo: 1510, avatar: "M", winRate: "74%" },
        { name: "Sardor Temirov", title: "Toshkent Grandmaster", elo: 1640, avatar: "S", winRate: "81%" },
        { name: "Nigora Alimova", title: "Farg'ona Feniks Sardori", elo: 1390, avatar: "N", winRate: "62%" },
        { name: "Azizbek Qodirov", title: "Zakovat Allomasi", elo: 1580, avatar: "A", winRate: "77%" },
      ];

      const opponent = opponentsList[Math.floor(Math.random() * opponentsList.length)];

      return NextResponse.json({
        success: true,
        matchId: `duel_${Date.now()}`,
        opponent,
        questions: selected,
      });
    }

    if (action === 'SUBMIT_DUEL_RESULT') {
      const { playerWon, scorePlayer, scoreOpponent } = body;
      const eloDelta = playerWon ? 25 : -15;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: { increment: playerWon ? 150 : 50 },
            totalGames: { increment: 1 },
          },
        }).catch(() => {});
      }

      return NextResponse.json({
        success: true,
        eloDelta,
        xpEarned: playerWon ? 150 : 50,
      });
    }

    return NextResponse.json({ success: false, error: 'Noto\'g\'ri buyruq' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
