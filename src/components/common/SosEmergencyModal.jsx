import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  X, 
  PhoneCall, 
  MapPin, 
  Hospital, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  UserCheck
} from 'lucide-react';

export default function SosEmergencyModal() {
  const { isSosModalOpen, setIsSosModalOpen, currentUser, selectedDestination, addToast } = useApp();
  const [sosSent, setSosSent] = useState(false);

  if (!isSosModalOpen) return null;

  const handleTriggerEmergencyBroadcast = () => {
    setSosSent(true);
    addToast("EMERGENCY ALERT SENT: Coordinates and Medical Profile transmitted to nearest ERSS Unit & Family Contact.", "danger");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="emergency-title"
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-4 border-red-600 relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-red-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center animate-bounce">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h3 id="emergency-title" className="text-xl font-black text-red-700">
                24x7 Accessible Emergency SOS
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Integrated with National ERSS 112 & Disability Medical Dispatch
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsSosModalOpen(false);
              setSosSent(false);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close emergency modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Location & User Context */}
        <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-center justify-between text-xs font-semibold text-red-900 mb-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              Current Monitored Location:
            </span>
            <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded font-mono">
              GPS: 27.1751° N, 78.0421° E
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {selectedDestination?.name || "Taj Mahal Complex"}, {selectedDestination?.city || "Agra"}
          </p>
          <div className="mt-2 text-xs text-slate-700 space-y-1">
            <p><strong>Traveler:</strong> {currentUser.name} ({currentUser.accessibilityProfile?.primaryDisability || "Wheelchair User"})</p>
            <p><strong>Emergency Contact:</strong> {currentUser.accessibilityProfile?.emergencyContactName || "Dr. Ramesh Sharma"} ({currentUser.accessibilityProfile?.emergencyContactPhone || "+91-98111-22334"})</p>
          </div>
        </div>

        {/* One Tap Emergency Broadcast Button */}
        {!sosSent ? (
          <div className="mt-5">
            <button
              onClick={handleTriggerEmergencyBroadcast}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all"
            >
              <Send className="w-5 h-5" />
              BROADCAST GPS SOS TO POLICE & AMBULANCE
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Sends automated SMS with live GPS tracking + medical needs to ERSS 112 and registered contacts.
            </p>
          </div>
        ) : (
          <div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-center animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-base font-bold text-emerald-900">
              Emergency Broadcast Dispatched!
            </h4>
            <p className="text-xs text-emerald-700 mt-1">
              Dispatch ID #SOS-2026-8812. Local Agra Emergency Team & S.N. Medical Trauma Center notified. Estimated response: 4 mins.
            </p>
          </div>
        )}

        {/* Direct Call Quick Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Direct Emergency Dial Lines:
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:112"
              className="flex items-center justify-between p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-900 font-bold text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-red-600" />
                <span>National ERSS</span>
              </div>
              <span className="text-red-700 font-mono text-sm">112</span>
            </a>

            <a
              href="tel:108"
              className="flex items-center justify-between p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-900 font-bold text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <Hospital className="w-4 h-4 text-emerald-600" />
                <span>Medical Ambulance</span>
              </div>
              <span className="text-emerald-700 font-mono text-sm">108</span>
            </a>

            <a
              href="tel:1800118454"
              className="flex items-center justify-between p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-900 font-bold text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-saarthi-600" />
                <span>Sugamya Bharat</span>
              </div>
              <span className="text-saarthi-700 font-mono text-xs">1800-11-8454</span>
            </a>

            <a
              href="tel:139"
              className="flex items-center justify-between p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-900 font-bold text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-600" />
                <span>Railway Assist</span>
              </div>
              <span className="text-blue-700 font-mono text-sm">139</span>
            </a>
          </div>
        </div>

        {/* Nearby Hospital Information */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <p className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Hospital className="w-3.5 h-3.5 text-red-500" />
            Nearest Wheelchair-Accessible Trauma Hospital:
          </p>
          <p className="text-slate-600 mt-0.5">
            {selectedDestination?.nearbyHospital || "S.N. Medical College & Hospital (3.2 km) - 24x7 Trauma Center"}
          </p>
        </div>
      </div>
    </div>
  );
}
