import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe2, 
  Volume2, 
  Mic, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight,
  MessageSquare,
  Languages
} from 'lucide-react';
import { 
  SUPPORTED_LANGUAGES, 
  ACCESSIBLE_TRAVEL_PHRASES, 
  speakText 
} from '../../services/translationService';

export default function MultilingualVoiceView() {
  const { activeLanguage, setActiveLanguage, addToast } = useApp();

  const [inputPhrase, setInputPhrase] = useState('');
  const [targetLang, setTargetLang] = useState('hi');
  const [translatedResult, setTranslatedResult] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleTranslate = (textToTranslate = null) => {
    const text = textToTranslate || inputPhrase;
    if (!text.trim()) return;

    setIsTranslating(true);
    setTimeout(() => {
      // Intelligent mock translation dictionary
      if (text.toLowerCase().includes("wheelchair ramp") || text.toLowerCase().includes("ramp")) {
        if (targetLang === 'hi') setTranslatedResult("व्हीलचेयर रैंप या लिफ्ट कहां है?");
        else if (targetLang === 'ta') setTranslatedResult("சக்கர நாற்காலி சாய்வுதளம் எங்கே உள்ளது?");
        else if (targetLang === 'bn') setTranslatedResult("হুইলচেয়ার র‍্যাম্প কোথায়?");
        else if (targetLang === 'mr') setTranslatedResult("व्हीलचेअर रॅम्प कुठे आहे?");
        else if (targetLang === 'es') setTranslatedResult("¿Dónde está la rampa para sillas de ruedas?");
        else if (targetLang === 'fr') setTranslatedResult("Où est la rampe pour fauteuil roulant?");
        else setTranslatedResult(`[Translated to ${targetLang.toUpperCase()}]: ${text}`);
      } else if (text.toLowerCase().includes("toilet") || text.toLowerCase().includes("washroom") || text.toLowerCase().includes("restroom")) {
        if (targetLang === 'hi') setTranslatedResult("क्या पास में कोई दिव्यांग-सुलभ शौचालय है?");
        else if (targetLang === 'ta') setTranslatedResult("அருகில் அணுகக்கூடிய கழிப்பறை உள்ளதா?");
        else if (targetLang === 'bn') setTranslatedResult("কাছে কি কোনো সুগম শৌচাগার আছে?");
        else setTranslatedResult(`[Translated to ${targetLang.toUpperCase()}]: ${text}`);
      } else {
        setTranslatedResult(`[${targetLang.toUpperCase()} Accessible Translation]: ${text} (Live voice ready)`);
      }
      setIsTranslating(false);
    }, 400);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    addToast("Copied phrase to clipboard!", "success");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
          <Globe2 className="w-3.5 h-3.5" />
          <span>Universal Multilingual Communication Bridge</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Multilingual & Voice Travel Assistant
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Break communication barriers across 11 Indian and international languages with built-in text-to-speech audio and real-time accessibility phrases.
        </p>
      </div>

      {/* 11 Language Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Select Active Interface & Speech Language
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = activeLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setActiveLanguage(lang.code);
                  addToast(`Active language set to: ${lang.name}`, 'info');
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-saarthi-600 bg-saarthi-50 text-saarthi-900 font-bold shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <span className="text-base block">{lang.flag}</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">{lang.native}</span>
                  <span className="text-[10px] text-slate-500">{lang.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-saarthi-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Translation & TTS Speaker Tool */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Languages className="w-5 h-5 text-saarthi-600" />
            <span>Real-Time Accessibility Phrase Translator</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">Web Speech TTS Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              English Query / Accessibility Question
            </label>
            <textarea
              rows={4}
              value={inputPhrase}
              onChange={(e) => setInputPhrase(e.target.value)}
              placeholder="e.g. Where is the wheelchair ramp or elevator to the upper deck?"
              className="w-full p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleTranslate()}
                className="px-4 py-2 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <span>Translate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setInputPhrase("Where is the nearest wheelchair accessible washroom?")}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
              >
                Insert Sample
              </button>
            </div>
          </div>

          {/* Translated Result & Audio Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Translated Audio Output
              </label>
              <select
                value={targetLang}
                onChange={(e) => {
                  setTargetLang(e.target.value);
                  if (inputPhrase) handleTranslate();
                }}
                className="text-xs p-1 rounded-lg border bg-slate-50 font-semibold"
              >
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full p-4 bg-purple-50/60 rounded-2xl border border-purple-200 min-h-[96px] text-xs sm:text-sm text-purple-950 font-semibold flex flex-col justify-between">
              <p>{translatedResult || "Translated output will appear here with voice playback option..."}</p>
              {translatedResult && (
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => speakText(translatedResult, targetLang === 'hi' ? 'hi-IN' : 'en-IN')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Speak Aloud</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency & Essential Accessible Travel Phrases */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">
          Essential Accessibility Communication Cards (One-Tap Speak)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACCESSIBLE_TRAVEL_PHRASES.map((phrase, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-saarthi-600 block">
                  {phrase.category}
                </span>
                <p className="font-bold text-xs text-slate-900 mt-0.5">
                  🇬🇧 {phrase.english}
                </p>
                <p className="font-semibold text-xs text-saarthi-700 mt-1">
                  🇮🇳 {phrase.hindi}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  🇮🇳 {phrase.tamil}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  onClick={() => speakText(phrase.english)}
                  className="px-3 py-1.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Speak</span>
                </button>

                <button
                  onClick={() => handleCopy(phrase.hindi, idx)}
                  className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 font-semibold"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === idx ? "Copied" : "Copy Hindi"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
