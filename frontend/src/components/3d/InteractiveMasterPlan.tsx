'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { SocietyPlot, SpecialZone, SPECIAL_ZONES } from '@/lib/societyData';

interface InteractiveMasterPlanProps {
  plots: SocietyPlot[];
  selectedPlot: SocietyPlot | null;
  selectedZone: SpecialZone | null;
  showZones: boolean;
  is3D: boolean;
  rotation: number;
  activeLayer: string;
  showGPS: boolean;
  onSelectPlot: (plot: SocietyPlot | null) => void;
  onSelectZone: (zone: SpecialZone | null) => void;
  onRotationChange: (rot: number) => void;
}

export function InteractiveMasterPlan({
  plots,
  selectedPlot,
  selectedZone,
  showZones,
  is3D,
  rotation,
  activeLayer,
  showGPS,
  onSelectPlot,
  onSelectZone,
  onRotationChange,
}: InteractiveMasterPlanProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic Viewport size reader
  const getViewport = () => {
    if (containerRef.current) {
      return {
        w: containerRef.current.clientWidth || window.innerWidth,
        h: containerRef.current.clientHeight || window.innerHeight,
      };
    }
    return {
      w: typeof window !== 'undefined' ? window.innerWidth : 1920,
      h: typeof window !== 'undefined' ? window.innerHeight : 912,
    };
  };

  // Calculate overview framing that fits the entire master plan on ANY screen size
  const getOverview = () => {
    const { w, h } = getViewport();
    // Master plan bounding box: x: 780..1180 (w ~ 400), y: 90..760 (h ~ 670)
    // Master plan center is (980, 425)
    const scaleForHeight = (h * 0.88) / 670;
    const scaleForWidth = (w * 0.90) / 410;
    const overviewScale = Math.min(Math.max(Math.min(scaleForHeight, scaleForWidth), 0.45), 1.2);

    const panX = w / 2 - 980 * overviewScale;
    const panY = h / 2 - 425 * overviewScale;

    return { scale: overviewScale, pan: { x: panX, y: panY } };
  };

  const [scale, setScale] = useState<number>(0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hover Tooltip State
  const [hoveredPlot, setHoveredPlot] = useState<SocietyPlot | null>(null);
  const [hoveredZone, setHoveredZone] = useState<SpecialZone | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Pan dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    }

    if (hoveredPlot || hoveredZone) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom Wheel centered on cursor
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.4), 6.5);

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const newPanX = mouseX - (mouseX - pan.x) * (newScale / scale);
    const newPanY = mouseY - (mouseY - pan.y) * (newScale / scale);

    setScale(newScale);
    setPan({ x: newPanX, y: newPanY });
  };

  // Touch Support for mobile and tablet pinch-to-zoom
  const touchStartRef = useRef<{ x: number; y: number; dist: number }>({ x: 0, y: 0, dist: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchStartRef.current.dist > 0) {
        const factor = dist / touchStartRef.current.dist;
        const newScale = Math.min(Math.max(scale * factor, 0.4), 6.5);
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const newPanX = midX - (midX - pan.x) * (newScale / scale);
        const newPanY = midY - (midY - pan.y) * (newScale / scale);
        setScale(newScale);
        setPan({ x: newPanX, y: newPanY });
        touchStartRef.current.dist = dist;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current.dist = 0;
  };

  // Fly-to and focus on plot when clicked: GUARANTEES DEAD-CENTER PLACEMENT ON ANY DEVICE
  const flyToPlot = (plot: SocietyPlot) => {
    const { w, h } = getViewport();

    // Responsive target zoom: comfortable framing for mobile, tablet, laptop
    const targetScale = w < 640 ? 3.2 : w < 1024 ? 3.6 : 4.0;

    const plotCenterX = plot.x + plot.w / 2;
    const plotCenterY = plot.y + plot.h / 2;

    // Mathematical formula to place (plotCenterX, plotCenterY) exactly at (w / 2, h / 2)
    const targetPanX = w / 2 - plotCenterX * targetScale;
    const targetPanY = h / 2 - plotCenterY * targetScale;

    setScale(targetScale);
    setPan({ x: targetPanX, y: targetPanY });
  };

  const handlePlotClick = (plot: SocietyPlot) => {
    onSelectPlot(plot);
    flyToPlot(plot);
  };

  // Watch for external selectedPlot updates (e.g. from Search modal)
  useEffect(() => {
    if (selectedPlot) {
      flyToPlot(selectedPlot);
    }
  }, [selectedPlot]);

  // Initial mount & Window resize listener: keep master plan or selected plot centered
  useEffect(() => {
    const applyFraming = () => {
      if (selectedPlot) {
        flyToPlot(selectedPlot);
      } else {
        const overview = getOverview();
        setScale(overview.scale);
        setPan(overview.pan);
      }
    };

    // Apply initial framing after mount
    applyFraming();

    const handleResize = () => {
      applyFraming();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to default overview
  const handleResetToOverview = () => {
    const overview = getOverview();
    setScale(overview.scale);
    setPan(overview.pan);
    onSelectPlot(null);
    onSelectZone(null);
  };

  // Listen to Global Custom Events for Reset, Zoom In, Zoom Out
  useEffect(() => {
    const handleReset = () => {
      handleResetToOverview();
    };

    const handleZoomIn = () => {
      const { w, h } = getViewport();
      const newScale = Math.min(scale * 1.25, 6.5);
      const newPanX = w / 2 - (w / 2 - pan.x) * (newScale / scale);
      const newPanY = h / 2 - (h / 2 - pan.y) * (newScale / scale);
      setScale(newScale);
      setPan({ x: newPanX, y: newPanY });
    };

    const handleZoomOut = () => {
      const { w, h } = getViewport();
      const newScale = Math.max(scale * 0.8, 0.4);
      const newPanX = w / 2 - (w / 2 - pan.x) * (newScale / scale);
      const newPanY = h / 2 - (h / 2 - pan.y) * (newScale / scale);
      setScale(newScale);
      setPan({ x: newPanX, y: newPanY });
    };

    window.addEventListener('reset-master-plan-view', handleReset);
    window.addEventListener('zoom-in-master-plan', handleZoomIn);
    window.addEventListener('zoom-out-master-plan', handleZoomOut);

    return () => {
      window.removeEventListener('reset-master-plan-view', handleReset);
      window.removeEventListener('zoom-in-master-plan', handleZoomIn);
      window.removeEventListener('zoom-out-master-plan', handleZoomOut);
    };
  }, [scale, pan]);

  // Filter effect for activeLayer
  const getFilterStyle = () => {
    switch (activeLayer) {
      case 'satellite-vibrant':
        return 'brightness(0.95) contrast(1.15) saturate(1.2)';
      case 'cad-blueprint':
        return 'invert(0.9) hue-rotate(185deg) contrast(1.3) brightness(0.7)';
      case 'satellite-dark':
      default:
        return 'brightness(0.85) contrast(1.1) saturate(0.9)';
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        // Clicking outside any plot deselects
        if (selectedPlot) {
          onSelectPlot(null);
        }
      }}
      className={`relative w-full h-full overflow-hidden select-none bg-[#090b0e] ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Dynamic 2D/3D Map Canvas - Origin 0 0 for exact mathematical screen centering */}
      <div
        className={`absolute left-0 top-0 w-[1920px] h-[912px] origin-top-left transition-transform duration-700 ease-out select-none pointer-events-auto ${
          is3D ? 'map-layer-3d active-3d' : ''
        }`}
        style={{
          transformOrigin: '0 0',
          transform: is3D
            ? `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${scale * 1.08}) rotateX(46deg) rotateZ(${rotation - 10}deg)`
            : `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${scale})`,
        }}
      >
          {/* 1. Authentic Satellite Base Imagery */}
          <div
            className="absolute inset-0 transition-[filter] duration-500"
            style={{ filter: getFilterStyle() }}
          >
            <Image
              src="/satellite_clean.png"
              alt="Satellite Base Map"
              fill
              priority
              quality={100}
              className="object-cover pointer-events-none select-none"
            />
          </div>

          {/* 2. Coordinate Grid Lines */}
          <div className="absolute inset-0 map-grid-overlay opacity-30 pointer-events-none" />

          {/* 3. High-Definition Vector Master Plan SVG Layer */}
          <svg
            viewBox="0 0 1920 912"
            className="absolute inset-0 w-full h-full pointer-events-auto font-sans"
            style={{ transform: 'translateZ(2px)' }}
          >
            <defs>
              <filter id="plotGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#2585f4" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* --- MASTER PLAN ASPHALT CONTOUR & ROADS --- */}
            <g className="master-plan-base">
              {/* Outer Pavement Contour enclosing the township */}
              <polygon
                points="775,90 1090,90 1180,90 1180,250 1090,290 1055,420 1070,510 1185,510 1185,720 1030,720 1000,755 810,755 775,755 775,90"
                fill="#2e3136"
                stroke="#1d2024"
                strokeWidth="2"
              />

              {/* 12 MT. WIDE ROAD (Western Boulevard along Plots 154-184) */}
              <rect x="790" y="90" width="34" height="662" fill="#383c42" />
              <text
                x="807"
                y="270"
                fill="#94a3b8"
                fontSize="8"
                fontWeight="bold"
                letterSpacing="1"
                transform="rotate(-90 807 270)"
                textAnchor="middle"
              >
                12 MT . WIDE ROAD
              </text>
              <text
                x="807"
                y="520"
                fill="#94a3b8"
                fontSize="8"
                fontWeight="bold"
                letterSpacing="1"
                transform="rotate(-90 807 520)"
                textAnchor="middle"
              >
                12 MT . WIDE ROAD
              </text>
              <text
                x="807"
                y="670"
                fill="#94a3b8"
                fontSize="8"
                fontWeight="bold"
                letterSpacing="1"
                transform="rotate(-90 807 670)"
                textAnchor="middle"
              >
                12 MT . WIDE ROAD
              </text>

              {/* 9 MT. WIDE ROAD (Central Internal Avenue) */}
              <rect x="902" y="112" width="22" height="495" fill="#383c42" />
              <text
                x="913"
                y="300"
                fill="#94a3b8"
                fontSize="7"
                fontWeight="bold"
                letterSpacing="0.8"
                transform="rotate(-90 913 300)"
                textAnchor="middle"
              >
                9 MT . WIDE ROAD
              </text>
              <text
                x="913"
                y="480"
                fill="#94a3b8"
                fontSize="7"
                fontWeight="bold"
                letterSpacing="0.8"
                transform="rotate(-90 913 480)"
                textAnchor="middle"
              >
                9 MT . WIDE ROAD
              </text>

              {/* 7.5 MT. WIDE ROADS (Horizontal Cross Avenues) */}
              {/* Cross Road 1 (below Plots 59-66) */}
              <rect x="924" y="139" width="170" height="14" fill="#383c42" />
              <text x="1005" y="149" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                7.5 MT. WIDE ROAD
              </text>

              {/* Cross Road 2 (below Block 1) */}
              <rect x="924" y="211" width="170" height="14" fill="#383c42" />
              <text x="1005" y="221" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                7.5 MT. WIDE ROAD
              </text>

              {/* Cross Road 3 (below Block 2) */}
              <rect x="924" y="285" width="170" height="14" fill="#383c42" />
              <text x="1005" y="295" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                7.5 MT. WIDE ROAD
              </text>

              {/* Cross Road 4 (below Block 3) */}
              <rect x="924" y="365" width="140" height="14" fill="#383c42" />
              <text x="990" y="375" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                7.5 MT. WIDE ROAD
              </text>

              {/* Cross Road 5 (below Block 4) */}
              <rect x="924" y="416" width="140" height="14" fill="#383c42" />
              <text x="990" y="426" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                7.5 MT. WIDE ROAD
              </text>

              {/* Cross Road 6 (above Plots 187..191) */}
              <rect x="924" y="500" width="140" height="16" fill="#383c42" />
              <text x="990" y="511" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                7.5 MT. WIDE ROAD
              </text>
            </g>

            {/* --- SPECIAL AMENITIES (Clubhouse, Pool, Common Plot) --- */}
            <g className="master-plan-zones">
              {/* 1. CLUBHOUSE & SWIMMING POOL (Top Right) */}
              <g
                className="cursor-pointer hover:brightness-110 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectZone(SPECIAL_ZONES[1]);
                }}
              >
                {/* Modern Clubhouse Structure */}
                <rect
                  x="1098"
                  y="112"
                  width="72"
                  height="126"
                  fill="#47515c"
                  stroke="#333b44"
                  strokeWidth="1.5"
                  rx="3"
                />
                {/* Balcony / Deck */}
                <rect x="1104" y="118" width="60" height="24" fill="#586472" />
                <text x="1134" y="133" fill="#cbd5e1" fontSize="5" fontWeight="bold" textAnchor="middle">
                  CLUBHOUSE
                </text>

                {/* Sparkling Swimming Pool */}
                <rect
                  x="1112"
                  y="150"
                  width="44"
                  height="72"
                  fill="#1ba4e8"
                  stroke="#0284c7"
                  strokeWidth="1.2"
                  rx="2"
                />
                <text x="1134" y="190" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">
                  POOL
                </text>
              </g>

              {/* 2. COMMON PLOT (Central Landscaped Park - Olive Green) */}
              <g
                className="cursor-pointer hover:brightness-110 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectZone(SPECIAL_ZONES[0]);
                }}
              >
                <polygon
                  points="1042,520 1175,520 1175,710 1042,710"
                  fill="#6b7d3f"
                  stroke="#4e5c2b"
                  strokeWidth="1.5"
                />
                {/* Park Title */}
                <text
                  x="1108"
                  y="620"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                  letterSpacing="0.8"
                >
                  COMMON PLOT
                </text>
                <text
                  x="1108"
                  y="635"
                  fill="#e2e8f0"
                  fontSize="5.5"
                  fontWeight="normal"
                  textAnchor="middle"
                >
                  Landscaped Garden & Park
                </text>
              </g>
            </g>

            {/* --- INDIVIDUAL PLOTS (Razor Sharp Vector Rendering) --- */}
            <g className="master-plan-plots">
              {plots.map((plot) => {
                const isSelected = selectedPlot?.id === plot.id;
                const isHovered = hoveredPlot?.id === plot.id;

                // Color palette matching spacer.land SpDemo
                let fillColor = '#cbbfa8'; // Clean architectural sand/tan
                let strokeColor = '#7c725c';
                let strokeWidth = '0.7';

                if (isSelected) {
                  fillColor = '#2585f4'; // Vibrant Royal Blue (Screenshot 3)
                  strokeColor = '#ffffff';
                  strokeWidth = '1.2';
                } else if (isHovered) {
                  fillColor = '#85b9ff';
                  strokeColor = '#1d4ed8';
                  strokeWidth = '1.0';
                } else if (showZones) {
                  fillColor =
                    plot.status === 'AVAILABLE'
                      ? '#60a5fa'
                      : plot.status === 'RESERVED'
                      ? '#f59e0b'
                      : '#6366f1';
                }

                return (
                  <g
                    key={plot.id}
                    id={`plot-${plot.plotNumber}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlotClick(plot);
                    }}
                    onMouseEnter={(e) => {
                      setHoveredPlot(plot);
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => {
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setHoveredPlot(null)}
                    className="cursor-pointer"
                  >
                    {/* Plot Box */}
                    <rect
                      x={plot.x}
                      y={plot.y}
                      width={plot.w}
                      height={plot.h}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      filter={isSelected ? 'url(#plotGlow)' : undefined}
                    />

                    {/* Content inside plot */}
                    {isSelected ? (
                      // ==========================================
                      // SELECTED PLOT (EXACT DESIGN FROM SCREENSHOT 3)
                      // ==========================================
                      <g className="pointer-events-none select-none">
                        {/* 1. Dimension Measurement Lines (Dashed White along perimeter) with Corner Ticks */}
                        {/* Top Line & Measurement */}
                        <line
                          x1={plot.x}
                          y1={plot.y - 1.2}
                          x2={plot.x + plot.w}
                          y2={plot.y - 1.2}
                          stroke="#ffffff"
                          strokeWidth="0.6"
                          strokeDasharray="2.5,1.5"
                        />
                        <line x1={plot.x} y1={plot.y - 2.8} x2={plot.x} y2={plot.y + 0.5} stroke="#ffffff" strokeWidth="0.7" />
                        <line x1={plot.x + plot.w} y1={plot.y - 2.8} x2={plot.x + plot.w} y2={plot.y + 0.5} stroke="#ffffff" strokeWidth="0.7" />
                        {plot.dimTop && (
                          <text
                            x={plot.x + plot.w / 2}
                            y={plot.y - 2.2}
                            fill="#ffffff"
                            fontSize="3.6"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {plot.dimTop}
                          </text>
                        )}

                        {/* Bottom Line & Measurement */}
                        <line
                          x1={plot.x}
                          y1={plot.y + plot.h + 1.2}
                          x2={plot.x + plot.w}
                          y2={plot.y + plot.h + 1.2}
                          stroke="#ffffff"
                          strokeWidth="0.6"
                          strokeDasharray="2.5,1.5"
                        />
                        <line x1={plot.x} y1={plot.y + plot.h - 0.5} x2={plot.x} y2={plot.y + plot.h + 2.8} stroke="#ffffff" strokeWidth="0.7" />
                        <line x1={plot.x + plot.w} y1={plot.y + plot.h - 0.5} x2={plot.x + plot.w} y2={plot.y + plot.h + 2.8} stroke="#ffffff" strokeWidth="0.7" />
                        {plot.dimBottom && (
                          <text
                            x={plot.x + plot.w / 2}
                            y={plot.y + plot.h + 4.2}
                            fill="#ffffff"
                            fontSize="3.6"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {plot.dimBottom}
                          </text>
                        )}

                        {/* Left Line & Measurement */}
                        <line
                          x1={plot.x - 1.2}
                          y1={plot.y}
                          x2={plot.x - 1.2}
                          y2={plot.y + plot.h}
                          stroke="#ffffff"
                          strokeWidth="0.6"
                          strokeDasharray="2.5,1.5"
                        />
                        <line x1={plot.x - 2.8} y1={plot.y} x2={plot.x + 0.5} y2={plot.y} stroke="#ffffff" strokeWidth="0.7" />
                        <line x1={plot.x - 2.8} y1={plot.y + plot.h} x2={plot.x + 0.5} y2={plot.y + plot.h} stroke="#ffffff" strokeWidth="0.7" />
                        {plot.dimLeft && (
                          <text
                            x={plot.x - 2.2}
                            y={plot.y + plot.h / 2}
                            fill="#ffffff"
                            fontSize="3.4"
                            fontWeight="bold"
                            textAnchor="middle"
                            transform={`rotate(-90 ${plot.x - 2.2} ${plot.y + plot.h / 2})`}
                          >
                            {plot.dimLeft}
                          </text>
                        )}

                        {/* Right Line & Measurement */}
                        <line
                          x1={plot.x + plot.w + 1.2}
                          y1={plot.y}
                          x2={plot.x + plot.w + 1.2}
                          y2={plot.y + plot.h}
                          stroke="#ffffff"
                          strokeWidth="0.6"
                          strokeDasharray="2.5,1.5"
                        />
                        <line x1={plot.x + plot.w - 0.5} y1={plot.y} x2={plot.x + plot.w + 2.8} y2={plot.y} stroke="#ffffff" strokeWidth="0.7" />
                        <line x1={plot.x + plot.w - 0.5} y1={plot.y + plot.h} x2={plot.x + plot.w + 2.8} y2={plot.y + plot.h} stroke="#ffffff" strokeWidth="0.7" />
                        {plot.dimRight && (
                          <text
                            x={plot.x + plot.w + 3.8}
                            y={plot.y + plot.h / 2}
                            fill="#ffffff"
                            fontSize="3.4"
                            fontWeight="bold"
                            textAnchor="middle"
                            transform={`rotate(90 ${plot.x + plot.w + 3.8} ${plot.y + plot.h / 2})`}
                          >
                            {plot.dimRight}
                          </text>
                        )}

                        {/* 4 CAD Corner Brackets */}
                        <path d={`M ${plot.x - 2} ${plot.y + 4} L ${plot.x - 2} ${plot.y - 2} L ${plot.x + 4} ${plot.y - 2}`} fill="none" stroke="#ffffff" strokeWidth="0.7" />
                        <path d={`M ${plot.x + plot.w + 2} ${plot.y + 4} L ${plot.x + plot.w + 2} ${plot.y - 2} L ${plot.x + plot.w - 4} ${plot.y - 2}`} fill="none" stroke="#ffffff" strokeWidth="0.7" />
                        <path d={`M ${plot.x - 2} ${plot.y + plot.h - 4} L ${plot.x - 2} ${plot.y + plot.h + 2} L ${plot.x + 4} ${plot.y + plot.h + 2}`} fill="none" stroke="#ffffff" strokeWidth="0.7" />
                        <path d={`M ${plot.x + plot.w + 2} ${plot.y + plot.h - 4} L ${plot.x + plot.w + 2} ${plot.y + plot.h + 2} L ${plot.x + plot.w - 4} ${plot.y + plot.h + 2}`} fill="none" stroke="#ffffff" strokeWidth="0.7" />

                        {/* 2. White Specifications In Center of Plot (Exact Screenshot 3) */}
                        {/* Large Plot Number */}
                        <text
                          x={plot.x + plot.w / 2}
                          y={plot.h > 24 ? plot.y + plot.h / 2 - 2.5 : plot.y + plot.h / 2 + 1}
                          textAnchor="middle"
                          fontSize={plot.h > 24 ? '8.5' : '6.5'}
                          fontWeight="bold"
                          fill="#ffffff"
                          letterSpacing="0.4"
                        >
                          {plot.plotNumber}
                        </text>

                        {/* Metric Area */}
                        {plot.h > 24 && (
                          <text
                            x={plot.x + plot.w / 2}
                            y={plot.y + plot.h / 2 + 3.2}
                            textAnchor="middle"
                            fontSize="3.8"
                            fontWeight="bold"
                            fill="#ffffff"
                          >
                            {plot.areaM2Text}
                          </text>
                        )}

                        {/* Imperial Area */}
                        {plot.h > 24 && (
                          <text
                            x={plot.x + plot.w / 2}
                            y={plot.y + plot.h / 2 + 8.2}
                            textAnchor="middle"
                            fontSize="3.8"
                            fontWeight="bold"
                            fill="#ffffff"
                          >
                            {plot.areaFt2Text}
                          </text>
                        )}
                      </g>
                    ) : (
                      // ==========================================
                      // STANDARD UNSELECTED PLOT (Crisp Black Number)
                      // ==========================================
                      <text
                        x={plot.x + plot.w / 2}
                        y={plot.y + plot.h / 2 + 2.8}
                        textAnchor="middle"
                        fontSize={plot.w > 40 ? '8.5' : plot.w > 25 ? '7' : '5.8'}
                        fontWeight="bold"
                        fill="#18181b"
                        className="pointer-events-none select-none"
                      >
                        {plot.plotNumber}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* --- GPS BEACON PIN --- */}
            {showGPS && (
              <g
                transform="translate(863, 585)"
                className="animate-in fade-in zoom-in duration-300 pointer-events-none"
              >
                <circle r="36" fill="rgba(56, 189, 248, 0.2)" className="animate-ping" />
                <circle r="20" fill="rgba(56, 189, 248, 0.4)" />
                <circle r="8" fill="#38bdf8" stroke="#ffffff" strokeWidth="2.5" />
                <text
                  x="16"
                  y="4"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                >
                  📍 Current Location (Darapura)
                </text>
              </g>
            )}
          </svg>
        </div>

      {/* Floating Information Statistics Tooltip - Placed to the Bottom-Right side of the plot */}
      {hoveredPlot && !selectedPlot && (() => {
        const screenW = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const screenH = typeof window !== 'undefined' ? window.innerHeight : 912;
        // Check if near right screen edge or bottom-right control dock area
        const isNearRight = tooltipPos.x + 230 > screenW - 20 || (tooltipPos.x + 220 > screenW - 360 && tooltipPos.y > screenH - 320);
        const isNearBottom = tooltipPos.y + 110 > screenH - 30;

        return (
          <div
            className={`fixed z-50 pointer-events-none px-3.5 py-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl text-xs animate-in fade-in zoom-in-95 duration-100 ${
              isNearRight ? '-translate-x-[110%]' : 'translate-x-5'
            } ${
              isNearBottom ? '-translate-y-[110%]' : 'translate-y-5'
            }`}
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{hoveredPlot.name}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    hoveredPlot.status === 'AVAILABLE'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : hoveredPlot.status === 'RESERVED'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-indigo-500/20 text-indigo-300'
                  }`}
                >
                  {hoveredPlot.status}
                </span>
              </div>
              <span className="text-[10px] text-slate-300">
                {hoveredPlot.areaM2Text} • {hoveredPlot.areaFt2Text}
              </span>
              <span className="text-[10px] text-teal-400 font-semibold">{hoveredPlot.dimensions}</span>
            </div>
          </div>
        );
      })()}

      {/* Bottom Map Attribution Bar */}
      <div className="absolute bottom-1 inset-x-3 pointer-events-none flex items-center justify-between text-[11px] text-slate-400 select-none z-10">
        <div className="flex items-center gap-1.5 font-bold tracking-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          <span className="text-sm font-semibold tracking-tighter opacity-90">Google</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          <span>Map Data ©2026 Imagery ©2026 Airbus, CNES / Airbus, Maxar Technologies</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Report a map error</span>
        </div>
      </div>
    </div>
  );
}
