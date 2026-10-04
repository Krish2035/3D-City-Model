'use client';

import React from 'react';
import {
  Image as GalleryIcon,
  Search,
  Crosshair,
  BookOpen,
  Info,
  Navigation,
  Share2,
} from 'lucide-react';

interface BottomDockProps {
  showZones: boolean;
  selectedPlot?: { plotNumber: number } | null;
  onToggleZones: () => void;
  onOpenGallery: () => void;
  onOpenSearch: () => void;
  onOpenGPS: () => void;
  onOpenBrochure: () => void;
  onOpenInfo: () => void;
  onOpenLocate: () => void;
  onOpenWhatsApp: () => void;
  onShare: () => void;
}

export function BottomDock({
  showZones,
  selectedPlot,
  onToggleZones,
  onOpenGallery,
  onOpenSearch,
  onOpenGPS,
  onOpenBrochure,
  onOpenInfo,
  onOpenLocate,
  onOpenWhatsApp,
  onShare,
}: BottomDockProps) {
  return (
    <div className="absolute right-4 md:right-6 bottom-4 md:bottom-7 z-20 flex flex-col items-end gap-2.5 pointer-events-auto max-w-[340px] sm:max-w-[380px]">
      {/* WhatsApp CTA & Share Row */}
      <div className="flex items-center gap-2">
        {/* WhatsApp Pill */}
        <button
          onClick={onOpenWhatsApp}
          title="Inquire on WhatsApp"
          className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#12161f] hover:bg-slate-800 backdrop-blur-xl border border-slate-700/80 hover:border-emerald-500/50 shadow-[0_8px_25px_rgba(0,0,0,0.7)] transition-all active:scale-97 cursor-pointer group"
        >
          {/* WhatsApp Icon */}
          <div className="w-6 h-6 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12.031 2c-5.508 0-9.985 4.477-9.985 9.985 0 1.761.459 3.479 1.331 4.992l-1.414 5.163 5.297-1.389c1.464.798 3.114 1.218 4.771 1.218 5.508 0 9.985-4.477 9.985-9.985s-4.477-9.984-9.985-9.984zm0 18.283c-1.503 0-2.981-.405-4.275-1.171l-.307-.183-3.178.833.848-3.097-.201-.321c-.843-1.341-1.288-2.898-1.288-4.502 0-4.57 3.718-8.288 8.288-8.288s8.288 3.718 8.288 8.288-3.718 8.288-8.288 8.288zm4.542-6.208c-.249-.125-1.472-.726-1.7-.809-.229-.083-.395-.125-.562.125s-.644.809-.79 1-.291.167-.54.042c-.249-.125-1.053-.388-2.006-1.238-.741-.661-1.242-1.477-1.387-1.726-.146-.249-.015-.384.109-.508.112-.112.249-.291.374-.437.125-.146.166-.249.249-.416.083-.167.042-.312-.021-.437s-.562-1.353-.77-1.853c-.203-.488-.409-.422-.562-.43l-.479-.008c-.166 0-.437.062-.665.312s-.874.853-.874 2.081c0 1.228.895 2.414 1.019 2.581.125.167 1.761 2.689 4.267 3.771.596.257 1.061.411 1.424.526.598.19 1.143.163 1.574.099.48-.072 1.472-.602 1.68-1.185.208-.583.208-1.082.146-1.185-.062-.104-.229-.167-.478-.292z" />
            </svg>
          </div>

          {/* Text column */}
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs font-bold text-white tracking-wide">WhatsApp</span>
            <span className="text-[10px] text-slate-300 font-normal">
              {selectedPlot ? `Inquire plot ${selectedPlot.plotNumber}` : 'Inquire project'}
            </span>
          </div>
        </button>

        {/* Share Icon Button */}
        <button
          onClick={onShare}
          title="Share Project"
          aria-label="Share Project"
          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900/85 hover:bg-slate-800/95 backdrop-blur-xl border border-slate-700/60 hover:border-slate-500 shadow-xl text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Glassmorphic Dock */}
      <div className="w-full rounded-2xl bg-[#12161f] backdrop-blur-3xl border border-slate-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.8)] p-2.5 flex flex-col gap-2">
        {/* Top Row: Zones Switch */}
        <div className="flex items-center justify-between px-2.5 py-1">
          <span className="text-xs font-semibold text-slate-200 tracking-wide select-none">
            Zones
          </span>
          {/* Toggle Switch */}
          <button
            onClick={onToggleZones}
            role="switch"
            aria-checked={showZones}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              showZones ? 'bg-teal-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                showZones ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Action Buttons Grid (3 x 2) */}
        <div className="grid grid-cols-3 gap-1.5">
          {/* Gallery */}
          <button
            onClick={onOpenGallery}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/50 hover:border-slate-500/70 text-slate-200 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
          >
            <GalleryIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Gallery</span>
          </button>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/50 hover:border-slate-500/70 text-slate-200 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search</span>
          </button>

          {/* GPS */}
          <button
            onClick={onOpenGPS}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/50 hover:border-slate-500/70 text-slate-200 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5 text-slate-400" />
            <span>GPS</span>
          </button>

          {/* Brochure */}
          <button
            onClick={onOpenBrochure}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/50 hover:border-slate-500/70 text-slate-200 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Brochure</span>
          </button>

          {/* Info */}
          <button
            onClick={onOpenInfo}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/50 hover:border-slate-500/70 text-slate-200 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Info</span>
          </button>

          {/* Locate */}
          <button
            onClick={onOpenLocate}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/50 hover:border-slate-500/70 text-slate-200 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-slate-400" />
            <span>Locate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
