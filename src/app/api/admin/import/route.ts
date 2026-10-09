import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Ruxsat berilmagan (Admin)' }, { status: 403 });
    }

    const body = await request.json();
    const { questions = [], categoryId } = body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ success: false, error: 'Savollar ro\'yxati bo\'sh' }, { status: 400 });
    }

    let createdCount = 0;
    const defaultCat = categoryId
      ? await prisma.category.findUnique({ where: { id: categoryId } })
      : await prisma.category.findFirst();

    if (!defaultCat) {
      return NextResponse.json({ success: false, error: 'Kategoriya topilmadi' }, { status: 400 });
    }

    for (const q of questions) {
      if (!q.text || !q.answer) continue;

      const acceptableJson = JSON.stringify(q.acceptableAnswers || []);
      const keywordsJson = JSON.stringify(q.keywords || []);
      const hintsJson = JSON.stringify(q.hints || []);

      await prisma.question.create({
        data: {
          text: q.text,
          answer: q.answer,
          acceptableAnswers: acceptableJson,
          keywords: keywordsJson,
          difficulty: (q.difficulty || 'MEDIUM').toUpperCase(),
          categoryId: q.categoryId || defaultCat.id,
          hints: hintsJson,
          explanation: q.explanation || '',
          interestingFact: q.interestingFact || '',
          source: q.source || 'Bulk Import',
          published: true,
        },
      });
      createdCount++;
    }

    return NextResponse.json({
      success: true,
      message: `${createdCount} ta savol muvaffaqiyatli yuklandi!`,
      count: createdCount,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
