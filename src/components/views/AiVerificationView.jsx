import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Camera, 
  Layers, 
  ArrowRight, 
  ShieldAlert,
  Ruler,
  Check
} from 'lucide-react';
import { SAMPLE_VERIFICATION_IMAGES, analyzeAccessibilityPhoto } from '../../services/aiService';

export default function AiVerificationView() {
  const { navigateTo, addCommunityReport, addToast } = useApp();

  const [selectedImage, setSelectedImage] = useState(SAMPLE_VERIFICATION_IMAGES[0]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(SAMPLE_VERIFICATION_IMAGES[0].mockResult);

  const handleSelectSample = async (sample) => {
    setSelectedImage(sample);
    setCustomImageUrl('');
    setIsScanning(true);
    try {
      const res = await analyzeAccessibilityPhoto(sample.id);
      setAnalysisResult(res);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result;
        setCustomImageUrl(base64Data);
        setSelectedImage({
          id: "custom",
          name: file.name,
          url: base64Data,
          label: "User Uploaded Image"
        });
        setIsScanning(true);
        try {
          const res = await analyzeAccessibilityPhoto(base64Data);
          setAnalysisResult(res);
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCommunityMap = () => {
    addCommunityReport({
      destinationId: "dest-1",
      destinationName: "Taj Mahal Complex",
      city: "Agra",
      coordinates: [27.1751, 78.0421],
      type: analysisResult.detectedFeatures[0]?.label?.includes("Ramp") ? "Ramp" : "Accessible Entrance",
      title: `AI-Verified: ${selectedImage.name}`,
      description: `${analysisResult.overallVerdict}. ${analysisResult.slopeAngle}. ${analysisResult.recommendation}`,
      photoUrl: selectedImage.url,
      contributor: "AI Vision Scanner & Aarav Sharma",
      contributorRole: "AI Audited",
      aiAnalysis: {
        rampDetected: true,
        slopeConfidence: analysisResult.confidenceScore / 100,
        handrailsPresent: true,
        estimatedIncline: analysisResult.slopeAngle
      }
    });

    setTimeout(() => {
      navigateTo('community-map');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Computer Vision & Geometric Accessibility Scanner</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          AI Accessibility Visual Verification
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload or capture photos of monument entrances, ramps, stairs, or doorways. Saarthi AI detects incline angles, handrails, steps, and obstacles with spatial bounding boxes.
        </p>
      </div>

      {/* Prominent Mandatory AI Disclaimer Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block">Important Notice: AI-Assisted Visual Verification</strong>
          <span>
            This tool provides automated visual analysis of visible architectural features. It is designed to assist planning and must not be taken as an engineering warranty. Always cross-verify with on-ground signage, Sugamya Bharat official audits, and local guide feedback.
          </span>
        </div>
      </div>

      {/* Select Sample or Upload Custom */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-700">
            Select Sample Image or Upload Your Photo
          </h3>

          <label className="cursor-pointer px-4 py-2 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-transform active:scale-95 self-start sm:self-auto">
            <Camera className="w-4 h-4" />
            <span>Upload Photo / Capture</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCustomUpload}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SAMPLE_VERIFICATION_IMAGES.map((sample) => {
            const isSelected = selectedImage.id === sample.id;
            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'border-saarthi-600 bg-saarthi-50/50 shadow-md ring-2 ring-saarthi-300'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-slate-900 truncate">{sample.name}</p>
                  <p className="text-[11px] text-slate-500">{sample.label}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-saarthi-600 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Analysis Display: Image with Bounding Boxes (7 cols) + AI Metrics (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Image with Canvas Bounding Boxes */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between">
          <div className="p-4 bg-slate-950/80 text-white flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Computer Vision Visual Inference</span>
            </span>
            <span className="bg-saarthi-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
              Confidence: {analysisResult.confidenceScore}%
            </span>
          </div>

          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            <img
              src={selectedImage.url}
              alt="Scan Target"
              className="w-full h-full object-cover opacity-90"
            />

            {/* Simulated Bounding Box Overlays */}
            {!isScanning && analysisResult.detectedFeatures?.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  top: `${feat.bbox[0]}%`,
                  left: `${feat.bbox[1]}%`,
                  height: `${feat.bbox[2] - feat.bbox[0]}%`,
                  width: `${feat.bbox[3] - feat.bbox[1]}%`,
                }}
                className={`border-2 rounded transition-all animate-in zoom-in-75 ${
                  feat.status === 'positive'
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                    : feat.status === 'danger'
                    ? 'border-red-500 bg-red-500/25 text-red-200'
                    : 'border-amber-400 bg-amber-500/20 text-amber-200'
                }`}
              >
                <span className="absolute -top-5 left-0 text-[10px] font-bold px-1.5 py-0.5 bg-black/80 rounded backdrop-blur-sm whitespace-nowrap shadow">
                  {feat.label}
                </span>
              </div>
            ))}

            {isScanning && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white space-y-3">
                <div className="w-12 h-12 rounded-full border-4 border-saarthi-400 border-t-transparent animate-spin"></div>
                <p className="text-xs font-bold tracking-wider uppercase">Running Neural Geometry Engine...</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-950 text-slate-300 text-xs flex items-center justify-between">
            <span>Target: <strong>{selectedImage.name}</strong></span>
            <span className="text-emerald-400 font-bold">✓ Model: Gemini 1.5 Pro Vision</span>
          </div>
        </div>

        {/* Right: Detailed AI Metrics & Recommendations */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-saarthi-600 block">
                Overall AI Classification
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {analysisResult.overallVerdict}
              </h3>
            </div>

            {/* Incline and Surface Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Ramp Incline</span>
                <span className="font-bold text-slate-900 text-xs">{analysisResult.slopeAngle}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Surface Grip</span>
                <span className="font-bold text-slate-900 text-xs">{analysisResult.surfaceType}</span>
              </div>
            </div>

            {/* Detected Features List */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Identified Visual Features ({analysisResult.detectedFeatures?.length || 0})
              </h4>
              <div className="space-y-2">
                {analysisResult.detectedFeatures?.map((f, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-2">
                    <div>
                      <strong className="text-slate-900 block font-semibold">{f.label}</strong>
                      <span className="text-slate-500 text-[11px]">{f.detail}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      f.status === 'positive' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {f.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
              <strong className="block font-bold mb-0.5">Recommendation:</strong>
              <p className="leading-relaxed">{analysisResult.recommendation}</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAddToCommunityMap}
            className="w-full py-3.5 bg-gradient-to-r from-saarthi-600 to-sky-600 hover:from-saarthi-700 hover:to-sky-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>Publish Finding to Community Ground Reports</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
