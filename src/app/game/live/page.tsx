'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Flame, Users, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { QuestionCard } from '@/components/game/QuestionCard';
import { AnswerInput } from '@/components/game/AnswerInput';
import { BlackBox } from '@/components/game/BlackBox';
import { sound } from '@/lib/sound';

export default function LiveMatchArenaPage() {
  const [matchState, setMatchState] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fetchLiveState = async () => {
    try {
      const res = await fetch('/api/game/host');
      const data = await res.json();
      if (data.success) {
        setMatchState(data.matchState);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLiveState();
    const interval = setInterval(fetchLiveState, 1500);
    return () => clearInterval(interval);
  }, []);

  // Sync Timer countdown
  useEffect(() => {
    if (matchState?.timerRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            sound.playTimeUp();
            return 0;
          }
          if (prev <= 10) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [matchState?.timerRunning, timeLeft]);

  const handleAnswerSubmit = (ans: string) => {
    setUserAnswer(ans);
    setSubmitted(true);
    sound.playCorrect();
  };

  const q = matchState?.currentQuestion;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Live Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#cba672]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#cba672] text-slate-950 flex items-center justify-center font-black">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="px-3 py-0.5 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-[#cba672] font-bold text-xs">
              JONLI ARENA
            </span>
            <h1 className="text-xl sm:text-3xl font-black text-white">{matchState?.currentRound || '1-Tur'}</h1>
          </div>
        </div>

        {/* Synced Countdown Timer */}
        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#1e1912] border border-[#cba672]/40 shadow-xl">
          <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-rose-500 animate-bounce' : 'text-[#cba672]'}`} />
          <span className={`text-2xl font-black font-mono ${timeLeft <= 10 ? 'text-rose-500' : 'text-[#cba672]'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Main Question Display */}
      {q && (
        <QuestionCard
          questionNumber={matchState?.questionIndex + 1 || 1}
          totalQuestions={12}
          categoryName={q.category?.name || 'Zakovat'}
          difficulty={q.difficulty || 'MEDIUM'}
          questionText={q.text}
        />
      )}

      {/* Qora Quti Reveal (if applicable) */}
      {q?.answer === 'Telefon' && (
        <BlackBox
          itemName={q.answer}
          itemDescription={q.explanation}
          isRevealed={matchState?.answerRevealed}
        />
      )}

      {/* Player Answer Input (locked when time is up) */}
      {!matchState?.answerRevealed && (
        <div className="space-y-3">
          <AnswerInput
            onSubmit={handleAnswerSubmit}
            disabled={submitted || timeLeft <= 0 || matchState?.answerLocked}
            placeholder={
              submitted
                ? "Javobingiz yuborildi! Boshlovchi vaqtini kuting..."
                : "Javobingizni shu yerga yozing (masalan: O'tkir Hoshimov)..."
            }
          />
          {submitted && (
            <p className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Javobingiz muvaffaqiyatli qabul qilindi: "{userAnswer}"
            </p>
          )}
        </div>
      )}

      {/* Revealed Answer Box */}
      {matchState?.answerRevealed && (
        <div className="zakovat-card p-6 border border-emerald-500/40 bg-emerald-500/10 space-y-3 animate-in fade-in duration-300">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            Rasmiy To'g'ri Javob:
          </span>
          <p className="text-2xl font-black text-white">{q?.answer}</p>
          {q?.explanation && (
            <p className="text-xs text-slate-300 border-t border-emerald-500/20 pt-2 leading-relaxed">
              <span className="font-bold text-[#cba672]">Sharh:</span> {q.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
