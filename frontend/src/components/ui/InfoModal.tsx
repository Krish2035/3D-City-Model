'use client';

import React from 'react';
import { X, Info, Shield, Trees, Car, Sparkles, Building, Phone, Mail } from 'lucide-react';
import { PROJECT_DETAILS } from '@/lib/societyData';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp: () => void;
}

export function InfoModal({ isOpen, onClose, onOpenWhatsApp }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 pointer-events-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700/70 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Project Overview & Amenities</h3>
              <p className="text-xs text-slate-400">{PROJECT_DETAILS.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-sm">
          {/* About */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">About The Scheme</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              DEMO PROJECT is a premier plotted villa enclave situated in the burgeoning Darapura-Padra corridor
              of Vadodara. Designed for modern multi-generational families, the township blends serene natural
              surroundings with cutting-edge infrastructure, underground fiber-optic cabling, wide avenue boulevards,
              and comprehensive security.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Land</span>
              <span className="text-base font-bold text-white">{PROJECT_DETAILS.acres}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Plots</span>
              <span className="text-base font-bold text-teal-400">{PROJECT_DETAILS.totalPlots} Total</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Available</span>
              <span className="text-base font-bold text-emerald-400">{PROJECT_DETAILS.availablePlots} Left</span>
            </div>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Lifestyle & Infrastructure
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PROJECT_DETAILS.amenities.map((a, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/30 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">{a.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Developer */}
          <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-800/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-teal-300 block">Sales & Project Office</span>
              <span className="text-xs text-slate-400">{PROJECT_DETAILS.phone}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenWhatsApp();
              }}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Direct Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
