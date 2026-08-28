/**
 * geocodingService.js
 * Free real-time location autocomplete, reverse geocoding, and Google Maps Navigation launcher.
 *
 * Uses:
 *  1. Photon (Komoot OSM Geocoder) - Fast, generous rate limits, autocomplete optimized.
 *  2. Nominatim (OpenStreetMap) - Reverse geocoding for GPS coordinate-to-address.
 *  3. Google Maps Universal Navigation URL Generator.
 *
 * 100% Free - No API key or credit card needed.
 */

const PHOTON_API = 'https://photon.komoot.io/api/';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

/**
 * Autocomplete location search across India.
 * @param {string} query - User search text (e.g. "Bilaspur", "Connaught Place", "Agra")
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array<{id: string, name: string, city: string, state: string, lat: number, lng: number, type: string}>>}
 */
export async function searchLocationSuggestions(query, limit = 6) {
  if (!query || query.trim().length < 2) return [];

  try {
    // Photon search biased towards India center [lat: 20.5937, lon: 78.9629]
    const url = `${PHOTON_API}?q=${encodeURIComponent(query)}&lat=20.5937&lon=78.9629&limit=${limit}`;
    const resp = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4000)
    });

    if (!resp.ok) return fallbackSearch(query);

    const data = await resp.json();
    if (!data?.features?.length) return fallbackSearch(query);

    return data.features.map((feature, idx) => {
      const p = feature.properties || {};
      const [lng, lat] = feature.geometry?.coordinates || [77.2195, 28.6429];

      // Format clean readable title and subtitle
      const mainName = p.name || p.street || p.city || query;
      const subtitleParts = [
        p.district || p.suburb,
        p.city,
        p.state,
        p.country
      ].filter(Boolean).filter((val, i, arr) => arr.indexOf(val) === i && val !== mainName);

      const subtitle = subtitleParts.join(', ');

      return {
        id: `geo-${idx}-${lat.toFixed(4)}-${lng.toFixed(4)}`,
        name: mainName,
        fullName: subtitle ? `${mainName}, ${subtitle}` : mainName,
        city: p.city || p.state || 'India',
        state: p.state || '',
        lat,
        lng,
        type: p.osm_value || p.type || 'location'
      };
    });
  } catch (err) {
    console.warn('[Geocoding failed, using fallback]', err.message);
    return fallbackSearch(query);
  }
}

/**
 * Fallback static keyword search for common Indian hubs
 */
function fallbackSearch(query) {
  const q = query.toLowerCase().trim();
  const knownHubs = [
    { name: 'Bilaspur Junction Railway Station', city: 'Bilaspur', state: 'Chhattisgarh', lat: 22.0833, lng: 82.1556, type: 'train_station' },
    { name: 'Bilaspur City Center', city: 'Bilaspur', state: 'Chhattisgarh', lat: 22.0797, lng: 82.1391, type: 'city' },
    { name: 'Bilaspur, Himachal Pradesh', city: 'Bilaspur', state: 'Himachal Pradesh', lat: 31.3328, lng: 76.7578, type: 'city' },
    { name: 'New Delhi Railway Station (NDLS)', city: 'Delhi', state: 'Delhi', lat: 28.6429, lng: 77.2195, type: 'train_station' },
    { name: 'Indira Gandhi International Airport (DEL T3)', city: 'Delhi', state: 'Delhi', lat: 28.5562, lng: 77.1000, type: 'airport' },
    { name: 'Agra Cantt Railway Station', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1583, lng: 78.0090, type: 'train_station' },
    { name: 'Jaipur Junction Railway Station', city: 'Jaipur', state: 'Rajasthan', lat: 26.9196, lng: 75.7878, type: 'train_station' },
    { name: 'Varanasi Cantt Junction', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3283, lng: 82.9863, type: 'train_station' },
    { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', city: 'Mumbai', state: 'Maharashtra', lat: 18.9401, lng: 72.8354, type: 'train_station' },
    { name: 'KSR Bengaluru City Railway Station', city: 'Bengaluru', state: 'Karnataka', lat: 12.9784, lng: 77.5684, type: 'train_station' }
  ];

  return knownHubs
    .filter(h => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.state.toLowerCase().includes(q))
    .map((h, i) => ({
      id: `fallback-${i}`,
      name: h.name,
      fullName: `${h.name}, ${h.city}, ${h.state}`,
      city: h.city,
      state: h.state,
      lat: h.lat,
      lng: h.lng,
      type: h.type
    }));
}

/**
 * Get user's current GPS location and reverse geocode to a readable address.
 * @returns {Promise<{name: string, fullName: string, lat: number, lng: number}>}
 */
export function getCurrentUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Reverse geocode with OpenStreetMap Nominatim
          const url = `${NOMINATIM_API}/reverse?lat=${lat}&lon=${lng}&format=json`;
          const resp = await fetch(url, {
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(3500)
          });
          if (resp.ok) {
            const data = await resp.json();
            const addr = data?.address || {};
            const area = addr.suburb || addr.neighbourhood || addr.road || addr.village;
            const city = addr.city || addr.town || addr.county || addr.state;
            const formattedName = area && city ? `${area}, ${city}` : (data?.display_name?.split(',').slice(0, 2).join(',') || 'My Current Location');
            resolve({
              name: formattedName,
              fullName: data?.display_name || `${formattedName} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
              lat,
              lng,
              city: city || 'Local',
              type: 'gps'
            });
            return;
          }
        } catch {
          // Fall through if reverse geocoding times out
        }

        resolve({
          name: 'My Current Location',
          fullName: `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          lat,
          lng,
          city: 'Current Location',
          type: 'gps'
        });
      },
      (err) => {
        reject(err);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
}

/**
 * Generates an official Google Maps universal navigation link.
 * Opens Google Maps app on mobile or Google Maps web on desktop with turn-by-turn routing pre-configured to the destination's Main Accessible Entrance.
 *
 * @param {Object} origin - { name, lat, lng }
 * @param {Object} destination - { name, lat, lng } (Main Accessible Entrance coordinates)
 * @param {'driving'|'transit'|'walking'} travelMode - Maps travel mode
 * @returns {string} Universal Google Maps navigation URL
 */
export function getGoogleMapsNavigationUrl(origin, destination, travelMode = 'driving') {
  const originParam = origin?.lat && origin?.lng 
    ? `${origin.lat},${origin.lng}` 
    : encodeURIComponent(origin?.name || 'My Location');

  const destParam = destination?.lat && destination?.lng 
    ? `${destination.lat},${destination.lng}` 
    : encodeURIComponent(destination?.name || 'Destination Entrance');

  const mode = travelMode === 'train' ? 'transit' : 'driving';

  return `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destParam}&travelmode=${mode}`;
}
