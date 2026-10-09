import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, hintIndex = 0 } = body;

    if (!questionId) {
      return NextResponse.json(
        { success: false, error: 'Savol ID si talab qilinadi' },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { hints: true },
    });

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Savol topilmadi' },
        { status: 404 }
      );
    }

    const hintsArray =
      typeof question.hints === 'string'
        ? JSON.parse(question.hints || '[]')
        : question.hints;

    if (hintIndex < 0 || hintIndex >= hintsArray.length) {
      return NextResponse.json(
        { success: false, error: 'Boshqa ishora mavjud emas' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      hint: hintsArray[hintIndex],
      hintIndex,
      totalHints: hintsArray.length,
      hasMoreHints: hintIndex + 1 < hintsArray.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Ishorani olishda xatolik' },
      { status: 500 }
    );
  }
}
