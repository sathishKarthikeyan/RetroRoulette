'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Participant } from '@/types';
import { soundEffects } from '@/lib/audio';

interface WheelProps {
  participants: Participant[];
  winnerId: number | null;
  isSpinning: boolean;
  onSpinComplete: () => void;
}

export default function Wheel({
  participants,
  winnerId,
  isSpinning,
  onSpinComplete,
}: WheelProps) {
  const [rotation, setRotation] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(0);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const numSegments = participants.length || 1;
  const sliceAngle = 360 / numSegments;

  // Pre-calculate SVG slices
  const slices = useMemo(() => {
    return participants.map((p, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = (index + 1) * sliceAngle;
      const centerAngle = startAngle + sliceAngle / 2;

      // Convert polar to cartesian (radius 220, center 250, 250)
      const r = 220;
      const cx = 250;
      const cy = 250;

      const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
      const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
      const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
      const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);

      // SVG path arc flag
      const largeArc = sliceAngle > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      // Text position along ray
      const textRadius = 145;
      const tx = cx + textRadius * Math.cos((centerAngle * Math.PI) / 180);
      const ty = cy + textRadius * Math.sin((centerAngle * Math.PI) / 180);

      return {
        ...p,
        index,
        centerAngle,
        pathData,
        tx,
        ty,
        textRotation: centerAngle,
      };
    });
  }, [participants, sliceAngle]);

  // When spinning starts and we have a winnerId
  useEffect(() => {
    if (!isSpinning || winnerId === null || slices.length === 0) return;

    const winnerIndex = slices.findIndex((s) => s.id === winnerId);
    if (winnerIndex === -1) return;

    const winnerSlice = slices[winnerIndex];
    const centerAngle = winnerSlice.centerAngle;

    // Top pointer is at 270 degrees (12 o'clock)
    const targetNormalized = ((270 - centerAngle) % 360 + 360) % 360;
    const currentNormalized = ((rotation % 360) + 360) % 360;
    const forwardDelta = ((targetNormalized - currentNormalized) % 360 + 360) % 360;

    // Minimum 5 full spins (1800 deg) + forwardDelta
    const spins = 5 * 360;
    const finalRotation = rotation + spins + forwardDelta;

    setTransitionDuration(3.5);
    setRotation(finalRotation);

    // Audio tick ratchet simulation
    let elapsed = 0;
    const totalTime = 3500;
    let tickDelay = 50;

    const scheduleNextTick = () => {
      soundEffects.playTick();
      elapsed += tickDelay;

      if (elapsed < totalTime - 100) {
        // Progressively slow down tick rate to match deceleration
        const progress = elapsed / totalTime;
        tickDelay = 50 + Math.pow(progress, 2.5) * 350;
        audioIntervalRef.current = setTimeout(scheduleNextTick, tickDelay);
      }
    };

    scheduleNextTick();

    const timer = setTimeout(() => {
      if (audioIntervalRef.current) clearTimeout(audioIntervalRef.current);
      onSpinComplete();
    }, totalTime);

    return () => {
      clearTimeout(timer);
      if (audioIntervalRef.current) clearTimeout(audioIntervalRef.current);
    };
  }, [isSpinning, winnerId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Decorative Outer Glow Ring */}
      <div className="absolute w-[440px] h-[440px] rounded-full bg-gradient-to-r from-indigo-500/20 via-pink-500/20 to-teal-500/20 blur-2xl pointer-events-none" />

      {/* Top Fixed Pointer Arrow */}
      <div className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
        <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
          <defs>
            <linearGradient id="pointerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="pointerGlow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.8" />
            </filter>
          </defs>
          <polygon
            points="23,42 7,6 39,6"
            fill="url(#pointerGrad)"
            stroke="#fff"
            strokeWidth="2"
            filter="url(#pointerGlow)"
          />
          <circle cx="23" cy="14" r="4.5" fill="#fff" />
        </svg>
      </div>

      {/* Wheel SVG with Hardware-Accelerated CSS Transform */}
      <div
        id="roulette-wheel"
        className="w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] relative rounded-full shadow-[0_0_50px_rgba(0,0,0,0.6)]"
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionProperty: 'transform',
          transitionDuration: `${transitionDuration}s`,
          transitionTimingFunction: 'cubic-bezier(0.12, 0.85, 0.18, 1.0)',
        }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full rounded-full"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Outer Rim Stud Lighting */}
            <radialGradient id="rimGrad" cx="50%" cy="50%" r="50%">
              <stop offset="92%" stopColor="#0f172a" />
              <stop offset="97%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>
            <radialGradient id="centerHubGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
          </defs>

          {/* Outer Border Rim */}
          <circle cx="250" cy="250" r="236" fill="url(#rimGrad)" stroke="#475569" strokeWidth="6" />

          {/* Slices */}
          {slices.map((slice) => (
            <g key={slice.id}>
              <path
                d={slice.pathData}
                fill={slice.color}
                stroke="#0f172a"
                strokeWidth="2.5"
                className="transition-opacity hover:opacity-95"
              />
              {/* Radial Name Text */}
              <text
                x={slice.tx}
                y={slice.ty}
                fill="#ffffff"
                fontSize={numSegments > 10 ? '14' : '17'}
                fontWeight="800"
                letterSpacing="0.5px"
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(${slice.textRotation}, ${slice.tx}, ${slice.ty})`}
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.85)',
                }}
              >
                {slice.name}
              </text>
            </g>
          ))}

          {/* Decorative Rim Rivets/Studs */}
          {Array.from({ length: 24 }).map((_, idx) => {
            const angle = (idx * 360) / 24;
            const rx = 250 + 228 * Math.cos((angle * Math.PI) / 180);
            const ry = 250 + 228 * Math.sin((angle * Math.PI) / 180);
            return (
              <circle
                key={idx}
                cx={rx}
                cy={ry}
                r="3"
                fill="#f8fafc"
                opacity="0.8"
              />
            );
          })}

          {/* Center Hub */}
          <circle cx="250" cy="250" r="44" fill="url(#centerHubGrad)" stroke="#64748b" strokeWidth="4" />
          <circle cx="250" cy="250" r="26" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          <text
            x="250"
            y="251"
            fill="#e2e8f0"
            fontSize="10"
            fontWeight="900"
            letterSpacing="1px"
            textAnchor="middle"
            dominantBaseline="central"
          >
            RETRO
          </text>
        </svg>
      </div>
    </div>
  );
}
