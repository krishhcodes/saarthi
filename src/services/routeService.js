/**
 * routeService.js
 * Dynamic Accessibility-First Route Generator for Saarthi
 *
 * Architecture:
 *   - OSRM: Real road distances & durations (NOT Haversine math)
 *   - Overpass: Real transit infrastructure discovery (stations, airports, metro)
 *   - Dynamic mode assembly: Only shows transit modes that ACTUALLY EXIST near the route
 *   - Airport detour feasibility rule: Flight only shown when it makes geographical sense
 */

import { PLACES_CATALOG } from '../data/placesData.js';
import { fetchRealRoadDistance } from './osrmService.js';
import { getNearbyHazards, getNearbyAccessibleAids } from './communityReportService.js';


// ─────────────────────────────────────────────────────────────────────────────
// Known Main Accessible Entrances for Top Heritage Monuments
// ─────────────────────────────────────────────────────────────────────────────
export const MAIN_ACCESSIBLE_ENTRANCES = {
  'taj-mahal': {
    name: 'East Gate Accessible Ramp Entrance (Shilpgram Side)',
    lat: 27.1733,
    lng: 78.0435,
    city: 'Agra, Uttar Pradesh',
    dropOff: 'Shilpgram PwD Parking & Buggy Stand',
    rampIncline: '1:14 (Gentle Slope)',
    width: '150 cm',
    features: ['Double handrails', 'Tactile paving to forecourt', 'Electric golf shuttle', 'Anti-skid composite stone']
  },
  'qutub-minar': {
    name: 'Main Accessible Ticket Gate (Ramped Entrance)',
    lat: 28.5244,
    lng: 77.1855,
    city: 'New Delhi',
    dropOff: 'Qutub Minar Dedicated PwD Parking Bay',
    rampIncline: '1:12 (Standard)',
    width: '140 cm',
    features: ['Zero-step turnstile', 'Audio guide counter', 'Direct paved trail to Alai Darwaza']
  },
  'kashi-vishwanath': {
    name: 'Gate 4 Accessible Entry (Godowlia Side)',
    lat: 25.3109,
    lng: 83.0104,
    city: 'Varanasi, Uttar Pradesh',
    dropOff: 'Godowlia PwD E-Rickshaw Stand',
    rampIncline: '1:12 (Ramped Corridor)',
    width: '160 cm',
    features: ['Wheelchair corridor', 'Glass elevator to Ganga Deck', 'Free battery wheelchair stand']
  },
  'amber-fort': {
    name: 'Maota Lake Shuttle Entry (Accessible Golf Cart Gate)',
    lat: 26.9855,
    lng: 75.8513,
    city: 'Jaipur, Rajasthan',
    dropOff: 'Amber Lower Parking Golf Cart Station',
    rampIncline: 'Level Ground Shuttle',
    width: '180 cm',
    features: ['Electric golf cart to Jaleb Chowk', 'Bypasses elephant step hill', 'Paved lower courtyard']
  },
  'red-fort': {
    name: 'Lahori Gate Accessible Side Ramp Entry',
    lat: 28.6562,
    lng: 77.2410,
    city: 'Old Delhi',
    dropOff: 'Red Fort ASI Accessible Parking Plaza',
    rampIncline: '1:12 (Steel Mesh Ramp)',
    width: '150 cm',
    features: ['Direct access to Chhatta Chowk', 'Braille signage plaza', 'Shaded ramp way']
  },
  'humayuns-tomb': {
    name: 'West Gate Entrance (Main Accessible Ramp Entry)',
    lat: 28.5933,
    lng: 77.2507,
    city: 'New Delhi',
    dropOff: 'Humayun Tomb PwD Car Park',
    rampIncline: '1:15 (Very Gentle)',
    width: '160 cm',
    features: ['Smooth stone causeway', 'Tactile paving trail', 'Access to Bu Halima garden']
  },
  'mysore-palace': {
    name: 'North Gate (Varaha Gate - Accessible Ramp)',
    lat: 12.3052,
    lng: 76.6552,
    city: 'Mysuru, Karnataka',
    dropOff: 'Varaha Gate PwD Drop-Off Zone',
    rampIncline: '1:12',
    width: '160 cm',
    features: ['Hydraulic palace elevator', 'Free loaner manual wheelchairs', 'Rubberized ramp entryway']
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Quick Origin Hub Presets (used in the UI chip strip)
// ─────────────────────────────────────────────────────────────────────────────
export const QUICK_ORIGIN_HUBS = [
  { id: 'delhi-ndls', name: 'New Delhi Railway Station (NDLS)', city: 'Delhi', lat: 28.6429, lng: 77.2195, type: 'train_station' },
  { id: 'delhi-igi', name: 'IGI Airport Terminal 3 (DEL)', city: 'Delhi', lat: 28.5562, lng: 77.1000, type: 'airport' },
  { id: 'raipur-jn', name: 'Raipur Junction Railway Station', city: 'Raipur', lat: 21.2575, lng: 81.6296, type: 'train_station' },
  { id: 'agra-cantt', name: 'Agra Cantt Railway Station', city: 'Agra', lat: 27.1583, lng: 78.0090, type: 'train_station' },
  { id: 'jaipur-jn', name: 'Jaipur Junction Railway Station', city: 'Jaipur', lat: 26.9196, lng: 75.7878, type: 'train_station' },
  { id: 'varanasi-bsb', name: 'Varanasi Cantt Railway Station', city: 'Varanasi', lat: 25.3283, lng: 82.9863, type: 'train_station' }
];

// ─────────────────────────────────────────────────────────────────────────────
// Resolve the Main Accessible Entrance for any destination
// ─────────────────────────────────────────────────────────────────────────────
export function resolveMainAccessibleEntrance(destination) {
  if (!destination) return null;

  const id = destination.id || destination.name?.toLowerCase().replace(/\s+/g, '-');

  for (const [key, entrance] of Object.entries(MAIN_ACCESSIBLE_ENTRANCES)) {
    if (id === key || destination.name?.toLowerCase().includes(key.replace(/-/g, ' '))) {
      return { ...entrance, destinationId: destination.id, destinationName: destination.name };
    }
  }

  const matchedCatalog = PLACES_CATALOG.find(p =>
    p.id === destination.id || p.name.toLowerCase() === destination.name?.toLowerCase()
  );
  if (matchedCatalog?.visitorPoints) {
    const pt = matchedCatalog.visitorPoints.find(p =>
      p.type === 'entrance' || p.name?.toLowerCase().includes('gate') || p.name?.toLowerCase().includes('entry')
    );
    if (pt) {
      return {
        name: pt.name,
        lat: pt.lat, lng: pt.lng,
        city: destination.city || matchedCatalog.city,
        dropOff: `${destination.name} Main PwD Drop-Off Plaza`,
        rampIncline: '1:12 (Step-Free)', width: '150 cm',
        features: ['Step-free entrance', 'Accessible security lane'],
        destinationId: destination.id, destinationName: destination.name
      };
    }
  }

  const destLat = destination.lat || destination.coordinates?.[0] || 27.1738;
  const destLng = destination.lng || destination.coordinates?.[1] || 78.0421;
  return {
    name: `${destination.name || 'Destination'} — Main Accessible Entrance`,
    lat: destLat, lng: destLng,
    city: destination.city || 'India',
    dropOff: `${destination.name || 'Destination'} Drop-Off Plaza`,
    rampIncline: '1:12 (Step-Free)', width: '150 cm',
    features: ['Step-free ramped approach', 'Wheelchair priority entry'],
    destinationId: destination.id, destinationName: destination.name
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE BUILDERS — Take real distance/duration and infrastructure data
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build road route options using real OSRM distance + duration.
 */
export function buildRoadRoutes(originName, distanceKm, durationMin, destEntrance, tripTier) {
  const fmt = (m) => {
    if (m < 60) return `${m} mins`;
    const h = Math.floor(m / 60), r = m % 60;
    return r > 0 ? `${h} hr${h > 1 ? 's' : ''} ${r} min${r > 1 ? 's' : ''}` : `${h} hr${h > 1 ? 's' : ''}`;
  };

  if (tripTier === 'local') {
    return [
      {
        id: `road-wav-${Date.now()}`,
        mode: 'road',
        modeLabel: '🚖 Direct Accessible Cab / Auto',
        name: 'Direct Accessible WAV Cab / Ramped Auto',
        type: '100% Step-Free Door-to-Door City Transit',
        isRecommended: true,
        totalDistance: `${distanceKm} km`,
        estimatedTime: fmt(durationMin),
        accessibilityScore: 98,
        stairsCount: 0,
        rampsCount: 2,
        elevatorsCount: 0,
        vehicleType: 'Rear-Ramp Wheelchair Accessible Vehicle (WAV) or Low-Step CNG Auto',
        steps: [
          { instruction: `Board Wheelchair Accessible Cab / Low-Step Auto at ${originName}.`, distance: '0m', accessibility: 'Foldable ramp, 4-point wheelchair floor lock' },
          { instruction: `Transit via city road directly to ${destEntrance.destinationName || 'destination'}.`, distance: `${distanceKm} km`, accessibility: 'Smooth paved arterial road' },
          { instruction: `Alight at ${destEntrance.dropOff}.`, distance: '50m', accessibility: 'Zero-curb smooth pavement' },
          { instruction: `Enter ${destEntrance.name} via ${destEntrance.rampIncline} ramp.`, distance: '100m', accessibility: `${destEntrance.width} wide double-handrail ramp` }
        ]
      },
      {
        id: `road-pvt-${Date.now()}`,
        mode: 'road',
        modeLabel: '🚗 Private Vehicle to PwD Parking Bay',
        name: 'Private / Self-Driven Accessible Vehicle',
        type: 'Direct Navigation to Dedicated Disabled Parking Plaza',
        isRecommended: false,
        totalDistance: `${distanceKm} km`,
        estimatedTime: fmt(Math.round(durationMin * 0.85)),
        accessibilityScore: 96,
        stairsCount: 0,
        rampsCount: 1,
        elevatorsCount: 0,
        vehicleType: 'Personal Accessible Vehicle (Hand controls / Swivel seat)',
        steps: [
          { instruction: `Drive from ${originName} to the designated PwD Parking Bay at ${destEntrance.dropOff}.`, distance: `${distanceKm} km`, accessibility: 'Your own vehicle with full hand-control flexibility' },
          { instruction: `Park at the dedicated PwD bay (reserved). Proceed to ${destEntrance.name}.`, distance: '80m', accessibility: 'Level access from PwD bay to entrance ramp' }
        ]
      }
    ];
  }

  // Intercity or Long Distance road route
  const restStops = Math.max(1, Math.floor(distanceKm / 90));
  const timePlusCoffee = fmt(durationMin + restStops * 20);

  return [
    {
      id: `road-highway-${Date.now()}`,
      mode: 'road',
      modeLabel: '🚗 Highway Accessible WAV Cab',
      name: 'Highway Express Accessible WAV Cab',
      type: '100% Step-Free Intercity Highway Corridor',
      isRecommended: true,
      totalDistance: `${distanceKm} km`,
      estimatedTime: timePlusCoffee,
      accessibilityScore: 96,
      stairsCount: 0,
      rampsCount: 4,
      elevatorsCount: 0,
      vehicleType: 'Rear-Ramp Wheelchair Accessible Vehicle (WAV) / AC SUV',
      steps: [
        { instruction: `Board verified WAV cab at ${originName}.`, distance: '0m', accessibility: 'Hydraulic ramp, 4-point wheelchair floor lock' },
        { instruction: 'Highway transit with smooth National Highway corridor.', distance: `${Math.round(distanceKm * 0.9)} km`, accessibility: 'AC cabin with reclining support' },
        { instruction: `Comfort rest stop at NHAI accessible highway plaza.`, distance: '0m', accessibility: 'Roll-in PwD washroom, grab bars, level food court' },
        { instruction: `Arrive at ${destEntrance.dropOff}.`, distance: '100m', accessibility: 'Zero curb steps, designated PwD bay' },
        { instruction: `Enter ${destEntrance.name} via ${destEntrance.rampIncline} ramp.`, distance: '120m', accessibility: `${destEntrance.width} wide anti-skid ramp` }
      ]
    }
  ];
}

/**
 * Build a 3-leg multi-modal train route with real OSRM distances per road leg.
 *
 * Leg 1: Origin ──(road cab / direct)──▶ Origin Railway Station
 * Leg 2: Origin Station ──(train)──▶ Destination Station
 * Leg 3: Destination Station ──(road cab)──▶ Monument Main Accessible Entrance
 *
 * @param {string} originName
 * @param {number} totalRoadDistanceKm - from OSRM
 * @param {Array}  originStations - Discovered stations
 * @param {Array}  destStations   - Discovered stations
 * @param {Object} destEntrance
 * @param {number} oLat, oLng    - Origin coords
 * @param {number} dLat, dLng    - Destination coords
 * @returns {Promise<Object>}
 */
export async function buildTrainRoute(
  originName, totalRoadDistanceKm,
  originStations, destStations, destEntrance,
  oLat, oLng, dLat, dLng
) {
  const fmt = (m) => {
    if (m < 60) return `${m} mins`;
    const h = Math.floor(m / 60), r = m % 60;
    return r > 0 ? `${h} hr${h > 1 ? 's' : ''} ${r} min${r > 1 ? 's' : ''}` : `${h} hr${h > 1 ? 's' : ''}`;
  };

  const oStation = originStations[0] || { name: 'New Delhi Railway Station (NDLS)', lat: oLat, lng: oLng, distanceKm: 0 };
  const dStation = destStations[0] || { name: 'Agra Cantt Railway Station (AGC)', lat: dLat, lng: dLng, distanceKm: 4.8 };

  // Check if origin is already at the railway station (e.g. NDLS, Raipur Jn)
  const isDirectOnboard = Boolean(
    (typeof oStation.distanceKm === 'number' && oStation.distanceKm <= 1.2) ||
    /railway|station|junction|\b(ndls|nzm|anvt|agc|bsb|rpr|jp|csmt|sbc)\b/i.test(originName)
  );

  let leg1Km = isDirectOnboard ? 0 : (oStation.distanceKm ?? 4.5);
  let leg1Min = isDirectOnboard ? 5 : Math.max(10, Math.round((leg1Km / 24) * 60));
  let leg3Km = typeof dStation.distanceKm === 'number' && dStation.distanceKm > 0 ? dStation.distanceKm : 5.2;
  let leg3Min = Math.max(12, Math.round((leg3Km / 22) * 60));

  // Query real OSRM distances for connecting road legs if not direct
  try {
    const [leg1Result, leg3Result] = await Promise.all([
      (!isDirectOnboard && oStation.lat && oStation.lng) ? fetchRealRoadDistance(oLat, oLng, oStation.lat, oStation.lng) : null,
      (dStation.lat && dStation.lng) ? fetchRealRoadDistance(dStation.lat, dStation.lng, dLat, dLng) : null
    ]);
    if (leg1Result && !isDirectOnboard) { leg1Km = leg1Result.distanceKm; leg1Min = leg1Result.durationMin; }
    if (leg3Result) { leg3Km = leg3Result.distanceKm; leg3Min = leg3Result.durationMin; }
  } catch {
    // Retain defaults
  }

  // Train distance: realistic rail track distance
  const trainDistanceKm = Math.max(45, Math.round(totalRoadDistanceKm * 0.92));
  const trainSpeedKmh = trainDistanceKm > 300 ? 95 : trainDistanceKm > 150 ? 82 : 68;
  const trainMin = Math.round((trainDistanceKm / trainSpeedKmh) * 60) + 20; // 20 min boarding buffer
  const totalMin = leg1Min + trainMin + leg3Min;

  const leg1Steps = isDirectOnboard ? [
    { instruction: `Arrive at ${oStation.name} main accessible entrance & Divyangjan counter.`, distance: '0m', accessibility: 'Zero-step entrance, wheelchair ramp, tactile guiding path' },
    { instruction: `Board free IRCTC Sahayak electric buggy directly to Platform / Coach D1.`, distance: '120m', accessibility: 'Level platform concourse, elevator access, no foot-overbridge stairs' }
  ] : [
    { instruction: `Board Wheelchair Accessible Cab (WAV) from ${originName}.`, distance: '0m', accessibility: 'Hydraulic ramp, 4-point wheelchair floor lock' },
    { instruction: `Drive to ${oStation.name} — main accessible drop-off porch.`, distance: `${typeof leg1Km === 'number' ? leg1Km.toFixed(1) : leg1Km} km`, accessibility: 'Level drop-off at station accessible gate' },
    { instruction: `Board IRCTC Sahayak electric buggy to Coach D1.`, distance: '150m', accessibility: 'Platform elevator, tactile paving' }
  ];

  const legs = [
    {
      legIndex: 1,
      mode: 'road',
      modeLabel: isDirectOnboard ? 'Leg 1: Station Onboarding' : 'Leg 1: Road to Station',
      emoji: isDirectOnboard ? '🚉' : '🚖',
      color: isDirectOnboard ? 'emerald' : 'saarthi',
      from: originName,
      to: oStation.name,
      distanceKm: leg1Km,
      durationMin: leg1Min,
      steps: leg1Steps
    },
    {
      legIndex: 2,
      mode: 'train',
      modeLabel: 'Leg 2: Indian Railways Express',
      emoji: '🚆',
      color: 'purple',
      from: oStation.name,
      to: dStation.name,
      distanceKm: trainDistanceKm,
      durationMin: trainMin,
      steps: [
        { instruction: `Occupy Coach D1 — reserved Divyangjan wheelchair space.`, distance: '0m', accessibility: '110 cm wide sliding door, 4-point floor locks, dedicated wheelchair berth' },
        { instruction: `Train journey: ${oStation.name} → ${dStation.name} (Vande Bharat / Express).`, distance: `${trainDistanceKm} km`, accessibility: 'Braille seat markers, roll-in bio-vacuum toilet, Sahayak on-board support' },
        { instruction: `Alight at ${dStation.name}. Board Sahayak electric buggy to exit elevator.`, distance: '100m', accessibility: 'Glass elevator to street level, zero stair climbing' }
      ]
    },
    {
      legIndex: 3,
      mode: 'road',
      modeLabel: 'Leg 3: Road to Monument',
      emoji: '🚖',
      color: 'saarthi',
      from: dStation.name,
      to: destEntrance.name,
      distanceKm: leg3Km,
      durationMin: leg3Min,
      steps: [
        { instruction: `Pre-booked WAV taxi from ${dStation.name} to ${destEntrance.destinationName || 'destination'}.`, distance: `${typeof leg3Km === 'number' ? leg3Km.toFixed(1) : leg3Km} km`, accessibility: 'Rear-ramp vehicle, zero curb steps' },
        { instruction: `Alight at ${destEntrance.dropOff}.`, distance: '50m', accessibility: 'Designated PwD parking bay, level pavement' },
        { instruction: `Enter ${destEntrance.name} via ${destEntrance.rampIncline || '1:12'} ramp.`, distance: '120m', accessibility: `${destEntrance.width || '150 cm'} wide anti-skid ramp with double handrails` }
      ]
    }
  ];

  const steps = legs.flatMap(leg =>
    leg.steps.map(s => ({ ...s, _legMode: leg.mode, _legLabel: leg.modeLabel, _legColor: leg.color, _legEmoji: leg.emoji }))
  );

  const totalKm = (leg1Km + trainDistanceKm + leg3Km);

  return {
    id: `train-multileg-${Date.now()}`,
    mode: 'train',
    modeLabel: '🚆 Road + Rail + Road Hybrid Corridor',
    name: `Indian Railways: ${oStation.name} → ${dStation.name}`,
    type: 'Step-Free 3-Leg Multi-Modal Route — Station Onboarding ➜ Divyangjan Coach ➜ Monument Cab',
    isRecommended: true,
    totalDistance: `${typeof totalKm === 'number' ? totalKm.toFixed(0) : totalKm} km`,
    estimatedTime: fmt(totalMin),
    accessibilityScore: 99,
    stairsCount: 0,
    rampsCount: 8,
    elevatorsCount: 3,
    vehicleType: 'IRCTC Divyangjan Coach D1 + WAV Accessible Cab',
    legs,
    steps,
    leg1: { label: isDirectOnboard ? 'Station Onboarding' : 'Origin → Station', km: leg1Km, time: fmt(leg1Min), station: oStation.name },
    leg2: { label: 'Train Journey', km: trainDistanceKm, time: fmt(trainMin), from: oStation.name, to: dStation.name },
    leg3: { label: 'Station → Entrance', km: leg3Km, time: fmt(leg3Min), station: dStation.name }
  };
}


/**
 * Build flight route using real discovered airport names.
 */
export function buildFlightRoute(originName, distanceKm, originAirports, destAirports, destEntrance) {
  const fmt = (m) => {
    if (m < 60) return `${m} mins`;
    const h = Math.floor(m / 60), r = m % 60;
    return r > 0 ? `${h} hr${h > 1 ? 's' : ''} ${r} min${r > 1 ? 's' : ''}` : `${h} hr${h > 1 ? 's' : ''}`;
  };

  const oAirport = originAirports[0] || { name: 'Nearest Airport', iata: '---' };
  const dAirport = destAirports[0] || { name: 'Destination Airport', iata: '---' };
  const flightKm = Math.round(distanceKm * 0.82);
  const flightMinutes = 75 + Math.min(60, Math.round(flightKm / 12)) + 120; // transit + ~2hr airport buffer

  return {
    id: `flight-air-${Date.now()}`,
    mode: 'flight',
    modeLabel: '✈️ Road + Flight (Multi-Modal Air Corridor)',
    name: `Domestic Flight: ${oAirport.name}${oAirport.iata ? ` (${oAirport.iata})` : ''} → ${dAirport.name}${dAirport.iata ? ` (${dAirport.iata})` : ''}`,
    type: 'Rapid Step-Free Long-Distance Air Travel with DGCA Ambulift Assistance',
    isRecommended: false,
    totalDistance: `${flightKm} km`,
    estimatedTime: fmt(flightMinutes),
    accessibilityScore: 98,
    stairsCount: 0,
    rampsCount: 8,
    elevatorsCount: 6,
    vehicleType: `Commercial Aircraft with DGCA Ambulift & Aisle Chair + AC WAV Cab`,
    steps: [
      { instruction: `Accessible cab from ${originName} to ${oAirport.name}.`, distance: `${oAirport.distanceKm?.toFixed(1) || '~12'} km`, accessibility: 'Ramp-equipped vehicle, level terminal drop-off' },
      { instruction: 'Special Assistance check-in. Personal wheelchair tagged for aircraft hold (PRM WCHR code).', distance: '100m', accessibility: 'Priority Divyangjan counter, free transit wheelchair' },
      { instruction: 'Priority security lane. Board via Ambulift — hydraulic scissor lift from tarmac to aircraft door.', distance: '50m', accessibility: 'Hydraulic ambulift — zero stair climbing to cabin' },
      { instruction: `Domestic flight transit to ${dAirport.name}.`, distance: `${flightKm} km`, accessibility: 'On-board aisle chair, accessible front-row seating, grab-bar lavatory' },
      { instruction: 'Deplane via Ambulift. Personal wheelchair returned at aircraft door.', distance: '50m', accessibility: 'Direct tarmac reclaim' },
      { instruction: `Pre-booked WAV taxi from ${dAirport.name} to ${destEntrance.name}.`, distance: `${dAirport.distanceKm?.toFixed(1) || '~14'} km`, accessibility: 'Rear-ramp WAV, direct PwD bay access at monument' }
    ]
  };
}

/**
 * Dynamically enrich calculated routes with live crowdsourced community audits,
 * obstacles, and verified step-free access points near the destination or corridor.
 */
export function enrichRoutesWithCommunityData(routes, originCoords, destEntrance, communityReports = []) {
  if (!routes || !routes.length || !communityReports || !communityReports.length) return routes;

  const destCoords = [destEntrance?.lat || 27.1738, destEntrance?.lng || 78.0421];
  const nearbyHazards = getNearbyHazards(destCoords, 2.5, communityReports);
  const nearbyAids = getNearbyAccessibleAids(destCoords, 2.5, communityReports);

  return routes.map(route => {
    let penalty = 0;
    let bonus = 0;
    const advisories = [];
    const confirmedAids = [];

    nearbyHazards.forEach(h => {
      penalty += h.status === 'Verified' ? 6 : 3;
      advisories.push({
        id: h.id,
        type: 'hazard',
        title: h.title,
        description: h.description,
        status: h.status,
        date: h.date
      });
    });

    nearbyAids.forEach(a => {
      bonus += a.status === 'Verified' ? 2 : 1;
      confirmedAids.push({
        id: a.id,
        type: 'aid',
        title: a.title,
        description: a.description,
        status: a.status
      });
    });

    const adjustedScore = Math.max(70, Math.min(99, route.accessibilityScore - penalty + bonus));

    // If active hazards exist, prepend a caution step or note to the route
    const enrichedSteps = [...(route.steps || [])];
    if (advisories.length > 0) {
      enrichedSteps.unshift({
        instruction: `⚠️ Ground Caution: ${advisories[0].title}. Verified alternative ramp path suggested.`,
        distance: '0m',
        accessibility: 'Community Audited Alert'
      });
    }

    return {
      ...route,
      accessibilityScore: adjustedScore,
      communityAlerts: advisories,
      communityVerifiedAids: confirmedAids,
      hasCommunityHazard: advisories.length > 0,
      steps: enrichedSteps
    };
  });
}

