'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  categoryName: string;
  difficulty: string;
  questionText: string;
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  categoryName,
  difficulty,
  questionText,
}: QuestionCardProps) {
  return (
    <div className="zakovat-card p-6 sm:p-8 space-y-6 relative border border-[#cba672]/30 shadow-2xl">
      {/* Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-[#cba672] font-bold text-xs">
            <BookOpen className="w-3.5 h-3.5" />
            {categoryName}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold uppercase text-slate-300">
            {difficulty}
          </span>
        </div>

        <div className="text-xs font-bold text-[#cba672] tracking-wide bg-[#1e1912] px-3.5 py-1 rounded-full border border-[#cba672]/30">
          SAVOL {questionNumber} / {totalQuestions}
        </div>
      </div>

      {/* Main Question Body */}
      <div className="py-2">
        <h2 className="text-lg sm:text-2xl font-bold text-white leading-relaxed sm:leading-loose tracking-wide">
          "{questionText}"
        </h2>
      </div>
    </div>
  );
}
