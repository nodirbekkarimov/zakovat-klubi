'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Users, Shield, Plus, Trophy, Award, MapPin, CheckCircle2, Loader2 } from 'lucide-react';

export default function TeamsPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState('');
  const [region, setRegion] = useState('Toshkent');
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();
      if (data.success) {
        setTeams(data.teams);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setCreating(true);
    setMsg('');

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName, region }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(data.message);
        setTeamName('');
        fetchTeams();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-[#cba672] text-xs font-bold uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>Zakovat Jamoalari va Kapitanlar Ligasi</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Zakovat Jamoasi Tuzish</h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          6 kishilik jamoangizni shakllantiring, Kapitan sifatida muhokamalarni boshqaring va hududiy ligalarda g'olib bo'ling.
        </p>
      </div>

      {/* Create Team Form (if logged in) */}
      {user && (
        <div className="zakovat-card p-6 border border-[#cba672]/30 space-y-4 max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#cba672]" />
            Yangi Jamoa Yaratish (Kapitan Rejimi)
          </h3>

          {msg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{msg}</span>
            </div>
          )}

          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Jamoa Nomi</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Masalan: Samarqand Feniks"
                className="zakovat-input text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Viloyat / Hudud</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="zakovat-input text-sm"
              >
                <option value="Toshkent">Toshkent shahri va viloyati</option>
                <option value="Samarqand">Samarqand</option>
                <option value="Buxoro">Buxoro</option>
                <option value="Farg'ona">Farg'ona / Andijon / Namangan</option>
                <option value="Qoraqalpog'iston">Qoraqalpog'iston Respublikasi</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={creating || !teamName.trim()}
              className="zakovat-btn-primary w-full text-xs py-3 flex items-center justify-center gap-2"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              <span>Jamoa Tuzish va Kapitan Bo'lish</span>
            </button>
          </form>
        </div>
      )}

      {/* Registered Teams Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Ro'yxatdan O'tgan Jamoalar ({teams.length})</h3>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-[#cba672] animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teams.map((tm) => (
              <div key={tm.id} className="zakovat-card p-6 space-y-4 border border-[#cba672]/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">{tm.name}</h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#cba672]" /> {tm.region}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-[#cba672] font-bold text-xs">
                    {tm.points} ochko
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#12181d] text-xs space-y-1">
                  <span className="text-slate-400 block">Jamoa Kapitani:</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-[#cba672]" /> {tm.captain?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
