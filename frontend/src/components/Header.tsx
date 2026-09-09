'use client';

import React from 'react';

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center text-center pt-8 pb-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="w-2 h-2 -ml-3 rounded-full bg-emerald-400" />
        <span className="text-xs font-semibold tracking-wider uppercase text-indigo-300">
          RETRO MODE
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-300 drop-shadow-sm">
        Retro Roulette
      </h1>

      <p className="mt-2 text-slate-400 text-base sm:text-lg font-medium">
        Who gets the mic next?
      </p>
    </header>
  );
}
