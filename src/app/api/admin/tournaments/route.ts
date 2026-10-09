import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Memory store for tournament schedules
let tournaments = [
  {
    id: 'trn_1',
    title: 'Oliy Liga 2026 — Kuzgi Mavsum 1-Turi',
    date: '2026-10-15 18:00',
    region: 'Toshkent shahri (Markaziy Bino)',
    rounds: 2,
    questionsPerRound: 12,
    prizePool: '15 000 000 so\'m',
    status: 'ACTIVE',
    registeredTeamsCount: 48,
  },
  {
    id: 'trn_2',
    title: 'Samarqand Viloyat Hokimi Kubogi',
    date: '2026-10-22 14:00',
    region: 'Samarqand shahri',
    rounds: 2,
    questionsPerRound: 12,
    prizePool: '10 000 000 so\'m',
    status: 'UPCOMING',
    registeredTeamsCount: 32,
  },
  {
    id: 'trn_3',
    title: 'Zakovat Universiada Blits Chempionati',
    date: '2026-11-01 10:00',
    region: 'Onlayn (Jonli Arena)',
    rounds: 3,
    questionsPerRound: 10,
    prizePool: '20 000 000 so\'m',
    status: 'REGISTRATION_OPEN',
    registeredTeamsCount: 64,
  },
];

export async function GET() {
  return NextResponse.json({ success: true, tournaments });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin huquqi talab etiladi' }, { status: 403 });
    }

    const body = await request.json();
    const { title, date, region, rounds = 2, prizePool = '5 000 000 so\'m' } = body;

    if (!title || !date) {
      return NextResponse.json({ success: false, error: 'Sarlavha va sana kiritilishi shart' }, { status: 400 });
    }

    const newTournament = {
      id: `trn_${Date.now()}`,
      title,
      date,
      region: region || 'O\'zbekiston',
      rounds: Number(rounds),
      questionsPerRound: 12,
      prizePool,
      status: 'UPCOMING',
      registeredTeamsCount: 0,
    };

    tournaments.unshift(newTournament);

    return NextResponse.json({
      success: true,
      message: 'Yangi rasmiy Zakovat turniri muvaffaqiyatli e\'lon qilindi!',
      tournament: newTournament,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
