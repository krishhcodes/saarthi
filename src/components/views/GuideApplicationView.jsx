import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck, Upload, Clock, CheckCircle2, XCircle, AlertTriangle,
  ArrowRight, FileText, User, Phone, MapPin, Award, BookOpen,
  Loader2, RefreshCw, ChevronRight
} from 'lucide-react';

const SPECIALIZATION_OPTIONS = [
  'Wheelchair Mobility Assistance',
  'Indian Sign Language (ISL)',
  'Audio Descriptive Touring',
  'Visual Impairment Escort',
  'Senior Citizen Assistance',
  'Cognitive / Neurodivergent Calm Touring',
  'Tactile Heritage Guiding',
  'Beach & Outdoor Mobility',
  'Emergency First Aid Certified'
];

const LANGUAGE_OPTIONS = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada',
  'Marathi', 'Bengali', 'Gujarati', 'Punjabi',
  'Indian Sign Language (ISL)', 'American Sign Language (ASL)'
];

// Step indicator component
function StepDot({ step, current }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
      done ? 'bg-emerald-500 text-white' :
      active ? 'bg-saarthi-600 text-white ring-4 ring-saarthi-100' :
      'bg-slate-200 text-slate-500'
    }`}>
      {done ? <CheckCircle2 className="w-4 h-4" /> : step}
    </div>
  );
}

export default function GuideApplicationView() {
  const {
    currentUser,
    guideApplicationStatus,
    guideRejectionReason,
    submitGuideApplication,
    setGuideApplicationStatus,
    setCurrentView,
    navigateTo
  } = useApp();

  const [formStep, setFormStep] = useState(1); // 1, 2, 3
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState(['English', 'Hindi']);
  const [bio, setBio] = useState('');
  const [certFileName, setCertFileName] = useState('');
  const [certBase64, setCertBase64] = useState(null);
  const [idFileName, setIdFileName] = useState('');
  const [idBase64, setIdBase64] = useState(null);

  const toggleSpecialization = (spec) => {
    setSelectedSpecializations(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const toggleLanguage = (lang) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'cert') {
        setCertBase64(reader.result);
        setCertFileName(file.name);
      } else {
        setIdBase64(reader.result);
        setIdFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await submitGuideApplication({
      phone,
      city,
      licenseNumber,
      experienceYears: parseInt(experienceYears) || 0,
      specializations: selectedSpecializations,
      languages: selectedLanguages,
      bio,
      certificateBase64: certBase64,
      idProofBase64: idBase64
    });
    setIsSubmitting(false);
  };

  // ─── STATUS: PENDING REVIEW ──────────────────────────────────────────────
  if (guideApplicationStatus === 'pending_review') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-saarthi-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-7 h-7" />
              <h1 className="text-xl font-black">Application Under Review</h1>
            </div>
            <p className="text-amber-100 text-sm">Your guide application is with the Saarthi Admin team</p>
          </div>

          <div className="px-8 py-7 space-y-5">
            {/* Timeline */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Application Submitted</p>
                  <p className="text-xs text-slate-500">Your credentials and documents have been received</p>
                </div>
              </div>
              <div className="ml-4 w-0.5 h-4 bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 animate-pulse">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Admin Review in Progress</p>
                  <p className="text-xs text-slate-500">MOT license & certifications being verified (2–5 business days)</p>
                </div>
              </div>
              <div className="ml-4 w-0.5 h-4 bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400">Saarthi Verified Badge</p>
                  <p className="text-xs text-slate-400">Issued once your credentials are confirmed</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                You will receive an email notification at <strong>{currentUser.email}</strong> once your application is reviewed. You can also check back here for status updates.
              </p>
            </div>

            <button
              onClick={() => navigateTo('landing')}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STATUS: REJECTED ────────────────────────────────────────────────────
  if (guideApplicationStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-7 h-7" />
              <h1 className="text-xl font-black">Application Needs Revision</h1>
            </div>
            <p className="text-red-100 text-sm">Your guide application could not be approved at this time</p>
          </div>

          <div className="px-8 py-7 space-y-5">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
              <p className="text-xs font-bold text-red-800 uppercase tracking-wider">Admin Feedback</p>
              <p className="text-sm text-red-900 leading-relaxed">
                {guideRejectionReason || 'Your application did not meet our current verification standards. Please review the requirements and resubmit with the correct documentation.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                You are welcome to update your documents and resubmit. Common reasons for rejection include: invalid or expired license number, unreadable certificate uploads, or insufficient experience for the chosen specializations.
              </p>
            </div>

            <button
              onClick={() => setGuideApplicationStatus('not_applied')}
              className="w-full py-3.5 rounded-xl bg-saarthi-600 hover:bg-saarthi-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Resubmit Application
            </button>

            <button
              onClick={() => navigateTo('landing')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STATUS: NOT APPLIED — Multi-step application form ───────────────────
  const canProceedStep1 = phone.trim() && city.trim() && experienceYears;
  const canProceedStep2 = selectedSpecializations.length > 0 && licenseNumber.trim();
  const canSubmit = bio.trim().length >= 30;

  return (
    <div className="min-h-screen bg-gradient-to-br from-saarthi-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-saarthi-700 to-emerald-600 text-white px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-200" />
            <span className="text-emerald-200 text-xs font-bold uppercase tracking-widest">Guide Certification Portal</span>
          </div>
          <h1 className="text-2xl font-black mb-1">Apply to be a Saarthi Guide</h1>
          <p className="text-emerald-100 text-sm max-w-md">
            Complete your application to join India's premier accessible tourism guide network. All guides are verified by our admin team before appearing in the public catalog.
          </p>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mt-5">
            {[1, 2, 3].map((step, i) => (
              <React.Fragment key={step}>
                <StepDot step={step} current={formStep} />
                {i < 2 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-all ${formStep > step ? 'bg-emerald-400' : 'bg-white/30'}`} />
                )}
              </React.Fragment>
            ))}
            <div className="ml-2 text-xs text-emerald-200 font-semibold">
              Step {formStep} of 3
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── STEP 1: Personal & Location Info ───────────────────────────── */}
        {formStep === 1 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <User className="w-5 h-5 text-saarthi-600" />
              <h2 className="text-base font-black text-slate-900">Personal & Location Details</h2>
            </div>
            <div className="px-6 py-6 space-y-5">
              {/* Name pre-filled */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-1">Auto-filled from your account</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <Phone className="inline w-3 h-3 mr-1" />
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91-98765-XXXXX"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-saarthi-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    <MapPin className="inline w-3 h-3 mr-1" />
                    Operating City / Region *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Agra / Delhi"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-saarthi-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Years of Guiding Experience *
                </label>
                <select
                  value={experienceYears}
                  onChange={e => setExperienceYears(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-saarthi-400"
                >
                  <option value="">Select experience</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => (
                    <option key={y} value={y}>{y}+ year{y > 1 ? 's' : ''}</option>
                  ))}
                  <option value="15">10+ years</option>
                </select>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Languages You Guide In (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
                        selectedLanguages.includes(lang)
                          ? 'bg-saarthi-600 text-white border-saarthi-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-saarthi-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setFormStep(2)}
                disabled={!canProceedStep1}
                className="w-full py-3.5 rounded-xl bg-saarthi-600 hover:bg-saarthi-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                Continue to Specializations
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Specializations & License ──────────────────────────── */}
        {formStep === 2 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-black text-slate-900">Disability Specializations & License</h2>
            </div>
            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Disability Specializations * (select at least one)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SPECIALIZATION_OPTIONS.map(spec => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialization(spec)}
                      className={`text-left text-xs px-3 py-2.5 rounded-xl border font-semibold transition-all flex items-center gap-2 ${
                        selectedSpecializations.includes(spec)
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-purple-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all ${
                        selectedSpecializations.includes(spec) ? 'bg-purple-600 border-purple-600' : 'border-slate-300'
                      }`}>
                        {selectedSpecializations.includes(spec) && (
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        )}
                      </div>
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <FileText className="inline w-3 h-3 mr-1" />
                  Ministry of Tourism (MOT) / ASI License Number *
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={e => setLicenseNumber(e.target.value)}
                  placeholder="e.g. MOT-N-2024-884 or ASI-Lic-XXXX"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">Enter your official government-issued guide registration number</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setFormStep(1)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setFormStep(3)}
                  disabled={!canProceedStep2}
                  className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  Continue to Documents
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Documents & Bio ─────────────────────────────────────── */}
        {formStep === 3 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-black text-slate-900">Documents & Personal Statement</h2>
            </div>
            <div className="px-6 py-6 space-y-5">
              {/* Certificate Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Certification Document (MOT / ISL / NAB)
                </label>
                <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  certBase64 ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-saarthi-400 bg-slate-50'
                }`}>
                  <Upload className={`w-5 h-5 shrink-0 ${certBase64 ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {certFileName || 'Click to upload certificate (JPG, PNG, PDF)'}
                    </p>
                    {certBase64 && <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">✓ Uploaded successfully</p>}
                  </div>
                  <input type="file" accept="image/*,.pdf" onChange={e => handleFileUpload(e, 'cert')} className="sr-only" />
                </label>
              </div>

              {/* ID Proof Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Government ID Proof (Aadhaar / Passport)
                </label>
                <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  idBase64 ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-saarthi-400 bg-slate-50'
                }`}>
                  <Upload className={`w-5 h-5 shrink-0 ${idBase64 ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {idFileName || 'Click to upload ID proof (JPG, PNG)'}
                    </p>
                    {idBase64 && <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">✓ Uploaded successfully</p>}
                  </div>
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'id')} className="sr-only" />
                </label>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <BookOpen className="inline w-3 h-3 mr-1" />
                  Tell us about yourself & why you guide * (min. 30 characters)
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={4}
                  placeholder="e.g. I have 5 years of experience guiding wheelchair users through the Golden Triangle heritage circuit. I carry emergency ramp extensions and have first-aid certification..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none leading-relaxed"
                />
                <p className={`text-[10px] mt-1 font-semibold ${bio.length >= 30 ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {bio.length} / 30+ characters {bio.length >= 30 && '✓'}
                </p>
              </div>

              {/* Review Summary */}
              <div className="p-4 rounded-2xl bg-saarthi-50 border border-saarthi-200 space-y-1.5 text-xs">
                <p className="font-bold text-saarthi-800 mb-2">Application Summary</p>
                <p className="text-slate-600"><strong>Name:</strong> {currentUser.name}</p>
                <p className="text-slate-600"><strong>City:</strong> {city}</p>
                <p className="text-slate-600"><strong>License:</strong> {licenseNumber}</p>
                <p className="text-slate-600"><strong>Experience:</strong> {experienceYears}+ years</p>
                <p className="text-slate-600"><strong>Specializations:</strong> {selectedSpecializations.slice(0, 2).join(', ')}{selectedSpecializations.length > 2 ? ` +${selectedSpecializations.length - 2} more` : ''}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setFormStep(2)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {isSubmitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                    : <><ShieldCheck className="w-4 h-4" /> Submit Application</>
                  }
                </button>
              </div>

              <p className="text-center text-[10px] text-slate-400 leading-relaxed">
                By submitting, you agree that all information provided is accurate. False or misleading applications will result in permanent disqualification.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
