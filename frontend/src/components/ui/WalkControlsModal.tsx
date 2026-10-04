'use client';

import React from 'react';
import { X, Keyboard, MousePointer, LogOut, Smartphone } from 'lucide-react';

interface WalkControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWalk: () => void;
}

export function WalkControlsModal({
  isOpen,
  onClose,
  onStartWalk,
}: WalkControlsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 text-slate-800 transition-all scale-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Walk Icon */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 flex items-center justify-center">
            {/* Colorful Walking Pedestrian SVG matching the user screenshot */}
            <svg
              className="w-10 h-10 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Head */}
              <circle cx="12" cy="4" r="2" fill="#f59e0b" stroke="#d97706" />
              {/* Torso */}
              <path d="M12 7v5" stroke="#2563eb" strokeWidth="2.5" />
              {/* Arms */}
              <path d="M9 10l3-2 3 2" stroke="#2563eb" strokeWidth="2.2" />
              {/* Legs */}
              <path d="M10 16l2-4 2 4" stroke="#ea580c" strokeWidth="2.2" />
              <path d="M8 21l2-5" stroke="#ea580c" strokeWidth="2.2" />
              <path d="M14 16l2 5" stroke="#ea580c" strokeWidth="2.2" />
            </svg>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-slate-900">Walk the site</h2>
          <p className="text-xs text-slate-500 mt-1">Explore at ground level. Quick controls:</p>
        </div>

        {/* Controls List */}
        <div className="space-y-4 mb-6">
          {/* WASD */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 shrink-0">
              <Keyboard className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-between w-full">
              <span className="text-xs font-black tracking-wider text-slate-900 w-24">W A S D</span>
              <span className="text-xs text-slate-600 font-normal text-right flex-1">
                Move — forward, left, back, right
              </span>
            </div>
          </div>

          {/* Click + Drag */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 shrink-0">
              <MousePointer className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-between w-full">
              <span className="text-xs font-bold text-slate-900 w-24">Click + drag</span>
              <span className="text-xs text-slate-600 font-normal text-right flex-1">
                Look around — pan &amp; tilt
              </span>
            </div>
          </div>

          {/* Esc */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-between w-full">
              <span className="text-xs font-bold text-slate-900 w-24">Esc</span>
              <span className="text-xs text-slate-600 font-normal text-right flex-1">
                Exit walk mode
              </span>
            </div>
          </div>

          {/* Mobile / Tablet Horizontal Hint */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="flex items-baseline justify-between w-full">
              <span className="text-[11px] font-bold text-emerald-700 w-24">Mobile Gyro</span>
              <span className="text-[11px] text-slate-500 text-right flex-1">
                Dual circular joysticks (Move &amp; Turn)
              </span>
            </div>
          </div>
        </div>

        {/* Got it Button */}
        <button
          onClick={onStartWalk}
          className="w-full py-2.5 px-4 rounded-xl bg-[#4caf50] hover:bg-[#43a047] active:bg-[#388e3c] text-white font-semibold text-sm shadow-md shadow-green-600/30 transition-all cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
