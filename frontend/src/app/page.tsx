'use client';

import React, { useState, useMemo } from 'react';
import { TopHeader } from '@/components/ui/TopHeader';
import { InteractiveMasterPlan } from '@/components/3d/InteractiveMasterPlan';
import { RightFloatingControls } from '@/components/ui/RightFloatingControls';
import { BottomDock } from '@/components/ui/BottomDock';
import { PlotDetailsSlideCard } from '@/components/ui/PlotDetailsSlideCard';
import { GalleryModal } from '@/components/ui/GalleryModal';
import { SearchModal } from '@/components/ui/SearchModal';
import { BrochureModal } from '@/components/ui/BrochureModal';
import { InfoModal } from '@/components/ui/InfoModal';
import { LocateModal } from '@/components/ui/LocateModal';
import { EnquiryModal } from '@/components/ui/EnquiryModal';
import { WalkControlsModal } from '@/components/ui/WalkControlsModal';
import { Township3DView } from '@/components/3d/Township3DView';
import {
  generateSocietyPlots,
  SPECIAL_ZONES,
  PROJECT_DETAILS,
  SocietyPlot,
  SpecialZone,
} from '@/lib/societyData';

export default function HomePage() {
  // Plots Data
  const plots = useMemo(() => generateSocietyPlots(), []);

  // UI Interactive States
  const [selectedPlot, setSelectedPlot] = useState<SocietyPlot | null>(null);
  const [selectedZone, setSelectedZone] = useState<SpecialZone | null>(null);
  const [showZones, setShowZones] = useState<boolean>(false);
  const [is3D, setIs3D] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [activeLayer, setActiveLayer] = useState<string>('satellite-dark');
  const [showGPS, setShowGPS] = useState<boolean>(false);

  // Modals States
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isLocateOpen, setIsLocateOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isPlotCardOpen, setIsPlotCardOpen] = useState(false);
  const [enquiryPlot, setEnquiryPlot] = useState<any | null>(null);

  // 3D Walk The Site (Street View) States
  const [isWalkMode, setIsWalkMode] = useState<boolean>(false);
  const [isWalkControlsOpen, setIsWalkControlsOpen] = useState<boolean>(false);

  // Handlers
  const handleSelectPlot = (plot: SocietyPlot | null) => {
    setSelectedPlot(plot);
    setSelectedZone(null);
    setIsPlotCardOpen(false);
  };

  const handleSelectZone = (zone: any | null) => {
    setSelectedZone(zone);
    setSelectedPlot(null);
    setIsPlotCardOpen(false);
  };

  const handleResetOrientation = () => {
    setRotation(0);
  };

  const handleResetView = () => {
    setSelectedPlot(null);
    setSelectedZone(null);
    setIsPlotCardOpen(false);
    setRotation(0);
    setIs3D(false);
    setIsWalkMode(false);
    window.dispatchEvent(new CustomEvent('reset-master-plan-view'));
  };

  const handleToggle3D = () => {
    if (is3D) {
      setIs3D(false);
    } else {
      setIs3D(true);
      setIsWalkMode(false);
    }
  };

  const handleToggleWalkMode = () => {
    if (isWalkMode) {
      setIsWalkMode(false);
    } else {
      setIsWalkMode(true);
      setIs3D(false);
      setIsWalkControlsOpen(true);
    }
  };

  const handleToggleZones = () => {
    setShowZones((prev) => !prev);
  };

  const handleOpenGPS = () => {
    setShowGPS(true);
    setTimeout(() => {
      setShowGPS(false);
    }, 6000);
  };

  const handleOpenWhatsApp = () => {
    const text = selectedPlot
      ? `Hi, I am inquiring about Plot #${selectedPlot.plotNumber} (${selectedPlot.areaM2Text} / ${selectedPlot.areaFt2Text}) at DEMO PROJECT. Please share details on pricing and availability.`
      : `Hi, I am inquiring about DEMO PROJECT plotted township in Darapura, Padra, Vadodara. Please share details on plot pricing and available units.`;
    const url = `https://wa.me/${PROJECT_DETAILS.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: PROJECT_DETAILS.name,
        text: `Explore DEMO PROJECT interactive master plan and available residential plots.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleOpenEnquiry = (item: any) => {
    setEnquiryPlot(item);
    setIsEnquiryOpen(true);
  };

  const handleZoomIn = () => {
    window.dispatchEvent(new CustomEvent('zoom-in-master-plan'));
  };

  const handleZoomOut = () => {
    window.dispatchEvent(new CustomEvent('zoom-out-master-plan'));
  };

  const is3DActive = is3D || isWalkMode;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 1. Top Header (Logo, Project Title, Compass Rose, Map Layers Switcher) */}
      {!is3DActive && (
        <TopHeader
          rotation={rotation}
          onResetRotation={handleResetOrientation}
          activeLayer={activeLayer}
          onChangeLayer={setActiveLayer}
        />
      )}

      {/* 2. Fullscreen Interactive Master Plan or 3D Township View (Aerial or Walk Mode) */}
      {is3DActive ? (
        <div className="absolute inset-0 z-0">
          <Township3DView
            initialMode={isWalkMode ? 'walk' : 'aerial'}
            onExit3D={() => {
              setIs3D(false);
              setIsWalkMode(false);
            }}
            onOpenControlsGuide={() => setIsWalkControlsOpen(true)}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <InteractiveMasterPlan
            plots={plots}
            selectedPlot={selectedPlot}
            selectedZone={selectedZone}
            showZones={showZones}
            is3D={is3D}
            rotation={rotation}
            activeLayer={activeLayer}
            showGPS={showGPS}
            onSelectPlot={handleSelectPlot}
            onSelectZone={handleSelectZone}
            onRotationChange={setRotation}
          />
        </div>
      )}

      {/* 3. Right Floating Controls (3D Toggle Pill, Walk Mode, Home Reset View, Zoom In/Out) */}
      {!is3DActive && (
        <RightFloatingControls
          is3D={is3D}
          isWalkMode={isWalkMode}
          onToggle3D={handleToggle3D}
          onToggleWalkMode={handleToggleWalkMode}
          onResetView={handleResetView}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onShare={handleShare}
        />
      )}

      {/* 4. Bottom Right Action Dock (WhatsApp CTA + Zones Toggle + 6 Nav Pills) */}
      {!is3DActive && (
        <BottomDock
          showZones={showZones}
          selectedPlot={selectedPlot}
          onToggleZones={handleToggleZones}
          onOpenGallery={() => setIsGalleryOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenGPS={handleOpenGPS}
          onOpenBrochure={() => setIsBrochureOpen(true)}
          onOpenInfo={() => {
            if (selectedPlot) {
              setIsPlotCardOpen((prev) => !prev);
            } else {
              setIsInfoOpen(true);
            }
          }}
          onOpenLocate={() => setIsLocateOpen(true)}
          onOpenWhatsApp={handleOpenWhatsApp}
          onShare={handleShare}
        />
      )}

      {/* 5. Selected Plot Details Slide-Over Card (Accessible via Info button) */}
      {isPlotCardOpen && (
        <PlotDetailsSlideCard
          plot={selectedPlot}
          zone={selectedZone}
          onClose={() => setIsPlotCardOpen(false)}
          onEnquire={handleOpenEnquiry}
        />
      )}

      {/* 6. Interactive Modals */}
      <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        plots={plots}
        onSelectPlot={handleSelectPlot}
      />

      <BrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        onOpenWhatsApp={handleOpenWhatsApp}
      />

      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        onOpenWhatsApp={handleOpenWhatsApp}
      />

      <LocateModal isOpen={isLocateOpen} onClose={() => setIsLocateOpen(false)} />

      <EnquiryModal
        plot={
          enquiryPlot
            ? {
                id: enquiryPlot.id || 1,
                project_id: 1,
                plot_number: enquiryPlot.plotNumber || enquiryPlot.name || 1,
                model_object_name: `Plot_${enquiryPlot.plotNumber || 1}`,
                area: enquiryPlot.areaSqFt || 1800,
                length: 60,
                width: 30,
                price: enquiryPlot.price || 3600000,
                status: enquiryPlot.status || 'AVAILABLE',
                facing: enquiryPlot.facing || 'East',
                corner_plot: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : null
        }
        isOpen={isEnquiryOpen}
        onClose={() => {
          setIsEnquiryOpen(false);
          setEnquiryPlot(null);
        }}
      />

      {/* 7. Walk The Site Controls Guide Modal */}
      <WalkControlsModal
        isOpen={isWalkControlsOpen}
        onClose={() => setIsWalkControlsOpen(false)}
        onStartWalk={() => setIsWalkControlsOpen(false)}
      />
    </main>
  );
}
