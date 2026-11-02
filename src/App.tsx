/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { DetectorView } from './components/DetectorView.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { HistoryView } from './components/HistoryView.tsx';
import { MethodologyView } from './components/MethodologyView.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Footer } from './components/Footer.tsx';
import { ResultReport } from './components/ResultReport.tsx';
import { AnalysisRecord, User } from './types/index.ts';
import { api, authStorage } from './services/api.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'detector' | 'dashboard' | 'history' | 'methodology'>('detector');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [inspectedAnalysis, setInspectedAnalysis] = useState<AnalysisRecord | null>(null);

  useEffect(() => {
    // Check initial cached user or fetch current auth state
    const cached = authStorage.getUser();
    if (cached) {
      setCurrentUser(cached);
    }
    api.getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
    });
  }, []);

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  const handleInspectAnalysis = (record: AnalysisRecord) => {
    setInspectedAnalysis(record);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: 'detector' | 'dashboard' | 'history' | 'methodology') => {
    setCurrentTab(tab);
    setInspectedAnalysis(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600/30 selection:text-indigo-200">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        user={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {inspectedAnalysis ? (
          <ResultReport
            analysis={inspectedAnalysis}
            onReset={() => setInspectedAnalysis(null)}
          />
        ) : (
          <>
            {currentTab === 'detector' && (
              <DetectorView
                onAnalysisComplete={(record) => {
                  setInspectedAnalysis(record);
                }}
              />
            )}

            {currentTab === 'dashboard' && (
              <DashboardView
                onViewAnalysis={handleInspectAnalysis}
                onNavigateDetector={() => handleTabChange('detector')}
              />
            )}

            {currentTab === 'history' && (
              <HistoryView
                onSelectAnalysis={handleInspectAnalysis}
              />
            )}

            {currentTab === 'methodology' && (
              <MethodologyView />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <Footer onSelectTab={handleTabChange} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

    </div>
  );
}
