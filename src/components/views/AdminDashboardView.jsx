import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles,
  Building2,
  Award,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboardView() {
  const { 
    communityReports, 
    setCommunityReports, 
    guides, 
    setGuides, 
    destinations, 
    addToast 
  } = useApp();

  const [pendingReports, setPendingReports] = useState([
    {
      id: "rep-pending-1",
      title: "Temporary ramp installed at Humayun's Tomb South Gate",
      contributor: "Tanvi Kapoor (Volunteer)",
      city: "Delhi",
      type: "Ramp",
      date: "2026-02-21",
      description: "Non-slip wooden ramp added with 1:12 slope for garden circuit."
    },
    {
      id: "rep-pending-2",
      title: "Broken elevator tactile button at Amber Fort Palace museum",
      contributor: "Karan Johal (Guide)",
      city: "Jaipur",
      type: "Obstacle",
      date: "2026-02-20",
      description: "Braille button for floor 2 needs replacement."
    }
  ]);

  const [pendingGuideApprovals, setPendingGuideApprovals] = useState([
    {
      id: "guide-pend-1",
      name: "Farhan Qureshi",
      city: "Delhi / Agra",
      license: "ASI Lic #8812 (Pending Verification)",
      specializations: ["Wheelchair Mobility", "Sign Language Basics"],
      exp: "3 Years"
    }
  ]);

  const handleApproveReport = (reportId) => {
    setPendingReports(prev => prev.filter(r => r.id !== reportId));
    addToast("Community accessibility report verified and published to live map!", "success");
  };

  const handleRejectReport = (reportId) => {
    setPendingReports(prev => prev.filter(r => r.id !== reportId));
    addToast("Report rejected due to insufficient photo evidence.", "info");
  };

  const handleApproveGuide = (guideId) => {
    setPendingGuideApprovals(prev => prev.filter(g => g.id !== guideId));
    addToast("Guide certification approved! Verified Sugamya badge issued.", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>System Administration & Quality Moderation Console</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Sugamya Bharat Admin Portal
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Moderation queue for crowd-sourced accessibility audits, guide verification checks, and monument barrier certifications.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Registered PwD Travelers</span>
            <Users className="w-4 h-4 text-saarthi-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">14,280</p>
          <span className="text-[11px] font-semibold text-emerald-600">↑ 18% month over month</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Certified Guides</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">480</p>
          <span className="text-[11px] font-semibold text-purple-600">100% MOT Accredited</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Live Community Audits</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">1,840</p>
          <span className="text-[11px] font-semibold text-emerald-600">96.4% Accuracy rating</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Pending Moderation Queue</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{pendingReports.length + pendingGuideApprovals.length}</p>
          <span className="text-[11px] font-semibold text-amber-700">Requires review</span>
        </div>
      </div>

      {/* 2-Col Moderation Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Accessibility Reports (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-saarthi-600" />
              <span>Pending Accessibility Reports ({pendingReports.length})</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Live Submissions</span>
          </div>

          {pendingReports.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <span>All submitted accessibility reports have been reviewed!</span>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReports.map((rep) => (
                <div key={rep.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{rep.title}</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      {rep.type}
                    </span>
                  </div>
                  <p className="text-slate-600">{rep.description}</p>
                  <p className="text-[10px] text-slate-400">By {rep.contributor} • {rep.city} • {rep.date}</p>

                  <div className="pt-2 flex justify-end gap-2 border-t border-slate-200/60">
                    <button
                      onClick={() => handleRejectReport(rep.id)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-bold rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveReport(rep.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors"
                    >
                      Approve & Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Guide Verification Approvals (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Guide Accreditation Requests ({pendingGuideApprovals.length})</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">MOT & NGO Checks</span>
          </div>

          {pendingGuideApprovals.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <span>All guide certification requests have been audited!</span>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingGuideApprovals.map((guide) => (
                <div key={guide.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{guide.name}</span>
                    <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                      {guide.exp}
                    </span>
                  </div>
                  <p className="text-slate-600 font-mono text-[11px]">{guide.license}</p>
                  <div className="flex flex-wrap gap-1">
                    {guide.specializations.map((s, i) => (
                      <span key={i} className="text-[10px] bg-white border px-2 py-0.5 rounded text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-slate-200/60">
                    <button
                      onClick={() => handleApproveGuide(guide.id)}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-sm transition-colors"
                    >
                      Approve & Grant Verified Badge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
