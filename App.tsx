import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from './src/components/Sidebar';
import { Header } from './src/components/Header';
import { DashboardView } from './src/views/DashboardView';
import { DocumentVaultView } from './src/views/DocumentVaultView';
import { UploadView } from './src/views/UploadView';
import { SmartQueryView } from './src/views/SmartQueryView';
import { PortfolioAnalyticsView } from './src/views/PortfolioAnalyticsView';
import { ComplianceView } from './src/views/ComplianceView';
import { NotificationsView } from './src/views/NotificationsView';
import { SettingsView } from './src/views/SettingsView';
import { LoanReviewView } from './src/views/LoanReviewView';
import { ProfileView } from './src/views/ProfileView';
import { LoanReviewsListView } from './src/views/LoanReviewsListView';

// Import new views
import { FilterView } from './src/views/FilterView';
import { DocumentDetailView } from './src/views/DocumentDetailView';
import { EditProfileView } from './src/views/EditProfileView';
import { AlertsLogView } from './src/views/AlertsLogView';
import { ActivityLogView } from './src/views/ActivityLogView';
import { ViolationsLogView } from './src/views/ViolationsLogView';
import { PublicProfileView } from './src/views/PublicProfileView';
import { AnalyticsResultView } from './src/views/AnalyticsResultView';
import { LandingPage } from './src/views/LandingPage';
import { AuthView } from './src/views/AuthView';


import { ViewState, Doc } from './src/types';
import { INITIAL_VAULT_DOCS } from './src/data/mockData';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initial state check from hash, default to dashboard
  const getInitialView = (): ViewState => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      const validViews: ViewState[] = [
        'landing', 'auth', 'dashboard', 'vault', 'upload', 'smart_query', 'analytics', 'compliance',
        'notifications', 'settings', 'loan_review', 'profile', 'loan_reviews',
        'filter', 'document_detail', 'edit_profile', 'alerts_log', 'activity_log',
        'violations_log', 'public_profile', 'analytics_result'
      ];

      if (validViews.includes(hash as ViewState)) {
        return hash as ViewState;
      }
    }
    return 'landing';
  };

  const [currentView, setCurrentView] = useState<ViewState>(getInitialView);
  const [vaultDocs, setVaultDocs] = useState<Doc[]>(INITIAL_VAULT_DOCS);

  // Sync state to hash
  useEffect(() => {
    window.location.hash = currentView;
  }, [currentView]);

  // Sync hash to state (handle back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== currentView) {
        // We can cast here safely as long as we trust the hash to be valid or fallback
         const validViews: ViewState[] = [
            'landing', 'auth', 'dashboard', 'vault', 'upload', 'smart_query', 'analytics', 'compliance',
            'notifications', 'settings', 'loan_review', 'profile', 'loan_reviews',
            'filter', 'document_detail', 'edit_profile', 'alerts_log', 'activity_log',
            'violations_log', 'public_profile', 'analytics_result'
          ];
        if (validViews.includes(hash as ViewState)) {
          setCurrentView(hash as ViewState);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);


  const handleUploadComplete = (newDocs: Doc[]) => {
    setVaultDocs(prev => [...newDocs, ...prev]);
    setCurrentView('vault');
  };

  // If landing page, render full screen without sidebar/header
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen w-full bg-background text-text-main font-sans selection:bg-primary selection:text-black">
        <Toaster position="top-right" theme="dark" richColors />
        <LandingPage setView={setCurrentView} />
      </div>
    );
  }

  // If auth page, render full screen without sidebar/header
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen w-full bg-background text-text-main font-sans selection:bg-primary selection:text-black">
        <Toaster position="top-right" theme="dark" richColors />
        <AuthView setView={setCurrentView} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-text-main font-sans selection:bg-primary selection:text-black">
      <Toaster position="top-right" theme="dark" richColors />
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        currentView={currentView}
        setView={setCurrentView}
      />

      <main className="flex flex-1 flex-col overflow-hidden relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0a1e16] via-background to-background">

        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationClick={() => setCurrentView('notifications')}
          currentView={currentView}
          setView={setCurrentView}
        />

        {currentView === 'dashboard' && <DashboardView setView={setCurrentView} />}
        {currentView === 'vault' && <DocumentVaultView setView={setCurrentView} docs={vaultDocs} />}
        {currentView === 'upload' && <UploadView setView={setCurrentView} onUploadComplete={handleUploadComplete} />}
        {currentView === 'smart_query' && <SmartQueryView setView={setCurrentView} />}
        {currentView === 'analytics' && <PortfolioAnalyticsView />}
        {currentView === 'compliance' && <ComplianceView />}
        {currentView === 'notifications' && <NotificationsView />}
        {currentView === 'settings' && <SettingsView setView={setCurrentView} />}
        {currentView === 'loan_reviews' && <LoanReviewsListView setView={setCurrentView} />}
        {currentView === 'loan_review' && <LoanReviewView />}
        {currentView === 'profile' && <ProfileView />}

        {/* New Views */}
        {currentView === 'filter' && <FilterView setView={setCurrentView} />}
        {currentView === 'document_detail' && <DocumentDetailView setView={setCurrentView} />}
        {currentView === 'edit_profile' && <EditProfileView setView={setCurrentView} />}
        {currentView === 'alerts_log' && <AlertsLogView setView={setCurrentView} />}
        {currentView === 'activity_log' && <ActivityLogView setView={setCurrentView} />}
        {currentView === 'violations_log' && <ViolationsLogView setView={setCurrentView} />}
        {currentView === 'public_profile' && <PublicProfileView setView={setCurrentView} />}
        {currentView === 'analytics_result' && <AnalyticsResultView setView={setCurrentView} />}

      </main>
    </div>
  );
}
