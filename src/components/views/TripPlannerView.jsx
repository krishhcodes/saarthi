import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  Hotel, 
  Users, 
  Navigation, 
  Gauge, 
  ShieldCheck, 
  Trash2, 
  Plus, 
  Download, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TripPlannerView() {
  const { currentTrip, updateTrip, navigateTo, destinations, addToast } = useApp();
  const [tripTitle, setTripTitle] = useState(currentTrip.title);
  const [startDate, setStartDate] = useState(currentTrip.startDate);
  const [endDate, setEndDate] = useState(currentTrip.endDate);
  const [isSaved, setIsSaved] = useState(false);

  const handleRemoveDestination = (destId) => {
    const updated = currentTrip.destinations.filter(d => d.id !== destId);
    updateTrip({ destinations: updated });
    addToast("Destination removed from itinerary.", "info");
  };

  const handleSaveTrip = () => {
    updateTrip({
      title: tripTitle,
      startDate: startDate,
      endDate: endDate
    });
    setIsSaved(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    addToast("Accessible Trip Itinerary saved to your profile!", "success");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>End-to-End Accessible Travel Itinerary</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            My Accessible Trip Planner
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Build and optimize a seamless journey combining step-free heritage tours, verified suites, certified escorts, and battery buggy links.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Itinerary</span>
          </button>

          <button
            onClick={handleSaveTrip}
            className="px-5 py-2.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Accessible Trip</span>
          </button>
        </div>
      </div>

      {/* Hero Overview & Live Journey Score Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-3">
          <input
            type="text"
            value={tripTitle}
            onChange={(e) => setTripTitle(e.target.value)}
            className="text-xl sm:text-2xl font-black text-slate-900 w-full border-b border-transparent hover:border-slate-300 focus:border-saarthi-500 focus:outline-none bg-transparent"
          />

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-saarthi-600" />
              <span>Dates: {startDate} to {endDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Destinations: {currentTrip.destinations.length} Monument(s)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Guide: {currentTrip.guide?.name || "Not selected"}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-saarthi-950 text-white rounded-2xl p-5 border border-slate-800 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold text-saarthi-300 uppercase tracking-wider block">
              Trip Journey Score
            </span>
            <div className="text-3xl font-black text-emerald-400 mt-0.5">
              {currentTrip.scores.overall} / 100
            </div>
            <span className="text-[11px] text-slate-300">Certified Barrier-Free</span>
          </div>

          <button
            onClick={() => navigateTo('journey-score')}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Breakdown →
          </button>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <span>Chronological Barrier-Free Timeline</span>
          <span className="text-xs font-bold bg-saarthi-100 text-saarthi-700 px-2.5 py-0.5 rounded-full">
            3-Day Circuit
          </span>
        </h3>

        <div className="space-y-4">
          {/* Item 1: Accessible Accommodation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                <Hotel className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  Hotel Basecamp (Check-in: {startDate})
                </span>
                <h4 className="font-extrabold text-base text-slate-900">
                  {currentTrip.hotel?.name || "The Oberoi Amarvilas (Accessible Suite)"}
                </h4>
                <p className="text-xs text-slate-500">
                  Roll-in shower • 95cm wide doorways • Padded transfer bench • Score {currentTrip.hotel?.accessibilityScore || 96}/100
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('hotels')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 whitespace-nowrap self-end md:self-auto"
            >
              Change Hotel →
            </button>
          </div>

          {/* Item 2: Specialized Guide Link */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                  Specialized Escort (Day 1 & Day 2)
                </span>
                <h4 className="font-extrabold text-base text-slate-900">
                  {currentTrip.guide?.name || "Vikram Singh (Sugamya Specialist)"}
                </h4>
                <p className="text-xs text-slate-500">
                  {currentTrip.guide?.specializations?.join(' • ') || "Wheelchair Navigation & Sign Language"} • Verified MOT License
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('guides')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 whitespace-nowrap self-end md:self-auto"
            >
              Change Guide →
            </button>
          </div>

          {/* Item 3: Step-Free Route */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Transit & Navigation Path
                </span>
                <h4 className="font-extrabold text-base text-slate-900">
                  {currentTrip.route?.name || "Shilpgram to East Gate (0 Stairs & 4 Ramps)"}
                </h4>
                <p className="text-xs text-slate-500">
                  {currentTrip.transportMode} • Distance {currentTrip.route?.totalDistance || "1.4 km"} • Route Score {currentTrip.route?.accessibilityScore || 96}/100
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('route-planner')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 whitespace-nowrap self-end md:self-auto"
            >
              Inspect Path →
            </button>
          </div>

          {/* Item 4: Destinations in Itinerary */}
          {currentTrip.destinations.map((dest, idx) => (
            <div
              key={dest.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-saarthi-600 uppercase tracking-wider">
                    Monument Visit #{idx + 1}
                  </span>
                  <h4 className="font-extrabold text-base text-slate-900">{dest.name}</h4>
                  <p className="text-xs text-slate-500">
                    {dest.city} • 1:12 Ramp to platform • PwD Washrooms • Score {dest.accessibilityScore}/100
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <button
                  onClick={() => navigateTo('destination-detail', { destination: dest })}
                  className="text-xs font-bold text-saarthi-600 hover:underline"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleRemoveDestination(dest.id)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                  title="Remove from itinerary"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigateTo('destinations')}
          className="w-full py-4 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-3xl text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Monument to Itinerary</span>
        </button>
      </div>
    </div>
  );
}
