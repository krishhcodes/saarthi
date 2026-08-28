// Saarthi Multilingual & Speech Assistant Service

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', voiceCode: 'en-IN' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', voiceCode: 'hi-IN' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳', voiceCode: 'bn-IN' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳', voiceCode: 'mr-IN' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', voiceCode: 'ta-IN' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', voiceCode: 'te-IN' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', voiceCode: 'kn-IN' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', voiceCode: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳', voiceCode: 'pa-IN' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', voiceCode: 'ml-IN' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳', voiceCode: 'or-IN' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇮🇳', voiceCode: 'ur-IN' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳', voiceCode: 'as-IN' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', voiceCode: 'es-ES' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', voiceCode: 'fr-FR' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', voiceCode: 'de-DE' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', voiceCode: 'ja-JP' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', voiceCode: 'ar-SA' }
];

export const UI_TRANSLATIONS = {
  en: {
    brand_tagline: "Accessible Tourism Navigator",
    hero_tagline: "Tourism for Everyone.",
    hero_subtext: "Explore the world with dignity, confidence, and equal opportunities.",
    plan_trip_btn: "Plan My Accessible Trip",
    explore_dest_btn: "Explore Destinations",
    good_morning: "Good morning",
    recommended_for_you: "Recommended For You",
    your_journey: "Your Accessible Journey",
    nearby_accessible: "Nearby Accessible Places",
    gov_support: "Government & Local Support",
    available_guides: "Available Specialized Guides",
    journey_score: "Accessibility Journey Score",
    community_map: "Community Accessibility Map",
    ai_verify: "AI Visual Verification",
    store: "Accessible Travel Store",
    filter_city: "Filter by City",
    all_cities: "All 10 Indian Hubs",
    book_guide: "Book Specialized Guide",
    view_details: "View Accessibility Details",
    step_free_route: "Plan Step-Free Route",
    emergency_sos: "Emergency 24x7 SOS",
    contrast_toggle: "High Contrast",
    speech_toggle: "Screen Reader Voice",
    voice_command: "Voice Navigation"
  },
  hi: {
    brand_tagline: "दिव्यांगजनों के लिए सुगम पर्यटन मार्गदर्शक",
    hero_tagline: "सभी के लिए पर्यटन।",
    hero_subtext: "आत्मसम्मान, विश्वास और समान अवसरों के साथ दुनिया का भ्रमण करें।",
    plan_trip_btn: "मेरी सुगम यात्रा की योजना बनाएं",
    explore_dest_btn: "गंतव्य स्थल देखें",
    good_morning: "शुभ प्रभात",
    recommended_for_you: "आपके लिए अनुशंसित",
    your_journey: "आपकी सुगम यात्रा",
    nearby_accessible: "आस-पास के सुगम स्थल",
    gov_support: "सरकारी एवं स्थानीय सहायता",
    available_guides: "उपलब्ध विशेष गाइड",
    journey_score: "सुगम यात्रा स्कोर",
    community_map: "समुदाय सुगम्यता मानचित्र",
    ai_verify: "एआई दृश्य सत्यापन",
    store: "सुगम यात्रा स्टोर",
    filter_city: "शहर द्वारा चुनें",
    all_cities: "सभी 10 भारतीय शहर",
    book_guide: "विशेष गाइड बुक करें",
    view_details: "सुगम्यता विवरण देखें",
    step_free_route: "सीढ़ी-मुक्त मार्ग खोजें",
    emergency_sos: "आपातकालीन 24x7 एसओएस",
    contrast_toggle: "उच्च कंट्रास्ट",
    speech_toggle: "स्क्रीन रीडर आवाज",
    voice_command: "ध्वनि नेविगेशन"
  }
};

/**
 * Get the current googtrans cookie value (e.g., '/auto/hi' -> 'hi')
 */
export function getGoogleTransCookie() {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  if (match && match[1]) {
    const parts = decodeURIComponent(match[1]).split('/');
    return parts[parts.length - 1] || 'en';
  }
  return 'en';
}

/**
 * Set the googtrans cookie for seamless real-time translation across the whole site
 */
export function setGoogleTransCookie(langCode) {
  const value = `/auto/${langCode}`;
  document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}; SameSite=Lax`;
  document.cookie = `googtrans=${value}; path=/; SameSite=Lax`;
}

/**
 * Clear the Google Translate cookies to reset back to original language (English)
 */
export function clearGoogleTransCookie() {
  document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

/**
 * Trigger Real-time Google Translate dynamically using the combo box or cookie reload
 */
export function changeGoogleLanguage(targetLang) {
  try {
    if (targetLang === 'en') {
      clearGoogleTransCookie();
      setGoogleTransCookie('en');
    } else {
      setGoogleTransCookie(targetLang);
    }

    // Try finding the Google Translate combo dropdown
    const selectCombo = document.querySelector('.goog-te-combo') || document.querySelector('#google_translate_element select');

    if (selectCombo) {
      selectCombo.value = targetLang;
      selectCombo.dispatchEvent(new Event('change'));
      return true;
    }

    // If combo isn't ready in DOM yet, poll for 2 seconds
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const combo = document.querySelector('.goog-te-combo') || document.querySelector('#google_translate_element select');
      if (combo) {
        combo.value = targetLang;
        combo.dispatchEvent(new Event('change'));
        clearInterval(interval);
      } else if (attempts > 15) {
        clearInterval(interval);
        // If the combo is still unavailable (e.g. initial load), reloading the page applies the googtrans cookie automatically
        window.location.reload();
      }
    }, 150);

    return true;
  } catch (err) {
    console.warn('[GoogleTranslateBridge Error]', err);
    return false;
  }
}

/**
 * Reset Google Translation completely back to English original state
 */
export function clearGoogleTranslation() {
  clearGoogleTransCookie();
  const selectCombo = document.querySelector('.goog-te-combo');
  if (selectCombo) {
    selectCombo.value = 'en';
    selectCombo.dispatchEvent(new Event('change'));
  }
}

export const ACCESSIBLE_TRAVEL_PHRASES = [
  {
    category: "Mobility & Ramps",
    english: "Where is the wheelchair ramp or elevator?",
    hindi: "व्हीलचेयर रैंप या लिफ्ट कहां है?",
    tamil: "சக்கர நாற்காலி சாய்வுதளம் அல்லது லிஃப்ட் எங்கே உள்ளது?",
    audioText: "Where is the wheelchair ramp or elevator?"
  },
  {
    category: "Restrooms",
    english: "Is there an accessible washroom nearby?",
    hindi: "क्या पास में कोई दिव्यांग-सुलभ शौचालय है?",
    tamil: "அருகில் அணுகக்கூடிய கழிப்பறை உள்ளதா?",
    audioText: "Is there an accessible washroom nearby?"
  },
  {
    category: "Assistance",
    english: "I need assistance for a visually impaired person.",
    hindi: "मुझे दृष्टिबाधित व्यक्ति के लिए सहायता चाहिए।",
    tamil: "பார்வையற்ற நபருக்கு எனக்கு உதவி தேவை.",
    audioText: "I need assistance for a visually impaired person."
  },
  {
    category: "Sign Language",
    english: "Is there a sign-language interpreter available?",
    hindi: "क्या यहां कोई सांकेतिक भाषा (Sign Language) दुभाषिया उपलब्ध है?",
    tamil: "சைகை மொழி பெயர்ப்பாளர் யாராவது இருக்கிறார்களா?",
    audioText: "Is there a sign language interpreter available?"
  },
  {
    category: "Transport",
    english: "Please call an accessible electric shuttle or cab.",
    hindi: "कृपया एक सुगम इलेक्ट्रिक शटल या कैब बुलाएं।",
    tamil: "தயவுசெய்து அணுகக்கூடிய எலக்ட்ரிக் ஷட்டில் அல்லது வண்டியை அழைக்கவும்.",
    audioText: "Please call an accessible electric shuttle or cab."
  }
];

let speechDebounceTimer = null;

export function speakText(text, lang = 'en-IN', debounce = false) {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return false;
  }

  if (debounce) {
    if (speechDebounceTimer) clearTimeout(speechDebounceTimer);
    speechDebounceTimer = setTimeout(() => {
      executeSpeak(text, lang);
    }, 250);
    return true;
  }

  return executeSpeak(text, lang);
}

function executeSpeak(text, lang) {
  try {
    window.speechSynthesis.cancel(); // Stop ongoing speech

    const cleanText = (text || '').replace(/<[^>]*>?/gm, '').trim();
    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    // Find matching voice
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = (lang || 'en').split('-')[0].toLowerCase();
    const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.warn('[SpeechSynthesis Warning]', e);
    return false;
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (speechDebounceTimer) {
    clearTimeout(speechDebounceTimer);
  }
}

