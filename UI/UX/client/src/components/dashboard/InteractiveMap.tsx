import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Anchor, Plane, Truck } from "lucide-react";

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons based on vehicle type
const createCustomIcon = (type: string, status: string) => {
  const color = status === 'risk' ? '#ef4444' : status === 'delayed' ? '#f59e0b' : '#0ea5e9';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color}; position: relative;">
            <div style="position: absolute; top: -4px; left: -4px; right: -4px; bottom: -4px; border-radius: 50%; background-color: ${color}; opacity: 0.3; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
           </div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

export default function InteractiveMap() {
  const markers = [
    { id: 1, lat: 34.0522, lng: -118.2437, type: "ship", status: "transit", label: "Atlantic Express", owner: "Maersk Logistics" }, // LA
    { id: 2, lat: 40.7128, lng: -74.0060, type: "plane", status: "delayed", label: "Cargo Flight 402", owner: "FedEx Global" }, // NYC
    { id: 3, lat: 31.2304, lng: 121.4737, type: "truck", status: "arrived", label: "Shanghai Hub", owner: "Miro Operations" }, // Shanghai
    { id: 4, lat: 51.5074, lng: -0.1278, type: "ship", status: "risk", label: "Mediterranean Vessel", owner: "Hapag-Lloyd" }, // London
    { id: 5, lat: 14.5995, lng: 120.9842, type: "ship", status: "transit", label: "PH Science High Vessel", owner: "PSHS System" }, // Manila
  ];

  return (
    <div className="h-full w-full relative rounded-xl overflow-hidden border border-border/50 shadow-xl">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', background: '#1a1d21' }}
        zoomControl={false}
      >
        {/* Dark Mode Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <ZoomControl position="bottomright" />

        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.lat, marker.lng]}
            icon={createCustomIcon(marker.type, marker.status)}
          >
            <Popup className="custom-popup">
              <div className="p-1 min-w-[200px]">
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
                    <span className="font-mono">{marker.lat.toFixed(4)}°, {marker.lng.toFixed(4)}°</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={marker.status === 'risk' ? 'destructive' : 'outline'} className="text-[10px] h-4 px-1">
                      {marker.status}
                    </Badge>
                  </div>
                </div>

                <Button size="sm" className="w-full h-7 text-[10px] bg-primary hover:bg-primary/90">
                  Full Telemetry
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Overlay UI Elements */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-none">
        <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border flex items-center gap-2 shadow-lg pointer-events-auto">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Live Global Grid</span>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-[400] flex gap-2 pointer-events-none">
        <div className="bg-primary/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary/30 flex items-center gap-2 shadow-lg pointer-events-auto">
          <ShieldCheck className="size-4 text-primary" />
          <span className="text-[10px] font-bold text-primary">AI PREDICTIVE ACTIVE</span>
        </div>
      </div>
    </div>
  );
}