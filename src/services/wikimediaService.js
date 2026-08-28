/**
 * wikimediaService.js
 * Fetches high-quality cover photos from Wikimedia Commons for any place.
 *
 * Strategy:
 *   1. Try Wikimedia REST API (Wikipedia page image) — fastest & most accurate
 *   2. Fall back to Wikimedia Commons image search via opensearch
 *   3. Return null if nothing found — caller keeps its existing coverImage
 *
 * 100% Free — no API key required.
 */

const WP_REST = 'https://en.wikipedia.org/api/rest_v1';
const WP_ACTION = 'https://en.wikipedia.org/w/api.php';
const COMMONS_ACTION = 'https://commons.wikimedia.org/w/api.php';

/**
 * Resize a Wikimedia thumbnail URL to a target pixel width.
 * Wikimedia serves responsive images — just change the number in the URL.
 */
function resizeWikimediaThumb(url, targetWidth = 800) {
  if (!url) return url;
  // e.g. https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Foo.jpg/320px-Foo.jpg
  return url.replace(/\/\d+px-/, `/${targetWidth}px-`);
}

/**
 * Strategy 1: Wikipedia page image via REST summary API.
 * Most reliable for well-known landmarks.
 *
 * @param {string} placeName – e.g. "Taj Mahal" or "Jantar Mantar, Jaipur"
 * @returns {Promise<string|null>} image URL or null
 */
async function fetchFromWikipediaSummary(placeName) {
  // Wikipedia titles use underscores, URL-encode properly
  const title = encodeURIComponent(placeName.replace(/\s+/g, '_'));
  try {
    const resp = await fetch(`${WP_REST}/page/summary/${title}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000)
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    // Prefer originalimage, fall back to thumbnail
    const url = data?.originalimage?.source || data?.thumbnail?.source;
    return url ? resizeWikimediaThumb(url, 800) : null;
  } catch {
    return null;
  }
}

/**
 * Strategy 2: Wikipedia Action API page images search.
 * Handles alternate spellings & disambiguation better.
 *
 * @param {string} placeName
 * @returns {Promise<string|null>}
 */
async function fetchFromWikipediaPageImages(placeName) {
  const params = new URLSearchParams({
    action: 'query',
    titles: placeName,
    prop: 'pageimages',
    pithumbsize: 800,
    format: 'json',
    origin: '*'
  });
  try {
    const resp = await fetch(`${WP_ACTION}?${params}`, {
      signal: AbortSignal.timeout(5000)
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
 * Strategy 3: Wikimedia Commons direct file search.
 * Best for obscure locations not on Wikipedia.
 *
 * @param {string} placeName
 * @returns {Promise<string|null>}
 */
async function fetchFromCommonsSearch(placeName) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: `${placeName} filetype:bitmap`,
    srnamespace: 6, // File namespace
    srlimit: 5,
    format: 'json',
    origin: '*'
  });
  try {
    const resp = await fetch(`${COMMONS_ACTION}?${params}`, {
      signal: AbortSignal.timeout(5000)
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const results = data?.query?.search;
    if (!results?.length) return null;

    // Get imageinfo for the first result
    const title = results[0].title; // e.g. "File:Taj_Mahal_2.jpg"
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
      signal: AbortSignal.timeout(5000)
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
 * Tries 3 strategies in sequence, returns first successful result.
 *
 * @param {string} placeName – Full place name (e.g. "Jantar Mantar Jaipur")
 * @param {string} [city] – Optional city hint to help disambiguation
 * @returns {Promise<string|null>} image URL or null
 */
export async function fetchWikimediaPhoto(placeName, city = '') {
  if (!placeName?.trim()) return null;

  // Build search queries: full name first, then name+city, then name alone
  const queries = [
    placeName,
    city ? `${placeName}, ${city}` : null,
    placeName.split(',')[0].trim() // drop city suffix if already in name
  ].filter(Boolean).filter((q, i, arr) => arr.indexOf(q) === i);

  for (const query of queries) {
    // Strategy 1: Wikipedia REST summary
    const summaryUrl = await fetchFromWikipediaSummary(query);
    if (summaryUrl) return summaryUrl;

    // Strategy 2: Wikipedia Action API page images
    const pageImgUrl = await fetchFromWikipediaPageImages(query);
    if (pageImgUrl) return pageImgUrl;
  }

  // Strategy 3: Commons search (last resort, any query)
  const commonsUrl = await fetchFromCommonsSearch(placeName);
  if (commonsUrl) return commonsUrl;

  return null;
}
