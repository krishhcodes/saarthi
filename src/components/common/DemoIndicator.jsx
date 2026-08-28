import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ChevronUp, ChevronDown, CheckCircle, ArrowRight, Play, Info } from 'lucide-react';

export default function DemoIndicator() {
  const { navigateTo, switchPersona, setSelectedDestination, destinations } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const demoSteps = [
    {
      num: 1,
      title: "Wheelchair Profile",
      desc: "Switch to Aarav (UDID Wheelchair Traveler)",
      action: () => switchPersona('tourist_wheelchair')
    },
    {
      num: 2,
      title: "Taj Mahal Accessibility",
      desc: "Inspect ramps, golf-carts & washroom specs",
      action: () => {
        const taj = destinations.find(d => d.id === 'dest-1');
        navigateTo('destination-detail', { destination: taj });
      }
    },
    {
      num: 3,
      title: "Step-Free Route Planner",
      desc: "Interactive map with 0 stairs & 1:12 ramp elevation",
      action: () => navigateTo('route-planner')
    },
    {
      num: 4,
      title: "Book Verified Guide",
      desc: "Match with Vikram Singh (Sugamya Specialist)",
      action: () => navigateTo('guides')
    },
    {
      num: 5,
      title: "AI Vision Scan",
      desc: "Run AI ramp/step detection with bounding boxes",
      action: () => navigateTo('ai-verify')
    },
    {
      num: 6,
      title: "Community Map",
      desc: "View crowd-sourced ramps & submit a new verified report",
      action: () => navigateTo('community-map')
    },
    {
      num: 7,
      title: "Gov Schemes & UDID",
      desc: "Sugamya Bharat policies, UDID benefits & travel concessions",
      action: () => navigateTo('gov-services')
    },
    {
      num: 8,
      title: "Admin Moderation",
      desc: "Switch to Admin Dr. Sharma to approve community reports",
      action: () => switchPersona('admin_sharma')
    }
  ];

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-saarthi-500/40 overflow-hidden max-w-md transition-all">
        {/* Toggle Bar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 flex items-center justify-between bg-gradient-to-r from-saarthi-900 to-slate-900 hover:from-saarthi-800 transition-colors text-left"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold tracking-wide text-saarthi-300 uppercase">
              SIH 2026 Jury Demo Flow
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <span>{isOpen ? 'Minimize' : '1-Click Guided Scenario'}</span>
            {isOpen ? <ChevronDown className="w-4 h-4 text-saarthi-400" /> : <ChevronUp className="w-4 h-4 text-saarthi-400" />}
          </div>
        </button>

        {/* Expanded Steps List */}
        {isOpen && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/95 space-y-2 max-h-[360px] overflow-y-auto">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
              <Info className="w-3.5 h-3.5 text-saarthi-400 shrink-0" />
              <span>Click any step below to instantly demonstrate that specific user flow to the jury:</span>
            </div>

            <div className="space-y-1.5">
              {demoSteps.map((step) => (
                <button
                  key={step.num}
                  onClick={() => {
                    step.action();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/80 hover:bg-saarthi-900/60 border border-slate-800 hover:border-saarthi-700 text-left transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-saarthi-600/30 text-saarthi-300 font-bold text-xs flex items-center justify-center border border-saarthi-500/30">
                      {step.num}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-saarthi-300 transition-colors">
                        {step.title}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-saarthi-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
