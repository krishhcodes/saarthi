/**
 * osrmService.js
 * Real road distance & duration via OSRM (Open Source Routing Machine)
 * Uses the public demo server backed by OpenStreetMap road network data.
 *
 * Returns actual road-network distance (not straight-line math),
 * following real National Highways, state roads, city arteries.
 *
 * 100% Free — No API key required.
 */

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

/**
 * Fetches actual road distance and duration from OSRM.
 * @param {number} originLat
 * @param {number} originLng
 * @param {number} destLat
 * @param {number} destLng
 * @returns {Promise<{distanceKm: number, durationMin: number, distanceLabel: string, durationLabel: string}>}
 */
export async function fetchRealRoadDistance(originLat, originLng, destLat, destLng) {
  try {
    const url = `${OSRM_BASE}/${originLng},${originLat};${destLng},${destLat}?overview=false&alternatives=false`;
    const resp = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(6000)
    });

    if (!resp.ok) throw new Error(`OSRM HTTP ${resp.status}`);

    const data = await resp.json();
    if (data.code !== 'Ok' || !data.routes?.length) {
      throw new Error('OSRM returned no valid route');
    }

    const route = data.routes[0];
    const distanceKm = Math.round((route.distance / 1000) * 10) / 10; // meters → km, 1 decimal
    const durationMin = Math.round(route.duration / 60); // seconds → minutes

    return {
      distanceKm,
      durationMin,
      distanceLabel: `${distanceKm} km`,
      durationLabel: formatDuration(durationMin)
    };
  } catch (err) {
    console.warn('[OSRM] Failed, falling back to Haversine estimate:', err.message);
    return fallbackHaversineDistance(originLat, originLng, destLat, destLng);
  }
}

/**
 * Haversine fallback (in case OSRM is unreachable)
 */
function fallbackHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const directKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const windingFactor = directKm < 20 ? 1.32 : directKm < 100 ? 1.25 : 1.18;
  const distanceKm = Math.round(directKm * windingFactor * 10) / 10;

  // Speed heuristic for fallback only
  const avgKmh = distanceKm < 20 ? 22 : distanceKm < 100 ? 45 : 65;
  const durationMin = Math.round((distanceKm / avgKmh) * 60);

  return {
    distanceKm,
    durationMin,
    distanceLabel: `~${distanceKm} km`,
    durationLabel: formatDuration(durationMin),
    isFallback: true
  };
}

/**
 * Formats minutes into "X hrs Y mins" or "Z mins"
 */
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} mins`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0
    ? `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`
    : `${hrs} hr${hrs > 1 ? 's' : ''}`;
}
