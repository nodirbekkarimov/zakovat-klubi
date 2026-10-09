'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Calendar, Flame, Play, Sparkles, Trophy, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function DailyChallengePage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const todayDate = new Date().toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Banner */}
      <div className="glass-card rounded-3xl p-8 text-center space-y-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>{todayDate} — Kunlik Sinov</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
            Bugungi <span className="text-emerald-400">5 ta Maxsus</span> Savol
          </h1>
          <p className="text-base text-slate-300 max-w-xl mx-auto">
            Har kuni 5 ta tanlangan eksklyuziv intellektual savolga javob bering, seriyangizni saqlang va <strong className="text-emerald-400">1.5x XP bonus</strong> oling!
          </p>
        </div>

        {/* User Streak Metrics */}
        {user && (
          <div className="py-3 px-6 rounded-2xl bg-slate-900/90 border border-slate-800 inline-flex items-center gap-6 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-lg">
              <Flame className="w-6 h-6 fill-amber-500 animate-bounce" />
              <span>{user.streak || 1} Kungi Seriya</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>+50% XP Bonus faol</span>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Link
            href="/game?mode=DAILY"
            className="gold-button px-10 py-4 rounded-2xl font-extrabold text-base inline-flex items-center gap-3 shadow-2xl hover:scale-105 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Bugungi Sinovni Boshlash</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
