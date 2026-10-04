'use client';

import React, { Suspense, useRef, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { SocietyModel } from './SocietyModel';
import { CameraController } from './CameraController';
import { Plot, PlotStatus } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export interface SocietyCanvasHandle {
  nudgePitch: (delta: number) => void;
  nudgeYaw: (delta: number) => void;
  resetView: () => void;
}

interface SocietyCanvasProps {
  plotsMap: Map<string, Plot>;
  selectedPlot: Plot | null;
  statusFilter: PlotStatus | 'ALL';
  pitchVelocity: number; // Left Gyro (-1 to +1)
  yawVelocity: number;   // Right Gyro (-1 to +1)
  onSelectPlot: (plot: Plot | null) => void;
  onHoverPlot: (plotName: string | null) => void;
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-2xl text-white">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-sm font-medium tracking-wide">Loading 3D Society Model...</p>
      </div>
    </Html>
  );
}

// Inner driver that applies gyro velocities continuously every frame
function GyroDriver({
  controlsRef,
  pitchVelocity,
  yawVelocity,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  pitchVelocity: number;
  yawVelocity: number;
}) {
  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    let hasChange = false;

    const controls = controlsRef.current as any;

    // Right Gyro: Left & Right rotation (Yaw)
    if (yawVelocity !== 0) {
      controls.rotateLeft?.(yawVelocity * delta * 2.2);
      hasChange = true;
    }

    // Left Gyro: Above & Below (Pitch)
    if (pitchVelocity !== 0) {
      controls.rotateUp?.(pitchVelocity * delta * 1.8);
      hasChange = true;
    }

    if (hasChange) {
      controlsRef.current.update();
    }
  });

  return null;
}

export const SocietyCanvas = forwardRef<SocietyCanvasHandle, SocietyCanvasProps>(
  function SocietyCanvas(
    {
      plotsMap,
      selectedPlot,
      statusFilter,
      pitchVelocity,
      yawVelocity,
      onSelectPlot,
      onHoverPlot,
    },
    ref
  ) {
    const controlsRef = useRef<OrbitControlsImpl>(null);

    useImperativeHandle(ref, () => ({
      nudgePitch: (delta: number) => {
        const controls = controlsRef.current as any;
        if (controls) {
          controls.rotateUp?.(delta);
          controls.update?.();
        }
      },
      nudgeYaw: (delta: number) => {
        const controls = controlsRef.current as any;
        if (controls) {
          controls.rotateLeft?.(delta);
          controls.update?.();
        }
      },
      resetView: () => {
        const controls = controlsRef.current as any;
        if (controls) {
          controls.reset?.();
        }
      },
    }));

    return (
      <div className="w-full h-full relative select-none">
        <Canvas
          shadows
          camera={{ position: [0, 75, 95], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          className="w-full h-full bg-slate-950"
        >
          <color attach="background" args={['#090d16']} />
          <fog attach="fog" args={['#090d16', 80, 260]} />

          {/* Cinematic Architectural Lighting */}
          <ambientLight intensity={0.65} />
          <directionalLight
            position={[60, 90, 40]}
            intensity={1.4}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={250}
            shadow-camera-left={-80}
            shadow-camera-right={80}
            shadow-camera-top={80}
            shadow-camera-bottom={-80}
            shadow-bias={-0.0005}
          />
          <directionalLight position={[-40, 50, -60]} intensity={0.4} color="#93c5fd" />
          <hemisphereLight args={['#38bdf8', '#0f172a', 0.4]} />

          <Suspense fallback={<Loader />}>
            <SocietyModel
              plotsMap={plotsMap}
              selectedPlot={selectedPlot}
              statusFilter={statusFilter}
              onSelectPlot={onSelectPlot}
              onHoverPlot={onHoverPlot}
            />
          </Suspense>

          <CameraController selectedPlot={selectedPlot} controlsRef={controlsRef} />

          <GyroDriver
            controlsRef={controlsRef}
            pitchVelocity={pitchVelocity}
            yawVelocity={yawVelocity}
          />

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.06}
            minDistance={15}
            maxDistance={180}
            maxPolarAngle={Math.PI / 2 - 0.05} // prevent camera going beneath ground
            minPolarAngle={0.08}               // allow looking almost straight down from above
          />
        </Canvas>
      </div>
    );
  }
);
