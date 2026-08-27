import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Star, 
  PhoneCall, 
  Award, 
  Upload, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function GuideDashboardView() {
  const { 
    bookings, 
    updateBookingStatus, 
    currentUser, 
    addToast,
    guideApplicationStatus,
    navigateTo
  } = useApp();

  const [availability, setAvailability] = useState("Available Today");
  const [activeTab, setActiveTab] = useState('bookings');

  // Guard: redirect unverified guides to application flow safely via effect
  useEffect(() => {
    if (guideApplicationStatus !== 'verified') {
      navigateTo('guide-application');
    }
  }, [guideApplicationStatus, navigateTo]);

  if (guideApplicationStatus !== 'verified') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Certified Disability Escort Portal</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Guide Management Dashboard
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage incoming disability tour bookings, upload verification credentials, and coordinate accessible itineraries.
        </p>
      </div>

      {/* Guide Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900">{currentUser.name}</h2>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Sugamya Specialist</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {currentUser.licenseNumber || "License: MOT-N-2024-884 (Ministry of Tourism Verified)"}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentUser.specializations?.map((s, i) => (
                  <span key={i} className="text-[10px] font-bold bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-4 font-bold text-slate-700">
              <span>Live Status:</span>
              <select
                value={availability}
                onChange={(e) => {
                  setAvailability(e.target.value);
                  addToast(`Status updated to: ${e.target.value}`, 'success');
                }}
                className="p-1 rounded-lg bg-white border border-slate-300 font-semibold text-emerald-700"
              >
                <option value="Available Today">🟢 Available Today</option>
                <option value="Busy with Tour">🟡 Busy on Tour</option>
                <option value="Off Duty">⚪ Off Duty</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500">Hourly Rate: ₹450 / hr • 164 completed tours</p>
          </div>
        </div>
      </div>

      {/* Bookings Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>Tour Booking Requests & Scheduled Itineraries</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review traveler accessibility requirements before confirming appointment.
            </p>
          </div>
          <span className="text-xs font-bold bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            {bookings.length} Booking(s)
          </span>
        </div>

        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">{b.userName}</h4>
                  <span className="text-[10px] font-bold bg-saarthi-100 text-saarthi-800 px-2 py-0.2 rounded">
                    {b.userDisability}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                    b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  📍 <strong>Destination:</strong> {b.destination} • 🗓️ <strong>Date:</strong> {b.date} at {b.time} ({b.hours} hrs)
                </p>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong>Traveler's Accessibility Note:</strong> {b.specialRequests}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 self-end md:self-auto shrink-0">
                <div className="text-right mr-3 hidden sm:block">
                  <span className="text-sm font-black text-slate-900 block">{b.totalAmount}</span>
                  <span className="text-[10px] text-slate-400">Total Payout</span>
                </div>

                {b.status !== 'Confirmed' ? (
                  <>
                    <button
                      onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => updateBookingStatus(b.id, 'Declined')}
                      className="px-3 py-2 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </>
                ) : (
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirmed & Active</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
