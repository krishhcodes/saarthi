import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, ShieldCheck, HeartHandshake, PhoneCall, Globe2, Award } from 'lucide-react';

export default function Footer() {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-saarthi-500 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">Saarthi</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              “Tourism for Everyone.” An initiative for Smart India Hackathon 2026 ensuring barrier-free, dignified, and inclusive travel across India.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-saarthi-400 bg-saarthi-950/60 p-2.5 rounded-lg border border-saarthi-800">
              <Award className="w-4 h-4 shrink-0" />
              <span>SIH 2026 Problem Statement 49 | Team Ctrl Freaks</span>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Core Modules
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigateTo('destinations')} className="hover:text-saarthi-400 transition-colors">
                  Accessible Destinations Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('route-planner')} className="hover:text-saarthi-400 transition-colors">
                  Step-Free Route Planner
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('places')} className="hover:text-saarthi-400 transition-colors">
                  Monument & Places Check
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('guides')} className="hover:text-saarthi-400 transition-colors">
                  Specialized Guides Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('community-map')} className="hover:text-saarthi-400 transition-colors">
                  Community Ground Reports
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('ai-verify')} className="hover:text-saarthi-400 transition-colors">
                  AI Computer Vision Scanner
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Schemes & Initiatives */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Government Support
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="https://depwd.gov.in/en/accessible-india-campaign/" target="_blank" rel="noopener noreferrer" className="hover:text-saarthi-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Sugamya Bharat Abhiyan
                </a>
              </li>
              <li>
                <a href="https://www.swavlambancard.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-saarthi-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  UDID National Disability Pass
                </a>
              </li>
              <li>
                <a href="https://indianrailways.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-saarthi-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  IRCTC Divyangjan Concessions
                </a>
              </li>
              <li>
                <a href="https://tourism.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-saarthi-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Ministry of Tourism Guidelines
                </a>
              </li>
              <li>
                <button onClick={() => navigateTo('gov-services')} className="text-saarthi-400 font-semibold hover:underline mt-1 block">
                  View All 10 Schemes →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: 24x7 Helplines */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Emergency & Helplines
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <p className="font-bold text-red-400 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" /> Emergency Response (ERSS): 112
                </p>
                <p className="text-slate-400 mt-0.5">Pan-India Police, Medical & Fire with SOS</p>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <p className="font-bold text-saarthi-400 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" /> Sugamya Bharat: 1800-11-8454
                </p>
                <p className="text-slate-400 mt-0.5">Toll-Free Monument & Transport Assistance</p>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" /> Railway Divyangjan: 139
                </p>
                <p className="text-slate-400 mt-0.5">Station Wheelchairs & Battery Car Support</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Saarthi Platform – Developed for Smart India Hackathon (SIH 2026).</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              Built for Universal Accessibility
            </span>
            <span className="text-slate-600">|</span>
            <button onClick={() => navigateTo('admin-dashboard')} className="hover:text-saarthi-400 underline">
              Admin Portal
            </button>
            <button onClick={() => navigateTo('guide-dashboard')} className="hover:text-saarthi-400 underline">
              Guide Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
