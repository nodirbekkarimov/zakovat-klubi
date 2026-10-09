import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Barcha maydonlarni to\'ldirish shart' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Ushbu email bilan ro\'yxatdan o\'tilgan' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: 'USER',
        level: 1,
        xp: 100, // starter bonus XP
        elo: 1200,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Ro\'yxatdan muvaffaqiyatli o\'tdingiz!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
