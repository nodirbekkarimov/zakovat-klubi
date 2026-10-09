'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Layers, Play, Sliders, Search } from 'lucide-react';

export default function PracticePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [count, setCount] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { name: 'Barcha Kategoriyalar', slug: '', icon: '🌟' },
    { name: 'Tarix va Madaniyat', slug: 'tarix', icon: '🏛️' },
    { name: 'Ilm-fan va Texnologiya', slug: 'fan-texnika', icon: '🧪' },
    { name: 'Adabiyot va San\'at', slug: 'adabiyot', icon: '📚' },
    { name: 'Mantiq va Topishmoqlar', slug: 'mantiq', icon: '🧩' },
    { name: 'Geografiya va Olam', slug: 'geografiya', icon: '🌍' },
  ];

  const gameUrl = `/game?mode=PRACTICE${selectedCategory ? `&category=${selectedCategory}` : ''}${
    selectedDifficulty ? `&difficulty=${selectedDifficulty}` : ''
  }&count=${count}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-[#cba672] text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Ochiq Savollar Bazasi & Mashg'ulot</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Zakovat <span className="gold-text">Ochiq Savollar Bazasi</span>
        </h1>
        <p className="text-sm text-slate-400">
          Kategoriya va qiyinchilik bo'yicha saralab mashg'ulot o'tkazing va bilimingizni oshiring
        </p>
      </div>

      <div className="zakovat-card p-6 sm:p-8 border border-[#cba672]/30 space-y-8 shadow-2xl">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#cba672] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Savollar bazasidan izlash (masalan: Amir Temur, Mario, Sezar)..."
            className="zakovat-input pl-12"
          />
        </div>

        {/* Category Picker */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#cba672]" />
            1. Kategoriya Tanlang:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-[#1e1912] border-[#cba672] text-[#cba672]'
                    : 'bg-[#12181d] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-sm font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4 flex justify-center">
          <Link href={gameUrl} className="zakovat-btn-primary py-3.5 px-10 flex items-center gap-3">
            <Play className="w-5 h-5 fill-current" />
            <span>MASHG'ULOTNI BOSHLASH</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
