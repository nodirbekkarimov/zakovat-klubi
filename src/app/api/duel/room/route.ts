import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || `guest_${Date.now()}`;
    const userName = (session?.user as any)?.name || 'Bilimdon';

    const body = await request.json();
    const { action, code, answer, questionIndex } = body;

    // 1. Create a multiplayer room
    if (action === 'CREATE_ROOM') {
      const randomCode = `ZK-${Math.floor(1000 + Math.random() * 9000)}`;

      // Fetch 5 random tournament questions
      const questions = await prisma.question.findMany({
        where: { published: true },
        take: 15,
      });

      const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, 5).map((q) => {
        const acceptable = typeof q.acceptableAnswers === 'string'
          ? JSON.parse(q.acceptableAnswers || '[]')
          : q.acceptableAnswers;
        return {
          id: q.id,
          text: q.text,
          answer: q.answer,
          acceptableAnswers: acceptable,
          explanation: q.explanation,
        };
      });

      const room = await prisma.duelRoom.create({
        data: {
          code: randomCode,
          hostUserId: userId,
          hostName: userName,
          status: 'WAITING',
          questionsData: JSON.stringify(shuffled),
        },
      });

      return NextResponse.json({
        success: true,
        code: room.code,
        roomId: room.id,
        room,
      });
    }

    // 2. Join a multiplayer room by code
    if (action === 'JOIN_ROOM') {
      if (!code) {
        return NextResponse.json({ success: false, error: 'Xona kodi kiritilmadi' }, { status: 400 });
      }

      const room = await prisma.duelRoom.findUnique({
        where: { code: code.toUpperCase().trim() },
      });

      if (!room) {
        return NextResponse.json({ success: false, error: 'Bunday kodli xona topilmadi' }, { status: 404 });
      }

      if (room.status === 'FINISHED') {
        return NextResponse.json({ success: false, error: 'Bu duel allaqachon yakunlangan' }, { status: 400 });
      }

      // If already host, just return
      if (room.hostUserId === userId) {
        return NextResponse.json({ success: true, room, isHost: true });
      }

      // Guest joins
      const updatedRoom = await prisma.duelRoom.update({
        where: { id: room.id },
        data: {
          guestUserId: userId,
          guestName: userName,
          status: 'IN_PROGRESS',
        },
      });

      return NextResponse.json({
        success: true,
        room: updatedRoom,
        isHost: false,
      });
    }

    // 3. Poll room state
    if (action === 'GET_ROOM') {
      if (!code) return NextResponse.json({ success: false, error: 'Kod kerak' }, { status: 400 });

      const room = await prisma.duelRoom.findUnique({
        where: { code: code.toUpperCase().trim() },
      });

      if (!room) return NextResponse.json({ success: false, error: 'Xona topilmadi' }, { status: 404 });

      return NextResponse.json({ success: true, room });
    }

    // 4. Submit Score update in room
    if (action === 'SUBMIT_SCORE') {
      const { isHost, isCorrect } = body;
      const room = await prisma.duelRoom.findUnique({
        where: { code: code.toUpperCase().trim() },
      });

      if (!room) return NextResponse.json({ success: false, error: 'Xona topilmadi' }, { status: 404 });

      const dataToUpdate: any = {};
      if (isHost && isCorrect) {
        dataToUpdate.hostScore = { increment: 1 };
      } else if (!isHost && isCorrect) {
        dataToUpdate.guestScore = { increment: 1 };
      }

      const updated = await prisma.duelRoom.update({
        where: { id: room.id },
        data: dataToUpdate,
      });

      return NextResponse.json({ success: true, room: updated });
    }

    return NextResponse.json({ success: false, error: 'Noto\'g\'ri buyruq' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
