import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Volume2, 
  Mic,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { generateChatbotResponse, AI_CHAT_PRESETS } from '../../services/aiService';
import { speakText } from '../../services/translationService';

export default function AiChatbotDrawer() {
  const { isAiChatOpen, setIsAiChatOpen, userProfile, navigateTo } = useApp();
  const [messages, setMessages] = useState([
    {
      id: "msg-init",
      sender: "bot",
      text: `👋 Namaste! I am **Saarthi AI Assistant**, your personal barrier-free travel companion. How can I assist your journey today?`,
      timestamp: "Just now"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiChatOpen) {
      scrollToBottom();
    }
  }, [messages, isAiChatOpen]);

  const handleSendMessage = async (textToSend = null) => {
    const query = textToSend || inputMessage.trim();
    if (!query) return;

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const responseText = await generateChatbotResponse(query, userProfile);
      const botMsg = {
        id: `msg-bot-${Date.now()}`,
        sender: "bot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: "bot",
          text: "I encountered a brief connection delay. Please try asking again!",
          timestamp: "Now"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAiChatOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Top Header */}
      <div className="p-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base flex items-center gap-1.5">
              Saarthi AI Assistant
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </h3>
            <p className="text-[11px] text-purple-200 font-medium">
              Powered by Gemini & Sugamya Tourism Engine
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAiChatOpen(false)}
          className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          aria-label="Close AI Chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-saarthi-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line prose-sm">{msg.text}</div>
              <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                <span>{msg.timestamp}</span>
                {msg.sender === 'bot' && (
                  <button
                    onClick={() => speakText(msg.text.replace(/[*_#🏛️✨🏖️🦽🛡️🤟🇮🇳🏨]/g, ''))}
                    className="hover:text-purple-600 flex items-center gap-1 font-semibold ml-2"
                    title="Read answer aloud"
                  >
                    <Volume2 className="w-3 h-3" />
                    Read
                  </button>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
            <Bot className="w-4 h-4 text-purple-600 animate-spin" />
            <span>Saarthi AI is analyzing accessibility routes & amenities...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2.5 bg-purple-50/60 border-t border-purple-100">
        <p className="text-[11px] font-bold text-purple-900 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-600" />
          Suggested Questions:
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {AI_CHAT_PRESETS.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] bg-white hover:bg-purple-100 text-purple-900 px-2.5 py-1 rounded-full border border-purple-200 whitespace-nowrap font-medium transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask anything about accessible routes, stays, guides..."
          className="flex-1 text-xs sm:text-sm px-3 py-2.5 bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Saarthi AI prompt input"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="p-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-colors"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
