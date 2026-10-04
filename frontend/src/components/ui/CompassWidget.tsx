'use client';

import React from 'react';

interface CompassWidgetProps {
  rotation: number; // degrees
  onResetRotation: () => void;
}

export function CompassWidget({ rotation, onResetRotation }: CompassWidgetProps) {
  return (
    <button
      onClick={onResetRotation}
      title="Click to orient North"
      aria-label="Compass - Reset North"
      className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-xl hover:border-teal-500/50 hover:bg-slate-800/90 transition-all active:scale-95 cursor-pointer pointer-events-auto"
    >
      {/* Outer Dial Marks */}
      <div className="absolute inset-1 rounded-full border border-slate-700/40" />

      {/* Rotating Dial & Cardinal Indicators */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Cardinal Directions */}
        <span className="absolute top-1 text-[9px] font-bold text-teal-400 tracking-tighter">N</span>
        <span className="absolute bottom-1 text-[8px] font-medium text-slate-400 tracking-tighter">S</span>
        <span className="absolute left-1.5 text-[8px] font-medium text-slate-400 tracking-tighter">W</span>
        <span className="absolute right-1.5 text-[8px] font-medium text-slate-400 tracking-tighter">E</span>

        {/* Compass Crosshair */}
        <div className="absolute w-[1px] h-6 bg-slate-700/50" />
        <div className="absolute h-[1px] w-6 bg-slate-700/50" />

        {/* Compass Needle */}
        <div className="relative w-1.5 h-7 flex flex-col items-center">
          {/* North Needle (Teal / Red tip) */}
          <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[14px] border-b-teal-400 drop-shadow-[0_0_4px_rgba(40,156,163,0.8)]" />
          {/* South Needle (Silver tip) */}
          <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[14px] border-t-slate-400" />
          {/* Center Pivot Point */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-400 shadow" />
        </div>
      </div>
    </button>
  );
}
