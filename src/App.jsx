import React from 'react';
import { useApp } from './context/AppContext';

// Common Components
import AccessibilityBar from './components/common/AccessibilityBar';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import SosEmergencyModal from './components/common/SosEmergencyModal';
import VoiceAssistantModal from './components/common/VoiceAssistantModal';
import NotificationToast from './components/common/NotificationToast';
import DemoIndicator from './components/common/DemoIndicator';

// View Components
import LandingView from './components/views/LandingView';
import AuthView from './components/views/AuthView';
import AccessibilityProfileView from './components/views/AccessibilityProfileView';
import DashboardView from './components/views/DashboardView';
import DestinationsView from './components/views/DestinationsView';
import DestinationDetailView from './components/views/DestinationDetailView';
import RoutePlannerView from './components/views/RoutePlannerView';
import HotelsView from './components/views/HotelsView';
import GuidesView from './components/views/GuidesView';
import GovServicesView from './components/views/GovServicesView';
import MultilingualVoiceView from './components/views/MultilingualVoiceView';
import AiVerificationView from './components/views/AiVerificationView';
import CommunityMapView from './components/views/CommunityMapView';
import JourneyScoreView from './components/views/JourneyScoreView';
import StoreView from './components/views/StoreView';
import TripPlannerView from './components/views/TripPlannerView';
import UserProfileView from './components/views/UserProfileView';
import AdminDashboardView from './components/views/AdminDashboardView';
import GuideDashboardView from './components/views/GuideDashboardView';
import AiChatbotDrawer from './components/views/AiChatbotDrawer';
import PlacesView from './components/views/PlacesView';
import GuideApplicationView from './components/views/GuideApplicationView';

export default function App() {
  const { currentView, currentUser, guideApplicationStatus } = useApp();

  const renderActiveView = () => {
    // Guide role guard: unverified guides always see the application view
    if (currentUser?.role === 'guide' && guideApplicationStatus !== 'verified') {
      if (currentView === 'guide-dashboard' || currentView === 'guide-application') {
        return <GuideApplicationView />;
      }
    }
    switch (currentView) {
      case 'landing':
        return <LandingView />;
      case 'auth':
        return <AuthView />;
      case 'profile-setup':
        return <AccessibilityProfileView />;
      case 'dashboard':
        return <DashboardView />;
      case 'destinations':
        return <DestinationsView />;
      case 'destination-detail':
        return <DestinationDetailView />;
      case 'places':
        return <PlacesView />;
      case 'route-planner':
        return <RoutePlannerView />;
      case 'hotels':
        return <HotelsView />;
      case 'guides':
        return <GuidesView />;
      case 'gov-services':
        return <GovServicesView />;
      case 'multilingual':
        return <MultilingualVoiceView />;
      case 'ai-verify':
        return <AiVerificationView />;
      case 'community-map':
        return <CommunityMapView />;
      case 'journey-score':
        return <JourneyScoreView />;
      case 'store':
        return <StoreView />;
      case 'trip-planner':
        return <TripPlannerView />;
      case 'profile':
        return <UserProfileView />;
      case 'admin-dashboard':
        return <AdminDashboardView />;
      case 'guide-application':
        return <GuideApplicationView />;
      case 'guide-dashboard':
        return <GuideDashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-saarthi-500 selection:text-white relative">
      {/* Top Accessibility Bar */}
      <AccessibilityBar />

      {/* Main Navigation Header */}
      <Header />

      {/* Active Screen View */}
      <main className="flex-1" id="main-content">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Modals & Drawers */}
      <AiChatbotDrawer />
      <VoiceAssistantModal />
      <SosEmergencyModal />
      <NotificationToast />
      <DemoIndicator />
    </div>
  );
}
