import React, { useState } from 'react';
import { StorageProvider } from './context/StorageContext';
import Navbar from './components/Navbar';
import Navigation from './components/Navigation';
import RestTimer from './components/RestTimer';
import DiagnosticModal from './components/DiagnosticModal';
import TodayTab from './components/tabs/TodayTab';
import PplSplitTab from './components/tabs/PplSplitTab';
import AnalyticsTab from './components/tabs/AnalyticsTab';
import MeasurementsTab from './components/tabs/MeasurementsTab';
import SettingsTab from './components/tabs/SettingsTab';

function AppContent() {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <div className="min-h-screen bg-obsidian-950 text-obsidian-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Desktop Sub-Nav */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'today' && <TodayTab onSwitchTab={setActiveTab} />}
        {activeTab === 'ppl' && <PplSplitTab onSwitchTab={setActiveTab} />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'measurements' && <MeasurementsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      {/* Dynamic Floating Rest Timer */}
      <RestTimer />

      {/* Biomechanical Stall Diagnostic Drawer / Modal */}
      <DiagnosticModal />
    </div>
  );
}

export default function App() {
  return (
    <StorageProvider>
      <AppContent />
    </StorageProvider>
  );
}
