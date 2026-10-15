import React, { useState } from 'react';
import { StorageProvider } from './context/StorageContext';
import Navbar from './components/Navbar';
import Navigation from './components/Navigation';
import RestTimer from './components/RestTimer';
import DiagnosticModal from './components/DiagnosticModal';
import HomeTab from './components/tabs/HomeTab';
import WorkoutTab from './components/tabs/WorkoutTab';
import ProgressTab from './components/tabs/ProgressTab';
import SettingsTab from './components/tabs/SettingsTab';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-obsidian-950 text-obsidian-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Unified Tab Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && <HomeTab onSwitchTab={setActiveTab} />}
        {activeTab === 'workout' && <WorkoutTab />}
        {activeTab === 'progress' && <ProgressTab />}
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
