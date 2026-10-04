'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Compass, Layers, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  projectName?: string;
  location?: string;
  totalPlots?: number;
  availablePlots?: number;
  onResetView?: () => void;
}

export function Navbar({
  projectName = 'The Heritage Palms',
  location = 'Greenfield Corridor, Sector 42',
  totalPlots = 15,
  availablePlots = 8,
  onResetView,
}: NavbarProps) {
  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 shadow-xl pointer-events-auto">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
          <Box className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight leading-none">
              {projectName}
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              3D Live
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            <Compass className="w-3 h-3 text-slate-500" />
            {location}
          </p>
        </div>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {onResetView && (
          <button
            onClick={onResetView}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 hover:border-slate-500 text-slate-200 hover:text-white text-xs font-medium transition shadow-lg"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Reset Camera
          </button>
        )}

        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 text-xs text-slate-300 shadow-lg">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Available: <strong className="text-emerald-400">{availablePlots}</strong> / {totalPlots}
          </span>
        </div>

        <Link
          href="/admin"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-600/60 text-xs font-semibold text-white transition shadow-lg hover:shadow-cyan-500/10"
        >
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Admin Portal
        </Link>
      </div>
    </header>
  );
}
