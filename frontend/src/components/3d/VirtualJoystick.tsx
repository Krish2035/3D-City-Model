'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, RotateCcw } from 'lucide-react';

export interface JoystickVector {
  x: number; // -1 to +1
  y: number; // -1 to +1 (y > 0 means forward/up, y < 0 means backward/down)
}

interface VirtualJoystickProps {
  onMoveChange: (vec: JoystickVector) => void;
  onLookChange: (vec: JoystickVector) => void;
  visible?: boolean;
}

export function VirtualJoystick({
  onMoveChange,
  onLookChange,
  visible = true,
}: VirtualJoystickProps) {
  // Left Joystick State
  const leftBaseRef = useRef<HTMLDivElement>(null);
  const [leftPos, setLeftPos] = useState({ x: 0, y: 0 });
  const [leftActive, setLeftActive] = useState(false);
  const leftTouchId = useRef<number | null>(null);

  // Right Joystick State
  const rightBaseRef = useRef<HTMLDivElement>(null);
  const [rightPos, setRightPos] = useState({ x: 0, y: 0 });
  const [rightActive, setRightActive] = useState(false);
  const rightTouchId = useRef<number | null>(null);

  const maxRadius = 40; // max travel radius in pixels

  // Helper to handle vector calculation
  const updateKnob = useCallback(
    (
      clientX: number,
      clientY: number,
      baseEl: HTMLDivElement | null,
      setPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
      callback: (vec: JoystickVector) => void
    ) => {
      if (!baseEl) return;
      const rect = baseEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let dx = clientX - centerX;
      let dy = clientY - centerY;

      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }

      setPos({ x: dx, y: dy });

      // Normalized vector:
      // x: -1 to 1 (left to right)
      // y: -1 to 1 (y > 0 is forward, y < 0 is backward)
      const normX = dx / maxRadius;
      const normY = -dy / maxRadius; // invert so pushing up is positive (forward)
      callback({ x: normX, y: normY });
    },
    [maxRadius]
  );

  // -----------------------------
  // Left Joystick Pointer Handlers
  // -----------------------------
  const handleLeftPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    leftTouchId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    setLeftActive(true);
    updateKnob(e.clientX, e.clientY, leftBaseRef.current, setLeftPos, onMoveChange);
  };

  const handleLeftPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (leftTouchId.current !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();
    updateKnob(e.clientX, e.clientY, leftBaseRef.current, setLeftPos, onMoveChange);
  };

  const handleLeftPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (leftTouchId.current !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    leftTouchId.current = null;
    setLeftActive(false);
    setLeftPos({ x: 0, y: 0 });
    onMoveChange({ x: 0, y: 0 });
  };

  // ------------------------------
  // Right Joystick Pointer Handlers
  // ------------------------------
  const handleRightPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    rightTouchId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    setRightActive(true);
    updateKnob(e.clientX, e.clientY, rightBaseRef.current, setRightPos, onLookChange);
  };

  const handleRightPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (rightTouchId.current !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();
    updateKnob(e.clientX, e.clientY, rightBaseRef.current, setRightPos, onLookChange);
  };

  const handleRightPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (rightTouchId.current !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    rightTouchId.current = null;
    setRightActive(false);
    setRightPos({ x: 0, y: 0 });
    onLookChange({ x: 0, y: 0 });
  };

  if (!visible) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none z-30 select-none pb-6 px-6 md:px-12 flex justify-between items-end">
      {/* ======================================================== */}
      {/* LEFT JOYSTICK: Move Forward / Backward / Strafe Left & Right */}
      {/* ======================================================== */}
      <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
        <div
          ref={leftBaseRef}
          onPointerDown={handleLeftPointerDown}
          onPointerMove={handleLeftPointerMove}
          onPointerUp={handleLeftPointerUp}
          onPointerCancel={handleLeftPointerUp}
          className={`relative w-28 h-28 rounded-full border-2 transition-colors touch-none flex items-center justify-center cursor-grab active:cursor-grabbing backdrop-blur-md ${
            leftActive
              ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
              : 'bg-slate-900/60 border-slate-600/70 shadow-xl'
          }`}
          style={{ touchAction: 'none' }}
        >
          {/* Subtle directional indicators on the outer ring */}
          <ArrowUp className="absolute top-2 w-3.5 h-3.5 text-cyan-400/60" />
          <ArrowDown className="absolute bottom-2 w-3.5 h-3.5 text-cyan-400/60" />
          <ArrowLeft className="absolute left-2 w-3.5 h-3.5 text-cyan-400/60" />
          <ArrowRight className="absolute right-2 w-3.5 h-3.5 text-cyan-400/60" />

          {/* Central Thumb Knob */}
          <div
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform duration-75 ${
              leftActive
                ? 'bg-cyan-500 border-white text-slate-950 scale-105'
                : 'bg-slate-800/90 border-cyan-400/50 text-cyan-300'
            }`}
            style={{
              transform: `translate(${leftPos.x}px, ${leftPos.y}px)`,
              willChange: 'transform',
            }}
          >
            <div className="w-4 h-4 rounded-full bg-cyan-400/40" />
          </div>
        </div>
        <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          MOVE (WALK)
        </span>
      </div>

      {/* ======================================================== */}
      {/* RIGHT JOYSTICK: Look / Turn Left & Right (Yaw & Pitch) */}
      {/* ======================================================== */}
      <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
        <div
          ref={rightBaseRef}
          onPointerDown={handleRightPointerDown}
          onPointerMove={handleRightPointerMove}
          onPointerUp={handleRightPointerUp}
          onPointerCancel={handleRightPointerUp}
          className={`relative w-28 h-28 rounded-full border-2 transition-colors touch-none flex items-center justify-center cursor-grab active:cursor-grabbing backdrop-blur-md ${
            rightActive
              ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
              : 'bg-slate-900/60 border-slate-600/70 shadow-xl'
          }`}
          style={{ touchAction: 'none' }}
        >
          {/* Subtle directional indicators on the outer ring */}
          <ArrowUp className="absolute top-2 w-3.5 h-3.5 text-emerald-400/60" />
          <ArrowDown className="absolute bottom-2 w-3.5 h-3.5 text-emerald-400/60" />
          <RotateCcw className="absolute left-2 w-3.5 h-3.5 text-emerald-400/60" />
          <RotateCw className="absolute right-2 w-3.5 h-3.5 text-emerald-400/60" />

          {/* Central Thumb Knob */}
          <div
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform duration-75 ${
              rightActive
                ? 'bg-emerald-500 border-white text-slate-950 scale-105'
                : 'bg-slate-800/90 border-emerald-400/50 text-emerald-300'
            }`}
            style={{
              transform: `translate(${rightPos.x}px, ${rightPos.y}px)`,
              willChange: 'transform',
            }}
          >
            <div className="w-4 h-4 rounded-full bg-emerald-400/40" />
          </div>
        </div>
        <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          LOOK (GYRO)
        </span>
      </div>
    </div>
  );
}
