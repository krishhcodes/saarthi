import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Volume2, VolumeX, Sparkles, Pause, Play, Info } from 'lucide-react';
import { speakText, stopSpeaking, SUPPORTED_LANGUAGES } from '../../services/translationService';

export default function ScreenReaderNarrator() {
  const { 
    screenReaderVoice, 
    setScreenReaderVoice, 
    currentView, 
    activeLanguage,
    selectedDestination,
    selectedGuideForBooking,
    selectedHotelForBooking,
    addToast
  } = useApp();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentNarrative, setCurrentNarrative] = useState('');

  // Stop speaking on unmount or when screenReaderVoice is toggled off
  useEffect(() => {
    if (!screenReaderVoice) {
      stopSpeaking();
      setIsSpeaking(false);
    }
  }, [screenReaderVoice]);

  if (!screenReaderVoice) return null;

  const getLanguageVoiceCode = () => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === activeLanguage);
    return lang?.voiceCode || 'en-IN';
  };

  const handleReadCurrentScreen = () => {
    let textToRead = '';
    const voiceCode = getLanguageVoiceCode();

    switch (currentView) {
      case 'landing':
        textToRead = "Welcome to Saarthi. Accessible Tourism Navigator for Persons with Disabilities. Explore barrier-free heritage, wheelchair-accessible routes, specialized sign-language guides, and inclusive travel booking.";
        break;
      case 'dashboard':
        textToRead = "You are on the Saarthi Traveler Dashboard. View your active trip to Agra and Delhi, explore 10 verified accessible Indian heritage destinations, or check your 93% barrier-free journey score.";
        break;
      case 'destinations':
        textToRead = "Exploring Accessible Destinations. Browse top barrier-free heritage sites across India featuring verified ramp access, tactile pathways, and sensory guides.";
        break;
      case 'destination-detail':
        textToRead = selectedDestination 
          ? `Viewing accessibility details for ${selectedDestination.name}, ${selectedDestination.city}. Overall accessibility score is ${selectedDestination.accessibilityScore}%. Features include wheelchair ramps, audio tours, and braille signage.`
          : "Viewing destination accessibility details.";
        break;
      case 'route-planner':
        textToRead = "Step-Free Accessible Route Planner. Plan customized transit with wheelchair navigation, avoid staircases and uneven cobblestones, and find accessible restrooms.";
        break;
      case 'guides':
        textToRead = "Specialized Tour Guides Directory. Connect with certified escorts trained in sign language, mobility assistance, visual narration, and neurodivergent travel support.";
        break;
      case 'hotels':
        textToRead = "Accessible Stays and Hotels. Verified accommodations with roll-in showers, wide doorways, emergency strobe alarms, and step-free entrances.";
        break;
      case 'gov-services':
        textToRead = "Government Support and Schemes. Access Sugamya Bharat Abhiyan, UDID Card benefits, Divyangjan concessions, and accessible travel subsidies.";
        break;
      case 'community-map':
        textToRead = "Community Accessibility Map. Live crowdsourced reports on ramp conditions, elevator status, tactile pavements, and temporary blockages.";
        break;
      case 'journey-score':
        textToRead = "Accessibility Journey Score Calculator. Evaluate your total itinerary accessibility across routes, transit, accommodation, and monument gates.";
        break;
      case 'store':
        textToRead = "Accessible Travel Equipment Store. Browse foldable travel ramps, adaptive luggage, tactile canes, and portable shower chairs.";
        break;
      case 'trip-planner':
        textToRead = "Personalized Trip Planner. Customise your day-by-day accessible itinerary, transport shuttles, and certified assistants.";
        break;
      default:
        // Try getting the main heading from the DOM
        const mainHeading = document.querySelector('h1, h2')?.innerText || "Saarthi Accessible Tourism Platform";
        textToRead = `Currently viewing ${mainHeading}.`;
        break;
    }

    setCurrentNarrative(textToRead);
    setIsSpeaking(true);
    speakText(textToRead, voiceCode);
    addToast("Screen narrator is reading current page...", "info");

    // Track speech completion approximate timing
    const wordCount = textToRead.split(' ').length;
    const estimatedDuration = Math.max(3000, (wordCount / 2.5) * 1000);
    setTimeout(() => {
      setIsSpeaking(false);
    }, estimatedDuration);
  };

  const handleStopSpeech = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setCurrentNarrative('');
    addToast("Audio speech stopped.", "info");
  };

  return (
    <div 
      role="region" 
      aria-label="Screen Reader Audio Controller" 
      className="fixed bottom-6 right-6 z-40 bg-slate-900/95 text-white border border-emerald-500/50 shadow-2xl rounded-2xl p-3.5 backdrop-blur-md max-w-sm w-full animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" />
            Voice Narrator Active
          </span>
        </div>

        {/* Mute / Close Narrator */}
        <button
          onClick={() => {
            handleStopSpeech();
            setScreenReaderVoice(false);
          }}
          className="text-slate-400 hover:text-white text-xs bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition-colors"
          title="Turn off Voice Narrator"
        >
          Turn Off
        </button>
      </div>

      <p className="text-[11px] text-slate-300 mb-3 line-clamp-2">
        {currentNarrative || "Hover over any card or button to hear audio descriptions, or click below to narrate this screen."}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleReadCurrentScreen}
          className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all shadow-md active:scale-95"
          title="Read current screen description aloud"
        >
          <Volume2 className="w-4 h-4" />
          <span>{isSpeaking ? "Replay Screen" : "Read Current Screen"}</span>
        </button>

        {isSpeaking && (
          <button
            onClick={handleStopSpeech}
            className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all shadow-md active:scale-95"
            title="Stop audio narration"
          >
            <VolumeX className="w-4 h-4" />
            <span>Stop</span>
          </button>
        )}
      </div>

      {/* Waveform indicator when speaking */}
      {isSpeaking && (
        <div className="mt-2.5 flex items-center justify-center gap-1 h-3">
          <span className="w-1 bg-emerald-400 h-full animate-bounce rounded-full"></span>
          <span className="w-1 bg-emerald-400 h-3/4 animate-pulse rounded-full"></span>
          <span className="w-1 bg-emerald-300 h-full animate-bounce rounded-full"></span>
          <span className="w-1 bg-emerald-400 h-1/2 animate-pulse rounded-full"></span>
          <span className="w-1 bg-emerald-500 h-full animate-bounce rounded-full"></span>
        </div>
      )}
    </div>
  );
}
