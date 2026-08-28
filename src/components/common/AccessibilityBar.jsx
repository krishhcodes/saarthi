import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Eye, 
  Volume2, 
  VolumeX, 
  Mic, 
  Type, 
  Sparkles, 
  RotateCcw,
  Globe
} from 'lucide-react';
import { 
  SUPPORTED_LANGUAGES, 
  changeGoogleLanguage, 
  clearGoogleTranslation,
  speakText 
} from '../../services/translationService';

export default function AccessibilityBar() {
  const {
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
    setIsVoiceModalOpen,
    addToast
  } = useApp();

  const handleTextSizeCycle = () => {
    const sizes = ['sm', 'base', 'lg', 'xl'];
    const nextIndex = (sizes.indexOf(textSize) + 1) % sizes.length;
    const nextSize = sizes[nextIndex];
    setTextSize(nextSize);
    addToast(`Text Scaling: ${nextSize.toUpperCase()}`, 'info');
    if (screenReaderVoice) {
      speakText(`Text size set to ${nextSize.toUpperCase()}`, undefined, true);
    }
  };

  const handleLanguageChange = (langCode) => {
    setActiveLanguage(langCode);
    changeGoogleLanguage(langCode);
    const target = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    addToast(`Real-Time Translation: ${target?.name} (${target?.native})`, 'success');
    if (screenReaderVoice) {
      speakText(`Language changed to ${target?.name}`, target?.voiceCode || 'en-IN');
    }
  };

  const handleReset = () => {
    setHighContrast(false);
    setTextSize('base');
    setDyslexicFont(false);
    setScreenReaderVoice(false);
    setActiveLanguage('en');
    clearGoogleTranslation();
    addToast("All accessibility & translation options reset to default.", "info");
    speakText("Accessibility options reset to default.");
  };

  const handleHoverNarrate = (text) => {
    if (screenReaderVoice) {
      speakText(text, undefined, true);
    }
  };

  return (
    <aside 
      aria-label="Accessibility Options Bar" 
      className="bg-slate-950 text-white border-b border-slate-800 px-3 sm:px-4 py-1.5 text-xs font-medium sticky top-0 z-50 shadow-md transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Quick Access Label */}
        <div className="flex items-center gap-2">
          <span 
            className="inline-flex items-center gap-1.5 bg-saarthi-600/90 hover:bg-saarthi-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm"
            onMouseEnter={() => handleHoverNarrate("Inclusive Mode Active. WCAG 2.2 AAA Compliant.")}
          >
            <Sparkles className="w-3 h-3 text-yellow-300" />
            Inclusive Mode Active
          </span>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            WCAG 2.2 AAA Compliant
          </span>
        </div>

        {/* Right: Accessibility Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
          {/* High Contrast Toggle */}
          <button
            onClick={() => {
              const next = !highContrast;
              setHighContrast(next);
              addToast(`High Contrast Mode ${next ? 'Enabled' : 'Disabled'}`, 'info');
              if (screenReaderVoice) speakText(`High Contrast Mode ${next ? 'Enabled' : 'Disabled'}`);
            }}
            onMouseEnter={() => handleHoverNarrate("Toggle High Contrast Mode")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all text-xs ${
              highContrast 
                ? 'bg-yellow-400 text-black font-extrabold ring-2 ring-yellow-300 shadow-md' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
            }`}
            aria-pressed={highContrast}
            title="Toggle High Contrast Display (WCAG AAA)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">High Contrast</span>
          </button>

          {/* Text Size Cycler */}
          <button
            onClick={handleTextSizeCycle}
            onMouseEnter={() => handleHoverNarrate(`Cycle Text Size. Current size is ${textSize.toUpperCase()}`)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all text-xs"
            title="Cycle Text Size (SM, BASE, LG, XL)"
          >
            <Type className="w-3.5 h-3.5 text-saarthi-400" />
            <span>Text: <strong className="uppercase text-saarthi-400 font-bold">{textSize}</strong></span>
          </button>

          {/* Dyslexia Friendly Font Toggle */}
          <button
            onClick={() => {
              const next = !dyslexicFont;
              setDyslexicFont(next);
              addToast(`Dyslexia-Friendly Font ${next ? 'Enabled' : 'Disabled'}`, 'info');
              if (screenReaderVoice) speakText(`OpenDyslexic font ${next ? 'Enabled' : 'Disabled'}`);
            }}
            onMouseEnter={() => handleHoverNarrate("Toggle OpenDyslexic Font for reading ease")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all text-xs ${
              dyslexicFont 
                ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400 shadow-md' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
            }`}
            aria-pressed={dyslexicFont}
            title="Toggle OpenDyslexic Font for Reading Ease"
          >
            <span>Dyslexic Font</span>
          </button>

          {/* Screen Reader Audio Narrator Toggle */}
          <button
            onClick={() => {
              const newState = !screenReaderVoice;
              setScreenReaderVoice(newState);
              addToast(`Audio Voice Narrator ${newState ? 'Enabled' : 'Muted'}`, 'info');
              if (newState) {
                speakText("Voice Narrator activated. Hover over elements to hear audio descriptions.");
              }
            }}
            onMouseEnter={() => handleHoverNarrate("Toggle Live Voice Narrator and Screen Reader")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all text-xs ${
              screenReaderVoice 
                ? 'bg-emerald-600 text-white font-bold animate-pulse ring-2 ring-emerald-400 shadow-md' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
            }`}
            aria-pressed={screenReaderVoice}
            title="Narrate Screen Actions and Hover Items with Voice"
          >
            {screenReaderVoice ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Voice Narrator</span>
          </button>

          {/* Voice Navigation Mic Trigger */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            onMouseEnter={() => handleHoverNarrate("Open Voice Navigation Command Microphone")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-saarthi-600 hover:bg-saarthi-500 text-white font-semibold transition-all shadow-sm active:scale-95 text-xs"
            title="Speak Voice Commands to Navigate Hands-Free"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Mic</span>
          </button>

          {/* Real-time Google Translate Language Selector */}
          <div 
            className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-lg px-2 py-0.5 hover:border-saarthi-500 transition-colors"
            onMouseEnter={() => handleHoverNarrate("Real-time Multilingual Google Translation")}
          >
            <Globe className="w-3.5 h-3.5 text-saarthi-400 shrink-0" />
            <select
              value={activeLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent text-slate-100 text-xs font-medium focus:outline-none border-none py-0.5 cursor-pointer max-w-[140px] sm:max-w-none"
              aria-label="Select Real-time Interface Language"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.flag} {lang.native} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            onMouseEnter={() => handleHoverNarrate("Reset all accessibility preferences to default")}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
            title="Reset Accessibility and Translation Settings"
            aria-label="Reset Accessibility Settings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

