'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function NewQuestionPage() {
  const router = useRouter();

  const [text, setText] = useState('');
  const [answer, setAnswer] = useState('');
  const [acceptableAnswers, setAcceptableAnswers] = useState('');
  const [keywords, setKeywords] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [categoryId, setCategoryId] = useState('');
  const [hints, setHints] = useState('');
  const [explanation, setExplanation] = useState('');
  const [interestingFact, setInterestingFact] = useState('');
  const [source, setSource] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const acceptableArr = acceptableAnswers.split(',').map((s) => s.trim()).filter(Boolean);
      const keywordsArr = keywords.split(',').map((s) => s.trim()).filter(Boolean);
      const hintsArr = hints.split('\n').map((s) => s.trim()).filter(Boolean);

      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          answer,
          acceptableAnswers: acceptableArr,
          keywords: keywordsArr,
          difficulty,
          categoryId: categoryId || undefined,
          hints: hintsArr,
          explanation,
          interestingFact,
          source,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Savol muvaffaqiyatli saqlandi!');
        setTimeout(() => {
          router.push('/admin/questions');
        }, 1200);
      } else {
        setError(data.error || 'Saqlashda xatolik');
      }
    } catch (err: any) {
      setError('Kutilmagan xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-100">Yangi Savol Yaratish</h1>
          <p className="text-xs text-slate-400">Intellektual savol bankiga yangi savol qo'shish</p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 border border-amber-500/20 space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Savol Matni *</label>
          <textarea
            required
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Savol matnini to'liq kiriting..."
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Asosiy To'g'ri Javob *</label>
            <input
              type="text"
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Masalan: Alisher Navoiy"
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Qiyinchilik Darajasi</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="EASY">EASY (Oson)</option>
              <option value="MEDIUM">MEDIUM (O'rtacha)</option>
              <option value="HARD">HARD (Qiyin)</option>
              <option value="EXPERT">EXPERT (Ekspert)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Muqobil Qabul Qilinuvchi Javoblar (vergul bilan)</label>
          <input
            type="text"
            value={acceptableAnswers}
            onChange={(e) => setAcceptableAnswers(e.target.value)}
            placeholder="Navoiy, Mir Alisher, Alisher Navoiy shahri"
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Kalit So'zlar (vergul bilan)</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="navoiy, alisher"
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Ishoralar (har bir yangi qatorda bittadan)</label>
          <textarea
            rows={2}
            value={hints}
            onChange={(e) => setHints(e.target.value)}
            placeholder="1-ishora: 1441-yilda tug'ilgan.&#10;2-ishora: Xamsa muallifi."
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Izoh va Sharh</label>
          <textarea
            rows={2}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="To'liq ilmiy yoki tarixiy sharh..."
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Qiziqarli Fakt (Ixtiyoriy)</label>
          <input
            type="text"
            value={interestingFact}
            onChange={(e) => setInterestingFact(e.target.value)}
            placeholder="Ushbu mavzuga oid qiziqarli fakt..."
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="gold-button px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saqlanmoqda...' : 'Savolni Saqlash'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
