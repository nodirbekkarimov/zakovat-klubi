'use client';

import React, { useEffect, useState } from 'react';
import { Award, Flame, Loader2, Globe } from 'lucide-react';
import { LevelBadge } from '@/components/shared/LevelBadge';

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  xp: number;
  level: number;
  levelTitle: string;
  streak: number;
  correctAnswers: number;
  accuracy: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState('ALL');

  const regions = [
    { key: 'ALL', label: 'Barcha Hududlar' },
    { key: 'TOSHKENT', label: 'Toshkent' },
    { key: 'SAMARQAND', label: 'Samarqand' },
    { key: 'BUXORO', label: 'Buxoro' },
    { key: 'FARGONA', label: 'Farg\'ona Vadiysi' },
  ];

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (data.success) {
          setUsers(data.leaderboard);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-[#cba672] text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Buxgolts Reytingi va Jamoalar Standings</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Zakovat Klubi <span className="gold-text">Reyting Jadvali</span>
        </h1>
        <p className="text-sm text-slate-400">Rasmiy Buxgolts koeffitsienti va to'plangan XP bo'yicha reyting</p>
      </div>

      {/* Regional Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {regions.map((reg) => (
          <button
            key={reg.key}
            onClick={() => setActiveRegion(reg.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeRegion === reg.key
                ? 'zakovat-btn-primary py-2 px-4'
                : 'zakovat-btn-outline py-2 px-4 opacity-80'
            }`}
          >
            {reg.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#cba672] animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Peshqadamlar ro'yxati yuklanmoqda...</p>
        </div>
      ) : (
        <div className="zakovat-card p-6 border border-[#cba672]/30 shadow-2xl space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase font-extrabold gold-text tracking-wider">
                  <th className="py-4 px-4">O'rin</th>
                  <th className="py-4 px-4">Bilimdon / Jamoa</th>
                  <th className="py-4 px-4">Daraja & Unvon</th>
                  <th className="py-4 px-4 text-center">Seriya</th>
                  <th className="py-4 px-4 text-center">Buxgolts / Aniqlik</th>
                  <th className="py-4 px-4 text-right">Jami XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {users.map((u) => {
                  let rankBadge = <span className="font-mono font-bold text-slate-400">#{u.rank}</span>;
                  if (u.rank === 1)
                    rankBadge = (
                      <div className="w-8 h-8 rounded-full bg-[#cba672] text-slate-950 font-black flex items-center justify-center shadow-lg">
                        1
                      </div>
                    );
                  if (u.rank === 2)
                    rankBadge = (
                      <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black flex items-center justify-center shadow-lg">
                        2
                      </div>
                    );
                  if (u.rank === 3)
                    rankBadge = (
                      <div className="w-8 h-8 rounded-full bg-amber-800 text-amber-100 font-black flex items-center justify-center shadow-lg">
                        3
                      </div>
                    );

                  return (
                    <tr key={u.id} className="hover:bg-[#1e1912]/50 transition-colors">
                      <td className="py-4 px-4">{rankBadge}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#cba672] text-slate-950 flex items-center justify-center font-black text-sm">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{u.name}</span>
                            <span className="text-xs text-slate-400">{u.correctAnswers} to'g'ri javob</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <LevelBadge xp={u.xp} size="sm" />
                      </td>
                      <td className="py-4 px-4 text-center font-bold gold-text">
                        <span className="inline-flex items-center gap-1">
                          <Flame className="w-4 h-4 fill-[#cba672]" /> {u.streak}d
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-300">
                        {u.accuracy}%
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-black gold-text text-base">
                        {u.xp.toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
