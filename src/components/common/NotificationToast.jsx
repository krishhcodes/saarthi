import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function NotificationToast() {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-saarthi-500 shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success': return 'border-emerald-200 bg-emerald-50 text-emerald-950';
      case 'danger': return 'border-red-200 bg-red-50 text-red-950';
      case 'warning': return 'border-amber-200 bg-amber-50 text-amber-950';
      default: return 'border-saarthi-200 bg-saarthi-50 text-saarthi-950';
    }
  };

  return (
    <div 
      aria-live="polite" 
      aria-atomic="true" 
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-bottom-5 ${getBorderColor(toast.type)}`}
        >
          {getIcon(toast.type)}
          <div className="flex-1 text-xs font-semibold leading-snug">
            {toast.message}
          </div>
        </div>
      ))}
    </div>
  );
}
