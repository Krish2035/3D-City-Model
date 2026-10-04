'use client';

import React from 'react';
import { X, MapPin, Compass, ArrowUpRight, CheckCircle2, Phone, Calendar } from 'lucide-react';
import { SocietyPlot, SpecialZone, PROJECT_DETAILS } from '@/lib/societyData';

interface PlotDetailsSlideCardProps {
  plot: SocietyPlot | null;
  zone: SpecialZone | null;
  onClose: () => void;
  onEnquire: (item: SocietyPlot | SpecialZone) => void;
}

export function PlotDetailsSlideCard({
  plot,
  zone,
  onClose,
  onEnquire,
}: PlotDetailsSlideCardProps) {
  if (!plot && !zone) return null;

  const isZone = !plot && !!zone;

  const title = isZone ? zone.name : plot?.name;
  const status = isZone ? zone.status : plot?.status;
  const area = isZone ? zone.area : `${plot?.areaSqFt.toLocaleString()} sq.ft (${plot?.areaSqM} sq.m)`;
  const dimensions = isZone ? 'Full Master Zone' : plot?.dimensions;
  const facing = isZone ? 'Multi-facing' : `${plot?.facing} Facing`;
  const roadWidth = isZone ? zone.road : plot?.roadWidth;
  const price = isZone ? 'Available on Request' : `₹ ${plot?.price.toLocaleString('en-IN')}`;
  const description = isZone ? zone.description : plot?.description;

  const handleWhatsAppDirect = () => {
    const text = isZone
      ? `Hi, I am interested in inquiring about ${zone.name} (${zone.area}) at Demo Project.`
      : `Hi, I am interested in Plot #${plot?.plotNumber} (${plot?.areaSqFt} sq.ft, ${plot?.facing} facing) at Demo Project. Please share pricing and availability details.`;
    const url = `https://wa.me/${PROJECT_DETAILS.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="absolute left-4 md:left-6 bottom-4 md:bottom-7 z-30 w-[calc(100vw-32px)] sm:w-96 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 shadow-2xl p-5 text-slate-100 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-300 pointer-events-auto">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                status === 'AVAILABLE'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : status === 'RESERVED'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              }`}
            >
              {status}
            </span>
            <span className="text-[11px] text-teal-400 font-semibold tracking-wide">
              {isZone ? 'Master Zoning' : plot?.zoneLabel}
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
        </div>

        <button
          onClick={onClose}
          aria-label="Close plot details"
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed">{description}</p>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            Plot Area
          </span>
          <span className="font-semibold text-slate-100">{area}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            Dimensions
          </span>
          <span className="font-semibold text-slate-100">{dimensions}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            Orientation
          </span>
          <span className="font-semibold text-teal-400">{facing}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
            Access Road
          </span>
          <span className="font-semibold text-slate-100">{roadWidth}</span>
        </div>
      </div>

      {/* Price Banner */}
      <div className="flex items-baseline justify-between px-1">
        <span className="text-xs text-slate-400 font-medium">Estimated Value</span>
        <span className="text-lg font-bold text-teal-300 tracking-tight">{price}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleWhatsAppDirect}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all active:scale-97 shadow-lg shadow-emerald-950/40 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12.031 2c-5.508 0-9.985 4.477-9.985 9.985 0 1.761.459 3.479 1.331 4.992l-1.414 5.163 5.297-1.389c1.464.798 3.114 1.218 4.771 1.218 5.508 0 9.985-4.477 9.985-9.985s-4.477-9.984-9.985-9.984zm0 18.283c-1.503 0-2.981-.405-4.275-1.171l-.307-.183-3.178.833.848-3.097-.201-.321c-.843-1.341-1.288-2.898-1.288-4.502 0-4.57 3.718-8.288 8.288-8.288s8.288 3.718 8.288 8.288-3.718 8.288-8.288 8.288z" />
          </svg>
          <span>WhatsApp Enquiry</span>
        </button>

        <button
          onClick={() => onEnquire((plot || zone)!)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-97 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-teal-400" />
          <span>Book Visit</span>
        </button>
      </div>
    </div>
  );
}
