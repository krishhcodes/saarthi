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
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', voiceCode: 'es-ES' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', voiceCode: 'fr-FR' }
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
  },
  bn: {
    brand_tagline: "প্রতিবন্ধী ব্যক্তিদের জন্য সহজলভ্য পর্যটন পথপ্রদর্শক",
    hero_tagline: "সকলের জন্য পর্যটন।",
    hero_subtext: "মর্যাদা, আত্মবিশ্বাস এবং সমান সুযোগের সাথে বিশ্ব ঘুরে দেখুন।",
    plan_trip_btn: "আমার ভ্রমণ পরিকল্পনা করুন",
    explore_dest_btn: "গন্তব্য দেখুন",
    good_morning: "শুভ সকাল",
    recommended_for_you: "আপনার জন্য প্রস্তাবিত",
    your_journey: "আপনার সহজলভ্য ভ্রমণ",
    nearby_accessible: "কাছাকাছি সহজলভ্য স্থান",
    gov_support: "সরকারি সহায়তা",
    available_guides: "বিশেষ গাইড",
    journey_score: "ভ্রমণ স্কোর",
    community_map: "কমিউনিটি মানচিত্র",
    ai_verify: "এআই যাচাইকরণ",
    store: "সহায়ক স্টোর",
    filter_city: "শহর ফিল্টার করুন",
    all_cities: "সব শহর",
    book_guide: "গাইড বুক করুন",
    view_details: "বিস্তারিত দেখুন",
    step_free_route: "ধাপমুক্ত রুট",
    emergency_sos: "জরুরী এসওএস",
    contrast_toggle: "উচ্চ কনট্রাস্ট",
    speech_toggle: "ভয়েস রিডার",
    voice_command: "ভয়েস কমান্ড"
  },
  mr: {
    brand_tagline: "दिव्यांगांसाठी सुलभ पर्यटन मार्गदर्शक",
    hero_tagline: "सर्वांसाठी पर्यटन.",
    hero_subtext: "स्वाभिमान, आत्मविश्वास आणि समान संधींसह जग अनुभवा.",
    plan_trip_btn: "माझ्या सहलीचे नियोजन करा",
    explore_dest_btn: "पर्यटन स्थळे पहा",
    good_morning: "शुभ प्रभात",
    recommended_for_you: "तुमच्यासाठी शिफारस केलेले",
    your_journey: "तुमचा सुलभ प्रवास",
    nearby_accessible: "जवळपासची सुलभ ठिकाणे",
    gov_support: "सरकारी योजना आणि मदत",
    available_guides: "प्रशिक्षित गाईड्स",
    journey_score: "प्रवास सुलभता गुण",
    community_map: "समुदाय सुलभता नकाशा",
    ai_verify: "एआय सुलभता पडताळणी",
    store: "सुलभ प्रवास साहित्य",
    filter_city: "शहर निवडा",
    all_cities: "सर्व शहरे",
    book_guide: "गाईड बुक करा",
    view_details: "सविस्तर माहिती",
    step_free_route: "पायऱ्यांशिवाय मार्ग",
    emergency_sos: "आपत्कालीन मदत",
    contrast_toggle: "हाय कॉन्ट्रास्ट",
    speech_toggle: "व्हॉइस रीडर",
    voice_command: "व्हॉइस नेव्हिगेशन"
  },
  ta: {
    brand_tagline: "மாற்றுத்திறனாளிகளுக்கான அணுகக்கூடிய சுற்றுலா வழிகாட்டி",
    hero_tagline: "அனைவருக்கும் சுற்றுலா.",
    hero_subtext: "சுயமரியாதை மற்றும் நம்பிக்கையுடன் உலகை ஆராயுங்கள்.",
    plan_trip_btn: "பயணத்தை திட்டமிடுங்கள்",
    explore_dest_btn: "இடங்களை காண்க",
    good_morning: "காலை வணக்கம்",
    recommended_for_you: "உங்களுக்காக பரிந்துரைக்கப்பட்டது",
    your_journey: "உங்கள் அணுகக்கூடிய பயணம்",
    nearby_accessible: "அருகிலுள்ள அணுகக்கூடிய இடங்கள்",
    gov_support: "அரசு உதவிகள்",
    available_guides: "சிறப்பு வழிகாட்டிகள்",
    journey_score: "பயண அணுகல் மதிப்பெண்",
    community_map: "சமூக வரைபடம்",
    ai_verify: "AI சரிபார்ப்பு",
    store: "பயணக் கடை",
    filter_city: "நகரம் வடிகட்டு",
    all_cities: "அனைத்து நகரங்கள்",
    book_guide: "வழிகாட்டியை பதிவு செய்க",
    view_details: "விவரங்களை காண்க",
    step_free_route: "படி-இல்லா பாதை",
    emergency_sos: "அவசர உதவி",
    contrast_toggle: "உயர் மாறுபாடு",
    speech_toggle: "குரல் வாசிப்பாளர்",
    voice_command: "குரல் கட்டளை"
  },
  te: {
    brand_tagline: "దివ్యాంగుల కోసం అందుబాటులో ఉండే పర్యాటక మార్గదర్శి",
    hero_tagline: "అందరికీ పర్యాటకం.",
    hero_subtext: "గౌరవం, ఆత్మవిశ్వాసంతో ప్రపంచాన్ని అన్వేషించండి.",
    plan_trip_btn: "నా యాత్రను ప్లాన్ చేయండి",
    explore_dest_btn: "స్థలాలను చూడండి",
    good_morning: "శుభోదయం",
    recommended_for_you: "మీ కోసం సిఫార్సు చేయబడినవి",
    your_journey: "మీ అందుబాటు యాత్ర",
    nearby_accessible: "సమీపంలోని అందుబాటు స్థలాలు",
    gov_support: "ప్రభుత్వ పథకాలు & సహాయం",
    available_guides: "నైపుణ్యం గల గైడ్లు",
    journey_score: "యాత్ర స్కోరు",
    community_map: "కమ్యూనిటీ మ్యాప్",
    ai_verify: "AI పరిశీలన",
    store: "ట్రావెల్ స్టోర్",
    filter_city: "నగరాన్ని ఎంచుకోండి",
    all_cities: "అన్ని నగరాలు",
    book_guide: "గైడ్‌ను బుక్ చేయండి",
    view_details: "వివరాలను చూడండి",
    step_free_route: "మెట్లు లేని మార్గం",
    emergency_sos: "అత్యవసర సహాయం",
    contrast_toggle: "హై కాంట్రాస్ట్",
    speech_toggle: "వాయిస్ రీడర్",
    voice_command: "వాయిస్ కమాండ్"
  }
};

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

export function speakText(text, lang = 'en-IN') {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return false;
  }

  window.speechSynthesis.cancel(); // Stop ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  
  // Try to find matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
