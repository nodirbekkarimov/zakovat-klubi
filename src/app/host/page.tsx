'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  Play,
  Lock,
  Eye,
  SkipForward,
  Trophy,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { sound } from '@/lib/sound';

export default function HostDashboardPage() {
  const router = useRouter();

  const [matchState, setMatchState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [error, setError] = useState('');

  const fetchMatchState = async () => {
    try {
      const res = await fetch('/api/game/host');
      const data = await res.json();
      if (data.success) {
        setMatchState(data.matchState);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchState();
    const interval = setInterval(fetchMatchState, 2000);
    return () => clearInterval(interval);
  }, []);

  const sendHostAction = async (action: string, time?: number) => {
    setActionMsg('');
    setError('');

    // Trigger audio cues on host actions
    if (action === 'START_TIMER') {
      sound.playGong();
    } else if (action === 'LOCK_ANSWERS') {
      sound.playTimeUp();
    } else if (action === 'REVEAL_ANSWER') {
      sound.playCorrect();
    }

    try {
      const res = await fetch('/api/game/host', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, time }),
      });
      const data = await res.json();
      if (data.success) {
        setMatchState(data.matchState);
        setActionMsg(data.message);
      } else {
        setError(data.error || 'Buyruq bajarilmadi');
      }
    } catch (err: any) {
      setError('Kutilmagan xatolik yuz berdi');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#cba672] animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Boshlovchi Paneli yuklanmoqda...</p>
      </div>
    );
  }

  const q = matchState?.currentQuestion;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#cba672]/20 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#cba672] text-slate-950 flex items-center justify-center font-black">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <span className="px-3 py-0.5 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-[#cba672] font-bold text-xs">
              BOSHALOVCHI KABINETI
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">Turnir Boshqaruv Paneli</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => sound.playGong()}
            className="zakovat-btn-outline text-xs py-2 px-4 flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4 text-[#cba672]" />
            <span>GONG SINOVI</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{actionMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Host Controller Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Question & Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="zakovat-card p-6 border border-[#cba672]/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-[#cba672] uppercase tracking-wider">
                {matchState?.currentRound || '1-TUR'} • SAVOL #{matchState?.questionIndex + 1 || 1}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900 text-xs font-bold text-slate-300">
                {q?.difficulty || 'MEDIUM'}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">Savol Matni (Boshlovchi uchun):</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                "{q?.text || 'Savol yuklanmadi'}"
              </h2>
            </div>

            {/* Answer & Explanation Box */}
            <div className="p-4 rounded-2xl bg-[#1e1912] border border-[#cba672]/30 space-y-2">
              <span className="text-xs font-bold text-[#cba672] uppercase block">Rasmiy Javob:</span>
              <p className="text-lg font-bold text-white">{q?.answer}</p>

              {q?.explanation && (
                <p className="text-xs text-slate-300 pt-2 border-t border-slate-800 leading-relaxed">
                  <span className="font-bold text-[#cba672]">Sharh:</span> {q.explanation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Live Host Actions Panel (1 Col) */}
        <div className="space-y-4">
          <div className="zakovat-card p-6 border border-[#cba672]/30 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Boshlovchi Buyruqlari
            </h3>

            {/* Action 1: Start 60s Timer */}
            <button
              onClick={() => sendHostAction('START_TIMER', 60)}
              className="zakovat-btn-primary w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-xl"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>VAQTNI BOSHLASH (60s GONG)</span>
            </button>

            {/* Action 2: Lock Answers */}
            <button
              onClick={() => sendHostAction('LOCK_ANSWERS')}
              className="zakovat-btn-outline w-full py-3 text-xs font-bold flex items-center justify-center gap-2 text-amber-400 border-amber-400/50"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>JAVOBLARNI YOPISH (LOCK)</span>
            </button>

            {/* Action 3: Reveal Official Answer */}
            <button
              onClick={() => sendHostAction('REVEAL_ANSWER')}
              className="zakovat-btn-outline w-full py-3 text-xs font-bold flex items-center justify-center gap-2 text-emerald-400 border-emerald-400/50"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>JAVOBNI E'LON QILISH</span>
            </button>

            <hr className="border-slate-800" />

            {/* Action 4: Next Question */}
            <button
              onClick={() => sendHostAction('NEXT_QUESTION')}
              className="zakovat-btn-outline w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              <span>KEYINGI SAVOLGA O'TISH</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
