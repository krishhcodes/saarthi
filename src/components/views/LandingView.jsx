import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Navigation, 
  Users, 
  Building2, 
  Globe2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  ChevronRight, 
  MapPinCheck,
  Map,
  Camera,
  Eye,
  Volume2,
  SlidersHorizontal,
  PhoneCall,
  Check,
  Heart,
  HelpCircle
} from 'lucide-react';

export default function LandingView() {
  const { navigateTo, destinations } = useApp();

  const coreModules = [
    {
      id: 'route-planner',
      icon: Navigation,
      title: "Step-Free Route Planner",
      desc: "Get directions that completely avoid staircases and find ramped entrances, accessible cabs, and disabled train coaches.",
      badge: "Zero Stairs Guaranteed",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400",
      cta: "Plan a Step-Free Route"
    },
    {
      id: 'destinations',
      icon: MapPin,
      title: "Accessible Monuments & Places",
      desc: "Explore famous Indian monuments with verified accessibility scores for wheelchair ramps, braille signs, and accessible toilets.",
      badge: "10+ Heritage Sites",
      color: "bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-400",
      cta: "Explore Attractions"
    },
    {
      id: 'places',
      icon: MapPinCheck,
      title: "Entrances & Facility Check",
      desc: "Check exact step-free entrance gates, wheelchair battery golf carts, elevators, and wide doorways before arriving.",
      badge: "Ground-Level Details",
      color: "bg-indigo-50 text-indigo-800 border-indigo-200 hover:border-indigo-400",
      cta: "Check Facilities"
    },
    {
      id: 'community-map',
      icon: Map,
      title: "Live Community Map",
      desc: "Interactive map with live ground reports, ramp updates, and obstacle alerts shared and voted on by fellow travelers.",
      badge: "Live Traveler Updates",
      color: "bg-teal-50 text-teal-800 border-teal-200 hover:border-teal-400",
      cta: "Open Community Map"
    },
    {
      id: 'ai-verify',
      icon: Camera,
      title: "AI Photo Ramp Checker",
      desc: "Take or upload a photo of any ramp, door, or walkway to instantly check if the slope is safe for wheelchair users.",
      badge: "Instant AI Scan",
      color: "bg-rose-50 text-rose-800 border-rose-200 hover:border-rose-400",
      cta: "Check Photo with AI"
    },
    {
      id: 'guides',
      icon: Users,
      title: "Certified Special Tour Guides",
      desc: "Book certified tour guides trained in Indian Sign Language (ISL), wheelchair assistance, and audio description.",
      badge: "Verified Tour Guides",
      color: "bg-purple-50 text-purple-800 border-purple-200 hover:border-purple-400",
      cta: "Find a Guide"
    }
  ];

  const travelerProfiles = [
    {
      icon: "🦽",
      title: "Wheelchair & Mobility",
      desc: "Step-free ramped paths, zero stairs, lift locations, and accessible cabs."
    },
    {
      icon: "👁️",
      title: "Blind & Low Vision",
      desc: "Tactile floor guiding pavers, braille information boards, and audio narrators."
    },
    {
      icon: "🤟",
      title: "Deaf & Hard of Hearing",
      desc: "Certified Indian Sign Language (ISL) tour guides and visual bilingual signage."
    },
    {
      icon: "👵",
      title: "Seniors & Gentle Walkers",
      desc: "Battery golf cart shuttles, low-walking circuits, and frequent rest seating."
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* ── 1. Hero Section (Layman-Friendly & Welcoming) ────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-saarthi-50/70 via-white to-slate-50 pt-10 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Clear, Simple Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Smart India Hackathon 2026 • Universal Accessible Tourism</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 tracking-tight leading-tight max-w-xl">
                  Travel India with Comfort, Dignity & Zero Barriers.
                </h1>
                <p className="text-lg sm:text-xl font-bold text-saarthi-600">
                  Accessible Tourism for Everyone.
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Saarthi helps wheelchair users, visually impaired travelers, deaf tourists, and seniors discover barrier-free Indian heritage sites with <strong>guaranteed step-free routes</strong>, <strong>AI-checked ramps</strong>, and <strong>certified special guides</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={() => navigateTo('route-planner')}
                  className="px-6 py-3.5 rounded-2xl bg-saarthi-600 hover:bg-saarthi-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-saarthi-500/25 flex items-center gap-2.5 transition-transform active:scale-95"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Find Step-Free Route</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => navigateTo('destinations')}
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-sm flex items-center gap-2 transition-colors active:scale-95"
                >
                  <MapPin className="w-5 h-5 text-saarthi-600" />
                  <span>Browse Monuments</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 border-t border-slate-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Step-Free Routes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sugamya Bharat Aligned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Certified Sign Language Guides</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Free to Use</span>
                </div>
              </div>
            </div>

            {/* Right: Friendly "Who Saarthi Helps" Static Information Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span>Personalized for Your Needs</span>
                  </div>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    Universal Inclusion
                  </span>
                </div>

                <div className="space-y-2.5">
                  {travelerProfiles.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 flex items-start gap-3.5"
                    >
                      <div className="text-xl shrink-0 mt-0.5 bg-white w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-600 leading-snug mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigateTo('destinations')}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <span>Explore All Accessible Destinations</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. "How We Verify Our Data" & Key Metrics Section (Solid & 100% Readable) ──── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 space-y-8">
          
          {/* Header */}
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authentic Ground Verification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              How Is Saarthi Data Verified?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              We know that inaccurate accessibility info ruins travel. Every ramp, gate, toilet, and route in Saarthi is backed by three rigorous verification layers:
            </p>
          </div>

          {/* 3 Verification Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                🏛️
              </div>
              <h3 className="font-extrabold text-sm text-white">1. Official Government & ASI Data</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Directly cross-referenced with Archaeological Survey of India (ASI) conservation audits and Sugamya Bharat Abhiyan standards.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg border border-rose-500/30">
                👁️
              </div>
              <h3 className="font-extrabold text-sm text-white">2. Google Gemini Vision AI</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated computer vision calculates real ramp slopes (CPWD 1:12 standard), checks door widths, and verifies handrails from photos.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg border border-teal-500/30">
                👥
              </div>
              <h3 className="font-extrabold text-sm text-white">3. Live Community Ground Audits</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Real travelers submit live photos, report broken lifts or temporary barriers, and vote to verify or dispute reports in real time.
              </p>
            </div>
          </div>

          {/* Clean Solid Numbers Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">100%</span>
              <span className="text-xs text-slate-300 font-medium mt-0.5 block">Step-Free Routes</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-2xl sm:text-3xl font-black text-sky-400 block">17+</span>
              <span className="text-xs text-slate-300 font-medium mt-0.5 block">Indian & World Languages</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 block">3,690+</span>
              <span className="text-xs text-slate-300 font-medium mt-0.5 block">Protected Monuments Aligned</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-2xl sm:text-3xl font-black text-purple-400 block">0 Stairs</span>
              <span className="text-xs text-slate-300 font-medium mt-0.5 block">Guaranteed Zero-Step Routing</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. Six Core Easy-to-Understand Features ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-saarthi-600 text-xs font-bold tracking-wider uppercase">
            Everything You Need For Barrier-Free Travel
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">
            Built For Simple, Independent Exploration
          </h2>
          <p className="text-slate-600 text-sm mt-1.5">
            Click on any feature below to try it directly:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => navigateTo(mod.id)}
                className={`bg-white rounded-3xl p-6 border shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group ${mod.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-200 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 shadow-sm border border-slate-200 text-slate-800">
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-saarthi-600 transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-saarthi-600">
                  <span>{mod.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. Government Schemes & Inclusive Tools ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Government Schemes & Benefits</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Government Passes, UDID Cards & 24/7 Helpline
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Access free Sugamya Bharat monument entry, UDID disability concessions, IRCTC Divyangjan train fare discounts, and the national 24/7 ERSS 112 emergency SOS helpline.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('gov-services')}
                className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>View Government Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-saarthi-400">
              Built-In Accessibility Tools (Top Bar)
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <Globe2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span><strong>Google Translate:</strong> Real-time translation in 17+ languages</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Voice Narrator:</strong> Web Speech reader for visually impaired</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <SlidersHorizontal className="w-4 h-4 text-sky-400 shrink-0" />
                <span><strong>High Contrast & Dyslexic Font:</strong> Pure black WCAG 2.2 AAA mode</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Featured Accessible Heritage Monuments ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-saarthi-600 text-xs font-bold tracking-wider uppercase">
              Explore Accessible India
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Popular Barrier-Free Heritage Sites
            </h2>
          </div>
          <button
            onClick={() => navigateTo('destinations')}
            className="text-sm font-bold text-saarthi-600 hover:text-saarthi-800 flex items-center gap-1 self-start"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.slice(0, 3).map((dest) => (
            <div
              key={dest.id}
              onClick={() => navigateTo('destination-detail', { destination: dest })}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-900 font-black text-xs px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span>Score: {dest.accessibilityScore}/100</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                    {dest.city}, {dest.state}
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-saarthi-600 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {dest.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs font-bold text-saarthi-600 border-t border-slate-100">
                <span>View Accessibility Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
