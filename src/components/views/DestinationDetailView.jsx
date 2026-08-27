import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Navigation, 
  Hotel, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Hospital, 
  PhoneCall, 
  Ruler, 
  Building2, 
  Sparkles,
  Layers,
  Heart,
  Share2,
  Calendar,
  MapPinCheck
} from 'lucide-react';
import { speakText } from '../../services/translationService';

export default function DestinationDetailView() {
  const { 
    selectedDestination, 
    navigateTo, 
    destinations, 
    updateTrip, 
    currentTrip, 
    addToast,
    communityReports 
  } = useApp();

  const dest = selectedDestination || destinations[0];

  const handleAddToTrip = () => {
    const isAlreadyAdded = currentTrip.destinations.some(d => d.id === dest.id);
    if (isAlreadyAdded) {
      addToast(`${dest.name} is already in your active trip planner!`, 'info');
    } else {
      updateTrip({
        destinations: [...currentTrip.destinations, dest]
      });
      addToast(`Added ${dest.name} to your active trip itinerary!`, 'success');
    }
  };

  const handleReadAloud = () => {
    speakText(`${dest.name} in ${dest.city}. Accessibility score: ${dest.accessibilityScore} out of 100. ${dest.description}. Ramp slope: ${dest.specs.rampSlope}.`);
    addToast("Reading destination accessibility overview aloud...", "info");
  };

  // Find community reports for this destination
  const destReports = communityReports.filter(r => r.destinationId === dest.id || r.city === dest.city);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('destinations')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Destinations</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReadAloud}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
            title="Read accessibility details aloud"
          >
            <span>🔊 Read Aloud</span>
          </button>

          <button
            onClick={handleAddToTrip}
            className="px-4 py-2 rounded-xl bg-saarthi-600 hover:bg-saarthi-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add to My Trip</span>
          </button>
        </div>
      </div>

      {/* Hero Media & Overview Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 relative h-72 lg:h-full min-h-[320px]">
          <img
            src={dest.image}
            alt={dest.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-saarthi-400" />
            <span>{dest.city}, {dest.state}</span>
          </div>
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-900 px-3.5 py-1.5 rounded-xl shadow-lg font-black text-sm flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>Score: {dest.accessibilityScore}/100</span>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{dest.verificationStatus}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {dest.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Category: {dest.category} • Last Verified: {dest.lastVerifiedDate}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4">
              {dest.description}
            </p>

            {/* Quick Pricing & Hours */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Entry Fee</span>
                <span className="font-semibold text-slate-900 text-[11px]">{dest.entryFee}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Best Visit Time</span>
                <span className="font-semibold text-slate-900 text-[11px]">{dest.bestVisitingHours}</span>
              </div>
            </div>
          </div>

          {/* Core Action CTA Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => navigateTo('route-planner')}
              className="py-3 px-3 rounded-xl bg-saarthi-600 hover:bg-saarthi-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Plan Step-Free Route</span>
            </button>

            <button
              onClick={() => navigateTo('places')}
              className="py-3 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <MapPinCheck className="w-4 h-4" />
              <span>Verify Entrances & Points</span>
            </button>

            <button
              onClick={() => navigateTo('guides')}
              className="py-3 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Find Verified Guide</span>
            </button>

            <button
              onClick={() => navigateTo('community-map')}
              className="py-3 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Report Accessibility</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column: Detailed Facility Audit & Technical Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Facilities Checklist (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-saarthi-600" />
              <span>Verified Accessibility Facilities Checklist</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Audited against CPWD Harmonized Guidelines & Sugamya Bharat criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              { label: "Wheelchair Accessible Paths", val: dest.facilities.wheelchairAccessible },
              { label: "Step-Free Accessible Entrance", val: dest.facilities.accessibleEntrance },
              { label: "Anti-Skid Ramp Access", val: dest.facilities.ramps },
              { label: "Elevators / Hydraulic Lifts", val: dest.facilities.elevators },
              { label: "PwD Washroom with Grab Bars", val: dest.facilities.accessibleWashrooms },
              { label: "Tactile Ground Flooring", val: dest.facilities.tactilePaving },
              { label: "Braille Signage & Tactile Maps", val: dest.facilities.brailleSignage },
              { label: "Audio Guides / Transcripts", val: dest.facilities.audioGuides },
              { label: "Designated PwD Parking", val: dest.facilities.accessibleParking },
              { label: "Electric Golf-Cart Shuttles", val: dest.facilities.electricGolfCarts },
              { label: "Sign-Language Guide On-Call", val: dest.facilities.signLanguageGuideAvailable },
              { label: "Wheelchair Battery Charging Bay", val: dest.facilities.wheelchairChargingStation }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
                  item.val
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span>{item.label}</span>
                {item.val ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Technical Specs Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-saarthi-600" />
              <span>Architectural Measurements & Specifications</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-500 block text-[10px]">Ramp Gradient</span>
                <span className="font-bold text-slate-900">{dest.specs.rampSlope}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-500 block text-[10px]">Path Width</span>
                <span className="font-bold text-slate-900">{dest.specs.pathWidth}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-500 block text-[10px]">Entrance Doorway</span>
                <span className="font-bold text-slate-900">{dest.specs.doorwayWidth}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-500 block text-[10px]">Resting Gazebos</span>
                <span className="font-bold text-slate-900">{dest.specs.restAreasCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Emergency Contacts & Community Reports (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency & Medical Box */}
          <div className="bg-red-50 rounded-3xl p-6 border border-red-200 space-y-4">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <Hospital className="w-5 h-5" />
              <span>Nearby Emergency & Medical Care</span>
            </div>

            <div className="space-y-2 text-xs text-slate-800">
              <div className="bg-white p-3 rounded-xl border border-red-100">
                <span className="font-bold text-slate-900 block">Nearest Trauma Center:</span>
                <p className="text-slate-600 mt-0.5">{dest.nearbyHospital}</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-red-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Local Emergency Helpdesk:</span>
                  <span className="text-red-700 font-mono font-bold">{dest.emergencyHelpline}</span>
                </div>
                <a
                  href={`tel:${dest.emergencyHelpline.split('/')[0].trim()}`}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call
                </a>
              </div>
            </div>
          </div>

          {/* Community Reports for this Location */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-saarthi-600" />
                <span>Live Community Reports ({destReports.length})</span>
              </h3>
              <button
                onClick={() => navigateTo('community-map')}
                className="text-xs font-bold text-saarthi-600 hover:underline"
              >
                View on Map →
              </button>
            </div>

            <div className="space-y-3">
              {destReports.slice(0, 3).map((rep) => (
                <div key={rep.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rep.title}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      ✓ {rep.confirmCount} Confirms
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{rep.description}</p>
                  <p className="text-[10px] text-slate-400">By {rep.contributor} • {rep.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
