import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        captain: { select: { id: true, name: true, level: true } },
        members: { include: { user: { select: { id: true, name: true, level: true } } } },
      },
      orderBy: { points: 'desc' },
    });

    return NextResponse.json({ success: true, teams });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Tizimga kirish shart' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { name, region = 'Toshkent' } = body;

    if (!name || name.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'Jamoa nomi kamida 3 harf bo\'lishi shart' }, { status: 400 });
    }

    const newTeam = await prisma.team.create({
      data: {
        name: name.trim(),
        region,
        captainId: userId,
        points: 100,
        members: {
          create: {
            userId,
            role: 'CAPTAIN',
          },
        },
      },
      include: {
        captain: true,
        members: true,
      },
    });

    return NextResponse.json({ success: true, team: newTeam, message: 'Yangi Zakovat jamoasi muvaffaqiyatli tuzildi!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
