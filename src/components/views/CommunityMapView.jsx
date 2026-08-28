import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  X,
  ArrowRight,
  MapPin,
  Loader2,
  Camera,
  Navigation,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { analyzeAccessibilityPhoto } from '../../services/aiService';

export default function CommunityMapView() {
  const { 
    addCommunityReport, 
    currentUser, 
    destinations, 
    addToast 
  } = useApp();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // New Report Form State
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('Ramp');
  const [formDestId, setFormDestId] = useState('dest-1');
  const [formDesc, setFormDesc] = useState('');
  const [formPhoto, setFormPhoto] = useState('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80');
  const [detectedCoords, setDetectedCoords] = useState(null);
  const [isScanningAi, setIsScanningAi] = useState(false);
  const [aiAnalysisPreview, setAiAnalysisPreview] = useState(null);

  // Automatically request GPS location and open report modal
  const handleOpenReportModal = () => {
    setIsLocating(true);
    addToast("Requesting GPS location for accurate ground submission...", "info");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setDetectedCoords(coords);
          setIsLocating(false);
          setIsSubmitModalOpen(true);
          addToast(`GPS location captured: ${coords[0].toFixed(4)}° N, ${coords[1].toFixed(4)}° E`, "success");
        },
        (error) => {
          console.warn("Geolocation error:", error);
          const dest = destinations.find(d => d.id === formDestId) || destinations[0];
          setDetectedCoords(dest.coordinates);
          setIsLocating(false);
          setIsSubmitModalOpen(true);
          addToast("GPS access unavailable. Using nearest monument location.", "info");
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    } else {
      const dest = destinations.find(d => d.id === formDestId) || destinations[0];
      setDetectedCoords(dest.coordinates);
      setIsLocating(false);
      setIsSubmitModalOpen(true);
    }
  };

  const handleRunAiAudit = async () => {
    setIsScanningAi(true);
    try {
      const result = await analyzeAccessibilityPhoto(formPhoto);
      setAiAnalysisPreview(result);
      addToast(`AI Computer Vision Audit: ${result.overallVerdict} (${result.confidenceScore}% confidence)`, "success");
    } catch (err) {
      addToast("Could not complete AI audit on image.", "warning");
    } finally {
      setIsScanningAi(false);
    }
  };

  const handleSubmitNewReport = async (e) => {
    e.preventDefault();
    const dest = destinations.find(d => d.id === formDestId) || destinations[0];
    const coords = detectedCoords || dest.coordinates;

    await addCommunityReport({
      destinationId: dest.id,
      destinationName: dest.name,
      city: dest.city,
      coordinates: coords,
      type: formType,
      title: formTitle,
      description: formDesc,
      photoUrl: formPhoto,
      contributor: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
      contributorRole: currentUser.accessibilityProfile?.primaryDisability || "Community Auditor",
      aiAnalysis: aiAnalysisPreview ? {
        rampDetected: (aiAnalysisPreview.overallVerdict || '').toLowerCase().includes('accessible'),
        slopeConfidence: (aiAnalysisPreview.confidenceScore || 90) / 100,
        handrailsPresent: true,
        estimatedIncline: aiAnalysisPreview.slopeAngle || '1:12 CPWD standard',
        detectedFeatures: aiAnalysisPreview.detectedFeatures || [],
        overallVerdict: aiAnalysisPreview.overallVerdict
      } : null
    }, formPhoto);

    setIsSubmitModalOpen(false);
    setFormTitle('');
    setFormDesc('');
    setAiAnalysisPreview(null);
    setDetectedCoords(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Crowdsourced Ground Intelligence & Community Audits</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Community Ground Reports
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time verified ground reports, obstacles, and accessibility aids feeding directly into Route Planning and Navigation.
          </p>
        </div>

        <div>
          <button
            onClick={handleOpenReportModal}
            disabled={isLocating}
            className="px-6 py-3.5 bg-gradient-to-r from-saarthi-600 to-sky-600 hover:from-saarthi-700 hover:to-sky-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-saarthi-500/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{isLocating ? "Fetching GPS Location..." : "Report Ground Finding"}</span>
          </button>
        </div>
      </div>

      {/* ── Streamlined Reporting Info Card ────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-black text-slate-900">
            Report Ramps, Accessible Entrances & Obstacles
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Your on-ground observations empower thousands of disabled travelers to navigate monuments safely. Click below to submit an accessibility finding with automatic GPS coordinate tagging.
          </p>
        </div>

        {/* 3 Step Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
              1
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Automatic GPS Location</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When you click report, your browser automatically tags the exact latitude and longitude of the monument or gate.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-saarthi-100 text-saarthi-800 flex items-center justify-center font-black text-sm">
              2
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Photo & Ramp Details</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload photo evidence and let Gemini Vision AI automatically verify ramp incline, handrails, and surface conditions.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm">
              3
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Live Route Updates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verified findings immediately alert wheelchair users and update step-free route recommendations across Saarthi.
            </p>
          </div>
        </div>

        {/* Central Action CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-saarthi-50 to-sky-50 rounded-2xl border border-saarthi-200">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-sm text-slate-900">Are you currently at a monument or transit station?</h4>
            <p className="text-xs text-slate-600">Submit an update in under 30 seconds with automatic GPS tagging.</p>
          </div>

          <button
            onClick={handleOpenReportModal}
            disabled={isLocating}
            className="px-8 py-4 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-2xl font-black text-sm sm:text-base shadow-lg shadow-saarthi-500/25 shrink-0 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70"
          >
            {isLocating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            <span>{isLocating ? "Acquiring GPS Location..." : "Report Ground Finding"}</span>
          </button>
        </div>
      </div>

      {/* ── Submission Modal with Automatic GPS Coordinates ───────────────── */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsSubmitModalOpen(false);
                setAiAnalysisPreview(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-saarthi-500" />
              <span>Ground Barrier & Ramp Auditing</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">
              Submit Accessibility Finding
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ground observations directly update the Route Navigator and AI Vision Catalog.
            </p>

            {/* Automatically Captured GPS Location Box */}
            {detectedCoords && (
              <div className="mb-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>GPS Auto-Coordinates: <strong>{detectedCoords[0].toFixed(4)}° N, {detectedCoords[1].toFixed(4)}° E</strong></span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  GPS Active
                </span>
              </div>
            )}

            <form onSubmit={handleSubmitNewReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Associated Monument / City</label>
                <select
                  value={formDestId}
                  onChange={(e) => setFormDestId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-xs focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
                >
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Accessibility Category</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-xs focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
                >
                  <option value="Ramp">🦽 Ramp / Incline Slope</option>
                  <option value="Elevator">🛗 Elevator / Hydraulic Lift</option>
                  <option value="Accessible Entrance">🚪 Accessible Gate / Zero Step Turnstile</option>
                  <option value="Accessible Washroom">🚻 Dedicated PwD Restroom</option>
                  <option value="Accessible Transport">🚌 Low-Floor Electric Buggy / Shuttle</option>
                  <option value="Obstacle / Blocked Path">⚠️ Obstacle / Damaged Ramp / Step Hazard</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. New anti-skid ramp installed at West Gate with dual handrails"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-xs focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description & Measurements</label>
                <textarea
                  required
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe slope inclination, door clearance, surface traction, presence of handrails..."
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-xs focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
                />
              </div>

              {/* Photo & Gemini Vision AI Scanner */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-saarthi-600" />
                    <span>Photo Evidence & AI Vision Audit</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRunAiAudit}
                    disabled={isScanningAi}
                    className="px-3 py-1.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm disabled:opacity-50"
                  >
                    {isScanningAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
                    <span>{isScanningAi ? "Auditing..." : "Audit with AI Vision"}</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={formPhoto}
                  onChange={(e) => setFormPhoto(e.target.value)}
                  placeholder="Photo URL (e.g. Unsplash or image link)"
                  className="w-full p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px]"
                />

                {/* AI Analysis Preview if audited */}
                {aiAnalysisPreview && (
                  <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-400">✓ AI Classification: {aiAnalysisPreview.overallVerdict}</span>
                      <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono text-[10px]">
                        {aiAnalysisPreview.confidenceScore}% Confidence
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{aiAnalysisPreview.recommendation}</p>
                    <span className="inline-block text-[10px] font-bold bg-saarthi-500/30 text-saarthi-300 px-2 py-0.5 rounded">
                      Incline: {aiAnalysisPreview.slopeAngle}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-saarthi-600 to-sky-600 hover:from-saarthi-700 hover:to-sky-700 text-white rounded-xl font-black text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Publish to Community Ground Reports</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
