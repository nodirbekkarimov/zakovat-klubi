'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Target, Award, Sparkles, Loader2 } from 'lucide-react';
import { LevelBadge } from '@/components/shared/LevelBadge';
import { XPBar } from '@/components/shared/XPBar';

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const username = params.username;

  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/${encodeURIComponent(username)}`);
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#cba672] animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Profil ma'lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 space-y-4">
        <h2 className="text-2xl font-bold text-white">Foydalanuvchi Topilmadi</h2>
        <p className="text-sm text-slate-400">Izlanayotgan profil tizimda mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Profile Header Banner */}
      <div className="zakovat-card p-8 border border-[#cba672]/30 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-[#cba672] text-slate-950 flex items-center justify-center font-black text-4xl shadow-2xl">
            {profile.name.charAt(0)}
          </div>

          <div className="space-y-2 flex-1">
            <h1 className="text-3xl font-black text-white">{profile.name}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <LevelBadge xp={profile.xp} size="md" />
              <span className="px-3 py-1 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-[#cba672] font-bold text-xs flex items-center gap-1">
                <Flame className="w-4 h-4 fill-[#cba672]" /> {profile.streak} kunlik seriya
              </span>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              A'zo bo'lingan sana: {new Date(profile.createdAt).toLocaleDateString('uz-UZ')}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <XPBar xp={profile.xp} />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="zakovat-card p-5 text-center space-y-1">
          <Trophy className="w-5 h-5 text-[#cba672] mx-auto" />
          <span className="text-xl font-black text-white block">{profile.totalGames}</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase">O'yinlar</span>
        </div>

        <div className="glass-card rounded-2xl p-5 text-center space-y-1 border border-slate-800">
          <Target className="w-5 h-5 text-emerald-400 mx-auto" />
          <span className="text-xl font-black text-white block">{profile.correctAnswers}</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase">To'g'ri Javoblar</span>
        </div>

        <div className="glass-card rounded-2xl p-5 text-center space-y-1 border border-slate-800">
          <Sparkles className="w-5 h-5 text-cyan-400 mx-auto" />
          <span className="text-xl font-black text-white block">{profile.accuracy}%</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Aniqlik Rate</span>
        </div>

        <div className="glass-card rounded-2xl p-5 text-center space-y-1 border border-slate-800">
          <Flame className="w-5 h-5 text-rose-400 mx-auto" />
          <span className="text-xl font-black text-white block">{profile.maxStreak} kun</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Maks Seriya</span>
        </div>
      </div>
    </div>
  );
}
