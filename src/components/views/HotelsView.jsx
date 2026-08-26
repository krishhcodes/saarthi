import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Hotel, 
  Search, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Ruler, 
  PhoneCall, 
  Check, 
  PlusCircle,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

export default function HotelsView() {
  const { 
    hotels, 
    navigateTo, 
    updateTrip, 
    currentTrip, 
    addToast 
  } = useApp();

  const [selectedCity, setSelectedCity] = useState('All');
  const [filterRollInShower, setFilterRollInShower] = useState(false);
  const [filterVisualAlarms, setFilterVisualAlarms] = useState(false);
  const [filterSignStaff, setFilterSignStaff] = useState(false);
  const [bookingModalHotel, setBookingModalHotel] = useState(null);

  const cities = ['All', 'Agra', 'Delhi', 'Jaipur', 'Mumbai', 'Goa', 'Kochi', 'Bengaluru', 'Hyderabad', 'Varanasi', 'Udaipur'];

  const filteredHotels = hotels.filter(h => {
    if (selectedCity !== 'All' && h.city !== selectedCity) return false;
    if (filterRollInShower && !h.facilities.rollInShower) return false;
    if (filterVisualAlarms && !h.facilities.visualSmokeAlarms) return false;
    if (filterSignStaff && !h.facilities.signLanguageStaff) return false;
    return true;
  });

  const handleSelectHotel = (hotel) => {
    updateTrip({
      hotel: hotel
    });
    addToast(`Selected "${hotel.name}" for your active trip itinerary! Stay score updated to ${hotel.accessibilityScore}/100.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
          <Hotel className="w-3.5 h-3.5" />
          <span>Universal Barrier-Free Accommodation</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Accessible Stays & Heritage Suites
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Every hotel is audited with physical measurements: roll-in shower benches, bed transfer height (50cm), wide doorways, and sensory emergency alarms.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
          >
            {cities.map(city => (
              <option key={city} value={city}>
                {city === 'All' ? '📍 All 10 Indian Hubs' : `📍 ${city}`}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFilterRollInShower(!filterRollInShower)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              filterRollInShower
                ? 'bg-saarthi-100 border-saarthi-400 text-saarthi-800 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            🚿 Roll-In Shower with Bench
          </button>

          <button
            onClick={() => setFilterVisualAlarms(!filterVisualAlarms)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              filterVisualAlarms
                ? 'bg-saarthi-100 border-saarthi-400 text-saarthi-800 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            🚨 Visual Smoke Alarms
          </button>

          <button
            onClick={() => setFilterSignStaff(!filterSignStaff)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              filterSignStaff
                ? 'bg-saarthi-100 border-saarthi-400 text-saarthi-800 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            🤟 Sign Language Staff
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredHotels.length} Verified Barrier-Free Stays
        </span>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHotels.map((hotel) => {
          const isCurrentTripHotel = currentTrip.hotel?.id === hotel.id;
          return (
            <div
              key={hotel.id}
              className={`bg-white rounded-3xl overflow-hidden border-2 transition-all shadow-sm hover:shadow-lg flex flex-col justify-between ${
                isCurrentTripHotel ? 'border-emerald-500 ring-2 ring-emerald-300' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-900 font-black text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>Score: {hotel.accessibilityScore}/100</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-lg">
                    {hotel.city} • {hotel.distanceFromLandmark}
                  </div>
                  {isCurrentTripHotel && (
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active in Itinerary</span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900">{hotel.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">★ {hotel.rating} ({hotel.reviews} guest reviews)</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-slate-900 block">{hotel.price}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Inclusive Tariff</span>
                    </div>
                  </div>

                  {/* Room measurements specs */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs text-slate-700">
                    <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-saarthi-600" />
                      <span>Verified Accessibility Specs:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>• <strong>Door Clearance:</strong> {hotel.specs.doorWidth}</div>
                      <div>• <strong>Bed Height:</strong> {hotel.specs.bedHeight}</div>
                      <div>• <strong>Toilet:</strong> {hotel.specs.toiletHeight}</div>
                      <div>• <strong>Shower Bench:</strong> {hotel.specs.showerBench}</div>
                    </div>
                  </div>

                  {/* Facility Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hotel.facilities.rollInShower && (
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Roll-in Shower
                      </span>
                    )}
                    {hotel.facilities.grabBars && (
                      <span className="text-[10px] font-semibold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                        ✓ Double Grab Bars
                      </span>
                    )}
                    {hotel.facilities.visualSmokeAlarms && (
                      <span className="text-[10px] font-semibold bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                        ✓ Visual Alarm Flashes
                      </span>
                    )}
                    {hotel.facilities.signLanguageStaff && (
                      <span className="text-[10px] font-semibold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                        ✓ Sign Language Staff
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => handleSelectHotel(hotel)}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all ${
                    isCurrentTripHotel
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-saarthi-600 hover:bg-saarthi-700 text-white'
                  }`}
                >
                  {isCurrentTripHotel ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>Active Stay in Itinerary</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Select for My Trip</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${hotel.phone}`}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1"
                  title="Call hotel accessibility desk"
                >
                  <PhoneCall className="w-4 h-4 text-slate-600" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
