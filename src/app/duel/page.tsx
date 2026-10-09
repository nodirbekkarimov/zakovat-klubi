'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  Swords,
  Shield,
  Trophy,
  Clock,
  User,
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Loader2,
  Flame,
  Award,
  Share2,
  Copy,
  Users,
  LogIn,
  Plus,
} from 'lucide-react';
import { sound } from '@/lib/sound';
const { evaluateAnswer } = require('@/lib/evaluator');

type DuelPhase = 'LOBBY' | 'ROOM_WAITING' | 'MATCHMAKING' | 'VERSUS_SCREEN' | 'ROUND_PLAY' | 'ROUND_RESULT' | 'DUEL_FINISHED';

export default function DuelPage() {
  const { data: session } = useSession();
  const userName = (session?.user as any)?.name || 'Bilimdon';

  const [phase, setPhase] = useState<DuelPhase>('LOBBY');
  const [playerElo, setPlayerElo] = useState<number>(1450);
  const [opponent, setOpponent] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);

  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [playerAnswered, setPlayerAnswered] = useState<boolean>(false);
  const [playerAnswerCorrect, setPlayerAnswerCorrect] = useState<boolean | null>(null);

  const [opponentAnswered, setOpponentAnswered] = useState<boolean>(false);
  const [opponentCorrect, setOpponentCorrect] = useState<boolean | null>(null);

  const [roundVerdict, setRoundVerdict] = useState<string>('');
  const [eloDelta, setEloDelta] = useState<number>(0);

  // Multiplayer Room State
  const [roomCode, setRoomCode] = useState<string>('');
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [isRoomHost, setIsRoomHost] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [roomError, setRoomError] = useState<string>('');
  const [roomLoading, setRoomLoading] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const roomPollRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Create Multiplayer Room
  const handleCreateRoom = async () => {
    setRoomLoading(true);
    setRoomError('');
    try {
      const res = await fetch('/api/duel/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE_ROOM' }),
      });
      const data = await res.json();
      if (data.success) {
        setRoomCode(data.code);
        setIsRoomHost(true);
        setQuestions(JSON.parse(data.room.questionsData || '[]'));
        setPhase('ROOM_WAITING');
        sound.playTick();

        // Start polling room until guest joins
        roomPollRef.current = setInterval(async () => {
          const pollRes = await fetch('/api/duel/room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'GET_ROOM', code: data.code }),
          });
          const pollData = await pollRes.json();
          if (pollData.success && pollData.room.status === 'IN_PROGRESS') {
            clearInterval(roomPollRef.current!);
            setOpponent({
              name: pollData.room.guestName || 'Raqib Bilimdon',
              title: 'Jonli Raqib',
              elo: 1450,
              avatar: (pollData.room.guestName || 'R')[0],
              winRate: '65%',
            });
            setPhase('VERSUS_SCREEN');
            sound.playGong();
            setTimeout(() => {
              startQuestionRound(0, JSON.parse(pollData.room.questionsData || '[]'));
            }, 2500);
          }
        }, 1500);
      }
    } catch (e: any) {
      setRoomError('Xona yaratishda xatolik yuz berdi');
    } finally {
      setRoomLoading(false);
    }
  };

  // 2. Join Existing Multiplayer Room
  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    setRoomLoading(true);
    setRoomError('');
    try {
      const res = await fetch('/api/duel/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'JOIN_ROOM', code: joinCodeInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setRoomCode(data.room.code);
        setIsRoomHost(false);
        setQuestions(JSON.parse(data.room.questionsData || '[]'));
        setOpponent({
          name: data.room.hostName || 'Xona Egasi',
          title: 'Jonli Raqib',
          elo: 1500,
          avatar: (data.room.hostName || 'X')[0],
          winRate: '70%',
        });
        setPhase('VERSUS_SCREEN');
        sound.playGong();
        setTimeout(() => {
          startQuestionRound(0, JSON.parse(data.room.questionsData || '[]'));
        }, 2500);
      } else {
        setRoomError(data.error || 'Xonaga ulanib bo\'lmadi');
      }
    } catch (e) {
      setRoomError('Ulanishda xatolik yuz berdi');
    } finally {
      setRoomLoading(false);
    }
  };

  // 3. Quick Match (Random Matchmaking)
  const handleStartMatchmaking = async () => {
    setPhase('MATCHMAKING');
    sound.playTick();

    try {
      const res = await fetch('/api/duel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'FIND_MATCH' }),
      });
      const data = await res.json();

      if (data.success) {
        setOpponent(data.opponent);
        setQuestions(data.questions);
        setCurrentIndex(0);
        setPlayerScore(0);
        setOpponentScore(0);

        setTimeout(() => {
          setPhase('VERSUS_SCREEN');
          sound.playGong();
          setTimeout(() => {
            startQuestionRound(0, data.questions);
          }, 2500);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setPhase('LOBBY');
    }
  };

  // 4. Start a specific 30s question round
  const startQuestionRound = (qIdx: number, qList = questions) => {
    setCurrentIndex(qIdx);
    setTimeLeft(30);
    setUserAnswer('');
    setPlayerAnswered(false);
    setPlayerAnswerCorrect(null);
    setOpponentAnswered(false);
    setOpponentCorrect(null);
    setRoundVerdict('');
    setPhase('ROUND_PLAY');
    sound.playGong();

    // Simulated opponent answer time between 10s and 20s if solo quick match
    if (!roomCode) {
      const opponentAnswerTime = Math.floor(Math.random() * 10) + 10;
      const opponentWillBeCorrect = Math.random() < 0.65;
      setTimeout(() => {
        setOpponentAnswered(true);
        setOpponentCorrect(opponentWillBeCorrect);
        if (opponentWillBeCorrect) {
          setOpponentScore((prev) => prev + 1);
        }
      }, opponentAnswerTime * 1000);
    }
  };

  // 5. Timer Countdown
  useEffect(() => {
    if (phase === 'ROUND_PLAY') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeExpired();
            return 0;
          }
          if (prev <= 6) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase, currentIndex]);

  const handleTimeExpired = () => {
    if (!playerAnswered) {
      setPlayerAnswered(true);
      setPlayerAnswerCorrect(false);
    }
    finishRound();
  };

  // 6. Player Submits Answer
  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playerAnswered || !userAnswer.trim()) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const currentQ = questions[currentIndex];
    const evalResult = evaluateAnswer(userAnswer, currentQ.answer, currentQ.acceptableAnswers || []);
    const isCorrect = evalResult.verdict === 'CORRECT' || evalResult.verdict === 'ALMOST_CORRECT';

    setPlayerAnswered(true);
    setPlayerAnswerCorrect(isCorrect);

    if (isCorrect) {
      sound.playCorrect();
      setPlayerScore((prev) => prev + 1);
    } else {
      sound.playWrong();
    }

    // If multiplayer room, sync score to DB
    if (roomCode) {
      fetch('/api/duel/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUBMIT_SCORE',
          code: roomCode,
          isHost: isRoomHost,
          isCorrect,
        }),
      }).catch(() => {});
    }

    setTimeout(() => {
      finishRound();
    }, 1200);
  };

  // 7. Conclude Round
  const finishRound = () => {
    setPhase('ROUND_RESULT');

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        startQuestionRound(currentIndex + 1);
      } else {
        finishEntireDuel();
      }
    }, 3500);
  };

  // 8. Duel Summary
  const finishEntireDuel = async () => {
    setPhase('DUEL_FINISHED');
    const won = playerScore > opponentScore;
    const delta = won ? 25 : -15;
    setEloDelta(delta);
    setPlayerElo((prev) => prev + delta);

    if (won) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    try {
      await fetch('/api/duel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUBMIT_DUEL_RESULT',
          playerWon: won,
          scorePlayer: playerScore,
          scoreOpponent: opponentScore,
        }),
      });
    } catch (e) {}
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* 1. LOBBY SCREEN (Matchmaking & Room Options) */}
      {phase === 'LOBBY' && (
        <div className="space-y-8 max-w-3xl mx-auto py-8 animate-in fade-in">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1912] border border-[#cba672]/30 text-[#cba672] text-xs font-bold uppercase tracking-wider">
              <Swords className="w-4 h-4" />
              <span>1v1 Jonli Blits Ulanish Arenasi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Zakovat <span className="gold-text">Jonli PvP Dueli</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Xona kodi orqali do'stingiz bilan real vaqtda bellashing yoki tezkor tasodifiy raqib bilan kuch sinashing!
            </p>
          </div>

          {roomError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
              {roomError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option 1: Do'st bilan Xona Kodi orqali */}
            <div className="zakovat-card p-6 border border-[#cba672]/30 space-y-5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#1e1912] border border-[#cba672]/40 text-[#cba672] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Do'st Bilan Jonli Xona</h3>
                <p className="text-xs text-slate-400">
                  O'zingiz xona oching va kodni do'stingizga yuboring, yoki mavjud kod orqali ulaning.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleCreateRoom}
                  disabled={roomLoading}
                  className="zakovat-btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
                >
                  {roomLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>YANGI XONA YARATISH</span>
                </button>

                <form onSubmit={handleJoinRoom} className="flex gap-2">
                  <input
                    type="text"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    placeholder="KOD: ZK-1234"
                    className="zakovat-input text-xs font-mono font-bold uppercase py-2.5 px-3 flex-1"
                  />
                  <button
                    type="submit"
                    disabled={roomLoading || !joinCodeInput.trim()}
                    className="zakovat-btn-outline text-xs py-2.5 px-4 font-bold flex items-center gap-1 shrink-0"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#cba672]" />
                    <span>ULANISH</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Option 2: Tezkor Matchmaking */}
            <div className="zakovat-card p-6 border border-[#cba672]/30 space-y-5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#1e1912] border border-[#cba672]/40 text-[#cba672] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Tezkor Blits Matchmaking</h3>
                <p className="text-xs text-slate-400">
                  Kutishlarsiz! Tizim sizning Elo darajangizdagi munosib bilimdonni darhol topib beradi.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartMatchmaking}
                  className="zakovat-btn-outline w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 text-[#cba672] border-[#cba672]"
                >
                  <Swords className="w-4 h-4 text-[#cba672]" />
                  <span>TEZKOR RAQIB BILAN O'YNASH</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ROOM WAITING LOBBY (Waiting for Friend to Connect) */}
      {phase === 'ROOM_WAITING' && (
        <div className="text-center py-16 space-y-6 max-w-md mx-auto animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-[#1e1912] border-2 border-[#cba672] flex items-center justify-center mx-auto shadow-2xl">
            <Users className="w-8 h-8 text-[#cba672] animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Xona Yaratildi!</h2>
            <p className="text-xs text-slate-400">Do'stingizga quyidagi kodni yuboring va xonaga kirishini kuting:</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1e1912] border-2 border-[#cba672] flex items-center justify-between gap-4 max-w-xs mx-auto shadow-xl">
            <span className="font-mono text-2xl font-black tracking-widest text-[#cba672]">{roomCode}</span>
            <button
              onClick={copyRoomCode}
              className="zakovat-btn-primary py-1.5 px-3 text-[11px] font-bold flex items-center gap-1"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Nusxalandi' : 'Nusxalash'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-[#cba672]" />
            <span>Raqib ulanishi kutilmoqda...</span>
          </div>

          <button
            onClick={() => {
              if (roomPollRef.current) clearInterval(roomPollRef.current);
              setPhase('LOBBY');
            }}
            className="text-xs text-rose-400 hover:underline pt-4 block mx-auto"
          >
            Xonani bekor qilish
          </button>
        </div>
      )}

      {/* 3. MATCHMAKING RADAR */}
      {phase === 'MATCHMAKING' && (
        <div className="text-center py-20 space-y-6 max-w-md mx-auto animate-in zoom-in-95">
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#cba672]/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-[#cba672]/50 animate-pulse" />
            <div className="w-20 h-20 rounded-full bg-[#1e1912] border-2 border-[#cba672] flex items-center justify-center shadow-2xl">
              <Swords className="w-8 h-8 text-[#cba672] animate-bounce" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">Munosib Raqib Qidirilmoqda...</h3>
            <p className="text-xs text-slate-400">Sizning Elo darajangizdagi ({playerElo} ± 100) bilimdon tanlanmoqda</p>
          </div>
        </div>
      )}

      {/* 4. VERSUS SCREEN */}
      {phase === 'VERSUS_SCREEN' && opponent && (
        <div className="py-12 space-y-8 max-w-3xl mx-auto animate-in zoom-in-95">
          <div className="text-center">
            <span className="text-xs font-bold text-[#cba672] uppercase tracking-widest">Raqib Topildi!</span>
            <h2 className="text-3xl font-black text-white mt-1">Jang Boshlanmoqda</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6">
            <div className="zakovat-card p-6 text-center space-y-3 border border-[#cba672]/40">
              <div className="w-16 h-16 rounded-full bg-[#cba672] text-slate-950 font-black text-2xl mx-auto flex items-center justify-center">
                {userName.charAt(0)}
              </div>
              <h3 className="font-bold text-white text-lg">{userName}</h3>
              <span className="px-3 py-1 rounded-full bg-[#1e1912] text-[#cba672] font-mono font-bold text-xs">
                {playerElo} Elo
              </span>
            </div>

            <div className="text-center font-black text-3xl gold-text animate-pulse">
              VS
            </div>

            <div className="zakovat-card p-6 text-center space-y-3 border border-rose-500/40">
              <div className="w-16 h-16 rounded-full bg-rose-500 text-white font-black text-2xl mx-auto flex items-center justify-center">
                {opponent.avatar || 'R'}
              </div>
              <h3 className="font-bold text-white text-lg">{opponent.name}</h3>
              <span className="px-3 py-1 rounded-full bg-[#1e1912] text-rose-400 font-mono font-bold text-xs">
                {opponent.elo} Elo • {opponent.winRate || '65%'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5 & 6. ROUND PLAY & RESULT */}
      {(phase === 'ROUND_PLAY' || phase === 'ROUND_RESULT') && currentQ && (
        <div className="space-y-6">
          {/* Header Scoreboard */}
          <div className="zakovat-card p-4 sm:p-6 border border-[#cba672]/30 flex items-center justify-between gap-4 shadow-2xl">
            {/* Player Side */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#cba672] text-slate-950 font-black flex items-center justify-center text-sm">
                {userName.charAt(0)}
              </div>
              <div>
                <span className="font-bold text-white text-sm block">{userName}</span>
                <span className="text-xs text-slate-400">
                  {playerAnswered ? (playerAnswerCorrect ? '✅ To\'g\'ri' : '❌ Noto\'g\'ri') : '✍️ Yozmoqda...'}
                </span>
              </div>
            </div>

            {/* Center Score & Timer */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black font-mono text-emerald-400">{playerScore}</span>
                <span className="text-slate-500 font-black text-xl">:</span>
                <span className="text-3xl font-black font-mono text-rose-400">{opponentScore}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className={`w-4 h-4 ${timeLeft <= 6 ? 'text-rose-500 animate-bounce' : 'text-[#cba672]'}`} />
                <span className={`font-mono font-bold text-sm ${timeLeft <= 6 ? 'text-rose-500' : 'text-[#cba672]'}`}>
                  {timeLeft}s (Savol {currentIndex + 1}/5)
                </span>
              </div>
            </div>

            {/* Opponent Side */}
            <div className="flex items-center gap-3 text-right">
              <div>
                <span className="font-bold text-white text-sm block">{opponent?.name}</span>
                <span className="text-xs text-slate-400">
                  {opponentAnswered ? (opponentCorrect ? '✅ To\'g\'ri' : '❌ Noto\'g\'ri') : '🤔 O\'ylamoqda...'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-sm">
                {opponent?.avatar || 'R'}
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="zakovat-card p-6 sm:p-8 border border-[#cba672]/40 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#cba672] border-b border-slate-800 pb-3">
              <span>{currentQ.category?.toUpperCase() || 'ZAKOVAT'} • BLITS #{currentIndex + 1}</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300">{currentQ.difficulty || 'MEDIUM'}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              "{currentQ.text}"
            </h2>
          </div>

          {/* Answer Input or Result Feedback */}
          {phase === 'ROUND_PLAY' && (
            <form onSubmit={handlePlayerSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  disabled={playerAnswered}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={playerAnswered ? "Javobingiz qabul qilindi..." : "Tezkor javobingizni yozing va Enter bosing..."}
                  className="zakovat-input flex-1 text-sm"
                />
                <button
                  type="submit"
                  disabled={playerAnswered || !userAnswer.trim()}
                  className="zakovat-btn-primary px-8 text-xs font-bold"
                >
                  YUBORISH
                </button>
              </div>
            </form>
          )}

          {phase === 'ROUND_RESULT' && (
            <div className="zakovat-card p-6 border border-emerald-500/40 bg-emerald-500/10 space-y-2 animate-in fade-in">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Rasmiy To'g'ri Javob:
              </span>
              <p className="text-xl font-black text-white">{currentQ.answer}</p>
              {currentQ.explanation && (
                <p className="text-xs text-slate-300 pt-2 border-t border-emerald-500/20">
                  <span className="font-bold text-[#cba672]">Izoh:</span> {currentQ.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 7. DUEL FINISHED RESULT */}
      {phase === 'DUEL_FINISHED' && (
        <div className="text-center max-w-lg mx-auto py-12 space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-2xl bg-[#1e1912] border-2 border-[#cba672]">
            {playerScore > opponentScore ? (
              <Trophy className="w-10 h-10 text-[#cba672] animate-bounce" />
            ) : (
              <Shield className="w-10 h-10 text-rose-500" />
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white">
              {playerScore > opponentScore
                ? "G'ALABA! SIZ DUELDA YUTDINGIZ!"
                : playerScore === opponentScore
                ? "DURANG NATIJA!"
                : "MAG'LUBIYAT! KEYINGI SAFAR G'ALABA QOZONASIZ!"}
            </h2>
            <p className="text-sm text-slate-400">
              Yakuniy Hisob: <span className="font-bold text-white">{playerScore} : {opponentScore}</span>
            </p>
          </div>

          <div className="zakovat-card p-6 border border-[#cba672]/30 space-y-2">
            <span className="text-xs font-bold uppercase text-slate-400 block">Elo Reytingingiz O'zgarishi:</span>
            <span className={`text-3xl font-black font-mono ${eloDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {eloDelta >= 0 ? `+${eloDelta}` : eloDelta} Elo
            </span>
            <span className="text-xs text-slate-300 block">
              Yangi reyting: <span className="font-bold text-white">{playerElo} Elo</span>
            </span>
          </div>

          <button
            onClick={() => setPhase('LOBBY')}
            className="zakovat-btn-primary px-8 py-3.5 text-xs font-bold flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>YANA DUEL O'YNASH</span>
          </button>
        </div>
      )}
    </div>
  );
}
