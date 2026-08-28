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
import { 
  speakText, 
  stopSpeaking,
  UI_TRANSLATIONS, 
  getGoogleTransCookie, 
  changeGoogleLanguage, 
  SUPPORTED_LANGUAGES 
} from '../services/translationService';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  firebaseSignOut, 
  collection, 
  getDocs, 
  setDoc, 
  addDoc, 
  doc, 
  updateDoc, 
  getDoc,
  isFirebaseConfigured 
} from '../config/firebase';
import { seedFirestoreIfEmpty } from '../services/seedService';

const AppContext = createContext();

// Load saved accessibility preferences from localStorage
const getSavedA11yPrefs = () => {
  try {
    const saved = localStorage.getItem('saarthi_a11y_prefs');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // fallback
  }
  return {};
};

export function AppProvider({ children }) {
  const initialA11y = getSavedA11yPrefs();
  const initialLang = getGoogleTransCookie() || initialA11y.activeLanguage || 'en';

  // Authentication & Active Persona
  const [currentUser, setCurrentUser] = useState(DEMO_PERSONAS.tourist_wheelchair);
  const [userProfile, setUserProfile] = useState(DEMO_PERSONAS.tourist_wheelchair.accessibilityProfile);
  const [isLiveAuth, setIsLiveAuth] = useState(false);
  
  // Navigation
  const [currentView, setCurrentView] = useState('landing');
  const [selectedDestination, setSelectedDestination] = useState(INITIAL_DESTINATIONS[0]);
  const [isSelectingDestinationForRoute, setIsSelectingDestinationForRoute] = useState(false);
  const [navigatingToEntrance, setNavigatingToEntrance] = useState(null);
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState(null);
  const [selectedHotelForBooking, setSelectedHotelForBooking] = useState(null);

  // Accessibility UI Preferences
  const [highContrast, setHighContrast] = useState(initialA11y.highContrast ?? false);
  const [textSize, setTextSize] = useState(initialA11y.textSize || 'base'); // 'sm', 'base', 'lg', 'xl'
  const [dyslexicFont, setDyslexicFont] = useState(initialA11y.dyslexicFont ?? false);
  const [screenReaderVoice, setScreenReaderVoice] = useState(initialA11y.screenReaderVoice ?? false);
  const [activeLanguage, setActiveLanguage] = useState(initialLang);

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
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  // Guide Verification System
  // 'not_applied' | 'pending_review' | 'verified' | 'rejected'
  const [guideApplicationStatus, setGuideApplicationStatus] = useState('not_applied');
  const [guideRejectionReason, setGuideRejectionReason] = useState(null);
  const [pendingGuideApplications, setPendingGuideApplications] = useState([]);

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

  // 1. Firebase Auth Listener
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLiveAuth(true);
        try {
          const profileDoc = await getDoc(doc(db, 'userProfiles', user.uid));
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            setCurrentUser(data);
            if (data.accessibilityProfile) {
              setUserProfile(data.accessibilityProfile);
            }
            if (data.role === 'guide') {
              try {
                const appDoc = await getDoc(doc(db, 'guideApplications', user.uid));
                if (appDoc.exists()) {
                  const appData = appDoc.data();
                  setGuideApplicationStatus(appData.status || 'not_applied');
                  if (appData.rejectionReason) {
                    setGuideRejectionReason(appData.rejectionReason);
                  }
                } else {
                  setGuideApplicationStatus('not_applied');
                }
              } catch (appErr) {
                console.warn('[Guide Application Fetch Warning]', appErr);
              }
            }
          } else {
            const newUserData = {
              id: user.uid,
              name: user.displayName || user.email?.split('@')[0] || "Traveler",
              email: user.email,
              role: 'tourist',
              avatar: user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
              udidNumber: "DL042026889912",
              accessibilityProfile: DEMO_PERSONAS.tourist_wheelchair.accessibilityProfile
            };
            setCurrentUser(newUserData);
            setUserProfile(newUserData.accessibilityProfile);
          }
        } catch (e) {
          console.warn('[Auth Profile Fetch]', e);
        }
      } else {
        setIsLiveAuth(false);
        setGuideApplicationStatus('not_applied');
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Load Firestore Cloud Database & Seed if empty
  useEffect(() => {
    async function loadCloudDatabase() {
      if (!isFirebaseConfigured()) return;

      try {
        // Auto-seed if empty
        await seedFirestoreIfEmpty();

        // Fetch Destinations
        const destSnap = await getDocs(collection(db, 'destinations'));
        if (!destSnap.empty) {
          const destList = destSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setDestinations(destList);
          setSelectedDestination(destList[0]);
        }

        // Fetch Hotels
        const hotelsSnap = await getDocs(collection(db, 'hotels'));
        if (!hotelsSnap.empty) {
          setHotels(hotelsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }

        // Fetch Guides
        const guidesSnap = await getDocs(collection(db, 'guides'));
        if (!guidesSnap.empty) {
          setGuides(guidesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }

        // Fetch Community Reports
        const reportsSnap = await getDocs(collection(db, 'communityReports'));
        if (!reportsSnap.empty) {
          setCommunityReports(reportsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }

        // Fetch Bookings
        const bookingsSnap = await getDocs(collection(db, 'bookings'));
        if (!bookingsSnap.empty) {
          setBookings(bookingsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }

        setIsDbLoaded(true);
        console.log('[Firestore] Successfully synced cloud collections.');
      } catch (err) {
        console.warn('[Firestore Sync Fallback] Using local seed data:', err.message);
      }
    }

    loadCloudDatabase();
  }, []);

  // 3. Handle High Contrast, Text Size & Dyslexic Font classes on <html> + localStorage persistence
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

    try {
      localStorage.setItem('saarthi_a11y_prefs', JSON.stringify({
        highContrast,
        textSize,
        dyslexicFont,
        screenReaderVoice,
        activeLanguage
      }));
    } catch (e) {
      // ignore
    }
  }, [highContrast, textSize, dyslexicFont, screenReaderVoice, activeLanguage]);

  // 4. Global Hover & Focus Speech Narration when screenReaderVoice is active
  useEffect(() => {
    if (!screenReaderVoice) return;

    let lastSpokenText = '';
    const handleElementHover = (e) => {
      const target = e.target.closest('button, a, [role="button"], [role="tab"], h1, h2, h3, [data-narrate]');
      if (!target) return;

      const narrationText = target.getAttribute('data-narrate') ||
                            target.getAttribute('aria-label') ||
                            target.getAttribute('title') ||
                            target.innerText;

      if (narrationText && narrationText.trim() && narrationText !== lastSpokenText) {
        lastSpokenText = narrationText;
        const voiceCode = SUPPORTED_LANGUAGES.find(l => l.code === activeLanguage)?.voiceCode || 'en-IN';
        speakText(narrationText.slice(0, 140), voiceCode, true);
      }
    };

    document.addEventListener('mouseover', handleElementHover, { passive: true });
    document.addEventListener('focusin', handleElementHover, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('focusin', handleElementHover);
    };
  }, [screenReaderVoice, activeLanguage]);

  // Sign out
  const signOutUser = async () => {
    try {
      if (isFirebaseConfigured()) {
        await firebaseSignOut(auth);
      }
      setIsLiveAuth(false);
      setCurrentUser(DEMO_PERSONAS.tourist_wheelchair);
      setUserProfile(DEMO_PERSONAS.tourist_wheelchair.accessibilityProfile);
      addToast("Signed out successfully. Switched to demo mode.", "info");
      navigateTo('landing');
    } catch (e) {
      console.error('Sign out error:', e);
    }
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
        // Vikram Singh demo persona is pre-verified — no onboarding required
        if (persona.isVerified) {
          setGuideApplicationStatus('verified');
        }
        setCurrentView('guide-dashboard');
      } else {
        setCurrentView('dashboard');
      }
    }
  };

  // Guide Verification: Submit application (guide fills form)
  const submitGuideApplication = async (formData) => {
    const applicationDoc = {
      uid: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      ...formData,
      status: 'pending_review',
      appliedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null
    };

    setGuideApplicationStatus('pending_review');
    setGuideRejectionReason(null);

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'guideApplications', currentUser.id), applicationDoc);
      } catch (err) {
        console.warn('[Firestore] Error saving guide application:', err);
      }
    }

    // Add to pending list for admin view
    setPendingGuideApplications(prev => [
      ...prev.filter(a => a.uid !== currentUser.id),
      applicationDoc
    ]);

    addToast('Your guide application has been submitted for review!', 'success');
  };

  // Guide Verification: Admin loads all pending applications
  const loadGuideApplications = async () => {
    // Demo seed: always have at least one pending application visible for admins
    const demoApplication = {
      uid: 'demo-pending-guide-1',
      name: 'Farhan Qureshi',
      email: 'farhan.qureshi@example.com',
      phone: '+91-98101-44455',
      city: 'Delhi / Agra',
      specializations: ['Wheelchair Mobility', 'Sign Language Basics'],
      languages: ['English', 'Hindi', 'Basic ISL'],
      licenseNumber: 'ASI-Lic-8812 (Submitted)',
      experienceYears: 3,
      bio: 'Three years of experience escorting PwD travelers through the Agra and Delhi heritage circuit. Completed Sugamya Bharat sensitivity training.',
      status: 'pending_review',
      appliedAt: '2026-08-27T10:00:00.000Z',
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
      certificateBase64: null
    };

    if (isFirebaseConfigured()) {
      try {
        const snap = await getDocs(collection(db, 'guideApplications'));
        const applications = snap.docs
          .map(d => ({ uid: d.id, ...d.data() }))
          .filter(a => a.status === 'pending_review');
        // Merge demo application if no real ones exist
        setPendingGuideApplications(
          applications.length > 0 ? applications : [demoApplication]
        );
        return;
      } catch (err) {
        console.warn('[Firestore] Error loading guide applications:', err);
      }
    }
    // Fallback: use demo application
    setPendingGuideApplications(prev =>
      prev.length > 0 ? prev : [demoApplication]
    );
  };

  // Guide Verification: Admin approves an application
  const approveGuideApplication = async (uid, applicationData) => {
    setPendingGuideApplications(prev => prev.filter(a => a.uid !== uid));

    if (isFirebaseConfigured()) {
      try {
        // Update application status
        await setDoc(doc(db, 'guideApplications', uid), {
          status: 'verified',
          reviewedAt: new Date().toISOString(),
          reviewedBy: currentUser.name
        }, { merge: true });

        // Add guide to the public guides collection
        const guideProfile = {
          id: uid,
          name: applicationData.name,
          city: applicationData.city,
          specializations: applicationData.specializations || [],
          languages: applicationData.languages || ['English', 'Hindi'],
          certifications: [`License: ${applicationData.licenseNumber}`],
          experienceYears: applicationData.experienceYears || 0,
          rating: 0,
          reviewsCount: 0,
          hourlyRate: '₹400 / hr',
          dayRate: '₹2,500 / day',
          isVerified: true,
          verificationBadge: 'Saarthi Verified Guide',
          bio: applicationData.bio || '',
          phone: applicationData.phone || '',
          availability: 'Available Today',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
        };
        await setDoc(doc(db, 'guides', uid), guideProfile);
      } catch (err) {
        console.warn('[Firestore] Error approving guide:', err);
      }
    }

    // If this is the currently logged-in guide, update their status
    if (currentUser.id === uid) {
      setGuideApplicationStatus('verified');
    }

    addToast('Guide application approved! Saarthi Verified badge issued.', 'success');
  };

  // Guide Verification: Admin rejects an application with reason
  const rejectGuideApplication = async (uid, reason) => {
    setPendingGuideApplications(prev => prev.filter(a => a.uid !== uid));

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'guideApplications', uid), {
          status: 'rejected',
          rejectionReason: reason,
          reviewedAt: new Date().toISOString(),
          reviewedBy: currentUser.name
        }, { merge: true });
      } catch (err) {
        console.warn('[Firestore] Error rejecting guide:', err);
      }
    }

    // If this is the currently logged-in guide, update their status
    if (currentUser.id === uid) {
      setGuideApplicationStatus('rejected');
      setGuideRejectionReason(reason);
    }

    addToast('Guide application rejected. Feedback sent to applicant.', 'info');
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

  // Community Map: Add new report with Firestore sync
  const addCommunityReport = async (report) => {
    const newReport = {
      id: `rep-${Date.now()}`,
      ...report,
      date: new Date().toISOString().split('T')[0],
      confirmCount: 1,
      disputeCount: 0,
      status: "Community Verified"
    };

    setCommunityReports(prev => [newReport, ...prev]);

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'communityReports', newReport.id), newReport);
      } catch (err) {
        console.warn('[Firestore] Error saving community report:', err);
      }
    }

    addToast("Accessibility report saved to Cloud Firestore and community map!", "success");
  };

  // Community Map: Confirm / Dispute report
  const voteReport = async (reportId, voteType) => {
    let updatedReport = null;
    setCommunityReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        const item = {
          ...rep,
          confirmCount: voteType === 'confirm' ? rep.confirmCount + 1 : rep.confirmCount,
          disputeCount: voteType === 'dispute' ? rep.disputeCount + 1 : rep.disputeCount
        };
        updatedReport = item;
        return item;
      }
      return rep;
    }));

    if (isFirebaseConfigured() && updatedReport) {
      try {
        await setDoc(doc(db, 'communityReports', reportId), updatedReport, { merge: true });
      } catch (err) {
        console.warn('[Firestore] Error updating vote:', err);
      }
    }

    addToast(`Thank you! Your ${voteType} vote helps keep map data accurate.`, "success");
  };

  // Guide Booking: Create new request with Firestore sync
  const createBooking = async (bookingData) => {
    const newBooking = {
      id: `book-${Date.now()}`,
      ...bookingData,
      createdAt: new Date().toISOString(),
      status: "Pending Guide Confirmation"
    };

    setBookings(prev => [newBooking, ...prev]);

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'bookings', newBooking.id), newBooking);
      } catch (err) {
        console.warn('[Firestore] Error saving booking:', err);
      }
    }

    addToast("Guide booking request submitted! Saved to Cloud Database.", "success");
  };

  // Guide Booking: Accept / Reject (for guide dashboard)
  const updateBookingStatus = async (bookingId, status) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));

    if (isFirebaseConfigured()) {
      try {
        await updateDoc(doc(db, 'bookings', bookingId), { status });
      } catch (err) {
        console.warn('[Firestore] Error updating booking:', err);
      }
    }

    addToast(`Booking #${bookingId} marked as ${status}.`, "success");
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
      isLiveAuth,
      signOutUser,
      currentView,
      navigateTo,
      selectedDestination,
      setSelectedDestination,
      isSelectingDestinationForRoute,
      setIsSelectingDestinationForRoute,
      navigatingToEntrance,
      setNavigatingToEntrance,
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
      setIsSosModalOpen,
      isDbLoaded,
      guideApplicationStatus,
      setGuideApplicationStatus,
      guideRejectionReason,
      pendingGuideApplications,
      setPendingGuideApplications,
      submitGuideApplication,
      loadGuideApplications,
      approveGuideApplication,
      rejectGuideApplication
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
