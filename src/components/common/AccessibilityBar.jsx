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
import { SUPPORTED_LANGUAGES } from '../../services/translationService';

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
    setTextSize(sizes[nextIndex]);
    addToast(`Text size changed to: ${sizes[nextIndex].toUpperCase()}`, 'info');
  };

  const handleReset = () => {
    setHighContrast(false);
    setTextSize('base');
    setDyslexicFont(false);
    setScreenReaderVoice(false);
    addToast("Accessibility options reset to default.", "info");
  };

  return (
    <aside 
      aria-label="Accessibility Options Bar" 
      className="bg-slate-900 text-white border-b border-slate-800 px-4 py-1.5 text-xs font-medium sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Quick Access Label */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-saarthi-600/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            Inclusive Mode Active
          </span>
          <span className="hidden sm:inline text-slate-300 text-[11px]">
            WCAG 2.2 AAA Compliant
          </span>
        </div>

        {/* Right: Accessibility Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
          {/* High Contrast Toggle */}
          <button
            onClick={() => {
              setHighContrast(!highContrast);
              addToast(`High Contrast Mode ${!highContrast ? 'Enabled' : 'Disabled'}`, 'info');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              highContrast 
                ? 'bg-yellow-400 text-black font-bold ring-2 ring-yellow-300' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            aria-pressed={highContrast}
            title="Toggle High Contrast Display"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>High Contrast</span>
          </button>

          {/* Text Size Cycler */}
          <button
            onClick={handleTextSizeCycle}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Cycle Text Size (A-, A, A+, A++)"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text: <strong className="uppercase text-saarthi-400">{textSize}</strong></span>
          </button>

          {/* Dyslexia Friendly Font Toggle */}
          <button
            onClick={() => {
              setDyslexicFont(!dyslexicFont);
              addToast(`Dyslexia-Friendly Font ${!dyslexicFont ? 'Enabled' : 'Disabled'}`, 'info');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              dyslexicFont 
                ? 'bg-indigo-600 text-white font-bold' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            aria-pressed={dyslexicFont}
            title="Toggle OpenDyslexic Font"
          >
            <span>Dyslexic Font</span>
          </button>

          {/* Screen Reader Audio Narrator Toggle */}
          <button
            onClick={() => {
              const newState = !screenReaderVoice;
              setScreenReaderVoice(newState);
              addToast(`Audio Voice Narrator ${newState ? 'Enabled' : 'Muted'}`, 'info');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              screenReaderVoice 
                ? 'bg-emerald-600 text-white font-bold animate-pulse' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            aria-pressed={screenReaderVoice}
            title="Narrate Screen Actions with Voice"
          >
            {screenReaderVoice ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Voice Narrator</span>
          </button>

          {/* Voice Navigation Mic Trigger */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-saarthi-600 hover:bg-saarthi-500 text-white font-medium transition-colors"
            title="Speak Voice Commands to Navigate"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Mic</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-800 rounded px-2 py-0.5">
            <Globe className="w-3 h-3 text-slate-400" />
            <select
              value={activeLanguage}
              onChange={(e) => {
                setActiveLanguage(e.target.value);
                addToast(`Language switched to: ${SUPPORTED_LANGUAGES.find(l => l.code === e.target.value)?.name}`, 'info');
              }}
              className="bg-transparent text-slate-200 text-xs focus:outline-none border-none py-0.5 cursor-pointer"
              aria-label="Select Interface Language"
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
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            title="Reset Accessibility Settings"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}
