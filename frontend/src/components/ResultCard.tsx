'use client';

import React from 'react';
import { Participant } from '@/types';

interface ResultCardProps {
  winner: Participant | null;
}

export default function ResultCard({ winner }: ResultCardProps) {
  if (!winner) {
    return (
      <div className="w-full max-w-md h-24 flex items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-slate-500 text-sm">
        Ready for the next turn? Click Spin!
      </div>
    );
  }

  return (
    <div
      id="result-card"
      className="w-full max-w-md transform animate-bounce-subtle rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-indigo-500/40 p-5 shadow-[0_0_30px_rgba(99,102,241,0.25)] text-center backdrop-blur-xl transition-all duration-500"
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-2xl">🎉</span>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          <span
            className="underline decoration-indigo-500 decoration-wavy underline-offset-4"
            style={{ color: winner.color }}
          >
            {winner.name}
          </span>{' '}
          is up next!
        </h3>
      </div>
      <p className="text-sm font-medium text-indigo-300/90 mt-1">
        Pass them the mic.
      </p>
    </div>
  );
}
