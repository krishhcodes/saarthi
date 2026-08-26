# Saarthi – Accessible Tourism Navigator for Persons with Disabilities
> **Smart India Hackathon (SIH 2026) Prototype**  
> **Problem Statement ID:** 49  
> **Theme:** Tourism  
> **Team Name:** Ctrl Freaks  
> **Tagline:** “Tourism for Everyone.”

---

## 🌟 Executive Summary

**Saarthi** is an end-to-end, production-ready full-stack accessibility platform built to empower Persons with Disabilities (PwDs), senior citizens, and travelers with reduced mobility to explore India with dignity, confidence, and equal opportunities.

Unlike generic travel platforms that merely rate hotels, Saarthi audits the entire travel chain: step-free navigation, ramp slopes (1:12 CPWD compliance), certified Indian Sign Language (ISL) guides, tactile paving, emergency medical networks, and government schemes (Sugamya Bharat, UDID, ADIP, IRCTC).

---

## 🚀 Key Innovations & Core Features

1. **Accessibility Journey Score™**: A composite 5-factor mathematical index rating Route (25%), Transport (20%), Stay (25%), Destination (20%), and Services (10%) out of 100 with actionable score enhancement tips.
2. **AI Visual Accessibility Verification**: Computer vision simulation that scans uploaded photos of monument entrances/ramps, detects bounding boxes, calculates slope angles, and flags tripping hazards.
3. **Interactive Step-Free Route Planner**: Leaflet & OpenStreetMap route engine with 0-stair elevation profiles, ramp breakdowns, and transit connections.
4. **Community-Powered Accessibility Map**: Crowdsourced pins for ramps, elevators, restrooms, and obstacles with live confirmation and dispute voting.
5. **Specialized Verified Guide Marketplace**: Connects travelers with Ministry of Tourism licensed escorts trained in Indian Sign Language (ISL), audio description, and wheelchair transfers.
6. **Government Schemes Hub**: Direct integration with Sugamya Bharat monument passes, IRCTC rail concessions, ADIP equipment grants, and 24x7 ERSS 112 emergency SOS.
7. **Universal Multilingual & Voice Assistant**: Native voice navigation (STT), screen-reader voice narration (TTS), and 11 Indian & global languages.
8. **Accessible Travel Store**: Assistive equipment (foldable travel ramps, ultrasonic canes, bed transfer slings) delivered directly to hotel suites.
9. **Admin & Guide Portals**: Dedicated moderation queue for crowdsourced reports, guide certification approvals, and booking management.

---

## 📋 Complete 20-Screen Architecture

| # | Screen / Module | Key Capabilities |
|---|---|---|
| 1 | **Landing Page** | Hero, value propositions, animated statistics, SIH 2026 credentials, CTAs. |
| 2 | **Authentication & Personas** | Tourist, Guide, Admin roles with 1-click fast login for SIH jury demonstration. |
| 3 | **Accessibility Profile Wizard** | 6-tier disability needs selector (Mobility, Visual, Hearing, Speech, Cognitive, Multiple). |
| 4 | **Personalized Home Dashboard** | Greeting, profile summary, "Recommended For You", "Your Journey" progress ring. |
| 5 | **Tourist Spot Recommender** | Multi-factor search across 10 Indian hubs (Delhi, Agra, Jaipur, Mumbai, Goa, Kerala, etc.). |
| 6 | **Destination Details** | Comprehensive specs (ramp slope, doorway width, parking, nearby hospitals). |
| 7 | **Accessible Route Planner** | Interactive Leaflet map with 3 route alternatives, 0 stairs, and voice directions. |
| 8 | **Accessible Accommodation** | "Accessible Stays" with roll-in shower specs, bed heights, and visual alarms. |
| 9 | **Verified Guide Marketplace** | Disability expertise filters (ISL, wheelchair mobility, senior care), rates, and booking modal. |
| 10 | **Government & Local Support** | 10 government schemes (Sugamya Bharat, ADIP, UDID, DMRC, ERSS 112). |
| 11 | **Multilingual Voice Assistant** | 11 languages, Web Speech API TTS/STT, and emergency travel communication cards. |
| 12 | **Saarthi AI Travel Chatbot** | Conversational assistant powered by Gemini architecture with contextual advice. |
| 13 | **Community Accessibility Map** | Interactive pins (Ramps, Elevators, Obstacles) with confirm/dispute voting. |
| 14 | **AI Visual Scanner** | Computer vision ramp/stair detector with bounding boxes and confidence scoring. |
| 15 | **Accessibility Journey Score** | 5-tier multi-factor score calculator with interactive one-click improvements. |
| 16 | **Accessible Tourism Store** | E-commerce catalog for assistive travel gear with cart and simulated checkout. |
| 17 | **Trip Planner & Itinerary** | Chronological timeline builder with printable summary and live score sync. |
| 18 | **User Profile & Contributions** | UDID smart-card verification badge, profile parameters, and contribution history. |
| 19 | **Admin Dashboard** | Moderation queue for pending community reports, guide certification approval, analytics. |
| 20 | **Guide Dashboard** | Guide portal for Vikram Singh to accept/reject bookings and manage tour schedule. |

---

## 🏃 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🎯 Step-by-Step SIH Jury Demonstration Flow

1. **Step 1:** Click the **“SIH 2026 Jury Demo Flow”** floating widget in the bottom-left corner.
2. **Step 2:** Select **Aarav Sharma (Wheelchair Traveler)** to experience the personalized UI.
3. **Step 3:** Open **Taj Mahal** destination details to review 1:12 ramp slopes and emergency trauma contacts.
4. **Step 4:** Navigate to **Step-Free Route Planner** to see the 0-stair elevation path on the Leaflet map.
5. **Step 5:** Book **Vikram Singh** in the Specialized Guide Marketplace.
6. **Step 6:** Open **AI Scanner** and run visual detection on the entrance photo (bounding boxes + 94% confidence).
7. **Step 7:** Publish the finding to the **Community Accessibility Map** and test the confirm/dispute voting.
8. **Step 8:** Open **Accessibility Journey Score** to review the composite score (88 → 93/100).
9. **Step 9:** Switch to **Admin (Dr. Sharma)** to approve pending community reports.

---

## 🔌 Connecting Real Production APIs

This application is built with a clean service adapter pattern. To connect real API keys, copy `.env.example` to `.env` and provide your credentials:

- **Google Maps & Places:** Add `VITE_GOOGLE_MAPS_API_KEY`
- **Google Gemini AI:** Add `VITE_GEMINI_API_KEY`
- **Firebase Auth:** Add `VITE_FIREBASE_API_KEY` and project details
- **Google Translate:** Add `VITE_GOOGLE_TRANSLATE_API_KEY`
