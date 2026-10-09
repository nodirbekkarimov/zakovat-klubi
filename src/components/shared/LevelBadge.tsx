'use client';

import React from 'react';
import { Shield, Crown, Award, Star } from 'lucide-react';
import { getLevelInfoFromXP } from '@/lib/levels';

interface LevelBadgeProps {
  xp: number;
  showTitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LevelBadge({ xp, showTitle = true, size = 'md' }: LevelBadgeProps) {
  const levelInfo = getLevelInfoFromXP(xp);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-3 py-1 text-sm font-bold gap-1.5',
    lg: 'px-4 py-2 text-base font-extrabold gap-2',
  };

  const IconComponent = levelInfo.level >= 50 ? Crown : levelInfo.level >= 25 ? Award : Star;

  return (
    <div
      className={`inline-flex items-center rounded-full bg-gradient-to-r ${levelInfo.badgeColor} text-slate-950 shadow-lg shadow-amber-500/20 ${sizeClasses[size]}`}
    >
      <IconComponent className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      <span>{levelInfo.level}-Daraja</span>
      {showTitle && <span className="opacity-90 font-medium">({levelInfo.title})</span>}
    </div>
  );
}
