'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  HelpCircle,
  Users,
  Trophy,
  Plus,
  BookOpen,
  Sparkles,
  Mic,
  Scale,
  Calendar,
  UserCheck,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 3,
    totalQuestions: 30,
    totalGames: 145,
    avgAccuracy: 84,
    pendingAppeals: 2,
    activeTournaments: 3,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#cba672]/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-[#cba672] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Zakovat Boshqaruv Markazi (CMS)</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-2">Zakovat Klubi Admin Paneli</h1>
          <p className="text-xs text-slate-400 mt-1">Platformaning savollar bazasi, jonli turnirlari, hakamlik apellatsiyalari va bilimdonlar boshqaruvi</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/generator" className="zakovat-btn-outline text-xs py-2.5 px-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#cba672]" />
            <span>AI GENERATOR</span>
          </Link>
          <Link href="/admin/questions/new" className="zakovat-btn-primary text-xs py-2.5 px-5 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>YANGI SAVOL</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="zakovat-card p-5 border border-[#cba672]/30 space-y-1">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-2xl font-black text-white block">{stats.totalQuestions} ta</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Faol Savollar</span>
        </div>

        <div className="zakovat-card p-5 border border-[#cba672]/30 space-y-1">
          <Calendar className="w-5 h-5 text-[#cba672]" />
          <span className="text-2xl font-black text-white block">{stats.activeTournaments} ta</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Rejalashtirilgan Turnirlar</span>
        </div>

        <div className="zakovat-card p-5 border border-[#cba672]/30 space-y-1">
          <Scale className="w-5 h-5 text-amber-400" />
          <span className="text-2xl font-black text-white block">{stats.pendingAppeals} ta</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Kutilayotgan Apellatsiyalar</span>
        </div>

        <div className="zakovat-card p-5 border border-[#cba672]/30 space-y-1">
          <Users className="w-5 h-5 text-cyan-400" />
          <span className="text-2xl font-black text-white block">{stats.totalUsers} ta</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase">A'zo Bilimdonlar</span>
        </div>
      </div>

      {/* Complete Admin Modules Suite */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Boshqaruv Modullari (CMS Suite)</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1: Questions CMS */}
          <Link href="/admin/questions" className="group">
            <div className="zakovat-card p-6 border border-[#cba672]/20 hover:border-[#cba672]/60 transition-all space-y-3 h-full">
              <BookOpen className="w-8 h-8 text-[#cba672]" />
              <h3 className="text-lg font-bold text-white group-hover:text-[#cba672] transition-colors">
                Savollar Boshqaruvi
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Barcha 90+ turnir savollarini ko'rish, qidirish, tahrirlash, o'chirish va yangi paketlar kiritish.
              </p>
            </div>
          </Link>

          {/* Module 2: Tournaments Organizer */}
          <Link href="/admin/tournaments" className="group">
            <div className="zakovat-card p-6 border border-[#cba672]/20 hover:border-[#cba672]/60 transition-all space-y-3 h-full">
              <Trophy className="w-8 h-8 text-[#cba672]" />
              <h3 className="text-lg font-bold text-white group-hover:text-[#cba672] transition-colors">
                Turnirlar Tashkilotchisi
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yangi rasmiy turnirlar e'lon qilish, sana belgilash, savol raundlarini biriktirish va mukofot fondi.
              </p>
            </div>
          </Link>

          {/* Module 3: Appeals Desk */}
          <Link href="/admin/appeals" className="group">
            <div className="zakovat-card p-6 border border-[#cba672]/20 hover:border-[#cba672]/60 transition-all space-y-3 h-full">
              <Scale className="w-8 h-8 text-[#cba672]" />
              <h3 className="text-lg font-bold text-white group-hover:text-[#cba672] transition-colors">
                Apellatsiyalar va E'tirozlar Stoli
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                O'yinchilar kiritgan e'tirozlarni tahlil qilish, ballarni tiklash (+100 XP) yoki rad etish.
              </p>
            </div>
          </Link>

          {/* Module 4: Users & Referees */}
          <Link href="/admin/users" className="group">
            <div className="zakovat-card p-6 border border-[#cba672]/20 hover:border-[#cba672]/60 transition-all space-y-3 h-full">
              <UserCheck className="w-8 h-8 text-[#cba672]" />
              <h3 className="text-lg font-bold text-white group-hover:text-[#cba672] transition-colors">
                Bilimdonlar & Hakamlar
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Foydalanuvchilar ro'yxati, rollari (Foydalanuvchi / Hakam / Admin) va shaxsiy statistikalar.
              </p>
            </div>
          </Link>

          {/* Module 5: AI Generator */}
          <Link href="/admin/generator" className="group">
            <div className="zakovat-card p-6 border border-[#cba672]/20 hover:border-[#cba672]/60 transition-all space-y-3 h-full">
              <Sparkles className="w-8 h-8 text-[#cba672]" />
              <h3 className="text-lg font-bold text-white group-hover:text-[#cba672] transition-colors">
                AI Savol Generator Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ixtiyoriy mavzu yoki namuna kiritib professional darajadagi yangi Zakovat savollarini generatsiya qilish.
              </p>
            </div>
          </Link>

          {/* Module 6: Host Controller */}
          <Link href="/host" className="group">
            <div className="zakovat-card p-6 border border-[#cba672]/20 hover:border-[#cba672]/60 transition-all space-y-3 h-full">
              <Mic className="w-8 h-8 text-[#cba672]" />
              <h3 className="text-lg font-bold text-white group-hover:text-[#cba672] transition-colors">
                Boshlovchi Paneli (`/host`)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Jonli 12-savolli turnir raundlarini o'tkazish, taymerni boshqarish va Gong chalish.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
