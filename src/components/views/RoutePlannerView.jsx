import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Navigation, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Layers, 
  Sparkles,
  TrendingDown,
  Volume2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MOCK_ROUTES } from '../../data/seedData';
import { speakText } from '../../services/translationService';

// Custom Map Marker Icons
const startIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="background-color:#0284c7;color:white;padding:6px;border-radius:9999px;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1);display:flex;align-items:center;justify-content:center;border:2px solid white;font-weight:bold;font-size:10px;">START</div>`,
  iconSize: [44, 24],
  iconAnchor: [22, 12]
});

const endIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="background-color:#16a34a;color:white;padding:6px;border-radius:9999px;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1);display:flex;align-items:center;justify-content:center;border:2px solid white;font-weight:bold;font-size:10px;">GOAL</div>`,
  iconSize: [44, 24],
  iconAnchor: [22, 12]
});

// Component to dynamically re-center map
function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

export default function RoutePlannerView() {
  const { 
    selectedDestination, 
    destinations, 
    updateTrip, 
    currentTrip, 
    addToast 
  } = useApp();

  const [fromLocation, setFromLocation] = useState("Shilpgram PwD Parking & Buggy Stand");
  const [toLocation, setToLocation] = useState(selectedDestination?.name || "Taj Mahal Central Mausoleum");
  const [avoidStairs, setAvoidStairs] = useState(true);
  const [requireRamps, setRequireRamps] = useState(true);
  const [lowWalking, setLowWalking] = useState(false);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);

  const routes = MOCK_ROUTES;
  const currentRoute = routes[activeRouteIndex];

  const handleApplyRouteToTrip = () => {
    updateTrip({
      route: currentRoute
    });
    addToast(`Selected "${currentRoute.name}" as primary trip route! Journey score updated.`, 'success');
  };

  const handleVoiceGuidance = () => {
    const text = `Navigating via ${currentRoute.name}. Total distance: ${currentRoute.totalDistance}. Estimated time: ${currentRoute.estimatedTime}. Stairs count: zero. ${currentRoute.steps[0].instruction}`;
    speakText(text);
    addToast("Voice turn-by-turn guidance started.", "info");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
          <Navigation className="w-3.5 h-3.5" />
          <span>Intelligent Barrier-Free Routing</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Accessible Step-Free Route Planner
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Simulates real-world navigation with zero-stair elevation paths, ramp incline compliance (1:12), and accessible shuttle connections.
        </p>
      </div>

      {/* Input Parameters Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              From (Origin / Accessible Drop-Off Point)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-saarthi-600 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              To (Accessible Landmark / Viewing Deck)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Accessibility Toggles */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-saarthi-50 text-saarthi-900 px-3 py-1.5 rounded-xl border border-saarthi-200">
              <input
                type="checkbox"
                checked={avoidStairs}
                onChange={(e) => setAvoidStairs(e.target.checked)}
                className="rounded text-saarthi-600 focus:ring-saarthi-500"
              />
              <span>🚫 Avoid All Stairs (Step-Free)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200">
              <input
                type="checkbox"
                checked={requireRamps}
                onChange={(e) => setRequireRamps(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>✓ Prioritize 1:12 Ramps</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-purple-50 text-purple-900 px-3 py-1.5 rounded-xl border border-purple-200">
              <input
                type="checkbox"
                checked={lowWalking}
                onChange={(e) => setLowWalking(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>⚡ Low Walking (Buggy Linked)</span>
            </label>
          </div>

          <button
            onClick={handleVoiceGuidance}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-saarthi-400" />
            <span>Start Voice Guidance</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map (7 cols) + Route Alternatives (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Leaflet Interactive Map */}
        <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md flex flex-col min-h-[480px]">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Step-Free Active Navigation Trail</span>
            </div>
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Accessibility Score: {currentRoute.accessibilityScore}/100
            </span>
          </div>

          <div className="flex-1 w-full relative z-0 isolate">
            <MapContainer
              center={currentRoute.coordinates[0]}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: '100%', minHeight: '440px', width: '100%' }}
            >
              <ChangeMapView center={currentRoute.coordinates[0]} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={currentRoute.coordinates[0]} icon={startIcon}>
                <Popup>
                  <strong>Start:</strong> {fromLocation}
                </Popup>
              </Marker>

              <Marker position={currentRoute.coordinates[currentRoute.coordinates.length - 1]} icon={endIcon}>
                <Popup>
                  <strong>Destination:</strong> {toLocation}
                </Popup>
              </Marker>

              <Polyline
                positions={currentRoute.coordinates}
                color={currentRoute.isRecommended ? "#0284c7" : "#64748b"}
                weight={6}
                opacity={0.9}
                dashArray={currentRoute.isRecommended ? null : "8, 8"}
              />
            </MapContainer>
          </div>

          {/* Elevation & Obstacle Status Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Steps</span>
              <span className="font-extrabold text-emerald-600 text-sm">0 Steps (100% Ramp)</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Max Incline</span>
              <span className="font-extrabold text-slate-900 text-sm">1:14 (Gentle)</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Tactile Path</span>
              <span className="font-extrabold text-saarthi-600 text-sm">{currentRoute.tactilePathCoverage}</span>
            </div>
          </div>
        </div>

        {/* Right: Route Alternatives & Step Directions */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Available Route Options ({routes.length})
          </h3>

          {/* Route Options List */}
          <div className="space-y-3">
            {routes.map((rt, idx) => {
              const isSelected = activeRouteIndex === idx;
              return (
                <div
                  key={rt.id}
                  onClick={() => setActiveRouteIndex(idx)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-saarthi-600 bg-saarthi-50/50 shadow-md ring-2 ring-saarthi-300'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{rt.name}</span>
                        {rt.isRecommended && (
                          <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full">
                            ★ Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{rt.type}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-700">{rt.accessibilityScore} / 100</span>
                      <span className="block text-[11px] text-slate-500">{rt.estimatedTime}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-700">
                    <span>📏 {rt.totalDistance}</span>
                    <span>🦽 {rt.rampsCount} Ramps</span>
                    <span>🚫 0 Stairs</span>
                    <span>🚌 {rt.difficulty}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step-by-Step Directions */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Turn-by-Turn Accessible Instructions
              </h4>
              <button
                onClick={handleApplyRouteToTrip}
                className="text-xs font-bold text-saarthi-600 hover:text-saarthi-800"
              >
                Use this Route in Trip →
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {currentRoute.steps.map((st, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <div className="w-5 h-5 rounded-full bg-saarthi-100 text-saarthi-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-slate-800 font-semibold">{st.instruction}</p>
                    <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                      ✓ {st.accessibility} ({st.distance})
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {currentRoute.warnings.length > 0 && (
              <div className="mt-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{currentRoute.warnings[0]}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
