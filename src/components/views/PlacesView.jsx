import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Search, MapPin, ChevronRight, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle, XCircle, HelpCircle, Loader2,
  Star, ExternalLink, Flag, X, RefreshCw, Info, Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  PLACES_CATALOG, STATUS_THRESHOLDS, DISABILITY_KEY,
  evaluatePlace, searchSeededPlaces, searchPlaceWithGemini
} from '../../services/placesService';

// Fix leaflet default icon path issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored SVG marker factory
function createStatusMarker(status, isSelected = false) {
  const cfg = STATUS_THRESHOLDS[status] || STATUS_THRESHOLDS.unknown;
  const size = isSelected ? 38 : 30;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="${size}" height="${Math.round(size * 1.33)}">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 7.8 12 20 12 20s12-12.2 12-20C24 5.4 18.6 0 12 0z" fill="${cfg.color}" stroke="white" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="5" fill="white" opacity="0.95"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, Math.round(size * 1.33)],
    iconAnchor: [size / 2, Math.round(size * 1.33)],
    popupAnchor: [0, -Math.round(size * 1.33)]
  });
}

// Map controller to fly to selected place
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 15, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

// Status icon component
function StatusIcon({ status, size = 18 }) {
  if (status === 'accessible') return <CheckCircle size={size} className="text-green-600 shrink-0" />;
  if (status === 'inaccessible') return <XCircle size={size} className="text-red-600 shrink-0" />;
  if (status === 'partial') return <AlertTriangle size={size} className="text-amber-500 shrink-0" />;
  return <HelpCircle size={size} className="text-slate-400 shrink-0" />;
}

// Confidence bar component
function ConfidenceBar({ confidence, status }) {
  const cfg = STATUS_THRESHOLDS[status] || STATUS_THRESHOLDS.unknown;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${confidence}%`, backgroundColor: cfg.color }}
        />
      </div>
      <span className="text-[11px] font-bold text-slate-500 shrink-0">{confidence}%</span>
    </div>
  );
}

// Source badge component
function SourceBadge({ sourceType }) {
  const badges = {
    government: { label: 'Govt', bg: 'bg-blue-100', text: 'text-blue-800' },
    official: { label: 'Official', bg: 'bg-indigo-100', text: 'text-indigo-800' },
    review: { label: 'Review', bg: 'bg-slate-100', text: 'text-slate-700' },
    computer_vision: { label: 'AI Scan', bg: 'bg-purple-100', text: 'text-purple-800' },
  };
  const b = badges[sourceType] || badges.review;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${b.bg} ${b.text}`}>
      {b.label}
    </span>
  );
}

export default function PlacesView() {
  const { userProfile, addToast } = useApp();
  const primaryDisability = userProfile?.primaryDisability || 'Mobility / Wheelchair';
  const disabilityKey = DISABILITY_KEY[primaryDisability] || 'mobility';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(PLACES_CATALOG);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [evaluatedPlace, setEvaluatedPlace] = useState(null);
  const [selectedPointId, setSelectedPointId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeminiSearching, setIsGeminiSearching] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportPointId, setReportPointId] = useState(null);
  const [reportText, setReportText] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  const searchTimeout = useRef(null);

  // Load initial featured place (Taj Mahal)
  useEffect(() => {
    handleSelectPlace(PLACES_CATALOG[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-evaluate when disability changes (persona switch)
  useEffect(() => {
    if (selectedPlace) {
      const ev = evaluatePlace(selectedPlace, primaryDisability);
      setEvaluatedPlace(ev);
    }
  }, [primaryDisability, selectedPlace]);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    clearTimeout(searchTimeout.current);
    if (!q.trim()) {
      setSearchResults(PLACES_CATALOG);
      return;
    }
    const seeded = searchSeededPlaces(q);
    setSearchResults(seeded);
    // Trigger Gemini if no local results and user pauses typing
    if (seeded.length === 0) {
      searchTimeout.current = setTimeout(() => handleGeminiSearch(q), 1200);
    }
  };

  const handleGeminiSearch = async (q) => {
    setIsGeminiSearching(true);
    try {
      const result = await searchPlaceWithGemini(q, primaryDisability);
      if (result) {
        setSearchResults([result]);
      }
    } catch {
      addToast?.('Could not fetch place info. Please check your connection.', 'error');
    } finally {
      setIsGeminiSearching(false);
    }
  };

  const handleSelectPlace = useCallback((place) => {
    setIsLoading(true);
    setSelectedPlace(place);
    setSelectedPointId(null);
    setExpandedEvidence(null);
    setMapCenter([place.lat, place.lng]);
    setMapZoom(15);
    setTimeout(() => {
      const ev = evaluatePlace(place, primaryDisability);
      setEvaluatedPlace(ev);
      setIsLoading(false);
    }, 300);
  }, [primaryDisability]);

  const handleSelectPoint = (pointId) => {
    setSelectedPointId(prev => prev === pointId ? null : pointId);
    setExpandedEvidence(null);
  };

  const handleReportSubmit = async () => {
    if (!reportText.trim()) return;
    setReportSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    addToast?.(`Thank you! Your correction for "${evaluatedPlace?.name}" has been submitted for review.`, 'success');
    setReportText('');
    setReportModalOpen(false);
    setReportPointId(null);
    setReportSubmitting(false);
  };

  const selectedPoint = evaluatedPlace?.evaluatedPoints?.find(p => p.id === selectedPointId);
  const overallCfg = STATUS_THRESHOLDS[evaluatedPlace?.overallStatus] || STATUS_THRESHOLDS.unknown;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-saarthi-700 via-saarthi-600 to-sky-500 text-white px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-sky-200" />
            <span className="text-sky-200 text-sm font-semibold uppercase tracking-widest">Evidence-First Accessibility</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Places</h1>
          <p className="text-sky-100 text-sm max-w-lg">
            Find out exactly how accessible India's most visited monuments are — personalised for your&nbsp;
            <span className="font-bold text-white">{primaryDisability}</span> profile.
          </p>

          {/* Search Bar */}
          <div className="mt-5 relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search a monument, city, or destination..."
              className="w-full pl-9 pr-4 py-3 rounded-xl bg-white text-slate-900 text-sm font-medium shadow-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
              aria-label="Search accessible places"
            />
            {isGeminiSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-saarthi-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-semibold">Searching with AI…</span>
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchQuery && searchResults.length > 0 && (
            <div className="mt-2 max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 relative">
              {searchResults.slice(0, 6).map(place => (
                <button
                  key={place.id}
                  onClick={() => { handleSelectPlace(place); setSearchQuery(''); setSearchResults(PLACES_CATALOG); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-saarthi-50 transition-colors border-b border-slate-100 last:border-0"
                >
                  <MapPin className="w-4 h-4 text-saarthi-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{place.name}</p>
                    <p className="text-xs text-slate-500">{place.city}</p>
                  </div>
                  {place._isGeminiGenerated && (
                    <span className="ml-auto text-[9px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded uppercase">AI</span>
                  )}
                </button>
              ))}
            </div>
          )}
          {searchQuery && searchResults.length === 0 && !isGeminiSearching && (
            <div className="mt-2 max-w-xl bg-white rounded-xl px-4 py-3 text-sm text-slate-500 shadow border border-slate-200">
              No results found. Try a different name.
            </div>
          )}
        </div>
      </div>

      {/* Quick Place Chips */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-2 flex-nowrap">
          {PLACES_CATALOG.map(place => {
            const ev = evaluatePlace(place, primaryDisability);
            const cfg = STATUS_THRESHOLDS[ev.overallStatus] || STATUS_THRESHOLDS.unknown;
            const isActive = selectedPlace?.id === place.id;
            return (
              <button
                key={place.id}
                onClick={() => handleSelectPlace(place)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all shrink-0 ${
                  isActive
                    ? 'bg-saarthi-600 text-white border-saarthi-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-saarthi-300 hover:bg-saarthi-50'
                }`}
              >
                <span className="text-sm">{cfg.emoji}</span>
                {place.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Map + Details */}
      {evaluatedPlace && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* LEFT: Place Info + Points List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Place Header Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={evaluatedPlace.coverImage}
                    alt={evaluatedPlace.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <p className="text-xs text-white/70 font-medium">{evaluatedPlace.city}</p>
                    <h2 className="text-lg font-black leading-tight">{evaluatedPlace.name}</h2>
                  </div>
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg"
                    style={{ backgroundColor: overallCfg.bg, color: overallCfg.color, border: `1px solid ${overallCfg.border}` }}
                  >
                    <StatusIcon status={evaluatedPlace.overallStatus} size={13} />
                    {overallCfg.label}
                  </div>
                </div>

                {/* Score Bar */}
                <div className="px-4 py-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-600">Accessibility Score for {primaryDisability}</span>
                    {evaluatedPlace.overallScore !== null && (
                      <span className="text-lg font-black" style={{ color: overallCfg.color }}>
                        {evaluatedPlace.overallScore}<span className="text-xs font-medium text-slate-400">/100</span>
                      </span>
                    )}
                  </div>
                  {evaluatedPlace.overallScore !== null && (
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${evaluatedPlace.overallScore}%`, backgroundColor: overallCfg.color }}
                      />
                    </div>
                  )}

                  {/* Summary counts */}
                  <div className="flex gap-3 mt-3">
                    {[
                      { label: 'Accessible', count: evaluatedPlace.summary.accessibleCount, color: 'text-green-600', bg: 'bg-green-50' },
                      { label: 'Partial', count: evaluatedPlace.summary.partialCount, color: 'text-amber-600', bg: 'bg-amber-50' },
                      { label: 'Blocked', count: evaluatedPlace.summary.inaccessibleCount, color: 'text-red-600', bg: 'bg-red-50' },
                      { label: 'Unknown', count: evaluatedPlace.summary.unknownCount, color: 'text-slate-500', bg: 'bg-slate-50' },
                    ].map(s => s.count > 0 && (
                      <div key={s.label} className={`flex-1 rounded-lg px-2 py-1.5 text-center ${s.bg}`}>
                        <p className={`text-base font-black ${s.color}`}>{s.count}</p>
                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visitor Points List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">Visitor Points</h3>
                  <span className="text-[10px] text-slate-400 font-medium">{evaluatedPlace.evaluatedPoints.length} locations</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-10 gap-2 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Evaluating accessibility…</span>
                    </div>
                  ) : (
                    evaluatedPlace.evaluatedPoints.map(point => {
                      const ev = point.evaluation;
                      const cfg = STATUS_THRESHOLDS[ev.status] || STATUS_THRESHOLDS.unknown;
                      const isSelected = selectedPointId === point.id;
                      return (
                        <button
                          key={point.id}
                          onClick={() => handleSelectPoint(point.id)}
                          className={`w-full text-left px-4 py-3 transition-all ${
                            isSelected ? 'bg-saarthi-50 border-l-4 border-l-saarthi-500' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl shrink-0">{point.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">{point.name}</p>
                              <ConfidenceBar confidence={ev.confidence} status={ev.status} />
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                                style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.border }}
                              >
                                {cfg.emoji} {cfg.label}
                              </span>
                              {isSelected ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Map + Detail Panel */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {/* Leaflet Map */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: '340px' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                  scrollWheelZoom={false}
                >
                  <MapController center={mapCenter} zoom={mapZoom} />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  {evaluatedPlace.evaluatedPoints.map(point => (
                    <Marker
                      key={point.id}
                      position={[point.lat, point.lng]}
                      icon={createStatusMarker(point.evaluation.status, selectedPointId === point.id)}
                      eventHandlers={{ click: () => handleSelectPoint(point.id) }}
                    >
                      <Popup>
                        <div className="min-w-[160px]">
                          <p className="font-bold text-sm text-slate-900">{point.icon} {point.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: (STATUS_THRESHOLDS[point.evaluation.status] || STATUS_THRESHOLDS.unknown).color }}>
                            {(STATUS_THRESHOLDS[point.evaluation.status] || STATUS_THRESHOLDS.unknown).label}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">{point.evaluation.explanation}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Point Detail Panel */}
              {selectedPoint ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Point header */}
                  <div
                    className="px-5 py-4 flex items-start justify-between gap-3"
                    style={{ backgroundColor: (STATUS_THRESHOLDS[selectedPoint.evaluation.status] || STATUS_THRESHOLDS.unknown).bg }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedPoint.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-0.5">Selected Point</p>
                        <h3 className="text-base font-black text-slate-900">{selectedPoint.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusIcon status={selectedPoint.evaluation.status} size={20} />
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-full border"
                        style={{
                          color: (STATUS_THRESHOLDS[selectedPoint.evaluation.status] || STATUS_THRESHOLDS.unknown).color,
                          borderColor: (STATUS_THRESHOLDS[selectedPoint.evaluation.status] || STATUS_THRESHOLDS.unknown).border
                        }}
                      >
                        {(STATUS_THRESHOLDS[selectedPoint.evaluation.status] || STATUS_THRESHOLDS.unknown).label}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-4 space-y-4">
                    {/* Confidence */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-600">Evidence Confidence</span>
                        <span className="text-xs text-slate-400">{selectedPoint.evaluation.totalEvidenceCount || 0} source{selectedPoint.evaluation.totalEvidenceCount !== 1 ? 's' : ''} analysed</span>
                      </div>
                      <ConfidenceBar confidence={selectedPoint.evaluation.confidence} status={selectedPoint.evaluation.status} />
                    </div>

                    {/* Explanation */}
                    <div className="flex gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <Info className="w-4 h-4 text-saarthi-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700 leading-relaxed">{selectedPoint.evaluation.explanation}</p>
                    </div>

                    {/* Supporting Evidence */}
                    {selectedPoint.evaluation.supporting.length > 0 && (
                      <div>
                        <button
                          onClick={() => setExpandedEvidence(prev => prev === 'supporting' ? null : 'supporting')}
                          className="w-full flex items-center justify-between text-sm font-bold text-green-700 mb-2 hover:text-green-900 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" />
                            Supporting Evidence ({selectedPoint.evaluation.supporting.length})
                          </div>
                          {expandedEvidence === 'supporting' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {expandedEvidence === 'supporting' && (
                          <div className="space-y-2">
                            {selectedPoint.evaluation.supporting.map((ev, i) => (
                              <div key={i} className="p-3 rounded-xl bg-green-50 border border-green-200">
                                <div className="flex items-start gap-2 mb-1">
                                  <SourceBadge sourceType={ev.source_type} />
                                  {ev.first_hand && (
                                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase">First-Hand</span>
                                  )}
                                  <span className="ml-auto text-[9px] text-slate-400">{ev.date}</span>
                                </div>
                                <p className="text-xs text-slate-700 font-medium leading-relaxed">{ev.claim}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{ev.source}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contradicting / Cautionary Evidence */}
                    {selectedPoint.evaluation.contradicting.length > 0 && (
                      <div>
                        <button
                          onClick={() => setExpandedEvidence(prev => prev === 'contradicting' ? null : 'contradicting')}
                          className="w-full flex items-center justify-between text-sm font-bold text-amber-700 mb-2 hover:text-amber-900 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4" />
                            Cautionary / Contradicting ({selectedPoint.evaluation.contradicting.length})
                          </div>
                          {expandedEvidence === 'contradicting' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {expandedEvidence === 'contradicting' && (
                          <div className="space-y-2">
                            {selectedPoint.evaluation.contradicting.map((ev, i) => (
                              <div key={i} className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                                <div className="flex items-start gap-2 mb-1">
                                  <SourceBadge sourceType={ev.source_type} />
                                  {ev.first_hand && (
                                    <span className="text-[9px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded uppercase">First-Hand</span>
                                  )}
                                  <span className="ml-auto text-[9px] text-slate-400">{ev.date}</span>
                                </div>
                                <p className="text-xs text-slate-700 font-medium leading-relaxed">{ev.claim}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{ev.source}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Report Button */}
                    <button
                      onClick={() => { setReportPointId(selectedPoint.id); setReportModalOpen(true); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      Report Incorrect / Outdated Information
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-saarthi-50 flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-saarthi-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Select a visitor point</p>
                  <p className="text-xs text-slate-400 mt-1">Click any point on the left panel or map marker to see detailed accessibility evidence.</p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200">
                <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  <strong>Evidence-First Approach:</strong> Saarthi never guesses. Verdicts are based only on verified official reports, government audits, and first-hand visitor accounts. Unverified points are shown as ⚪ Unknown rather than estimated.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report / Dispute Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-black text-slate-900">Report Incorrect Information</h3>
              </div>
              <button onClick={() => setReportModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-xs font-semibold text-amber-800">Point: {selectedPoint?.name || evaluatedPlace?.name}</p>
                <p className="text-[11px] text-amber-700 mt-0.5">Please describe what has changed or is incorrect on the ground.</p>
              </div>
              <textarea
                value={reportText}
                onChange={e => setReportText(e.target.value)}
                rows={4}
                placeholder="e.g. 'The ramp at East Gate is currently under repair as of August 2026. Visitors are being redirected to the North side entrance...'"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-saarthi-400 resize-none"
              />
              <button
                onClick={handleReportSubmit}
                disabled={reportSubmitting || !reportText.trim()}
                className="w-full py-3 rounded-xl bg-saarthi-600 hover:bg-saarthi-700 disabled:opacity-50 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                {reportSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Flag className="w-4 h-4" /> Submit Report</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
