'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Scale,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  User,
  BookOpen,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function AdminAppealsPage() {
  const [appeals, setAppeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchAppeals = async () => {
    try {
      const res = await fetch('/api/admin/appeals');
      const data = await res.json();
      if (data.success) {
        setAppeals(data.appeals);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppeals();
  }, []);

  const handleResolveAppeal = async (appealId: string, verdict: 'ACCEPTED' | 'REJECTED') => {
    setActionMsg('');
    try {
      const res = await fetch('/api/admin/appeals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appealId, verdict }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchAppeals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#cba672]/20 pb-6">
        <Link href="/admin" className="text-xs font-bold text-slate-400 hover:text-[#cba672] flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Admin Panelga Qaytish
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1e1912] border border-[#cba672]/40 text-[#cba672] flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">Hakamlar Hay'ati: Apellatsiyalar Stoli</h1>
            <p className="text-xs text-slate-400 mt-0.5">O'yinchilar tomonidan kiritilgan e'tirozlarni tahlil qilish va adolatli xulosa chiqarish</p>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Appeals List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-[#cba672] animate-spin mx-auto" />
          </div>
        ) : appeals.length === 0 ? (
          <div className="zakovat-card p-8 text-center text-slate-400 text-sm">
            Hozircha ko'rib chiqilmagan yangi e'tirozlar mavjud emas.
          </div>
        ) : (
          appeals.map((apl) => (
            <div key={apl.id} className="zakovat-card p-6 border border-[#cba672]/30 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#cba672]" />
                  <span className="font-bold text-white text-sm">{apl.user}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({apl.createdAt})</span>
                </div>

                <span
                  className={`px-3 py-0.5 rounded-full font-mono text-[10px] font-extrabold ${
                    apl.status === 'ACCEPTED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : apl.status === 'REJECTED'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {apl.status}
                </span>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400">Savol:</span>
                <p className="text-sm font-semibold text-slate-200">"{apl.questionText}"</p>
              </div>

              {/* Answers Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-[#1e1912] border border-[#cba672]/20">
                  <span className="text-[10px] uppercase font-bold text-[#cba672] block">Rasmiy To'g'ri Javob:</span>
                  <span className="font-black text-white text-sm">{apl.officialAnswer}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#12181d] border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Foydalanuvchi Javobi:</span>
                  <span className="font-black text-white text-sm">{apl.userAnswer}</span>
                </div>
              </div>

              {/* User Reason */}
              <div className="p-3.5 rounded-2xl bg-[#12181d] border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-[#cba672] block mb-1">Bilimdonning E'tiroz Sababi:</span>
                "{apl.userReason}"
              </div>

              {/* Action Buttons (if pending) */}
              {apl.status === 'PENDING' && (
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleResolveAppeal(apl.id, 'REJECTED')}
                    className="zakovat-btn-outline text-xs py-2 px-5 text-rose-400 border-rose-500/40 hover:bg-rose-500/10 flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rad Etish</span>
                  </button>
                  <button
                    onClick={() => handleResolveAppeal(apl.id, 'ACCEPTED')}
                    className="zakovat-btn-primary text-xs py-2 px-6 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Qabul Qilish (+100 XP)</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
