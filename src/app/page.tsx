'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Trophy,
  Users,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  Globe,
  Zap,
} from 'lucide-react';
import { LevelBadge } from '@/components/shared/LevelBadge';

export default function HomePage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const stats = [
    { label: 'Ishtirokchilar', val: '1 000 000+', icon: Users },
    { label: 'Hududiy Klublar', val: '14 ta', icon: Globe },
    { label: 'Zakovat Jamoalari', val: '10 000+', icon: Trophy },
    { label: 'Turnir Savollari', val: '30+ Baza', icon: BookOpen },
  ];

  const leagues = [
    {
      title: 'Professional Liga (Klassik Zakovat)',
      desc: '20 ta murakkab turnir savolidan iborat rasmiy ligalar bahsi.',
      href: '/game?mode=CLASSIC',
      badge: 'Professional',
    },
    {
      title: 'Kungi Sinov (Daily Challenge)',
      desc: 'Har kungi 5 ta maxsus turnir savoli. Seriyangizni saqlang va +50% XP oling.',
      href: '/daily',
      badge: 'Har kungi',
    },
    {
      title: 'Ochiq Savollar Bazasi (Mashg\'ulot)',
      desc: 'Kategoriya va qiyinchilik bo\'yicha saralab savollarga javob bering.',
      href: '/practice',
      badge: 'Mashg\'ulot',
    },
    {
      title: 'AI Zakovat Generator Engine',
      desc: 'AI va turnir shablonlari asosida yangi zakovat savollarini tayyorlang.',
      href: '/admin/generator',
      badge: 'AI Engine',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION - zakovatklubi.uz styling */}
      <section className="relative pt-12 pb-12 overflow-hidden bg-gradient-to-b from-[#12181d] to-[#0f1418] border-b border-[#cba672]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1912] border border-[#cba672]/40 text-[#cba672] text-xs font-bold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-4 h-4 text-[#cba672]" />
            <span>O'zbekistondagi Eng Yirik Intellektual Harakat</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Bilimingizni Sinang.{' '}
            <span className="gold-text block sm:inline">Zakovat Afsonasiga</span> Aylaning.
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Haqiqiy turnir savollari banki, aqlli matniy javob baholash tizimi va AI savol generatori bilan zakovat o'yini tajribasi.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/game" className="zakovat-btn-primary flex items-center gap-2 shadow-xl">
              <Trophy className="w-5 h-5" />
              <span>TURNIRDA QATNASHISH</span>
            </Link>
            <Link href="/practice" className="zakovat-btn-outline flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>SAVOLLAR BAZASI</span>
            </Link>
          </div>
        </div>

        {/* LIVE STATS STRIP - zakovatklubi.uz style */}
        <div className="max-w-6xl mx-auto px-4 mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.label}
                className="zakovat-card p-5 text-center space-y-2 border border-[#cba672]/20"
              >
                <Icon className="w-6 h-6 text-[#cba672] mx-auto" />
                <span className="text-xl sm:text-2xl font-black text-white block">{st.val}</span>
                <span className="text-xs text-slate-400 font-medium block">{st.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* USER DASHBOARD SUMMARY (if logged in) */}
      {user && (
        <section className="max-w-6xl mx-auto px-4">
          <div className="zakovat-card p-6 border border-[#cba672]/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#cba672] text-slate-950 flex items-center justify-center font-black text-2xl">
                {user.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{user.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <LevelBadge xp={user.xp || 0} size="sm" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-medium">Seriya</span>
                <span className="text-lg font-extrabold text-[#cba672] flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-[#cba672]" /> {user.streak || 0} kun
                </span>
              </div>
              <Link
                href={`/profile/${encodeURIComponent(user.name)}`}
                className="zakovat-btn-outline text-xs py-2 px-5"
              >
                PROFIL
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* LEAGUES & GAME MODES SECTION */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Zakovat Ligalari va Rejimlar
          </h2>
          <p className="text-sm text-slate-400">O'zingizga mos bo'lgan intellektual bosqichni tanlang</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leagues.map((lg) => (
            <Link key={lg.title} href={lg.href} className="group">
              <div className="zakovat-card p-6 space-y-4 relative overflow-hidden flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                  <span className="px-3.5 py-1 rounded-full bg-[#1e1912] border border-[#cba672]/40 text-[#cba672] text-xs font-bold">
                    {lg.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#cba672] transition-colors">
                    {lg.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{lg.desc}</p>
                </div>

                <div className="flex items-center text-xs font-bold text-[#cba672] gap-1 pt-2 group-hover:translate-x-1 transition-transform">
                  <span>Qatnashish</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
