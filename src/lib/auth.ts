import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email va parol kiritilishi shart');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user) {
          throw new Error("Foydalanuvchi topilmadi");
        }

        if (user.isBanned) {
          throw new Error("Sizning hisobingiz qoidabuzarlik sababli admin tomonidan bloklangan!");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error('Noto\'g\'ri parol');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          level: user.level,
          xp: user.xp,
          elo: (user as any).elo || 1200,
          streak: user.streak,
          avatar: user.avatar,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.level = (user as any).level;
        token.xp = (user as any).xp;
        token.elo = (user as any).elo;
        token.streak = (user as any).streak;
      }
      if (trigger === 'update' && session) {
        return { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).level = token.level;
        (session.user as any).xp = token.xp;
        (session.user as any).elo = token.elo;
        (session.user as any).streak = token.streak;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'zakovat-secret-key-super-secure-2026',
  pages: {
    signIn: '/login',
  },
};
