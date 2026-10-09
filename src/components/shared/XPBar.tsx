'use client';

import React from 'react';
import { getLevelInfoFromXP } from '@/lib/levels';
import { Sparkles } from 'lucide-react';

interface XPBarProps {
  xp: number;
  showLabels?: boolean;
}

export function XPBar({ xp, showLabels = true }: XPBarProps) {
  const levelInfo = getLevelInfoFromXP(xp);

  return (
    <div className="w-full space-y-1.5">
      {showLabels && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" /> {xp.toLocaleString()} XP
          </span>
          <span className="text-slate-400">
            Keyingi darajaga: {levelInfo.currentLevelXP} / {levelInfo.nextLevelXP} XP
          </span>
        </div>
      )}
      <div className="relative w-full h-2.5 bg-slate-900/90 rounded-full overflow-hidden border border-amber-500/20 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-700 ease-out relative"
          style={{ width: `${levelInfo.progressPercent}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
