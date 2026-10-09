'use client';

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerRingProps {
  totalSeconds: number;
  onTimeUp?: () => void;
  isPaused?: boolean;
  onTick?: (remaining: number) => void;
}

export function TimerRing({
  totalSeconds = 60,
  onTimeUp,
  isPaused = false,
  onTick,
}: TimerRingProps) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    setTimeLeft(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (onTick) onTick(next);

        if (next <= 0) {
          clearInterval(interval);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeUp, onTick]);

  const progress = Math.max(0, timeLeft / totalSeconds);
  const strokeDashoffset = 283 * (1 - progress);

  // Dynamic Ring Color
  let ringColor = 'stroke-emerald-400';
  let glowColor = 'shadow-emerald-500/20';

  if (progress <= 0.25) {
    ringColor = 'stroke-rose-500 animate-pulse';
    glowColor = 'shadow-rose-500/40';
  } else if (progress <= 0.5) {
    ringColor = 'stroke-amber-400';
    glowColor = 'shadow-amber-500/30';
  }

  return (
    <div className={`relative flex items-center justify-center w-24 h-24 rounded-full ${glowColor}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          className="stroke-slate-800 fill-none"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          className={`fill-none transition-all duration-1000 ease-linear ${ringColor}`}
          strokeWidth="8"
          strokeDasharray="283"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-mono font-black text-xl text-slate-100">{timeLeft}</span>
        <span className="text-[9px] uppercase font-bold text-slate-400 -mt-1">soniya</span>
      </div>
    </div>
  );
}
