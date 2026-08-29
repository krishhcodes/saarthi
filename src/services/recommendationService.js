// Saarthi AI-Powered Attraction Recommendation Engine
// Directly aligned with SIH Problem Statement 49
// Maps granular infrastructure: Entrances, Toilets, Transport, Paths, and Sensory Services

import { GoogleGenerativeAI } from '@google/generative-ai';
import { fetchWikimediaPhoto } from './wikimediaService.js';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const WORKING_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash'
];

let genAI = null;
if (GEMINI_API_KEY && !GEMINI_API_KEY.includes('your_')) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  } catch (e) {
    console.warn('[Gemini Init Warning]', e);
  }
}

// In-Memory Session Cache to avoid redundant API queries
const recommendationsCache = new Map();
const imageCache = new Map();

// Category-based fallback images if Wikipedia has no photo
const CATEGORY_IMAGES = {
  lake: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  park: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
  garden: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
  temple: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
  fort: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  palace: 'https://images.unsplash.com/photo-1600100397608-f010f443b71f?auto=format&fit=crop&w=800&q=80',
  museum: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80',
  heritage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
  waterfall: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
  falls: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80'
};

/**
 * Fetch authentic photo of the attraction from Wikipedia / Wikimedia Commons API
 */
async function fetchRealAttractionImage(name, city, category = '') {
  const cacheKey = `${name}_${city}`.toLowerCase().trim();
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  try {
    const wikiPhoto = await fetchWikimediaPhoto(name, city);
    if (wikiPhoto) {
      imageCache.set(cacheKey, wikiPhoto);
      return wikiPhoto;
    }
  } catch (e) {
    // proceed to category fallback
  }

  // Fallback to appropriate category theme photo
  const catKey = `${category} ${name}`.toLowerCase();
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (catKey.includes(key)) {
      imageCache.set(cacheKey, url);
      return url;
    }
  }

  const fallback = CATEGORY_IMAGES.default;
  imageCache.set(cacheKey, fallback);
  return fallback;
}

// ── Instant Pre-Seeded Regional Catalog (0ms Latency for top circuits) ──
const PRESEEDED_REGIONAL_RECOMMENDATIONS = {
  'all': [
    {
      id: 'rec-taj-mahal',
      name: 'Taj Mahal Complex',
      city: 'Agra',
      state: 'Uttar Pradesh',
      category: 'UNESCO World Heritage Monument',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      description: 'World-renowned Mughal mausoleum featuring step-free garden pathways, electric golf cart shuttle transfers, and certified wheelchair escorts.',
      coordinates: [27.1751, 78.0421],
      matchScores: {
        wheelchair: 97,
        blind: 88,
        deaf: 92,
        general: 95
      },
      entrances: {
        stepFree: true,
        rampIncline: '1:14 (Gentle Wooden Ramps)',
        wideDoors: '210 cm unobstructed clearance'
      },
      toilets: {
        available: true,
        count: 4,
        rollIn: true,
        grabBars: true,
        emergencyButton: true
      },
      transport: {
        golfCarts: true,
        shuttleFree: true,
        parkingDistance: 'Zero-emission golf cart from East Gate parking (1.2km transit included)'
      },
      paths: {
        surface: 'Smooth Red Sandstone & Marble Walkways',
        tactilePaving: false,
        slopeWarnings: 'Slight incline approaching main plinth; elevator available at South-East gate'
      },
      sensoryAids: {
        braille: true,
        audioGuide: true,
        islAvailable: true,
        tactileModels: true
      },
      whyRecommended: {
        wheelchair: [
          'Full step-free garden perimeter circuit with non-slip ramps',
          'Free electric golf cart transfers from East Gate parking',
          '4 designated roll-in accessible toilets with support grab bars'
        ],
        blind: [
          '3D tactile scale model of Taj Mahal at visitor interpretation center',
          'Official ASI audio-descriptive tour app available in 11 languages',
          'Trained tactile escort guides available on-site'
        ],
        deaf: [
          'Certified Indian Sign Language (ISL) guides bookable via Saarthi',
          'Comprehensive visual information display boards throughout gardens',
          'Visual emergency lighting cues at main security gates'
        ],
        general: [
          'UNESCO World Heritage site with full barrier-free compliance under Sugamya Bharat',
          'Free wheelchair loan counter at both East & West ticket gates',
          'Dedicated priority assistance lane for Divyangjan travelers'
        ]
      },
      precautions: [
        'Main mausoleum upper plinth requires elevator access located near South-East corner.',
        'High tourist rush between 11 AM - 3 PM; morning visits (06:00 - 08:30 AM) recommended for peaceful navigation.'
      ]
    },
    {
      id: 'rec-humayun-tomb',
      name: "Humayun's Tomb & Sunder Nursery",
      city: 'Delhi',
      state: 'Delhi NCR',
      category: 'Heritage Gardens & Monument',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      description: 'First garden-tomb on the Indian subcontinent, fully upgraded with continuous sensory garden trails, Braille orientation boards, and rubberized ramps.',
      coordinates: [28.5933, 77.2507],
      matchScores: {
        wheelchair: 95,
        blind: 98,
        deaf: 90,
        general: 94
      },
      entrances: {
        stepFree: true,
        rampIncline: '1:12 (Non-slip Rubber Ramped Path)',
        wideDoors: '180 cm clearance'
      },
      toilets: {
        available: true,
        count: 3,
        rollIn: true,
        grabBars: true,
        emergencyButton: true
      },
      transport: {
        golfCarts: true,
        shuttleFree: true,
        parkingDistance: 'Dedicated Divyangjan parking 40m from entrance gate'
      },
      paths: {
        surface: 'Compacted gravel and paved stone pathways with tactile guidance',
        tactilePaving: true,
        slopeWarnings: 'Garden circuit is 100% flat; lower crypt accessible via ramp'
      },
      sensoryAids: {
        braille: true,
        audioGuide: true,
        islAvailable: true,
        tactileModels: true
      },
      whyRecommended: {
        wheelchair: [
          '100% flat continuous garden walkway connecting to Sunder Nursery',
          'Modern roll-in washrooms with low-height sinks and grab rails',
          'Dedicated ramped entrance with security guard priority clearance'
        ],
        blind: [
          'Full tactile paving network along primary garden channels',
          'Braille information plaques at all key architectural pavilions',
          'Sensory garden featuring aromatic medicinal flora and audio beacon navigation'
        ],
        deaf: [
          'QR-code video guides with Indian Sign Language (ISL) captions',
          'Visual map signage and well-marked step-free routes'
        ],
        general: [
          'Aga Khan Trust for Culture certified universally accessible heritage site',
          'Shaded resting benches spaced every 45 meters throughout circuit'
        ]
      },
      precautions: [
        'Upper monument terrace has ancient steep stone stairs; upper level viewed via ground-level tactile displays and audio description.'
      ]
    },
    {
      id: 'rec-qutub-minar',
      name: 'Qutub Minar Complex',
      city: 'Delhi',
      state: 'Delhi NCR',
      category: 'Archaeological Complex',
      image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=800&q=80',
      description: 'Historic minaret and victory tower surrounded by well-paved illuminated stone pathways, gently sloped ramp access, and Braille directional maps.',
      coordinates: [28.5244, 77.1855],
      matchScores: {
        wheelchair: 93,
        blind: 94,
        deaf: 91,
        general: 93
      },
      entrances: {
        stepFree: true,
        rampIncline: '1:12 slope with dual handrails',
        wideDoors: '200 cm gate'
      },
      toilets: {
        available: true,
        count: 2,
        rollIn: true,
        grabBars: true,
        emergencyButton: true
      },
      transport: {
        golfCarts: true,
        shuttleFree: true,
        parkingDistance: 'Battery cart shuttle available directly from Qutub Minar Metro station gate'
      },
      paths: {
        surface: 'Smooth illuminated paved walkways around the Iron Pillar and ruins',
        tactilePaving: true,
        slopeWarnings: 'Zero step barriers on main loop'
      },
      sensoryAids: {
        braille: true,
        audioGuide: true,
        islAvailable: true,
        tactileModels: true
      },
      whyRecommended: {
        wheelchair: [
          'Step-free loop encircling the world-famous Iron Pillar and Alai Darwaza',
          'Ramped ticket counter with lowered window for seated travelers',
          'Smooth stone surfaces with zero threshold barriers'
        ],
        blind: [
          'Braille signboards explaining Islamic architecture and inscriptions',
          'Touchable stone relief replica of the Minar at the entrance pavilion',
          'Continuous guiding tactile trail from entry gate to main viewing zone'
        ],
        deaf: [
          'Clear bilingual visual signage in English & Hindi',
          'Certified ISL tour escorts available for pre-booking'
        ],
        general: [
          'Sugamya Bharat model accessible monument in South Delhi',
          'Night illumination with low glare lighting for high-contrast viewing'
        ]
      },
      precautions: [
        'Interior spiral stairs of the Minar are permanently closed to all public visitors.'
      ]
    },
    {
      id: 'rec-kashi-vishwanath',
      name: 'Kashi Vishwanath Corridor & Ghats',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      category: 'Spiritual & Cultural Corridor',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      description: 'State-of-the-art spiritual corridor connecting holy shrine to Ganga Ghats with escalators, travelators, battery carts, and wheelchair ramps.',
      coordinates: [25.3109, 83.0107],
      matchScores: {
        wheelchair: 94,
        blind: 86,
        deaf: 90,
        general: 91
      },
      entrances: {
        stepFree: true,
        rampIncline: '1:15 (Very gentle stone ramps)',
        wideDoors: '300 cm grand gateways'
      },
      toilets: {
        available: true,
        count: 6,
        rollIn: true,
        grabBars: true,
        emergencyButton: true
      },
      transport: {
        golfCarts: true,
        shuttleFree: true,
        parkingDistance: 'Battery cars run continuously between Godowlia gate and Temple entrance'
      },
      paths: {
        surface: 'Chunar sandstone flooring with cooling mats in summer',
        tactilePaving: true,
        slopeWarnings: 'Escalators and hydraulic ramps connect upper temple to River Ghats'
      },
      sensoryAids: {
        braille: false,
        audioGuide: true,
        islAvailable: true,
        tactileModels: false
      },
      whyRecommended: {
        wheelchair: [
          'Spacious 400-meter corridor completely barrier-free with travelators',
          'Special priority Darshan queue for wheelchair travelers and senior citizens',
          '6 high-spec accessible washrooms with automated door sensors'
        ],
        blind: [
          'Tactile paving guides from security checkpoint directly to sanctum entrance',
          'Assisted volunteer staff to escort visually impaired devotees'
        ],
        deaf: [
          'Digital LED screen announcements across the 50,000 sq meter plaza',
          'Visual queue tokens for temple entry'
        ],
        general: [
          'Overcame centuries of narrow alleyways to become India’s most accessible ancient pilgrimage site',
          'Medical aid posts and water dispensing stations every 100 meters'
        ]
      },
      precautions: [
        'Extremely crowded on Mondays and festival days. Highly recommend pre-booking Divyangjan slot via official portal.'
      ]
    },
    {
      id: 'rec-amber-fort',
      name: 'Amber Fort & Maota Lake',
      city: 'Jaipur',
      state: 'Rajasthan',
      category: 'Hilltop Royal Fort & Palace',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      description: 'Majestic hilltop fort with accessible battery jeep service to the main courtyard, specialized ramped viewing gallery, and royal audio guides.',
      coordinates: [26.9855, 75.8513],
      matchScores: {
        wheelchair: 78,
        blind: 90,
        deaf: 88,
        general: 85
      },
      entrances: {
        stepFree: true,
        rampIncline: '1:10 (Cobblestone with guide assistance)',
        wideDoors: 'Suraj Pol grand gate'
      },
      toilets: {
        available: true,
        count: 2,
        rollIn: true,
        grabBars: true,
        emergencyButton: false
      },
      transport: {
        golfCarts: true,
        shuttleFree: false,
        parkingDistance: 'Accessible tourist 4x4 jeeps transfer from base to Jaleb Chowk'
      },
      paths: {
        surface: 'Historic stone and ramped courtyard zones',
        tactilePaving: false,
        slopeWarnings: 'Cobblestone surfaces; escort assistance required for manual wheelchairs'
      },
      sensoryAids: {
        braille: true,
        audioGuide: true,
        islAvailable: true,
        tactileModels: true
      },
      whyRecommended: {
        wheelchair: [
          'Accessible tourist vehicle permits direct entry to upper courtyard (Jaleb Chowk)',
          'Sheesh Mahal (Palace of Mirrors) viewed via gentle wooden ramp platform',
          'Certified mobility guides available to assist with steep gradients'
        ],
        blind: [
          'Acoustically rich Sheesh Mahal with vivid echo sensory experience',
          'Sensory tactile model of the fort complex at the ticket concourse',
          'Multi-lingual audio guide narrating Rajput architecture and acoustics'
        ],
        deaf: [
          'Sound and Light evening show features synchronised visual projections and subtitles',
          'Illustrated heritage signposts'
        ],
        general: [
          'Iconic Rajasthan landmark with dedicated accessible jeep ascent option'
        ]
      },
      precautions: [
        'Steep ancient slopes inside Zenana courtyard. Escort or electric mobility device strongly advised.'
      ]
    },
    {
      id: 'rec-mysore-palace',
      name: 'Mysore Palace (Amba Vilas)',
      city: 'Mysuru',
      state: 'Karnataka',
      category: 'Royal Palace & Museum',
      image: 'https://images.unsplash.com/photo-1600100397608-f010f443b71f?auto=format&fit=crop&w=800&q=80',
      description: 'Grand Indo-Saracenic palace equipped with a dedicated glass elevator for wheelchair travelers, illuminated corridors, and tactile audio tours.',
      coordinates: [12.3051, 76.6551],
      matchScores: {
        wheelchair: 96,
        blind: 92,
        deaf: 90,
        general: 94
      },
      entrances: {
        stepFree: true,
        rampIncline: '1:14 smooth marble ramp at Varaha Gate',
        wideDoors: '240 cm grand wooden archways'
      },
      toilets: {
        available: true,
        count: 3,
        rollIn: true,
        grabBars: true,
        emergencyButton: true
      },
      transport: {
        golfCarts: true,
        shuttleFree: true,
        parkingDistance: 'Battery carts available inside palace perimeter from South Gate'
      },
      paths: {
        surface: 'Polished Italian marble and smooth tiled corridors',
        tactilePaving: true,
        slopeWarnings: 'Hydraulic lift connects Ground Floor to Durbar Hall'
      },
      sensoryAids: {
        braille: true,
        audioGuide: true,
        islAvailable: true,
        tactileModels: true
      },
      whyRecommended: {
        wheelchair: [
          'Glass elevator provides seamless access to the majestic first-floor Durbar Hall',
          'Free wheelchair loan stations at Varaha and Amba Vilas gates',
          'Completely flat and polished indoor museum route'
        ],
        blind: [
          'Braille guidebook distributed free of charge at the administrative office',
          'Rich orchestral audio tour with spatial sound guidance'
        ],
        deaf: [
          'Spectacular 100,000-bulb illumination show every Sunday evening',
          'Visual exhibit descriptions in Kannada, English, and Hindi'
        ],
        general: [
          'Karnataka Tourism flagship barrier-free royal destination',
          'Well-trained security personnel offering active escort assistance'
        ]
      },
      precautions: [
        'Footwear must be deposited at gate; wheelchair wheels are sanitized with clean shoe covers before entering palace interiors.'
      ]
    }
  ]
};

/**
 * Determine disability key from user profile
 */
function getProfileKey(userProfile) {
  const disability = userProfile?.primaryDisability || '';
  if (disability.toLowerCase().includes('wheelchair') || disability.toLowerCase().includes('mobility')) {
    return 'wheelchair';
  }
  if (disability.toLowerCase().includes('visual') || disability.toLowerCase().includes('blind')) {
    return 'blind';
  }
  if (disability.toLowerCase().includes('hearing') || disability.toLowerCase().includes('deaf')) {
    return 'deaf';
  }
  return 'general';
}

/**
 * Fetch attractions dynamically via Gemini AI or return cached/pre-seeded data
 * @param {string} region - City, State, or Circuit name
 * @param {object} userProfile - Active user accessibility profile
 * @returns {Promise<Array>} List of ranked accessible attractions
 */
export async function fetchAttractionRecommendations(region = 'all', userProfile = {}) {
  const profileKey = getProfileKey(userProfile);
  const cacheKey = `${region.toLowerCase().trim()}_${profileKey}`;

  // 1. Check Session In-Memory Cache
  if (recommendationsCache.has(cacheKey)) {
    return recommendationsCache.get(cacheKey);
  }

  // 2. If region is 'all' or empty, return pre-seeded with tailored scores
  const normalizedRegion = region.toLowerCase().trim();
  if (normalizedRegion === 'all' || normalizedRegion === '' || normalizedRegion === 'all india') {
    const scored = (PRESEEDED_REGIONAL_RECOMMENDATIONS.all || []).map(place => ({
      ...place,
      calculatedMatchScore: place.matchScores[profileKey] || place.matchScores.general,
      currentWhyRecommended: place.whyRecommended[profileKey] || place.whyRecommended.general
    })).sort((a, b) => b.calculatedMatchScore - a.calculatedMatchScore);

    recommendationsCache.set(cacheKey, scored);
    return scored;
  }

  // 3. Check if we have pre-seeded data for this specific city
  const preseededMatches = (PRESEEDED_REGIONAL_RECOMMENDATIONS.all || []).filter(place => 
    place.city.toLowerCase().includes(normalizedRegion) || 
    place.state.toLowerCase().includes(normalizedRegion)
  );

  // 4. Live Query to Gemini Multimodal Reasoning Engine for Any Indian City/Region
  if (genAI) {
    try {
      const prompt = `
You are a senior accessibility auditor for India Tourism under the Sugamya Bharat Abhiyan (Accessible India Campaign) and RPwD Act 2016.

TASK:
Provide the top 5 to 7 tourist attractions in the region/city: "${region}", specifically evaluated for an Indian traveler with the following accessibility profile:
- Primary Need: ${userProfile.primaryDisability || 'Mobility / Wheelchair'}
- Mobility Aid: ${userProfile.mobilityAid || 'Wheelchair'}
- Secondary Needs: ${JSON.stringify(userProfile.secondaryNeeds || ['Step-Free Access', 'Accessible Washroom'])}
- Max Walking Distance: ${userProfile.maxWalkingDistance || 'Under 200m'}

OUTPUT REQUIREMENTS:
Return ONLY a valid JSON array of objects (no conversational filler, no markdown quotes outside of JSON block).
Each object MUST have the following structure:
[
  {
    "id": "gemini-${region}-1",
    "name": "Exact Attraction Name",
    "city": "${region}",
    "state": "State Name",
    "category": "e.g. Heritage Monument / Garden / Temple / Museum",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "description": "2-sentence overview focusing on accessibility highlights.",
    "coordinates": [28.6139, 77.2090],
    "calculatedMatchScore": 92, // Integer 0 to 100 representing compatibility with ${userProfile.primaryDisability}
    "entrances": {
      "stepFree": true,
      "rampIncline": "1:12 slope with dual handrails",
      "wideDoors": "Wide clearance > 90cm"
    },
    "toilets": {
      "available": true,
      "count": 2,
      "rollIn": true,
      "grabBars": true,
      "emergencyButton": true
    },
    "transport": {
      "golfCarts": true,
      "shuttleFree": true,
      "parkingDistance": "Designated accessible parking within 50m"
    },
    "paths": {
      "surface": "Paved flat stone / Concrete / Smooth boardwalk",
      "tactilePaving": true,
      "slopeWarnings": "Specific incline or cobblestone note"
    },
    "sensoryAids": {
      "braille": true,
      "audioGuide": true,
      "islAvailable": true,
      "tactileModels": true
    },
    "currentWhyRecommended": [
      "Point 1 highlighting exact on-ground accessible feature for ${userProfile.primaryDisability}",
      "Point 2 about accessible toilets, carts, or tactile aids",
      "Point 3 about staff assistance or priority queue"
    ],
    "precautions": [
      "Specific precaution or best time to visit for low crowds"
    ]
  }
]
`;

      for (const modelName of WORKING_MODELS) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const responseText = result.response.text();

          // Clean JSON string
          const cleanedJson = responseText
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

          const parsed = JSON.parse(cleanedJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Fetch real authentic photos for each discovered attraction from Wikipedia
            const enhancedPlaces = await Promise.all(
              parsed.map(async (place, idx) => {
                const realImage = await fetchRealAttractionImage(
                  place.name,
                  place.city || region,
                  place.category || ''
                );
                return {
                  ...place,
                  id: place.id || `gemini-${region.toLowerCase()}-${idx}`,
                  image: realImage
                };
              })
            );

            // Sort by match score descending
            const sorted = enhancedPlaces.sort((a, b) => b.calculatedMatchScore - a.calculatedMatchScore);
            recommendationsCache.set(cacheKey, sorted);
            console.log(`[Gemini Recommendations] Successfully fetched ${sorted.length} places for ${region} with real photos`);
            return sorted;
          }
        } catch (modelErr) {
          console.warn(`[Gemini Model ${modelName} Fallback]`, modelErr.message);
        }
      }
    } catch (err) {
      console.warn('[Gemini Recommendations Fetch Error]', err);
    }
  }

  // 5. Fallback to pre-seeded matches or filtered all
  if (preseededMatches.length > 0) {
    const scored = preseededMatches.map(place => ({
      ...place,
      calculatedMatchScore: place.matchScores[profileKey] || place.matchScores.general,
      currentWhyRecommended: place.whyRecommended[profileKey] || place.whyRecommended.general
    })).sort((a, b) => b.calculatedMatchScore - a.calculatedMatchScore);

    recommendationsCache.set(cacheKey, scored);
    return scored;
  }

  // Generic fallback if all else fails
  const fallbackScored = (PRESEEDED_REGIONAL_RECOMMENDATIONS.all || []).map(place => ({
    ...place,
    calculatedMatchScore: place.matchScores[profileKey] || place.matchScores.general,
    currentWhyRecommended: place.whyRecommended[profileKey] || place.whyRecommended.general
  }));
  return fallbackScored;
}
