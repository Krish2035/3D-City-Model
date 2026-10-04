'use client';

import React from 'react';
import { X, CheckCircle, Compass, Maximize2, Tag, Calendar, Sparkles, Send } from 'lucide-react';
import { Plot } from '@/lib/types';
import { STATUS_CONFIG, formatINR } from '@/lib/constants';

interface PlotDetailsCardProps {
  plot: Plot | null;
  onClose: () => void;
  onOpenEnquiry: (plot: Plot) => void;
}

export function PlotDetailsCard({ plot, onClose, onOpenEnquiry }: PlotDetailsCardProps) {
  if (!plot) return null;

  const cfg = STATUS_CONFIG[plot.status];

  return (
    <div className="absolute top-20 right-4 z-20 w-84 sm:w-96 max-w-[calc(100vw-2rem)] pointer-events-auto animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-slate-700/70 shadow-2xl p-5 text-white flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                {plot.model_object_name}
              </span>
              {plot.corner_plot && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Corner Plot
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-0.5">
              Plot #{plot.plot_number}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status & Pricing Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Total Price
            </p>
            <p className="text-xl font-black text-emerald-400">
              {formatINR(Number(plot.price))}
            </p>
            <p className="text-[10px] text-slate-500">
              ₹ {Math.round(Number(plot.price) / Number(plot.area))} / sq.ft
            </p>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: cfg.color }}
            />
            {cfg.label}
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-700/50 text-cyan-400">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Super Area</p>
              <p className="text-sm font-bold text-slate-100">{plot.area} sq.ft</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-700/50 text-emerald-400">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Dimensions</p>
              <p className="text-sm font-bold text-slate-100">
                {plot.length} × {plot.width} ft
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-700/50 text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Facing</p>
              <p className="text-sm font-bold text-slate-100">{plot.facing}</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-700/50 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Vastu</p>
              <p className="text-sm font-bold text-slate-100">Compliant</p>
            </div>
          </div>
        </div>

        {/* Plot Description */}
        {plot.description && (
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
            {plot.description}
          </p>
        )}

        {/* Action Button */}
        <button
          onClick={() => onOpenEnquiry(plot)}
          disabled={plot.status === 'SOLD'}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition duration-200 ${
            plot.status === 'SOLD'
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/25 active:scale-[0.98]'
          }`}
        >
          <Send className="w-4 h-4" />
          {plot.status === 'SOLD' ? 'Plot Already Sold' : 'Enquire & Book Site Visit'}
        </button>
      </div>
    </div>
  );
}
