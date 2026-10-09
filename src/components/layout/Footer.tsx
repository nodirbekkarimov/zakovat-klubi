'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0b0e11] border-t border-[#cba672]/20 py-12 mt-20 pb-24 md:pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#cba672] flex items-center justify-center text-slate-950 font-black text-lg">
                Z
              </div>
              <span className="font-extrabold text-lg text-white">
                ZAKOVAT <span className="gold-text">KLUBI</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              O'zbekistondagi eng yirik intellektual o'yinlar harakati va bilimlarni rivojlantirish nodavlat nodavlat tashkiloti.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm gold-text">Bo'limlar</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white">Bosh sahifa</Link></li>
              <li><Link href="/game" className="hover:text-white">Turnirlar & Ligalar</Link></li>
              <li><Link href="/leaderboard" className="hover:text-white">Jamoalar va Reytinglar</Link></li>
              <li><Link href="/practice" className="hover:text-white">Ochiq Savollar Bazasi</Link></li>
            </ul>
          </div>

          {/* Col 3: Regional Branches */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm gold-text">Hududiy Klublar</h4>
            <ul className="space-y-2 text-xs">
              <li>Toshkent shahri va viloyati</li>
              <li>Samarqand, Buxoro, Farg'ona</li>
              <li>Qoraqalpog'iston Respublikasi</li>
              <li>Andijon, Namangan, Qashqadaryo</li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm gold-text">Bog'lanish</h4>
            <p className="text-xs text-slate-400">
              Elektron pochta: info@zakovatklubi.uz<br />
              Manzil: Toshkent sh., Chilonzor tumani
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Zakovat Intellektual Klubi. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-4">
            <a href="https://zakovatklubi.uz" target="_blank" rel="noreferrer" className="hover:text-[#cba672]">
              zakovatklubi.uz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
