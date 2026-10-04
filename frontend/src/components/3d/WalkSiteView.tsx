'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Compass, X, HelpCircle, ArrowUpRight, Footprints } from 'lucide-react';
import { generateSocietyPlots, SocietyPlot } from '@/lib/societyData';
import { VirtualJoystick, JoystickVector } from './VirtualJoystick';

// =========================================================================
// 1. Textures & Materials Generators
// =========================================================================

function createPlotTexture(number: number, isAvailable: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background
  ctx.fillStyle = isAvailable ? '#ded4bd' : '#93c5fd';
  ctx.fillRect(0, 0, 128, 128);

  // Border
  ctx.strokeStyle = '#5a554a';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 122, 122);

  // Plot Number
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 56px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(number), 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

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

// =========================================================================
// 2. 3D Grand Entry Gate (Aligned with 9 MT Main Road at X = -10, Z = 56)
// =========================================================================
function EntryGate3D() {
  const hazardTex = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createHazardTexture();
  }, []);

  return (
    <group position={[-10, 0, 56]}>
      {/* Central Road Island / Median Divider with yellow-black hazard stripes */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.7, 8]} />
        <meshStandardMaterial
          color="#eab308"
          roughness={0.6}
          map={hazardTex || undefined}
        />
      </mesh>

      {/* Zebra Crossing Stripes before gate */}
      <group position={[0, 0.05, 4.5]}>
        {[-3.6, -2.4, -1.2, 1.2, 2.4, 3.6].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.8, 2.6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Left Gate Pillar */}
      <mesh position={[-5.8, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 5, 1.8]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>
      {/* Left Pillar Cap & Lantern */}
      <mesh position={[-5.8, 5.2, 0]} castShadow>
        <boxGeometry args={[2.2, 0.4, 2.2]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[-5.8, 5.8, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.4} />
      </mesh>

      {/* Right Gate Pillar */}
      <mesh position={[5.8, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 5, 1.8]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>
      {/* Right Pillar Cap & Lantern */}
      <mesh position={[5.8, 5.2, 0]} castShadow>
        <boxGeometry args={[2.2, 0.4, 2.2]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[5.8, 5.8, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.4} />
      </mesh>

      {/* Decorative Wrought Iron Gates (Left & Right swung open) */}
      <group position={[-4.8, 1.8, 0]} rotation={[0, -0.65, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.6, 3.2, 0.15]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      <group position={[4.8, 1.8, 0]} rotation={[0, 0.65, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.6, 3.2, 0.15]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* Overhead Royal Blue "ENTRY" Sign Marker with Downward Pointer */}
      <group position={[0, 6.2, 0]}>
        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3.6]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.2, 1.8, 0.3]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.3} metalness={0.2} emissive="#1e40af" emissiveIntensity={0.35} />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.4, 2.0, 0.28]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        <mesh position={[0, 0, 0.18]}>
          <boxGeometry args={[4.4, 1.2, 0.05]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <mesh position={[0, -1.2, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.6, 0.8, 4]} />
          <meshStandardMaterial color="#1d4ed8" emissive="#1e40af" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// =========================================================================
// 3. 3D Road Network with Markings & Curbs
// =========================================================================
function RoadNetwork3D() {
  return (
    <group position={[0, 0.02, 0]}>
      {/* 1. Main 9 MT Spine Road (North-South through Entry Gate at X = -10) */}
      <mesh position={[-10, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[11, 126]} />
        <meshStandardMaterial color="#1e242d" roughness={0.9} />
      </mesh>

      {/* Main Spine Dashed White Lines */}
      {Array.from({ length: 26 }).map((_, i) => (
        <mesh
          key={i}
          position={[-10, 0.04, -58 + i * 4.8]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.25, 2.6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Main Spine Raised Curbs */}
      <mesh position={[-15.7, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 126]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>
      <mesh position={[-4.3, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 126]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>

      {/* 2. 12 MT Western Boulevard Road at X = -32 */}
      <mesh position={[-32, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 126]} />
        <meshStandardMaterial color="#1e242d" roughness={0.9} />
      </mesh>

      {/* Western Boulevard Dashed Centerlines */}
      {Array.from({ length: 26 }).map((_, i) => (
        <mesh
          key={i}
          position={[-32, 0.04, -58 + i * 4.8]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.28, 2.6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Western Boulevard Curbs */}
      <mesh position={[-38.2, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 126]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>
      <mesh position={[-25.8, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 126]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>

      {/* 3. 7.5 MT Cross Streets (East-West) */}
      {[-51, -38, -17, 2, 15, 36].map((z, i) => (
        <group key={i} position={[0, 0.01, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 7.5]} />
            <meshStandardMaterial color="#1e242d" roughness={0.9} />
          </mesh>

          {/* East-West Dashed White Markings */}
          {[-45, -20, 5, 25, 40].map((x, j) => (
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
// 4. Perimeter Boundary Wall
// =========================================================================
function PerimeterWall3D() {
  const wallHeight = 3.2;
  return (
    <group position={[0, 0, 0]}>
      {/* North Wall */}
      <mesh position={[0, wallHeight / 2, -63]} castShadow receiveShadow>
        <boxGeometry args={[124, wallHeight, 1.2]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>
      <mesh position={[0, wallHeight + 0.1, -63]} castShadow>
        <boxGeometry args={[125, 0.25, 1.6]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>

      {/* West Wall */}
      <mesh position={[-55, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, wallHeight, 126]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>
      <mesh position={[-55, wallHeight + 0.1, 0]} castShadow>
        <boxGeometry args={[1.6, 0.25, 127]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>

      {/* East Wall */}
      <mesh position={[55, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, wallHeight, 126]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>
      <mesh position={[55, wallHeight + 0.1, 0]} castShadow>
        <boxGeometry args={[1.6, 0.25, 127]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>

      {/* South Wall (West of Gate) */}
      <mesh position={[-34, wallHeight / 2, 63]} castShadow receiveShadow>
        <boxGeometry args={[42, wallHeight, 1.2]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>
      <mesh position={[-34, wallHeight + 0.1, 63]} castShadow>
        <boxGeometry args={[43, 0.25, 1.6]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>

      {/* South Wall (East of Gate) */}
      <mesh position={[24, wallHeight / 2, 63]} castShadow receiveShadow>
        <boxGeometry args={[60, wallHeight, 1.2]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>
      <mesh position={[24, wallHeight + 0.1, 63]} castShadow>
        <boxGeometry args={[61, 0.25, 1.6]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>
    </group>
  );
}

// =========================================================================
// 5. Decorative Street Lampposts
// =========================================================================
function Lampposts3D({ isMobile = false }: { isMobile?: boolean }) {
  const lampPositions = useMemo(() => {
    const list: [number, number, number][] = [];
    // Along Main Spine (X = -10)
    for (let z = -50; z <= 48; z += 16) {
      list.push([-16.2, 0, z]);
      list.push([-3.8, 0, z]);
    }
    // Along Western Boulevard (X = -32)
    for (let z = -50; z <= 48; z += 18) {
      list.push([-38.8, 0, z]);
      list.push([-25.2, 0, z]);
    }
    // Along Eastern Amenity Road
    for (let z = -45; z <= 30; z += 20) {
      list.push([18, 0, z]);
      list.push([42, 0, z]);
    }
    return list;
  }, []);

  return (
    <group>
      {lampPositions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0.2, 0]} castShadow={!isMobile}>
            <cylinderGeometry args={[0.25, 0.35, 0.4, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow={!isMobile}>
            <cylinderGeometry args={[0.08, 0.12, 4.6, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[x > -10 ? -0.4 : 0.4, 4.8, 0]}>
            <boxGeometry args={[0.8, 0.08, 0.08]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[x > -10 ? -0.8 : 0.8, 4.6, 0]}>
            <sphereGeometry args={[0.22, 12, 12]} />
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
// 6. Landscaped Common Park, Clubhouse & Swimming Pool
// =========================================================================
function TreesAndPark3D() {
  const treeCoords = useMemo(() => [
    // Common Park (Southeast Zone)
    [22, 0, 16], [30, 0, 18], [38, 0, 16],
    [20, 0, 28], [28, 0, 30], [36, 0, 32],
    [24, 0, 42], [32, 0, 44],
    // Boulevard Trees
    [-42, 0, -42], [-42, 0, -22], [-42, 0, -2], [-42, 0, 18], [-42, 0, 38],
    // Clubhouse area
    [40, 0, -46], [48, 0, -48], [44, 0, -36],
  ], []);

  return (
    <group>
      {/* Common Park Green Lawn (Southeast Zone) */}
      <mesh position={[30, 0.08, 28]} receiveShadow>
        <boxGeometry args={[26, 0.15, 34]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.85} />
      </mesh>

      {/* Clubhouse Building (North-East Zone) */}
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
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* 3D Trees with Trunks and Foliage */}
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
// 7. 3D Plots (Mapped from Society Data)
// =========================================================================
interface PlotsCollection3DProps {
  plots: SocietyPlot[];
  selectedPlot: SocietyPlot | null;
  hoveredPlot: SocietyPlot | null;
  onSelectPlot: (plot: SocietyPlot) => void;
  onHoverPlot: (plot: SocietyPlot | null) => void;
  isMobile?: boolean;
}

function PlotsCollection3D({
  plots,
  selectedPlot,
  hoveredPlot,
  onSelectPlot,
  onHoverPlot,
  isMobile = false,
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
                emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.35 : 0}
              />
            </mesh>

            {/* Top Plane with Plot Number */}
            {texture && (
              <mesh position={[0, slabHeight + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[sizeX * 0.94, sizeZ * 0.94]} />
                <meshBasicMaterial
                  map={texture}
                  color={isSelected ? '#38bdf8' : isHovered ? '#7dd3fc' : '#ffffff'}
                />
              </mesh>
            )}

            {/* Outline border when selected or hovered */}
            {(isSelected || isHovered) && (
              <mesh position={[0, slabHeight + 0.02, 0]}>
                <boxGeometry args={[sizeX * 1.02, 0.05, sizeZ * 1.02]} />
                <meshBasicMaterial
                  color={isSelected ? '#38bdf8' : '#ffffff'}
                  wireframe
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// =========================================================================
// 8. First-Person Walk Controller (WASD + Mouse Look + Gyro / Joysticks)
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
    // Start at Entry Gate looking north down the boulevard
    pos: new THREE.Vector3(-10, 1.8, 64),
    yaw: 0,
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

    // Right Joystick Gyro Look
    if (lookVec.x !== 0 || lookVec.y !== 0) {
      s.yaw -= lookVec.x * clampedDelta * 2.4;
      s.pitch += lookVec.y * clampedDelta * 1.8;
      s.pitch = Math.max(-1.25, Math.min(1.25, s.pitch));
    }

    const headingDeg = Math.round(THREE.MathUtils.radToDeg(-s.yaw) % 360);
    const now = performance.now();
    if (
      now - lastRotationTime.current > 120 &&
      Math.abs(headingDeg - lastReportedHeading.current) > 1.2
    ) {
      lastRotationTime.current = now;
      lastReportedHeading.current = headingDeg;
      onRotationUpdate(headingDeg);
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

    // Site boundary clamp
    s.pos.x = Math.max(-52, Math.min(52, s.pos.x));
    s.pos.z = Math.max(-60, Math.min(64, s.pos.z));
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
// 9. Main WalkSiteView Component
// =========================================================================
interface WalkSiteViewProps {
  onExitWalk: () => void;
  onOpenControlsGuide: () => void;
  onOpenWhatsApp: () => void;
}

export function WalkSiteView({
  onExitWalk,
  onOpenControlsGuide,
  onOpenWhatsApp,
}: WalkSiteViewProps) {
  const plots = useMemo(() => generateSocietyPlots(), []);

  const [moveVec, setMoveVec] = useState<JoystickVector>({ x: 0, y: 0 });
  const [lookVec, setLookVec] = useState<JoystickVector>({ x: 0, y: 0 });
  const [heading, setHeading] = useState<number>(0);

  const [selectedPlot, setSelectedPlot] = useState<SocietyPlot | null>(null);
  const [hoveredPlot, setHoveredPlot] = useState<SocietyPlot | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExitWalk();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExitWalk]);

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
        camera={{ position: [-10, 1.8, 64], fov: 60 }}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        className="w-full h-full cursor-crosshair"
      >
        <color attach="background" args={['#dce5ed']} />
        <fog attach="fog" args={['#dce5ed', 45, 140]} />

        <ambientLight intensity={isMobile ? 0.9 : 0.75} />
        <hemisphereLight args={['#bae6fd', '#fed7aa', isMobile ? 0.75 : 0.65]} />

        <directionalLight
          position={[50, 70, 40]}
          intensity={isMobile ? 1.7 : 1.5}
          castShadow={!isMobile}
          shadow-mapSize-width={isMobile ? 512 : 1024}
          shadow-mapSize-height={isMobile ? 512 : 1024}
          shadow-camera-far={200}
          shadow-camera-left={-70}
          shadow-camera-right={70}
          shadow-camera-top={70}
          shadow-camera-bottom={-70}
          shadow-bias={-0.0004}
        />

        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={!isMobile}>
          <planeGeometry args={[400, 400]} />
          <meshStandardMaterial color="#334155" roughness={0.95} />
        </mesh>

        <RoadNetwork3D />
        <EntryGate3D />
        <PerimeterWall3D />
        <Lampposts3D isMobile={isMobile} />
        <TreesAndPark3D />

        <PlotsCollection3D
          plots={plots}
          selectedPlot={selectedPlot}
          hoveredPlot={hoveredPlot}
          onSelectPlot={setSelectedPlot}
          onHoverPlot={setHoveredPlot}
          isMobile={isMobile}
        />

        <WalkCameraController
          moveVec={moveVec}
          lookVec={lookVec}
          onRotationUpdate={setHeading}
        />
      </Canvas>

      {/* ======================================================== */}
      {/* TOP HUD BAR */}
      {/* ======================================================== */}
      <div className="absolute top-4 inset-x-4 md:inset-x-6 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: Mode Badge & Quick Controls trigger */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-xl text-white">
            <Footprints className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-tight">Walk Mode (3D Street View)</span>
          </div>

          <button
            onClick={onOpenControlsGuide}
            title="View Walk Controls (WASD & Mouse)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md border border-slate-700/80 shadow-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Controls</span>
          </button>
        </div>

        {/* Center: Instruction Pill */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/75 backdrop-blur-md border border-slate-700/60 text-[11px] text-slate-300 pointer-events-auto shadow-xl">
          <span>⌨️ Use <strong className="text-white">WASD</strong> to walk</span>
          <span>•</span>
          <span>🖱️ <strong className="text-white">Click + Drag</strong> to look around</span>
          <span>•</span>
          <span>Press <strong className="text-white">Esc</strong> to exit</span>
        </div>

        {/* Right: Exit Walk Mode Button & Compass */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Compass */}
          <div
            className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-lg flex items-center justify-center transition-transform"
            title="Heading"
          >
            <Compass
              className="w-5 h-5 text-cyan-400"
              style={{ transform: `rotate(${-heading}deg)` }}
            />
          </div>

          {/* Exit Button */}
          <button
            onClick={onExitWalk}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/90 hover:bg-red-600 active:bg-red-700 text-white font-bold text-xs shadow-xl shadow-red-600/25 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Exit Walk (Esc)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SELECTED PLOT INSPECTION CARD */}
      {/* ======================================================== */}
      {selectedPlot && (
        <div className="absolute top-20 left-4 md:left-6 z-40 pointer-events-auto w-72 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl p-4 text-white animate-in slide-in-from-left duration-200">
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
      {/* DUAL CIRCULAR VIRTUAL JOYSTICKS (Visible on Touch/Mobile/Tablet) */}
      {/* ======================================================== */}
      <VirtualJoystick
        onMoveChange={setMoveVec}
        onLookChange={setLookVec}
        visible={true}
      />
    </div>
  );
}
