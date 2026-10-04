'use client';

import React from 'react';
import { Home, Plus, Minus, Share2 } from 'lucide-react';

interface RightFloatingControlsProps {
  is3D: boolean;
  isWalkMode?: boolean;
  onToggle3D: () => void;
  onToggleWalkMode?: () => void;
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onShare: () => void;
}

export function RightFloatingControls({
  is3D,
  isWalkMode = false,
  onToggle3D,
  onToggleWalkMode,
  onResetView,
  onZoomIn,
  onZoomOut,
  onShare,
}: RightFloatingControlsProps) {
  return (
    <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2.5 pointer-events-auto">
      {/* Walk the site / Street View Button (Matching Screenshot 1) */}
      {onToggleWalkMode && (
        <button
          onClick={onToggleWalkMode}
          title={isWalkMode ? 'Exit Walk Mode' : 'Walk the site (3D Street View)'}
          aria-label="Walk the site"
          className={`group relative flex items-center justify-center w-11 h-11 rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer backdrop-blur-md ${
            isWalkMode
              ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-300 shadow-emerald-500/20'
              : 'bg-[#12161f] border border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-500 hover:text-white'
          }`}
        >
          {/* Target / Street View Bullseye Icon identical to screenshot 1 */}
          <svg
            className="w-5 h-5 transition-transform group-hover:scale-110"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
          {isWalkMode && (
            <span className="absolute -bottom-1 w-2 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          )}
        </button>
      )}
      {/* 3D View Toggle Pill */}
      <button
        onClick={onToggle3D}
        title={is3D ? 'Switch to 2D Plan View' : 'Switch to 3D Perspective'}
        className={`group relative flex items-center justify-center w-11 h-11 rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer backdrop-blur-md ${
          is3D
            ? 'bg-teal-500/25 border-2 border-teal-400 text-teal-300 shadow-teal-500/20'
            : 'bg-[#12161f] border border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-500 hover:text-white'
        }`}
      >
        <span className="text-sm font-black tracking-tight select-none">3D</span>
        {is3D && (
          <span className="absolute -bottom-1 w-2 h-1 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf]" />
        )}
      </button>

      {/* Home / Reset View Button */}
      <button
        onClick={onResetView}
        title="Reset to Overview"
        aria-label="Reset View"
        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#12161f] backdrop-blur-md border border-slate-700/80 shadow-xl text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500 transition-all active:scale-95 cursor-pointer"
      >
        <Home className="w-4 h-4" />
      </button>

      {/* Zoom In Button */}
      <button
        onClick={onZoomIn}
        title="Zoom In"
        aria-label="Zoom In"
        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#12161f] backdrop-blur-md border border-slate-700/80 shadow-xl text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500 transition-all active:scale-95 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Zoom Out Button */}
      <button
        onClick={onZoomOut}
        title="Zoom Out"
        aria-label="Zoom Out"
        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#12161f] backdrop-blur-md border border-slate-700/80 shadow-xl text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500 transition-all active:scale-95 cursor-pointer"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
}
