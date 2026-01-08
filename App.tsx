import React, { useState, useEffect } from 'react';
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

import { ViewState, Doc } from './src/types';
import { INITIAL_VAULT_DOCS } from './src/data/mockData';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initial state check from hash, default to dashboard
  const getInitialView = (): ViewState => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      // Type guard could be stricter here, but for now simple check
      if (['dashboard', 'vault', 'upload', 'smart_query', 'analytics', 'compliance', 'notifications', 'settings', 'loan_review', 'profile', 'loan_reviews'].includes(hash)) {
        return hash as ViewState;
      }
    }
    return 'dashboard';
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
        if (['dashboard', 'vault', 'upload', 'smart_query', 'analytics', 'compliance', 'notifications', 'settings', 'loan_review', 'profile', 'loan_reviews'].includes(hash)) {
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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-text-main font-sans selection:bg-primary selection:text-black">
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
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'loan_reviews' && <LoanReviewsListView setView={setCurrentView} />}
        {currentView === 'loan_review' && <LoanReviewView />}
        {currentView === 'profile' && <ProfileView />}

      </main>
    </div>
  );
}