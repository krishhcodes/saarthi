import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Map, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ThumbsUp, 
  ThumbsDown, 
  Filter, 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Leaflet custom marker icons by report type
const createReportIcon = (type, status) => {
  const bgColor = status === 'Verified' ? '#16a34a' : status === 'Community Verified' ? '#0284c7' : '#eab308';
  return new L.DivIcon({
    className: 'custom-map-icon',
    html: `<div style="background-color:${bgColor};color:white;width:30px;height:30px;border-radius:9999px;display:flex;align-items:center;justify-content:center;border:2.5px solid white;box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.3);font-size:14px;">${
      type === 'Ramp' ? '🦽' : type === 'Elevator' ? '🛗' : type.includes('Obstacle') ? '⚠️' : '📍'
    }</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

export default function CommunityMapView() {
  const { 
    communityReports, 
    addCommunityReport, 
    voteReport, 
    currentUser, 
    destinations, 
    addToast 
  } = useApp();

  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New Report Form State
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('Ramp');
  const [formDestId, setFormDestId] = useState('dest-1');
  const [formDesc, setFormDesc] = useState('');
  const [formPhoto, setFormPhoto] = useState('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80');

  const filteredReports = communityReports.filter(rep => {
    if (selectedTypeFilter !== 'All' && rep.type !== selectedTypeFilter) return false;
    if (selectedStatusFilter !== 'All' && rep.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleSubmitNewReport = (e) => {
    e.preventDefault();
    const dest = destinations.find(d => d.id === formDestId) || destinations[0];

    addCommunityReport({
      destinationId: dest.id,
      destinationName: dest.name,
      city: dest.city,
      coordinates: [
        dest.coordinates[0] + (Math.random() - 0.5) * 0.005,
        dest.coordinates[1] + (Math.random() - 0.5) * 0.005
      ],
      type: formType,
      title: formTitle,
      description: formDesc,
      photoUrl: formPhoto,
      contributor: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
      contributorRole: currentUser.accessibilityProfile?.primaryDisability || "Community Contributor"
    });

    setIsSubmitModalOpen(false);
    setFormTitle('');
    setFormDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-saarthi-600 uppercase tracking-wider mb-1">
            <Map className="w-3.5 h-3.5" />
            <span>Crowd-Sourced Barrier Auditing System</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Community Accessibility Map
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-world accessibility data contributed and verified by travelers with disabilities, local NGOs, and verified guides.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-5 py-3 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-2xl font-extrabold text-xs sm:text-sm shadow-lg shadow-saarthi-500/25 flex items-center gap-2 transition-transform active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report Accessibility / Add Location</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
          >
            <option value="All">📌 All Marker Types</option>
            <option value="Ramp">🦽 Ramps & Slopes</option>
            <option value="Elevator">🛗 Elevators & Lifts</option>
            <option value="Accessible Entrance">🚪 Accessible Entrances</option>
            <option value="Accessible Washroom">🚻 PwD Restrooms</option>
            <option value="Accessible Transport">🚌 Low-Floor Transport</option>
            <option value="Obstacle / Blocked Path">⚠️ Obstacles & Blocked Paths</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-saarthi-500 focus:outline-none"
          >
            <option value="All">✓ All Verification Statuses</option>
            <option value="Verified">🟢 Verified by Authorities / ASI</option>
            <option value="Community Verified">🔵 Community Verified (20+ Votes)</option>
            <option value="Needs Verification">🟡 Needs Verification</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Verified
          </span>
          <span className="flex items-center gap-1 text-saarthi-700">
            <span className="w-2.5 h-2.5 rounded-full bg-saarthi-600"></span> Community Verified
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Needs Verification
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Full-Scale Map (7 cols) + Reports Stream (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Leaflet Live Map */}
        <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md flex flex-col min-h-[550px]">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-saarthi-400" />
              <span>Live India Accessibility Audit Grid ({filteredReports.length} pins)</span>
            </span>
            <span className="text-slate-400">Click any pin to inspect & vote</span>
          </div>

          <div className="flex-1 w-full relative z-0 isolate">
            <MapContainer
              center={[27.1751, 78.0421]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: '100%', minHeight: '500px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredReports.map((rep) => (
                <Marker
                  key={rep.id}
                  position={rep.coordinates}
                  icon={createReportIcon(rep.type, rep.status)}
                >
                  <Popup>
                    <div className="space-y-2 max-w-[240px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {rep.type}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700">
                          {rep.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">{rep.title}</h4>
                      <p className="text-[11px] text-slate-600">{rep.description}</p>
                      <div className="pt-2 border-t flex justify-between items-center text-[10px]">
                        <span>By {rep.contributor}</span>
                        <span className="font-bold text-emerald-600">✓ {rep.confirmCount}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Right: Community Reports Stream & Voting */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Crowdsourced Contributions Stream
          </h3>

          <div className="space-y-3.5 max-h-[550px] overflow-y-auto pr-1">
            {filteredReports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-saarthi-600 uppercase tracking-wider">
                      {rep.type} • {rep.destinationName}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{rep.title}</h4>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap border ${
                    rep.status === 'Verified'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : rep.status === 'Community Verified'
                      ? 'bg-saarthi-50 text-saarthi-800 border-saarthi-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {rep.description}
                </p>

                {rep.photoUrl && (
                  <div className="h-32 rounded-2xl overflow-hidden border border-slate-100">
                    <img src={rep.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>By <strong>{rep.contributor}</strong> ({rep.date})</span>

                  {/* Voting Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => voteReport(rep.id, 'confirm')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 transition-colors"
                      title="Confirm this accessibility info is accurate"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{rep.confirmCount}</span>
                    </button>

                    <button
                      onClick={() => voteReport(rep.id, 'dispute')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold text-xs flex items-center gap-1 transition-colors"
                      title="Dispute / Report outdated"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{rep.disputeCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Report Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              Submit Accessibility Report
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Help fellow travelers by contributing verified ground observations.
            </p>

            <form onSubmit={handleSubmitNewReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Associated Destination</label>
                <select
                  value={formDestId}
                  onChange={(e) => setFormDestId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                >
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Report Category</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                >
                  <option value="Ramp">🦽 Ramp / Incline</option>
                  <option value="Elevator">🛗 Elevator / Lift</option>
                  <option value="Accessible Entrance">🚪 Accessible Entrance / Zero Step</option>
                  <option value="Accessible Washroom">🚻 PwD Washroom</option>
                  <option value="Accessible Transport">🚌 Low-Floor Transit / Buggy</option>
                  <option value="Obstacle / Blocked Path">⚠️ Obstacle / Damaged Ramp</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. New anti-skid ramp installed at West Gate"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description & Measurements</label>
                <textarea
                  required
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe slope, width, surface grip, presence of handrails, or obstacles..."
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Photo Verification URL</label>
                <input
                  type="text"
                  value={formPhoto}
                  onChange={(e) => setFormPhoto(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-saarthi-600 hover:bg-saarthi-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
              >
                Publish Report to Live Community Map
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
