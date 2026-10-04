'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import {
  Compass,
  X,
  HelpCircle,
  ArrowUpRight,
  Footprints,
  Eye,
  Layers,
  Sparkles,
} from 'lucide-react';
import { generateSocietyPlots, SocietyPlot } from '@/lib/societyData';
import { VirtualJoystick, JoystickVector } from './VirtualJoystick';

// =========================================================================
// 1. Procedural Textures & Materials
// =========================================================================

// Plot Top Canvas Texture with crisp plot number (optimized 128x128 resolution for mobile memory)
function createPlotTexture(number: number, isAvailable: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = isAvailable ? '#ded4bd' : '#93c5fd';
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = '#5a554a';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 122, 122);

  ctx.fillStyle = '#111827';
  ctx.font = 'bold 52px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(number), 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// Hazard Yellow & Dark Stripes for Median Dividers
function createHazardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#eab308'; // yellow
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = '#1e293b'; // dark stripe
  for (let i = -128; i < 256; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 32, 0);
    ctx.lineTo(i - 32 + 128, 128);
    ctx.lineTo(i - 64 + 128, 128);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

// Stone wall texture generator for natural masonry look matching screenshots 2 & 3
function createStoneWallTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#6b6357';
  ctx.fillRect(0, 0, 256, 256);

  // Staggered stone brick mortar lines
  ctx.strokeStyle = '#3d372e';
  ctx.lineWidth = 4;

  const rows = 8;
  const rowHeight = 256 / rows;
  for (let r = 0; r <= rows; r++) {
    const y = r * rowHeight;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();

    const cols = 4;
    const colWidth = 256 / cols;
    const offset = (r % 2) * (colWidth / 2);
    for (let c = 0; c <= cols + 1; c++) {
      const x = c * colWidth - offset;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + rowHeight);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 2);
  return texture;
}

// =========================================================================
// 2. Grand ENTRY Gate (Positioned at North Entrance Area Circled in Red)
// Coordinates: X = -14.8, Z = -61.2
// =========================================================================
function EntryGate3D() {
  const hazardTex = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createHazardTexture();
  }, []);

  const stoneTex = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createStoneWallTexture();
  }, []);

  const gateX = -14.8;
  const gateZ = -61.2;

  return (
    <group position={[gateX, 0, gateZ]}>
      {/* Central Median Island with yellow/black hazard stripes */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.7, 9]} />
        <meshStandardMaterial
          color="#eab308"
          roughness={0.6}
          map={hazardTex || undefined}
        />
      </mesh>

      {/* Central 3-Arm Street Lamp on Median Island (Matching Screenshot 3) */}
      <group position={[0, 0.7, 0]}>
        <mesh position={[0, 2.8, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 5.6, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Gold Finial */}
        <mesh position={[0, 5.8, 0]}>
          <coneGeometry args={[0.2, 0.5, 8]} />
          <meshStandardMaterial color="#facc15" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Left Arm & Globe */}
        <mesh position={[-0.9, 5.0, 0]}>
          <boxGeometry args={[1.4, 0.08, 0.08]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[-1.6, 4.8, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fde047" emissiveIntensity={1.5} />
        </mesh>
        {/* Right Arm & Globe */}
        <mesh position={[0.9, 5.0, 0]}>
          <boxGeometry args={[1.4, 0.08, 0.08]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[1.6, 4.8, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fde047" emissiveIntensity={1.5} />
        </mesh>
        {/* Center Globe */}
        <mesh position={[0, 5.3, 0]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fde047" emissiveIntensity={1.6} />
        </mesh>
        <pointLight position={[0, 4.8, 0]} intensity={0.6} distance={14} color="#fef08a" />
      </group>

      {/* Zebra Crossing Stripes (on North entrance approach) */}
      <group position={[0, 0.04, -4.5]}>
        {[-3.8, -2.6, -1.4, 1.4, 2.6, 3.8].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.85, 2.8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Zebra Crossing Stripes (inside gate approach) */}
      <group position={[0, 0.04, 4.5]}>
        {[-3.8, -2.6, -1.4, 1.4, 2.6, 3.8].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.85, 2.8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Left Gate Pillar (West Pillar) */}
      <mesh position={[-6.2, 2.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 5.2, 2.0]} />
        <meshStandardMaterial
          color="#78716c"
          roughness={0.7}
          map={stoneTex || undefined}
        />
      </mesh>
      {/* Left Pillar Cap & Lantern */}
      <mesh position={[-6.2, 5.35, 0]} castShadow>
        <boxGeometry args={[2.4, 0.35, 2.4]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[-6.2, 5.9, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.5} />
      </mesh>

      {/* Right Gate Pillar (East Pillar) */}
      <mesh position={[6.2, 2.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 5.2, 2.0]} />
        <meshStandardMaterial
          color="#78716c"
          roughness={0.7}
          map={stoneTex || undefined}
        />
      </mesh>
      {/* Right Pillar Cap & Lantern */}
      <mesh position={[6.2, 5.35, 0]} castShadow>
        <boxGeometry args={[2.4, 0.35, 2.4]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[6.2, 5.9, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.5} />
      </mesh>

      {/* Decorative Wrought-Iron Open Gates */}
      <group position={[-5.1, 1.8, 0]} rotation={[0, -0.7, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.8, 3.4, 0.15]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      <group position={[5.1, 1.8, 0]} rotation={[0, 0.7, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.8, 3.4, 0.15]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Overhead Royal Blue "ENTRY" Sign Marker with Downward Pointer (Matching Screenshot 1 & 2) */}
      <group position={[0, 6.4, 0]}>
        {/* Support Post */}
        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3.6]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>

        {/* Outer White Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.6, 2.1, 0.28]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Main Blue ENTRY Banner Badge */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.4, 1.9, 0.3]} />
          <meshStandardMaterial
            color="#1d4ed8"
            roughness={0.25}
            metalness={0.2}
            emissive="#1e40af"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* White "ENTRY" Text Representation Box */}
        <mesh position={[0, 0, 0.18]}>
          <boxGeometry args={[4.4, 1.2, 0.05]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Downward Pointer Pin */}
        <mesh position={[0, -1.3, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.6, 0.9, 4]} />
          <meshStandardMaterial
            color="#1d4ed8"
            emissive="#1e40af"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 3. Perimeter Stone Boundary Wall with Opening at North Entry Gate
// =========================================================================
function PerimeterWall3D() {
  const stoneTex = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createStoneWallTexture();
  }, []);

  const wallH = 3.4;
  const gateX = -14.8;
  const gateZ = -61.2;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. North Wall - West of Gate (from X = -55 to X = -21) */}
      <mesh position={[-38, wallH / 2, gateZ]} castShadow receiveShadow>
        <boxGeometry args={[34, wallH, 1.4]} />
        <meshStandardMaterial color="#78716c" roughness={0.8} map={stoneTex || undefined} />
      </mesh>
      <mesh position={[-38, wallH + 0.12, gateZ]} castShadow>
        <boxGeometry args={[35, 0.25, 1.8]} />
        <meshStandardMaterial color="#57534e" />
      </mesh>

      {/* 2. North Wall - East of Gate (from X = -8 to X = 55) */}
      <mesh position={[23.5, wallH / 2, gateZ]} castShadow receiveShadow>
        <boxGeometry args={[63, wallH, 1.4]} />
        <meshStandardMaterial color="#78716c" roughness={0.8} map={stoneTex || undefined} />
      </mesh>
      <mesh position={[23.5, wallH + 0.12, gateZ]} castShadow>
        <boxGeometry args={[64, 0.25, 1.8]} />
        <meshStandardMaterial color="#57534e" />
      </mesh>

      {/* 3. West Wall */}
      <mesh position={[-55, wallH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, wallH, 126]} />
        <meshStandardMaterial color="#78716c" roughness={0.8} map={stoneTex || undefined} />
      </mesh>
      <mesh position={[-55, wallH + 0.12, 0]} castShadow>
        <boxGeometry args={[1.8, 0.25, 127]} />
        <meshStandardMaterial color="#57534e" />
      </mesh>

      {/* 4. East Wall */}
      <mesh position={[55, wallH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, wallH, 126]} />
        <meshStandardMaterial color="#78716c" roughness={0.8} map={stoneTex || undefined} />
      </mesh>
      <mesh position={[55, wallH + 0.12, 0]} castShadow>
        <boxGeometry args={[1.8, 0.25, 127]} />
        <meshStandardMaterial color="#57534e" />
      </mesh>

      {/* 5. South Wall */}
      <mesh position={[0, wallH / 2, 63]} castShadow receiveShadow>
        <boxGeometry args={[112, wallH, 1.4]} />
        <meshStandardMaterial color="#78716c" roughness={0.8} map={stoneTex || undefined} />
      </mesh>
      <mesh position={[0, wallH + 0.12, 63]} castShadow>
        <boxGeometry args={[113, 0.25, 1.8]} />
        <meshStandardMaterial color="#57534e" />
      </mesh>
    </group>
  );
}

// =========================================================================
// 4. 3D Road Network with Stone Curbs & Centerlines
// =========================================================================
function RoadNetwork3D() {
  const gateX = -14.8;

  return (
    <group position={[0, 0.02, 0]}>
      {/* 1. North Approach Road (Outside gate leading into township) */}
      <mesh position={[gateX, 0, -75]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 28]} />
        <meshStandardMaterial color="#1a202c" roughness={0.92} />
      </mesh>

      {/* 2. Main Central 9 MT Spine Road (South through the township from gate) */}
      <mesh position={[gateX, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[11, 126]} />
        <meshStandardMaterial color="#1a202c" roughness={0.92} />
      </mesh>

      {/* Main Spine Dashed White Centerlines */}
      {Array.from({ length: 26 }).map((_, i) => (
        <mesh
          key={i}
          position={[gateX, 0.04, -58 + i * 4.8]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.26, 2.6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Stone Curbs along Main Spine */}
      <mesh position={[gateX - 5.7, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 126]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>
      <mesh position={[gateX + 5.7, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 126]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>

      {/* 3. Western 12 MT Boulevard (at X = -34) */}
      <mesh position={[-34, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 126]} />
        <meshStandardMaterial color="#1a202c" roughness={0.92} />
      </mesh>
      {Array.from({ length: 26 }).map((_, i) => (
        <mesh
          key={i}
          position={[-34, 0.04, -58 + i * 4.8]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.28, 2.6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* 4. 7.5 MT Cross Streets (Connecting Boulevard & Spine into eastern plots) */}
      {[-51, -38, -17, 2, 15, 36].map((z, i) => (
        <group key={i} position={[0, 0.01, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 7.5]} />
            <meshStandardMaterial color="#1a202c" roughness={0.92} />
          </mesh>

          {/* East-West Dashed White Markings */}
          {[-45, -24, 0, 22, 40].map((x, j) => (
            <mesh key={j} position={[x, 0.03, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
              <planeGeometry args={[0.22, 2.4]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// =========================================================================
// 5. Ornate Street Lampposts with Glowing Spheres (Matching Screenshot 3)
// =========================================================================
function Lampposts3D({ isMobile = false }: { isMobile?: boolean }) {
  const gateX = -14.8;
  const lampPositions = useMemo(() => {
    const list: [number, number, number][] = [];
    // Along Main Spine
    for (let z = -48; z <= 48; z += 16) {
      list.push([gateX - 6.2, 0, z]);
      list.push([gateX + 6.2, 0, z]);
    }
    // Along Western Boulevard
    for (let z = -48; z <= 48; z += 18) {
      list.push([-40.5, 0, z]);
      list.push([-27.5, 0, z]);
    }
    // Along Eastern Sectors
    for (let z = -42; z <= 30; z += 20) {
      list.push([18, 0, z]);
      list.push([42, 0, z]);
    }
    return list;
  }, [gateX]);

  return (
    <group>
      {lampPositions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Base */}
          <mesh position={[0, 0.2, 0]} castShadow={!isMobile}>
            <cylinderGeometry args={[0.25, 0.35, 0.4, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
          {/* Pole */}
          <mesh position={[0, 2.5, 0]} castShadow={!isMobile}>
            <cylinderGeometry args={[0.08, 0.12, 4.6, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Gold Finial */}
          <mesh position={[0, 4.9, 0]}>
            <coneGeometry args={[0.12, 0.3, 6]} />
            <meshStandardMaterial color="#facc15" metalness={0.9} />
          </mesh>
          {/* Curved Arm */}
          <mesh position={[x > gateX ? -0.45 : 0.45, 4.5, 0]}>
            <boxGeometry args={[0.9, 0.08, 0.08]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          {/* Glowing Lantern Head (Emissive material provides realistic glow with zero GPU light calculation cost) */}
          <mesh position={[x > gateX ? -0.9 : 0.9, 4.3, 0]}>
            <sphereGeometry args={[0.24, 8, 8]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fde047"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// =========================================================================
// 6. Common Park, Trees, Clubhouse & Pool
// =========================================================================
function TreesAndPark3D() {
  const treeCoords = useMemo(
    () => [
      // Common Park
      [22, 0, 16], [30, 0, 18], [38, 0, 16],
      [20, 0, 28], [28, 0, 30], [36, 0, 32],
      [24, 0, 42], [32, 0, 44],
      // Boulevard greenery
      [-44, 0, -42], [-44, 0, -22], [-44, 0, -2], [-44, 0, 18], [-44, 0, 38],
      // Clubhouse greenery
      [42, 0, -46], [50, 0, -48], [46, 0, -36],
    ],
    []
  );

  return (
    <group>
      {/* Common Park Green Lawn */}
      <mesh position={[30, 0.08, 28]} receiveShadow>
        <boxGeometry args={[26, 0.15, 34]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.85} />
      </mesh>

      {/* Clubhouse Building */}
      <group position={[40, 0, -48]}>
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[18, 5, 12]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, 2.5, 6.05]}>
          <planeGeometry args={[14, 3.2]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh position={[0, 5.2, 0]} castShadow>
          <boxGeometry args={[19.5, 0.4, 13.5]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* Swimming Pool */}
      <group position={[40, 0, -32]}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[16, 0.2, 10]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[13, 0.15, 7.5]} />
          <meshStandardMaterial
            color="#0ea5e9"
            roughness={0.05}
            metalness={0.6}
            emissive="#0284c7"
            emissiveIntensity={0.25}
          />
        </mesh>
      </group>

      {/* 3D Trees */}
      {treeCoords.map(([tx, ty, tz], i) => (
        <group key={i} position={[tx, ty, tz]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 2.4, 6]} />
            <meshStandardMaterial color="#5c4033" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.8, 0]} castShadow>
            <coneGeometry args={[1.6, 2.2, 7]} />
            <meshStandardMaterial color="#1b4332" roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.0, 0]} castShadow>
            <coneGeometry args={[1.2, 1.8, 7]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// =========================================================================
// 7. 3D Plots with Hover Glow & Specification Text (Matching Screenshot 3)
// =========================================================================
interface PlotsCollection3DProps {
  plots: SocietyPlot[];
  selectedPlot: SocietyPlot | null;
  hoveredPlot: SocietyPlot | null;
  viewMode: 'aerial' | 'walk';
  isMobile?: boolean;
  onSelectPlot: (plot: SocietyPlot) => void;
  onHoverPlot: (plot: SocietyPlot | null) => void;
}

function PlotsCollection3D({
  plots,
  selectedPlot,
  hoveredPlot,
  viewMode,
  isMobile = false,
  onSelectPlot,
  onHoverPlot,
}: PlotsCollection3DProps) {
  const center2DX = 973;
  const center2DY = 412;
  const scaleRatio = 0.19;

  const textureCache = useMemo(() => {
    if (typeof window === 'undefined') return new Map<number, THREE.CanvasTexture>();
    const map = new Map<number, THREE.CanvasTexture>();
    plots.forEach((p) => {
      const tex = createPlotTexture(p.plotNumber, p.status === 'AVAILABLE');
      if (tex) map.set(p.plotNumber, tex);
    });
    return map;
  }, [plots]);

  return (
    <group>
      {plots.map((plot) => {
        const posX = (plot.x + plot.w / 2 - center2DX) * scaleRatio;
        const posZ = (plot.y + plot.h / 2 - center2DY) * scaleRatio;
        const sizeX = Math.max(plot.w * scaleRatio, 3.0);
        const sizeZ = Math.max(plot.h * scaleRatio, 3.8);

        const isSelected = selectedPlot?.id === plot.id;
        const isHovered = hoveredPlot?.id === plot.id;
        const texture = textureCache.get(plot.plotNumber);

        const slabHeight = isSelected ? 0.6 : isHovered ? 0.5 : 0.35;
        const posY = slabHeight / 2;

        return (
          <group
            key={plot.id}
            position={[posX, 0, posZ]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPlot(plot);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHoverPlot(plot);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              onHoverPlot(null);
              document.body.style.cursor = 'default';
            }}
          >
            {/* Raised Plot 3D Slab */}
            <mesh position={[0, posY, 0]} castShadow={!isMobile} receiveShadow={!isMobile}>
              <boxGeometry args={[sizeX, slabHeight, sizeZ]} />
              <meshStandardMaterial
                color={
                  isSelected
                    ? '#0284c7'
                    : isHovered
                    ? '#38bdf8'
                    : plot.status === 'AVAILABLE'
                    ? '#ded4bd'
                    : '#93c5fd'
                }
                roughness={0.4}
                metalness={0.05}
                emissive={
                  isSelected
                    ? new THREE.Color('#0284c7')
                    : isHovered
                    ? new THREE.Color('#38bdf8')
                    : new THREE.Color('#000000')
                }
                emissiveIntensity={isSelected ? 0.55 : isHovered ? 0.4 : 0}
              />
            </mesh>

            {/* Top Plane with Plot Number Texture */}
            {texture && (
              <mesh position={[0, slabHeight + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[sizeX * 0.94, sizeZ * 0.94]} />
                <meshBasicMaterial
                  map={texture}
                  color={isSelected ? '#38bdf8' : isHovered ? '#7dd3fc' : '#ffffff'}
                />
              </mesh>
            )}

            {/* Glowing Outline when hovered or selected */}
            {(isSelected || isHovered) && (
              <mesh position={[0, slabHeight + 0.02, 0]}>
                <boxGeometry args={[sizeX * 1.02, 0.04, sizeZ * 1.02]} />
                <meshBasicMaterial
                  color={isSelected ? '#38bdf8' : '#ffffff'}
                  wireframe
                />
              </mesh>
            )}

            {/* Floating 3D Specification Label (Matching Plot 11 in Screenshot 3) */}
            {(isSelected || isHovered) && (
              <Html
                position={[0, slabHeight + 1.8, 0]}
                center
                distanceFactor={18}
                style={{ pointerEvents: 'none' }}
              >
                <div className="flex flex-col items-center select-none text-center animate-in zoom-in-75 duration-150">
                  <div className="text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tight">
                    {plot.plotNumber}
                  </div>
                  <div className="text-[11px] font-bold text-slate-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] whitespace-nowrap">
                    {plot.dimensions}
                  </div>
                  <div className="text-[10px] font-semibold text-cyan-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] whitespace-nowrap">
                    {plot.areaSqFt} sqft
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

// =========================================================================
// 8. Ground-Level Walk Camera Controller (WASD + Mouse + Dual Joysticks)
// Starts at the North ENTRY gate (X = -14.8, Z = -66) facing South (+Z)
// =========================================================================
// Static reusable vectors to eliminate GC memory allocations inside 60fps render loop
const _forwardVec = new THREE.Vector3();
const _rightVec = new THREE.Vector3();
const _moveDirVec = new THREE.Vector3();
const _dirVec = new THREE.Vector3();
const _targetVec = new THREE.Vector3();

interface WalkCameraControllerProps {
  moveVec: JoystickVector;
  lookVec: JoystickVector;
  onRotationUpdate: (yawDegrees: number) => void;
}

function WalkCameraController({
  moveVec,
  lookVec,
  onRotationUpdate,
}: WalkCameraControllerProps) {
  const { camera, gl } = useThree();
  const lastRotationTime = useRef<number>(0);
  const lastReportedHeading = useRef<number>(0);

  const state = useRef({
    // Start outside the North ENTRY gate looking South (+Z) into the site
    pos: new THREE.Vector3(-14.8, 1.8, -66),
    yaw: Math.PI, // Facing South (+Z)
    pitch: 0,
    isDragging: false,
    prevPointerX: 0,
    prevPointerY: 0,
    keys: {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.code;
      if (k === 'KeyW' || k === 'ArrowUp') state.current.keys.forward = true;
      if (k === 'KeyS' || k === 'ArrowDown') state.current.keys.backward = true;
      if (k === 'KeyA' || k === 'ArrowLeft') state.current.keys.left = true;
      if (k === 'KeyD' || k === 'ArrowRight') state.current.keys.right = true;
      if (k === 'ShiftLeft' || k === 'ShiftRight') state.current.keys.sprint = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.code;
      if (k === 'KeyW' || k === 'ArrowUp') state.current.keys.forward = false;
      if (k === 'KeyS' || k === 'ArrowDown') state.current.keys.backward = false;
      if (k === 'KeyA' || k === 'ArrowLeft') state.current.keys.left = false;
      if (k === 'KeyD' || k === 'ArrowRight') state.current.keys.right = false;
      if (k === 'ShiftLeft' || k === 'ShiftRight') state.current.keys.sprint = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      state.current.isDragging = true;
      state.current.prevPointerX = e.clientX;
      state.current.prevPointerY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!state.current.isDragging) return;
      const dx = e.clientX - state.current.prevPointerX;
      const dy = e.clientY - state.current.prevPointerY;
      state.current.prevPointerX = e.clientX;
      state.current.prevPointerY = e.clientY;

      state.current.yaw -= dx * 0.0035;
      state.current.pitch -= dy * 0.003;
      state.current.pitch = Math.max(-1.25, Math.min(1.25, state.current.pitch));
    };

    const handlePointerUp = () => {
      state.current.isDragging = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const s = state.current;
    const clampedDelta = Math.min(delta, 0.1);

    // Right Joystick Gyro
    if (lookVec.x !== 0 || lookVec.y !== 0) {
      s.yaw -= lookVec.x * clampedDelta * 2.4;
      s.pitch += lookVec.y * clampedDelta * 1.8;
      s.pitch = Math.max(-1.25, Math.min(1.25, s.pitch));
    }

    // Throttle rotation updates to avoid 60fps React reconciliation re-renders
    const now = performance.now();
    if (now - lastRotationTime.current > 120) {
      const headingDeg = THREE.MathUtils.radToDeg(-s.yaw) % 360;
      if (Math.abs(headingDeg - lastReportedHeading.current) > 1.2) {
        lastReportedHeading.current = headingDeg;
        lastRotationTime.current = now;
        onRotationUpdate(headingDeg);
      }
    }

    let forwardInput = 0;
    let strafeInput = 0;

    if (s.keys.forward) forwardInput += 1;
    if (s.keys.backward) forwardInput -= 1;
    if (s.keys.right) strafeInput += 1;
    if (s.keys.left) strafeInput -= 1;

    if (moveVec.y !== 0) forwardInput += moveVec.y;
    if (moveVec.x !== 0) strafeInput += moveVec.x;

    const baseSpeed = s.keys.sprint ? 14.0 : 8.5;
    const speed = baseSpeed * clampedDelta;

    if (forwardInput !== 0 || strafeInput !== 0) {
      _forwardVec.set(-Math.sin(s.yaw), 0, -Math.cos(s.yaw));
      _rightVec.set(Math.cos(s.yaw), 0, -Math.sin(s.yaw));

      _moveDirVec.set(0, 0, 0);
      _moveDirVec.addScaledVector(_forwardVec, forwardInput);
      _moveDirVec.addScaledVector(_rightVec, strafeInput);
      if (_moveDirVec.lengthSq() > 0.001) {
        _moveDirVec.normalize();
        s.pos.addScaledVector(_moveDirVec, speed);
      }
    }

    // Boundaries clamp
    s.pos.x = Math.max(-52, Math.min(52, s.pos.x));
    s.pos.z = Math.max(-75, Math.min(62, s.pos.z));
    s.pos.y = 1.8;

    camera.position.copy(s.pos);

    _dirVec.set(
      -Math.sin(s.yaw) * Math.cos(s.pitch),
      Math.sin(s.pitch),
      -Math.cos(s.yaw) * Math.cos(s.pitch)
    );
    _targetVec.copy(s.pos).add(_dirVec);
    camera.lookAt(_targetVec);
  });

  return null;
}

// =========================================================================
// 9. Main Township3DView Component
// =========================================================================
interface Township3DViewProps {
  initialMode?: 'aerial' | 'walk';
  onExit3D: () => void;
  onOpenControlsGuide: () => void;
  onOpenWhatsApp: () => void;
}

export function Township3DView({
  initialMode = 'aerial',
  onExit3D,
  onOpenControlsGuide,
  onOpenWhatsApp,
}: Township3DViewProps) {
  const plots = useMemo(() => generateSocietyPlots(), []);

  const [viewMode, setViewMode] = useState<'aerial' | 'walk'>(initialMode);
  const [moveVec, setMoveVec] = useState<JoystickVector>({ x: 0, y: 0 });
  const [lookVec, setLookVec] = useState<JoystickVector>({ x: 0, y: 0 });
  const [heading, setHeading] = useState<number>(0);

  const [selectedPlot, setSelectedPlot] = useState<SocietyPlot | null>(null);
  const [hoveredPlot, setHoveredPlot] = useState<SocietyPlot | null>(null);

  const orbitControlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    setViewMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit3D();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit3D]);

  // Mobile / Tablet performance detection
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 1024 ||
        (typeof navigator !== 'undefined' &&
          /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows={!isMobile}
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        camera={
          viewMode === 'aerial'
            ? { position: [-14.8, 14, -102], fov: 48 } // Screenshot 2 angle: outside North wall looking in
            : { position: [-14.8, 1.8, -66], fov: 60 }  // Screenshot 3 angle: ground level at ENTRY gate
        }
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#dce5ed']} />
        <fog attach="fog" args={['#dce5ed', 50, 160]} />

        {/* Ambient & Architectural Sunlight */}
        <ambientLight intensity={isMobile ? 0.92 : 0.78} />
        <hemisphereLight args={['#bae6fd', '#fed7aa', isMobile ? 0.75 : 0.65]} />

        <directionalLight
          position={[50, 75, -20]}
          intensity={isMobile ? 1.4 : 1.5}
          castShadow={!isMobile}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={240}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
          shadow-bias={-0.0004}
        />

        {/* Vast Ground Terrain Plane */}
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={!isMobile}>
          <planeGeometry args={[450, 450]} />
          <meshStandardMaterial color="#334155" roughness={0.95} />
        </mesh>

        {/* Township 3D Elements */}
        <RoadNetwork3D />
        <EntryGate3D />
        <PerimeterWall3D />
        <Lampposts3D isMobile={isMobile} />
        <TreesAndPark3D />

        {/* 191 Plots */}
        <PlotsCollection3D
          plots={plots}
          selectedPlot={selectedPlot}
          hoveredPlot={hoveredPlot}
          viewMode={viewMode}
          isMobile={isMobile}
          onSelectPlot={setSelectedPlot}
          onHoverPlot={setHoveredPlot}
        />

        {/* Camera Controllers per View Mode */}
        {viewMode === 'aerial' ? (
          <OrbitControls
            ref={orbitControlsRef}
            makeDefault
            target={[-14.8, 2, -10]}
            enableDamping
            dampingFactor={0.06}
            minDistance={10}
            maxDistance={220}
            maxPolarAngle={Math.PI / 2 - 0.05} // Keep above ground
            minPolarAngle={0.08}
          />
        ) : (
          <WalkCameraController
            moveVec={moveVec}
            lookVec={lookVec}
            onRotationUpdate={setHeading}
          />
        )}
      </Canvas>

      {/* ======================================================== */}
      {/* TOP HUD BAR */}
      {/* ======================================================== */}
      {/* TOP FLOATING HUD HEADER (Responsive) */}
      {/* ======================================================== */}
      <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-6 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: 3D View Switcher & Controls Guide */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Mode Switcher Pill */}
          <div className="flex items-center p-0.5 sm:p-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-xl text-white">
            <button
              onClick={() => setViewMode('aerial')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'aerial'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3D Overview</span>
              <span className="sm:hidden">Aerial</span>
            </button>

            <button
              onClick={() => {
                setViewMode('walk');
                onOpenControlsGuide();
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'walk'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Walk Site</span>
              <span className="sm:hidden">Walk</span>
            </button>
          </div>

          {viewMode === 'walk' && (
            <button
              onClick={onOpenControlsGuide}
              title="View Walk Controls (WASD & Mouse)"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md border border-slate-700/80 shadow-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Controls</span>
            </button>
          )}
        </div>

        {/* Center: Tips */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/75 backdrop-blur-md border border-slate-700/60 text-[11px] text-slate-300 pointer-events-auto shadow-xl">
          {viewMode === 'walk' ? (
            <>
              <span>⌨️ Use <strong className="text-white">WASD</strong> to walk</span>
              <span>•</span>
              <span>🖱️ <strong className="text-white">Click + Drag</strong> to look around</span>
              <span>•</span>
              <span>Press <strong className="text-white">Esc</strong> to exit</span>
            </>
          ) : (
            <>
              <span>🖱️ <strong className="text-white">Left Click + Drag</strong> to rotate</span>
              <span>•</span>
              <span><strong className="text-white">Right Click + Drag</strong> to pan</span>
              <span>•</span>
              <span><strong className="text-white">Scroll</strong> to zoom</span>
            </>
          )}
        </div>

        {/* Right: Compass & Exit Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {viewMode === 'walk' && (
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-lg flex items-center justify-center transition-transform"
              title="Heading"
            >
              <Compass
                className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400"
                style={{ transform: `rotate(${-heading}deg)` }}
              />
            </div>
          )}

          <button
            onClick={onExit3D}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-red-600 text-slate-200 hover:text-white font-bold text-xs border border-slate-700/80 shadow-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit 3D (Esc)</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SELECTED PLOT INSPECTION CARD */}
      {/* ======================================================== */}
      {selectedPlot && (
        <div className="absolute top-16 sm:top-20 left-3 sm:left-6 right-3 sm:right-auto z-40 pointer-events-auto w-auto sm:w-72 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl p-3.5 sm:p-4 text-white animate-in slide-in-from-left duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-cyan-400">{selectedPlot.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                {selectedPlot.status}
              </span>
            </div>
            <button
              onClick={() => setSelectedPlot(null)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 text-xs text-slate-300 mb-3">
            <p>
              Area: <strong className="text-white">{selectedPlot.areaSqFt} ft²</strong> ({selectedPlot.areaM2Text})
            </p>
            <p>
              Dimensions: <strong className="text-white">{selectedPlot.dimensions}</strong>
            </p>
            <p>
              Facing: <strong className="text-white">{selectedPlot.facing}</strong>
            </p>
          </div>

          <button
            onClick={onOpenWhatsApp}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
          >
            <span>Inquire About This Plot</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* DUAL CIRCULAR VIRTUAL JOYSTICKS (In Walk Mode) */}
      {/* ======================================================== */}
      {viewMode === 'walk' && (
        <VirtualJoystick
          onMoveChange={setMoveVec}
          onLookChange={setLookVec}
          visible={true}
        />
      )}
    </div>
  );
}
