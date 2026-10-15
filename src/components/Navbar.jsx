import React from 'react';
import { useStorage } from '../context/StorageContext';
import { Shield, Flame, Volume2, VolumeX, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { data, biometrics, isSunday, toggleAudio } = useStorage();

  const allSundayDone = Object.values(data.sundayChecklist || {}).every(Boolean);

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-obsidian-750/80 px-4 sm:px-8 py-3 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-obsidian-glow">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold tracking-tight text-sm sm:text-base text-obsidian-50">
                SLEEPER BUILD <span className="text-emerald-400">OS</span>
              </span>
              <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider bg-obsidian-800 text-cyan-400 border border-cyan-900/60 uppercase">
                v2.0 RECOMP
              </span>
            </div>
            <p className="text-[10px] text-obsidian-400 font-mono tracking-wider hidden sm:block">
              AUTONOMOUS METABOLIC & RECOMP ENGINE
            </p>
          </div>
        </div>

        {/* Center: Live Biometric Quick Readout (Desktop) */}
        <div className="hidden lg:flex items-center space-x-6 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-obsidian-300">
            <span className="text-obsidian-400">Scale:</span>
            <span className="text-obsidian-50 font-semibold">{data.user.weightKg} kg</span>
          </div>
          <div className="h-3 w-px bg-obsidian-700" />
          <div className="flex items-center space-x-1.5 text-obsidian-300">
            <span className="text-obsidian-400">Waist:</span>
            <span className="text-obsidian-50 font-semibold">{data.user.waistInches}"</span>
          </div>
          <div className="h-3 w-px bg-obsidian-700" />
          <div className="flex items-center space-x-1.5 text-obsidian-300">
            <span className="text-obsidian-400">Est. BF%:</span>
            <span className="text-emerald-400 font-semibold">{biometrics.bodyFatPct}%</span>
          </div>
          <div className="h-3 w-px bg-obsidian-700" />
          <div className="flex items-center space-x-1.5 text-obsidian-300">
            <span className="text-obsidian-400">Target Fuel:</span>
            <span className="text-cyan-400 font-semibold">{biometrics.recomp.targetCalories} kcal</span>
          </div>
        </div>

        {/* Right: Streak & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Recovery Shield Badge on Sunday */}
          {allSundayDone && (
            <div 
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-cyan-glow"
              title="Sunday Recovery Protocol 100% Completed!"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Shield Active</span>
            </div>
          )}

          {/* Active Streak Pill */}
          <div
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-obsidian-850 border border-emerald-500/30 shadow-obsidian-glow text-obsidian-100 text-xs font-mono"
            title="Non-Punitive Streak Engine: Preserved automatically on Sunday rest days"
          >
            <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-bold text-emerald-400">{data.user.streakDays}</span>
            <span className="text-obsidian-400 text-[11px] uppercase tracking-wider">Days</span>
          </div>

          {/* Audio Mute/Unmute */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-xl border transition-all ${
              data.user.audioMuted
                ? 'bg-obsidian-850 border-obsidian-750 text-obsidian-400 hover:text-obsidian-200'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-obsidian-glow'
            }`}
            title={data.user.audioMuted ? 'Unmute Audio & Chimes' : 'Mute Audio Chimes'}
          >
            {data.user.audioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
