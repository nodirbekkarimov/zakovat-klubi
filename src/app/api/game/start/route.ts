import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mode = 'CLASSIC', categorySlug, difficulty, count = 20 } = body;

    const where: any = { published: true };

    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      if (category) {
        where.categoryId = category.id;
      }
    }

    if (difficulty) {
      where.difficulty = difficulty.toUpperCase();
    }

    let questionLimit = Math.min(50, Math.max(1, count));
    if (mode === 'DAILY') questionLimit = 5;
    if (mode === 'RANDOM') questionLimit = 10;

    // Fetch pool of questions
    const pool = await prisma.question.findMany({
      where,
      include: {
        category: {
          select: { name: true, slug: true, icon: true },
        },
      },
    });

    // Shuffle questions array randomly
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, questionLimit);

    // Sanitize questions by hiding exact answer in initial question payload
    const sanitizedQuestions = selectedQuestions.map((q) => {
      const hintsArray = typeof q.hints === 'string' ? JSON.parse(q.hints || '[]') : q.hints;
      return {
        id: q.id,
        text: q.text,
        difficulty: q.difficulty,
        category: q.category,
        hintCount: hintsArray.length,
        timeLimit: q.difficulty === 'EXPERT' ? 90 : q.difficulty === 'HARD' ? 75 : 60,
      };
    });

    return NextResponse.json({
      success: true,
      mode,
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'O\'yin boshlashda xatolik' },
      { status: 500 }
    );
  }
}
