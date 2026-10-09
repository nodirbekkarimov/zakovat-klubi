'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AnswerInput({
  onSubmit,
  disabled = false,
  placeholder = "Javobingizni shu yerga yozing...",
}: AnswerInputProps) {
  const [answer, setAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!answer.trim() || disabled) return;
    onSubmit(answer.trim());
    setAnswer('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="zakovat-card p-3 sm:p-4 border border-[#cba672]/30 flex flex-col sm:flex-row items-center gap-3 shadow-xl">
        <input
          ref={inputRef}
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="zakovat-input flex-1 text-base sm:text-lg"
        />

        <button
          type="submit"
          disabled={!answer.trim() || disabled}
          className="zakovat-btn-primary w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>JAVOB BERISH</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
