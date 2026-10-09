'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Trophy, Calendar, Award, User, BookOpen } from 'lucide-react';

export function MobileBottomBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;

  const profileHref = user ? `/profile/${encodeURIComponent(user.name || user.id)}` : '/login';

  const items = [
    { href: '/', label: 'Bosh sahifa', icon: Home },
    { href: '/game', label: 'Zakovat', icon: Trophy },
    { href: '/daily', label: 'Kunlik', icon: Calendar },
    { href: '/leaderboard', label: 'Reyting', icon: Award },
    { href: profileHref, label: user ? 'Profil' : 'Kirish', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-amber-500/20 bg-slate-950/95 backdrop-blur-xl px-2 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-amber-400 bg-amber-500/15 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
