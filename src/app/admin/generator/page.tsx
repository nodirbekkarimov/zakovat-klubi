'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Brain, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminGeneratorPage() {
  const router = useRouter();

  const [topic, setTopic] = useState('Mantiqiy turnir savollari va tarixdagi kashfiyotlar');
  const [categorySlug, setCategorySlug] = useState('tarix');
  const [difficulty, setDifficulty] = useState('HARD');
  const [count, setCount] = useState(3);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, categorySlug, difficulty, count }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        setGeneratedQuestions(data.questions);
      } else {
        setError(data.error || 'Generatsiya qilishda xatolik');
      }
    } catch (err: any) {
      setError('Kutilmagan xatolik yuz berdi');
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Zakovat Savol Generator</span>
          </div>
          <h1 className="text-3xl font-black text-slate-100 mt-1">Zakovat Savollarini Generatsiya Qilish</h1>
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

      <form onSubmit={handleGenerate} className="glass-card rounded-3xl p-8 border border-amber-500/20 space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">Mavzu yoki Namuna Matni</label>
          <textarea
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Masalan: O'zbekistondagi tarixiy joylar, adabiy jumboqlar, koinot kashfiyotlari..."
            className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Kategoriya</label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="tarix">Tarix va Madaniyat</option>
              <option value="fan-texnika">Ilm-fan va Texnologiya</option>
              <option value="adabiyot">Adabiyot va San'at</option>
              <option value="mantiq">Mantiq va Topishmoqlar</option>
              <option value="geografiya">Geografiya va Olam</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Qiyinchilik</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="EASY">EASY (Oson)</option>
              <option value="MEDIUM">MEDIUM (O'rtacha)</option>
              <option value="HARD">HARD (Qiyin Turnir)</option>
              <option value="EXPERT">EXPERT (Ekspert)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Savollar Soni</label>
            <input
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="gold-button px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
            <span>{loading ? 'Generatsiya qilinmoqda...' : 'Savollarni Generatsiya Qilish'}</span>
          </button>
        </div>
      </form>

      {/* Display Generated Questions Preview */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-100">Yaratilgan Savollar Preview:</h3>
          <div className="space-y-4">
            {generatedQuestions.map((q, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-amber-500/30 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase">
                  Savol #{idx + 1} • {q.difficulty}
                </span>
                <p className="text-base text-slate-100 leading-relaxed font-semibold">"{q.text}"</p>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm space-y-1">
                  <span className="text-xs font-bold text-emerald-400 block">Javob: {q.answer}</span>
                  <span className="text-xs text-slate-400 block">Izoh: {q.explanation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
