// Saarthi Places Evidence Database
// Pre-seeded high-fidelity evidence for major Indian tourist monuments
// Used by placesService.js for evidence-first accessibility evaluation

export const PLACES_CATALOG = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    city: 'Agra, Uttar Pradesh',
    category: 'UNESCO Heritage Monument',
    lat: 27.1738,
    lng: 78.0421,
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    overallScore: { mobility: 88, visual: 72, hearing: 81, cognitive: 76 },
    visitorPoints: [

      {
        id: 'taj-east-gate',
        name: 'East Gate Entrance (Shilpgram - Accessible Ramp)',
        type: 'entrance',
        lat: 27.1733,
        lng: 78.0435,
        icon: '🚪',
        evidence: [
          { source_type: 'government', source: 'ASI Sugamya Bharat Audit 2024', claim: 'Permanent concrete ramp with 1:12 slope installed at East Gate', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.97, date: '2024-03-15' },
          { source_type: 'official', source: 'CPWD Barrier-Free Audit Report', claim: 'Ramp width 1.5m, non-slip surface, dual height handrails at 70cm and 90cm', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.95, date: '2024-01-20' },
          { source_type: 'review', source: 'Wheelchair Travel Blog (Amar Pandey)', claim: 'Used ramp in manual wheelchair without assistance — very manageable slope', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.88, date: '2025-11-02', first_hand: true },
          { source_type: 'review', source: 'TripAdvisor Review (Visual Impairment)', claim: 'No tactile paving leading to ramp from drop-off point, had to follow my companion', disability_relevance: 'visual', supports: 'partial', reliability: 0.82, date: '2025-08-14', first_hand: true },
          { source_type: 'official', source: 'ASI Audio Guide Program', claim: 'Audio guide headsets available at East Gate ticket counter — includes English and Hindi narration', disability_relevance: 'visual', supports: 'accessible', reliability: 0.91, date: '2024-06-01' }
        ]
      },
      {
        id: 'taj-west-gate',
        name: 'West Gate Entrance (Saheli Burj - Stairs Only)',
        type: 'entrance',
        lat: 27.1733,
        lng: 78.0400,
        icon: '🚪',
        evidence: [
          { source_type: 'government', source: 'ASI Agra Circle Infrastructure Report', claim: 'West Gate entrance approach contains 14 steep red sandstone stairs without ramp access or handrails', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.96, date: '2024-05-10' },
          { source_type: 'review', source: 'Wheelchair Users India Forum', claim: 'West gate is completely impassable in a wheelchair due to high steps and narrow turnstile security barrier. PwD must use East Gate instead', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.94, date: '2025-02-18', first_hand: true },
          { source_type: 'official', source: 'ASI Site Advisory', claim: 'Step-free visitors redirected to East Gate Shilpgram entrance for battery golf cart connection', disability_relevance: 'all', supports: 'inaccessible', reliability: 0.90, date: '2024-01-01' }
        ]
      },
      {
        id: 'taj-south-gate',
        name: 'South Gate Entrance (Fatehpuri - Restricted Steps)',
        type: 'entrance',
        lat: 27.1720,
        lng: 78.0421,
        icon: '🚪',
        evidence: [
          { source_type: 'official', source: 'ASI Agra Circle Notice', claim: 'South Gate is exit-only during peak hours and features a high stone threshold barrier (18cm step)', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.93, date: '2024-04-12' },
          { source_type: 'review', source: 'Accessible Bharat Community', claim: 'High step threshold at South Gate; manual chair requires lifting. Do not recommend entering here', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.89, date: '2025-01-05', first_hand: true }
        ]
      },
      {
        id: 'taj-golf-cart',
        name: 'Golf Cart Shuttle Stand (Shilpgram PwD Drop-Off)',
        type: 'transit',
        lat: 27.1685,
        lng: 78.0498,
        icon: '🛺',
        evidence: [
          { source_type: 'official', source: 'UP Tourism Accessible Transport Program', claim: 'Free electric golf cart shuttles for UDID cardholders and PwD from Shilpgram parking to East Gate', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.96, date: '2024-01-01' },
          { source_type: 'review', source: 'Accessible Bharat YouTube (Wheelchair vlogger)', claim: 'Golf cart staff were proactive and helpful, assisted with boarding without being asked — distance covered is about 700m', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.90, date: '2025-09-01', first_hand: true }
        ]
      },
      {
        id: 'taj-restrooms',
        name: 'Accessible Restrooms (East Courtyard Cloakroom)',
        type: 'restroom',
        lat: 27.1733,
        lng: 78.0430,
        icon: '🚻',
        evidence: [
          { source_type: 'government', source: 'Sugamya Bharat Bhavan Audit 2024', claim: 'Accessible restrooms with grab bars and wide 90cm doors at East and West Cloakrooms', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.95, date: '2024-09-01' },
          { source_type: 'review', source: 'Indian Wheelchair Traveler Forum', claim: 'Restroom door width is fine. The flush handle is at an awkward height for wheelchair users though', disability_relevance: 'mobility', supports: 'partial', reliability: 0.80, date: '2025-06-10', first_hand: true },
          { source_type: 'official', source: 'ASI Site Guide', claim: 'Braille signage on restroom doors', disability_relevance: 'visual', supports: 'accessible', reliability: 0.86, date: '2024-01-01' }
        ]
      },
      {
        id: 'taj-forecourt',
        name: 'Main Forecourt & Reflecting Pool Promenade',
        type: 'poi',
        lat: 27.1740,
        lng: 78.0421,
        icon: '🌊',
        evidence: [
          { source_type: 'official', source: 'ASI Site Map 2025', claim: 'Forecourt has wide paved pathways around the central pool, minimum 2m width throughout', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.94, date: '2025-01-01' },
          { source_type: 'review', source: 'Accessible India Campaign Field Report', claim: 'Pathway surface is flat and level — excellent for all wheelchair types', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.92, date: '2025-03-05', first_hand: true },
          { source_type: 'review', source: 'National Association for the Blind field visit', claim: 'Tactile guide path exists from East Gate to the reflecting pool viewpoint — ends there and does not continue to mausoleum', disability_relevance: 'visual', supports: 'partial', reliability: 0.91, date: '2024-12-10', first_hand: true }
        ]
      },
      {
        id: 'taj-marble-plinth',
        name: 'Marble Plinth Terrace & Mausoleum Ramp',
        type: 'poi',
        lat: 27.1748,
        lng: 78.0421,
        icon: '🕌',
        evidence: [
          { source_type: 'government', source: 'ASI Infrastructure Report 2025', claim: 'Wooden ramp overlay installed on marble steps to the main mausoleum terrace', disability_relevance: 'mobility', supports: 'partial', reliability: 0.93, date: '2025-02-10' },
          { source_type: 'review', source: 'Rolling Planet Travel (power wheelchair user)', claim: 'The wooden ramp works for manual chairs but power chairs with large bases cannot turn at the top landing — very tight space', disability_relevance: 'mobility', supports: 'partial', reliability: 0.87, date: '2025-07-21', first_hand: true },
          { source_type: 'official', source: 'ASI Visual Guide 2025', claim: 'No tactile guide path on marble surface; reflective white marble causes glare challenges for low-vision visitors', disability_relevance: 'visual', supports: 'inaccessible', reliability: 0.89, date: '2025-01-01' },
          { source_type: 'review', source: 'TripAdvisor (hearing impaired, ISL guide)', claim: 'ASI provides ISL-trained guide on advance request through their website — guide was excellent', disability_relevance: 'hearing', supports: 'accessible', reliability: 0.85, date: '2025-04-18', first_hand: true }
        ]
      }
    ]
  },
  {
    id: 'qutub-minar',
    name: 'Qutub Minar Complex',
    city: 'New Delhi',
    category: 'UNESCO Heritage Monument',
    lat: 28.5245,
    lng: 77.1855,
    coverImage: 'https://images.unsplash.com/photo-1515091943-9d5c0ad475af?auto=format&fit=crop&w=800&q=80',
    overallScore: { mobility: 64, visual: 58, hearing: 70, cognitive: 66 },
    visitorPoints: [
      {
        id: 'qutub-main-entrance',
        name: 'Main Accessible Ticket Gate (Ramped)',
        type: 'entrance',
        lat: 28.5248,
        lng: 77.1849,
        icon: '🚪',
        evidence: [
          { source_type: 'government', source: 'ASI Delhi Circle Audit 2024', claim: 'Step-free ramp exists at the main gate 30m left of turnstiles with handrails', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.91, date: '2024-06-01' },
          { source_type: 'review', source: 'Accessible India Campaign', claim: 'Ramp allows smooth wheelchair entry directly to ticket validation point', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.88, date: '2024-10-12', first_hand: true }
        ]
      },
      {
        id: 'qutub-south-gate',
        name: 'Alai Darwaza South Entry (Stair Barrier)',
        type: 'entrance',
        lat: 28.5238,
        lng: 77.1853,
        icon: '🚪',
        evidence: [
          { source_type: 'official', source: 'ASI Conservation Study', claim: 'Historical southern archway has 6 stone steps without ramp modification allowed under ASI heritage norms', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.95, date: '2024-01-01' },
          { source_type: 'review', source: 'Delhi PwD Traveler Club', claim: 'Avoid entering through southern Alai gate; stick to northern main ramp gate', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.90, date: '2025-03-10', first_hand: true }
        ]
      },
      {
        id: 'qutub-restroom',
        name: 'Accessible Toilet Block (Near Entry)',
        type: 'restroom',
        lat: 28.5247,
        lng: 77.1851,
        icon: '🚻',
        evidence: [
          { source_type: 'government', source: 'Sugamya Bharat Audit Delhi', claim: 'Ramped toilet cabin with grab rails and emergency call cord located near entry courtyard', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.92, date: '2024-07-20' }
        ]
      },
      {
        id: 'qutub-courtyard',
        name: 'Iron Pillar & Central Courtyard',
        type: 'poi',
        lat: 28.5245,
        lng: 77.1855,
        icon: '🏛️',
        evidence: [
          { source_type: 'official', source: 'ASI Site Overview', claim: 'Courtyard has uneven sandstone paving with gaps between stones — challenging for wheelchair users', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.91, date: '2024-01-01' },
          { source_type: 'review', source: 'Mobility India Forum', claim: 'Electric wheelchair had difficulty on the paving; strongly recommend a wide-tired manual chair or companion assistance', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.87, date: '2025-02-14', first_hand: true },
          { source_type: 'review', source: 'TripAdvisor (visually impaired group visit)', claim: 'No tactile guide path in the courtyard; audio guide was the only support — covered Iron Pillar description well', disability_relevance: 'visual', supports: 'partial', reliability: 0.80, date: '2025-01-08', first_hand: true }
        ]
      },
      {
        id: 'qutub-tower-interior',
        name: 'Qutub Minar Tower Perimeter',
        type: 'poi',
        lat: 28.5244,
        lng: 77.1855,
        icon: '🗼',
        evidence: [
          { source_type: 'official', source: 'ASI Notice (Permanent)', claim: 'Entry to tower staircase is permanently closed to public for safety reasons since 1981; outer perimeter pathway is accessible', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.99, date: '1981-01-01' }
        ]
      }
    ]
  },
  {
    id: 'kashi-vishwanath',
    name: 'Kashi Vishwanath Corridor',
    city: 'Varanasi, Uttar Pradesh',
    category: 'Religious Heritage Site',
    lat: 25.3109,
    lng: 83.0107,
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    overallScore: { mobility: 91, visual: 84, hearing: 78, cognitive: 80 },
    visitorPoints: [
      {
        id: 'kwc-gate4',
        name: 'Gate 4 Accessible Entry (Godowlia Side)',
        type: 'entrance',
        lat: 25.3108,
        lng: 83.0103,
        icon: '🚪',
        evidence: [
          { source_type: 'official', source: 'Kashi Vishwanath Temple Trust 2023', claim: 'Gate 4 designated as the primary accessible entry with step-free path and security screening for wheelchair users', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.97, date: '2023-12-01' },
          { source_type: 'review', source: 'Wheelchair Travel India (group visit)', claim: 'Gate 4 staff were trained and very supportive; entire group entered without issues in under 10 minutes', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.93, date: '2025-01-17', first_hand: true }
        ]
      },
      {
        id: 'kwc-ghat-stairs-entry',
        name: 'Manikarnika Ghat Lane Entry (Steep Steps)',
        type: 'entrance',
        lat: 25.3114,
        lng: 83.0125,
        icon: '🚪',
        evidence: [
          { source_type: 'official', source: 'Temple Security Guidelines', claim: 'Ancient Ghat approach contains 28 uneven wet stone stairs leading from riverbank with zero ramp access', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.98, date: '2024-01-01' }
        ]
      },
      {
        id: 'kwc-glass-elevator',
        name: 'Glass Elevator to Ganga Deck',
        type: 'transit',
        lat: 25.3112,
        lng: 83.0109,
        icon: '🛗',
        evidence: [
          { source_type: 'official', source: 'Kashi Vishwanath Corridor Design Report', claim: 'Wide glass elevator with auto-open doors, 110cm clear width, Braille and audio floor announcements', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.98, date: '2023-03-15' },
          { source_type: 'official', source: 'Kashi Vishwanath Corridor Design Report', claim: 'Elevator voice announcer in Hindi and English; Braille control panel at 95cm height', disability_relevance: 'visual', supports: 'accessible', reliability: 0.96, date: '2023-03-15' },
          { source_type: 'review', source: 'Accessible Pilgrimage India (power chair user)', claim: 'Elevator is fast and wide — even my large power chair had no issues. Best accessible elevator at any Indian monument', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.95, date: '2024-11-20', first_hand: true }
        ]
      },
      {
        id: 'kwc-restroom',
        name: 'Accessible Washroom Facility',
        type: 'restroom',
        lat: 25.3110,
        lng: 83.0105,
        icon: '🚻',
        evidence: [
          { source_type: 'official', source: 'Corridor Sanitation Audit', claim: 'State of the art accessible washrooms with automated touchless doors and low-height sinks', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.96, date: '2024-02-01' }
        ]
      },
      {
        id: 'kwc-ganga-deck',
        name: 'Ganga Aarti Viewing Deck',
        type: 'poi',
        lat: 25.3115,
        lng: 83.0115,
        icon: '🌅',
        evidence: [
          { source_type: 'official', source: 'Kashi Vishwanath Trust Accessibility Guide', claim: 'Dedicated wheelchair section at the front of the Ganga Aarti viewing platform with unobstructed sightlines', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.94, date: '2024-01-01' },
          { source_type: 'review', source: 'TripAdvisor (hard of hearing visitor)', claim: 'Visual display boards showing Aarti ceremony info — no ISL interpreter present at my visit though', disability_relevance: 'hearing', supports: 'partial', reliability: 0.80, date: '2025-03-22', first_hand: true }
        ]
      }
    ]
  },
  {
    id: 'amber-fort',
    name: 'Amber Fort (Amer Fort)',
    city: 'Jaipur, Rajasthan',
    category: 'UNESCO Heritage Fort',
    lat: 26.9855,
    lng: 75.8513,
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    overallScore: { mobility: 62, visual: 55, hearing: 68, cognitive: 60 },
    visitorPoints: [
      {
        id: 'amber-golf-cart-gate',
        name: 'Maota Lake Shuttle Entry (Accessible)',
        type: 'entrance',
        lat: 26.9848,
        lng: 75.8508,
        icon: '🚪',
        evidence: [
          { source_type: 'official', source: 'Rajasthan Tourism Accessibility Program 2024', claim: 'Golf cart service delivers PwD visitors directly to Suraj Pol courtyard avoiding cobblestone hill', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.93, date: '2024-04-01' },
          { source_type: 'review', source: 'Accessible India Forum', claim: 'Golf cart operates smoothly up to the main courtyard upon showing UDID card', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.87, date: '2025-05-12', first_hand: true }
        ]
      },
      {
        id: 'amber-chand-pol-stairs',
        name: 'Chand Pol Pedestrian Gate (Steep Cobblestone Stairs)',
        type: 'entrance',
        lat: 26.9851,
        lng: 75.8502,
        icon: '🚪',
        evidence: [
          { source_type: 'official', source: 'Rajasthan Forts Audit', claim: 'Chand Pol has 45 steep uneven stone steps with rough cobblestones — severe barrier for wheelchairs and crutch users', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.98, date: '2024-01-01' }
        ]
      },
      {
        id: 'amber-suraj-pol',
        name: 'Suraj Pol (Sun Gate) Courtyard',
        type: 'poi',
        lat: 26.9858,
        lng: 75.8515,
        icon: '🏰',
        evidence: [
          { source_type: 'review', source: 'Rolling Without Limits Blog', claim: 'Suraj Pol courtyard is manageable in a manual chair; wide flat stone sections', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.85, date: '2024-08-19', first_hand: true },
          { source_type: 'official', source: 'ASI Rajasthan Audit', claim: 'Audio guide has 12-stop narration in Hindi, English, and French', disability_relevance: 'visual', supports: 'accessible', reliability: 0.87, date: '2024-01-01' }
        ]
      },
      {
        id: 'amber-sheesh-mahal',
        name: 'Sheesh Mahal (Mirror Palace - Stairs Barrier)',
        type: 'poi',
        lat: 26.9860,
        lng: 75.8520,
        icon: '🪞',
        evidence: [
          { source_type: 'review', source: 'Indian Wheelchair Society', claim: 'Access to Sheesh Mahal requires navigating 3 flights of narrow uneven stone stairs — no ramp or lift available', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.92, date: '2025-01-31', first_hand: true },
          { source_type: 'official', source: 'ASI Heritage Notice', claim: 'Interior staircases are original 16th century structure; modification not permitted under heritage protection', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.99, date: '2023-01-01' }
        ]
      }
    ]
  },
  {
    id: 'red-fort',
    name: 'Red Fort (Lal Qila)',
    city: 'New Delhi',
    category: 'UNESCO Heritage Monument',
    lat: 28.6562,
    lng: 77.2410,
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    overallScore: { mobility: 74, visual: 65, hearing: 72, cognitive: 70 },
    visitorPoints: [
      {
        id: 'redfort-lahori-gate',
        name: 'Lahori Gate Accessible Side Ramp Entry',
        type: 'entrance',
        lat: 28.6562,
        lng: 77.2403,
        icon: '🚪',
        evidence: [
          { source_type: 'government', source: 'ASI Delhi Circle Accessibility Report 2024', claim: 'Ramp access at the side entrance adjacent to Lahori Gate with 1:12 slope, width 1.2m', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.92, date: '2024-07-15' }
        ]
      },
      {
        id: 'redfort-delhi-gate',
        name: 'Delhi Gate (Southern Stair Gate)',
        type: 'entrance',
        lat: 28.6515,
        lng: 77.2418,
        icon: '🚪',
        evidence: [
          { source_type: 'official', source: 'ASI Notice', claim: 'Delhi gate approach contains 8 steep stone steps with no ramp installed; closed to regular wheelchair entry', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.94, date: '2024-01-01' }
        ]
      },
      {
        id: 'redfort-chatta-chowk',
        name: 'Chatta Chowk (Covered Bazaar)',
        type: 'poi',
        lat: 28.6558,
        lng: 77.2413,
        icon: '🏪',
        evidence: [
          { source_type: 'review', source: 'TripAdvisor (electric wheelchair user)', claim: 'Chatta Chowk is flat and wide — very manageable. Shops are accessible from main corridor', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.86, date: '2025-02-28', first_hand: true }
        ]
      },
      {
        id: 'redfort-diwan-i-am',
        name: 'Diwan-i-Aam (Hall of Audience)',
        type: 'poi',
        lat: 28.6560,
        lng: 77.2425,
        icon: '🏛️',
        evidence: [
          { source_type: 'official', source: 'ASI Site Guide 2024', claim: 'Diwan-i-Aam has flat ground access with no steps; paved accessible path connects from Chatta Chowk', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.92, date: '2024-01-01' }
        ]
      }
    ]
  },
  {
    id: 'humayuns-tomb',
    name: "Humayun's Tomb",
    city: 'New Delhi',
    category: 'UNESCO Heritage Monument',
    lat: 28.5933,
    lng: 77.2507,
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
    overallScore: { mobility: 78, visual: 68, hearing: 74, cognitive: 72 },
    visitorPoints: [
      {
        id: 'humayun-west-gate',
        name: 'West Gate Entrance (Main Accessible Ramp Entry)',
        type: 'entrance',
        lat: 28.5928,
        lng: 77.2498,
        icon: '🚪',
        evidence: [
          { source_type: 'official', source: 'ASI Delhi Conservation Report', claim: 'Main entry gate at West has smooth sandstone ramp and accessible ticket counter with tactile guide path', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.95, date: '2024-01-01' },
          { source_type: 'review', source: 'Accessible Tourism Delhi', claim: 'West Gate entry is completely step-free with broad paved pathways', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.91, date: '2025-02-10', first_hand: true }
        ]
      },
      {
        id: 'humayun-south-gate',
        name: 'South Gate (Bu Halima Complex - Stepped Entry)',
        type: 'entrance',
        lat: 28.5918,
        lng: 77.2505,
        icon: '🚪',
        evidence: [
          { source_type: 'official', source: 'ASI Monument Guide', claim: 'Historical southern enclosure has 5 stone steps without ramp modification; visitors redirected to West Gate', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.94, date: '2024-01-01' }
        ]
      },
      {
        id: 'humayun-restrooms',
        name: 'Accessible Restroom Block (Near West Entry)',
        type: 'restroom',
        lat: 28.5930,
        lng: 77.2501,
        icon: '🚻',
        evidence: [
          { source_type: 'government', source: 'Sugamya Bharat Audit', claim: 'Modern accessible washroom with grab rails and wide sliding doors', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.94, date: '2024-05-15' }
        ]
      },
      {
        id: 'humayun-charbagh',
        name: 'Charbagh Persian Garden Pathways',
        type: 'poi',
        lat: 28.5933,
        lng: 77.2507,
        icon: '🌿',
        evidence: [
          { source_type: 'official', source: 'ASI Conservation Report 2024', claim: 'Garden pathways restored with even sandstone paving, 1.8m width throughout, level surface', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.94, date: '2024-01-01' },
          { source_type: 'review', source: 'Accessible Tourism India', claim: 'Garden is the most wheelchair-friendly part — smooth, wide paths. Highly recommend visiting at dawn for fewer crowds', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.91, date: '2025-06-10', first_hand: true }
        ]
      },
      {
        id: 'humayun-plinth',
        name: 'Main Mausoleum Plinth Entry Ramp',
        type: 'poi',
        lat: 28.5935,
        lng: 77.2507,
        icon: '🕌',
        evidence: [
          { source_type: 'government', source: 'ASI Sugamya Bharat Report 2023', claim: 'Permanent concrete ramp at SW corner of plinth installed with handrail; slope measured at 1:11 (marginally non-compliant)', disability_relevance: 'mobility', supports: 'partial', reliability: 0.91, date: '2023-10-01' },
          { source_type: 'review', source: 'PwD Traveler (manual wheelchair)', claim: 'Ramp was usable but required a strong companion to push me up; slope is slightly steep', disability_relevance: 'mobility', supports: 'partial', reliability: 0.85, date: '2024-11-08', first_hand: true }
        ]
      }
    ]
  },
  {
    id: 'mysore-palace',
    name: 'Mysore Palace (Amba Vilas)',
    city: 'Mysuru, Karnataka',
    category: 'Heritage Palace Museum',
    lat: 12.3052,
    lng: 76.6551,
    coverImage: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&w=800&q=80',
    overallScore: { mobility: 70, visual: 60, hearing: 69, cognitive: 67 },
    visitorPoints: [
      {
        id: 'mysore-north-gate',
        name: 'North Gate (Varaha Gate - Accessible Ramp)',
        type: 'entrance',
        lat: 12.3060,
        lng: 76.6548,
        icon: '🚪',
        evidence: [
          { source_type: 'official', source: 'Mysore Palace Board Accessibility Notice 2024', claim: 'Designated accessible entrance through North Gate with smooth concrete ramp and golf cart parking', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.94, date: '2024-03-01' },
          { source_type: 'review', source: 'Karnataka Tourism User Feedback', claim: 'North Gate access is completely step-free; security staff guided our wheelchair seamlessly', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.90, date: '2025-07-14', first_hand: true }
        ]
      },
      {
        id: 'mysore-jayamarthanda-gate',
        name: 'Jayamarthanda Main Gate (Stair Steps)',
        type: 'entrance',
        lat: 12.3052,
        lng: 76.6545,
        icon: '🚪',
        evidence: [
          { source_type: 'official', source: 'Mysore Palace Board', claim: 'Main ceremonial gate has 4 steep steps with turnstile barriers; wheelchairs redirected to North Gate', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.92, date: '2024-01-01' }
        ]
      },
      {
        id: 'mysore-ground-floor',
        name: 'Ground Floor Exhibition Galleries & Courtyard',
        type: 'poi',
        lat: 27.1751,
        lng: 78.0421,
        lat: 12.3053,
        lng: 76.6551,
        icon: '🖼️',
        evidence: [
          { source_type: 'review', source: 'Karnataka PwD Welfare Society', claim: 'Ground floor galleries are fully accessible — flat floors throughout, wide doorways, good lighting', disability_relevance: 'mobility', supports: 'accessible', reliability: 0.89, date: '2025-04-30', first_hand: true }
        ]
      },
      {
        id: 'mysore-durbar-hall',
        name: 'Durbar Hall (Stairs Only - No Lift)',
        type: 'poi',
        lat: 12.3055,
        lng: 76.6552,
        icon: '🏛️',
        evidence: [
          { source_type: 'review', source: 'Accessible Travel India Blog', claim: 'Durbar Hall requires climbing 12 stairs — no elevator or ramp. Ground floor viewing available', disability_relevance: 'mobility', supports: 'inaccessible', reliability: 0.92, date: '2025-01-25', first_hand: true }
        ]
      }
    ]
  }
];

// Disability key mapping
export const DISABILITY_KEY = {
  'Mobility / Wheelchair': 'mobility',
  'Visual Impairment': 'visual',
  'Hearing / Deaf': 'hearing',
  'Cognitive / Autism Spectrum': 'cognitive'
};

// Accessibility status thresholds (0-100 confidence)
export const STATUS_THRESHOLDS = {
  accessible: { min: 70, color: '#16a34a', bg: '#dcfce7', border: '#86efac', label: 'Accessible', emoji: '🟢' },
  partial: { min: 40, color: '#d97706', bg: '#fef3c7', border: '#fcd34d', label: 'Partially Accessible', emoji: '🟡' },
  inaccessible: { min: 0, color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', label: 'Not Accessible', emoji: '🔴' },
  unknown: { min: -1, color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db', label: 'Unknown / Unverified', emoji: '⚪' }
};
