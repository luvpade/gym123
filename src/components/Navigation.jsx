import React from 'react';
import {
  Home,
  Dumbbell,
  LineChart,
  Settings,
  Sparkles
} from 'lucide-react';
import { triggerHaptic } from '../engine/audio';

const TABS = [
  { id: 'home', label: 'Home & Fuel', icon: Home },
  { id: 'workout', label: 'Workout (PPL)', icon: Dumbbell },
  { id: 'progress', label: 'Progress Vault', icon: LineChart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Navigation({ activeTab, setActiveTab }) {
  const handleTabClick = (tabId) => {
    triggerHaptic(20);
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop Horizontal Sub-Navigation */}
      <nav className="hidden md:block w-full border-b border-obsidian-800 bg-obsidian-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center space-x-1 py-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-obsidian-800 text-emerald-400 border border-emerald-500/30 shadow-obsidian-glow'
                    : 'text-obsidian-300 hover:text-obsidian-100 hover:bg-obsidian-850/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-obsidian-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Fixed Glassmorphism Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 py-2 bg-obsidian-950/85 backdrop-blur-2xl border-t border-obsidian-800/90 shadow-2xl">
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-obsidian-400 hover:text-obsidian-200'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-5 h-0.5 bg-emerald-400 rounded-full shadow-obsidian-glow" />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] font-medium tracking-tight mt-1 truncate">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
