'use client';

import React, { useMemo, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Plot, PlotStatus } from '@/lib/types';
import { STATUS_CONFIG } from '@/lib/constants';

interface SocietyModelProps {
  plotsMap: Map<string, Plot>;
  selectedPlot: Plot | null;
  statusFilter: PlotStatus | 'ALL';
  onSelectPlot: (plot: Plot | null) => void;
  onHoverPlot: (plotName: string | null) => void;
}

export function SocietyModel({
  plotsMap,
  selectedPlot,
  statusFilter,
  onSelectPlot,
  onHoverPlot,
}: SocietyModelProps) {
  const { scene } = useGLTF('/models/society.glb');
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  // Clone scene so we can modify materials dynamically per plot status
  const clonedScene = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  // Update materials on every status change or selection
  useMemo(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name || mesh.parent?.name || '';

        if (name.startsWith('Plot_')) {
          const plot = plotsMap.get(name);
          const isSelected = selectedPlot?.model_object_name === name;
          const isHovered = hoveredName === name;
          const status = plot?.status || 'AVAILABLE';
          const cfg = STATUS_CONFIG[status];

          const isFilteredOut = statusFilter !== 'ALL' && plot && plot.status !== statusFilter;

          const baseColor = new THREE.Color(cfg.color);
          const emissiveColor = isSelected
            ? new THREE.Color('#38bdf8')
            : isHovered
            ? new THREE.Color('#67e8f9')
            : new THREE.Color('#000000');

          const emissiveIntensity = isSelected ? 0.65 : isHovered ? 0.45 : 0;

          const material = new THREE.MeshStandardMaterial({
            color: isFilteredOut ? new THREE.Color('#334155') : baseColor,
            roughness: 0.35,
            metalness: 0.1,
            emissive: emissiveColor,
            emissiveIntensity: emissiveIntensity,
            transparent: isFilteredOut,
            opacity: isFilteredOut ? 0.35 : 1.0,
          });

          mesh.material = material;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        } else if (name === 'Ground') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#0f172a'),
            roughness: 0.9,
            metalness: 0.05,
          });
          mesh.receiveShadow = true;
        } else if (name === 'Roads') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#1e293b'),
            roughness: 0.85,
            metalness: 0.1,
          });
          mesh.receiveShadow = true;
        } else if (name === 'Road_Markings') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#f8fafc'),
            roughness: 0.3,
            metalness: 0.0,
          });
        } else if (name === 'Curbs') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#64748b'),
            roughness: 0.7,
            metalness: 0.1,
          });
          mesh.receiveShadow = true;
        } else if (name === 'Community_Park') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#166534'),
            roughness: 0.8,
            metalness: 0.05,
          });
          mesh.receiveShadow = true;
        }
      }
    });
  }, [clonedScene, plotsMap, selectedPlot, hoveredName, statusFilter]);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    const name = mesh.name || mesh.parent?.name || '';
    if (name.startsWith('Plot_')) {
      document.body.style.cursor = 'pointer';
      setHoveredName(name);
      onHoverPlot(name);
    }
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'default';
    setHoveredName(null);
    onHoverPlot(null);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    const name = mesh.name || mesh.parent?.name || '';
    if (name.startsWith('Plot_')) {
      const plot = plotsMap.get(name);
      if (plot) {
        onSelectPlot(plot);
      }
    } else {
      onSelectPlot(null);
    }
  };

  return (
    <primitive
      object={clonedScene}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      onPointerMissed={() => onSelectPlot(null)}
    />
  );
}

useGLTF.preload('/models/society.glb');
