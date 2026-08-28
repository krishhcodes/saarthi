import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  MapPin, 
  Navigation, 
  Hotel, 
  Users, 
  Building2, 
  Map, 
  Volume2, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Star,
  Activity,
  Heart,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  MapPinCheck
} from 'lucide-react';
import MonumentImage from '../common/MonumentImage';

export default function DashboardView() {
  const { 
    currentUser, 
    userProfile, 
    navigateTo, 
    destinations, 
    guides, 
    govServices, 
    currentTrip,
    setIsAiChatOpen 
  } = useApp();

  const primaryDisability = userProfile?.primaryDisability || "Mobility / Wheelchair";

  // Filter recommendations based on user's primary disability
  const recommendedDestinations = destinations.filter(dest => {
    if (primaryDisability.includes("Wheelchair") || primaryDisability.includes("Mobility")) {
      return dest.facilities.wheelchairAccessible && dest.facilities.ramps;
    }
    if (primaryDisability.includes("Visual")) {
      return dest.facilities.tactilePaving || dest.facilities.brailleSignage || dest.facilities.audioGuides;
    }
    if (primaryDisability.includes("Hearing")) {
      return dest.facilities.signLanguageGuideAvailable || dest.tags.includes("Visual");
    }
    return dest.accessibilityScore >= 85;
  });

  const quickActions = [
    { label: "Route Navigator", icon: Navigation, view: 'route-planner', color: "bg-emerald-600 text-white" },
    { label: "Places Check", icon: MapPinCheck, view: 'places', color: "bg-indigo-600 text-white" },
    { label: "Attractions", icon: MapPin, view: 'destinations', color: "bg-blue-600 text-white" },
    { label: "Book Guide", icon: Users, view: 'guides', color: "bg-purple-600 text-white" },
    { label: "AI Vision Scan", icon: Sparkles, view: 'ai-verify', color: "bg-rose-600 text-white" },
    { label: "Ground Reports", icon: ShieldCheck, view: 'community-map', color: "bg-teal-600 text-white" },
    { label: "Gov Schemes", icon: Building2, view: 'gov-services', color: "bg-amber-600 text-white" },
    { label: "Audio Guide", icon: Volume2, view: 'multilingual', color: "bg-slate-900 text-white" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner: Greeting & Profile Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-saarthi-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-saarthi-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-saarthi-300 font-bold uppercase tracking-wider">
                  Personalized Dashboard
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> UDID Verified
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-0.5">
                Good morning, {currentUser.name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>🎯 <strong>Profile:</strong> {primaryDisability}</span>
                <span>•</span>
                <span>🚶 <strong>Walking Limit:</strong> {userProfile?.maxWalkingDistance?.split('(')[0] || "Under 100m"}</span>
                <span>•</span>
                <span>🌐 <strong>Language:</strong> {userProfile?.preferredLanguage || "English / Hindi"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button
              onClick={() => navigateTo('profile-setup')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors"
            >
              Edit Accessibility Profile
            </button>
            <button
              onClick={() => setIsAiChatOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white rounded-xl text-xs font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Saarthi AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          Quick Accessibility Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => navigateTo(action.view)}
                className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center group shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-sm ${action.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-saarthi-600 transition-colors">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* "Active Route Corridor" Featured Progress Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4" />
              <span>Active Step-Free Heritage Corridor</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Taj Mahal Accessible Circuit
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified Step-Free Approach • Agra, Uttar Pradesh
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Route Accessibility
              </span>
              <span className="text-2xl font-black text-emerald-600">
                100% Step-Free
              </span>
            </div>
            <button
              onClick={() => navigateTo('route-planner')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
            >
              <span>Route Navigator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Corridor Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-700">🏛️ Main Entrance</span>
              <span className="font-bold text-emerald-600">East Gate Ramp</span>
            </div>
            <p className="text-[11px] text-slate-500">1:12 Step-free ramp to marble plinth</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-700">🧭 Step-Free Transit</span>
              <span className="font-bold text-emerald-600">0 Stairs</span>
            </div>
            <p className="text-[11px] text-slate-500">Accessible WAV taxi & flat pathways</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-700">🦽 On-Ground Aid</span>
              <span className="font-bold text-emerald-600">Battery Carts</span>
            </div>
            <p className="text-[11px] text-slate-500">Free shuttle from Shilpgram parking</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-700">🤟 Certified Escort</span>
              <span className="font-bold text-emerald-600">ISL & Mobility</span>
            </div>
            <p className="text-[11px] text-slate-500">Sugamya Bharat Verified Guides</p>
          </div>
        </div>
      </div>

      {/* "Recommended For You" Destination Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>Recommended For You</span>
              <span className="text-xs font-bold bg-saarthi-100 text-saarthi-700 px-2 py-0.5 rounded-full">
                Based on {primaryDisability}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Destinations verified for step-free access, ramps, and accessible amenities.
            </p>
          </div>
          <button
            onClick={() => navigateTo('destinations')}
            className="text-xs font-bold text-saarthi-600 hover:text-saarthi-800 flex items-center gap-1"
          >
            <span>View all 10 Hubs</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedDestinations.slice(0, 3).map((dest) => (
            <div
              key={dest.id}
              onClick={() => navigateTo('destination-detail', { destination: dest })}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <MonumentImage
                    name={dest.name}
                    city={dest.city}
                    fallback={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 text-slate-900 font-bold text-xs px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>Score: {dest.accessibilityScore}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    {dest.city}, {dest.state}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-saarthi-600 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1">
                    {dest.facilities.wheelchairAccessible && (
                      <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        🦽 Wheelchair Ready
                      </span>
                    )}
                    {dest.facilities.ramps && (
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                        ✓ Ramps Installed
                      </span>
                    )}
                    {dest.facilities.accessibleWashrooms && (
                      <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                        🚻 PwD Restrooms
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-saarthi-600 mt-2">
                <span>View Accessibility Specs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 2-Col: Available Guides + Government Support Near You */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Specialized Guides */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Available Specialized Guides</span>
              </h3>
              <p className="text-xs text-slate-500">
                Verified escorts with disability-sensitivity certifications.
              </p>
            </div>
            <button
              onClick={() => navigateTo('guides')}
              className="text-xs font-bold text-saarthi-600 hover:text-saarthi-800"
            >
              View all 8 Guides →
            </button>
          </div>

          <div className="space-y-3">
            {guides.slice(0, 2).map((guide) => (
              <div
                key={guide.id}
                onClick={() => navigateTo('guides', { guide })}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-slate-900">{guide.name}</h4>
                      {guide.isVerified && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600">{guide.specializations.join(' • ')}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{guide.city} • ★ {guide.rating} ({guide.reviewsCount} reviews)</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-900">{guide.hourlyRate}</span>
                  <span className="block text-[10px] font-semibold text-emerald-600">{guide.availability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Government Schemes & Local Support */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Government Support Near You</span>
              </h3>
              <p className="text-xs text-slate-500">
                National and regional schemes active at your destinations.
              </p>
            </div>
            <button
              onClick={() => navigateTo('gov-services')}
              className="text-xs font-bold text-saarthi-600 hover:text-saarthi-800"
            >
              View all 10 Schemes →
            </button>
          </div>

          <div className="space-y-3">
            {govServices.slice(0, 2).map((service) => (
              <div
                key={service.id}
                className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">{service.title}</span>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                    {service.badge}
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  {service.benefits}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-mono text-[10px]">{service.contact}</span>
                  <button 
                    onClick={() => navigateTo('gov-services')}
                    className="font-bold text-saarthi-700 hover:underline"
                  >
                    {service.actionText} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
