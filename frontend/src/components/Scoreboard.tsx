'use client';

import React from 'react';
import { Participant } from '@/types';

interface ScoreboardProps {
  participants: Participant[];
  currentWinnerId?: number | null;
}

export default function Scoreboard({ participants, currentWinnerId }: ScoreboardProps) {
  const totalTurns = participants.reduce((acc, p) => acc + p.spokenCount, 0);

  return (
    <div className="w-full max-w-sm rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md p-5 shadow-xl text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Today&apos;s Turns
          </h2>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
          Total: {totalTurns}
        </span>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {participants.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No participants found</p>
        ) : (
          participants.map((p) => {
            const isLatest = p.id === currentWinnerId;
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 ${
                  isLatest
                    ? 'bg-indigo-500/20 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                    : 'bg-slate-800/40 hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: p.color || '#6366f1' }}
                  />
                  <span className={`text-sm font-medium ${isLatest ? 'text-white font-semibold' : 'text-slate-300'}`}>
                    {p.name}
                  </span>
                  {isLatest && (
                    <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase rounded bg-indigo-500 text-white tracking-wider">
                      Up Next
                    </span>
                  )}
                </div>

                <div className="flex items-center tracking-widest text-sm">
                  {p.spokenCount === 0 ? (
                    <span className="text-slate-500 text-xs font-mono">—</span>
                  ) : (
                    <span
                      className="font-mono text-indigo-400 select-none tracking-tight flex items-center gap-1"
                      title={`${p.spokenCount} turn${p.spokenCount > 1 ? 's' : ''}`}
                    >
                      {Array.from({ length: p.spokenCount }).map((_, i) => (
                        <span key={i} className="text-indigo-400">●</span>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
