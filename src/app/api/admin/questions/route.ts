import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Ruxsat berilmagan (Admin)' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const categoryId = searchParams.get('categoryId');

    const where: any = {};
    if (query) {
      where.text = { contains: query };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const questions = await prisma.question.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    const categories = await prisma.category.findMany();

    return NextResponse.json({ success: true, questions, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Ruxsat berilmagan (Admin)' }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      text,
      answer,
      acceptableAnswers = [],
      keywords = [],
      difficulty = 'MEDIUM',
      categoryId,
      hints = [],
      explanation = '',
      interestingFact = '',
      source = '',
      published = true,
    } = body;

    if (!text || !answer || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Matn, to\'g\'ri javob va kategoriya kiritilishi shart' },
        { status: 400 }
      );
    }

    const acceptableJson = typeof acceptableAnswers === 'string' ? acceptableAnswers : JSON.stringify(acceptableAnswers);
    const keywordsJson = typeof keywords === 'string' ? keywords : JSON.stringify(keywords);
    const hintsJson = typeof hints === 'string' ? hints : JSON.stringify(hints);

    if (id) {
      // Update existing question
      const updated = await prisma.question.update({
        where: { id },
        data: {
          text,
          answer,
          acceptableAnswers: acceptableJson,
          keywords: keywordsJson,
          difficulty,
          categoryId,
          hints: hintsJson,
          explanation,
          interestingFact,
          source,
          published,
        },
      });
      return NextResponse.json({ success: true, question: updated, message: "Savol muvaffaqiyatli yangilandi" });
    } else {
      // Create new question
      const created = await prisma.question.create({
        data: {
          text,
          answer,
          acceptableAnswers: acceptableJson,
          keywords: keywordsJson,
          difficulty,
          categoryId,
          hints: hintsJson,
          explanation,
          interestingFact,
          source,
          published,
        },
      });
      return NextResponse.json({ success: true, question: created, message: "Yangi savol yaratildi" });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
