'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Wheel from '@/components/Wheel';
import Scoreboard from '@/components/Scoreboard';
import ResultCard from '@/components/ResultCard';
import { Participant, SpinResponse, ResetResponse } from '@/types';
import { launchConfetti } from '@/lib/confetti';
import { soundEffects } from '@/lib/audio';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [pendingWinner, setPendingWinner] = useState<Participant | null>(null);
  const [revealedWinner, setRevealedWinner] = useState<Participant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial participants
  const loadParticipants = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/participants`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Participant[] = await res.json();
      setParticipants(data);
    } catch (err) {
      console.error('Failed to load participants:', err);
      setError('Unable to connect to backend service. Ensure backend is running on port 4000.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  // Handle Spin The Wheel action
  const handleSpin = async () => {
    if (isSpinning || participants.length === 0) return;

    try {
      setError(null);
      // Start request
      const res = await fetch(`${API_BASE}/spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SpinResponse = await res.json();

      // Clear previous winner display during spin
      setRevealedWinner(null);
      setPendingWinner(data.winner);
      setIsSpinning(true);
    } catch (err) {
      console.error('Spin failed:', err);
      setError('Failed to select next participant. Please try again.');
      setIsSpinning(false);
    }
  };

  // Called once wheel animation finishes decelerating
  const handleSpinComplete = () => {
    setIsSpinning(false);
    if (pendingWinner) {
      setRevealedWinner(pendingWinner);

      // Update spoken counts in local participant list
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === pendingWinner.id
            ? { ...p, spokenCount: pendingWinner.spokenCount }
            : p
        )
      );

      // Trigger celebratory fanfare and confetti
      soundEffects.playVictory();
      launchConfetti();
    }
  };

  // Handle Reset Retro
  const handleReset = async () => {
    if (isSpinning) return;
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ResetResponse = await res.json();

      setParticipants(data.participants);
      setPendingWinner(null);
      setRevealedWinner(null);
    } catch (err) {
      console.error('Reset failed:', err);
      setError('Failed to reset retro. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 pb-12 sm:px-8">
      {/* Header */}
      <Header />

      {/* Error notification banner if any */}
      {error && (
        <div className="w-full max-w-md my-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={loadParticipants}
            className="ml-2 underline hover:text-rose-100 font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14 my-4 sm:my-6 flex-1">
        {/* Left / Center: Spinning Wheel & Spin Button */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-xl">
          {isLoading ? (
            <div className="w-[360px] h-[360px] flex flex-col items-center justify-center rounded-full border border-slate-800 bg-slate-900/40 text-slate-400 gap-3">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm font-medium">Loading Wheel...</p>
            </div>
          ) : (
            <Wheel
              participants={participants}
              winnerId={pendingWinner ? pendingWinner.id : null}
              isSpinning={isSpinning}
              onSpinComplete={handleSpinComplete}
            />
          )}

          {/* Main Action Button: SPIN THE WHEEL */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              id="spin-button"
              onClick={handleSpin}
              disabled={isSpinning || isLoading || participants.length === 0}
              className={`relative group px-10 py-4 rounded-2xl font-black text-lg sm:text-xl tracking-wider uppercase transition-all duration-300 transform active:scale-95 shadow-xl ${
                isSpinning || isLoading || participants.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white border border-indigo-400/40 shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] hover:-translate-y-0.5'
              }`}
            >
              {/* Button Glow Effect */}
              {!isSpinning && (
                <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 opacity-30 blur-sm group-hover:opacity-60 transition duration-300 pointer-events-none" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {isSpinning ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    SPINNING...
                  </>
                ) : (
                  'SPIN THE WHEEL'
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Right: Scoreboard & Result Card */}
        <div className="flex flex-col items-center lg:items-start gap-6 w-full max-w-sm">
          {/* Result Card */}
          <ResultCard winner={revealedWinner} />

          {/* Today's Turns Scoreboard */}
          <Scoreboard
            participants={participants}
            currentWinnerId={revealedWinner ? revealedWinner.id : null}
          />

          {/* Controls: Reset Retro Button */}
          <div className="w-full flex justify-center lg:justify-start pt-1">
            <button
              id="reset-button"
              onClick={handleReset}
              disabled={isSpinning}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 hover:text-rose-400 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset Retro
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 mt-6">
        Retro Roulette &bull; Fair &amp; weighted retrospective turns
      </footer>
    </main>
  );
}
