'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { PROJECT_DETAILS } from '@/lib/societyData';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryModal({ isOpen, onClose }: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const currentItem = PROJECT_DETAILS.gallery[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? PROJECT_DETAILS.gallery.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === PROJECT_DETAILS.gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 pointer-events-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700/70 shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Project Gallery</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Architectural visualizations & township infrastructure</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Main Image Viewport */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          <Image
            src={currentItem.src}
            alt={currentItem.title}
            fill
            className="object-cover"
            priority
          />

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-700/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Overlay Caption */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-12">
            <h4 className="text-lg font-bold text-white">{currentItem.title}</h4>
            <p className="text-xs text-slate-300 mt-1">{currentItem.subtitle}</p>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-3 p-4 bg-slate-950/60 overflow-x-auto border-t border-slate-800">
          {PROJECT_DETAILS.gallery.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                idx === currentIndex ? 'border-teal-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={item.src} alt={item.title} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
