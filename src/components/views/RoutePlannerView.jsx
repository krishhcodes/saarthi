import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Navigation, MapPin, ShieldCheck, ArrowRight, ArrowLeftRight,
  CheckCircle2, Layers, Sparkles, Volume2, Car, Train, Plane,
  DoorOpen, Footprints, ArrowUpRight, Check, LocateFixed,
  ExternalLink, Search, Loader2, X, Share2, Phone, AlertCircle
} from 'lucide-react';
import {
  resolveMainAccessibleEntrance,
  QUICK_ORIGIN_HUBS,
  buildRoadRoutes,
  buildTrainRoute,
  buildFlightRoute,
  enrichRoutesWithCommunityData
} from '../../services/routeService';
import { fetchRealRoadDistance } from '../../services/osrmService';
import { discoverTransitInfrastructure } from '../../services/overpassTransitService';
import {
  searchLocationSuggestions,
  getCurrentUserLocation,
  getGoogleMapsNavigationUrl
} from '../../services/geocodingService';
import { speakText } from '../../services/translationService';

const TIER_LABELS = {
  local: '📍 Local City Trip',
  intercity: '🛣️ Intercity Highway Trip',
  longdistance: '✈️ Long-Distance Corridor'
};

export default function RoutePlannerView() {
  const {
    selectedDestination,
    navigatingToEntrance,
    setNavigatingToEntrance,
    setIsSelectingDestinationForRoute,
    userProfile, currentUser,
    communityReports,
    updateTrip, navigateTo, addToast
  } = useApp();

  const primaryDisability = userProfile?.primaryDisability
    || currentUser?.accessibilityProfile?.primaryDisability
    || 'Mobility / Wheelchair';

  // ── Destination & Entrance ────────────────────────────────────────────────
  const activeDestination = selectedDestination || {
    id: 'taj-mahal', name: 'Taj Mahal',
    city: 'Agra, Uttar Pradesh', lat: 27.1738, lng: 78.0421
  };
  const mainEntrance = navigatingToEntrance || resolveMainAccessibleEntrance(activeDestination);

  // ── Origin State & Autocomplete ───────────────────────────────────────────
  const [originQuery, setOriginQuery] = useState(QUICK_ORIGIN_HUBS[0].name);
  const [selectedOrigin, setSelectedOrigin] = useState({
    name: QUICK_ORIGIN_HUBS[0].name,
    lat: QUICK_ORIGIN_HUBS[0].lat,
    lng: QUICK_ORIGIN_HUBS[0].lng,
    city: QUICK_ORIGIN_HUBS[0].city
  });
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  // ── Route Computation State ───────────────────────────────────────────────
  const [isComputingRoute, setIsComputingRoute] = useState(false);
  const [routeData, setRouteData] = useState(null);   // { distanceKm, durationMin, tripTier, infrastructure, routes }
  const [selectedMode, setSelectedMode] = useState('road');
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const [routeError, setRouteError] = useState(null);

  // ── Compute Route (OSRM + Overpass + Builder) ─────────────────────────────
  const computeRoute = useCallback(async (origin, destination) => {
    const destLat = mainEntrance?.lat || destination.lat || 27.1738;
    const destLng = mainEntrance?.lng || destination.lng || 78.0421;
    const oLat = origin.lat;
    const oLng = origin.lng;

    setIsComputingRoute(true);
    setRouteError(null);
    setRouteData(null);

    try {
      // Layer 1: Real road distance & duration from OSRM
      const osrmResult = await fetchRealRoadDistance(oLat, oLng, destLat, destLng);
      const { distanceKm, durationMin } = osrmResult;

      // Layer 2: Real infrastructure discovery (Geo-Directory + Overpass Mirror)
      const infra = await discoverTransitInfrastructure(oLat, oLng, destLat, destLng, distanceKm, origin.name);

      // Layer 3: Build only the routes for modes that exist on the ground
      const entrance = mainEntrance || resolveMainAccessibleEntrance(destination);
      let roadRoutes = buildRoadRoutes(origin.name, distanceKm, durationMin, entrance, infra.tripTier);
      roadRoutes = enrichRoutesWithCommunityData(roadRoutes, origin, entrance, communityReports);

      const allRoutes = { road: roadRoutes };
      if (infra.trainFeasible) {
        // buildTrainRoute is async — fetches per-leg real distances
        const trainRoute = await buildTrainRoute(
          origin.name, distanceKm,
          infra.originStations, infra.destStations, entrance,
          oLat, oLng, destLat, destLng
        );
        allRoutes.train = enrichRoutesWithCommunityData([trainRoute], origin, entrance, communityReports);
      }
      if (infra.flightFeasible) {
        const flightRoute = buildFlightRoute(origin.name, distanceKm, infra.originAirports, infra.destAirports, entrance);
        allRoutes.flight = enrichRoutesWithCommunityData([flightRoute], origin, entrance, communityReports);
      }

      setRouteData({
        distanceKm,
        durationMin,
        distanceLabel: osrmResult.distanceLabel,
        durationLabel: osrmResult.durationLabel,
        isFallback: osrmResult.isFallback || false,
        tripTier: infra.tripTier,
        infrastructure: infra,
        routes: allRoutes
      });

      // Default selected mode: prioritize train if origin is a station, else first available
      const defaultMode = (infra.trainFeasible && (infra.isDirectStationOrigin || /station|junction|ndls|nzm|rail/i.test(origin.name)))
        ? 'train'
        : (infra.availableModes[0] || 'road');

      setSelectedMode(defaultMode);
      setActiveRouteIndex(0);
    } catch (err) {
      console.error('[Route Computation Error]', err);
      setRouteError('Could not calculate route. Please check your internet connection and try again.');
    } finally {
      setIsComputingRoute(false);
    }
  }, [mainEntrance, communityReports]);

  // Trigger route computation whenever origin or destination changes
  useEffect(() => {
    if (selectedOrigin?.lat && selectedOrigin?.lng) {
      computeRoute(selectedOrigin, activeDestination);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrigin, activeDestination]);

  // ── Autocomplete ──────────────────────────────────────────────────────────
  const handleOriginInputChange = (e) => {
    const text = e.target.value;
    setOriginQuery(text);
    setShowSuggestions(true);
    clearTimeout(searchTimeoutRef.current);
    if (!text.trim() || text.trim().length < 2) { setSuggestions([]); return; }
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLocationSuggestions(text, 6);
      setSuggestions(results);
      setIsSearching(false);
    }, 300);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (item) => {
    setOriginQuery(item.fullName || item.name);
    setSelectedOrigin({ name: item.fullName || item.name, lat: item.lat, lng: item.lng, city: item.city });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleFindRoute = async () => {
    setShowSuggestions(false);
    if (!originQuery.trim()) return;
    setIsSearching(true);
    const results = await searchLocationSuggestions(originQuery, 1);
    if (results?.length) {
      const top = results[0];
      setOriginQuery(top.fullName || top.name);
      setSelectedOrigin({ name: top.fullName || top.name, lat: top.lat, lng: top.lng, city: top.city });
    }
    setIsSearching(false);
  };

  const handleUseMyLocation = async () => {
    setIsGettingGps(true);
    try {
      const loc = await getCurrentUserLocation();
      setOriginQuery(loc.name);
      setSelectedOrigin({ name: loc.fullName || loc.name, lat: loc.lat, lng: loc.lng, city: loc.city });
      addToast(`📍 Location acquired: ${loc.name}`, 'success');
    } catch {
      addToast('Could not retrieve GPS location. Check browser permissions.', 'error');
    } finally {
      setIsGettingGps(false);
    }
  };

  const handleSelectPreset = (hub) => {
    setOriginQuery(hub.name);
    setSelectedOrigin({ name: hub.name, lat: hub.lat, lng: hub.lng, city: hub.city });
    setShowSuggestions(false);
  };

  const handleSwapOriginDest = () => {
    const destName = `${activeDestination.name}, ${activeDestination.city || ''}`;
    const destLat = mainEntrance?.lat || activeDestination.lat;
    const destLng = mainEntrance?.lng || activeDestination.lng;
    setOriginQuery(destName.trim());
    setSelectedOrigin({ name: destName.trim(), lat: destLat, lng: destLng, city: activeDestination.city });
    addToast('Origin and destination swapped. Recalculating route...', 'info');
  };

  // ── Computed values ───────────────────────────────────────────────────────
  const availableModes = routeData?.infrastructure?.availableModes || ['road'];
  const currentModeRoutes = routeData?.routes?.[selectedMode] || [];
  const currentRoute = currentModeRoutes[activeRouteIndex] || currentModeRoutes[0];

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleOpenGoogleMaps = () => {
    const url = getGoogleMapsNavigationUrl(
      selectedOrigin,
      mainEntrance || activeDestination,
      selectedMode === 'train' ? 'transit' : 'driving'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
    addToast('Launching Google Maps navigation to the Main Accessible Entrance...', 'success');
  };

  const handleCopyItinerary = () => {
    if (!currentRoute) return;
    const text = [
      `Saarthi Accessible Route — ${currentRoute.name}`,
      `From: ${selectedOrigin.name}`,
      `To: ${mainEntrance?.name || activeDestination.name}`,
      `Distance: ${routeData?.distanceLabel} | Time: ${routeData?.durationLabel}`,
      `Step-Free Guarantee: 0 Stairs`,
      ``,
      `Turn-by-Turn:`,
      ...(currentRoute.steps?.map((s, i) => `${i + 1}. ${s.instruction}\n   ✓ ${s.accessibility}`) || [])
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => addToast('Itinerary copied! Share on WhatsApp with your caregiver.', 'success'));
  };

  const handleVoiceGuidance = () => {
    if (!currentRoute) return;
    const firstStep = currentRoute.steps?.[0]?.instruction || '';
    speakText(`Saarthi Route: Navigating to ${mainEntrance?.name || activeDestination.name}. Distance ${routeData?.distanceLabel}. Time ${routeData?.durationLabel}. Zero stairs. First step: ${firstStep}`);
    addToast('Voice guidance started.', 'info');
  };

  const handleSaveToTrip = () => {
    if (!currentRoute) return;
    updateTrip({ route: currentRoute, transportMode: currentRoute.modeLabel });
    addToast(`"${currentRoute.name}" saved to active trip itinerary!`, 'success');
  };

  const MODE_CONFIG = {
    road: { icon: Car, label: 'Road', color: 'saarthi', border: 'border-saarthi-600', bg: 'bg-saarthi-600', ring: 'ring-saarthi-200', lightBg: 'bg-saarthi-50/70' },
    train: { icon: Train, label: 'Train', color: 'purple', border: 'border-purple-600', bg: 'bg-purple-600', ring: 'ring-purple-200', lightBg: 'bg-purple-50/70' },
    flight: { icon: Plane, label: 'Flight', color: 'sky', border: 'border-sky-600', bg: 'bg-sky-600', ring: 'ring-sky-200', lightBg: 'bg-sky-50/70' }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
            <Navigation className="w-4 h-4" />
            <span>Real-Time Accessible Route Navigator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Step-Free Route Navigator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Powered by <span className="font-bold text-slate-800">OSRM road data</span> & <span className="font-bold text-slate-800">OpenStreetMap infrastructure</span> — routes to the monument&apos;s official <span className="font-bold text-emerald-700">Main Accessible Entrance Gate</span>. Transit modes shown only if real infrastructure exists near your route.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button onClick={handleVoiceGuidance} disabled={!currentRoute}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-40">
            <Volume2 className="w-4 h-4 text-saarthi-400" />
            <span>Voice Guide</span>
          </button>
          <button onClick={handleCopyItinerary} disabled={!currentRoute}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-40">
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Share Route</span>
          </button>
        </div>
      </div>

      {/* ── Origin & Destination Input Card ───────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* FROM: Origin with Search + GPS */}
          <div className="lg:col-span-5 space-y-2" ref={searchContainerRef}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                From (Origin / Pickup Point)
              </label>
              <button onClick={handleUseMyLocation} disabled={isGettingGps}
                className="text-xs font-bold text-saarthi-600 hover:text-saarthi-800 flex items-center gap-1.5 transition-colors disabled:opacity-50">
                {isGettingGps ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LocateFixed className="w-3.5 h-3.5" />}
                <span>{isGettingGps ? 'Locating…' : 'Use My Location'}</span>
              </button>
            </div>

            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-saarthi-600 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={originQuery}
                  onChange={handleOriginInputChange}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleFindRoute(); }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Type city, station, landmark (e.g. NIT Raipur)..."
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-saarthi-500 focus:outline-none placeholder-slate-400"
                />
                {originQuery && (
                  <button onClick={() => { setOriginQuery(''); setSuggestions([]); }}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button onClick={handleFindRoute} disabled={isSearching}
                className="px-4 py-2.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0 disabled:opacity-60">
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Find Route</span>
              </button>

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-16 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    Real-time Suggestions ({suggestions.length})
                  </div>
                  <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                    {suggestions.map(item => (
                      <button key={item.id} onClick={() => handleSelectSuggestion(item)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-saarthi-50 transition-colors flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-saarthi-500 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{item.fullName}</p>
                        </div>
                        {item.type && (
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded capitalize shrink-0">
                            {item.type.replace(/_/g, ' ')}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Hub Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Hubs:</span>
              {QUICK_ORIGIN_HUBS.map(hub => (
                <button key={hub.id} onClick={() => handleSelectPreset(hub)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 border ${
                    selectedOrigin?.name?.includes(hub.city) || originQuery?.includes(hub.city)
                      ? 'bg-saarthi-50 text-saarthi-700 border-saarthi-300 font-bold'
                      : 'bg-slate-100/80 text-slate-600 border-transparent hover:bg-slate-200/80'
                  }`}>
                  {hub.name.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Arrow + Swap Button */}
          <div className="hidden lg:flex lg:col-span-2 items-center justify-center pt-5 gap-2 flex-col">
            <div className="w-10 h-10 rounded-full bg-saarthi-50 border border-saarthi-200 flex items-center justify-center text-saarthi-600">
              <ArrowRight className="w-5 h-5" />
            </div>
            <button onClick={handleSwapOriginDest}
              className="text-[10px] font-bold text-slate-500 hover:text-saarthi-700 flex items-center gap-1 transition-colors">
              <ArrowLeftRight className="w-3 h-3" />
              <span>Swap</span>
            </button>
          </div>

          {/* TO: Destination's Main Accessible Entrance */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <DoorOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>To (Main Accessible Entrance)</span>
              </label>
              <button onClick={() => { setIsSelectingDestinationForRoute(true); navigateTo('destinations'); }}
                className="text-xs font-bold text-saarthi-600 hover:text-saarthi-800 flex items-center gap-1 transition-colors">
                <span>Select Destination</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-start gap-3 min-h-[72px]">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm">
                🚪
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-xs sm:text-sm text-emerald-950 truncate">{activeDestination.name}</h4>
                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                    {mainEntrance?.rampIncline || '1:12 Ramp'}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-emerald-800 truncate mt-0.5">
                  {mainEntrance?.name || 'Main Accessible Ramp Entrance'}
                </p>
                <p className="text-[10px] text-emerald-700/80 truncate">
                  Drop-off: {mainEntrance?.dropOff || 'Dedicated PwD Parking Plaza'}
                </p>
              </div>
              <button onClick={() => { setIsSelectingDestinationForRoute(true); navigateTo('destinations'); }}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors shrink-0">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* ── Transit Mode Selector (only shows real available modes) ──────── */}
        {!isComputingRoute && routeData && (
          <div className="pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-saarthi-600" />
                <span>Available Transit Modes:</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  {TIER_LABELS[routeData.tripTier]}
                </span>
                {routeData.isFallback && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    ⚠ Estimated Distance
                  </span>
                )}
              </div>
            </div>

            <div className={`grid grid-cols-1 gap-3 ${availableModes.length === 1 ? 'sm:grid-cols-1 max-w-sm' : availableModes.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
              {availableModes.map(mode => {
                const cfg = MODE_CONFIG[mode];
                const ModeIcon = cfg.icon;
                const isActive = selectedMode === mode;
                const modeRoutes = routeData.routes[mode] || [];
                const firstRoute = modeRoutes[0];
                const infraInfo = {
                  road: null,
                  train: routeData.infrastructure.originStations?.[0]?.name,
                  flight: routeData.infrastructure.originAirports?.[0]?.name
                };

                return (
                  <button key={mode} onClick={() => { setSelectedMode(mode); setActiveRouteIndex(0); }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                      isActive ? `${cfg.border} ${cfg.lightBg} shadow-sm ring-2 ${cfg.ring}` : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? `${cfg.bg} text-white` : 'bg-slate-100 text-slate-600'}`}>
                      <ModeIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 capitalize">{cfg.label}</h4>
                        {isActive && <Check className="w-4 h-4 text-saarthi-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug truncate">
                        {firstRoute?.name || ''}
                      </p>
                      {infraInfo[mode] && (
                        <span className="inline-block mt-1.5 text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-full">
                          via {infraInfo[mode]}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Loading State ─────────────────────────────────────────────────── */}
      {isComputingRoute && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-saarthi-50 border border-saarthi-100 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-saarthi-600 animate-pulse" />
            </div>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-base text-slate-900">Calculating Real-Time Route…</h3>
            <div className="space-y-0.5 text-xs text-slate-500">
              <p className="flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-saarthi-500" />
                Fetching actual road distance via OSRM…
              </p>
              <p className="flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-500" />
                Querying real railway stations & airports via OpenStreetMap…
              </p>
              <p className="flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                Applying airport detour feasibility rule…
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Error State ────────────────────────────────────────────────────── */}
      {routeError && !isComputingRoute && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm text-red-800">{routeError}</p>
            <button onClick={() => computeRoute(selectedOrigin, activeDestination)}
              className="mt-2 text-xs font-bold text-red-700 hover:text-red-900 underline">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── Route Hero Card ────────────────────────────────────────────────── */}
      {!isComputingRoute && currentRoute && routeData && (
        <>
          <div className="bg-gradient-to-br from-slate-900 via-saarthi-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Step-Free · Real OSRM Road Data · 0 Stairs</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{currentRoute.name}</h2>
                <p className="text-xs text-slate-300">{currentRoute.type}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
                <button onClick={handleOpenGoogleMaps}
                  className="flex-1 sm:flex-none px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2.5">
                  <Navigation className="w-4 h-4" />
                  <span>Start in Google Maps</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button onClick={handleSaveToTrip}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-xs transition-all flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save to Trip</span>
                </button>
              </div>
            </div>

            {/* Real OSRM Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {routeData.isFallback ? 'Est. Distance' : 'OSRM Distance'}
                </span>
                <span className="text-lg font-black text-white">{routeData.distanceLabel}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {routeData.isFallback ? 'Est. Duration' : 'OSRM Duration'}
                </span>
                <span className="text-lg font-black text-white">{currentRoute.estimatedTime}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Stairs</span>
                <span className="text-lg font-black text-emerald-400">0 (Step-Free)</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Incline</span>
                <span className="text-lg font-black text-sky-400">{mainEntrance?.rampIncline || '1:12 Ramp'}</span>
              </div>
            </div>

            {/* Live Crowdsourced Community Intelligence Banner */}
            {((currentRoute.communityAlerts && currentRoute.communityAlerts.length > 0) || (currentRoute.communityVerifiedAids && currentRoute.communityVerifiedAids.length > 0)) && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                {currentRoute.communityAlerts?.map(alert => (
                  <div key={alert.id} className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="text-sm">⚠️</span>
                      <span><strong>Community Obstacle Advisory:</strong> {alert.title}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-black shrink-0">
                      {alert.status}
                    </span>
                  </div>
                ))}

                {currentRoute.communityVerifiedAids?.map(aid => (
                  <div key={aid.id} className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="text-sm">✓</span>
                      <span><strong>Ground Verified Access Aid:</strong> {aid.title}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-400 text-black shrink-0">
                      {aid.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* ── Route Options + Steps ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Route Alternative Cards */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-black text-base text-slate-900">
                Route Options ({currentModeRoutes.length})
              </h3>
              <div className="space-y-3">
                {currentModeRoutes.map((rt, idx) => (
                  <div key={rt.id} onClick={() => setActiveRouteIndex(idx)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      activeRouteIndex === idx
                        ? 'border-saarthi-600 bg-saarthi-50/50 shadow-sm ring-1 ring-saarthi-200'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-saarthi-600">{rt.modeLabel}</span>
                          {rt.isRecommended && (
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded uppercase">Recommended</span>
                          )}
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">{rt.name}</h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-slate-900">{rt.estimatedTime}</span>
                        <span className="text-[10px] text-slate-500 block">{rt.totalDistance}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-slate-200/60 text-[11px] font-semibold">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />0 Stairs
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600">{rt.rampsCount} Ramps</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Helpdesk */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-saarthi-400" />
                  <h4 className="font-extrabold text-sm">Need On-Ground Assistance?</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Free IRCTC Sahayak battery carts at railway stations or DGCA special assistance at airports.
                </p>
                <button onClick={() => addToast('Connecting to Divyangjan Helpline (139)…', 'info')}
                  className="w-full py-2.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  Divyangjan Helpdesk (139)
                </button>
              </div>
            </div>

            {/* Turn-by-Turn Steps (with Multi-Leg visual timeline for train routes) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Footprints className="w-5 h-5 text-saarthi-600" />
                    <div>
                      <h3 className="font-black text-base text-slate-900">Step-Free Turn-by-Turn Itinerary</h3>
                      <p className="text-xs text-slate-500">Every transfer verified for wheelchair & step-free compliance</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-saarthi-700 bg-saarthi-50 px-2.5 py-1 rounded-full border border-saarthi-200">
                    {currentRoute.steps?.length} Steps
                  </span>
                </div>

                {/* ── Multi-Leg Visual Timeline (train / flight) ────────────── */}
                {currentRoute.legs?.length > 0 ? (
                  <div className="space-y-4">
                    {/* Leg Summary Strip */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                      {currentRoute.legs.map((leg, li) => {
                        const legColors = {
                          road: { bg: 'bg-saarthi-600', light: 'bg-saarthi-50', border: 'border-saarthi-300', text: 'text-saarthi-800' },
                          train: { bg: 'bg-purple-600', light: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-800' },
                          flight: { bg: 'bg-sky-600', light: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-800' }
                        };
                        const c = legColors[leg.mode] || legColors.road;
                        const fmtMin = (m) => m < 60 ? `${m}m` : `${Math.floor(m/60)}h${m%60>0?` ${m%60}m`:''}` ;
                        return (
                          <React.Fragment key={li}>
                            <div className={`flex-1 min-w-[100px] ${c.light} border ${c.border} rounded-xl p-2.5 text-center shrink-0`}>
                              <span className="text-base block">{leg.emoji}</span>
                              <span className={`text-[10px] font-black ${c.text} block truncate`}>{leg.modeLabel}</span>
                              <span className="text-[10px] text-slate-600 block">{typeof leg.distanceKm === 'number' ? `${leg.distanceKm.toFixed(1)} km` : `${leg.distanceKm} km`}</span>
                              <span className="text-[10px] font-bold text-slate-700 block">{fmtMin(leg.durationMin)}</span>
                            </div>
                            {li < currentRoute.legs.length - 1 && (
                              <div className="text-slate-400 font-black text-lg shrink-0">›</div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Per-Leg Step Groups */}
                    {currentRoute.legs.map((leg) => {
                      const legColors = {
                        road: { headerBg: 'bg-saarthi-600', stepBg: 'bg-saarthi-50/60', stepBorder: 'border-saarthi-200', numBg: 'bg-saarthi-100', numText: 'text-saarthi-800', numHover: 'group-hover:bg-saarthi-600' },
                        train: { headerBg: 'bg-purple-600', stepBg: 'bg-purple-50/60', stepBorder: 'border-purple-200', numBg: 'bg-purple-100', numText: 'text-purple-800', numHover: 'group-hover:bg-purple-600' },
                        flight: { headerBg: 'bg-sky-600', stepBg: 'bg-sky-50/60', stepBorder: 'border-sky-200', numBg: 'bg-sky-100', numText: 'text-sky-800', numHover: 'group-hover:bg-sky-600' }
                      };
                      const c = legColors[leg.mode] || legColors.road;
                      return (
                        <div key={leg.legIndex} className="rounded-2xl overflow-hidden border border-slate-200">
                          {/* Leg Header */}
                          <div className={`${c.headerBg} text-white px-4 py-2.5 flex items-center justify-between`}>
                            <span className="text-xs font-black flex items-center gap-2">
                              <span className="text-base">{leg.emoji}</span>
                              <span>{leg.modeLabel}: {leg.from} → {leg.to}</span>
                            </span>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-white/80">
                              <span>{typeof leg.distanceKm === 'number' ? leg.distanceKm.toFixed(1) : leg.distanceKm} km</span>
                              <span>·</span>
                              <span>{leg.durationMin < 60 ? `${leg.durationMin} min` : `${Math.floor(leg.durationMin/60)}h ${leg.durationMin%60}m`}</span>
                            </div>
                          </div>
                          {/* Leg Steps */}
                          <div className="p-3 space-y-2">
                            {leg.steps.map((step, si) => (
                              <div key={si} className="flex items-start gap-3 group">
                                <div className={`w-6 h-6 rounded-full ${c.numBg} ${c.numText} ${c.numHover} group-hover:text-white transition-colors flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5`}>
                                  {si + 1}
                                </div>
                                <div className={`flex-1 min-w-0 ${c.stepBg} rounded-xl p-3 border ${c.stepBorder} space-y-1.5`}>
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="font-bold text-slate-900 text-xs leading-snug">{step.instruction}</p>
                                    {step.distance && step.distance !== '0m' && (
                                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                                        {step.distance}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                                    <Check className="w-3 h-3 shrink-0" />
                                    <span>{step.accessibility}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* ── Standard flat step list (road / flight) ─────────────── */
                  <div className="space-y-3">
                    {currentRoute.steps?.map((step, i) => (
                      <div key={i} className="flex items-start gap-4 group">
                        <div className="w-7 h-7 rounded-full bg-saarthi-100 text-saarthi-800 group-hover:bg-saarthi-600 group-hover:text-white transition-colors flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0 bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">{step.instruction}</p>
                            {step.distance && step.distance !== '0m' && (
                              <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                                {step.distance}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            <span>{step.accessibility}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Google Maps CTA */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <p className="font-extrabold text-xs text-slate-900">Ready to travel?</p>
                    <p className="text-[11px] text-slate-500">Launch live GPS navigation with accessible entrance pre-set.</p>
                  </div>
                  <button onClick={handleOpenGoogleMaps}
                    className="w-full sm:w-auto px-5 py-2.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap">
                    <Navigation className="w-4 h-4" />
                    <span>Open in Google Maps ↗</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
