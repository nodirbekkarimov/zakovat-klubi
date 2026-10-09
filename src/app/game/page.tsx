'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TimerRing } from '@/components/game/TimerRing';
import { QuestionCard } from '@/components/game/QuestionCard';
import { AnswerInput } from '@/components/game/AnswerInput';
import { HintPanel } from '@/components/game/HintPanel';
import { ResultCard } from '@/components/game/ResultCard';
import { Brain, AlertCircle, Loader2 } from 'lucide-react';

interface GameQuestion {
  id: string;
  text: string;
  difficulty: string;
  category: { name: string; slug: string; icon: string };
  hintCount: number;
  timeLimit: number;
}

function GameRunner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get('mode') || 'CLASSIC';
  const categorySlug = searchParams.get('category') || undefined;
  const difficulty = searchParams.get('difficulty') || undefined;

  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Per question state
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeResult, setActiveResult] = useState<any | null>(null);

  // Cumulative session results
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  useEffect(() => {
    async function initGame() {
      try {
        setLoading(true);
        const res = await fetch('/api/game/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, categorySlug, difficulty }),
        });
        const data = await res.json();

        if (data.success && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setError(data.error || 'Savollar topilmadi. Qaytadan urinib ko\'ring.');
        }
      } catch (err: any) {
        setError('O\'yinni boshlashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    }
    initGame();
  }, [mode, categorySlug, difficulty]);

  const currentQuestion = questions[currentIndex];

  const handleAnswerSubmit = async (userAnswerText: string) => {
    if (!currentQuestion || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/game/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          userAnswer: userAnswerText,
          timeSpent,
          totalTime: currentQuestion.timeLimit,
          hintsUsed: hintsUsedCount,
          mode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActiveResult(data);
        setGameHistory((prev) => [...prev, { question: currentQuestion, result: data }]);
      } else {
        alert(data.error || 'Javobni yuborishda xatolik');
      }
    } catch (err) {
      console.error('Answer submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    if (!activeResult && !isSubmitting) {
      handleAnswerSubmit('[Vaqt tugadi]');
    }
  };

  const handleNextQuestion = () => {
    setActiveResult(null);
    setHintsUsedCount(0);
    setTimeSpent(0);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Game session complete -> Save session and redirect to result
      const sessionSummary = {
        mode,
        totalQuestions: questions.length,
        gameHistory: [...gameHistory],
      };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('lastZakovatGame', JSON.stringify(sessionSummary));
      }
      router.push('/game/result');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Zakovat o'yini yuklanmoqda...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-card max-w-md rounded-2xl p-8 text-center space-y-4 border border-rose-500/30">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-100">Xatolik Yuz Berdi</h2>
          <p className="text-sm text-slate-400">{error || 'Savollar ro\'yxati bo\'sh'}</p>
          <button
            onClick={() => router.push('/')}
            className="gold-button px-6 py-2.5 rounded-xl font-bold text-sm"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header: Progress Bar & Timer */}
      <div className="flex items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-amber-500/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400 text-sm">
            {currentIndex + 1}/{questions.length}
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">O'yin Rejimi</span>
            <span className="text-sm font-bold text-amber-400">{mode}</span>
          </div>
        </div>

        <TimerRing
          totalSeconds={currentQuestion.timeLimit}
          isPaused={!!activeResult || isSubmitting}
          onTimeUp={handleTimeUp}
          onTick={(rem) => setTimeSpent(currentQuestion.timeLimit - rem)}
        />
      </div>

      {/* Main Gameplay Screen */}
      {!activeResult ? (
        <div className="space-y-6">
          <QuestionCard
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            categoryName={currentQuestion.category.name}
            difficulty={currentQuestion.difficulty}
            questionText={currentQuestion.text}
          />

          <HintPanel
            questionId={currentQuestion.id}
            totalHints={currentQuestion.hintCount}
            onHintUsed={(_, count) => setHintsUsedCount(count)}
            disabled={isSubmitting}
          />

          <AnswerInput onSubmit={handleAnswerSubmit} disabled={isSubmitting} />
        </div>
      ) : (
        /* Post-Question Result Details Card */
        <ResultCard
          evaluation={activeResult.evaluation}
          scoring={activeResult.scoring}
          questionDetails={activeResult.questionDetails}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={currentIndex + 1 === questions.length}
        />
      )}
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-amber-400 font-bold">
          Yuklanmoqda...
        </div>
      }
    >
      <GameRunner />
    </Suspense>
  );
}
