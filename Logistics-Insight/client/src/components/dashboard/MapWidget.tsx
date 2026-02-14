import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Maximize2, MapPin, Search, ZoomIn, ZoomOut, RotateCcw, ShieldCheck } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function MapWidget() {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Mock markers
  const markers = [
    { id: 1, x: 25, y: 35, type: "ship", status: "transit", label: "Atlantic Express", owner: "Maersk Logistics" },
    { id: 2, x: 65, y: 45, type: "plane", status: "delayed", label: "Cargo Flight 402", owner: "FedEx Global" },
    { id: 3, x: 75, y: 25, type: "truck", status: "arrived", label: "Shanghai Hub", owner: "Miro Operations" },
    { id: 4, x: 45, y: 30, type: "ship", status: "risk", label: "Mediterranean Vessel", owner: "Hapag-Lloyd" },
    { id: 5, x: 70, y: 55, type: "ship", status: "transit", label: "PH Science High Vessel", owner: "PSHS System" },
  ];

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));
  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <Card className="col-span-1 lg:col-span-2 row-span-2 h-[500px] relative overflow-hidden border-border/50 bg-[#1a1d21] group select-none">
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border flex items-center gap-2 shadow-lg">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Blockchain Secured Nodes</span>
        </div>
        <div className="bg-background/80 backdrop-blur-md p-1 rounded-lg border border-border flex flex-col gap-1 shadow-lg">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleZoomIn}><ZoomIn className="size-4" /></Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleZoomOut}><ZoomOut className="size-4" /></Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleReset}><RotateCcw className="size-4" /></Button>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <div className="bg-primary/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary/30 flex items-center gap-2 shadow-lg">
          <ShieldCheck className="size-4 text-primary" />
          <span className="text-[10px] font-bold text-primary">AI PREDICTIVE ACTIVE</span>
        </div>
      </div>

      {/* Zoomable/Draggable Map Container */}
      <motion.div 
        ref={mapRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        drag
        dragConstraints={{ left: -500 * (zoom-1), right: 500 * (zoom-1), top: -250 * (zoom-1), bottom: 250 * (zoom-1) }}
        style={{ scale: zoom }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Abstract World Map Background */}
        <div className="absolute inset-0 opacity-40 grayscale invert contrast-125 mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center bg-no-repeat" />
        
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#4b5563 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />

        {/* Dynamic Markers */}
        {markers.map((marker) => (
          <motion.div 
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            whileHover={{ scale: 1.2 }}
            onClick={() => setActiveMarker(activeMarker === marker.id ? null : marker.id)}
          >
            {/* Visual indicator */}
            <div className={`relative size-4 rounded-full border-2 border-background shadow-2xl flex items-center justify-center ${
               marker.status === 'risk' ? 'bg-red-500' : 
               marker.status === 'delayed' ? 'bg-amber-500' : 'bg-primary'
            }`}>
              <div className="absolute -inset-3 rounded-full bg-inherit opacity-20 animate-ping" />
            </div>

            {/* Label */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background/90 backdrop-blur px-1.5 py-0.5 rounded text-[8px] font-bold border border-border">
              {marker.label}
            </div>

            {/* Ship Detail Popup */}
            {activeMarker === marker.id && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-56 bg-card border border-primary/30 p-3 rounded-xl shadow-2xl z-50 pointer-events-auto">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-[9px] uppercase tracking-tighter bg-primary/10 text-primary border-primary/20">
                    Blockchain Verified
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">#{marker.id}00X9</span>
                </div>
                <h4 className="text-sm font-bold mb-0.5">{marker.label}</h4>
                <p className="text-[10px] text-muted-foreground mb-3">{marker.owner}</p>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Coordinates:</span>
                    <span className="font-mono">14.65°N, 121.02°E</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Speed:</span>
                    <span className="font-mono">18.4 knots</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Next Block:</span>
                    <span className="font-mono text-emerald-400">0x4F...E291</span>
                  </div>
                </div>

                <Button className="w-full h-7 text-[10px] bg-primary hover:bg-primary/90">
                  Full Telemetry
                </Button>
              </div>
            )}
          </motion.div>
        ))}

        {/* Dynamic Route Path */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-30">
          <path 
            d="M 250 175 C 350 150, 450 300, 650 225" 
            fill="none" 
            stroke="currentColor" 
            className="text-primary"
            strokeWidth="1"
            strokeDasharray="5 5"
          />
        </svg>
      </motion.div>
      
      {/* Search Overlay */}
      <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 z-20">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            placeholder="Search Global Ledger..." 
            className="w-full h-11 bg-background/90 backdrop-blur-xl border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all shadow-xl"
          />
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 hidden md:flex items-center gap-2 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border text-[10px] font-mono shadow-lg">
        <div className="flex flex-col">
          <span className="text-muted-foreground">LATENCY: 14ms</span>
          <span className="text-emerald-400">STATUS: NETWORK OPTIMAL</span>
        </div>
      </div>
    </Card>
  );
}