'use client';

import React from 'react';
import { Plot, PlotStatus } from '@/lib/types';
import { STATUS_CONFIG } from '@/lib/constants';

interface LegendBarProps {
  plots: Plot[];
  currentFilter: PlotStatus | 'ALL';
  onFilterChange: (status: PlotStatus | 'ALL') => void;
}

export function LegendBar({ plots, currentFilter, onFilterChange }: LegendBarProps) {
  const counts = {
    AVAILABLE: plots.filter((p) => p.status === 'AVAILABLE').length,
    RESERVED: plots.filter((p) => p.status === 'RESERVED').length,
    BOOKED: plots.filter((p) => p.status === 'BOOKED').length,
    SOLD: plots.filter((p) => p.status === 'SOLD').length,
  };

  const statuses: PlotStatus[] = ['AVAILABLE', 'RESERVED', 'BOOKED', 'SOLD'];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl overflow-x-auto max-w-[95vw]">
        {/* All Filter Button */}
        <button
          onClick={() => onFilterChange('ALL')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            currentFilter === 'ALL'
              ? 'bg-slate-700 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <span>All Plots</span>
          <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-slate-800 text-slate-300">
            {plots.length}
          </span>
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-1" />

        {/* Status Filter Buttons */}
        {statuses.map((status) => {
          const cfg = STATUS_CONFIG[status];
          const isSelected = currentFilter === status;
          return (
            <button
              key={status}
              onClick={() => onFilterChange(isSelected ? 'ALL' : status)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                isSelected
                  ? `${cfg.bgClass} ${cfg.textClass} border ${cfg.borderClass} font-semibold shadow-md`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: cfg.color }}
              />
              <span className="capitalize">{cfg.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-slate-900/60' : 'bg-slate-800/80 text-slate-400'
                }`}
              >
                {counts[status]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
