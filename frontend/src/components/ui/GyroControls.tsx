'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  RotateCw,
  Eye,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface GyroControlsProps {
  onPitchChange: (velocity: number) => void; // -1 (up/above) to +1 (down/below)
  onYawChange: (velocity: number) => void;   // -1 (turn left) to +1 (turn right)
  onNudgePitch: (delta: number) => void;
  onNudgeYaw: (delta: number) => void;
  onResetView?: () => void;
}

export function GyroControls({
  onPitchChange,
  onYawChange,
  onNudgePitch,
  onNudgeYaw,
  onResetView,
}: GyroControlsProps) {
  // Left Gyro (Vertical / Pitch / Above-Below)
  const leftKnobRef = useRef<HTMLDivElement>(null);
  const leftStickRef = useRef<HTMLDivElement>(null);
  const [leftY, setLeftY] = useState(0);
  const isDraggingLeft = useRef(false);
  const leftStartY = useRef(0);

  // Right Gyro (Horizontal / Yaw / Left-Right)
  const rightKnobRef = useRef<HTMLDivElement>(null);
  const rightStickRef = useRef<HTMLDivElement>(null);
  const [rightX, setRightX] = useState(0);
  const isDraggingRight = useRef(false);
  const rightStartX = useRef(0);

  // Auto orbit state
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);

  // Continuous hold timer for buttons
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHolding = (action: () => void) => {
    action();
    holdIntervalRef.current = setInterval(action, 50);
  };

  const stopHolding = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  // Toggle Auto Orbit
  useEffect(() => {
    if (isAutoOrbit) {
      onYawChange(0.35); // steady slow rotate
    } else if (!isDraggingRight.current) {
      onYawChange(0);
    }
  }, [isAutoOrbit, onYawChange]);

  // LEFT GYRO DRAG HANDLERS
  const handleLeftPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingLeft.current = true;
    leftStartY.current = e.clientY;
  };

  const handleLeftPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingLeft.current) return;
    const deltaY = e.clientY - leftStartY.current;
    const clampedY = Math.max(-42, Math.min(42, deltaY));
    setLeftY(clampedY);
    // Negative deltaY means dragged UP -> rotateUp positive / negative
    const velocity = (clampedY / 42);
    onPitchChange(velocity);
  };

  const handleLeftPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingLeft.current) return;
    isDraggingLeft.current = false;
    setLeftY(0);
    onPitchChange(0);
  };

  // RIGHT GYRO DRAG HANDLERS
  const handleRightPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRight.current = true;
    rightStartX.current = e.clientX;
    if (isAutoOrbit) setIsAutoOrbit(false);
  };

  const handleRightPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRight.current) return;
    const deltaX = e.clientX - rightStartX.current;
    const clampedX = Math.max(-42, Math.min(42, deltaX));
    setRightX(clampedX);
    const velocity = (clampedX / 42);
    onYawChange(velocity);
  };

  const handleRightPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRight.current) return;
    isDraggingRight.current = false;
    setRightX(0);
    if (!isAutoOrbit) onYawChange(0);
  };

  return (
    <>
      {/* LEFT GYRO: Above & Below (Elevation/Pitch Control) */}
      <div className="absolute left-4 bottom-24 sm:bottom-28 z-20 pointer-events-auto select-none">
        <div className="flex flex-col items-center p-3 rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-slate-700/60 shadow-2xl">
          {/* Label */}
          <div className="flex items-center gap-1 mb-2 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
            <Eye className="w-3 h-3" />
            <span>View Height</span>
          </div>

          {/* Quick "Above" Button */}
          <button
            title="Move Above (High Aerial View)"
            onPointerDown={() => startHolding(() => onNudgePitch(-0.06))}
            onPointerUp={stopHolding}
            onPointerLeave={stopHolding}
            className="w-10 h-8 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:bg-emerald-500/20 text-slate-300 hover:text-white flex flex-col items-center justify-center transition border border-slate-700 shadow-sm"
          >
            <ChevronUp className="w-4 h-4 text-emerald-400" />
            <span className="text-[8px] font-bold text-slate-400">ABOVE</span>
          </button>

          {/* Gyro Track Area */}
          <div
            ref={leftKnobRef}
            onPointerDown={handleLeftPointerDown}
            onPointerMove={handleLeftPointerMove}
            onPointerUp={handleLeftPointerUp}
            onPointerCancel={handleLeftPointerUp}
            className="relative w-12 h-24 my-2 rounded-2xl bg-slate-950/80 border border-slate-700/80 flex items-center justify-center cursor-ns-resize shadow-inner overflow-hidden"
          >
            {/* Center reference ticks */}
            <div className="absolute inset-x-2 top-3 h-[1px] bg-slate-700/40" />
            <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-[1px] bg-emerald-500/40" />
            <div className="absolute inset-x-2 bottom-3 h-[1px] bg-slate-700/40" />

            {/* Draggable Gyro Knob */}
            <div
              ref={leftStickRef}
              style={{ transform: `translateY(${leftY}px)` }}
              className="w-9 h-9 rounded-xl bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20 flex flex-col items-center justify-center pointer-events-none transition-transform duration-75"
            >
              <div className="w-4 h-1 rounded-full bg-emerald-400 mb-0.5" />
              <div className="w-2 h-0.5 rounded-full bg-slate-400" />
            </div>
          </div>

          {/* Quick "Below" Button */}
          <button
            title="Move Below (Ground Level View)"
            onPointerDown={() => startHolding(() => onNudgePitch(0.06))}
            onPointerUp={stopHolding}
            onPointerLeave={stopHolding}
            className="w-10 h-8 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:bg-emerald-500/20 text-slate-300 hover:text-white flex flex-col items-center justify-center transition border border-slate-700 shadow-sm"
          >
            <span className="text-[8px] font-bold text-slate-400">BELOW</span>
            <ChevronDown className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* RIGHT GYRO: Left & Right Side View (Azimuth/Orbit Control) */}
      <div className="absolute right-4 bottom-24 sm:bottom-28 z-20 pointer-events-auto select-none">
        <div className="flex flex-col items-center p-3 rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-slate-700/60 shadow-2xl">
          {/* Label */}
          <div className="flex items-center gap-1 mb-2 text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
            <Compass className="w-3 h-3" />
            <span>360° Orbit</span>
          </div>

          {/* Gyro Track Area with Left & Right Quick Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Quick "Left Side View" Button */}
            <button
              title="Rotate to Left View"
              onPointerDown={() => startHolding(() => onNudgeYaw(-0.08))}
              onPointerUp={stopHolding}
              onPointerLeave={stopHolding}
              className="w-8 h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:bg-cyan-500/20 text-slate-300 hover:text-white flex flex-col items-center justify-center transition border border-slate-700 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span className="text-[7px] font-bold text-slate-400">LEFT</span>
            </button>

            {/* Horizontal Gyro Track */}
            <div
              ref={rightKnobRef}
              onPointerDown={handleRightPointerDown}
              onPointerMove={handleRightPointerMove}
              onPointerUp={handleRightPointerUp}
              onPointerCancel={handleRightPointerUp}
              className="relative w-24 h-12 rounded-2xl bg-slate-950/80 border border-slate-700/80 flex items-center justify-center cursor-ew-resize shadow-inner overflow-hidden"
            >
              {/* Reference ticks */}
              <div className="absolute inset-y-2 left-3 w-[1px] bg-slate-700/40" />
              <div className="absolute inset-y-1 left-1/2 -translate-x-1/2 w-[1px] bg-cyan-500/40" />
              <div className="absolute inset-y-2 right-3 w-[1px] bg-slate-700/40" />

              {/* Draggable Gyro Knob */}
              <div
                ref={rightStickRef}
                style={{ transform: `translateX(${rightX}px)` }}
                className="w-9 h-9 rounded-xl bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 flex items-center justify-center pointer-events-none transition-transform duration-75"
              >
                <div className="w-1 h-4 rounded-full bg-cyan-400" />
              </div>
            </div>

            {/* Quick "Right Side View" Button */}
            <button
              title="Rotate to Right View"
              onPointerDown={() => startHolding(() => onNudgeYaw(0.08))}
              onPointerUp={stopHolding}
              onPointerLeave={stopHolding}
              className="w-8 h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:bg-cyan-500/20 text-slate-300 hover:text-white flex flex-col items-center justify-center transition border border-slate-700 shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-cyan-400" />
              <span className="text-[7px] font-bold text-slate-400">RIGHT</span>
            </button>
          </div>

          {/* Auto Orbit Toggle */}
          <button
            onClick={() => setIsAutoOrbit(!isAutoOrbit)}
            className={`w-full mt-2 py-1.5 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition border ${
              isAutoOrbit
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10 animate-pulse'
                : 'bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-700/60'
            }`}
          >
            <RotateCw className={`w-3 h-3 ${isAutoOrbit ? 'animate-spin' : ''}`} />
            <span>{isAutoOrbit ? 'Orbiting (Tap to Stop)' : 'Auto 360° Rotate'}</span>
          </button>
        </div>
      </div>
    </>
  );
}
