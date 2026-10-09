'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, BookOpen, Edit, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface AdminQuestion {
  id: string;
  text: string;
  answer: string;
  difficulty: string;
  category: { name: string };
  published: boolean;
  createdAt: string;
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(`/api/admin/questions?q=${encodeURIComponent(search)}`);
        const data = await res.json();
        if (data.success) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100">Savollar Banki</h1>
          <p className="text-xs text-slate-400">Jami {questions.length} ta savol ro'yxati</p>
        </div>

        <Link
          href="/admin/questions/new"
          className="gold-button px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Savol</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Savol matni bo'yicha qidirish..."
          className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Questions Table */}
      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <span className="text-xs text-slate-400">Yuklanmoqda...</span>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                  <th className="py-3 px-4">Savol Matni</th>
                  <th className="py-3 px-4">Javob</th>
                  <th className="py-3 px-4">Kategoriya</th>
                  <th className="py-3 px-4">Qiyinchilik</th>
                  <th className="py-3 px-4 text-center">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-900/50">
                    <td className="py-4 px-4 font-semibold text-slate-100 max-w-xs truncate">
                      {q.text}
                    </td>
                    <td className="py-4 px-4 font-bold text-amber-400">{q.answer}</td>
                    <td className="py-4 px-4 text-xs text-slate-300">{q.category?.name}</td>
                    <td className="py-4 px-4 text-xs font-bold uppercase text-slate-400">
                      {q.difficulty}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                        Chop etilgan
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
