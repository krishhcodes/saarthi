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
  HeartHandshake
} from 'lucide-react';

export default function GuidesView() {
  const { 
    guides, 
    currentUser, 
    createBooking, 
    updateTrip, 
    currentTrip, 
    addToast 
  } = useApp();

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

  const filteredGuides = guides.filter(g => {
    if (selectedSpecialization !== 'All' && !g.specializations.some(s => s.includes(selectedSpecialization))) {
      return false;
    }
    if (selectedLanguage !== 'All' && !g.languages.includes(selectedLanguage)) {
      return false;
    }
    return true;
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

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
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
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredGuides.length} Verified Disability Guides
        </span>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide) => {
          const isSelectedInTrip = currentTrip.guide?.id === guide.id;
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
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-md shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900">{guide.name}</h3>
                      {guide.isVerified ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{guide.verificationBadge}</span>
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Pending Audit
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium">{guide.city} • {guide.experienceYears} Years Exp.</p>
                    <p className="text-xs text-slate-700 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <strong>★ {guide.rating}</strong> ({guide.reviewsCount} verified reviews)
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">{guide.hourlyRate}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {guide.availability}
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
