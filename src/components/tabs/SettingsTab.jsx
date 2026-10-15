import React, { useState, useRef } from 'react';
import { useStorage } from '../../context/StorageContext';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Shield,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Save
} from 'lucide-react';
import { triggerHaptic } from '../../engine/audio';

export default function SettingsTab() {
  const {
    data,
    biometrics,
    updateBiometrics,
    exportDataJSON,
    importDataJSON,
    resetToInitialData,
    toggleAudio
  } = useStorage();

  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);
  const [profileForm, setProfileForm] = useState({
    heightCm: data.user.heightCm || 172,
    weightKg: data.user.weightKg || 66.4,
    waistInches: data.user.waistInches || 30.5,
    neckCm: data.user.neckCm || 37.5,
    age: data.user.age || 26,
    stepsToday: data.user.stepsToday || 9000,
    caloriesToday: data.user.caloriesToday || 2050,
    proteinToday: data.user.proteinToday || 140
  });

  const [savedBanner, setSavedBanner] = useState(false);

  const handleProfileChange = (field, val) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: Number(val) || 0
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    triggerHaptic([50, 50]);
    updateBiometrics(profileForm);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const result = importDataJSON(content);
        setImportStatus(result);
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to restore the realistic initial seed data?')) {
      triggerHaptic([100, 100]);
      resetToInitialData();
      alert('Data reset to realistic baseline seed state.');
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl glass-card border border-obsidian-750/90 shadow-glass-card">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
            System Preferences & Data Vault
          </span>
          <span className="text-xs font-mono text-obsidian-400">LocalStorage: sleeper_build_v2_data</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-obsidian-50 tracking-tight mt-1">
          Settings & Physiological Calibration
        </h1>
        <p className="text-xs sm:text-sm text-obsidian-400 mt-0.5">
          Tune your baseline biometrics, configure sound/haptics, and export encrypted JSON backups.
        </p>
      </div>

      {savedBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Biometrics successfully calibrated! Real-time BMR and TDEE updated dynamically.</span>
        </div>
      )}

      {/* BIOMETRIC & METABOLIC CALIBRATION */}
      <div className="rounded-3xl glass-card border border-obsidian-700/80 p-5 sm:p-7 shadow-glass-card space-y-6">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-obsidian-750">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-obsidian-50">
              Autonomous Physiological Engine Parameters
            </h2>
            <p className="text-xs text-obsidian-400 font-mono">
              Inputs driving US Navy Body Fat % & Katch-McArdle Dynamic BMR
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-obsidian-400 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={profileForm.heightCm}
                onChange={(e) => handleProfileChange('heightCm', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono text-sm font-semibold text-obsidian-100"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-obsidian-400 mb-1">
                Current Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={profileForm.weightKg}
                onChange={(e) => handleProfileChange('weightKg', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono text-sm font-semibold text-cyan-300"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-obsidian-400 mb-1">
                Navel Waist (inches)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={profileForm.waistInches}
                onChange={(e) => handleProfileChange('waistInches', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono text-sm font-semibold text-amber-300"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-obsidian-400 mb-1">
                Neck Circumference (cm)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={profileForm.neckCm}
                onChange={(e) => handleProfileChange('neckCm', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono text-sm font-semibold text-obsidian-100"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-obsidian-400 mb-1">
                Age (years)
              </label>
              <input
                type="number"
                required
                value={profileForm.age}
                onChange={(e) => handleProfileChange('age', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono text-sm font-semibold text-obsidian-100"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-obsidian-400 mb-1">
                Biological Sex
              </label>
              <input
                type="text"
                disabled
                value="Male (US Navy Formula)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-900 border border-obsidian-800 font-mono text-sm text-obsidian-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 shadow-obsidian-glow transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Recalculate Engine</span>
            </button>
          </div>
        </form>
      </div>

      {/* HARDWARE AUDIO & HAPTIC CONTROLS */}
      <div className="rounded-3xl glass-card border border-obsidian-700/80 p-5 sm:p-7 shadow-glass-card space-y-4">
        <h3 className="text-base font-display font-bold text-obsidian-50">
          Audio & Haptic Feedback Engine
        </h3>
        <p className="text-xs text-obsidian-400">
          Synthetic Web Audio API harmonic chimes and tactile mobile vibration feedback.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div
            onClick={toggleAudio}
            className="p-4 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 flex items-center justify-between cursor-pointer hover:border-obsidian-600 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                {data.user.audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-sm font-display font-bold text-obsidian-100 block">
                  Audible Chimes
                </span>
                <span className="text-[11px] text-obsidian-400 font-mono">
                  {data.user.audioMuted ? 'Muted' : 'Harmonic synthesis active'}
                </span>
              </div>
            </div>
            <div
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                !data.user.audioMuted ? 'bg-emerald-500' : 'bg-obsidian-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  !data.user.audioMuted ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          <div
            onClick={() => triggerHaptic([50, 50, 100])}
            className="p-4 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 flex items-center justify-between cursor-pointer hover:border-obsidian-600 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-display font-bold text-obsidian-100 block">
                  Haptic Feedback
                </span>
                <span className="text-[11px] text-obsidian-400 font-mono">
                  Tap to test vibration pattern
                </span>
              </div>
            </div>
            <span className="px-2 py-1 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40">
              Hardware Linked
            </span>
          </div>
        </div>
      </div>

      {/* DATA ENGINE: BACKUP, RESTORE & PURGE */}
      <div className="rounded-3xl glass-card border border-obsidian-700/80 p-5 sm:p-7 shadow-glass-card space-y-4">
        <h3 className="text-base font-display font-bold text-obsidian-50">
          Data Engine & LocalStorage Portability
        </h3>
        <p className="text-xs text-obsidian-400">
          100% offline-first. Your logs never leave this device. Export full JSON archives anytime.
        </p>

        {importStatus && (
          <div
            className={`p-3 rounded-xl text-xs font-mono flex items-center space-x-2 ${
              importStatus.success
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          {/* Export JSON */}
          <button
            onClick={exportDataJSON}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-obsidian-800 hover:bg-obsidian-750 text-emerald-400 border border-emerald-500/40 shadow-obsidian-glow transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Backup</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-obsidian-800 hover:bg-obsidian-750 text-cyan-400 border border-cyan-500/40 shadow-cyan-glow transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Import JSON Backup</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Reset to Seed Data */}
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-obsidian-850 hover:bg-obsidian-800 text-obsidian-400 hover:text-amber-400 border border-obsidian-750 transition-all active:scale-95 ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Seed Data</span>
          </button>
        </div>
      </div>

      {/* ALGORITHM SPECIFICATION CALLOUT */}
      <div className="p-5 rounded-3xl bg-obsidian-900/60 border border-obsidian-800 text-xs text-obsidian-400 space-y-2 font-mono">
        <h4 className="text-obsidian-200 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Autonomous Engine Mathematical Specifications
        </h4>
        <ul className="list-disc list-inside space-y-1 text-obsidian-400 text-[11px] leading-relaxed">
          <li>Body Fat %: US Navy Anthropometric equation: 495 / (1.0324 - 0.19077 log10(waist - neck) + 0.15456 log10(height)) - 450</li>
          <li>Dynamic BMR: Katch-McArdle: 370 + (21.6 × LBM in kg)</li>
          <li>Dynamic TDEE: (BMR × 1.2) + (Steps × 0.04 kcal) + (Workout Surplus: +280 kcal)</li>
          <li>Recomposition Fuel Target: Clamped to safe 1,950 – 2,150 kcal range</li>
          <li>Macronutrient Allocation: Non-negotiable 2.1g/kg protein, 0.85g/kg fat, 60% peri-workout carbs</li>
          <li>Streak Architecture: Sunday biological recovery exemption (0% reset risk)</li>
        </ul>
      </div>
    </div>
  );
}
