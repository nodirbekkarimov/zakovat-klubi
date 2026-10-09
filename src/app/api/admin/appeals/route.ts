import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

let appeals = [
  {
    id: 'apl_1',
    user: 'Alisher Navoiy',
    questionText: 'Midzaru, Kikadzaru va Ivadzaru ismli maymunlar... To\'rtinchi maymun nima bilan tasvirlangan?',
    officialAnswer: 'Telefon',
    userAnswer: 'Smartfon',
    userReason: 'Hozirgi kunda smartfon va telefon sinonim sifatida ishlatiladi va karikaturada aynan smartfon tasvirlangan.',
    status: 'PENDING',
    createdAt: 'Bugun, 18:24',
  },
  {
    id: 'apl_2',
    user: 'Bobur Mirzo',
    questionText: 'Kalamush va sichqonlar zarar hajmini kamaytirish maqsadida UNI o\'ylab topishgan... Asar muallifini yozib bering!',
    officialAnswer: 'O\'tkir Hoshimov',
    userAnswer: 'Utkir Hoshimov',
    userReason: 'Klaviatura shrifti tufayli tuturuq belgisi tushib qolgan, lekin shaxs nomi to\'g\'ri yozilgan.',
    status: 'ACCEPTED',
    createdAt: 'Bugun, 17:50',
  },
  {
    id: 'apl_3',
    user: 'Sardor Bilimdon',
    questionText: 'Bu inson miloddan avvalgi 100-yilda dunyoga kelgan... Bu inson kim?',
    officialAnswer: 'Gay Yuliy Sezar',
    userAnswer: 'Yuliy Sezar',
    userReason: 'Gay Yuliy Sezarning to\'liq ismi, Yuliy Sezar varianti ham to\'liq hisoblanishi kerak.',
    status: 'PENDING',
    createdAt: 'Bugun, 16:15',
  },
];

export async function GET() {
  return NextResponse.json({ success: true, appeals });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Hakamlik huquqi talab etiladi' }, { status: 403 });
    }

    const body = await request.json();
    const { appealId, verdict } = body; // verdict: 'ACCEPTED' | 'REJECTED'

    const target = appeals.find((a) => a.id === appealId);
    if (target) {
      target.status = verdict;
      return NextResponse.json({
        success: true,
        message: verdict === 'ACCEPTED'
          ? 'Apellatsiya qabul qilindi! Foydalanuvchiga +100 XP va to\'g\'ri javob hisoblandi.'
          : 'Apellatsiya hakamlar tomonidan rad etildi.',
      });
    }

    return NextResponse.json({ success: false, error: 'Apellatsiya topilmadi' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
