/**
 * wikimediaService.js
 * Fetches high-quality authentic cover photos from Wikimedia Commons & Wikipedia for any Indian monument/place.
 *
 * Strategies:
 *   1. In-memory & sessionStorage cache (instant 0ms retrieval)
 *   2. Smart name normalization for Indian heritage sites
 *   3. Wikipedia REST summary API
 *   4. Wikipedia Action API pageimages search
 *   5. Wikimedia Commons file search
 *
 * 100% Free — no API key required.
 */

const WP_REST = 'https://en.wikipedia.org/api/rest_v1';
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
 * Normalize Indian monument names for Wikipedia page title matching
 */
function generateSearchVariants(placeName, city = '') {
  if (!placeName) return [];
  const clean = placeName
    .replace(/\(.*?\)/g, '') // remove parentheses
    .replace(/\b(Complex|Heritage Site|Monument|Entrance Plaza|Plaza|Visitor Center|Promenade)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  const variants = [];
  const cleanCity = city ? city.split(',')[0].trim() : '';

  // 1. Cleaned primary clause before '&' or 'and' or '/'
  const primaryClause = clean.split(/\s*(&|and|\/)\s*/i)[0].trim();
  if (primaryClause && cleanCity) {
    variants.push(`${primaryClause}, ${cleanCity}`);
    variants.push(`${primaryClause} ${cleanCity}`);
  }
  if (primaryClause) {
    variants.push(primaryClause);
  }
  
  // 2. Cleaned name + city
  if (cleanCity) {
    variants.push(`${clean}, ${cleanCity}`);
    variants.push(`${clean} ${cleanCity}`);
  }

  // 3. Cleaned name alone
  variants.push(clean);

  // 4. Raw place name alone
  variants.push(placeName.split(',')[0].trim());

  // 5. Known aliases for Indian landmarks
  if (/pichola/i.test(placeName)) variants.push('Lake Pichola');
  if (/city palace/i.test(placeName) && /udaipur/i.test(city || placeName)) variants.push('City Palace, Udaipur');
  if (/city palace/i.test(placeName) && /jaipur/i.test(city || placeName)) variants.push('City Palace, Jaipur');
  if (/qutub|qutb/i.test(placeName)) variants.push('Qutb Minar');
  if (/taj mahal/i.test(placeName)) variants.push('Taj Mahal');
  if (/hawa mahal/i.test(placeName)) variants.push('Hawa Mahal');
  if (/amer|amber fort/i.test(placeName)) variants.push('Amer Fort');
  if (/red fort/i.test(placeName)) variants.push('Red Fort');
  if (/humayun/i.test(placeName)) variants.push("Humayun's Tomb");
  if (/mysore palace|mysuru palace/i.test(placeName)) variants.push('Mysore Palace');
  if (/golden temple|harmandir/i.test(placeName)) variants.push('Golden Temple');
  if (/gateway of india/i.test(placeName)) variants.push('Gateway of India');
  if (/victoria memorial/i.test(placeName)) variants.push('Victoria Memorial, Kolkata');
  if (/kashi vishwanath/i.test(placeName)) variants.push('Kashi Vishwanath Temple');
  if (/meenakshi/i.test(placeName)) variants.push('Meenakshi Temple');
  if (/charminar/i.test(placeName)) variants.push('Charminar');
  if (/konark|sun temple/i.test(placeName)) variants.push('Konark Sun Temple');
  if (/ellora/i.test(placeName)) variants.push('Ellora Caves');
  if (/ajanta/i.test(placeName)) variants.push('Ajanta Caves');

  // Deduplicate
  return [...new Set(variants.filter(Boolean))];
}

/**
 * Strategy 1: Wikipedia page image via REST summary API.
 */
async function fetchFromWikipediaSummary(title) {
  try {
    const encoded = encodeURIComponent(title.replace(/\s+/g, '_'));
    const resp = await fetch(`${WP_REST}/page/summary/${encoded}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(4500)
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const url = data?.originalimage?.source || data?.thumbnail?.source;
    return url ? resizeWikimediaThumb(url, 800) : null;
  } catch {
    return null;
  }
}

/**
 * Strategy 2: Wikipedia Action API page images search.
 */
async function fetchFromWikipediaPageImages(query) {
  const params = new URLSearchParams({
    action: 'query',
    titles: query,
    prop: 'pageimages',
    pithumbsize: 800,
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
    return page?.thumbnail?.source || null;
  } catch {
    return null;
  }
}

/**
 * Strategy 3: Wikimedia Commons direct search.
 */
async function fetchFromCommonsSearch(query) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: `${query} filetype:bitmap`,
    srnamespace: 6,
    srlimit: 4,
    format: 'json',
    origin: '*'
  });
  try {
    const resp = await fetch(`${COMMONS_ACTION}?${params}`, {
      signal: AbortSignal.timeout(4500)
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const results = data?.query?.search;
    if (!results?.length) return null;

    const title = results[0].title;
    const infoParams = new URLSearchParams({
      action: 'query',
      titles: title,
      prop: 'imageinfo',
      iiprop: 'url|thumburl',
      iiurlwidth: 800,
      format: 'json',
      origin: '*'
    });
    const infoResp = await fetch(`${COMMONS_ACTION}?${infoParams}`, {
      signal: AbortSignal.timeout(4500)
    });
    if (!infoResp.ok) return null;
    const infoData = await infoResp.json();
    const pages = infoData?.query?.pages;
    if (!pages) return null;
    const filePage = Object.values(pages)[0];
    const info = filePage?.imageinfo?.[0];
    return info?.thumburl || info?.url || null;
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

  for (const q of queries) {
    const summaryUrl = await fetchFromWikipediaSummary(q);
    if (summaryUrl) {
      setCachedWikimediaPhoto(placeName, city, summaryUrl);
      return summaryUrl;
    }

    const pageImgUrl = await fetchFromWikipediaPageImages(q);
    if (pageImgUrl) {
      setCachedWikimediaPhoto(placeName, city, pageImgUrl);
      return pageImgUrl;
    }
  }

  // Last resort Commons search
  for (const q of queries.slice(0, 2)) {
    const commonsUrl = await fetchFromCommonsSearch(q);
    if (commonsUrl) {
      setCachedWikimediaPhoto(placeName, city, commonsUrl);
      return commonsUrl;
    }
  }

  return null;
}
