import React, { useState } from 'react';
import { Sidebar } from './src/components/Sidebar';
import { Header } from './src/components/Header';
import { DashboardView } from './src/views/DashboardView';
import { DocumentVaultView } from './src/views/DocumentVaultView';
import { UploadView } from './src/views/UploadView';
import { SmartQueryView } from './src/views/SmartQueryView';
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
          title={
            currentView === 'vault' ? 'Document Vault' :
              currentView === 'upload' ? 'Upload Analysis' :
                currentView === 'smart_query' ? 'Smart Query' :
                  'Dashboard'
          }
          subtitle={
            currentView === 'vault' ? 'Secure storage and analysis' :
              currentView === 'upload' ? 'Add new documents to the vault' :
                currentView === 'smart_query' ? 'Natural language portfolio analysis' :
                  "Welcome back, here's what's happening today."
          }
        />

        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'vault' && <DocumentVaultView setView={setCurrentView} docs={vaultDocs} />}

        {currentView === 'upload' && <UploadView setView={setCurrentView} onUploadComplete={handleUploadComplete} />}
        {currentView === 'smart_query' && <SmartQueryView />}

      </main>
    </div>
  );
}