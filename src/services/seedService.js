import { db, collection, getDocs, setDoc, doc, isFirebaseConfigured } from '../config/firebase';
import {
  INITIAL_DESTINATIONS,
  INITIAL_HOTELS,
  INITIAL_GUIDES,
  INITIAL_REPORTS,
  INITIAL_GOV_SERVICES,
  INITIAL_PRODUCTS
} from '../data/seedData';

/**
 * Seeds Firestore collections if they are empty, or when triggered manually.
 */
export async function seedFirestoreIfEmpty(force = false) {
  if (!isFirebaseConfigured()) {
    console.log('[Seed] Firebase is not configured, skipping cloud database seed.');
    return { success: false, reason: 'Firebase not configured' };
  }

  try {
    // Check if destinations collection exists and has documents
    const destSnap = await getDocs(collection(db, 'destinations'));
    if (!force && !destSnap.empty) {
      console.log(`[Seed] Firestore already contains ${destSnap.size} destinations. Skipping seed.`);
      return { success: true, seeded: false, count: destSnap.size };
    }

    console.log('[Seed] Seeding collections to Cloud Firestore...');

    const collectionsToSeed = [
      { name: 'destinations', data: INITIAL_DESTINATIONS, idKey: 'id' },
      { name: 'hotels', data: INITIAL_HOTELS, idKey: 'id' },
      { name: 'guides', data: INITIAL_GUIDES, idKey: 'id' },
      { name: 'communityReports', data: INITIAL_REPORTS, idKey: 'id' },
      { name: 'govServices', data: INITIAL_GOV_SERVICES, idKey: 'id' },
      { name: 'products', data: INITIAL_PRODUCTS, idKey: 'id' }
    ];

    let totalSeeded = 0;
    for (const col of collectionsToSeed) {
      for (const item of col.data) {
        const docId = String(item[col.idKey] || item.id);
        await setDoc(doc(db, col.name, docId), item, { merge: true });
        totalSeeded++;
      }
    }

    console.log(`[Seed] Successfully populated Firestore with ${totalSeeded} documents across 6 collections.`);
    return { success: true, seeded: true, totalSeeded };
  } catch (error) {
    console.error('[Seed] Error seeding Firestore:', error);
    return { success: false, error: error.message };
  }
}
