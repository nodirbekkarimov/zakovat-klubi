'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Trophy,
  Users,
  BookOpen,
  Calendar,
  Sparkles,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Flame,
  Globe,
  Mic,
  PlayCircle,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Bosh sahifa' },
    { href: '/duel', label: '1v1 Duel' },
    { href: '/game/live', label: 'Jonli Arena' },
    { href: '/teams', label: 'Jamoalar & Kapitanlar' },
    { href: '/leaderboard', label: 'Peshqadamlar' },
    { href: '/practice', label: 'Savollar Bazasi' },
  ];

  return (
    <header className="sticky top-0 z-50 header-zakovat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - zakovatklubi.uz style */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-[#cba672] flex items-center justify-center text-slate-950 font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
            Z
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white">
              ZAKOVAT <span className="gold-text">KLUBI</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-medium tracking-widest -mt-1">
              Rasmiy intellektual platforma
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'gold-text font-bold border-b-2 border-[#cba672] pb-1'
                    : 'text-slate-300 hover:text-[#cba672]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {user && user.role === 'ADMIN' && (
            <Link
              href="/host"
              className="flex items-center gap-1.5 text-sm font-bold text-amber-300 hover:text-amber-200"
            >
              <Mic className="w-4 h-4 text-[#cba672]" />
              <span>Boshlovchi Paneli</span>
            </Link>
          )}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-xs font-bold text-slate-300">
            <Globe className="w-3.5 h-3.5 text-[#cba672]" />
            <span>UZ</span>
          </div>

          {status === 'authenticated' && user ? (
            <div className="flex items-center gap-3">
              {/* Streak Counter */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-[#cba672] font-bold text-xs">
                <Flame className="w-3.5 h-3.5 fill-[#cba672]" />
                <span>{user.streak || 0} kun</span>
              </div>

              {/* User Profile Pill Button */}
              <div className="relative group">
                <Link
                  href={`/profile/${encodeURIComponent(user.name || user.id)}`}
                  className="zakovat-btn-primary flex items-center gap-2 text-xs py-2 px-4"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Link>

                <div className="absolute right-0 mt-2 w-48 py-2 bg-[#161f24] border border-[#cba672]/30 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    href={`/profile/${encodeURIComponent(user.name || user.id)}`}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-200 hover:bg-[#cba672]/10 hover:text-[#cba672]"
                  >
                    <User className="w-4 h-4" />
                    <span>Mening Profilim</span>
                  </Link>

                  {user.role === 'ADMIN' && (
                    <>
                      <Link
                        href="/host"
                        className="flex items-center gap-2 px-4 py-2 text-xs gold-text font-bold hover:bg-[#cba672]/10"
                      >
                        <Mic className="w-4 h-4 text-[#cba672]" />
                        <span>Boshlovchi Paneli</span>
                      </Link>
                      <Link
                        href="/admin/generator"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-amber-300 font-bold hover:bg-[#cba672]/10"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>AI Generator</span>
                      </Link>
                    </>
                  )}

                  <hr className="my-1 border-slate-800" />

                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Chiqish</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="zakovat-btn-outline text-xs py-2 px-5">
                KIRISH
              </Link>
              <Link href="/register" className="zakovat-btn-primary text-xs py-2 px-5">
                A'ZO BO'LISH
              </Link>
            </div>
          )}

          {/* Mobile Drawer Trigger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#1e1912] border border-[#cba672]/30 text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Modal */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#cba672]/20 bg-[#0f1418] p-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-[#161f24] hover:text-[#cba672]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
