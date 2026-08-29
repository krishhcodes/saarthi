/**
 * wikimediaService.js
 * Fetches high-quality authentic cover photos from Wikimedia Commons & Wikipedia for any Indian monument/place.
 *
 * Strategies:
 *   1. In-memory & sessionStorage cache (instant 0ms retrieval)
 *   2. Smart name normalization for Indian heritage sites
 *   3. Wikipedia Action API search generator (0 HTTP 404s, fuzzy match)
 *   4. Wikimedia Commons Action API search generator (0 HTTP 404s, file search)
 *
 * 100% Free — no API key required.
 */

const WP_ACTION = 'https://en.wikipedia.org/w/api.php';
const COMMONS_ACTION = 'https://commons.wikimedia.org/w/api.php';

// In-Memory & Session Cache
const WIKIMEDIA_CACHE = new Map();

// Helper to get from cache
export function getCachedWikimediaPhoto(placeName, city = '') {
  const key = `${placeName}_${city}`.toLowerCase().trim();
  if (WIKIMEDIA_CACHE.has(key)) return WIKIMEDIA_CACHE.get(key);
  try {
    const sessionVal = sessionStorage.getItem(`saarthi_img_${key}`);
    if (sessionVal) {
      WIKIMEDIA_CACHE.set(key, sessionVal);
      return sessionVal;
    }
  } catch (e) {}
  return null;
}

// Helper to set cache
function setCachedWikimediaPhoto(placeName, city = '', url) {
  if (!url) return;
  const key = `${placeName}_${city}`.toLowerCase().trim();
  WIKIMEDIA_CACHE.set(key, url);
  try {
    sessionStorage.setItem(`saarthi_img_${key}`, url);
  } catch (e) {}
}

/**
 * Resize a Wikimedia thumbnail URL to a target pixel width.
 */
function resizeWikimediaThumb(url, targetWidth = 800) {
  if (!url) return url;
  return url.replace(/\/\d+px-/, `/${targetWidth}px-`);
}

/**
 * Normalize Indian monument names for search queries
 */
function generateSearchVariants(placeName, city = '') {
  if (!placeName) return [];
  const clean = placeName
    .replace(/\(.*?\)/g, '') // remove parentheses
    .replace(/\b(Complex|Heritage Site|Monument|Entrance Plaza|Plaza|Visitor Center|Promenade|Grounds|Precincts)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  const variants = [];
  const cleanCity = city ? city.split(',')[0].trim() : '';

  // 1. Cleaned primary clause before '&' or 'and' or '/'
  const primaryClause = clean.split(/\s*(&|and|\/)\s*/i)[0].trim();
  if (primaryClause && cleanCity) {
    variants.push(`${primaryClause} ${cleanCity}`);
  }
  if (primaryClause) {
    variants.push(primaryClause);
  }
  
  // 2. Cleaned name + city
  if (cleanCity && clean !== primaryClause) {
    variants.push(`${clean} ${cleanCity}`);
  }

  // 3. Cleaned name alone
  if (clean !== primaryClause) {
    variants.push(clean);
  }

  // 4. Known aliases for top Indian landmarks
  if (/pichola/i.test(placeName)) variants.unshift('Lake Pichola Udaipur');
  if (/city palace/i.test(placeName) && /udaipur/i.test(city || placeName)) variants.unshift('City Palace Udaipur');
  if (/city palace/i.test(placeName) && /jaipur/i.test(city || placeName)) variants.unshift('City Palace Jaipur');
  if (/qutub|qutb/i.test(placeName)) variants.unshift('Qutb Minar Delhi');
  if (/taj mahal/i.test(placeName)) variants.unshift('Taj Mahal Agra');
  if (/hawa mahal/i.test(placeName)) variants.unshift('Hawa Mahal Jaipur');
  if (/amer|amber fort/i.test(placeName)) variants.unshift('Amer Fort Jaipur');
  if (/red fort/i.test(placeName)) variants.unshift('Red Fort Delhi');
  if (/humayun/i.test(placeName)) variants.unshift("Humayun's Tomb Delhi");
  if (/mysore palace|mysuru palace/i.test(placeName)) variants.unshift('Mysore Palace');
  if (/golden temple|harmandir/i.test(placeName)) variants.unshift('Golden Temple Amritsar');
  if (/gateway of india/i.test(placeName)) variants.unshift('Gateway of India Mumbai');
  if (/victoria memorial/i.test(placeName)) variants.unshift('Victoria Memorial Kolkata');
  if (/kashi vishwanath/i.test(placeName)) variants.unshift('Kashi Vishwanath Temple');
  if (/meenakshi/i.test(placeName)) variants.unshift('Meenakshi Temple Madurai');
  if (/charminar/i.test(placeName)) variants.unshift('Charminar Hyderabad');
  if (/konark|sun temple/i.test(placeName)) variants.unshift('Konark Sun Temple');
  if (/ellora/i.test(placeName)) variants.unshift('Ellora Caves');
  if (/ajanta/i.test(placeName)) variants.unshift('Ajanta Caves');

  // Deduplicate
  return [...new Set(variants.filter(Boolean))];
}

/**
 * Strategy 1: Wikipedia Search generator (Full-text/Fuzzy match, 0 404s)
 */
async function fetchFromWikipediaSearch(query) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrlimit: '1',
    prop: 'pageimages',
    piprop: 'thumbnail|original',
    pithumbsize: '800',
    format: 'json',
    origin: '*'
  });

  try {
    const resp = await fetch(`${WP_ACTION}?${params}`, {
      signal: AbortSignal.timeout(4500)
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    const url = page?.thumbnail?.source || page?.original?.source;
    return url ? resizeWikimediaThumb(url, 800) : null;
  } catch {
    return null;
  }
}

/**
 * Strategy 2: Wikimedia Commons direct File search (0 404s)
 */
async function fetchFromCommonsSearch(query) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '1',
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: '800',
    format: 'json',
    origin: '*'
  });

  try {
    const resp = await fetch(`${COMMONS_ACTION}?${params}`, {
      signal: AbortSignal.timeout(4500)
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const filePage = Object.values(pages)[0];
    const info = filePage?.imageinfo?.[0];
    const url = info?.thumburl || info?.url;
    return url ? resizeWikimediaThumb(url, 800) : null;
  } catch {
    return null;
  }
}

/**
 * Main export: fetch the best available Wikimedia photo for a place.
 */
export async function fetchWikimediaPhoto(placeName, city = '') {
  if (!placeName?.trim()) return null;

  // Check cache first
  const cached = getCachedWikimediaPhoto(placeName, city);
  if (cached) return cached;

  const queries = generateSearchVariants(placeName, city);

  // 1. Try Wikipedia Search
  for (const q of queries.slice(0, 3)) {
    const wikiUrl = await fetchFromWikipediaSearch(q);
    if (wikiUrl) {
      setCachedWikimediaPhoto(placeName, city, wikiUrl);
      return wikiUrl;
    }
  }

  // 2. Try Wikimedia Commons File Search
  for (const q of queries.slice(0, 3)) {
    const commonsUrl = await fetchFromCommonsSearch(q);
    if (commonsUrl) {
      setCachedWikimediaPhoto(placeName, city, commonsUrl);
      return commonsUrl;
    }
  }

  return null;
}
