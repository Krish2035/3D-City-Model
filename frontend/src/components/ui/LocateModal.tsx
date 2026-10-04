'use client';

import React from 'react';
import { X, Navigation, MapPin, ExternalLink, Car, Clock } from 'lucide-react';
import { PROJECT_DETAILS } from '@/lib/societyData';

interface LocateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocateModal({ isOpen, onClose }: LocateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 pointer-events-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/70 shadow-2xl overflow-hidden flex flex-col max-h-[88dvh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Location & Connectivity</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Convenient access via Vadodara-Padra Road</p>
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
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-3.5 sm:gap-4 text-sm">
          {/* Address Card */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Site Address</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                DEMO PROJECT, Near Darapura Talaav, Amin Khadki, Darapura, Taluka Padra, District Vadodara, Gujarat - 391440.
              </p>
            </div>
          </div>

          {/* Landmarks List */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Strategic Proximity & Travel Times
            </h4>
            <div className="flex flex-col gap-2">
              {PROJECT_DETAILS.landmarks.map((l, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/30 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="font-semibold text-slate-200">{l.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="font-medium text-slate-300">{l.distance}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-teal-300">
                      {l.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <a
              href={PROJECT_DETAILS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all active:scale-97 shadow-lg shadow-teal-950/50 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Get Driving Directions on Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
