import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowRight,
  Accessibility,
  Eye,
  Ear,
  RotateCcw
} from 'lucide-react';

export default function DestinationsView() {
  const { destinations, navigateTo, setSelectedDestination } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedDisabilityFilter, setSelectedDisabilityFilter] = useState('All');
  const [filterRampOnly, setFilterRampOnly] = useState(false);
  const [filterWashroomOnly, setFilterWashroomOnly] = useState(false);
  const [filterElevatorOnly, setFilterElevatorOnly] = useState(false);

  const cities = ['All', 'Delhi', 'Agra', 'Jaipur', 'Mumbai', 'Goa', 'Kochi', 'Bengaluru', 'Hyderabad', 'Varanasi', 'Udaipur'];

  const filteredDestinations = destinations.filter(dest => {
    // City filter
    if (selectedCity !== 'All' && dest.city !== selectedCity) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = dest.name.toLowerCase().includes(q);
      const matchCity = dest.city.toLowerCase().includes(q);
      const matchDesc = dest.description.toLowerCase().includes(q);
      const matchTags = dest.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchCity && !matchDesc && !matchTags) return false;
    }

    // Facility filters
    if (filterRampOnly && !dest.facilities.ramps) return false;
    if (filterWashroomOnly && !dest.facilities.accessibleWashrooms) return false;
    if (filterElevatorOnly && !dest.facilities.elevators) return false;

    // Disability profile match
    if (selectedDisabilityFilter === 'Wheelchair' && !dest.facilities.wheelchairAccessible) return false;
    if (selectedDisabilityFilter === 'Visual' && (!dest.facilities.brailleSignage && !dest.facilities.tactilePaving && !dest.facilities.audioGuides)) return false;
    if (selectedDisabilityFilter === 'Hearing' && !dest.facilities.signLanguageGuideAvailable) return false;

    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setSelectedDisabilityFilter('All');
    setFilterRampOnly(false);
    setFilterWashroomOnly(false);
    setFilterElevatorOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>Barrier-Free Tourism Catalog</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Accessible Tourist Destinations
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Discover certified barrier-free heritage sites, promenades, and nature reserves with detailed accessibility audits across 10 Indian hubs.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination name, city, ramps, braille..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
            />
          </div>

          {/* City Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city === 'All' ? '📍 All 10 Indian Cities' : `📍 ${city}`}
                </option>
              ))}
            </select>
          </div>

          {/* Disability Profile Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedDisabilityFilter}
              onChange={(e) => setSelectedDisabilityFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
            >
              <option value="All">🎯 All Accessibility Needs</option>
              <option value="Wheelchair">🦽 Wheelchair / Mobility</option>
              <option value="Visual">🦯 Visual / Tactile / Audio</option>
              <option value="Hearing">🤟 Sign Language / Hearing</option>
            </select>
          </div>
        </div>

        {/* Quick Checkbox Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterRampOnly(!filterRampOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                filterRampOnly
                  ? 'bg-saarthi-100 border-saarthi-400 text-saarthi-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ✓ Ramps Installed
            </button>

            <button
              onClick={() => setFilterWashroomOnly(!filterWashroomOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                filterWashroomOnly
                  ? 'bg-saarthi-100 border-saarthi-400 text-saarthi-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              🚻 Accessible Washrooms
            </button>

            <button
              onClick={() => setFilterElevatorOnly(!filterElevatorOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                filterElevatorOnly
                  ? 'bg-saarthi-100 border-saarthi-400 text-saarthi-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              🛗 Elevators / Lifts
            </button>
          </div>

          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            onClick={() => navigateTo('destination-detail', { destination: dest })}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-900 font-black text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>Score: {dest.accessibilityScore}/100</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                  {dest.city}, {dest.state}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-saarthi-600 transition-colors">
                    {dest.name}
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {dest.accessibilityRating}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                {/* Facility checklist pills */}
                <div className="grid grid-cols-2 gap-1.5 pt-2 text-[11px] text-slate-700">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${dest.facilities.ramps ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>Ramps: {dest.facilities.ramps ? 'Available' : 'None'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${dest.facilities.accessibleWashrooms ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>PwD Washrooms</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${dest.facilities.electricGolfCarts ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>Electric Shuttles</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${dest.facilities.brailleSignage ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>Braille / Tactile</span>
                  </div>
                </div>

                {/* Crowd Level & Verification */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{dest.crowdLevel.split('(')[0]}</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{dest.lastVerifiedDate}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Card Action */}
            <div className="p-5 pt-0">
              <div className="w-full py-2.5 rounded-xl bg-slate-50 group-hover:bg-saarthi-50 text-slate-700 group-hover:text-saarthi-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
                <span>View Full Accessibility Audit</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-base font-bold text-slate-800">No destinations match your current filter.</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the city or facility filters to view all 10 hubs.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-saarthi-600 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
