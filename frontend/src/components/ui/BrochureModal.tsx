'use client';

import React from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Phone } from 'lucide-react';
import { PROJECT_DETAILS } from '@/lib/societyData';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp: () => void;
}

export function BrochureModal({ isOpen, onClose, onOpenWhatsApp }: BrochureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 pointer-events-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700/70 shadow-2xl overflow-hidden flex flex-col max-h-[88dvh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Project Brochure & Specs</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Download official project docket & master plan layout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 sm:gap-5 text-sm">
          {/* Key Specs Card */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase font-semibold">Government Approval</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> RERA Approved
              </span>
            </div>
            <div className="text-xs font-mono text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800 select-all">
              {PROJECT_DETAILS.reraNumber}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-700/30">
              <div>
                <span className="text-slate-500 block">Total Township Area</span>
                <span className="font-semibold text-slate-200">{PROJECT_DETAILS.acres}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Plotted Units</span>
                <span className="font-semibold text-slate-200">{PROJECT_DETAILS.totalPlots} Plots</span>
              </div>
              <div>
                <span className="text-slate-500 block">Road Widths</span>
                <span className="font-semibold text-slate-200">12m & 9m Internal Avenues</span>
              </div>
              <div>
                <span className="text-slate-500 block">Possession</span>
                <span className="font-semibold text-teal-400">Ready for Registry</span>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Development Highlights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'Clear Title NA/NOC residential plots',
                'Independent 7/12 land revenue records',
                'Underground power & high-speed fiber',
                'Overhead water reservoir & drainage network',
                'Lush tree plantation alongside all roads',
                'Bank loan approved from SBI, HDFC & ICICI',
              ].map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => {
                alert('Downloading Demo Project Official Brochure PDF...');
              }}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all active:scale-97 shadow-lg shadow-teal-950/50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Digital Brochure (PDF)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenWhatsApp();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Contact Sales Office</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
