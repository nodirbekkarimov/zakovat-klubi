import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateZakovatQuestions } from '@/lib/questionGenerator';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Ruxsat berilmagan (Admin)' }, { status: 403 });
    }

    const body = await request.json();
    const { topic = 'Jahon Tarixi', categorySlug = 'tarix', difficulty = 'HARD', count = 3 } = body;

    const category = categorySlug
      ? await prisma.category.findUnique({ where: { slug: categorySlug } })
      : await prisma.category.findFirst();

    if (!category) {
      return NextResponse.json({ success: false, error: 'Kategoriya topilmadi' }, { status: 400 });
    }

    const generated = generateZakovatQuestions({ topic, categorySlug: category.slug, difficulty, count });

    const createdQuestions = [];

    for (const q of generated) {
      const created = await prisma.question.create({
        data: {
          text: q.text,
          answer: q.answer,
          acceptableAnswers: JSON.stringify(q.acceptableAnswers),
          keywords: JSON.stringify(q.keywords),
          difficulty: q.difficulty,
          categoryId: category.id,
          hints: JSON.stringify(q.hints),
          explanation: q.explanation,
          source: q.source,
          published: true,
        },
      });
      createdQuestions.push(created);
    }

    return NextResponse.json({
      success: true,
      message: `${createdQuestions.length} ta zakovat savoli generatsiya qilindi va saqlandi!`,
      questions: createdQuestions,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
