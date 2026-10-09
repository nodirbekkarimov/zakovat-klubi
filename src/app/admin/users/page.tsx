'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  ArrowLeft,
  CheckCircle2,
  Search,
  Loader2,
  Trophy,
  Flame,
  Ban,
  KeyRound,
  Edit3,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password reset modal state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newXPInput, setNewXPInput] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionMsg('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CHANGE_ROLE', userId, newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchUsers();
      }
    } catch (err) {}
  };

  const handleToggleBan = async (userId: string) => {
    setActionMsg('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_BAN', userId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchUsers();
      }
    } catch (err) {}
  };

  const handleAdjustXP = async (userId: string) => {
    const val = prompt("Foydalanuvchi uchun yangi XP miqdorini kiriting:", "1000");
    if (!val) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ADJUST_XP', userId, newXP: val }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchUsers();
      }
    } catch (e) {}
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;
    setErrorMsg('');
    setActionMsg('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESET_PASSWORD',
          userId: selectedUser.id,
          newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        setSelectedUser(null);
        setNewPassword('');
      } else {
        setErrorMsg(data.error);
      }
    } catch (e) {
      setErrorMsg('Parolni yangilashda xatolik yuz berdi');
    }
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#cba672]/20 pb-6">
        <Link href="/admin" className="text-xs font-bold text-slate-400 hover:text-[#cba672] flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Admin Panelga Qaytish
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1e1912] border border-[#cba672]/40 text-[#cba672] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">Bilimdonlar Nazorati va Hakamlar</h1>
            <p className="text-xs text-slate-400 mt-0.5">Foydalanuvchilarni bloklash (Ban), ballarini sozlash, parolini yangilash va rollarni boshqarish</p>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ism yoki email bo'yicha qidirish..."
          className="zakovat-input pl-11 text-xs"
        />
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-[#cba672] animate-spin mx-auto" />
        </div>
      ) : (
        <div className="zakovat-card p-6 border border-[#cba672]/30 overflow-x-auto shadow-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 uppercase font-black gold-text tracking-wider">
                <th className="py-3 px-3">Bilimdon</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3 text-center">Daraja & XP</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Rol</th>
                <th className="py-3 px-3 text-right">Nazorat Harakatlari</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((u) => (
                <tr key={u.id} className={`hover:bg-[#1e1912]/40 transition-colors ${u.isBanned ? 'opacity-60 bg-rose-950/20' : ''}`}>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center text-xs ${u.isBanned ? 'bg-rose-500 text-white' : 'bg-[#cba672] text-slate-950'}`}>
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm block">{u.name}</span>
                        {u.isBanned && <span className="text-[10px] text-rose-400 font-bold">BLOKLANGAN</span>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">{u.email}</td>
                  <td className="py-3.5 px-3 text-center font-bold">
                    <span className="text-white">Lvl {u.level}</span> • <span className="gold-text">{u.xp} XP</span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        u.isBanned
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {u.isBanned ? 'BLOKLANGAN' : 'FAOL'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-[#1e1912] border border-[#cba672]/30 rounded-xl px-2 py-1 text-[11px] text-[#cba672] font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="USER">Foydalanuvchi</option>
                      <option value="REFEREE">Hakam</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* XP Adjust */}
                      <button
                        onClick={() => handleAdjustXP(u.id)}
                        title="XP va Darajani o'zgartirish"
                        className="p-1.5 rounded-lg bg-[#1e1912] border border-slate-700 hover:border-[#cba672] text-slate-300"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Password Reset */}
                      <button
                        onClick={() => setSelectedUser(u)}
                        title="Parolni yangilash"
                        className="p-1.5 rounded-lg bg-[#1e1912] border border-slate-700 hover:border-[#cba672] text-slate-300"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>

                      {/* Ban / Unban */}
                      <button
                        onClick={() => handleToggleBan(u.id)}
                        title={u.isBanned ? "Blokdan chiqarish" : "Bloklash (Ban)"}
                        className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                          u.isBanned
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
                        }`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{u.isBanned ? 'Unban' : 'Ban'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Password Reset Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="zakovat-card p-6 border-2 border-[#cba672] max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#cba672]" />
              <span>Parolni Yangilash</span>
            </h3>
            <p className="text-xs text-slate-300">
              Foydalanuvchi: <span className="font-bold text-white">{selectedUser.name}</span> ({selectedUser.email})
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Yangi Maxfiy Parol</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Kamida 6 belgi..."
                  className="zakovat-input text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="zakovat-btn-outline text-xs py-2 px-4"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="zakovat-btn-primary text-xs py-2 px-5 font-bold"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
