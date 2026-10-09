'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Zap, Target, Clock, ArrowRight, RotateCcw, Home, Award, Sparkles } from 'lucide-react';
import { XPBar } from '@/components/shared/XPBar';
import { LevelBadge } from '@/components/shared/LevelBadge';

export default function GameResultPage() {
  const router = useRouter();
  const [summaryData, setSummaryData] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('lastZakovatGame');
      if (raw) {
        try {
          setSummaryData(JSON.parse(raw));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  if (!summaryData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 space-y-4">
        <p className="text-slate-300 font-semibold">O'yin natijalari topilmadi.</p>
        <Link href="/" className="gold-button px-6 py-2.5 rounded-xl font-bold text-sm">
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  const { mode, totalQuestions, gameHistory = [] } = summaryData;

  let totalXPEarned = 0;
  let correctCount = 0;
  let totalTimeSpent = 0;

  gameHistory.forEach((item: any) => {
    totalXPEarned += item.result?.scoring?.totalXPEarned || 0;
    if (item.result?.evaluation?.isPassed) {
      correctCount++;
    }
  });

  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const avgTime = totalQuestions > 0 ? Math.round(totalTimeSpent / totalQuestions) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Victory Header Banner */}
      <div className="glass-card rounded-3xl p-8 text-center space-y-4 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-2xl shadow-amber-500/30 mx-auto">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            O'YIN YAKUNLANDI ({mode})
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 gold-gradient-text">
            Ajoyib Natija!
          </h1>
        </div>

        <div className="py-2 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-black text-2xl shadow-lg">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>+{totalXPEarned} XP Qozonildi</span>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-6 text-center space-y-1 border border-slate-800">
          <Target className="w-6 h-6 text-emerald-400 mx-auto" />
          <span className="text-2xl font-black text-slate-100 block">
            {correctCount} / {totalQuestions}
          </span>
          <span className="text-xs text-slate-400 font-semibold uppercase">To'g'ri Javoblar</span>
        </div>

        <div className="glass-card rounded-2xl p-6 text-center space-y-1 border border-slate-800">
          <Zap className="w-6 h-6 text-amber-400 mx-auto" />
          <span className="text-2xl font-black text-slate-100 block">{accuracy}%</span>
          <span className="text-xs text-slate-400 font-semibold uppercase">Aniqlik Ko'rsatkichi</span>
        </div>

        <div className="glass-card rounded-2xl p-6 text-center space-y-1 border border-slate-800">
          <Award className="w-6 h-6 text-cyan-400 mx-auto" />
          <span className="text-2xl font-black text-slate-100 block">{totalXPEarned} XP</span>
          <span className="text-xs text-slate-400 font-semibold uppercase">Jami To'plangan XP</span>
        </div>
      </div>

      {/* Answer History List */}
      <div className="glass-card rounded-2xl p-6 space-y-4 border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100">Savollar Tarixi va Tahlili</h3>
        <div className="space-y-3">
          {gameHistory.map((item: any, idx: number) => {
            const isPassed = item.result?.evaluation?.isPassed;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs text-amber-400 font-semibold">
                    Savol #{idx + 1} • {item.question?.category?.name}
                  </span>
                  <p className="text-sm font-semibold text-slate-200 line-clamp-1">
                    {item.question?.text}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isPassed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isPassed ? "To'g'ri" : "Noto'g'ri"}
                  </span>
                  <span className="text-xs text-slate-400 block mt-1 font-mono">
                    +{item.result?.scoring?.totalXPEarned || 0} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          href="/game"
          className="gold-button px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Yana O'ynash</span>
        </Link>
        <Link
          href="/leaderboard"
          className="glass-card px-8 py-3.5 rounded-xl font-bold text-slate-200 border border-amber-500/30 hover:border-amber-500/60 flex items-center gap-2 text-sm"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Peshqadamlar</span>
        </Link>
        <Link
          href="/"
          className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-300 hover:text-white"
        >
          Bosh Sahifa
        </Link>
      </div>
    </div>
  );
}
