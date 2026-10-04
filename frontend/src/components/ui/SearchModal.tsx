'use client';

import React, { useState, useMemo } from 'react';
import { X, Search, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import { SocietyPlot } from '@/lib/societyData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  plots: SocietyPlot[];
  onSelectPlot: (plot: SocietyPlot) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  plots,
  onSelectPlot,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'RESERVED' | 'BOOKED'>('ALL');

  const filteredPlots = useMemo(() => {
    return plots.filter((p) => {
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.plotNumber.toString().includes(query) ||
        p.facing.toLowerCase().includes(query.toLowerCase()) ||
        p.zoneLabel.toLowerCase().includes(query.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;

      return matchQuery && matchStatus;
    });
  }, [plots, query, statusFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 pointer-events-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/70 shadow-2xl overflow-hidden flex flex-col max-h-[88dvh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Search Plots & Units</h3>
            <p className="text-xs text-slate-400">Search by plot number (e.g. 54, 74, 150) or orientation</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by plot #, facing, or avenue..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-teal-400 focus:outline-none text-sm text-slate-100 placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Status Filter Badges */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {(['ALL', 'AVAILABLE', 'RESERVED', 'BOOKED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-teal-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {filteredPlots.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No plots found matching &quot;{query}&quot;
            </div>
          ) : (
            filteredPlots.map((plot) => (
              <div
                key={plot.id}
                onClick={() => {
                  onSelectPlot(plot);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 hover:border-teal-500/50 transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-teal-400 transition-colors">
                      {plot.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        plot.status === 'AVAILABLE'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : plot.status === 'RESERVED'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      {plot.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {plot.areaSqFt} sq.ft • {plot.facing} Facing • {plot.dimensions}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-teal-300">
                    ₹ {(plot.price / 100000).toFixed(2)} Lakhs
                  </div>
                  <span className="text-[10px] text-slate-500">{plot.roadWidth}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
