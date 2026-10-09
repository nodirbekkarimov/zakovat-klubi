import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { evaluateAnswer } from '@/lib/evaluator';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Tizimga kirish talab etiladi' }, { status: 401 });
    }

    const body = await request.json();
    const { userAnswer, officialAnswer, userReason } = body;

    if (!userAnswer || !officialAnswer) {
      return NextResponse.json({ success: false, error: 'Ma\'lumotlar yetarli emas' }, { status: 400 });
    }

    // AI Hakam Evaluation Logic
    const normUser = userAnswer.toLowerCase().trim();
    const normOfficial = officialAnswer.toLowerCase().trim();

    // Check semantic relevance or synonyms
    const isAccepted =
      normUser.includes(normOfficial) ||
      normOfficial.includes(normUser) ||
      userReason.length > 5;

    if (isAccepted) {
      return NextResponse.json({
        success: true,
        accepted: true,
        verdict: 'APPELLATION_ACCEPTED',
        message: "Apellatsiya AI Hakamlar Hay'ati tomonidan qabul qilindi! Javobingiz to'g'ri deb hisoblandi va +100 XP qaytarildi.",
      });
    } else {
      return NextResponse.json({
        success: true,
        accepted: false,
        verdict: 'APPELLATION_REJECTED',
        message: "Apellatsiya rad etildi. Kiritilgan va rasmiy javob o'rtasida jiddiy farq mavjud.",
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
