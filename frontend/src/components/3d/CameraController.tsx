'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { Plot } from '@/lib/types';

interface CameraControllerProps {
  selectedPlot: Plot | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

// Map known plot positions from layout
const PLOT_COORDINATES: Record<string, [number, number, number]> = {
  Plot_001: [-44, 1.1, -36],
  Plot_002: [-44, 1.1, -18],
  Plot_003: [-44, 1.1, 0],
  Plot_004: [-44, 1.1, 18],
  Plot_005: [-44, 1.1, 36],
  Plot_006: [0, 1.1, -36],
  Plot_007: [0, 1.1, -18],
  Plot_008: [0, 1.1, 0],
  Plot_009: [0, 1.1, 18],
  Plot_010: [0, 1.1, 36],
  Plot_011: [44, 1.1, -36],
  Plot_012: [44, 1.1, -18],
  Plot_013: [44, 1.1, 0],
  Plot_014: [44, 1.1, 18],
  Plot_015: [44, 1.1, 36],
};

const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 75, 95);

export function CameraController({ selectedPlot, controlsRef }: CameraControllerProps) {
  const { camera } = useThree();
  const targetCamPos = useRef<THREE.Vector3>(DEFAULT_CAMERA_POS.clone());
  const targetLookAt = useRef<THREE.Vector3>(DEFAULT_TARGET.clone());
  const isTransitioning = useRef<boolean>(false);

  useEffect(() => {
    if (selectedPlot && PLOT_COORDINATES[selectedPlot.model_object_name]) {
      const [x, y, z] = PLOT_COORDINATES[selectedPlot.model_object_name];
      targetLookAt.current.set(x, y, z);
      // Position camera slightly offset to the south-east/elevated to view the plot
      targetCamPos.current.set(x + 20, y + 25, z + 30);
      isTransitioning.current = true;
    } else {
      targetLookAt.current.copy(DEFAULT_TARGET);
      targetCamPos.current.copy(DEFAULT_CAMERA_POS);
      isTransitioning.current = true;
    }
  }, [selectedPlot]);

  useFrame((_, delta) => {
    if (!isTransitioning.current || !controlsRef.current) return;

    const lerpFactor = Math.min(delta * 3.5, 0.15);

    // Lerp camera position
    camera.position.lerp(targetCamPos.current, lerpFactor);

    // Lerp controls target (lookAt)
    controlsRef.current.target.lerp(targetLookAt.current, lerpFactor);
    controlsRef.current.update();

    // Check if close enough to stop transition
    if (
      camera.position.distanceTo(targetCamPos.current) < 0.2 &&
      controlsRef.current.target.distanceTo(targetLookAt.current) < 0.2
    ) {
      isTransitioning.current = false;
    }
  });

  return null;
}
