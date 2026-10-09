'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Barcha maydonlarni to\'ldirish shart');
      return;
    }

    if (password !== confirmPassword) {
      setError('Parollar bir-biriga mos kelmadi');
      return;
    }

    if (password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi shart');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
        setLoading(false);
        return;
      }

      // Auto login on successful registration
      const loginRes = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (loginRes?.error) {
        router.push('/login');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError('Tarmoq xatoligi yuz berdi. Qaytadan urinib ko\'ring.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#cba672] flex items-center justify-center text-slate-950 font-black text-2xl mx-auto shadow-2xl">
            Z
          </div>
          <h1 className="text-3xl font-black text-white">Ro'yxatdan O'tish</h1>
          <p className="text-xs text-slate-400">
            Zakovat intellektual harakatining rasmiy bilimdoniga aylaning!
          </p>
        </div>

        {/* Card Form */}
        <div className="zakovat-card p-6 sm:p-8 border border-[#cba672]/30 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Ism va Familiya</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alisher Navoiy"
                  className="zakovat-input pl-11 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Elektron Pochta (Email)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@misol.uz"
                  className="zakovat-input pl-11 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Maxfiy Parol (kamida 6 belgi)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="zakovat-input pl-11 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Parolni Qayta Kiriting</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="zakovat-input pl-11 text-xs"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="zakovat-btn-primary w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-transform"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>A'ZO BO'LISH VA BOSHLASH</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Profilingiz bormi?{' '}
              <Link href="/login" className="gold-text font-bold hover:underline">
                Tizimga kiring
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
