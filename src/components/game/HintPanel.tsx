'use client';

import React, { useState } from 'react';
import { HelpCircle, Lightbulb, ChevronRight, AlertCircle } from 'lucide-react';

interface HintPanelProps {
  questionId: string;
  totalHints: number;
  onHintUsed: (hintText: string, hintIndex: number) => void;
  disabled?: boolean;
}

export function HintPanel({
  questionId,
  totalHints,
  onHintUsed,
  disabled = false,
}: HintPanelProps) {
  const [revealedHints, setRevealedHints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchNextHint = async () => {
    if (disabled || loading || revealedHints.length >= totalHints) return;

    setLoading(true);
    try {
      const res = await fetch('/api/game/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, hintIndex: revealedHints.length }),
      });
      const data = await res.json();
      if (data.success && data.hint) {
        const nextHints = [...revealedHints, data.hint];
        setRevealedHints(nextHints);
        onHintUsed(data.hint, nextHints.length);
      }
    } catch (err) {
      console.error('Hint fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (totalHints === 0) return null;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleFetchNextHint}
          disabled={disabled || loading || revealedHints.length >= totalHints}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lightbulb className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>
            {loading
              ? 'Ishora yuklanmoqda...'
              : revealedHints.length >= totalHints
              ? 'Barcha ishoralar ochildi'
              : `Ishora olish (-20% XP)`}
          </span>
          <span className="ml-1 bg-amber-500/20 px-2 py-0.5 rounded-full text-[10px]">
            {revealedHints.length} / {totalHints}
          </span>
        </button>
      </div>

      {/* Revealed Hints Display */}
      {revealedHints.length > 0 && (
        <div className="space-y-2">
          {revealedHints.map((hint, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-slate-200 text-sm flex items-start gap-2.5 shadow-md"
            >
              <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-amber-400 text-xs block mb-0.5">
                  Ishora #{idx + 1}:
                </span>
                <p>{hint}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
