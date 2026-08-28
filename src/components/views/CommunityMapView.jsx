import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Map, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ThumbsUp, 
  ThumbsDown, 
  Filter, 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  X,
  Layers,
  ArrowRight,
  LocateFixed,
  Navigation,
  Check,
  Loader2,
  Info,
  Building2,
  SlidersHorizontal
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { analyzeAccessibilityPhoto, SAMPLE_VERIFICATION_IMAGES } from '../../services/aiService';

// Leaflet custom marker icons by report type
const createReportIcon = (type, status) => {
  const bgColor = status === 'Verified' 
    ? '#16a34a' 
    : status === 'Community Verified' 
    ? '#0284c7' 
    : status === 'Disputed Hazard'
    ? '#dc2626'
    : '#eab308';

  const iconEmoji = 
    type === 'Ramp' ? '🦽' : 
    type === 'Elevator' ? '🛗' : 
    type === 'Accessible Washroom' ? '🚻' : 
    type === 'Accessible Transport' ? '🚌' :
    type.includes('Obstacle') || status === 'Disputed Hazard' ? '⚠️' : '🚪';

  return new L.DivIcon({
    className: 'custom-map-icon',
    html: `<div style="background-color:${bgColor};color:white;width:32px;height:32px;border-radius:9999px;display:flex;align-items:center;justify-content:center;border:2.5px solid white;box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.35);font-size:15px;cursor:pointer;transition:transform 0.15s ease;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1.0)'">${iconEmoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const CITY_COORDINATES = {
  'All': [27.1751, 78.0421],
  'Agra': [27.1751, 78.0421],
  'Delhi': [28.5244, 77.1855],
  'Varanasi': [25.3109, 83.0107],
  'Jaipur': [26.9855, 75.8513],
  'Mysuru': [12.3052, 76.6552],
  'Amritsar': [31.6200, 74.8765],
  'Mumbai': [18.9220, 72.8347],
  'Kolkata': [22.5448, 88.3426],
  'Chennai': [13.0827, 80.2707],
  'Hyderabad': [17.3616, 78.4747]
};

// Sub-component to handle map clicks and fly-to actions
function MapController({ centerCoords, zoomLevel, onMapClick, selectedPin }) {
  const map = useMap();

  useEffect(() => {
    if (centerCoords) {
      map.flyTo(centerCoords, zoomLevel || 13, { duration: 1.2 });
    }
  }, [centerCoords, zoomLevel, map]);

  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick([e.latlng.lat, e.latlng.lng]);
      }
    }
  });

  return selectedPin ? (
    <Marker 
      position={selectedPin}
      icon={new L.DivIcon({
        className: 'new-pin-icon',
        html: `<div style="background-color:#6366f1;color:white;width:36px;height:36px;border-radius:9999px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 0 15px rgba(99,102,241,0.8);font-size:18px;animation:bounce 1s infinite;">📍</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })}
    >
      <Popup>
        <div className="text-xs p-1">
          <strong className="block text-indigo-700">Selected Ground Audit Pin</strong>
          <span className="text-[11px] text-slate-600">
            {selectedPin[0].toFixed(4)}, {selectedPin[1].toFixed(4)}
          </span>
        </div>
      </Popup>
    </Marker>
  ) : null;
}

export default function CommunityMapView() {
  const { 
    communityReports, 
    addCommunityReport, 
    voteReport, 
    currentUser, 
    destinations, 
    addToast 
  } = useApp();

  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState([27.1751, 78.0421]);
  const [mapZoom, setMapZoom] = useState(13);
  const [selectedMapPin, setSelectedMapPin] = useState(null);

  // New Report Form State
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('Ramp');
  const [formDestId, setFormDestId] = useState('dest-1');
  const [formDesc, setFormDesc] = useState('');
  const [formPhoto, setFormPhoto] = useState('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80');
  const [isScanningAi, setIsScanningAi] = useState(false);
  const [aiAnalysisPreview, setAiAnalysisPreview] = useState(null);

  // Filter reports
  const filteredReports = communityReports.filter(rep => {
    if (selectedCity !== 'All' && rep.city && !rep.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    if (selectedTypeFilter !== 'All' && rep.type !== selectedTypeFilter) return false;
    if (selectedStatusFilter !== 'All' && rep.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleCityChange = (city) => {
    setSelectedCity(city);
    if (CITY_COORDINATES[city]) {
      setMapCenter(CITY_COORDINATES[city]);
      setMapZoom(city === 'All' ? 6 : 14);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      addToast("Detecting your GPS location...", "info");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setMapCenter(coords);
          setMapZoom(16);
          setSelectedMapPin(coords);
          addToast("Centered on your current GPS location! Click anywhere to audit.", "success");
        },
        () => {
          // Fallback to active destination
          const dest = destinations[0];
          setMapCenter(dest.coordinates);
          setMapZoom(14);
          addToast("Using Agra heritage center location.", "info");
        }
      );
    }
  };

  const handleMapClick = (coords) => {
    setSelectedMapPin(coords);
    addToast(`Dropped audit pin at: ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}. Opening submission form...`, "info");
    setIsSubmitModalOpen(true);
  };

  const handleRunAiAudit = async () => {
    setIsScanningAi(true);
    try {
      const result = await analyzeAccessibilityPhoto(formPhoto);
      setAiAnalysisPreview(result);
      addToast(`AI Computer Vision Audit: ${result.overallVerdict} (${result.confidenceScore}% confidence)`, "success");
    } catch (err) {
      addToast("Could not complete AI audit on image.", "warning");
    } finally {
      setIsScanningAi(false);
    }
  };

  const handleSubmitNewReport = async (e) => {
    e.preventDefault();
    const dest = destinations.find(d => d.id === formDestId) || destinations[0];
    const coords = selectedMapPin || [
      dest.coordinates[0] + (Math.random() - 0.5) * 0.004,
      dest.coordinates[1] + (Math.random() - 0.5) * 0.004
    ];

    await addCommunityReport({
      destinationId: dest.id,
      destinationName: dest.name,
      city: dest.city,
      coordinates: coords,
      type: formType,
      title: formTitle,
      description: formDesc,
      photoUrl: formPhoto,
      contributor: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
      contributorRole: currentUser.accessibilityProfile?.primaryDisability || "Community Auditor",
      aiAnalysis: aiAnalysisPreview ? {
        rampDetected: (aiAnalysisPreview.overallVerdict || '').toLowerCase().includes('accessible'),
        slopeConfidence: (aiAnalysisPreview.confidenceScore || 90) / 100,
        handrailsPresent: true,
        estimatedIncline: aiAnalysisPreview.slopeAngle || '1:12 CPWD standard',
        detectedFeatures: aiAnalysisPreview.detectedFeatures || [],
        overallVerdict: aiAnalysisPreview.overallVerdict
      } : null
    }, formPhoto);

    setIsSubmitModalOpen(false);
    setFormTitle('');
    setFormDesc('');
    setAiAnalysisPreview(null);
    setSelectedMapPin(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
            <Map className="w-3.5 h-3.5" />
            <span>Crowdsourced Ground Intelligence & Computer Vision Audits</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Community Accessibility Map
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time verified ground reports, obstacles, and accessibility aids feeding directly into Route Planning and Journey Scores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleUseCurrentLocation}
            className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all active:scale-95"
            title="Locate my GPS position on map"
          >
            <LocateFixed className="w-4 h-4 text-saarthi-600" />
            <span>My GPS Location</span>
          </button>

          <button
            onClick={() => {
              setSelectedMapPin(mapCenter);
              setIsSubmitModalOpen(true);
            }}
            className="px-5 py-3 bg-gradient-to-r from-saarthi-600 to-sky-600 hover:from-saarthi-700 hover:to-sky-700 text-white rounded-2xl font-extrabold text-xs sm:text-sm shadow-lg shadow-saarthi-500/25 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Report Ground Finding</span>
          </button>
        </div>
      </div>

      {/* Filter & Hub Jump Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* City Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-saarthi-600" />
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-800"
            >
              <option value="All">All Indian Hubs</option>
              <option value="Agra">Agra, UP</option>
              <option value="Delhi">New Delhi</option>
              <option value="Varanasi">Varanasi, UP</option>
              <option value="Jaipur">Jaipur, Rajasthan</option>
              <option value="Mysuru">Mysuru, Karnataka</option>
              <option value="Amritsar">Amritsar, Punjab</option>
              <option value="Mumbai">Mumbai, MH</option>
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
          >
            <option value="All">📌 All Marker Types</option>
            <option value="Ramp">🦽 Ramps & Inclines</option>
            <option value="Elevator">🛗 Elevators & Lifts</option>
            <option value="Accessible Entrance">🚪 Accessible Entrances</option>
            <option value="Accessible Washroom">🚻 PwD Restrooms</option>
            <option value="Accessible Transport">🚌 Low-Floor Transport</option>
            <option value="Obstacle / Blocked Path">⚠️ Obstacles & Hazards</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
          >
            <option value="All">✓ All Consensus Statuses</option>
            <option value="Verified">🟢 Verified by Authorities / ASI</option>
            <option value="Community Verified">🔵 Community Verified (Consensus)</option>
            <option value="Needs Verification">🟡 Needs Verification</option>
            <option value="Disputed Hazard">🔴 Disputed / Hazard Flagged</option>
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold flex-wrap">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Verified
          </span>
          <span className="flex items-center gap-1 text-saarthi-700">
            <span className="w-2.5 h-2.5 rounded-full bg-saarthi-600"></span> Community Verified
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Needs Review
          </span>
          <span className="flex items-center gap-1 text-red-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Hazard
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Map (7 cols) + Live Audits Stream (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Leaflet Live Map with Click-to-Pin */}
        <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md flex flex-col min-h-[580px]">
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-saarthi-400" />
              <span>Live India Accessibility Audit Grid ({filteredReports.length} pins)</span>
            </span>
            <span className="text-saarthi-300 font-medium">💡 Click anywhere on map to drop an audit pin</span>
          </div>

          <div className="flex-1 w-full relative z-0 isolate">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={false}
              style={{ height: '100%', minHeight: '520px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController 
                centerCoords={mapCenter} 
                zoomLevel={mapZoom} 
                onMapClick={handleMapClick}
                selectedPin={selectedMapPin}
              />

              {filteredReports.map((rep) => (
                <Marker
                  key={rep.id}
                  position={rep.coordinates}
                  icon={createReportIcon(rep.type, rep.status)}
                >
                  <Popup>
                    <div className="space-y-2 max-w-[250px] p-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {rep.type}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          rep.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                          rep.status === 'Community Verified' ? 'bg-sky-100 text-sky-800' :
                          rep.status === 'Disputed Hazard' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rep.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 leading-snug">{rep.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{rep.description}</p>
                      
                      {rep.aiAnalysis && (
                        <div className="p-1.5 bg-emerald-50 rounded-lg text-[10px] text-emerald-900 border border-emerald-200">
                          <strong>AI Audit:</strong> {rep.aiAnalysis.estimatedIncline || 'Step-Free'} ({Math.round((rep.aiAnalysis.slopeConfidence || 0.9) * 100)}% confidence)
                        </div>
                      )}

                      <div className="pt-2 border-t flex justify-between items-center text-[10px] text-slate-500">
                        <span>By {rep.contributor}</span>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => voteReport(rep.id, 'confirm')}
                            className="text-emerald-700 font-bold hover:underline"
                          >
                            ✓ {rep.confirmCount || 1}
                          </button>
                          <button 
                            onClick={() => voteReport(rep.id, 'dispute')}
                            className="text-red-700 font-bold hover:underline"
                          >
                            ✗ {rep.disputeCount || 0}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Right: Crowdsourced Contributions Stream & Live Voting */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              Live Ground Contributions ({filteredReports.length})
            </h3>
            <span className="text-xs font-semibold text-saarthi-600 bg-saarthi-50 px-2.5 py-1 rounded-full border border-saarthi-200">
              ⚡ Real-Time Cloud Synced
            </span>
          </div>

          <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredReports.map((rep) => {
              const totalVotes = (rep.confirmCount || 1) + (rep.disputeCount || 0);
              const confirmPct = Math.round(((rep.confirmCount || 1) / totalVotes) * 100);

              return (
                <div
                  key={rep.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 hover:border-saarthi-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-saarthi-600 uppercase tracking-wider block">
                        {rep.type} • {rep.destinationName} ({rep.city})
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{rep.title}</h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap border ${
                      rep.status === 'Verified'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : rep.status === 'Community Verified'
                        ? 'bg-saarthi-50 text-saarthi-800 border-saarthi-300'
                        : rep.status === 'Disputed Hazard'
                        ? 'bg-red-50 text-red-800 border-red-300 font-extrabold'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rep.description}
                  </p>

                  {/* AI Vision Spec Sheet */}
                  {rep.aiAnalysis && (
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold flex items-center gap-1 text-emerald-400">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Computer Vision Certified</span>
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded font-mono text-[10px]">
                          Confidence: {Math.round((rep.aiAnalysis.slopeConfidence || 0.9) * 100)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1 border-t border-slate-700">
                        <span>Slope: <strong>{rep.aiAnalysis.estimatedIncline || '1:12 Incline'}</strong></span>
                        <span>Handrails: <strong>{rep.aiAnalysis.handrailsPresent ? 'Present' : 'None'}</strong></span>
                      </div>
                    </div>
                  )}

                  {rep.photoUrl && (
                    <div className="h-32 rounded-2xl overflow-hidden border border-slate-100 relative group">
                      <img src={rep.photoUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                        Ground Photo Evidence
                      </span>
                    </div>
                  )}

                  {/* Consensus Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                      <span>Community Consensus: {confirmPct}% Verified</span>
                      <span className="text-saarthi-600 font-bold">{rep.scoreImpact || '+5 Pts Route Score'}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div style={{ width: `${confirmPct}%` }} className="bg-emerald-500 h-full"></div>
                      <div style={{ width: `${100 - confirmPct}%` }} className="bg-red-400 h-full"></div>
                    </div>
                  </div>

                  {/* Voting Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>By <strong>{rep.contributor}</strong> ({rep.date})</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => voteReport(rep.id, 'confirm')}
                        className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                        title="Confirm this accessibility finding (+1)"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Confirm ({rep.confirmCount || 1})</span>
                      </button>

                      <button
                        onClick={() => voteReport(rep.id, 'dispute')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
                        title="Dispute / Flag inaccuracy"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Dispute ({rep.disputeCount || 0})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add New Report Modal with Integrated Gemini AI Vision Scanner */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsSubmitModalOpen(false);
                setAiAnalysisPreview(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-saarthi-500" />
              <span>Ground Barrier & Ramp Auditing</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">
              Submit Accessibility Report
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ground observations directly update the Route Planner, Journey Score, and AI Vision Catalog.
            </p>

            {selectedMapPin && (
              <div className="mb-4 p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs text-indigo-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Pinned Location: <strong>{selectedMapPin[0].toFixed(4)}, {selectedMapPin[1].toFixed(4)}</strong></span>
              </div>
            )}

            <form onSubmit={handleSubmitNewReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Associated Heritage Hub</label>
                <select
                  value={formDestId}
                  onChange={(e) => setFormDestId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-xs"
                >
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Accessibility Category</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-xs"
                >
                  <option value="Ramp">🦽 Ramp / Incline Slope</option>
                  <option value="Elevator">🛗 Elevator / Hydraulic Lift</option>
                  <option value="Accessible Entrance">🚪 Accessible Gate / Zero Step Turnstile</option>
                  <option value="Accessible Washroom">🚻 Dedicated PwD Restroom</option>
                  <option value="Accessible Transport">🚌 Low-Floor Electric Buggy / Shuttle</option>
                  <option value="Obstacle / Blocked Path">⚠️ Obstacle / Damaged Ramp / Step Hazard</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. New anti-skid ramp installed at West Gate with dual handrails"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description & Measurements</label>
                <textarea
                  required
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe slope inclination, door clearance, surface traction, presence of handrails..."
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-xs"
                />
              </div>

              {/* Photo & Gemini Vision AI Scanner */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-saarthi-600" />
                    <span>Photo Evidence & AI Vision Audit</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRunAiAudit}
                    disabled={isScanningAi}
                    className="px-3 py-1.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm disabled:opacity-50"
                  >
                    {isScanningAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
                    <span>{isScanningAi ? "Auditing..." : "Audit with AI Vision"}</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={formPhoto}
                  onChange={(e) => setFormPhoto(e.target.value)}
                  placeholder="Photo URL (e.g. Unsplash or direct link)"
                  className="w-full p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px]"
                />

                {/* AI Analysis Preview if audited */}
                {aiAnalysisPreview && (
                  <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-400">✓ AI Classification: {aiAnalysisPreview.overallVerdict}</span>
                      <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono text-[10px]">
                        {aiAnalysisPreview.confidenceScore}% Confidence
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{aiAnalysisPreview.recommendation}</p>
                    <span className="inline-block text-[10px] font-bold bg-saarthi-500/30 text-saarthi-300 px-2 py-0.5 rounded">
                      Incline: {aiAnalysisPreview.slopeAngle}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-saarthi-600 to-sky-600 hover:from-saarthi-700 hover:to-sky-700 text-white rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Publish to Cloud Database & Live Community Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
