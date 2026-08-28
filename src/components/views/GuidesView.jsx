import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Languages, 
  Award, 
  Clock, 
  Calendar, 
  PhoneCall, 
  X, 
  Sparkles,
  HeartHandshake,
  MapPin,
  Compass
} from 'lucide-react';

// Indian Heritage Hubs & City Coordinate Registry
const AREA_COORDINATES = {
  'Agra': { lat: 27.1767, lng: 78.0081, label: 'Agra (UP)' },
  'Delhi': { lat: 28.6139, lng: 77.2090, label: 'Delhi / NCR' },
  'Jaipur': { lat: 26.9124, lng: 75.7873, label: 'Jaipur (Rajasthan)' },
  'Varanasi': { lat: 25.3176, lng: 82.9739, label: 'Varanasi (UP)' },
  'Mumbai': { lat: 19.0760, lng: 72.8777, label: 'Mumbai (Maharashtra)' },
  'Kochi': { lat: 9.9312, lng: 76.2673, label: 'Kochi (Kerala)' },
  'Goa': { lat: 15.2993, lng: 74.1240, label: 'Goa' },
  'Amritsar': { lat: 31.6340, lng: 74.8723, label: 'Amritsar (Punjab)' },
  'Udaipur': { lat: 24.5854, lng: 73.7125, label: 'Udaipur (Rajasthan)' },
  'Bengaluru': { lat: 12.9716, lng: 77.5946, label: 'Bengaluru (Karnataka)' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, label: 'Hyderabad (Telangana)' },
  'Chennai': { lat: 13.0827, lng: 80.2707, label: 'Chennai (Tamil Nadu)' },
  'Kolkata': { lat: 22.5726, lng: 88.3639, label: 'Kolkata (West Bengal)' },
  'Mathura': { lat: 27.4924, lng: 77.6737, label: 'Mathura / Vrindavan' },
  'Noida': { lat: 28.5355, lng: 77.3910, label: 'Noida / NCR' },
  'Gurgaon': { lat: 28.4595, lng: 77.0266, label: 'Gurgaon / Gurugram' },
  'Pune': { lat: 18.5204, lng: 73.8567, label: 'Pune (Maharashtra)' },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, label: 'Ahmedabad (Gujarat)' },
  'Chandigarh': { lat: 30.7333, lng: 76.7794, label: 'Chandigarh' },
  'Lucknow': { lat: 26.8467, lng: 80.9462, label: 'Lucknow (UP)' },
  'Hampi': { lat: 15.3350, lng: 76.4600, label: 'Hampi (Karnataka)' },
  'Aurangabad': { lat: 19.8762, lng: 75.3433, label: 'Aurangabad / Ellora' },
  'Puri': { lat: 19.8135, lng: 85.8312, label: 'Puri / Konark' },
  'Khajuraho': { lat: 24.8318, lng: 79.9199, label: 'Khajuraho (MP)' },
  'Bhopal': { lat: 23.2599, lng: 77.4126, label: 'Bhopal / Sanchi' },
  'Mysuru': { lat: 12.2958, lng: 76.6394, label: 'Mysuru (Karnataka)' }
};

// Haversine Great-Circle Distance (km)
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function getGuideCoordinates(guide) {
  if (guide.lat && guide.lng) return { lat: guide.lat, lng: guide.lng };
  const cityStr = (guide.city || '').toLowerCase();
  for (const [key, coords] of Object.entries(AREA_COORDINATES)) {
    if (cityStr.includes(key.toLowerCase())) {
      return coords;
    }
  }
  return null;
}

export default function GuidesView() {
  const { 
    guides, 
    currentUser, 
    createBooking, 
    updateTrip, 
    currentTrip, 
    addToast 
  } = useApp();

  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [activeBookingGuide, setActiveBookingGuide] = useState(null);
  
  // Booking Form State
  const [bookingDate, setBookingDate] = useState('2026-03-10');
  const [bookingTime, setBookingTime] = useState('09:00 AM');
  const [bookingHours, setBookingHours] = useState(4);
  const [specialRequests, setSpecialRequests] = useState('Requires assistance with manual wheelchair transfer at monument entrance.');

  const specializations = [
    'All',
    'Wheelchair Assistance',
    'Sign Language',
    'Visual Assistance',
    'Senior Assistance',
    'Cognitive Accessibility'
  ];

  const getGuideDistanceToSelectedArea = (guide, areaKey) => {
    if (areaKey === 'All') return null;
    const targetCoords = AREA_COORDINATES[areaKey];
    if (!targetCoords) return null;

    const cityStr = (guide.city || '').toLowerCase();
    if (cityStr.includes(areaKey.toLowerCase())) {
      return 0; // Same area
    }

    const guideCoords = getGuideCoordinates(guide);
    if (!guideCoords) return 9999;

    return calculateDistanceKm(targetCoords.lat, targetCoords.lng, guideCoords.lat, guideCoords.lng);
  };

  const filteredGuides = guides.filter(g => {
    // Only show verified guides (or currently logged in guide viewing self)
    if (!g.isVerified && g.id !== currentUser?.id) return false;

    if (selectedSpecialization !== 'All' && !g.specializations?.some(s => s.toLowerCase().includes(selectedSpecialization.toLowerCase()))) {
      return false;
    }
    if (selectedLanguage !== 'All' && !g.languages?.includes(selectedLanguage)) {
      return false;
    }
    if (selectedArea !== 'All') {
      const dist = getGuideDistanceToSelectedArea(g, selectedArea);
      if (dist === null || dist > 100) {
        return false; // Beyond 100 km radius
      }
    }
    return true;
  });

  // Sort so newly created / Firestore guides made by users/friends appear at the TOP!
  const sortedGuides = [...filteredGuides].sort((a, b) => {
    const aIsHardcoded = a.id === 'guide-1' || a.id === 'guide-2';
    const bIsHardcoded = b.id === 'guide-1' || b.id === 'guide-2';
    if (!aIsHardcoded && bIsHardcoded) return -1;
    if (aIsHardcoded && !bIsHardcoded) return 1;
    return 0;
  });

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!activeBookingGuide) return;

    createBooking({
      guideId: activeBookingGuide.id,
      guideName: activeBookingGuide.name,
      userName: currentUser.name,
      userDisability: currentUser.accessibilityProfile?.primaryDisability || "Wheelchair User",
      destination: currentTrip.destinations[0]?.name || "Taj Mahal Complex",
      date: bookingDate,
      time: bookingTime,
      hours: bookingHours,
      totalAmount: `₹${parseInt(activeBookingGuide.hourlyRate.replace(/\D/g, '')) * bookingHours}`,
      specialRequests: specialRequests
    });

    // Also link to active trip planner
    updateTrip({
      guide: activeBookingGuide
    });

    setActiveBookingGuide(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
          <Users className="w-3.5 h-3.5" />
          <span>Verified Disability Escort Marketplace</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Specialized Tourism Guides
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Connect with Ministry of Tourism licensed & Sugamya Bharat certified guides trained in Indian Sign Language (ISL), audio description, and wheelchair navigation.
        </p>
      </div>

      {/* Filter Bar with Area Selector (100km Radius) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Area / City Selector */}
          <div className="relative">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="py-2.5 pl-3 pr-8 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
            >
              <option value="All">📍 All Areas (All India)</option>
              {Object.entries(AREA_COORDINATES).map(([key, info]) => (
                <option key={key} value={key}>
                  📍 {info.label} (100km Radius)
                </option>
              ))}
            </select>
          </div>

          {/* Specialization Selector */}
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
          >
            {specializations.map(spec => (
              <option key={spec} value={spec}>
                {spec === 'All' ? '🎯 All Specializations' : `🎯 ${spec}`}
              </option>
            ))}
          </select>

          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
          >
            <option value="All">🌐 All Languages</option>
            <option value="Indian Sign Language (ISL)">🤟 Indian Sign Language (ISL)</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="Marathi">Marathi</option>
            <option value="Kannada">Kannada</option>
            <option value="Telugu">Telugu</option>
            <option value="Bengali">Bengali</option>
            <option value="Gujarati">Gujarati</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {selectedArea !== 'All' && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Compass className="w-3 h-3" />
              <span>≤100 km of {selectedArea}</span>
            </span>
          )}
          <span className="text-xs text-slate-500 font-medium">
            Showing {sortedGuides.length} Verified Guides
          </span>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedGuides.map((guide) => {
          const isSelectedInTrip = currentTrip.guide?.id === guide.id;
          const isUserRegistered = guide.id !== 'guide-1' && guide.id !== 'guide-2';
          const distanceToSelected = selectedArea !== 'All' ? getGuideDistanceToSelectedArea(guide, selectedArea) : null;

          return (
            <div
              key={guide.id}
              className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-sm hover:shadow-lg flex flex-col justify-between ${
                isSelectedInTrip ? 'border-purple-600 ring-2 ring-purple-300' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={guide.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                    alt={guide.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-md shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900">{guide.name}</h3>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isUserRegistered && (
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-300">
                            🌟 Community Member
                          </span>
                        )}
                        {guide.isVerified ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{guide.verificationBadge || "Verified Sugamya Specialist"}</span>
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Pending Audit
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 font-medium">
                      <span>{guide.city} • {guide.experienceYears || 1} Years Exp.</span>
                      {distanceToSelected !== null && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          📍 {distanceToSelected === 0 ? `In ${selectedArea}` : `${distanceToSelected} km from ${selectedArea}`}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <strong>★ {guide.rating || "4.9"}</strong> ({guide.reviewsCount || 10} verified reviews)
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">{guide.hourlyRate || "₹450 / hr"}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {guide.availability || "Available Today"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specializations & Bio */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    “{guide.bio}”
                  </p>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Disability Specializations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {guide.specializations.map((spec, i) => (
                        <span key={i} className="text-[11px] font-semibold bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-0.5 rounded-lg">
                          ✓ {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Spoken & Sign Languages:
                    </span>
                    <p className="text-xs text-slate-700 font-medium">
                      {guide.languages.join(', ')}
                    </p>
                  </div>

                  {/* Certifications Box */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-saarthi-600" />
                      Government & NGO Certifications:
                    </span>
                    {guide.certifications.slice(0, 2).map((cert, c) => (
                      <p key={c} className="truncate">• {cert}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setActiveBookingGuide(guide)}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Specialized Guide</span>
                </button>

                <a
                  href={`tel:${guide.phone}`}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1"
                  title="Direct contact"
                >
                  <PhoneCall className="w-4 h-4 text-slate-600" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide Booking Modal */}
      {activeBookingGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setActiveBookingGuide(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close booking modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <img
                src={activeBookingGuide.avatar}
                alt=""
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Book {activeBookingGuide.name}
                </h3>
                <p className="text-xs text-purple-700 font-semibold">
                  {activeBookingGuide.verificationBadge}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trip Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    placeholder="e.g. 08:30 AM"
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tour Duration (Hours)</label>
                <select
                  value={bookingHours}
                  onChange={(e) => setBookingHours(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                >
                  <option value={2}>2 Hours (₹{parseInt(activeBookingGuide.hourlyRate.replace(/\D/g, '')) * 2})</option>
                  <option value={4}>4 Hours - Half Day (₹{parseInt(activeBookingGuide.hourlyRate.replace(/\D/g, '')) * 4})</option>
                  <option value={8}>8 Hours - Full Day (₹{parseInt(activeBookingGuide.hourlyRate.replace(/\D/g, '')) * 8})</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Specific Accessibility Needs & Transfer Instructions
                </label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium leading-relaxed"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-950 font-medium flex items-center justify-between">
                <span>Estimated Total Fee:</span>
                <span className="text-base font-black text-purple-900">
                  ₹{parseInt(activeBookingGuide.hourlyRate.replace(/\D/g, '')) * bookingHours}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
              >
                Confirm Guide Request & Add to Trip
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
