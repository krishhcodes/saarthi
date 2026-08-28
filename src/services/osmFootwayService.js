/**
 * osmFootwayService.js
 * Fetches real, surveyed pedestrian footway geometries from OpenStreetMap
 * via the free Overpass API — no API key, no billing, works for any place on Earth.
 *
 * Each returned footway is color-coded for accessibility:
 *   🟢 accessible  — paved flat footways, wheelchair=yes, pedestrian zones
 *   🟡 partial     — cobblestone, narrow, gravel, unknown surface, incline > 5%
 *   🔴 inaccessible — steps/stairs, wheelchair=no, steep, sandy/unpaved
 */

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';

// In-memory cache: placeId → { footways, timestamp }
const _cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Compute a bounding box around a lat/lng center.
 * @param {number} lat
 * @param {number} lng
 * @param {number} radiusMeters – half-side of the bbox square (default 350m)
 * @returns {string} "south,west,north,east"
 */
function buildBbox(lat, lng, radiusMeters = 350) {
  const latDelta = radiusMeters / 111320;
  const lngDelta = radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180));
  return [
    (lat - latDelta).toFixed(6),
    (lng - lngDelta).toFixed(6),
    (lat + latDelta).toFixed(6),
    (lng + lngDelta).toFixed(6)
  ].join(',');
}

/**
 * Evaluate accessibility status from raw OSM way tags.
 * Returns { status, color, dashArray, weight, opacity }
 */
export function evaluateFootwayAccessibility(tags = {}, disabilityKey = 'mobility') {
  const hw = tags.highway || '';
  const wheelchair = tags.wheelchair || '';
  const surface = tags.surface || '';
  const smoothness = tags.smoothness || '';
  const incline = tags.incline || '';
  const width = parseFloat(tags.width) || null;
  const tactile = tags.tactile_paving || '';
  const ramp = tags.ramp || tags['ramp:wheelchair'] || '';
  const stepCount = parseInt(tags.step_count) || 0;

  // ────────────────────────────────────────────────
  // STEPS → always inaccessible for mobility
  // ────────────────────────────────────────────────
  if (hw === 'steps') {
    // If there's a parallel ramp tagged, make it partial
    if (ramp === 'yes') {
      return { status: 'partial', reason: 'Steps with ramp alternative' };
    }
    return { status: 'inaccessible', reason: `Steps (${stepCount ? stepCount + ' steps' : 'count unknown'})` };
  }

  // ────────────────────────────────────────────────
  // EXPLICIT WHEELCHAIR TAGS → highest priority signal
  // ────────────────────────────────────────────────
  if (wheelchair === 'yes') {
    return { status: 'accessible', reason: 'Explicitly wheelchair-accessible (OSM)' };
  }
  if (wheelchair === 'no') {
    return { status: 'inaccessible', reason: 'Explicitly not wheelchair-accessible (OSM)' };
  }
  if (wheelchair === 'limited') {
    return { status: 'partial', reason: 'Limited wheelchair access (OSM)' };
  }

  // ────────────────────────────────────────────────
  // DISABILITY-SPECIFIC LOGIC
  // ────────────────────────────────────────────────
  if (disabilityKey === 'visual') {
    if (tactile === 'yes') return { status: 'accessible', reason: 'Tactile paving present' };
    if (tactile === 'no') return { status: 'partial', reason: 'No tactile paving' };
  }

  // ────────────────────────────────────────────────
  // SURFACE QUALITY EVALUATION
  // ────────────────────────────────────────────────
  const accessibleSurfaces = ['paved', 'asphalt', 'concrete', 'concrete:plates', 'paving_stones', 'sett'];
  const partialSurfaces = ['cobblestone', 'compacted', 'fine_gravel', 'wood', 'metal'];
  const inaccessibleSurfaces = ['gravel', 'sand', 'dirt', 'earth', 'grass', 'mud', 'unpaved'];

  if (inaccessibleSurfaces.includes(surface)) {
    return { status: 'inaccessible', reason: `Unpaved surface: ${surface}` };
  }
  if (partialSurfaces.includes(surface)) {
    return { status: 'partial', reason: `Rough surface: ${surface}` };
  }

  // ────────────────────────────────────────────────
  // SMOOTHNESS EVALUATION
  // ────────────────────────────────────────────────
  if (smoothness === 'excellent' || smoothness === 'good') {
    return { status: 'accessible', reason: `Smooth surface (${smoothness})` };
  }
  if (smoothness === 'bad' || smoothness === 'very_bad' || smoothness === 'horrible') {
    return { status: 'inaccessible', reason: `Poor surface quality (${smoothness})` };
  }
  if (smoothness === 'intermediate') {
    return { status: 'partial', reason: 'Intermediate surface smoothness' };
  }

  // ────────────────────────────────────────────────
  // INCLINE EVALUATION
  // ────────────────────────────────────────────────
  const inclineNum = parseFloat(incline);
  if (!isNaN(inclineNum)) {
    if (Math.abs(inclineNum) > 8) return { status: 'inaccessible', reason: `Steep incline: ${incline}` };
    if (Math.abs(inclineNum) > 5) return { status: 'partial', reason: `Moderate incline: ${incline}` };
  }
  if (incline === 'steep') {
    return { status: 'inaccessible', reason: 'Steep incline (tagged)' };
  }

  // ────────────────────────────────────────────────
  // WIDTH EVALUATION
  // ────────────────────────────────────────────────
  if (width !== null && width < 0.9) {
    return { status: 'inaccessible', reason: `Too narrow: ${width}m` };
  }
  if (width !== null && width < 1.2) {
    return { status: 'partial', reason: `Narrow: ${width}m` };
  }

  // ────────────────────────────────────────────────
  // HIGHWAY TYPE DEFAULTS
  // ────────────────────────────────────────────────
  if (hw === 'pedestrian' || hw === 'living_street') {
    // Wide designated pedestrian zones → likely flat and accessible
    return { status: 'accessible', reason: 'Designated pedestrian zone' };
  }
  if (hw === 'footway') {
    // Footway with paved surface or no surface tag — default accessible for heritage sites
    if (accessibleSurfaces.includes(surface)) {
      return { status: 'accessible', reason: `Paved footway (${surface})` };
    }
    // No surface data — optimistic partial (we don't know)
    return { status: 'partial', reason: 'Footway — surface data unavailable' };
  }
  if (hw === 'path') {
    return { status: 'partial', reason: 'Informal path — surface unknown' };
  }

  return { status: 'partial', reason: 'Walkway — limited tag data' };
}

/**
 * Get visual rendering config for accessibility status.
 */
export function getFootwayStyle(status, isHighlighted = false) {
  const styles = {
    accessible: {
      color: isHighlighted ? '#059669' : '#10b981',
      glowColor: '#047857',
      weight: isHighlighted ? 5 : 3,
      opacity: isHighlighted ? 1 : 0.85,
      dashArray: null
    },
    partial: {
      color: isHighlighted ? '#d97706' : '#f59e0b',
      glowColor: '#b45309',
      weight: isHighlighted ? 4 : 2.5,
      opacity: isHighlighted ? 0.95 : 0.75,
      dashArray: '6, 4'
    },
    inaccessible: {
      color: isHighlighted ? '#dc2626' : '#ef4444',
      glowColor: '#b91c1c',
      weight: isHighlighted ? 3.5 : 2,
      opacity: isHighlighted ? 0.9 : 0.65,
      dashArray: '4, 6'
    }
  };
  return styles[status] || styles.partial;
}

/**
 * Fetch the complete pedestrian footway network for a monument or place.
 *
 * @param {object} place – must have { id, lat, lng }
 * @param {string} disabilityKey – 'mobility' | 'visual' | 'hearing' | 'cognitive'
 * @param {number} radiusMeters – bounding box half-side (default 350m)
 * @returns {Promise<Array>} Array of footway objects with positions + accessibility evaluation
 */
export async function fetchFootways(place, disabilityKey = 'mobility', radiusMeters = 350) {
  const cacheKey = `${place.id || `${place.lat},${place.lng}`}-${disabilityKey}`;

  // Check cache
  if (_cache.has(cacheKey)) {
    const cached = _cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.footways;
    }
  }

  const bbox = buildBbox(place.lat, place.lng, radiusMeters);

  // Overpass QL query — fetches all pedestrian ways with full geometry
  const query = `
[out:json][timeout:20];
(
  way["highway"~"^(footway|pedestrian|path|steps|living_street)$"]["access"!~"^(private|no)$"](${bbox});
);
out geom qt;
`.trim();

  const url = `${OVERPASS_ENDPOINT}?data=${encodeURIComponent(query)}`;

  let data;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Overpass API error: ${response.status}`);
    data = await response.json();
  } catch (err) {
    console.warn('[OSM Footway] Fetch failed:', err.message);
    return []; // graceful empty — caller handles this
  }

  if (!data?.elements?.length) {
    console.info('[OSM Footway] No footway data returned for bbox:', bbox);
    return [];
  }

  // Convert OSM elements → Leaflet-ready footway objects
  const footways = data.elements
    .filter(el => el.type === 'way' && el.geometry && el.geometry.length >= 2)
    .map(el => {
      const tags = el.tags || {};
      const evaluation = evaluateFootwayAccessibility(tags, disabilityKey);
      const positions = el.geometry.map(node => [node.lat, node.lon]);

      return {
        id: `osm-${el.id}`,
        osmId: el.id,
        positions,
        tags,
        highway: tags.highway,
        name: tags.name || tags['name:en'] || null,
        surface: tags.surface || null,
        wheelchair: tags.wheelchair || null,
        smoothness: tags.smoothness || null,
        width: tags.width || null,
        incline: tags.incline || null,
        tactilePaving: tags.tactile_paving || null,
        status: evaluation.status,
        reason: evaluation.reason
      };
    });

  // Cache result
  _cache.set(cacheKey, { footways, timestamp: Date.now() });

  return footways;
}

/**
 * Clear cached footways for a specific place (useful after disability change).
 */
export function clearFootwayCache(placeId) {
  for (const key of _cache.keys()) {
    if (key.startsWith(placeId)) _cache.delete(key);
  }
}
