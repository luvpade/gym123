import React, { useState } from 'react';
import { useStorage } from '../../context/StorageContext';
import { PPL_PROGRAM } from '../../data/pplProgram';
import {
  Footprints,
  Flame,
  Zap,
  Droplets,
  Scale,
  Ruler,
  CheckCircle2,
  Moon,
  Activity,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Dumbbell,
  ShieldAlert,
  Sliders,
  Plus,
  Minus
} from 'lucide-react';
import { triggerHaptic } from '../../engine/audio';

export default function HomeTab({ onSwitchTab }) {
  const {
    data,
    biometrics,
    setSteps,
    setDeficit,
    addWater,
    toggleHomeHabit,
    updateBiometrics
  } = useStorage();

  const activeWorkoutId = data.activeSession.workoutId;
  const currentWorkoutDef = PPL_PROGRAM.find((w) => w.id === activeWorkoutId) || PPL_PROGRAM[0];

  const habits = data.user.homeHabits || {
    morningWeighIn: true,
    waterGoal: false,
    proteinGoal: true,
    postureReset: false,
    sleepGoal: true
  };

  const waterMl = data.user.waterMl || 2250;
  const waterTarget = 3000;
  const waterPct = Math.min(100, Math.round((waterMl / waterTarget) * 100));

  // Quick calorie logger state
  const [calInput, setCalInput] = useState(data.user.caloriesToday || 2050);
  const [protInput, setProtInput] = useState(data.user.proteinToday || 142);
  const [isEditingFuel, setIsEditingFuel] = useState(false);

  // Quick fasted log state
  const [quickWeight, setQuickWeight] = useState(data.user.weightKg || 66.4);
  const [quickWaist, setQuickWaist] = useState(data.user.waistInches || 30.5);

  const handleSaveFuel = () => {
    updateBiometrics({
      caloriesToday: Number(calInput) || 0,
      proteinToday: Number(protInput) || 0
    });
    setIsEditingFuel(false);
    triggerHaptic([30, 30]);
  };

  const handleSaveFastedBiometrics = () => {
    updateBiometrics({
      weightKg: Number(quickWeight) || data.user.weightKg,
      waistInches: Number(quickWaist) || data.user.waistInches
    });
    toggleHomeHabit('morningWeighIn');
    triggerHaptic([40, 40]);
  };

  const caloriesLeft = Math.max(0, biometrics.recomp.targetCalories - (data.user.caloriesToday || 0));

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Header */}
      <div className="p-5 rounded-3xl glass-card border border-obsidian-750/90 shadow-glass-card">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
            At-Home Engine
          </span>
          <span className="text-xs font-mono text-obsidian-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-obsidian-50 tracking-tight mt-1">
          Daily Home Habits & Metabolic Calibrator
        </h1>
        <p className="text-xs sm:text-sm text-obsidian-400 mt-0.5">
          Dynamic caloric intake scales live with your steps and TDEE. Manage your nutrition, water, and recovery before hitting the gym.
        </p>
      </div>

      {/* SECTION 1: DYNAMIC STEP & TDEE CALORIC INTAKE ADJUSTER */}
      <div className="rounded-3xl glass-card border border-cyan-500/30 p-5 sm:p-7 shadow-cyan-glow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-obsidian-750">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-display font-bold text-obsidian-50">
                Live Step-Driven Calorie Adjuster
              </h2>
              <p className="text-xs text-obsidian-400 font-mono">
                Slide steps → TDEE recalculates → Target daily intake adjusts in real time
              </p>
            </div>
          </div>

          {/* Deficit Mode Selector */}
          <div className="flex items-center space-x-1.5 bg-obsidian-900/80 p-1 rounded-xl border border-obsidian-750 self-start sm:self-auto">
            <button
              onClick={() => setDeficit(250)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                (data.user.deficit || 250) === 250
                  ? 'bg-cyan-500 text-obsidian-950 font-bold shadow-cyan-glow'
                  : 'text-obsidian-400 hover:text-obsidian-200'
              }`}
            >
              Recomp (-250)
            </button>
            <button
              onClick={() => setDeficit(400)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                data.user.deficit === 400
                  ? 'bg-amber-500 text-obsidian-950 font-bold shadow-amber-glow'
                  : 'text-obsidian-400 hover:text-obsidian-200'
              }`}
            >
              Shred (-400)
            </button>
            <button
              onClick={() => setDeficit(0)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                data.user.deficit === 0
                  ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-obsidian-glow'
                  : 'text-obsidian-400 hover:text-obsidian-200'
              }`}
            >
              Maintain (0)
            </button>
          </div>
        </div>

        {/* Real-Time Mathematical Engine Gauge */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Step Count */}
          <div className="p-4 rounded-2xl bg-obsidian-850/80 border border-obsidian-750">
            <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">
              Steps Walked
            </span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-xl sm:text-2xl font-mono font-bold text-cyan-300">
                {data.user.stepsToday.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-cyan-400 font-mono mt-0.5">
              +{Math.round(data.user.stepsToday * 0.04)} kcal step burn
            </p>
          </div>

          {/* Dynamic TDEE */}
          <div className="p-4 rounded-2xl bg-obsidian-850/80 border border-obsidian-750">
            <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">
              Total Burn (TDEE)
            </span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-xl sm:text-2xl font-mono font-bold text-obsidian-50">
                {biometrics.tdee.totalTDEE}
              </span>
              <span className="text-xs text-obsidian-400 font-mono">kcal</span>
            </div>
            <p className="text-[10px] text-obsidian-400 font-mono mt-0.5">
              BMR ({biometrics.bmr}) + Steps + Workout
            </p>
          </div>

          {/* Target Daily Calorie Intake (Dynamically Adjusted) */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Target Daily Fuel
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-300">
                {biometrics.recomp.targetCalories}
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">kcal</span>
            </div>
            <p className="text-[10px] text-emerald-400/90 font-mono mt-0.5">
              Adjusted to your exact steps
            </p>
          </div>

          {/* Carbs Reward Allocation */}
          <div className="p-4 rounded-2xl bg-obsidian-850/80 border border-obsidian-750">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
              Carb Allocation
            </span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-xl sm:text-2xl font-mono font-bold text-amber-300">
                {biometrics.macros.carbs.grams}g
              </span>
            </div>
            <p className="text-[10px] text-amber-400/90 font-mono mt-0.5">
              {biometrics.macros.carbs.periWorkoutGrams}g peri-workout (60%)
            </p>
          </div>
        </div>

        {/* Interactive Step Slider */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-xs font-mono text-obsidian-300">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Adjust Your Steps Today:</span>
            </span>
            <span className="text-cyan-400 font-bold">{data.user.stepsToday.toLocaleString()} steps</span>
          </div>

          <input
            type="range"
            min="2000"
            max="20000"
            step="250"
            value={data.user.stepsToday}
            onChange={(e) => {
              setSteps(Number(e.target.value));
              triggerHaptic(15);
            }}
            className="w-full h-2.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />

          {/* Quick Step Preset Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { label: '8k Baseline', steps: 8000 },
              { label: '10k Target', steps: 10000 },
              { label: '12.5k Active', steps: 12500 },
              { label: '15k Shred', steps: 15000 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setSteps(preset.steps);
                  triggerHaptic(20);
                }}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-mono transition-all border ${
                  data.user.stepsToday === preset.steps
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-cyan-glow'
                    : 'bg-obsidian-850 border-obsidian-750 text-obsidian-400 hover:text-obsidian-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: AT-HOME RECOVERY & HEALTH PROTOCOL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card A: At-Home Daily Habits Checklist */}
        <div className="rounded-3xl glass-card border border-obsidian-700/80 p-5 sm:p-6 shadow-glass-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-obsidian-750">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-display font-bold text-obsidian-50">
                At-Home Daily Habit Checklist
              </h3>
            </div>
            <span className="text-xs font-mono text-obsidian-400">
              {Object.values(habits).filter(Boolean).length}/5 Completed
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Habit 1: Morning Weigh-in */}
            <div
              onClick={() => toggleHomeHabit('morningWeighIn')}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                habits.morningWeighIn
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-obsidian-100'
                  : 'bg-obsidian-850/60 border-obsidian-750 text-obsidian-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                  habits.morningWeighIn ? 'bg-emerald-400 border-emerald-400 text-obsidian-950' : 'border-obsidian-600 bg-obsidian-800'
                }`}>
                  {habits.morningWeighIn && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <span className="font-semibold text-obsidian-100 block">Fasted Morning Scale & Waist</span>
                  <span className="text-[11px] text-obsidian-400 font-mono">Current: {data.user.weightKg}kg | {data.user.waistInches}"</span>
                </div>
              </div>
              <Scale className="w-4 h-4 text-obsidian-400" />
            </div>

            {/* Habit 2: Water Hydration Goal */}
            <div
              onClick={() => toggleHomeHabit('waterGoal')}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                habits.waterGoal
                  ? 'bg-cyan-950/20 border-cyan-500/40 text-obsidian-100'
                  : 'bg-obsidian-850/60 border-obsidian-750 text-obsidian-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                  habits.waterGoal ? 'bg-cyan-400 border-cyan-400 text-obsidian-950' : 'border-obsidian-600 bg-obsidian-800'
                }`}>
                  {habits.waterGoal && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <span className="font-semibold text-obsidian-100 block">3 Liters Daily Hydration</span>
                  <span className="text-[11px] text-obsidian-400 font-mono">{waterMl} ml logged ({waterPct}%)</span>
                </div>
              </div>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>

            {/* Habit 3: Non-negotiable Protein */}
            <div
              onClick={() => toggleHomeHabit('proteinGoal')}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                habits.proteinGoal
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-obsidian-100'
                  : 'bg-obsidian-850/60 border-obsidian-750 text-obsidian-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                  habits.proteinGoal ? 'bg-emerald-400 border-emerald-400 text-obsidian-950' : 'border-obsidian-600 bg-obsidian-800'
                }`}>
                  {habits.proteinGoal && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <span className="font-semibold text-obsidian-100 block">140g Anabolic Protein Target</span>
                  <span className="text-[11px] text-obsidian-400 font-mono">{data.user.proteinToday}g logged (2.1g/kg)</span>
                </div>
              </div>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>

            {/* Habit 4: Thoracic Decompression */}
            <div
              onClick={() => toggleHomeHabit('postureReset')}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                habits.postureReset
                  ? 'bg-amber-950/20 border-amber-500/40 text-obsidian-100'
                  : 'bg-obsidian-850/60 border-obsidian-750 text-obsidian-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                  habits.postureReset ? 'bg-amber-400 border-amber-400 text-obsidian-950' : 'border-obsidian-600 bg-obsidian-800'
                }`}>
                  {habits.postureReset && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <span className="font-semibold text-obsidian-100 block">10-Min Posture Reset at Home</span>
                  <span className="text-[11px] text-obsidian-400 font-mono">Doorway pec stretches & wall chin-tucks</span>
                </div>
              </div>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>

            {/* Habit 5: Sleep */}
            <div
              onClick={() => toggleHomeHabit('sleepGoal')}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                habits.sleepGoal
                  ? 'bg-cyan-950/20 border-cyan-500/40 text-obsidian-100'
                  : 'bg-obsidian-850/60 border-obsidian-750 text-obsidian-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                  habits.sleepGoal ? 'bg-cyan-400 border-cyan-400 text-obsidian-950' : 'border-obsidian-600 bg-obsidian-800'
                }`}>
                  {habits.sleepGoal && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <span className="font-semibold text-obsidian-100 block">8 Hours Restorative Sleep</span>
                  <span className="text-[11px] text-obsidian-400 font-mono">Maximal growth hormone recovery</span>
                </div>
              </div>
              <Moon className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Card B: Home Hydration & Fasted Weigh-In Calibrator */}
        <div className="space-y-4">
          {/* Quick Water Tracker Card */}
          <div className="rounded-3xl glass-card border border-obsidian-750 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-display font-bold text-obsidian-100">
                  Home Hydration Station
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {waterMl} / {waterTarget} ml
              </span>
            </div>

            {/* Water visual bar */}
            <div className="w-full bg-obsidian-900 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${waterPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-obsidian-400 font-mono">Quick Add Water:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    addWater(-250);
                    triggerHaptic(20);
                  }}
                  className="px-2.5 py-1 rounded-xl text-xs font-mono bg-obsidian-800 text-obsidian-400 hover:text-obsidian-200 border border-obsidian-700"
                >
                  -250ml
                </button>
                <button
                  onClick={() => {
                    addWater(250);
                    triggerHaptic(20);
                  }}
                  className="px-3 py-1 rounded-xl text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
                >
                  +250ml (Cup)
                </button>
                <button
                  onClick={() => {
                    addWater(500);
                    triggerHaptic(20);
                  }}
                  className="px-3 py-1 rounded-xl text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
                >
                  +500ml (Bottle)
                </button>
              </div>
            </div>
          </div>

          {/* Quick Fasted Morning Scale & Waist Log */}
          <div className="rounded-3xl glass-card border border-obsidian-750 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-display font-bold text-obsidian-100">
                  Morning Fasted Check-In
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Empty Stomach
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-obsidian-400 block mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={quickWeight}
                  onChange={(e) => setQuickWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm font-mono font-bold text-cyan-300"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-obsidian-400 block mb-1">
                  Navel Waist (in)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={quickWaist}
                  onChange={(e) => setQuickWaist(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm font-mono font-bold text-amber-300"
                />
              </div>
            </div>

            <button
              onClick={handleSaveFastedBiometrics}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-obsidian-800 hover:bg-obsidian-750 text-emerald-400 border border-emerald-500/30 transition-all flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Update Fasted Biometrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: DAILY FOOD INTAKE BALANCE */}
      <div className="rounded-3xl glass-card border border-obsidian-700/80 p-5 sm:p-6 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-display font-bold text-obsidian-50">
              Daily Caloric Balance Tracker
            </h3>
          </div>
          <button
            onClick={() => setIsEditingFuel(!isEditingFuel)}
            className="text-xs text-cyan-400 font-mono hover:underline"
          >
            {isEditingFuel ? 'Cancel' : 'Log Meals'}
          </button>
        </div>

        {isEditingFuel ? (
          <div className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-750 space-y-3 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-obsidian-400 block mb-1">
                  Calories Consumed Today (kcal)
                </label>
                <input
                  type="number"
                  value={calInput}
                  onChange={(e) => setCalInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-obsidian-400 block mb-1">
                  Protein Consumed Today (g)
                </label>
                <input
                  type="number"
                  value={protInput}
                  onChange={(e) => setProtInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleSaveFuel}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-obsidian-950 shadow-obsidian-glow"
            >
              Save Daily Intake
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-obsidian-850 border border-obsidian-750">
              <span className="text-[11px] font-mono text-obsidian-400 uppercase">Target Allowance</span>
              <div className="text-xl font-mono font-bold text-obsidian-100 mt-1">
                {biometrics.recomp.targetCalories} kcal
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-obsidian-850 border border-obsidian-750">
              <span className="text-[11px] font-mono text-obsidian-400 uppercase">Logged Consumed</span>
              <div className="text-xl font-mono font-bold text-amber-300 mt-1">
                {data.user.caloriesToday || 0} kcal
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-obsidian-850 border border-obsidian-750">
              <span className="text-[11px] font-mono text-obsidian-400 uppercase">Remaining Budget</span>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                {caloriesLeft} kcal
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: GYM SESSION QUICK-LAUNCH CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-obsidian-850 to-obsidian-850 border border-emerald-500/40 shadow-obsidian-glow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Today's Scheduled PPL Workout
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-display font-extrabold text-obsidian-50 mt-1">
            {currentWorkoutDef.code}: {currentWorkoutDef.title}
          </h3>
          <p className="text-xs text-obsidian-300 mt-0.5">
            {currentWorkoutDef.exercises.length} movements targeting {currentWorkoutDef.focus}.
          </p>
        </div>

        <button
          onClick={() => onSwitchTab('workout')}
          className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 shadow-obsidian-glow transition-all active:scale-95 flex items-center justify-center space-x-2 whitespace-nowrap self-start sm:self-auto"
        >
          <span>Open Workout Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
