
import React from 'react';
import { Warehouse, Route } from '../types';

interface LogisticsMapProps {
  warehouses: Warehouse[];
  routes: Route[];
  onSelectRoute: (id: string) => void;
}

export const LogisticsMap: React.FC<LogisticsMapProps> = ({ warehouses, routes, onSelectRoute }) => {
  // Simple projection for US-centric mock data (x: -125 to -65, y: 24 to 50)
  const project = (lat: number, lng: number) => {
    const x = ((lng + 125) / 60) * 100;
    const y = (1 - (lat - 24) / 26) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="relative w-full h-96 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Draw Routes */}
        {routes.map(route => {
          const from = warehouses.find(w => w.id === route.fromId);
          const to = warehouses.find(w => w.id === route.toId);
          if (!from || !to) return null;

          const p1 = { x: ((from.lng + 125) / 60) * 100, y: (1 - (from.lat - 24) / 26) * 100 };
          const p2 = { x: ((to.lng + 125) / 60) * 100, y: (1 - (to.lat - 24) / 26) * 100 };

          return (
            <g key={route.id} className="cursor-pointer group" onClick={() => onSelectRoute(route.id)}>
              <line 
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={route.active ? (route.riskLevel === 'High' ? '#f43f5e' : '#22c55e') : '#475569'}
                strokeWidth={route.active ? 0.8 : 0.4}
                strokeDasharray={route.active ? "none" : "2,2"}
                className="transition-all duration-300 group-hover:stroke-blue-400 group-hover:stroke-[1.5]"
              />
              <circle cx={(p1.x + p2.x)/2} cy={(p1.y + p2.y)/2} r="1" fill="white" className="opacity-0 group-hover:opacity-100" />
            </g>
          );
        })}
      </svg>

      {/* Draw Warehouses */}
      {warehouses.map(wh => {
        const pos = project(wh.lat, wh.lng);
        return (
          <div 
            key={wh.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{ left: pos.x, top: pos.y }}
          >
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-150 ${wh.utilization > 0.8 ? 'bg-red-500' : 'bg-blue-500'}`} />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
              {wh.name} ({Math.round(wh.utilization*100)}%)
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur px-3 py-2 rounded-lg border border-slate-700 text-[10px] text-slate-300 flex gap-4">
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Healthy</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Critical</div>
        <div className="flex items-center gap-2"><span className="w-2 h-0.5 bg-green-500"></span> Active Route</div>
      </div>
    </div>
  );
};