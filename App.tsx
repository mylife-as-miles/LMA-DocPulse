import React, { useState } from 'react';
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
import { ViewState, Doc } from './src/types';
import { INITIAL_VAULT_DOCS } from './src/data/mockData';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [vaultDocs, setVaultDocs] = useState<Doc[]>(INITIAL_VAULT_DOCS);

  const handleUploadComplete = (newDocs: Doc[]) => {
    setVaultDocs(prev => [...newDocs, ...prev]);
    setCurrentView('vault');
  };

  const getHeaderInfo = () => {
    switch (currentView) {
      case 'dashboard': return { title: 'Dashboard', subtitle: "Welcome back, here's what's happening today." };
      case 'vault': return { title: 'Document Vault', subtitle: 'Secure storage and analysis' };
      case 'upload': return { title: 'Upload Analysis', subtitle: 'Add new documents to the vault' };
      case 'smart_query': return { title: 'Smart Query', subtitle: 'Natural language portfolio analysis' };
      case 'analytics': return { title: 'Portfolio Analytics', subtitle: 'Deep dive into performance metrics' };
      case 'compliance': return { title: 'Compliance & Risk', subtitle: 'Regulatory adherence and risk monitoring' };
      case 'notifications': return { title: 'Notifications', subtitle: 'System alerts and updates' };
      case 'settings': return { title: 'Settings', subtitle: 'Manage your preferences' };
      default: return { title: 'LMA DocPulse', subtitle: '' };
    }
  };

  const headerInfo = getHeaderInfo();

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
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
        />

        {currentView === 'dashboard' && <DashboardView setView={setCurrentView} />}
        {currentView === 'vault' && <DocumentVaultView setView={setCurrentView} docs={vaultDocs} />}
        {currentView === 'upload' && <UploadView setView={setCurrentView} onUploadComplete={handleUploadComplete} />}
        {currentView === 'smart_query' && <SmartQueryView setView={setCurrentView} />}
        {currentView === 'analytics' && <PortfolioAnalyticsView />}
        {currentView === 'compliance' && <ComplianceView />}
        {currentView === 'notifications' && <NotificationsView />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'loan_review' && <LoanReviewView />}
        {currentView === 'profile' && <ProfileView />}

      </main>
    </div>
  );
}