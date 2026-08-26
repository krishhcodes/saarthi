import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Users,
  Building
} from 'lucide-react';
import { DEMO_PERSONAS } from '../../data/seedData';

export default function AuthView() {
  const { navigateTo, setCurrentUser, setUserProfile, addToast, switchPersona } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState('tourist'); // 'tourist' | 'guide' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [udidNumber, setUdidNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'signup') {
      const newUser = {
        id: `user-${Date.now()}`,
        name: name || "Demo Traveler",
        email: email || "traveler@saarthi.org",
        role: selectedRole,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        udidNumber: udidNumber || "DL042026889912",
        accessibilityProfile: {
          primaryDisability: "Mobility / Wheelchair",
          secondaryNeeds: ["Step-Free Access", "Accessible Washroom"],
          preferredLanguage: "English",
          maxWalkingDistance: "Under 200m",
          preferredTransport: "Accessible Cab",
          accommodationRequirements: ["Roll-in Shower"],
          needForGuide: true
        }
      };
      setCurrentUser(newUser);
      setUserProfile(newUser.accessibilityProfile);
      addToast(`Welcome to Saarthi, ${newUser.name}! Let's customize your accessibility profile.`, 'success');
      navigateTo('profile-setup');
    } else {
      // Default login
      if (selectedRole === 'admin') {
        switchPersona('admin_sharma');
      } else if (selectedRole === 'guide') {
        switchPersona('guide_vikram');
      } else {
        switchPersona('tourist_wheelchair');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Left Col: Info / Branding */}
        <div className="md:col-span-5 bg-gradient-to-br from-saarthi-700 to-slate-900 text-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black">Saarthi</span>
            </div>
            <h2 className="text-2xl font-black mb-3">
              Accessible Tourism For Everyone
            </h2>
            <p className="text-xs text-saarthi-200 leading-relaxed mb-6">
              Sign in to receive personalized step-free routes, certified guide matches, and Sugamya Bharat monument support.
            </p>

            {/* Quick Demo Logins for SIH Jury */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2.5">
              <p className="text-xs font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                SIH Jury 1-Click Fast Login
              </p>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => switchPersona('tourist_wheelchair')}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors flex items-center justify-between"
                >
                  <span>🦽 <strong>Aarav Sharma</strong> (Wheelchair Tourist)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => switchPersona('tourist_blind')}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors flex items-center justify-between"
                >
                  <span>🦯 <strong>Priya Sundaram</strong> (Blind Traveler)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => switchPersona('guide_vikram')}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors flex items-center justify-between"
                >
                  <span>🤟 <strong>Vikram Singh</strong> (Certified Guide)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => switchPersona('admin_sharma')}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors flex items-center justify-between"
                >
                  <span>🛡️ <strong>Dr. Sharma</strong> (Admin Portal)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 text-[11px] text-saarthi-300">
            Powered by Firebase Auth & UDID verification architecture
          </div>
        </div>

        {/* Right Col: Interactive Form */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                authMode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Role Selector */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('tourist')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'tourist'
                    ? 'border-saarthi-600 bg-saarthi-50 text-saarthi-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Tourist</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('guide')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'guide'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Specialized Guide</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'admin'
                    ? 'border-amber-600 bg-amber-50 text-amber-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin / Gov</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
                />
              </div>
            </div>

            {authMode === 'signup' && selectedRole === 'tourist' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  UDID (Unique Disability ID) Number (Optional)
                </label>
                <input
                  type="text"
                  value={udidNumber}
                  onChange={(e) => setUdidNumber(e.target.value)}
                  placeholder="e.g. DL042026889912 (Auto-verified via Swavlamban)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-saarthi-500 focus:outline-none font-mono"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>{authMode === 'login' ? `Sign In as ${selectedRole.toUpperCase()}` : 'Create Account & Setup Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
