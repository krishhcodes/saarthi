import React, { useState } from 'react';
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
  User, 
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { DEMO_PERSONAS } from '../../data/seedData';

export default function Header() {
  const { 
    currentView, 
    navigateTo, 
    currentUser, 
    switchPersona, 
    cart, 
    isAiChatOpen, 
    setIsAiChatOpen,
    setIsSosModalOpen,
    t
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'route-planner', label: 'Step-Free Routes', icon: Navigation },
    { id: 'hotels', label: 'Accessible Stays', icon: Hotel },
    { id: 'guides', label: 'Specialized Guides', icon: Users },
    { id: 'gov-services', label: 'Gov Schemes', icon: Building2 },
    { id: 'community-map', label: 'Community Map', icon: Map },
    { id: 'ai-verify', label: 'AI Scanner', icon: Sparkles },
    { id: 'journey-score', label: 'Journey Score', icon: Gauge },
    { id: 'store', label: 'Travel Store', icon: ShoppingBag, badge: cart.length },
    { id: 'trip-planner', label: 'Trip Planner', icon: Calendar }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-[33px] z-40 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('landing')} 
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              aria-label="Saarthi Home Page"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saarthi-600 to-sky-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  Saarthi
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-saarthi-100 text-saarthi-700 border border-saarthi-200">
                    SIH 2026
                  </span>
                </span>
                <p className="text-[11px] font-medium text-slate-500 -mt-1 hidden sm:block">
                  Accessible Tourism Navigator
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-saarthi-50 text-saarthi-700 font-bold border border-saarthi-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-saarthi-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-saarthi-600 text-white text-[10px] rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* SOS Emergency Button */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-transform active:scale-95 animate-pulse"
              title="Trigger 24x7 Emergency Help (112 / Ambulance)"
              aria-label="Emergency SOS button"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            {/* AI Assistant Chatbot Button */}
            <button
              onClick={() => setIsAiChatOpen(!isAiChatOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isAiChatOpen
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-300'
              }`}
              title="Open Saarthi AI Travel Assistant"
            >
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span className="hidden md:inline">AI Guide</span>
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                title="Switch Demo Persona"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-300"
                />
                <span className="hidden lg:inline max-w-[90px] truncate">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Demo Personas (SIH Jury)</p>
                    <p className="text-xs text-slate-600 mt-0.5">Switch role to test full user experience</p>
                  </div>
                  
                  <div className="p-1 space-y-1">
                    <button
                      onClick={() => {
                        switchPersona('tourist_wheelchair');
                        setIsPersonaMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        currentUser.id === 'user-aarav' ? 'bg-saarthi-50 text-saarthi-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={DEMO_PERSONAS.tourist_wheelchair.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <div>
                          <p className="font-semibold text-slate-900">Aarav Sharma</p>
                          <p className="text-[10px] text-slate-500">Wheelchair Traveler (UDID)</p>
                        </div>
                      </div>
                      {currentUser.id === 'user-aarav' && <CheckCircle2 className="w-4 h-4 text-saarthi-600" />}
                    </button>

                    <button
                      onClick={() => {
                        switchPersona('tourist_blind');
                        setIsPersonaMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        currentUser.id === 'user-priya' ? 'bg-saarthi-50 text-saarthi-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={DEMO_PERSONAS.tourist_blind.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <div>
                          <p className="font-semibold text-slate-900">Priya Sundaram</p>
                          <p className="text-[10px] text-slate-500">Blind Traveler (Audio Tours)</p>
                        </div>
                      </div>
                      {currentUser.id === 'user-priya' && <CheckCircle2 className="w-4 h-4 text-saarthi-600" />}
                    </button>

                    <button
                      onClick={() => {
                        switchPersona('guide_vikram');
                        setIsPersonaMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        currentUser.role === 'guide' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={DEMO_PERSONAS.guide_vikram.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <div>
                          <p className="font-semibold text-slate-900">Vikram Singh</p>
                          <p className="text-[10px] text-emerald-600 font-medium">Certified Specialist Guide</p>
                        </div>
                      </div>
                      {currentUser.role === 'guide' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>

                    <button
                      onClick={() => {
                        switchPersona('admin_sharma');
                        setIsPersonaMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        currentUser.role === 'admin' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={DEMO_PERSONAS.admin_sharma.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <div>
                          <p className="font-semibold text-slate-900">Dr. Alok Sharma</p>
                          <p className="text-[10px] text-amber-700 font-medium">System / Gov Admin</p>
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
                      View Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('auth');
                        setIsPersonaMenuOpen(false);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-saarthi-100 text-saarthi-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-saarthi-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 bg-saarthi-600 text-white text-xs rounded-full font-bold">
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
