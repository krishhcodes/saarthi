import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  Sparkles, 
  Navigation, 
  Hotel, 
  Users, 
  Building2, 
  Globe2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Layers, 
  HeartHandshake, 
  Award,
  ChevronRight,
  Eye,
  Activity
} from 'lucide-react';

export default function LandingView() {
  const { navigateTo, destinations } = useApp();

  const valueProps = [
    {
      icon: Navigation,
      title: "Personalized AI-Driven Navigation",
      desc: "Step-free routing, ramp incline verification (1:12 slope standard), elevator live status, and tactile paver trails.",
      tag: "Zero Barrier Routes",
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      icon: Hotel,
      title: "Verified Accessible Stays",
      desc: "Detailed roll-in shower measurements, wide doorways (>90cm), bed heights, and sensory visual smoke alarms.",
      tag: "100% Inspected Stays",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      icon: Users,
      title: "Specialized Guide Matching",
      desc: "Certified Indian Sign Language (ISL) guides, wheelchair mobility escorts, and trained audio-descriptive heritage experts.",
      tag: "MOT & Sugamya Certified",
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      icon: Building2,
      title: "Government Scheme Integration",
      desc: "Instant access to Sugamya Bharat monument passes, IRCTC rail concessions, ADIP assistive grants, and local 24x7 ERSS 112.",
      tag: "Sugamya Bharat Aligned",
      color: "bg-amber-50 text-amber-800 border-amber-200"
    },
    {
      icon: Globe2,
      title: "Multilingual & Voice Support",
      desc: "Real-time translation and native voice reader in 11 Indian & international languages with hands-free voice commands.",
      tag: "11 Regional Languages",
      color: "bg-teal-50 text-teal-700 border-teal-200"
    },
    {
      icon: Activity,
      title: "Accessibility Journey Score",
      desc: "Proprietary multi-factor algorithm evaluating entire route, transport, stay, destination, and guide safety out of 100.",
      tag: "Patent-Pending Innovation",
      color: "bg-rose-50 text-rose-700 border-rose-200"
    }
  ];

  const stats = [
    { value: "300M+", label: "People with Disabilities worldwide needing accessible tourism" },
    { value: "3,690+", label: "ASI Protected Monuments eligible under Sugamya Bharat" },
    { value: "10 Hubs", label: "Pre-verified accessible circuits mapped in prototype" },
    { value: "100%", label: "Step-Free Verified Routes & Certified Guide Network" }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-saarthi-50 via-white to-slate-50 pt-12 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-saarthi-100 text-saarthi-800 border border-saarthi-300 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-saarthi-600" />
                <span>Smart India Hackathon 2026 Prototype — Problem Statement 49</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
                  Saarthi
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-saarthi-600">
                  Accessible Tourism Navigator
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 pt-1">
                  “Tourism for Everyone.”
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Explore the world with dignity, confidence, and equal opportunities. Saarthi brings together step-free routes, certified disability guides, barrier-free stays, and crowdsourced accessibility auditing.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => navigateTo('profile-setup')}
                  className="px-6 py-3.5 rounded-xl bg-saarthi-600 hover:bg-saarthi-700 text-white font-bold text-base shadow-lg shadow-saarthi-500/25 flex items-center gap-2 transition-all transform active:scale-95"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Plan My Accessible Trip</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => navigateTo('destinations')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm flex items-center gap-2 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-saarthi-600" />
                  <span>Explore Destinations</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 border-t border-slate-200/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Wheelchair & Mobility</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Visual & Tactile Guidance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Indian Sign Language (ISL)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Cognitive & Senior Care</span>
                </div>
              </div>
            </div>

            {/* Right Card / Interactive Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 relative">
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Live Certified Feature
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-saarthi-100 text-saarthi-700 flex items-center justify-center font-bold text-xl">
                      93
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Taj Mahal Barrier-Free Circuit</h4>
                      <p className="text-xs text-slate-500">Agra, Uttar Pradesh • 100% Step-Free</p>
                    </div>
                  </div>
                </div>

                <div className="my-4 rounded-2xl overflow-hidden relative group">
                  <img
                    src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
                    alt="Taj Mahal Ramp"
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ASI Verified: 1:12 Ramp to Marble Plinth</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                    <span className="font-medium">Step-Free Elevation:</span>
                    <span className="font-bold text-emerald-700">Zero Stairs (Ramps Only)</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                    <span className="font-medium">Transit Connection:</span>
                    <span className="font-bold text-slate-900">Electric Buggy from Shilpgram</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                    <span className="font-medium">Guide Specialization:</span>
                    <span className="font-bold text-saarthi-700">Sign Language & Mobility</span>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('destinations')}
                  className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Explore 10 Accessible Destinations</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-saarthi-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-saarthi-400 text-xs font-bold tracking-wider uppercase">
              Transforming Travel Ecosystems
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              Aligned with Sugamya Bharat & UN Accessible Tourism
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Over 300 million people live with significant disabilities globally. Saarthi eliminates physical, informational, and sensory barriers to empower self-reliant exploration.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-3xl sm:text-4xl font-black text-saarthi-400">
                  {item.value}
                </p>
                <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Core Innovations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-saarthi-600 text-xs font-bold tracking-wider uppercase">
            Product Architecture & Features
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">
            Built from Ground-Up for Universal Accessibility
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Each feature solves real-world challenges faced by disabled travelers across transit, heritage sites, and local services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueProps.map((prop, idx) => {
            const Icon = prop.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:border-saarthi-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${prop.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {prop.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {prop.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-saarthi-600">
                  <span>Learn how it works</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Indian Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-saarthi-600 text-xs font-bold tracking-wider uppercase">
              Explore Accessible India
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Top Barrier-Free Indian Destinations
            </h2>
          </div>
          <button
            onClick={() => navigateTo('destinations')}
            className="text-sm font-bold text-saarthi-600 hover:text-saarthi-800 flex items-center gap-1 self-start"
          >
            <span>View all 10 Hubs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.slice(0, 3).map((dest) => (
            <div
              key={dest.id}
              onClick={() => navigateTo('destination-detail', { destination: dest })}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-900 font-black text-xs px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                  <span className="text-saarthi-600">★</span>
                  <span>Score: {dest.accessibilityScore}/100</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                  {dest.city}, {dest.state}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-saarthi-600 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {dest.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SIH Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-saarthi-600 to-sky-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black">
              Ready to experience barrier-free tourism?
            </h3>
            <p className="text-saarthi-100 text-sm leading-relaxed">
              Create your personalized accessibility profile in 30 seconds to get tailored step-free routes, verified stays, and trained guide matching.
            </p>
          </div>
          <button
            onClick={() => navigateTo('profile-setup')}
            className="px-8 py-4 bg-white text-saarthi-800 hover:bg-slate-100 rounded-2xl font-extrabold text-sm sm:text-base shadow-xl shrink-0 transition-transform active:scale-95 flex items-center gap-2"
          >
            <span>Start Profile Setup</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
