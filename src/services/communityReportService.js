// Saarthi Community Accessibility Auditing & Geospatial Consideration Service
// Connects crowdsourced ground reports with Computer Vision & routing engines

import { 
  db, 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  isFirebaseConfigured 
} from '../config/firebase';
import { INITIAL_REPORTS } from '../data/seedData';
import { analyzeAccessibilityPhoto } from './aiService';

/**
 * Subscribe to real-time updates from Firestore 'communityReports' collection.
 * Falls back to local initial reports if Firestore is offline or unconfigured.
 */
export function subscribeToCommunityReports(onUpdate, onError) {
  if (!isFirebaseConfigured()) {
    console.log('[CommunityService] Firebase not configured, using local seed reports.');
    onUpdate(INITIAL_REPORTS);
    return () => {};
  }

  try {
    const q = collection(db, 'communityReports');
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const reports = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          // Sort by newest first
          reports.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
          onUpdate(reports);
        } else {
          onUpdate(INITIAL_REPORTS);
        }
      },
      (error) => {
        console.warn('[CommunityService Snapshot Warning]', error.message);
        if (onError) onError(error);
        onUpdate(INITIAL_REPORTS);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('[CommunityService Init Error]', err);
    onUpdate(INITIAL_REPORTS);
    return () => {};
  }
}

/**
 * Dynamically evaluate report status based on community consensus and verification
 */
export function evaluateReportConsensus(confirmCount = 0, disputeCount = 0, currentStatus = 'Needs Verification') {
  if (currentStatus === 'Verified') {
    // Official / authority verified reports remain verified unless heavily disputed
    if (disputeCount >= 10 && disputeCount > confirmCount * 1.5) {
      return 'Disputed Hazard';
    }
    return 'Verified';
  }

  if (disputeCount >= 3 && disputeCount >= confirmCount) {
    return 'Disputed Hazard';
  }

  if (confirmCount >= 5 && confirmCount > disputeCount * 2) {
    return 'Community Verified';
  }

  return 'Needs Verification';
}

/**
 * Calculate distance in km between two GPS coordinates
 */
export function calculateHaversineDistanceKm([lat1, lon1], [lat2, lon2]) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find active hazards/obstacles near a given coordinate within a specified radius
 */
export function getNearbyHazards(coordinates, radiusKm = 1.0, reports = []) {
  if (!coordinates || !reports.length) return [];

  return reports.filter((rep) => {
    if (!rep.coordinates || rep.coordinates.length < 2) return false;
    const isObstacle = (rep.type || '').toLowerCase().includes('obstacle') || (rep.type || '').toLowerCase().includes('blocked');
    const isDisputed = rep.status === 'Disputed Hazard';

    if (!isObstacle && !isDisputed) return false;

    const dist = calculateHaversineDistanceKm(coordinates, rep.coordinates);
    return dist <= radiusKm;
  });
}

/**
 * Find verified accessible infrastructure (ramps, elevators, PwD toilets) near a coordinate
 */
export function getNearbyAccessibleAids(coordinates, radiusKm = 1.0, reports = []) {
  if (!coordinates || !reports.length) return [];

  return reports.filter((rep) => {
    if (!rep.coordinates || rep.coordinates.length < 2) return false;
    const isPositive = ['ramp', 'elevator', 'accessible entrance', 'accessible washroom', 'accessible transport'].some(
      t => (rep.type || '').toLowerCase().includes(t)
    );
    const isValidStatus = rep.status === 'Verified' || rep.status === 'Community Verified';

    if (!isPositive || !isValidStatus) return false;

    const dist = calculateHaversineDistanceKm(coordinates, rep.coordinates);
    return dist <= radiusKm;
  });
}

/**
 * Calculate dynamic community modifier for destination accessibility scores
 * Returns: { netScoreModifier: number, verifiedCount: number, hazardCount: number, hazards: Array, aids: Array }
 */
export function calculateLocationCommunityScore(destId, destCoordinates, reports = []) {
  const matchingReports = reports.filter((rep) => {
    if (destId && rep.destinationId === destId) return true;
    if (destCoordinates && rep.coordinates) {
      return calculateHaversineDistanceKm(destCoordinates, rep.coordinates) <= 1.5;
    }
    return false;
  });

  let modifier = 0;
  const verifiedAids = [];
  const activeHazards = [];

  matchingReports.forEach((rep) => {
    const isObstacle = (rep.type || '').toLowerCase().includes('obstacle') || rep.status === 'Disputed Hazard';
    const isPositive = ['ramp', 'elevator', 'accessible entrance', 'accessible washroom'].some(
      t => (rep.type || '').toLowerCase().includes(t)
    );

    if (isObstacle) {
      // Penalty based on consensus
      const penalty = rep.status === 'Verified' ? 12 : rep.status === 'Community Verified' ? 8 : 4;
      modifier -= penalty;
      activeHazards.push(rep);
    } else if (isPositive && (rep.status === 'Verified' || rep.status === 'Community Verified')) {
      const bonus = rep.status === 'Verified' ? 5 : 3;
      modifier += bonus;
      verifiedAids.push(rep);
    }
  });

  // Clamp modifier to [-20, +15] to maintain balanced calibration
  const clampedModifier = Math.max(-20, Math.min(15, modifier));

  return {
    netScoreModifier: clampedModifier,
    verifiedCount: verifiedAids.length,
    hazardCount: activeHazards.length,
    hazards: activeHazards,
    aids: verifiedAids,
    totalCommunityAudits: matchingReports.length
  };
}

/**
 * Process a community report submission with automated Computer Vision auditing
 */
export async function enrichReportWithAiAnalysis(reportData, imageSource = null) {
  let aiAnalysis = null;

  if (imageSource) {
    try {
      const visionResult = await analyzeAccessibilityPhoto(imageSource);
      if (visionResult) {
        aiAnalysis = {
          rampDetected: (visionResult.overallVerdict || '').toLowerCase().includes('accessible'),
          slopeConfidence: (visionResult.confidenceScore || 85) / 100,
          handrailsPresent: (visionResult.detectedFeatures || []).some(f => (f.label || '').toLowerCase().includes('handrail')),
          estimatedIncline: visionResult.slopeAngle || 'Standard gradient',
          detectedFeatures: visionResult.detectedFeatures || [],
          overallVerdict: visionResult.overallVerdict || 'Community Verified',
          safetyRisks: visionResult.safetyRisks || [],
          analyzedAt: new Date().toISOString()
        };
      }
    } catch (e) {
      console.warn('[AI Enrichment Warning]', e);
    }
  }

  const scoreImpact = (reportData.type || '').toLowerCase().includes('obstacle')
    ? '-10 Points to Local Score'
    : '+5 Points to Route Score';

  return {
    ...reportData,
    aiAnalysis: aiAnalysis || reportData.aiAnalysis || null,
    scoreImpact: scoreImpact,
    status: aiAnalysis?.slopeConfidence > 0.9 ? 'Verified' : 'Community Verified',
    confirmCount: reportData.confirmCount || 1,
    disputeCount: reportData.disputeCount || 0,
    date: reportData.date || new Date().toISOString().split('T')[0]
  };
}
