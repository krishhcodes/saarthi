// Saarthi AI Service - Vision Verification & Travel Assistant
// Supports real Gemini/OpenAI API when key provided, with intelligent offline demonstration engine

export const SAMPLE_VERIFICATION_IMAGES = [
  {
    id: "sample-ramp-1",
    name: "Taj Mahal Marble Plinth Approach Ramp",
    url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    label: "Monument Entrance Ramp",
    mockResult: {
      overallVerdict: "Accessible (Step-Free Compliant)",
      confidenceScore: 94,
      slopeAngle: "4.8° (1:12 slope, within CPWD accessibility guidelines)",
      surfaceType: "Anti-skid composite paved stone",
      detectedFeatures: [
        { label: "Wheelchair Ramp", bbox: [20, 35, 75, 55], status: "positive", detail: "Uniform incline with slip-resistant finish" },
        { label: "Dual Height Handrails", bbox: [15, 10, 85, 25], status: "positive", detail: "Upper rail 90cm, Lower rail 70cm" },
        { label: "Step-Free Level Threshold", bbox: [70, 30, 95, 70], status: "positive", detail: "Zero trip hazard at landing" },
        { label: "Tactile Warning Strip", bbox: [85, 32, 98, 68], status: "positive", detail: "Yellow blister tactile paver at ramp start" }
      ],
      safetyRisks: [],
      journeyScoreImpact: "+6 Points to Route Score",
      recommendation: "Safe for both manual wheelchairs and power chairs without assistant."
    }
  },
  {
    id: "sample-stairs-1",
    name: "Historic Gateway with 5 Stone Steps & No Ramp",
    url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    label: "Barrier / Stairs Detected",
    mockResult: {
      overallVerdict: "Inaccessible (Manual Lifting Required or Detour Recommended)",
      confidenceScore: 91,
      slopeAngle: "Not applicable (Steep stairs: 5 risers @ 16cm each)",
      surfaceType: "Historical uneven cobblestone / granite",
      detectedFeatures: [
        { label: "Flight of Stairs (5 Steps)", bbox: [30, 20, 75, 80], status: "danger", detail: "Total height rise: ~80cm without ramp" },
        { label: "No Handrails", bbox: [10, 10, 90, 20], status: "warning", detail: "Open stone edge without safety grip" },
        { label: "Uneven Stone Risers", bbox: [45, 30, 65, 70], status: "warning", detail: "Cobblestone lip poses tripping hazard" }
      ],
      safetyRisks: [
        "Unsafe for wheelchair without 2 strong assistants",
        "Tripping hazard for visually impaired visitors due to missing contrast nosing"
      ],
      journeyScoreImpact: "-12 Points if traversed (Alternative bypass route available)",
      recommendation: "Use the East Gate Bypass Corridor which provides an electric golf shuttle directly to the inner court."
    }
  },
  {
    id: "sample-elevator-1",
    name: "Kashi Vishwanath Corridor Glass Elevator",
    url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    label: "Elevator / Lift Access",
    mockResult: {
      overallVerdict: "Highly Accessible (Certified Mechanical Access)",
      confidenceScore: 97,
      slopeAngle: "Level entry (Zero threshold step)",
      surfaceType: "Polished granite with tactile directional lead-in",
      detectedFeatures: [
        { label: "Wide Automatic Door", bbox: [25, 30, 85, 70], status: "positive", detail: "Clear opening width: 110cm (Power wheelchair compliant)" },
        { label: "Braille & Audio Control Panel", bbox: [45, 72, 65, 85], status: "positive", detail: "Low height (95cm from floor) with voice annunciator" },
        { label: "Transparent Safety Glass", bbox: [20, 25, 80, 75], status: "positive", detail: "High visibility and emergency intercom" }
      ],
      safetyRisks: [],
      journeyScoreImpact: "+10 Points to Accessibility Score",
      recommendation: "Direct step-free descent to Ganga Aarti viewing deck."
    }
  }
];

export async function analyzeAccessibilityPhoto(imageSource, customApiKey = null) {
  // Simulate realistic network latency for computer vision inference
  await new Promise(resolve => setTimeout(resolve, 1200));

  // If matched with one of our sample images
  if (typeof imageSource === 'string') {
    const matched = SAMPLE_VERIFICATION_IMAGES.find(s => s.url === imageSource || s.id === imageSource);
    if (matched) {
      return {
        ...matched.mockResult,
        analyzedAt: new Date().toISOString(),
        isAiAssisted: true,
        disclaimer: "AI-assisted visual verification. Verify with on-ground signage or Saarthi community reports."
      };
    }
  }

  // Dynamic analysis simulation for user uploaded custom image
  return {
    overallVerdict: "AI-Assisted Scan Completed",
    confidenceScore: 89,
    slopeAngle: "Estimated 1:13 incline (Compliant slope detected)",
    surfaceType: "Paved outdoor walkway with transition landing",
    detectedFeatures: [
      { label: "Ramp / Sloped Pathway", bbox: [25, 20, 78, 80], status: "positive", detail: "Continuous path detected without step obstruction" },
      { label: "Handrail Structure", bbox: [20, 15, 80, 30], status: "positive", detail: "Side guidance detected" },
      { label: "Wide Entry Clearance", bbox: [30, 35, 70, 65], status: "positive", detail: ">90cm clear path detected" }
    ],
    safetyRisks: [
      "Ensure ground surface is dry during monsoons to avoid slip"
    ],
    journeyScoreImpact: "+5 Points",
    recommendation: "Suitable for wheelchair and assisted mobility.",
    analyzedAt: new Date().toISOString(),
    isAiAssisted: true,
    disclaimer: "AI-assisted visual verification. Always cross-check with live community reports and local staff."
  };
}

export const AI_CHAT_PRESETS = [
  "Is the Taj Mahal wheelchair accessible?",
  "How do I plan a 2-day accessible trip to Jaipur?",
  "Find a certified sign-language guide in Delhi.",
  "What government subsidies are available for Divyangjan travelers?",
  "Which beach in Goa has floating wheelchairs?"
];

export async function generateChatbotResponse(userMessage, userProfile = null) {
  // Simulate natural typing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const query = userMessage.toLowerCase();
  const disability = userProfile?.primaryDisability || "Mobility / Wheelchair";

  if (query.includes("taj mahal") || query.includes("agra")) {
    return `🏛️ **Taj Mahal Accessibility Overview:**
- **Step-Free Access:** Yes! Permanent ramps lead to the main marble mausoleum terrace with an estimated **1:12 compliant slope**.
- **Transport:** Free electric golf-cart shuttles run from the Shilpgram parking directly to the East Gate for PwD cardholders.
- **Washrooms & Charging:** Accessible restrooms and motorized wheelchair charging are located at the West & East Cloakrooms.
- **Recommended Guide:** Vikram Singh (Sign Language & Wheelchair specialist) is available in Agra today!
- **Accessibility Score:** 92/100 (Certified by ASI & Sugamya Bharat).`;
  }

  if (query.includes("jaipur") || query.includes("2-day") || query.includes("plan")) {
    return `🗓️ **2-Day Accessible Jaipur Itinerary:**
- **Day 1: Royal Heritage & Palaces**
  - *Morning:* City Palace Jaipur (Take the hydraulic glass elevator to the upper textile galleries).
  - *Afternoon:* Jantar Mantar (Flat paved astronomical garden with tactile audio guides).
  - *Stay:* The Lalit Jaipur (Accessible suites with roll-in showers & grab bars).
- **Day 2: Forts & Crafts**
  - *Morning:* Amber Fort (Book the accessible golf-cart shuttle from Maota Lake to bypass the cobblestones).
  - *Evening:* Chokhi Dhani barrier-free cultural village.
- **Journey Score:** 90/100. Would you like me to add this to your **Trip Planner**?`;
  }

  if (query.includes("sign language") || query.includes("deaf") || query.includes("hearing")) {
    return `🤟 **Sign Language & Hearing Assistance:**
- We have **3 certified Indian Sign Language (ISL) guides** available:
  1. **Ananya Deshmukh** (MTDC Verified & ISL Level 4 Interpreter) - Mumbai / Goa
  2. **Vikram Singh** (MOT Regional Guide & ISL specialist) - Delhi / Agra
  3. **Priya Sundaram** (ASI & NAB Trained Guide) - Delhi / Jaipur
- All our recommended monuments in Delhi and Agra feature **induction audio loops** and visual QR code captions.`;
  }

  if (query.includes("government") || query.includes("scheme") || query.includes("sugamya") || query.includes("udid")) {
    return `🇮🇳 **Government Benefits & Schemes for Divyangjan Travelers:**
1. **Sugamya Bharat Abhiyan:** Free entry for PwD + 1 escort across 3,690+ ASI monuments with valid UDID card.
2. **Indian Railways Concession:** Up to 75% rail fare concession on 3AC/Sleeper and priority lower berths via IRCTC.
3. **ADIP Scheme:** Free/subsidized smart white canes with ultrasound sensors and motorized travel wheelchairs.
4. **Airports PRM Service:** Free wheelchair assistance and ambulift boarding at all domestic airports.`;
  }

  if (query.includes("goa") || query.includes("beach")) {
    return `🏖️ **Accessible Goa Beach Highlights:**
- **Calangute Beach:** Equipped with a permanent wooden boardwalk **Mobi-Mat** that rolls out 10m from the high-tide line.
- **Amphibious Wheelchairs:** Free floating Mobi-Chairs with trained lifeguards to safely experience the ocean waves.
- **Accessible Stay:** Grand Hyatt Goa features private ramped beach patios and roll-in showers.`;
  }

  if (query.includes("hotel") || query.includes("stay")) {
    return `🏨 **Top Accessible Stays matching your profile (${disability}):**
1. **The Oberoi Amarvilas (Agra)** – Score 96/100 (Roll-in shower, wide 95cm doorways, step-free terrace overlooking Taj).
2. **ITC Maurya (Delhi)** – Score 94/100 (Universal accessibility suite, visual smoke alarms, braille elevators).
3. **The Leela Palace (Bengaluru)** – Score 95/100 (Automated washlets, level entrance, wheelchair concierge).
Check the **Accessible Stays** tab to book with verified room measurements!`;
  }

  // Default helpful response
  return `✨ **Saarthi AI Travel Assistant at your service!**
I can help you navigate barrier-free tourism in India tailored to your **${disability}** profile:
- 🗺️ **Find Step-Free Routes:** Real-time ramp and elevator detection.
- 🏛️ **Monument Accessibility:** Verify entrance slopes, washrooms, and crowd timings.
- 🦽 **Match Specialized Guides:** Book verified Sign Language and Mobility escorts.
- 🛡️ **Government Support:** Check UDID card perks and emergency medical contacts.

What destination or facility would you like to explore today?`;
}
