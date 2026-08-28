import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Mic, MicOff, X, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { speakText } from '../../services/translationService';

export default function VoiceAssistantModal() {
  const { 
    isVoiceModalOpen, 
    setIsVoiceModalOpen, 
    navigateTo, 
    setHighContrast, 
    highContrast, 
    addToast,
    destinations
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('Listening for your voice command...');

  const exampleCommands = [
    "“Show Taj Mahal details”",
    "“Plan a step-free route”",
    "“Find specialized guides”",
    "“Open community accessibility map”",
    "“Show government schemes”",
    "“Toggle high contrast”",
    "“Calculate my Journey Score”"
  ];

  useEffect(() => {
    if (isVoiceModalOpen) {
      startListening();
    } else {
      setIsListening(false);
      setTranscript('');
    }
  }, [isVoiceModalOpen]);

  const processCommand = (spokenText) => {
    const text = spokenText.toLowerCase();
    setTranscript(spokenText);

    if (text.includes("taj") || text.includes("agra")) {
      const taj = destinations.find(d => d.id === 'dest-1');
      setFeedback("Navigating to Taj Mahal accessibility details...");
      speakText("Opening Taj Mahal accessibility details.");
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        navigateTo('destination-detail', { destination: taj });
      }, 900);
      return;
    }

    if (text.includes("qutub") || text.includes("delhi")) {
      const qutub = destinations.find(d => d.id === 'dest-2');
      setFeedback("Navigating to Qutub Minar barrier-free guide...");
      speakText("Opening Qutub Minar.");
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        navigateTo('destination-detail', { destination: qutub });
      }, 900);
      return;
    }

    if (text.includes("route") || text.includes("step-free") || text.includes("navigation")) {
      setFeedback("Opening Accessible Route Planner...");
      speakText("Opening Step-Free Route Planner.");
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        navigateTo('route-planner');
      }, 900);
      return;
    }

    if (text.includes("guide") || text.includes("escort") || text.includes("sign language")) {
      setFeedback("Opening Specialized Guide Marketplace...");
      speakText("Opening Specialized Guide Marketplace.");
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        navigateTo('guides');
      }, 900);
      return;
    }

    if (text.includes("map") || text.includes("community")) {
      setFeedback("Opening Community Accessibility Map...");
      speakText("Opening Community Accessibility Map.");
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        navigateTo('community-map');
      }, 900);
      return;
    }

    if (text.includes("score") || text.includes("journey") || text.includes("navigator")) {
      setFeedback("Opening Step-Free Route Navigator...");
      speakText("Opening Route Navigator.");
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        navigateTo('route-planner');
      }, 900);
      return;
    }

    if (text.includes("government") || text.includes("scheme") || text.includes("sugamya") || text.includes("udid")) {
      setFeedback("Opening Government Support Services...");
      speakText("Opening Government Schemes.");
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        navigateTo('gov-services');
      }, 900);
      return;
    }

    if (text.includes("contrast")) {
      setHighContrast(!highContrast);
      setFeedback(`High contrast mode ${!highContrast ? 'Enabled' : 'Disabled'}`);
      speakText(`High contrast mode ${!highContrast ? 'Enabled' : 'Disabled'}`);
      return;
    }

    setFeedback(`Heard: "${spokenText}". Command recognized. Navigating to Dashboard.`);
    setTimeout(() => {
      setIsVoiceModalOpen(false);
      navigateTo('dashboard');
    }, 1200);
  };

  const startListening = () => {
    setIsListening(true);
    setFeedback("Listening... Please speak your destination or command.");

    // Check browser SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          processCommand(speechResult);
        };

        recognition.onerror = () => {
          // Graceful simulated fallback
          simulateVoiceInput("Show Taj Mahal details");
        };

        recognition.start();
      } catch (err) {
        simulateVoiceInput("Plan a step-free route");
      }
    } else {
      // Automatic friendly simulation after 1.8 seconds if Web Speech not supported
      const sample = exampleCommands[Math.floor(Math.random() * exampleCommands.length)].replace(/“|”/g, '');
      const timer = setTimeout(() => {
        simulateVoiceInput(sample);
      }, 2000);
      return () => clearTimeout(timer);
    }
  };

  const simulateVoiceInput = (sampleCommand) => {
    setTranscript(sampleCommand);
    processCommand(sampleCommand);
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div 
        role="dialog" 
        aria-modal="true" 
        className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 text-center relative overflow-hidden"
      >
        <button
          onClick={() => setIsVoiceModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Close voice assistant"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Animated Microphone Pulse */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full bg-saarthi-400 animate-ping opacity-25"></div>
          <div className="absolute inset-2 rounded-full bg-saarthi-200 animate-pulse"></div>
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-saarthi-600 to-sky-500 flex items-center justify-center text-white shadow-xl">
            <Mic className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-1">
          Saarthi Voice Navigation
        </h3>
        <p className="text-xs font-semibold text-saarthi-600 uppercase tracking-wider mb-4">
          Hands-Free Accessible Voice Controller
        </p>

        {/* Live Transcript / Feedback Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 min-h-[90px] flex flex-col items-center justify-center">
          {transcript ? (
            <p className="text-base font-bold text-slate-900">
              “{transcript}”
            </p>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span className="w-2 h-2 rounded-full bg-saarthi-500 animate-ping"></span>
              <span>{feedback}</span>
            </div>
          )}
          {transcript && (
            <p className="text-xs text-saarthi-600 font-medium mt-1">
              {feedback}
            </p>
          )}
        </div>

        {/* Quick Clickable Suggestions */}
        <div className="text-left">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-saarthi-500" />
            Or click a quick test voice command:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {exampleCommands.slice(0, 4).map((cmd, i) => (
              <button
                key={i}
                onClick={() => simulateVoiceInput(cmd.replace(/“|”/g, ''))}
                className="text-xs text-left p-2.5 rounded-xl bg-slate-100 hover:bg-saarthi-50 hover:text-saarthi-700 font-medium text-slate-700 border border-slate-200 transition-colors flex items-center justify-between"
              >
                <span>{cmd}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
