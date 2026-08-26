import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Gauge, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Navigation, 
  Hotel, 
  Users, 
  Building2, 
  MapPin,
  Award,
  Zap
} from 'lucide-react';

export default function JourneyScoreView() {
  const { currentTrip, updateTrip, addToast, navigateTo } = useApp();

  const scores = currentTrip.scores;

  const scoreFactors = [
    {
      title: "Route Accessibility",
      score: scores.route,
      weight: "25%",
      icon: Navigation,
      desc: "Based on 0 stairs, 1:12 compliant ramps, and tactile paving along path.",
      color: "bg-blue-500",
      textColor: "text-blue-700"
    },
    {
      title: "Transport Ecosystem",
      score: scores.transport,
      weight: "20%",
      icon: Zap,
      desc: "Low-floor accessible shuttle + priority golf carts at monument parking.",
      color: "bg-emerald-500",
      textColor: "text-emerald-700"
    },
    {
      title: "Stay & Room Facilities",
      score: scores.stay,
      weight: "25%",
      icon: Hotel,
      desc: "Roll-in shower with transfer bench, wide doorways (>90cm), and bed transfer height.",
      color: "bg-indigo-500",
      textColor: "text-indigo-700"
    },
    {
      title: "Destination Heritage Audit",
      score: scores.destination,
      weight: "20%",
      icon: MapPin,
      desc: "ASI & Sugamya Bharat verified ramps to main platforms, braille maps & restrooms.",
      color: "bg-purple-500",
      textColor: "text-purple-700"
    },
    {
      title: "Guide & Support Services",
      score: scores.services,
      weight: "10%",
      icon: Users,
      desc: "Ministry of Tourism certified guide with disability-specific accreditation.",
      color: "bg-amber-500",
      textColor: "text-amber-700"
    }
  ];

  const recommendations = [
    {
      id: "rec-1",
      action: "Upgrade to Certified Wheelchair Specialist Guide (Vikram Singh)",
      impact: "+4 Points",
      type: "guide",
      applied: currentTrip.guide?.isVerified
    },
    {
      id: "rec-2",
      action: "Reserve Accessible Battery Buggy from Shilpgram Hub",
      impact: "+3 Points",
      type: "transport",
      applied: true
    },
    {
      id: "rec-3",
      action: "Select Verified Suite with Padded Shower Bench at The Oberoi",
      impact: "+5 Points",
      type: "stay",
      applied: currentTrip.hotel?.facilities.rollInShower
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
          <Gauge className="w-3.5 h-3.5" />
          <span>Composite Multi-Dimensional Safety Index</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Accessibility Journey Score
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Unlike ordinary apps that score only the destination, Saarthi evaluates the complete travel chain: routes, transit, accommodation, heritage sites, and guide readiness.
        </p>
      </div>

      {/* Hero Big Score Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-saarthi-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>High Safety & Independence Rating</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            {currentTrip.title}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Your trip plan has met 96% of international barrier-free standards. All critical transfer points possess certified step-free paths and trained assistance.
          </p>
        </div>

        {/* Big Circular Score Gauge */}
        <div className="relative flex flex-col items-center justify-center bg-white/10 rounded-3xl p-8 border border-white/20 backdrop-blur-md shrink-0 w-60 h-60">
          <span className="text-[11px] font-bold text-saarthi-300 uppercase tracking-wider">
            Overall Journey Score
          </span>
          <div className="text-6xl font-black text-white mt-1 tracking-tight">
            {scores.overall}
          </div>
          <span className="text-xs font-bold text-emerald-400 mt-1">
            out of 100
          </span>
          <div className="w-32 bg-white/20 h-2 rounded-full overflow-hidden mt-3">
            <div
              style={{ width: `${scores.overall}%` }}
              className="h-full bg-gradient-to-r from-saarthi-400 to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* 5-Tier Breakdown Grid */}
      <div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">
          Detailed 5-Tier Accessibility Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scoreFactors.map((factor, idx) => {
            const Icon = factor.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      Weight: {factor.weight}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900">{factor.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{factor.desc}</p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">Component Score:</span>
                    <span className={`font-black text-sm ${factor.textColor}`}>{factor.score} / 100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${factor.score}%` }}
                      className={`h-full ${factor.color} rounded-full`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* "Improve Your Score" Actionable Recommendations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-saarthi-600" />
              <span>How to Improve Your Journey Score</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Actionable enhancements to maximize independence and safety during your tour.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                rec.applied
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {rec.applied ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-saarthi-600 shrink-0" />
                )}
                <div>
                  <p className="font-bold text-xs sm:text-sm">{rec.action}</p>
                  <p className="text-[11px] text-slate-500">
                    {rec.applied ? "✓ Already configured in active itinerary" : "Recommended for maximum comfort"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="font-black text-xs px-2.5 py-1 bg-white rounded-xl shadow-sm border text-emerald-700">
                  {rec.impact}
                </span>
                {!rec.applied && (
                  <button
                    onClick={() => {
                      if (rec.type === 'guide') navigateTo('guides');
                      if (rec.type === 'stay') navigateTo('hotels');
                    }}
                    className="px-3 py-1.5 bg-saarthi-600 text-white rounded-xl font-bold text-xs hover:bg-saarthi-700"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
