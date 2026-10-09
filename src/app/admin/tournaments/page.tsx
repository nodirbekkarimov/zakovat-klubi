'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Plus,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [region, setRegion] = useState('Toshkent shahri');
  const [prizePool, setPrizePool] = useState('10 000 000 so\'m');
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/admin/tournaments');
      const data = await res.json();
      if (data.success) {
        setTournaments(data.tournaments);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;

    setCreating(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, region, prizePool }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(data.message);
        setTitle('');
        setDate('');
        fetchTournaments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#cba672]/20 pb-6">
        <div>
          <Link href="/admin" className="text-xs font-bold text-slate-400 hover:text-[#cba672] flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Admin Panelga Qaytish
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Rasmiy Turnirlar Tashkilotchisi</h1>
          <p className="text-xs text-slate-400 mt-1">Yangi turnirlarni jadvalga kiritish, savol paketlarini biriktirish va ro'yxatni boshqarish</p>
        </div>
      </div>

      {/* Create Tournament Form */}
      <div className="zakovat-card p-6 border border-[#cba672]/30 space-y-4 max-w-2xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#cba672]" />
          Yangi Turnir E'lon Qilish
        </h3>

        {msg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleCreateTournament} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Turnir Nomi</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Oliy Liga 2026 — 2-Tur"
              className="zakovat-input text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">O'tkazilish Vaqti</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="2026-10-25 18:00"
                className="zakovat-input text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Hudud / Joy</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Toshkent shahri"
                className="zakovat-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Mukofot Jamg'armasi</label>
            <input
              type="text"
              value={prizePool}
              onChange={(e) => setPrizePool(e.target.value)}
              placeholder="15 000 000 so'm"
              className="zakovat-input text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="zakovat-btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
            <span>Turnirni E'lon Qilish</span>
          </button>
        </form>
      </div>

      {/* Existing Tournaments Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Rejalashtirilgan Turnirlar ({tournaments.length})</h3>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-[#cba672] animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tournaments.map((trn) => (
              <div key={trn.id} className="zakovat-card p-6 border border-[#cba672]/30 space-y-4">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-[#cba672] font-mono text-[10px] font-bold">
                    {trn.status}
                  </span>
                  <span className="text-xs font-black text-emerald-400">{trn.prizePool}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">{trn.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#cba672]" /> {trn.date}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#cba672]" /> {trn.region}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#12181d] text-xs flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#cba672]" /> Jamoalar:
                  </span>
                  <span className="font-bold text-white">{trn.registeredTeamsCount} ta jamoa</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
