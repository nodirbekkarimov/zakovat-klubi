'use client';

import React, { useState } from 'react';
import { Package, Sparkles, Eye } from 'lucide-react';

interface BlackBoxProps {
  itemName?: string;
  itemDescription?: string;
  isRevealed?: boolean;
}

export function BlackBox({
  itemName = 'Telefon',
  itemDescription = 'Midzaru karikaturasidagi to\'rtinchi maymun qo\'lidagi buyum',
  isRevealed = false,
}: BlackBoxProps) {
  const [open, setOpen] = useState(isRevealed);

  return (
    <div className="zakovat-card p-6 border border-[#cba672]/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#cba672]">
        <Sparkles className="w-4 h-4 text-[#cba672]" />
        <span>Zakovat "Qora Quti" (Black Box)</span>
      </div>

      <div className="relative py-6 flex flex-col items-center justify-center">
        {/* Animated Box Container */}
        <div
          className={`w-32 h-32 rounded-3xl bg-gradient-to-br from-[#1e1912] to-[#0f1418] border-2 border-[#cba672] flex flex-col items-center justify-center shadow-2xl transition-all duration-700 cursor-pointer ${
            open ? 'scale-105 border-white bg-[#cba672]/20' : 'hover:scale-105'
          }`}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <div className="space-y-1 animate-in zoom-in-50 duration-500 text-center p-2">
              <span className="text-3xl">🎁</span>
              <span className="font-extrabold text-sm text-white block">{itemName}</span>
            </div>
          ) : (
            <div className="space-y-2 text-center">
              <Package className="w-12 h-12 text-[#cba672] animate-bounce mx-auto" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 block">
                Qutini Ochish
              </span>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="p-3 rounded-xl bg-[#1e1912] border border-[#cba672]/30 text-xs text-slate-300 animate-in fade-in duration-300">
          <span className="font-bold text-[#cba672] block">Quti Ichidagi Buyum: {itemName}</span>
          <span className="text-[11px] text-slate-400 block pt-1">{itemDescription}</span>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="zakovat-btn-outline text-xs py-2 px-6 flex items-center gap-2 mx-auto"
      >
        <Eye className="w-4 h-4" />
        <span>{open ? 'Qutini Yopish' : 'Qora Qutini Ochish'}</span>
      </button>
    </div>
  );
}
