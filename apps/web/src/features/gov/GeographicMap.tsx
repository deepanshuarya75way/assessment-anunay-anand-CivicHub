import { useState } from 'react';

export default function GeographicMap() {
  const [layers, setLayers] = useState({
    issues: true,
    events: false,
    inspections: true,
    coverage: false
  });

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden relative">
      {/* Map Controls Overlay */}
      <div className="absolute top-6 left-6 z-10 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl p-4 shadow-xl w-64">
        <h3 className="text-white font-bold mb-4">Map Layers</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={layers.issues} 
              onChange={() => toggleLayer('issues')}
              className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-800 bg-slate-700"
            />
            <span className="text-sm text-slate-300">Active Issues</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={layers.events} 
              onChange={() => toggleLayer('events')}
              className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-800 bg-slate-700"
            />
            <span className="text-sm text-slate-300">Civic Events</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={layers.inspections} 
              onChange={() => toggleLayer('inspections')}
              className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-800 bg-slate-700"
            />
            <span className="text-sm text-slate-300">Field Inspections</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={layers.coverage} 
              onChange={() => toggleLayer('coverage')}
              className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-800 bg-slate-700"
            />
            <span className="text-sm text-slate-300">Department Coverage (Heatmap)</span>
          </label>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="flex-1 bg-slate-800 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="text-center z-10">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          <p className="text-slate-400 font-medium">Leaflet Map Integration Placeholder</p>
          <p className="text-sm text-slate-500 mt-2">Active layers: {Object.entries(layers).filter(([_, v]) => v).map(([k]) => k).join(', ')}</p>
        </div>
      </div>
    </div>
  );
}
