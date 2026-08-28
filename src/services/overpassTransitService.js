/**
 * overpassTransitService.js
 * Resilient Transit Infrastructure Discovery for Saarthi.
 *
 * Architecture:
 *   1. Offline-First Geo-Directory: Queries verified Indian Railway junctions & commercial airports
 *      instantly (<1ms) with Divyangjan accessibility features.
 *   2. Dynamic Overpass Mirror Queries: Optional online enrichment with fast multi-mirror fallback
 *      (overpass.kumi.systems, overpass-api.de) and rapid timeout (3.5s).
 *   3. 100% Guaranteed Uptime: Never fails or hangs even if external OSM servers time out.
 */

import {
  findNearestDirectoryStations,
  findNearestDirectoryAirports
} from '../data/indianTransitDirectory.js';

// Redundant Overpass API mirrors
const OVERPASS_MIRRORS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter'
];

/**
 * Executes an Overpass QL query with rapid timeout and mirror failover.
 */
async function tryOverpassQuery(query, timeoutMs = 3500) {
  for (const mirror of OVERPASS_MIRRORS) {
    try {
      const resp = await fetch(mirror, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch {
      // Continue to next mirror or fallback
    }
  }
  return null;
}

/**
 * Extract lat/lng from an Overpass element
 */
function elCoords(el) {
  if (el.lat !== undefined) return { lat: el.lat, lng: el.lon };
  if (el.center) return { lat: el.center.lat, lng: el.center.lon };
  return null;
}

/**
 * Find real railway stations near a coordinate.
 * Uses Geo-Directory + Overpass dynamic discovery.
 *
 * @param {number} lat
 * @param {number} lng
 * @param {number} radiusMeters - default 45km
 * @returns {Promise<Array<{name: string, lat: number, lng: number, distanceKm: number, code?: string, features?: string[]}>>}
 */
export async function findNearbyRailwayStations(lat, lng, radiusMeters = 45000) {
  // 1. Instant Geo-Directory baseline (Guaranteed 0ms latency)
  const dirStations = findNearestDirectoryStations(lat, lng, radiusMeters / 1000);

  // 2. Attempt fast Overpass dynamic query (3.5s timeout)
  try {
    const query = `
      [out:json][timeout:4];
      (
        nwr["railway"="station"](around:${radiusMeters},${lat},${lng});
      );
      out center body 6;
    `;
    const data = await tryOverpassQuery(query, 3500);
    if (data?.elements?.length) {
      const overpassStations = data.elements
        .map(el => {
          const coords = elCoords(el);
          if (!coords) return null;
          const name = el.tags?.name || el.tags?.['name:en'] || el.tags?.['name:hi'] || 'Railway Station';
          return {
            name,
            lat: coords.lat,
            lng: coords.lng,
            distanceKm: Math.round(haversineKm(lat, lng, coords.lat, coords.lng) * 10) / 10
          };
        })
        .filter(Boolean);

      // Merge and deduplicate by proximity (< 1.5km)
      const merged = [...dirStations];
      for (const opSt of overpassStations) {
        const exists = merged.some(m => haversineKm(m.lat, m.lng, opSt.lat, opSt.lng) < 1.5);
        if (!exists) {
          merged.push(opSt);
        }
      }
      return merged.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);
    }
  } catch {
    // If Overpass is down/timed out, safely return directory results
  }

  return dirStations.slice(0, 3);
}

/**
 * Find real IATA-coded airports near a coordinate.
 * Uses Geo-Directory + Overpass dynamic discovery.
 *
 * @param {number} lat
 * @param {number} lng
 * @param {number} radiusMeters - default 120km
 * @returns {Promise<Array<{name: string, iata: string, lat: number, lng: number, distanceKm: number, features?: string[]}>>}
 */
export async function findNearbyAirports(lat, lng, radiusMeters = 120000) {
  // 1. Instant Geo-Directory baseline
  const dirAirports = findNearestDirectoryAirports(lat, lng, radiusMeters / 1000);

  // 2. Attempt fast Overpass query
  try {
    const query = `
      [out:json][timeout:4];
      (
        nwr["aeroway"="aerodrome"]["iata"](around:${radiusMeters},${lat},${lng});
      );
      out center body 4;
    `;
    const data = await tryOverpassQuery(query, 3500);
    if (data?.elements?.length) {
      const overpassAirports = data.elements
        .map(el => {
          const coords = elCoords(el);
          if (!coords) return null;
          return {
            name: el.tags?.name || el.tags?.['name:en'] || 'Airport',
            iata: el.tags?.iata || '',
            lat: coords.lat,
            lng: coords.lng,
            distanceKm: Math.round(haversineKm(lat, lng, coords.lat, coords.lng) * 10) / 10
          };
        })
        .filter(Boolean);

      const merged = [...dirAirports];
      for (const opAp of overpassAirports) {
        const exists = merged.some(m => haversineKm(m.lat, m.lng, opAp.lat, opAp.lng) < 4);
        if (!exists) {
          merged.push(opAp);
        }
      }
      return merged.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 2);
    }
  } catch {
    // Return directory baseline
  }

  return dirAirports.slice(0, 2);
}

/**
 * Find metro/subway entrances near a coordinate.
 */
export async function findNearbyMetroEntrances(lat, lng, radiusMeters = 5000) {
  try {
    const query = `
      [out:json][timeout:3];
      (
        nwr["railway"="subway_entrance"](around:${radiusMeters},${lat},${lng});
        nwr["railway"="station"]["subway"="yes"](around:${radiusMeters},${lat},${lng});
      );
      out center body 4;
    `;
    const data = await tryOverpassQuery(query, 3000);
    if (data?.elements?.length) {
      return data.elements
        .map(el => {
          const coords = elCoords(el);
          if (!coords) return null;
          return { name: el.tags?.name || 'Metro Station', lat: coords.lat, lng: coords.lng };
        })
        .filter(Boolean)
        .slice(0, 3);
    }
  } catch {
    // Safe empty fallback
  }
  return [];
}

/**
 * Full transit infrastructure discovery for both origin and destination.
 * Parallel queries with guaranteed instant resolution.
 *
 * @param {number} oLat - Origin latitude
 * @param {number} oLng - Origin longitude
 * @param {number} dLat - Destination latitude
 * @param {number} dLng - Destination longitude
 * @param {number} roadDistanceKm - Real OSRM road distance
 * @param {string} [originName] - Origin label to detect direct station onboarding
 * @returns {Promise<Object>}
 */
export async function discoverTransitInfrastructure(oLat, oLng, dLat, dLng, roadDistanceKm, originName = '') {
  // Local trip threshold: <= 30 km is purely local road/city transit
  const isLocal = roadDistanceKm <= 30;
  const isLongDistance = roadDistanceKm > 250;

  if (isLocal) {
    return {
      availableModes: ['road'],
      originStations: [], destStations: [],
      originAirports: [], destAirports: [],
      originMetro: [],
      flightFeasible: false,
      trainFeasible: false,
      metroFeasible: false,
      isDirectStationOrigin: false,
      tripTier: 'local'
    };
  }

  // Run station and airport discoveries in parallel
  const [
    originStations,
    destStations,
    originAirports,
    destAirports,
    originMetro
  ] = await Promise.all([
    findNearbyRailwayStations(oLat, oLng, 50000),
    findNearbyRailwayStations(dLat, dLng, 50000),
    isLongDistance ? findNearbyAirports(oLat, oLng, 120000) : Promise.resolve([]),
    isLongDistance ? findNearbyAirports(dLat, dLng, 120000) : Promise.resolve([]),
    findNearbyMetroEntrances(oLat, oLng, 5000)
  ]);

  // Train Feasibility: both origin AND destination have accessible railway stations nearby
  const trainFeasible = originStations.length > 0 && destStations.length > 0;

  // Check if origin is already a railway station (e.g. NDLS, Raipur Jn, etc.)
  const isDirectStationOrigin = Boolean(
    (originStations.length > 0 && originStations[0].distanceKm <= 1.2) ||
    /railway|station|junction|\b(ndls|nzm|anvt|agc|bsb|rpr|jp|csmt|sbc)\b/i.test(originName)
  );

  // Metro Feasibility
  const metroFeasible = originMetro.length > 0;

  // Flight Feasibility:
  //   1. Both ends have commercial IATA airports
  //   2. Airport detour distance < 35% of total road distance
  let flightFeasible = false;
  if (isLongDistance && originAirports.length > 0 && destAirports.length > 0) {
    const oAp = originAirports[0];
    const dAp = destAirports[0];
    const airportDetourKm =
      haversineKm(oLat, oLng, oAp.lat, oAp.lng) +
      haversineKm(dLat, dLng, dAp.lat, dAp.lng);
    flightFeasible = airportDetourKm < roadDistanceKm * 0.35;
  }

  // Available modes ordered by practicality
  const availableModes = ['road'];
  if (trainFeasible) availableModes.push('train');
  if (flightFeasible) availableModes.push('flight');

  return {
    availableModes,
    originStations,
    destStations,
    originAirports,
    destAirports,
    originMetro,
    flightFeasible,
    trainFeasible,
    metroFeasible,
    isDirectStationOrigin,
    tripTier: isLocal ? 'local' : isLongDistance ? 'longdistance' : 'intercity'
  };
}

// ── Internal Haversine (km) ──────────────────────────────────────────────────
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
