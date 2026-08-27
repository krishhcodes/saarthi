import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Loader2,
  ChevronDown,
  ChevronUp,
  Image,
  X
} from 'lucide-react';

export default function AdminDashboardView() {
  const { 
    communityReports, 
    setCommunityReports, 
    guides, 
    destinations, 
    addToast,
    pendingGuideApplications,
    loadGuideApplications,
    approveGuideApplication,
    rejectGuideApplication
  } = useApp();

  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [expandedApplicationId, setExpandedApplicationId] = useState(null);
  const [rejectingUid, setRejectingUid] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(null);

  const [pendingReports, setPendingReports] = useState([
    {
      id: "rep-pending-1",
      title: "Temporary ramp installed at Humayun's Tomb South Gate",
      contributor: "Tanvi Kapoor (Volunteer)",
      city: "Delhi",
      type: "Ramp",
      date: "2026-08-27",
      description: "Non-slip wooden ramp added with 1:12 slope for garden circuit."
    },
    {
      id: "rep-pending-2",
      title: "Broken elevator tactile button at Amber Fort Palace museum",
      contributor: "Karan Johal (Guide)",
      city: "Jaipur",
      type: "Obstacle",
      date: "2026-08-26",
      description: "Braille button for floor 2 needs replacement."
    }
  ]);

  // Load applications on mount
  useEffect(() => {
    async function load() {
      setIsLoadingApplications(true);
      await loadGuideApplications();
      setIsLoadingApplications(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApproveReport = (reportId) => {
    setPendingReports(prev => prev.filter(r => r.id !== reportId));
    addToast("Community accessibility report verified and published to live map!", "success");
  };

  const handleRejectReport = (reportId) => {
    setPendingReports(prev => prev.filter(r => r.id !== reportId));
    addToast("Report rejected due to insufficient photo evidence.", "info");
  };

  const handleApproveGuide = async (application) => {
    setIsSubmittingAction(application.uid);
    await approveGuideApplication(application.uid, application);
    setExpandedApplicationId(null);
    setIsSubmittingAction(null);
  };

  const handleRejectGuide = async (uid) => {
    if (!rejectReason.trim()) {
      addToast('Please provide a rejection reason before submitting.', 'error');
      return;
    }
    setIsSubmittingAction(uid);
    await rejectGuideApplication(uid, rejectReason);
    setRejectingUid(null);
    setRejectReason('');
    setIsSubmittingAction(null);
  };

  const totalPendingCount = pendingReports.length + pendingGuideApplications.length;

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
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{guides.filter(g => g.isVerified).length}</p>
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
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{totalPendingCount}</p>
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
              <span>Guide Accreditation Requests ({pendingGuideApplications.length})</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">MOT & NGO Checks</span>
          </div>

          {isLoadingApplications ? (
            <div className="flex items-center justify-center py-10 gap-2 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading applications…</span>
            </div>
          ) : pendingGuideApplications.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <span>All guide certification requests have been audited!</span>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingGuideApplications.map((application) => {
                const isExpanded = expandedApplicationId === application.uid;
                const isRejecting = rejectingUid === application.uid;
                const isActing = isSubmittingAction === application.uid;
                return (
                  <div key={application.uid} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                    {/* Summary row */}
                    <button
                      onClick={() => setExpandedApplicationId(isExpanded ? null : application.uid)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{application.name}</p>
                          <p className="text-[11px] text-slate-500">{application.city} • {application.experienceYears}+ yrs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Pending</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {/* Expanded detail panel */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3 border-t border-slate-200 pt-3">
                        {/* Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                            <p className="text-[10px] text-slate-400 font-semibold mb-0.5">License Number</p>
                            <p className="font-mono font-bold text-slate-800 text-[11px]">{application.licenseNumber}</p>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                            <p className="text-[10px] text-slate-400 font-semibold mb-0.5">Email</p>
                            <p className="font-semibold text-slate-800 text-[11px] truncate">{application.email}</p>
                          </div>
                        </div>

                        {/* Specializations */}
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Specializations</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(application.specializations || []).map((s, i) => (
                              <span key={i} className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-semibold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bio */}
                        {application.bio && (
                          <div className="bg-white p-3 rounded-xl border border-slate-200">
                            <p className="text-[10px] font-bold text-slate-500 mb-1">Personal Statement</p>
                            <p className="text-xs text-slate-700 leading-relaxed italic">"{application.bio}"</p>
                          </div>
                        )}

                        {/* Certificate Image Preview */}
                        {application.certificateBase64 && (
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <Image className="w-3 h-3" /> Certificate Preview
                            </p>
                            <img
                              src={application.certificateBase64}
                              alt="Submitted Certificate"
                              className="w-full max-h-40 object-contain rounded-xl border border-slate-200 bg-slate-50"
                            />
                          </div>
                        )}

                        {/* Applied date */}
                        <p className="text-[10px] text-slate-400">
                          Applied: {new Date(application.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>

                        {/* Reject with reason form */}
                        {isRejecting ? (
                          <div className="space-y-2">
                            <textarea
                              value={rejectReason}
                              onChange={e => setRejectReason(e.target.value)}
                              rows={3}
                              placeholder="Provide clear feedback for the applicant (e.g. 'Your license number could not be verified. Please resubmit with the complete MOT registration certificate.')"
                              className="w-full px-3 py-2 text-xs rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none leading-relaxed"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setRejectingUid(null); setRejectReason(''); }}
                                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs transition-colors hover:bg-slate-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleRejectGuide(application.uid)}
                                disabled={isActing || !rejectReason.trim()}
                                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                              >
                                {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                                Confirm Rejection
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => setRejectingUid(application.uid)}
                              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reject with Reason
                            </button>
                            <button
                              onClick={() => handleApproveGuide(application)}
                              disabled={isActing}
                              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                            >
                              {isActing
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <CheckCircle2 className="w-3.5 h-3.5" />}
                              Approve & Grant Badge
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
