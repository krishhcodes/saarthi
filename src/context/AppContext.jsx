import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_DESTINATIONS,
  INITIAL_HOTELS,
  INITIAL_GUIDES,
  INITIAL_REPORTS,
  INITIAL_GOV_SERVICES,
  INITIAL_PRODUCTS,
  DEMO_PERSONAS,
  MOCK_ROUTES
} from '../data/seedData';
import { speakText, UI_TRANSLATIONS } from '../services/translationService';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Authentication & Active Persona
  const [currentUser, setCurrentUser] = useState(DEMO_PERSONAS.tourist_wheelchair);
  const [userProfile, setUserProfile] = useState(DEMO_PERSONAS.tourist_wheelchair.accessibilityProfile);
  
  // Navigation
  const [currentView, setCurrentView] = useState('landing');
  const [selectedDestination, setSelectedDestination] = useState(INITIAL_DESTINATIONS[0]);
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState(null);
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState(null);

  // Accessibility UI Preferences
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState('base'); // 'sm', 'base', 'lg', 'xl'
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [screenReaderVoice, setScreenReaderVoice] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('en');

  // Modals & Drawers
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Dynamic Data Stores
  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);
  const [hotels, setHotels] = useState(INITIAL_HOTELS);
  const [guides, setGuides] = useState(INITIAL_GUIDES);
  const [communityReports, setCommunityReports] = useState(INITIAL_REPORTS);
  const [govServices, setGovServices] = useState(INITIAL_GOV_SERVICES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Active Trip Planner State
  const [currentTrip, setCurrentTrip] = useState({
    id: "trip-agra-delhi-1",
    title: "Golden Triangle Accessible Heritage Tour",
    city: "Agra & Delhi",
    startDate: "2026-03-10",
    endDate: "2026-03-12",
    destinations: [INITIAL_DESTINATIONS[0], INITIAL_DESTINATIONS[1]], // Taj Mahal + Qutub Minar
    hotel: INITIAL_HOTELS[0], // The Oberoi Amarvilas
    guide: INITIAL_GUIDES[0], // Vikram Singh
    route: MOCK_ROUTES[0], // Step-Free Route
    transportMode: "Electric Golf Cart + Low-Floor Cab",
    services: [INITIAL_GOV_SERVICES[0]], // Sugamya Bharat
    scores: {
      route: 96,
      transport: 92,
      stay: 96,
      destination: 93,
      services: 90,
      overall: 93
    }
  });

  // Guide Bookings
  const [bookings, setBookings] = useState([
    {
      id: "book-101",
      guideId: "guide-1",
      guideName: "Vikram Singh",
      userName: "Aarav Sharma",
      userDisability: "Wheelchair / Mobility",
      destination: "Taj Mahal Complex",
      date: "2026-03-10",
      time: "08:00 AM",
      hours: 4,
      totalAmount: "₹1,800",
      status: "Confirmed",
      specialRequests: "Needs golf shuttle coordination and ramp guidance at mausoleum."
    }
  ]);

  // E-Commerce Cart
  const [cart, setCart] = useState([
    { ...INITIAL_PRODUCTS[0], quantity: 1 } // Foldable Travel Ramp
  ]);

  // Handle High Contrast & Text Size classes on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    root.classList.remove('text-size-sm', 'text-size-base', 'text-size-lg', 'text-size-xl');
    root.classList.add(`text-size-${textSize}`);

    if (dyslexicFont) {
      root.classList.add('font-opendyslexic');
    } else {
      root.classList.remove('font-opendyslexic');
    }
  }, [highContrast, textSize, dyslexicFont]);

  // Toast Helper
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    if (screenReaderVoice) {
      speakText(message, activeLanguage === 'hi' ? 'hi-IN' : 'en-IN');
    }
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Switch Active Demo Persona
  const switchPersona = (personaKey) => {
    const persona = DEMO_PERSONAS[personaKey];
    if (persona) {
      setCurrentUser(persona);
      if (persona.accessibilityProfile) {
        setUserProfile(persona.accessibilityProfile);
      }
      addToast(`Switched to demo profile: ${persona.name} (${persona.role.toUpperCase()})`, 'success');
      if (persona.role === 'admin') {
        setCurrentView('admin-dashboard');
      } else if (persona.role === 'guide') {
        setCurrentView('guide-dashboard');
      } else {
        setCurrentView('dashboard');
      }
    }
  };

  // Switch View with optional Voice Announcement
  const navigateTo = (view, payload = null) => {
    if (payload && payload.destination) {
      setSelectedDestination(payload.destination);
    }
    if (payload && payload.guide) {
      setSelectedGuideForBooking(payload.guide);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (screenReaderVoice) {
      const titles = {
        'dashboard': 'Personalized Home Dashboard',
        'destinations': 'Accessible Destinations Catalog',
        'destination-detail': `Destination Details for ${selectedDestination?.name || 'Selected Monument'}`,
        'route-planner': 'Accessible Step-Free Route Planner',
        'hotels': 'Accessible Stays and Hotels',
        'guides': 'Specialized Guide Matching Marketplace',
        'gov-services': 'Government and Local Support Services',
        'ai-verify': 'AI Visual Accessibility Verification',
        'community-map': 'Community-Powered Accessibility Map',
        'journey-score': 'Accessibility Journey Score Calculator',
        'store': 'Accessible Travel Store',
        'trip-planner': 'My Accessible Trip Planner',
        'profile': 'User Profile and Contribution History'
      };
      if (titles[view]) {
        speakText(titles[view], activeLanguage === 'hi' ? 'hi-IN' : 'en-IN');
      }
    }
  };

  // Community Map: Add new report
  const addCommunityReport = (report) => {
    const newReport = {
      id: `rep-${Date.now()}`,
      ...report,
      date: new Date().toISOString().split('T')[0],
      confirmCount: 1,
      disputeCount: 0,
      status: "Community Verified"
    };
    setCommunityReports(prev => [newReport, ...prev]);
    addToast("Accessibility report submitted successfully to the community map!", "success");
  };

  // Community Map: Confirm / Dispute report
  const voteReport = (reportId, voteType) => {
    setCommunityReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        if (voteType === 'confirm') {
          return { ...rep, confirmCount: rep.confirmCount + 1 };
        } else if (voteType === 'dispute') {
          return { ...rep, disputeCount: rep.disputeCount + 1 };
        }
      }
      return rep;
    }));
    addToast(`Thank you! Your ${voteType} vote helps keep map data accurate.`, "success");
  };

  // Guide Booking: Create new request
  const createBooking = (bookingData) => {
    const newBooking = {
      id: `book-${Date.now()}`,
      ...bookingData,
      status: "Pending Guide Confirmation"
    };
    setBookings(prev => [newBooking, ...prev]);
    addToast("Guide booking request submitted! Guide will review shortly.", "success");
  };

  // Guide Booking: Accept / Reject (for guide dashboard)
  const updateBookingStatus = (bookingId, status) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    addToast(`Booking #${bookingId} has been marked as ${status}.`, "success");
  };

  // Store: Cart actions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    addToast(`Added "${product.name}" to your cart!`, "success");
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    addToast("Item removed from cart.", "info");
  };

  // Recalculate dynamic Journey Score based on trip selections
  const recalculateJourneyScore = (updatedTrip) => {
    const routeScore = updatedTrip.route?.accessibilityScore || 85;
    const destScore = updatedTrip.destinations.length > 0 
      ? Math.round(updatedTrip.destinations.reduce((acc, d) => acc + d.accessibilityScore, 0) / updatedTrip.destinations.length)
      : 80;
    const stayScore = updatedTrip.hotel?.accessibilityScore || 88;
    const guideBonus = updatedTrip.guide?.isVerified ? 95 : 75;
    const transportScore = 90;

    const overall = Math.round(
      (routeScore * 0.25) +
      (transportScore * 0.20) +
      (stayScore * 0.25) +
      (destScore * 0.20) +
      (guideBonus * 0.10)
    );

    return {
      route: routeScore,
      transport: transportScore,
      stay: stayScore,
      destination: destScore,
      services: guideBonus,
      overall
    };
  };

  // Update Trip
  const updateTrip = (newTripData) => {
    const updated = { ...currentTrip, ...newTripData };
    updated.scores = recalculateJourneyScore(updated);
    setCurrentTrip(updated);
    addToast("Trip itinerary and Accessibility Journey Score updated!", "success");
  };

  // Translation helper
  const t = (key) => {
    const langDict = UI_TRANSLATIONS[activeLanguage] || UI_TRANSLATIONS.en;
    return langDict[key] || UI_TRANSLATIONS.en[key] || key;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      userProfile,
      setUserProfile,
      currentView,
      navigateTo,
      selectedDestination,
      setSelectedDestination,
      selectedGuideForBooking,
      setSelectedGuideForBooking,
      selectedHotelForBooking,
      setSelectedHotelForBooking,
      highContrast,
      setHighContrast,
      textSize,
      setTextSize,
      dyslexicFont,
      setDyslexicFont,
      screenReaderVoice,
      setScreenReaderVoice,
      activeLanguage,
      setActiveLanguage,
      t,
      destinations,
      setDestinations,
      hotels,
      setHotels,
      guides,
      setGuides,
      communityReports,
      setCommunityReports,
      govServices,
      setGovServices,
      products,
      setProducts,
      currentTrip,
      setCurrentTrip,
      updateTrip,
      bookings,
      setBookings,
      createBooking,
      updateBookingStatus,
      cart,
      addToCart,
      removeFromCart,
      addCommunityReport,
      voteReport,
      switchPersona,
      toasts,
      addToast,
      isAiChatOpen,
      setIsAiChatOpen,
      isVoiceModalOpen,
      setIsVoiceModalOpen,
      isSosModalOpen,
      setIsSosModalOpen
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
