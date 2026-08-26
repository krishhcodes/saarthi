import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  PhoneCall, 
  FileText, 
  Award, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function GovServicesView() {
  const { govServices, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'National Infrastructure Scheme', 'Transport Subsidy', 'Assistive Equipment Support', 'Identity & Universal Pass', 'Beach Accessibility', '24x7 Emergency Help'];

  const filteredServices = govServices.filter(s => {
    if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.benefits.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAction = (service) => {
    addToast(`Opening official portal for "${service.title}"...`, 'info');
    window.open(service.website, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
          <Building2 className="w-3.5 h-3.5" />
          <span>National & Regional Disability Support Ecosystem</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Government Schemes & Local Services
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Integrated with Government of India open data, Sugamya Bharat Abhiyan, and Ministry of Tourism accessible guidelines.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scheme name, subsidy, UDID, transport..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? '🏛️ All Categories' : `🏛️ ${cat}`}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredServices.length} Government Support Programs
        </span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-saarthi-600">
                    {service.department}
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                    {service.title}
                  </h3>
                </div>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap border border-amber-300">
                  {service.badge}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {service.description}
              </p>

              {/* Eligibility & Benefits Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <div>
                  <strong className="text-slate-900 block font-semibold">Eligibility:</strong>
                  <span className="text-slate-600">{service.eligibility}</span>
                </div>
                <div className="pt-1 border-t border-slate-200/60">
                  <strong className="text-emerald-800 block font-semibold">Tourist Benefits:</strong>
                  <span className="text-slate-700">{service.benefits}</span>
                </div>
              </div>
            </div>

            {/* Bottom Contact & Action */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-mono font-medium truncate">
                📞 {service.contact}
              </span>

              <button
                onClick={() => handleAction(service)}
                className="px-4 py-2.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{service.actionText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
