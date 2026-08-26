import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ThumbsUp, 
  ThumbsDown, 
  PhoneCall, 
  Mail, 
  Sparkles,
  Edit,
  ArrowRight
} from 'lucide-react';

export default function UserProfileView() {
  const { currentUser, userProfile, navigateTo, communityReports, currentTrip } = useApp();

  const userReports = communityReports.filter(r => r.contributor.includes(currentUser.name));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-saarthi-500 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{currentUser.name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>UDID Verified</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                UDID Card: {currentUser.udidNumber || "DL0420199876241"} • {currentUser.email}
              </p>
              <p className="text-xs font-semibold text-saarthi-700">
                Primary Profile: {userProfile?.primaryDisability || "Mobility / Wheelchair"}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('profile-setup')}
            className="px-4 py-2.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Update Accessibility Profile</span>
          </button>
        </div>

        {/* Profile Constraints Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-700">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Max Walking Limit</span>
            <span className="font-bold text-slate-900">{userProfile?.maxWalkingDistance || "Under 100m"}</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Preferred Transit</span>
            <span className="font-bold text-slate-900">{userProfile?.preferredTransport || "Electric Golf Cart"}</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Emergency SOS Contact</span>
            <span className="font-bold text-red-700">{userProfile?.emergencyContactName || "Dr. Ramesh Sharma"} ({userProfile?.emergencyContactPhone || "+91-98111-22334"})</span>
          </div>
        </div>
      </div>

      {/* 2-Col Grid: My Saved Accessible Trips & My Community Contributions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Saved Accessible Trips (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-saarthi-600" />
              <span>Saved Accessible Trips</span>
            </h3>
            <button
              onClick={() => navigateTo('trip-planner')}
              className="text-xs font-bold text-saarthi-600 hover:underline"
            >
              Open Trip Planner →
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">{currentTrip.title}</span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Score {currentTrip.scores.overall}/100
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentTrip.city} • {currentTrip.startDate} to {currentTrip.endDate}</p>
            <p className="text-xs text-slate-700 font-medium">
              🏛️ {currentTrip.destinations.map(d => d.name).join(', ')}
            </p>
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-500">🏨 {currentTrip.hotel?.name}</span>
              <button
                onClick={() => navigateTo('trip-planner')}
                className="font-bold text-saarthi-600 hover:underline"
              >
                View Full Itinerary →
              </button>
            </div>
          </div>
        </div>

        {/* Right: Community Contribution History (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>My Community Audit Reports ({userReports.length})</span>
            </h3>
            <button
              onClick={() => navigateTo('community-map')}
              className="text-xs font-bold text-saarthi-600 hover:underline"
            >
              Add New Report →
            </button>
          </div>

          <div className="space-y-3">
            {userReports.map((rep) => (
              <div key={rep.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rep.title}</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    ✓ {rep.confirmCount} Confirms
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-2">{rep.description}</p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Location: {rep.destinationName}</span>
                  <span>Submitted on: {rep.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
