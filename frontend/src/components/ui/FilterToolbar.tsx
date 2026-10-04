'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { Plot } from '@/lib/types';

interface FilterToolbarProps {
  plots: Plot[];
  selectedPlot: Plot | null;
  onSelectPlot: (plot: Plot | null) => void;
}

export function FilterToolbar({ plots, selectedPlot, onSelectPlot }: FilterToolbarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filtered = plots.filter((p) => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return true;
    return (
      p.plot_number.toString().includes(s) ||
      p.model_object_name.toLowerCase().includes(s) ||
      p.facing.toLowerCase().includes(s)
    );
  });

  return (
    <div className="absolute top-20 left-4 z-20 pointer-events-auto">
      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 shadow-xl w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Plot (e.g. 1 or Plot_005)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setIsOpen(false);
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Dropdown suggestions */}
        {isOpen && filtered.length > 0 && (
          <div className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto rounded-xl bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 shadow-2xl p-1.5 z-30">
            {filtered.map((plot) => {
              const isSelected = selectedPlot?.id === plot.id;
              return (
                <button
                  key={plot.id}
                  onClick={() => {
                    onSelectPlot(plot);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Plot #{plot.plot_number}</span>
                    <span className="text-[10px] text-slate-400">({plot.area} sq.ft)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{plot.facing}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
