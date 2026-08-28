import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Navigation, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Building2, 
  Info,
  MapPinCheck,
  Check,
  Compass,
  ArrowRight,
  Globe2,
  Filter,
  XCircle,
  Train,
  TreePine,
  Send
} from 'lucide-react';
import { fetchAttractionRecommendations } from '../../services/recommendationService';
import { INDIA_STATES_AND_CITIES } from '../../data/indiaStatesData';
import { resolveMainAccessibleEntrance } from '../../services/routeService';

export default function DestinationsView() {
  const { 
    currentUser, 
    userProfile, 
    navigateTo, 
    setSelectedDestination,
    isSelectingDestinationForRoute,
    setIsSelectingDestinationForRoute,
    setNavigatingToEntrance,
    addToast 
  } = useApp();

  // State & City Cascading Selection (Alphabetically organized)
  const [selectedStateIndex, setSelectedStateIndex] = useState(0); // Default: All India
  const [selectedCity, setSelectedCity] = useState(INDIA_STATES_AND_CITIES[0].cities[0]);
  
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [isAuditRequested, setIsAuditRequested] = useState(false);

  // PS 49 Infrastructure Filters
  const [filterRampOnly, setFilterRampOnly] = useState(false);
  const [filterToiletOnly, setFilterToiletOnly] = useState(false);
  const [filterCartOnly, setFilterCartOnly] = useState(false);
  const [filterSensoryOnly, setFilterSensoryOnly] = useState(false);

  const currentStateObj = INDIA_STATES_AND_CITIES[selectedStateIndex] || INDIA_STATES_AND_CITIES[0];
  const availableCities = currentStateObj.cities;

  // Popular Top Circuits Quick Bar
  const popularRegions = [
    { stateName: "🇮🇳 All India (National Heritage Circuits)", city: "Top National Heritage Circuits", label: "🇮🇳 All India" },
    { stateName: "Delhi NCR", city: "South Delhi (Qutub Minar & Mehrauli)", label: "🏛️ Delhi NCR" },
    { stateName: "Uttar Pradesh", city: "Agra (Taj Mahal, Agra Fort, Fatehpur Sikri)", label: "🕌 Agra & UP" },
    { stateName: "Rajasthan", city: "Jaipur (Amber Fort, Hawa Mahal, City Palace)", label: "🏰 Jaipur" },
    { stateName: "Uttar Pradesh", city: "Varanasi (Kashi Vishwanath, Sarnath & Ganga Ghats)", label: "🕉️ Varanasi" },
    { stateName: "Karnataka", city: "Mysuru (Mysore Palace)", label: "👑 Mysuru" },
    { stateName: "Goa", city: "North Goa (Calangute, Candolim, Fort Aguada)", label: "🌴 Goa" }
  ];

  // Handle State Dropdown Change
  const handleStateChange = (e) => {
    const newIdx = parseInt(e.target.value, 10);
    setSelectedStateIndex(newIdx);
    const newCities = INDIA_STATES_AND_CITIES[newIdx].cities;
    setSelectedCity(newCities[0]);
    setIsAuditRequested(false);
  };

  // Handle City Dropdown Change
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setIsAuditRequested(false);
  };

  // Load recommendations whenever selectedStateIndex, selectedCity, or userProfile changes
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const queryRegion = selectedStateIndex === 0 
          ? 'all' 
          : `${selectedCity}, ${currentStateObj.state}`;

        const data = await fetchAttractionRecommendations(queryRegion, userProfile || currentUser?.accessibilityProfile || {});
        if (isMounted) {
          setRecommendations(data);
          if (data.length > 0) {
            setExpandedCardId(data[0].id); // auto-expand top match
          }
        }
      } catch (err) {
        console.error('Failed to load attraction recommendations:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [selectedStateIndex, selectedCity, userProfile, currentUser]);

  const handleManualFetch = async () => {
    setIsLoading(true);
    try {
      const queryRegion = selectedStateIndex === 0 
        ? 'all' 
        : `${selectedCity}, ${currentStateObj.state}`;
      const data = await fetchAttractionRecommendations(queryRegion, userProfile || currentUser?.accessibilityProfile || {});
      setRecommendations(data);
      if (data.length > 0) {
        setExpandedCardId(data[0].id);
        addToast(`Loaded ${data.length} accessible recommendations for ${selectedCity}!`, 'success');
      }
    } catch (err) {
      addToast('Error fetching regional accessibility audits.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAudit = () => {
    setIsAuditRequested(true);
    addToast(`📢 Audit request for ${selectedCity} dispatched to local volunteers & certified guides!`, 'success');
  };

  // Filter recommendations by PS 49 infrastructure checkboxes
  const filteredRecommendations = recommendations.filter(item => {
    if (filterRampOnly && !item.entrances?.stepFree) return false;
    if (filterToiletOnly && (!item.toilets?.available || !item.toilets?.rollIn)) return false;
    if (filterCartOnly && !item.transport?.golfCarts) return false;
    if (filterSensoryOnly && (!item.sensoryAids?.braille && !item.sensoryAids?.audioGuide && !item.sensoryAids?.islAvailable)) return false;
    return true;
  });

  const handlePlanRoute = (attraction) => {
    const entrance = resolveMainAccessibleEntrance(attraction);
    setSelectedDestination({
      id: attraction.id,
      name: attraction.name,
      city: attraction.city,
      state: attraction.state,
      coordinates: attraction.coordinates,
      image: attraction.image,
      accessibilityScore: attraction.calculatedMatchScore || 90,
      description: attraction.description,
      mainEntrance: entrance
    });
    setNavigatingToEntrance(entrance);
    setIsSelectingDestinationForRoute(false);
    addToast(`Selected ${attraction.name} (${entrance?.name || 'Main Entrance'}) for Route Navigator!`, 'success');
    navigateTo('route-planner');
  };

  const handleCheckAudit = (attraction) => {
    navigateTo('places');
  };

  const userDisabilityTitle = userProfile?.primaryDisability || currentUser?.accessibilityProfile?.primaryDisability || 'Wheelchair & Mobility';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Contextual Route Destination Selector Banner */}
      {isSelectingDestinationForRoute && (
        <div className="bg-saarthi-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base">Select Destination for Route Navigator</h3>
              <p className="text-xs text-sky-100">Click &quot;Plan Step-Free Route&quot; on any attraction below. Your navigation will automatically route to its official Main Accessible Entrance.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSelectingDestinationForRoute(false);
              navigateTo('route-planner');
            }}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0"
          >
            ← Cancel & Back to Navigator
          </button>
        </div>
      )}

      {/* 1. Header Banner with Active User Profile Alignment */}
      <div className="bg-gradient-to-r from-slate-900 via-saarthi-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-saarthi-500/20 text-saarthi-300 border border-saarthi-400/30 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>PS 49 AI Attraction Recommendation Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Accessible Attractions for You
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Attractions dynamically audited and ranked by on-ground infrastructure compatibility (ramped entrances, roll-in washrooms, battery carts, tactile trails, and sensory guides) for your profile.
            </p>
          </div>

          {/* Active Traveler Profile Match Pill */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[260px] space-y-1.5 shrink-0">
            <div className="flex items-center gap-2 text-xs text-saarthi-300 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Matching Profile</span>
            </div>
            <p className="text-base font-extrabold text-white">{currentUser.name}</p>
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[11px] font-bold bg-saarthi-600 text-white px-2.5 py-0.5 rounded-full">
                {userDisabilityTitle}
              </span>
              <span className="text-[11px] font-medium bg-white/20 text-slate-200 px-2 py-0.5 rounded-full">
                {userProfile?.mobilityAid || 'Manual Wheelchair'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. State & District Cascading Dropdowns (Alphabetically Ordered) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">
            <Globe2 className="w-4 h-4 text-saarthi-600" />
            <span>Select State & District (All India A–Z Coverage):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* State Dropdown (5 cols) */}
            <div className="md:col-span-5 space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">1. State / Union Territory (A–Z)</label>
              <div className="relative">
                <select
                  value={selectedStateIndex}
                  onChange={handleStateChange}
                  className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-saarthi-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {INDIA_STATES_AND_CITIES.map((item, idx) => (
                    <option key={item.stateCode || idx} value={idx}>
                      {item.state}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* City / District Dropdown (5 cols) */}
            <div className="md:col-span-5 space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">2. District / Tourist Hub (A–Z)</label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-saarthi-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Fetch Button (2 cols) */}
            <div className="md:col-span-2 space-y-1 flex flex-col justify-end">
              <button
                onClick={handleManualFetch}
                disabled={isLoading}
                className="w-full py-3.5 bg-saarthi-600 hover:bg-saarthi-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Fetch AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Regional Circuit Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1 uppercase tracking-wider">
            Popular Circuits:
          </span>
          {popularRegions.map((chip, idx) => {
            const foundIdx = INDIA_STATES_AND_CITIES.findIndex(s => s.state.includes(chip.stateName));
            const isChipActive = selectedStateIndex === foundIdx && selectedCity === chip.city;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (foundIdx !== -1) {
                    setSelectedStateIndex(foundIdx);
                    setSelectedCity(chip.city);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isChipActive
                    ? 'bg-saarthi-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* PS 49 Granular Infrastructure Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-600 mr-2 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-saarthi-600" />
            <span>Filter by PS 49 Infrastructure:</span>
          </span>

          <button
            onClick={() => setFilterRampOnly(!filterRampOnly)}
            className={`px-3 py-1.5 rounded-xl font-semibold border flex items-center gap-1.5 transition-all ${
              filterRampOnly
                ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filterRampOnly ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
            <span>🚪 100% Step-Free Ramps</span>
          </button>

          <button
            onClick={() => setFilterToiletOnly(!filterToiletOnly)}
            className={`px-3 py-1.5 rounded-xl font-semibold border flex items-center gap-1.5 transition-all ${
              filterToiletOnly
                ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filterToiletOnly ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
            <span>🚻 Roll-In Toilets On-Site</span>
          </button>

          <button
            onClick={() => setFilterCartOnly(!filterCartOnly)}
            className={`px-3 py-1.5 rounded-xl font-semibold border flex items-center gap-1.5 transition-all ${
              filterCartOnly
                ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filterCartOnly ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
            <span>🚌 Electric Golf Cart / Transit</span>
          </button>

          <button
            onClick={() => setFilterSensoryOnly(!filterSensoryOnly)}
            className={`px-3 py-1.5 rounded-xl font-semibold border flex items-center gap-1.5 transition-all ${
              filterSensoryOnly
                ? 'bg-purple-50 border-purple-400 text-purple-800 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filterSensoryOnly ? <Check className="w-3.5 h-3.5 text-purple-600" /> : null}
            <span>🎧 Audio Guides & Braille / ISL</span>
          </button>
        </div>
      </div>

      {/* 3. Ranked Recommendations List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">
              Ranked Attractions in {selectedStateIndex === 0 ? "Top Indian Heritage Circuits" : selectedCity} ({filteredRecommendations.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              • Sorted by Compatibility Score
            </span>
          </div>
          <span className="text-xs font-bold text-saarthi-700 bg-saarthi-50 px-3 py-1 rounded-full border border-saarthi-200">
            Real-Time AI Audits
          </span>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-pulse flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 h-44 bg-slate-200 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-slate-200 rounded-lg w-1/3" />
                  <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
                  <div className="h-16 bg-slate-100 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRecommendations.length === 0 ? (
          
          /* ── 4-PART SCREENSHOT HANDLER FOR FEW OR NO ACCESSIBLE SITES ── */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-xs font-black text-amber-700 uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>On-Ground Accessibility Intelligence Notice</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Accessibility Assessment for {selectedCity}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Our Sugamya Bharat engine evaluated on-ground facilities in this district against your {userDisabilityTitle} profile.
              </p>
            </div>

            {/* 1. Honest Barrier Warnings (Low Score) */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>1. Honest Physical Barrier Report</span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed font-medium">
                Traditional sites in this selected location currently have structural limitations:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="bg-white text-rose-800 border border-rose-300 text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 shadow-xs">
                  ❌ Severe step barrier
                </span>
                <span className="bg-white text-rose-800 border border-rose-300 text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 shadow-xs">
                  ❌ No verified roll-in accessible washroom
                </span>
                <span className="bg-white text-rose-800 border border-rose-300 text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 shadow-xs">
                  ⚠️ Rough gravel / unpaved terrain
                </span>
              </div>
            </div>

            {/* 2. "Nearby Accessible Alternatives" Suggestion */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>2. Nearby Verified Accessible Alternatives in {currentStateObj.state}</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Looking for barrier-free travel? Here are the highest-rated verified accessible destinations within your state/circuit:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div 
                  onClick={() => {
                    setSelectedStateIndex(0);
                    setSelectedCity("Agra (Taj Mahal Circuit)");
                  }}
                  className="bg-white p-3.5 rounded-xl border border-emerald-200 hover:border-emerald-400 cursor-pointer shadow-xs transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🕌</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Taj Mahal Complex, Agra</p>
                      <p className="text-[10px] text-slate-500">Step-free ramps • Electric golf carts</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                    97% Match
                  </span>
                </div>

                <div 
                  onClick={() => {
                    setSelectedStateIndex(0);
                    setSelectedCity("Delhi NCR (Qutub & Humayun Circuit)");
                  }}
                  className="bg-white p-3.5 rounded-xl border border-emerald-200 hover:border-emerald-400 cursor-pointer shadow-xs transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🏛️</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Humayun's Tomb & Sunder Nursery</p>
                      <p className="text-[10px] text-slate-500">Tactile paving • 4 Roll-in Toilets</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                    95% Match
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Public Infrastructure Coverage */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Building2 className="w-4 h-4 text-saarthi-600" />
                <span>3. Public & Transit Infrastructure Coverage</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
                  <Train className="w-4 h-4 text-saarthi-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Central Railway Station Access</strong>
                    <span className="text-[11px] text-slate-500">Sugamya Bharat wheelchair assistance & battery cars bookable via 139</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
                  <TreePine className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Municipal Parks & Riverfronts</strong>
                    <span className="text-[11px] text-slate-500">Smart City flat paved walking loops with zero step thresholds</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Request Volunteer Audit Button */}
            <div className="bg-gradient-to-r from-saarthi-50 to-blue-50 border border-saarthi-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 font-extrabold text-saarthi-900 text-sm">
                  <Users className="w-4 h-4 text-saarthi-600" />
                  <span>4. Help Expand Coverage for {selectedCity}</span>
                </div>
                <p className="text-xs text-slate-600">
                  Request local certified guides or PwD community volunteers to audit ramp slopes and restrooms here.
                </p>
              </div>

              <button
                onClick={handleRequestAudit}
                disabled={isAuditRequested}
                className="px-5 py-2.5 bg-saarthi-600 hover:bg-saarthi-700 disabled:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
              >
                {isAuditRequested ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Audit Request Dispatched!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>📢 Request Volunteer Audit</span>
                  </>
                )}
              </button>
            </div>

          </div>

        ) : (
          <div className="space-y-6">
            {filteredRecommendations.map((attraction, idx) => {
              const isExpanded = expandedCardId === attraction.id;
              const matchScore = attraction.calculatedMatchScore || 85;

              // Color-coded badge & barrier indicator
              let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
              let badgeDot = 'bg-emerald-500';
              let badgeText = '✨ Exceptional Match';
              if (matchScore < 90 && matchScore >= 75) {
                badgeColor = 'bg-amber-50 text-amber-800 border-amber-300';
                badgeDot = 'bg-amber-500';
                badgeText = '🟡 Good Match with Assistance';
              } else if (matchScore < 75) {
                badgeColor = 'bg-rose-50 text-rose-800 border-rose-300';
                badgeDot = 'bg-rose-500';
                badgeText = '⚠️ Limited Accessibility';
              }

              const hasSevereBarrier = matchScore < 75 || !attraction.entrances?.stepFree;

              return (
                <div
                  key={attraction.id}
                  className={`bg-white rounded-3xl border-2 transition-all shadow-sm hover:shadow-md overflow-hidden ${
                    isExpanded ? 'border-saarthi-500 ring-2 ring-saarthi-100' : 'border-slate-200'
                  }`}
                >
                  <div className="p-6 sm:p-7">
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* Left: Monument Image */}
                      <div className="relative w-full lg:w-72 h-48 sm:h-52 rounded-2xl overflow-hidden shrink-0 shadow-md">
                        <img
                          src={attraction.image}
                          alt={attraction.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                          #{idx + 1} Recommendation
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-slate-800 flex items-center justify-between">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-saarthi-600 shrink-0" />
                            {attraction.city}, {attraction.state}
                          </span>
                        </div>
                      </div>

                      {/* Center / Right: Details & Explainability */}
                      <div className="flex-1 space-y-3.5 flex flex-col justify-between">
                        <div>
                          {/* Top Row: Title & Match Score Badge */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-bold text-saarthi-600 uppercase tracking-wider block">
                                {attraction.category}
                              </span>
                              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                                {attraction.name}
                              </h3>
                            </div>

                            {/* Match % Score */}
                            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${badgeColor}`}>
                              <span className={`w-2.5 h-2.5 rounded-full ${badgeDot} animate-pulse`} />
                              <span className="text-base font-black">{matchScore}%</span>
                              <span className="text-xs font-bold hidden sm:inline">• {badgeText}</span>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                            {attraction.description}
                          </p>

                          {/* PS 49 Granular Infrastructure Chips & Barrier Warnings */}
                          <div className="flex flex-wrap gap-2 pt-3">
                            {attraction.entrances?.stepFree ? (
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                🚪 {attraction.entrances.rampIncline || 'Step-Free Ramp'}
                              </span>
                            ) : (
                              <span className="bg-rose-50 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                ❌ Severe step barrier
                              </span>
                            )}

                            {attraction.toilets?.available && attraction.toilets?.rollIn ? (
                              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                🚻 {attraction.toilets.count || 2} Roll-In Washrooms
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                                ⚠️ No roll-in washroom on-site
                              </span>
                            )}

                            {attraction.transport?.golfCarts && (
                              <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                🚌 Electric Golf Cart Shuttle
                              </span>
                            )}
                            {attraction.paths?.tactilePaving && (
                              <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                🛤️ Tactile Path
                              </span>
                            )}
                            {attraction.sensoryAids?.audioGuide && (
                              <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                🎧 Audio / Braille Guides
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => handlePlanRoute(attraction)}
                            className="px-5 py-2.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                          >
                            <Navigation className="w-4 h-4" />
                            <span>Plan Step-Free Route</span>
                          </button>

                          <button
                            onClick={() => handleCheckAudit(attraction)}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                          >
                            <MapPinCheck className="w-4 h-4 text-saarthi-600" />
                            <span>Check On-Ground Audit</span>
                          </button>

                          <button
                            onClick={() => setExpandedCardId(isExpanded ? null : attraction.id)}
                            className="ml-auto text-xs font-bold text-saarthi-700 hover:text-saarthi-900 flex items-center gap-1 p-2"
                          >
                            <span>{isExpanded ? 'Hide Why Recommended' : 'Why Recommended for You'}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Explainability Panel ("Why Recommended") */}
                    {isExpanded && (
                      <div className="mt-5 pt-4 border-t border-slate-200/80 bg-slate-50 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-saarthi-600" />
                          <span>Why Recommended for Your {userDisabilityTitle} Profile:</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {(attraction.currentWhyRecommended || []).map((reason, rIdx) => (
                            <div key={rIdx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                {reason}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Precautions Box */}
                        {attraction.precautions && attraction.precautions.length > 0 && (
                          <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold block mb-0.5">On-Ground Navigation Advisory:</strong>
                              <p className="leading-relaxed">{attraction.precautions.join(' ')}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
