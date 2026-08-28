import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Hotel, 
  Users, 
  Building2, 
  Sparkles, 
  Map, 
  Gauge, 
  ShoppingBag, 
  Calendar, 
  ShieldAlert, 
  MessageSquare, 
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  Lock,
  LogIn,
  Layers,
  UserCheck,
  MapPinCheck,
  ShieldCheck
} from 'lucide-react';
import { DEMO_PERSONAS } from '../../data/seedData';

export default function Header() {
  const { 
    currentView, 
    navigateTo, 
    currentUser, 
    isLiveAuth,
    switchPersona, 
    signOutUser,
    cart, 
    isAiChatOpen, 
    setIsAiChatOpen,
    setIsSosModalOpen,
    t,
    guideApplicationStatus
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const moreMenuRef = useRef(null);
  const personaMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
      if (personaMenuRef.current && !personaMenuRef.current.contains(event.target)) {
        setIsPersonaMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userRole = currentUser?.role || 'tourist';
  const isVerifiedGuide = userRole === 'guide' && guideApplicationStatus === 'verified';

  // ── Tourist Navigation (Laser-focused on PS 49) ─────────────────────────
  const touristPrimaryNav = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'destinations', label: 'Attractions', icon: MapPin },
    { id: 'route-planner', label: 'Route Navigator', icon: Navigation },
    { id: 'places', label: 'Places Check', icon: MapPinCheck },
    { id: 'guides', label: 'Guides', icon: Users }
  ];
  const touristSecondaryNav = [
    { id: 'community-map', label: 'Ground Reports', icon: ShieldCheck, desc: 'Crowdsourced obstacle & ramp reports' },
    { id: 'ai-verify', label: 'AI Vision Scanner', icon: Sparkles, desc: 'Gemini visual ramp verification' },
    { id: 'gov-services', label: 'Gov Schemes & UDID', icon: Building2, desc: 'Sugamya Bharat, IRCTC concessions' }
  ];

  // ── Guide Navigation ────────────────────────────────────────────────────
  const guidePrimaryNav = isVerifiedGuide ? [
    { id: 'guide-dashboard', label: 'Guide Dashboard', icon: Compass },
    { id: 'community-map', label: 'Ground Reports', icon: ShieldCheck },
  ] : [
    { id: 'guide-dashboard', label: 'Guide Portal', icon: ShieldCheck }
  ];
  const guideSecondaryNav = isVerifiedGuide ? [
    { id: 'ai-verify', label: 'AI Vision Scanner', icon: Sparkles, desc: 'Verify monument accessibility' },
    { id: 'gov-services', label: 'Gov Schemes', icon: Building2, desc: 'MOT resources & guide benefits' },
  ] : [];

  // ── Admin Navigation ────────────────────────────────────────────────────
  const adminPrimaryNav = [
    { id: 'admin-dashboard', label: 'Admin Portal', icon: ShieldCheck },
    { id: 'community-map', label: 'Ground Reports', icon: ShieldCheck },
    { id: 'destinations', label: 'Attractions', icon: MapPin },
  ];
  const adminSecondaryNav = [
    { id: 'gov-services', label: 'Gov Services', icon: Building2, desc: 'Sugamya Bharat policy management' },
    { id: 'ai-verify', label: 'AI Vision Scanner', icon: Sparkles, desc: 'Validate monument AI reports' },
  ];

  // ── Active role-based selection ─────────────────────────────────────────
  const primaryNavItems = userRole === 'admin'
    ? adminPrimaryNav
    : userRole === 'guide'
      ? guidePrimaryNav
      : touristPrimaryNav;

  const secondaryNavItems = userRole === 'admin'
    ? adminSecondaryNav
    : userRole === 'guide'
      ? guideSecondaryNav
      : touristSecondaryNav;

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];
  const isSecondaryActive = secondaryNavItems.some(item => item.id === currentView);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-[33px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-15 py-2 gap-2">
          
          {/* 1. Brand Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => navigateTo('landing')} 
              className="flex items-center gap-2 text-left group focus:outline-none"
              aria-label="Saarthi Home Page"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-saarthi-600 to-sky-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xl font-black tracking-tight text-slate-900">
                    Saarthi
                  </span>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-saarthi-100 text-saarthi-700 border border-saarthi-200">
                    SIH 2026
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-500 hidden sm:block">
                  Accessible Tourism
                </p>
              </div>
            </button>
          </div>

          {/* 2. Desktop Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-saarthi-50 text-saarthi-700 font-bold border border-saarthi-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-saarthi-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* "More Features" Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSecondaryActive || isMoreMenuOpen
                    ? 'bg-saarthi-50 text-saarthi-700 font-bold border border-saarthi-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>More Features</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Additional Services
                  </div>
                  <div className="space-y-1 mt-1">
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            navigateTo(item.id);
                            setIsMoreMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                            isActive ? 'bg-saarthi-50 text-saarthi-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-saarthi-100 text-saarthi-700 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold truncate">{item.label}</p>
                              {item.badge > 0 && (
                                <span className="px-1.5 py-0.2 bg-saarthi-600 text-white text-[9px] rounded-full font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* 3. Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* SOS Emergency */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all animate-pulse"
              title="24x7 Emergency Help (112 / Ambulance)"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            {/* AI Assistant Chatbot */}
            <button
              onClick={() => setIsAiChatOpen(!isAiChatOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isAiChatOpen
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
              title="Open Saarthi AI Travel Assistant (Powered by Gemini)"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">AI Guide</span>
            </button>

            {/* If NOT Live Auth -> Show Primary "Sign In" Button */}
            {!isLiveAuth && (
              <button
                onClick={() => navigateTo('auth')}
                className="flex items-center gap-1 bg-saarthi-600 hover:bg-saarthi-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
                title="Sign in with Google or Email"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Persona Switcher / User Profile Dropdown */}
            <div className="relative" ref={personaMenuRef}>
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className={`flex items-center gap-1.5 border px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  isLiveAuth 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                }`}
                title={isLiveAuth ? "Account Settings" : "Switch Demo Persona (SIH Jury)"}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-slate-300 shrink-0"
                />
                <span className="hidden md:inline max-w-[80px] truncate text-[11px]">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
              </button>

              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        {isLiveAuth ? "Logged In Account" : "Demo Personas (SIH Jury)"}
                      </p>
                      {isLiveAuth && (
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                          Cloud Auth
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {currentUser.email || "Switch role to test accessibility flows"}
                    </p>
                  </div>
                  
                  {/* Persona Options */}
                  <div className="p-1 space-y-1">
                    <button
                      onClick={() => {
                        switchPersona('tourist_wheelchair');
                        setIsPersonaMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentUser.id === 'user-aarav' ? 'bg-saarthi-50 text-saarthi-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={DEMO_PERSONAS.tourist_wheelchair.avatar} className="w-7 h-7 rounded-full object-cover shrink-0" alt="" />
                        <div>
                          <p className="font-semibold text-slate-900">Aarav Sharma</p>
                          <p className="text-[10px] text-slate-500">Wheelchair Tourist</p>
                        </div>
                      </div>
                      {currentUser.id === 'user-aarav' && <CheckCircle2 className="w-4 h-4 text-saarthi-600" />}
                    </button>

                    <button
                      onClick={() => {
                        switchPersona('tourist_blind');
                        setIsPersonaMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentUser.id === 'user-priya' ? 'bg-saarthi-50 text-saarthi-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={DEMO_PERSONAS.tourist_blind.avatar} className="w-7 h-7 rounded-full object-cover shrink-0" alt="" />
                        <div>
                          <p className="font-semibold text-slate-900">Priya Sundaram</p>
                          <p className="text-[10px] text-slate-500">Blind Traveler</p>
                        </div>
                      </div>
                      {currentUser.id === 'user-priya' && <CheckCircle2 className="w-4 h-4 text-saarthi-600" />}
                    </button>

                    <button
                      onClick={() => {
                        switchPersona('guide_vikram');
                        setIsPersonaMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentUser.role === 'guide' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={DEMO_PERSONAS.guide_vikram.avatar} className="w-7 h-7 rounded-full object-cover shrink-0" alt="" />
                        <div>
                          <p className="font-semibold text-slate-900">Vikram Singh</p>
                          <p className="text-[10px] text-emerald-600 font-medium">Specialized Guide</p>
                        </div>
                      </div>
                      {currentUser.role === 'guide' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>

                    <button
                      onClick={() => {
                        switchPersona('admin_sharma');
                        setIsPersonaMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentUser.role === 'admin' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={DEMO_PERSONAS.admin_sharma.avatar} className="w-7 h-7 rounded-full object-cover shrink-0" alt="" />
                        <div>
                          <p className="font-semibold text-slate-900">Dr. Alok Sharma</p>
                          <p className="text-[10px] text-amber-700 font-medium">Gov / Admin</p>
                        </div>
                      </div>
                      {currentUser.role === 'admin' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </button>
                  </div>

                  <div className="mt-1 pt-2 border-t border-slate-100 px-3 flex justify-between items-center">
                    <button
                      onClick={() => {
                        navigateTo('profile');
                        setIsPersonaMenuOpen(false);
                      }}
                      className="text-xs font-semibold text-saarthi-600 hover:text-saarthi-800"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        signOutUser();
                        setIsPersonaMenuOpen(false);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto">
          {!isLiveAuth && (
            <button
              onClick={() => {
                navigateTo('auth');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 mb-2 bg-saarthi-600 text-white rounded-xl font-bold text-xs shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google / Email</span>
            </button>
          )}

          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-saarthi-50 text-saarthi-800 font-bold border border-saarthi-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-saarthi-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-1.5 py-0.2 bg-saarthi-600 text-white text-[10px] rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
