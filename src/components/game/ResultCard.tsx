'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, ArrowRight, BookOpen, Scale, Loader2 } from 'lucide-react';
import { EvaluationVerdict } from '@/lib/evaluator';

interface ResultCardProps {
  evaluation: {
    score: number;
    verdict: EvaluationVerdict;
    explanation: string;
    matchedKeywords: string[];
    missingKeywords: string[];
  };
  scoring: {
    totalXPEarned: number;
    baseXP: number;
    speedBonusXP: number;
    hintPenaltyXP: number;
  };
  questionDetails: {
    officialAnswer: string;
    acceptableAnswers: string[];
    explanation: string;
    interestingFact?: string;
    source?: string;
  };
  onNextQuestion: () => void;
  isLastQuestion?: boolean;
}

export function ResultCard({
  evaluation,
  scoring,
  questionDetails,
  onNextQuestion,
  isLastQuestion = false,
}: ResultCardProps) {
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [appealing, setAppealing] = useState(false);
  const [appealResult, setAppealResult] = useState<string | null>(null);

  const verdictConfig = {
    CORRECT: {
      title: "Mukammal Javob!",
      bgColor: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",
      icon: CheckCircle2,
      badgeText: "100% TO'G'RI",
    },
    ALMOST_CORRECT: {
      title: "Deyarli To'g'ri!",
      bgColor: "bg-amber-500/10 border-amber-500/40 text-amber-400",
      icon: AlertTriangle,
      badgeText: "JUDA YAQIN",
    },
    PARTIAL: {
      title: "Qisman To'g'ri",
      bgColor: "bg-orange-500/10 border-orange-500/40 text-orange-400",
      icon: AlertTriangle,
      badgeText: "QISMAN",
    },
    WRONG: {
      title: "Noto'g'ri Javob",
      bgColor: "bg-rose-500/10 border-rose-500/40 text-rose-400",
      icon: XCircle,
      badgeText: "NOTO'G'RI",
    },
  };

  const config = verdictConfig[evaluation.verdict] || verdictConfig.WRONG;
  const IconComponent = config.icon;

  const handleAppealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppealing(true);
    setAppealResult(null);

    try {
      const res = await fetch('/api/game/appeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAnswer: evaluation.explanation,
          officialAnswer: questionDetails.officialAnswer,
          userReason: appealReason,
        }),
      });

      const data = await res.json();
      setAppealResult(data.message || 'Apellatsiya ko\'rib chiqildi');
    } catch (err) {
      setAppealResult('Apellatsiyani yuborishda xatolik yuz berdi');
    } finally {
      setAppealing(false);
    }
  };

  return (
    <div className="zakovat-card p-6 sm:p-8 space-y-6 border border-[#cba672]/30 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
      {/* Verdict Header Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${config.bgColor}`}>
        <div className="flex items-center gap-3">
          <IconComponent className="w-8 h-8 shrink-0" />
          <div>
            <h3 className="text-xl font-black">{config.title}</h3>
            <p className="text-xs opacity-90">{evaluation.explanation}</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-2xl font-black font-mono">+{scoring.totalXPEarned} XP</span>
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
            {config.badgeText} ({evaluation.score}%)
          </span>
        </div>
      </div>

      {/* Official Answer & Explanation Section */}
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#1e1912] border border-[#cba672]/20 space-y-2">
          <span className="text-xs font-semibold text-[#cba672] uppercase tracking-wider block">
            Rasmiy To'g'ri Javob:
          </span>
          <p className="text-lg font-bold text-white">{questionDetails.officialAnswer}</p>

          {questionDetails.acceptableAnswers.length > 0 && (
            <p className="text-xs text-slate-400 pt-1">
              Muqobil variantlar: {questionDetails.acceptableAnswers.join(', ')}
            </p>
          )}
        </div>

        {/* Sharh / Izoh */}
        {questionDetails.explanation && (
          <div className="p-4 rounded-2xl bg-[#12181d] border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#cba672]" /> Sharh va Izoh:
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">{questionDetails.explanation}</p>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
        <button
          onClick={() => setShowAppealModal(!showAppealModal)}
          className="zakovat-btn-outline text-xs py-2 px-5 flex items-center gap-2"
        >
          <Scale className="w-4 h-4 text-[#cba672]" />
          <span>E'tiroz Bildirish (AI Apellatsiya)</span>
        </button>

        <button
          onClick={onNextQuestion}
          className="zakovat-btn-primary py-2.5 px-8 flex items-center gap-2"
        >
          <span>{isLastQuestion ? "Natijalarni Ko'rish" : "Keyingi Savol"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Appeal Modal */}
      {showAppealModal && (
        <div className="p-4 rounded-2xl bg-[#1e1912] border border-[#cba672]/40 space-y-3 animate-in fade-in duration-200">
          <span className="text-xs font-bold text-[#cba672] uppercase flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#cba672]" /> AI Zakovat Hakamlar Hay'atiga E'tiroz
          </span>
          <textarea
            rows={2}
            value={appealReason}
            onChange={(e) => setAppealReason(e.target.value)}
            placeholder="Nimaga javobingiz to'g'ri ekanligini izohlang (masalan: Moliya moratoriysi atamasi lotincha kelib chiqqan)..."
            className="zakovat-input text-xs"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleAppealSubmit}
              disabled={appealing || !appealReason.trim()}
              className="zakovat-btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
            >
              {appealing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Scale className="w-3.5 h-3.5" />}
              <span>Yuborish</span>
            </button>
          </div>

          {appealResult && (
            <p className="text-xs font-semibold text-emerald-400 pt-1">{appealResult}</p>
          )}
        </div>
      )}
    </div>
  );
}
