import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const isRandom = searchParams.get('random') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

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

    if (search) {
      where.OR = [
        { text: { contains: search } },
        { answer: { contains: search } },
        { explanation: { contains: search } },
      ];
    }

    let questions = await prisma.question.findMany({
      where,
      include: {
        category: {
          select: { name: true, slug: true, icon: true },
        },
      },
      orderBy: isRandom ? undefined : { createdAt: 'desc' },
    });

    if (isRandom) {
      questions = questions.sort(() => 0.5 - Math.random());
    }

    const selected = questions.slice(0, limit);

    return NextResponse.json({ success: true, count: selected.length, questions: selected });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server xatoligi' },
      { status: 500 }
    );
  }
}
