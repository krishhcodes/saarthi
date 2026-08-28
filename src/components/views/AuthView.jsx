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
  Users,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  auth, 
  db, 
  doc, 
  setDoc, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  firebaseSignOut,
  isAuthorizedAdmin,
  AUTHORIZED_ADMIN_EMAILS,
  isFirebaseConfigured 
} from '../../config/firebase';

export default function AuthView() {
  const { navigateTo, setCurrentUser, setUserProfile, addToast, switchPersona, setGuideApplicationStatus } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState('tourist'); // 'tourist' | 'guide' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [udidNumber, setUdidNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Firebase Google Sign-In
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    if (!isFirebaseConfigured()) {
      addToast("Demo Mode: Switched to Google Demo Traveler profile", "info");
      switchPersona('tourist_wheelchair');
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Strict Admin Authorization Check
      if (selectedRole === 'admin' && !isAuthorizedAdmin(user.email)) {
        await firebaseSignOut(auth);
        setErrorMsg(`Not Authorised: "${user.email}" is not an authorised Admin account. Only designated Ministry of Tourism / ASI administrator emails (vermasiddharth617@gmail.com, krishh21062003@gmail.com) have admin access.`);
        addToast("Not Authorised: Admin role is restricted to verified administrators.", "error");
        setLoading(false);
        return;
      }

      const accessibilityProfile = {
        primaryDisability: "Mobility / Wheelchair",
        secondaryNeeds: ["Step-Free Access", "Accessible Washroom"],
        preferredLanguage: "English",
        maxWalkingDistance: "Under 200m",
        preferredTransport: "Accessible Cab",
        accommodationRequirements: ["Roll-in Shower"],
        needForGuide: true
      };

      const userDoc = {
        id: user.uid,
        name: user.displayName || "Divyangjan Traveler",
        email: user.email,
        role: selectedRole,
        avatar: user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        udidNumber: udidNumber || "DL042026889912",
        accessibilityProfile,
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'userProfiles', user.uid), userDoc, { merge: true });
      } catch (dbErr) {
        console.warn('[Firestore] Profile write warning:', dbErr);
      }

      setCurrentUser(userDoc);
      setUserProfile(accessibilityProfile);
      addToast(`Welcome ${user.displayName || 'Traveler'}! Signed in with Google.`, 'success');
      
      if (selectedRole === 'admin') {
        navigateTo('admin-dashboard');
      } else if (selectedRole === 'guide') {
        try {
          const appDoc = await getDoc(doc(db, 'guideApplications', user.uid));
          if (appDoc.exists() && appDoc.data()?.status === 'verified') {
            setGuideApplicationStatus('verified');
            navigateTo('guide-dashboard');
          } else {
            const status = appDoc.exists() ? appDoc.data()?.status : 'not_applied';
            setGuideApplicationStatus(status);
            navigateTo('guide-application');
          }
        } catch (e) {
          navigateTo('guide-application');
        }
      } else {
        navigateTo('dashboard');
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setErrorMsg(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Firebase Email/Password Sign-In or Sign-Up
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Strict Admin Authorization Check for Email/Password
    if (selectedRole === 'admin' && !isAuthorizedAdmin(email)) {
      setErrorMsg(`Not Authorised: "${email || 'This account'}" is not an authorised Admin email. Only designated Ministry / ASI administrator email addresses (vermasiddharth617@gmail.com, krishh21062003@gmail.com) are permitted.`);
      addToast("Not Authorised: Admin role is restricted to verified administrators.", "error");
      return;
    }

    if (!isFirebaseConfigured()) {
      // Fallback demo mode
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
        if (selectedRole === 'admin') switchPersona('admin_sharma');
        else if (selectedRole === 'guide') switchPersona('guide_vikram');
        else switchPersona('tourist_wheelchair');
      }
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'signup') {
        // Create User
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        
        if (name) {
          await updateProfile(user, { displayName: name });
        }

        const accessibilityProfile = {
          primaryDisability: "Mobility / Wheelchair",
          secondaryNeeds: ["Step-Free Access", "Accessible Washroom"],
          preferredLanguage: "English",
          maxWalkingDistance: "Under 200m",
          preferredTransport: "Accessible Cab",
          accommodationRequirements: ["Roll-in Shower"],
          needForGuide: true
        };

        const userDoc = {
          id: user.uid,
          name: name || user.email.split('@')[0],
          email: user.email,
          role: selectedRole,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          udidNumber: udidNumber || "DL042026889912",
          accessibilityProfile,
          createdAt: new Date().toISOString()
        };

        try {
          await setDoc(doc(db, 'userProfiles', user.uid), userDoc, { merge: true });
        } catch (dbErr) {
          console.warn('[Firestore] Profile write error:', dbErr);
        }

        setCurrentUser(userDoc);
        setUserProfile(accessibilityProfile);
        addToast(`Account created! Welcome to Saarthi, ${userDoc.name}.`, 'success');
        navigateTo('profile-setup');
      } else {
        // Sign In
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        const userDoc = {
          id: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          role: selectedRole,
          avatar: user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
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

        setCurrentUser(userDoc);
        addToast(`Signed in successfully as ${userDoc.name}!`, 'success');
        
        if (selectedRole === 'admin') {
          navigateTo('admin-dashboard');
        } else if (selectedRole === 'guide') {
          try {
            const appDoc = await getDoc(doc(db, 'guideApplications', user.uid));
            if (appDoc.exists() && appDoc.data()?.status === 'verified') {
              setGuideApplicationStatus('verified');
              navigateTo('guide-dashboard');
            } else {
              const status = appDoc.exists() ? appDoc.data()?.status : 'not_applied';
              setGuideApplicationStatus(status);
              navigateTo('guide-application');
            }
          } catch (e) {
            navigateTo('guide-application');
          }
        } else {
          navigateTo('dashboard');
        }
      }
    } catch (err) {
      console.error('Auth Error:', err);
      let message = err.message;
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password. Please check your credentials or switch to Sign Up.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Please switch to Sign In.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Left Col: Info / Branding */}
        <div className="md:col-span-5 bg-gradient-to-br from-saarthi-700 to-slate-900 text-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight">Saarthi</span>
            </div>
            <h2 className="text-2xl font-black mb-3 leading-snug">
              Accessible Tourism For Everyone
            </h2>
            <p className="text-xs text-saarthi-200 leading-relaxed mb-6">
              Sign in to receive personalized step-free routes, certified guide matches, and Sugamya Bharat monument support.
            </p>

            {/* Quick Demo Logins for SIH Jury */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2.5 shadow-sm">
              <p className="text-xs font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                SIH Jury 1-Click Fast Demo Login
              </p>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => switchPersona('tourist_wheelchair')}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors flex items-center justify-between"
                >
                  <span>🦽 <strong>Aarav Sharma</strong> (Wheelchair Tourist)</span>
                  <ArrowRight className="w-3 h-3 text-saarthi-200" />
                </button>
                <button
                  type="button"
                  onClick={() => switchPersona('tourist_blind')}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors flex items-center justify-between"
                >
                  <span>🦯 <strong>Priya Sundaram</strong> (Blind Traveler)</span>
                  <ArrowRight className="w-3 h-3 text-saarthi-200" />
                </button>
                <button
                  type="button"
                  onClick={() => switchPersona('guide_vikram')}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors flex items-center justify-between"
                >
                  <span>🤟 <strong>Vikram Singh</strong> (Certified Guide)</span>
                  <ArrowRight className="w-3 h-3 text-saarthi-200" />
                </button>
                <button
                  type="button"
                  onClick={() => switchPersona('admin_sharma')}
                  className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors flex items-center justify-between"
                >
                  <span>🛡️ <strong>Dr. Sharma</strong> (Admin Portal)</span>
                  <ArrowRight className="w-3 h-3 text-saarthi-200" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 text-[11px] text-saarthi-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Cloud Authentication & Firestore Connected
          </div>
        </div>

        {/* Right Col: Interactive Form */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
            <button
              onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                authMode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Role Selector */}
          <div className="mb-4">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Select Profile Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('tourist')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'tourist'
                    ? 'border-saarthi-600 bg-saarthi-50 text-saarthi-700 shadow-sm ring-1 ring-saarthi-500/20'
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
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20'
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
                    ? 'border-amber-600 bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin / Gov</span>
              </button>
            </div>

            {selectedRole === 'admin' && (
              <div className="mt-2.5 p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2 animate-in fade-in">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Restricted Role:</span> Only pre-authorized Ministry of Tourism & ASI administrator accounts are permitted. Unlisted emails will show an unauthorized error.
                </div>
              </div>
            )}
          </div>

          {/* Google Sign-In Quick Action */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center mb-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400">or with email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
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
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
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
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
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
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
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
              disabled={loading}
              className="w-full py-3 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{authMode === 'login' ? `Sign In as ${selectedRole.toUpperCase()}` : 'Create Account & Setup Profile'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
