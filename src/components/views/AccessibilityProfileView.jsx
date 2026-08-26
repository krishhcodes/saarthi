import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake, 
  Navigation,
  Accessibility,
  Eye,
  Ear,
  MessageSquare,
  Brain,
  Layers,
  Save
} from 'lucide-react';

export default function AccessibilityProfileView() {
  const { userProfile, setUserProfile, navigateTo, addToast } = useApp();

  const [primaryDisability, setPrimaryDisability] = useState(userProfile?.primaryDisability || "Mobility / Wheelchair");
  const [mobilityAid, setMobilityAid] = useState(userProfile?.mobilityAid || "Manual Wheelchair / Self-Propelled");
  const [maxWalkingDistance, setMaxWalkingDistance] = useState(userProfile?.maxWalkingDistance || "Under 100 meters (Requires wheelchair / shuttle)");
  const [preferredTransport, setPreferredTransport] = useState(userProfile?.preferredTransport || "Electric Golf Cart / Accessible Cab");
  const [needForGuide, setNeedForGuide] = useState(userProfile?.needForGuide ?? true);
  const [guideSpecialization, setGuideSpecialization] = useState(userProfile?.guideSpecialization || "Wheelchair Assistance");
  const [preferredLanguage, setPreferredLanguage] = useState(userProfile?.preferredLanguage || "English / Hindi");
  const [emergencyContactName, setEmergencyContactName] = useState(userProfile?.emergencyContactName || "Dr. Ramesh Sharma (Father)");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(userProfile?.emergencyContactPhone || "+91-98111-22334");

  const [selectedNeeds, setSelectedNeeds] = useState(userProfile?.secondaryNeeds || [
    "Step-Free Access",
    "Accessible Washroom",
    "Elevator Priority"
  ]);

  const disabilityOptions = [
    {
      id: "Mobility / Wheelchair",
      title: "Mobility / Wheelchair",
      desc: "Requires step-free paths, 1:12 ramps, elevators, and wide doorways (>90cm).",
      icon: Accessibility,
      color: "border-blue-500 bg-blue-50/50 text-blue-900"
    },
    {
      id: "Visual Impairment",
      title: "Visual Impairment",
      desc: "Benefits from tactile paving, Braille plaques, audio descriptions, and sensory tours.",
      icon: Eye,
      color: "border-emerald-500 bg-emerald-50/50 text-emerald-900"
    },
    {
      id: "Hearing Impairment",
      title: "Hearing Impairment",
      desc: "Requires Indian Sign Language (ISL), visual alarm alerts, and induction loops.",
      icon: Ear,
      color: "border-purple-500 bg-purple-50/50 text-purple-900"
    },
    {
      id: "Speech Impairment",
      title: "Speech Impairment",
      desc: "Uses digital communication cards, text-to-speech, and visual phrasebooks.",
      icon: MessageSquare,
      color: "border-teal-500 bg-teal-50/50 text-teal-900"
    },
    {
      id: "Cognitive Accessibility",
      title: "Cognitive Accessibility",
      desc: "Needs quiet sensory zones, simple maps, calm pacing, and predictable schedules.",
      icon: Brain,
      color: "border-amber-500 bg-amber-50/50 text-amber-900"
    },
    {
      id: "Multiple Accessibility Needs",
      title: "Multiple Needs / Senior",
      desc: "Combined mobility and sensory assistance with dedicated companion support.",
      icon: Layers,
      color: "border-rose-500 bg-rose-50/50 text-rose-900"
    }
  ];

  const secondaryNeedsOptions = [
    "Step-Free Access (No Stairs)",
    "Ramps with Handrails (1:12 Max)",
    "Accessible Washrooms with Grab Bars",
    "Elevator Access with Braille & Chimes",
    "Tactile Ground Paving",
    "Audio Tour / Verbal Description",
    "Indian Sign Language (ISL) Guide",
    "Low-Floor Accessible Transport",
    "Motorized Wheelchair Charging Bay",
    "Quiet / Low Sensory Zone"
  ];

  const toggleNeed = (need) => {
    if (selectedNeeds.includes(need)) {
      setSelectedNeeds(selectedNeeds.filter(n => n !== need));
    } else {
      setSelectedNeeds([...selectedNeeds, need]);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      primaryDisability,
      mobilityAid,
      secondaryNeeds: selectedNeeds,
      maxWalkingDistance,
      preferredTransport,
      needForGuide,
      guideSpecialization,
      preferredLanguage,
      emergencyContactName,
      emergencyContactPhone,
      accommodationRequirements: ["Roll-in Shower", "Wide Doorways", "Ground Floor / Elevator"]
    };

    setUserProfile(updated);
    addToast("Accessibility profile saved! Generating personalized recommendations...", "success");
    navigateTo('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="flex items-center gap-2 bg-saarthi-50 text-saarthi-700 text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inclusive Profile Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Set Your Accessibility Requirements
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Saarthi uses this profile to filter routes, recommend barrier-free stays, and match specialized guides for your exact needs.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* Step 1: Primary Disability Type */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">
              1. Select Primary Accessibility Profile
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {disabilityOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = primaryDisability === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPrimaryDisability(opt.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? opt.color + " shadow-md ring-2 ring-saarthi-400"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white/80 shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900">{opt.title}</h4>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-saarthi-600" />}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Specific Secondary Requirements */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">
              2. Key Accessibility Amenities Required (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {secondaryNeedsOptions.map((need, idx) => {
                const isChecked = selectedNeeds.includes(need);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleNeed(need)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                      isChecked
                        ? "bg-saarthi-50 border-saarthi-400 text-saarthi-900 shadow-sm"
                        : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{need}</span>
                    <span className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isChecked ? 'bg-saarthi-600 border-saarthi-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Mobility & Travel Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Maximum Walking Distance Tolerance
              </label>
              <select
                value={maxWalkingDistance}
                onChange={(e) => setMaxWalkingDistance(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
              >
                <option value="Under 100 meters (Requires wheelchair / shuttle)">Under 100 meters (Requires wheelchair / shuttle)</option>
                <option value="100m - 500m (Needs frequent resting gazebos)">100m - 500m (Needs frequent resting gazebos)</option>
                <option value="500m - 1 km with level paving">500m - 1 km with level paving</option>
                <option value="1 km+ with tactile guidance">1 km+ with tactile guidance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Preferred Accessible Transport
              </label>
              <select
                value={preferredTransport}
                onChange={(e) => setPreferredTransport(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
              >
                <option value="Electric Golf Cart / Accessible Cab">Electric Golf Cart / Accessible Cab</option>
                <option value="Low-Floor Accessible City Bus">Low-Floor Accessible City Bus</option>
                <option value="Metro Transit with Station Assist">Metro Transit with Station Assist</option>
                <option value="Accessible Water Metro / Ramped Ferry">Accessible Water Metro / Ramped Ferry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Need Specialized Guide / Escort?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="needGuide"
                    checked={needForGuide === true}
                    onChange={() => setNeedForGuide(true)}
                    className="text-saarthi-600 focus:ring-saarthi-500"
                  />
                  <span>Yes, match me with certified guides</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="needGuide"
                    checked={needForGuide === false}
                    onChange={() => setNeedForGuide(false)}
                    className="text-saarthi-600 focus:ring-saarthi-500"
                  />
                  <span>No, self-guided trip</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Primary Language for Audio & Sign Tours
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
              >
                <option value="English / Hindi">English / Hindi</option>
                <option value="Indian Sign Language (ISL)">Indian Sign Language (ISL)</option>
                <option value="Tamil / English">Tamil / English</option>
                <option value="Bengali / English">Bengali / English</option>
                <option value="Marathi / Hindi">Marathi / Hindi</option>
                <option value="Telugu / English">Telugu / English</option>
                <option value="Gujarati / Hindi">Gujarati / Hindi</option>
              </select>
            </div>
          </div>

          {/* Step 4: Emergency Assistance Contact */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">
              4. Emergency Assistance Details (Transmitted during SOS)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Emergency Contact Name & Relation
                </label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Sharma (Father)"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Emergency Contact Mobile Number
                </label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="+91-98111-22334"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-saarthi-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigateTo('dashboard')}
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
            >
              Skip for Now
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-saarthi-600 hover:bg-saarthi-700 text-white font-black text-sm shadow-lg shadow-saarthi-500/25 flex items-center gap-2 transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile & Open Personalized Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
