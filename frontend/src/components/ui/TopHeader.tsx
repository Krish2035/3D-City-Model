'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CompassWidget } from './CompassWidget';
import { Layers, Check } from 'lucide-react';

interface TopHeaderProps {
  rotation: number;
  onResetRotation: () => void;
  activeLayer: string;
  onChangeLayer: (layer: string) => void;
}

export function TopHeader({
  rotation,
  onResetRotation,
  activeLayer,
  onChangeLayer,
}: TopHeaderProps) {
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const layers = [
    { id: 'satellite-dark', label: 'Dark Satellite (Default)' },
    { id: 'satellite-vivid', label: 'Vivid Satellite' },
    { id: 'blueprint', label: 'Dark Blueprint' },
    { id: 'street', label: 'Street Overview' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-3 sm:p-4 md:p-6 flex justify-between items-start">
      {/* Top Left: Logo, Title & Compass */}
      <div className="flex flex-col gap-2 sm:gap-3">
        {/* Brand Bar */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Logo mark */}
          <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_0_8px_rgba(40,156,163,0.5)]"
            >
              <path
                d="M60 5 C59 5 58 6 58 8 C57 13 56 16 54 20 C52 24 50 26 47 29 C42 34 36 38 29 40 L25 41 L45 41 C67 41 68 41 73 40 C84 36 93 26 96 15 C97 12 98 7 98 5 L78 5 Z"
                fill="#289CA3"
              />
              <path
                d="M84 40 C83 41 81 44 80 46 C77 52 67 70 66 72 C65 74 63 78 62 81 C61 84 61 88 62 92 C63 98 67 103 72 108 L78 113 L93 84 L99 74 L97 73 C88 66 84 57 84 40 Z"
                fill="#289CA3"
              />
              <path
                d="M10 42 C7 43 4 44 2 45 L0 46 L20 80 L35 77 C44 72 54 72 63 76 C69 78 74 82 78 86 L80 88 L72 74 C68 67 63 60 60 56 C54 48 45 44 33 42 Z"
                fill="#289CA3"
              />
            </svg>
          </div>

          {/* Project Title */}
          <h1 className="text-base sm:text-xl md:text-2xl font-bold tracking-wider text-teal-400 font-sans select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            DEMO PROJECT
          </h1>
        </div>

        {/* Compass Widget */}
        <div className="pl-0.5 sm:pl-1">
          <CompassWidget rotation={rotation} onResetRotation={onResetRotation} />
        </div>
      </div>

      {/* Top Right: Layer Switcher Button */}
      <div className="relative pointer-events-auto">
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          aria-label="Map layers toggle"
          title="Toggle Map Layers"
          className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-xl text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/50 hover:bg-slate-800/90 transition-all active:scale-95 cursor-pointer"
        >
          {/* Diamond layers icon matching spacer.land top-right green icon */}
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rotate-45 border-2 border-emerald-400 bg-emerald-500/20 rounded-[3px] flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-sm" />
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {showLayerMenu && (
          <div className="absolute right-0 mt-2 w-48 sm:w-56 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/70 shadow-2xl p-2 z-30">
            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
              Map Style
            </div>
            {layers.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  onChangeLayer(l.id);
                  setShowLayerMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeLayer === l.id
                    ? 'bg-teal-500/20 text-teal-300 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{l.label}</span>
                {activeLayer === l.id && <Check className="w-3.5 h-3.5 text-teal-400" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
