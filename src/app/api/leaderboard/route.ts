import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getLevelInfoFromXP } from '@/lib/levels';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const topUsers = await prisma.user.findMany({
      take: limit,
      orderBy: [{ xp: 'desc' }, { correctAnswers: 'desc' }],
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        xp: true,
        level: true,
        streak: true,
        totalGames: true,
        correctAnswers: true,
      },
    });

    const leaderboard = topUsers.map((u, index) => {
      const levelInfo = getLevelInfoFromXP(u.xp);
      const accuracy = u.totalGames > 0 ? Math.round((u.correctAnswers / u.totalGames) * 100) : 0;

      return {
        rank: index + 1,
        id: u.id,
        name: u.name,
        avatar: u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name}`,
        xp: u.xp,
        level: levelInfo.level,
        levelTitle: levelInfo.title,
        streak: u.streak,
        totalGames: u.totalGames,
        correctAnswers: u.correctAnswers,
        accuracy,
      };
    });

    return NextResponse.json({ success: true, leaderboard });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Peshqadamlar ro\'yxatini olishda xatolik' },
      { status: 500 }
    );
  }
}
