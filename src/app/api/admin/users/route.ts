import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin huquqi talab etiladi' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        level: true,
        xp: true,
        elo: true,
        isBanned: true,
        streak: true,
        totalGames: true,
        correctAnswers: true,
        createdAt: true,
      },
      orderBy: { xp: 'desc' },
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin huquqi talab etiladi' }, { status: 403 });
    }

    const body = await request.json();
    const { action, userId, newRole, newXP, newPassword } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Foydalanuvchi ID ko\'rsatilmadi' }, { status: 400 });
    }

    // 1. Role Change
    if (action === 'CHANGE_ROLE') {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
      });
      return NextResponse.json({ success: true, message: `Rol "${newRole}" ga o'zgartirildi!`, user: updated });
    }

    // 2. Ban / Unban Toggle
    if (action === 'TOGGLE_BAN') {
      const current = await prisma.user.findUnique({ where: { id: userId } });
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { isBanned: !current?.isBanned },
      });
      return NextResponse.json({
        success: true,
        message: updated.isBanned
          ? 'Foydalanuvchi muvaffaqiyatli BLOKLANDI!'
          : 'Foydalanuvchi blokdan CHIQARILDI!',
        user: updated,
      });
    }

    // 3. Adjust XP & Level
    if (action === 'ADJUST_XP') {
      const xpVal = Number(newXP) || 0;
      const calcLevel = Math.max(1, Math.floor(xpVal / 500) + 1);
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { xp: xpVal, level: calcLevel },
      });
      return NextResponse.json({
        success: true,
        message: `Foydalanuvchi XP ${xpVal} va Daraja ${calcLevel} ga o'zgartirildi!`,
        user: updated,
      });
    }

    // 4. Admin Reset Password
    if (action === 'RESET_PASSWORD') {
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ success: false, error: 'Parol kamida 6 belgi bo\'lsin' }, { status: 400 });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
      });
      return NextResponse.json({ success: true, message: 'Foydalanuvchi paroli muvaffaqiyatli yangilandi!' });
    }

    return NextResponse.json({ success: false, error: 'Noma\'lum buyruq' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
