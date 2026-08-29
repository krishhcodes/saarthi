// Saarthi Places Accessibility Service
// Evidence-First evaluation engine with Gemini dynamic search
// Calculates disability-specific accessibility verdicts from structured evidence

import { GoogleGenerativeAI } from '@google/generative-ai';
import { PLACES_CATALOG, DISABILITY_KEY, STATUS_THRESHOLDS } from '../data/placesData';

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
  try { genAI = new GoogleGenerativeAI(GEMINI_API_KEY); } catch (e) {}
}

/**
 * Compute a diminishing-returns weighted confidence score from evidence items
 * Duplicate/similar reviews accumulate less weight after the first strong evidence
 */
function computeEvidenceScore(evidenceItems, disabilityKey, targetVerdict) {
  const relevantItems = evidenceItems.filter(e => {
    if (e.disability_relevance !== disabilityKey && e.disability_relevance !== 'all') return false;
    return e.supports === targetVerdict;
  });

  if (relevantItems.length === 0) return 0;

  // Sort by reliability descending
  const sorted = [...relevantItems].sort((a, b) => b.reliability - a.reliability);

  let score = 0;
  sorted.forEach((item, idx) => {
    // Diminishing returns: each additional evidence item contributes less
    const weight = item.reliability * Math.pow(0.7, idx);
    // Reviews from first-hand PwD users get a small bonus
    const firstHandBonus = item.first_hand ? 0.05 : 0;
    // Official government sources get a reliability bonus
    const govBonus = (item.source_type === 'government' || item.source_type === 'official') ? 0.05 : 0;
    score += (weight + firstHandBonus + govBonus);
  });

  return Math.min(score, 1.0);
}

/**
 * Evaluate a single visitor point for a given disability
 * Returns: { status, confidence, explanation, supporting, contradicting }
 */
export function evaluatePoint(point, disabilityKey) {
  if (!point.evidence || point.evidence.length === 0) {
    return {
      status: 'unknown',
      confidence: 0,
      explanation: 'No accessibility data available for this point yet.',
      supporting: [],
      contradicting: []
    };
  }

  const relevant = point.evidence.filter(
    e => e.disability_relevance === disabilityKey || e.disability_relevance === 'all'
  );

  if (relevant.length === 0) {
    return {
      status: 'unknown',
      confidence: 0,
      explanation: `No evidence specific to your disability type found for this point.`,
      supporting: [],
      contradicting: []
    };
  }

  const accessibleScore = computeEvidenceScore(point.evidence, disabilityKey, 'accessible');
  const partialScore = computeEvidenceScore(point.evidence, disabilityKey, 'partial');
  const inaccessibleScore = computeEvidenceScore(point.evidence, disabilityKey, 'inaccessible');
  const totalEvidence = accessibleScore + partialScore + inaccessibleScore;

  let status = 'unknown';
  let confidence = 0;
  let explanation = '';

  if (totalEvidence === 0) {
    status = 'unknown';
    confidence = 0;
    explanation = 'Insufficient evidence to determine accessibility for your profile.';
  } else if (inaccessibleScore > accessibleScore && inaccessibleScore > partialScore) {
    status = 'inaccessible';
    confidence = Math.round((inaccessibleScore / totalEvidence) * 100);
    explanation = buildExplanation(point, relevant, 'inaccessible', disabilityKey);
  } else if (partialScore > accessibleScore || (accessibleScore > 0 && inaccessibleScore > 0)) {
    status = 'partial';
    confidence = Math.round(((partialScore + Math.min(accessibleScore, inaccessibleScore)) / totalEvidence) * 80 + 20);
    explanation = buildExplanation(point, relevant, 'partial', disabilityKey);
  } else if (accessibleScore > 0) {
    status = 'accessible';
    confidence = Math.round((accessibleScore / totalEvidence) * 100);
    explanation = buildExplanation(point, relevant, 'accessible', disabilityKey);
  }

  confidence = Math.min(99, Math.max(30, confidence));

  const supporting = relevant.filter(e => e.supports === 'accessible' || (status === 'partial' && e.supports === 'partial'));
  const contradicting = relevant.filter(e => e.supports !== 'accessible' && e.supports !== status);

  return { status, confidence, explanation, supporting, contradicting, totalEvidenceCount: relevant.length };
}

function buildExplanation(point, evidence, verdict, disabilityKey) {
  const supportingEvidence = evidence.filter(e => e.supports === verdict || e.supports === 'accessible');
  const topSource = supportingEvidence.sort((a, b) => b.reliability - a.reliability)[0];

  const disabilityLabels = {
    mobility: 'wheelchair and mobility',
    visual: 'visual impairment',
    hearing: 'hearing and deaf',
    cognitive: 'cognitive and neurodivergent'
  };

  const label = disabilityLabels[disabilityKey] || disabilityKey;

  if (verdict === 'accessible') {
    return topSource
      ? `This point is confirmed accessible for ${label} visitors. ${topSource.claim}`
      : `Evidence suggests this point is generally accessible for ${label} visitors.`;
  } else if (verdict === 'partial') {
    const issues = evidence.filter(e => e.supports === 'inaccessible' || e.supports === 'partial');
    const topIssue = issues.sort((a, b) => b.reliability - a.reliability)[0];
    return topIssue
      ? `Partially accessible for ${label} visitors. Key limitation: ${topIssue.claim}`
      : `Some barriers exist for ${label} visitors. Assistance may be required.`;
  } else {
    const topBarrier = evidence.filter(e => e.supports === 'inaccessible').sort((a, b) => b.reliability - a.reliability)[0];
    return topBarrier
      ? `Not accessible for ${label} visitors. ${topBarrier.claim}`
      : `Significant barriers detected for ${label} visitors at this point.`;
  }
}

/**
 * Get full evaluated place with all points evaluated for a disability
 * Also synthesizes connected barrier-free pathways from accessible entrances to all accessible POIs
 */
export function evaluatePlace(place, primaryDisability) {
  const disabilityKey = DISABILITY_KEY[primaryDisability] || 'mobility';

  const evaluatedPoints = (place.visitorPoints || []).map(point => ({
    ...point,
    evaluation: evaluatePoint(point, disabilityKey)
  }));

  const accessibleCount = evaluatedPoints.filter(p => p.evaluation.status === 'accessible').length;
  const partialCount = evaluatedPoints.filter(p => p.evaluation.status === 'partial').length;
  const inaccessibleCount = evaluatedPoints.filter(p => p.evaluation.status === 'inaccessible').length;
  const unknownCount = evaluatedPoints.filter(p => p.evaluation.status === 'unknown').length;

  const accessibleEntrances = evaluatedPoints.filter(
    p => (p.type === 'entrance' || p.name?.toLowerCase().includes('gate') || p.name?.toLowerCase().includes('entry') || p.name?.toLowerCase().includes('shuttle')) &&
         p.evaluation.status === 'accessible'
  );

  const inaccessibleEntrances = evaluatedPoints.filter(
    p => (p.type === 'entrance' || p.name?.toLowerCase().includes('gate') || p.name?.toLowerCase().includes('entry')) &&
         p.evaluation.status !== 'accessible'
  );

  const accessiblePOIs = evaluatedPoints.filter(
    p => p.evaluation.status === 'accessible' && !accessibleEntrances.some(e => e.id === p.id)
  );

  // Footway network is now fetched from Overpass API in PlacesView
  // No more hardcoded campusTrails - all paths are real OSM geometry
  const accessiblePathways = [];


  const overallScore = place.overallScore?.[disabilityKey] ?? null;

  let overallStatus = 'unknown';
  if (inaccessibleCount > accessibleCount + partialCount) overallStatus = 'inaccessible';
  else if (accessibleCount >= partialCount && accessibleCount > inaccessibleCount) overallStatus = 'accessible';
  else if (partialCount > 0 || (accessibleCount > 0 && inaccessibleCount > 0)) overallStatus = 'partial';

  return {
    ...place,
    evaluatedPoints,
    accessibleEntrances,
    inaccessibleEntrances,
    accessiblePathways,
    overallStatus,
    overallScore,
    disabilityKey,
    summary: { accessibleCount, partialCount, inaccessibleCount, unknownCount }
  };
}

/**
 * Search the seeded catalog
 */
export function searchSeededPlaces(query) {
  const q = query.toLowerCase().trim();
  if (!q) return PLACES_CATALOG;
  return PLACES_CATALOG.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.city.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}

/**
 * Dynamic Gemini-powered search & evidence generation for unlisted places
 */
export async function searchPlaceWithGemini(query, primaryDisability) {
  if (!genAI) return null;

  const disabilityKey = DISABILITY_KEY[primaryDisability] || 'mobility';

  for (const modelName of WORKING_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `You are Saarthi AI, an accessibility expert for Indian tourist destinations.
A user with "${primaryDisability}" disability wants to know accessibility information for: "${query}".

Generate a JSON object for this place. Return ONLY valid JSON, no markdown, no explanation outside JSON:
{
  "id": "slug-id",
  "name": "Full Place Name",
  "city": "City, State",
  "category": "Monument Type",
  "lat": number,
  "lng": number,
  "overallScore": { "mobility": 0-100, "visual": 0-100, "hearing": 0-100, "cognitive": 0-100 },
  "visitorPoints": [
    {
      "id": "point-slug",
      "name": "Point Name",
      "icon": "single emoji",
      "lat": number,
      "lng": number,
      "evidence": [
        {
          "source_type": "official|government|review",
          "source": "Source name",
          "claim": "Specific factual accessibility claim",
          "disability_relevance": "${disabilityKey}",
          "supports": "accessible|partial|inaccessible",
          "reliability": 0.7-0.95,
          "date": "YYYY-MM-DD",
          "first_hand": true|false
        }
      ]
    }
  ]
}

Include 3-5 visitor points. Base evidence ONLY on well-known, verifiable facts about this place.
If you are not sure about a specific accessibility feature, set supports to "partial" with reliability 0.7 and note uncertainty in the claim.
Never fabricate specific numbers (ramp widths, slopes) you are not confident about.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      parsed._isGeminiGenerated = true;
      parsed._generatedAt = new Date().toISOString();
      return parsed;
    } catch (err) {
      console.warn(`[Places Gemini ${modelName} failed]`, err.message);
    }
  }
  return null;
}

export { PLACES_CATALOG, STATUS_THRESHOLDS, DISABILITY_KEY };
