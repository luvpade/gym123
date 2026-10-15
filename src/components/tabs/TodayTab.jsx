import React, { useState } from 'react';
import { useStorage } from '../../context/StorageContext';
import { PPL_PROGRAM, SUNDAY_RECOVERY_PROTOCOL } from '../../data/pplProgram';
import ExerciseCard from '../ExerciseCard';
import {
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Zap,
  Shield,
  ShieldCheck,
  Footprints,
  Beef,
  Ruler,
  Activity,
  Moon,
  ChevronRight,
  TrendingUp,
  Dumbbell
} from 'lucide-react';

export default function TodayTab({ onSwitchTab }) {
  const {
    data,
    biometrics,
    isSunday,
    switchActiveWorkout,
    completeActiveWorkout,
    toggleSundayTask,
    updateBiometrics
  } = useStorage();

  const [forceSundayMode, setForceSundayMode] = useState(isSunday);
  const activeWorkoutId = data.activeSession.workoutId;
  const currentWorkoutDef = PPL_PROGRAM.find((w) => w.id === activeWorkoutId) || PPL_PROGRAM[0];

  const allSundayDone = Object.values(data.sundayChecklist || {}).every(Boolean);

  // Calculate session completion progress
  const totalExercises = currentWorkoutDef.exercises.length;
  let completedExercises = 0;
  currentWorkoutDef.exercises.forEach((ex) => {
    const exState = data.activeSession.exercises[ex.id];
    if (exState && exState.sets?.some((s) => s.completed)) {
      completedExercises++;
    }
  });

  const sessionProgressPct = Math.round((completedExercises / totalExercises) * 100);

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Banner: Protocol Mode & Workout Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-card border border-obsidian-750/90 shadow-glass-card">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
              {forceSundayMode ? 'Biological Recovery' : 'Active Recomp Mission'}
            </span>
            <span className="text-xs font-mono text-obsidian-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-obsidian-50 tracking-tight mt-1">
            {forceSundayMode ? 'Sunday Recovery & Recharge' : currentWorkoutDef.title}
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-400 mt-0.5">
            {forceSundayMode
              ? 'Non-punitive metabolic restoration. 0% streak decrement risk.'
              : currentWorkoutDef.subtitle}
          </p>
        </div>

        {/* Mode Switcher Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setForceSundayMode(!forceSundayMode)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
              forceSundayMode
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-cyan-glow'
                : 'bg-obsidian-800 border-obsidian-700 text-obsidian-300 hover:text-obsidian-100'
            }`}
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>{forceSundayMode ? 'Viewing Sunday Recovery' : 'Test Sunday Mode'}</span>
          </button>
        </div>
      </div>

      {/* METABOLIC FUEL MATRIX (Card 1) */}
      <div className="rounded-3xl glass-card border border-obsidian-700/80 p-5 sm:p-6 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-display font-bold text-obsidian-50">
                Dynamic Recomposition Fuel Matrix
              </h2>
              <p className="text-[11px] font-mono text-obsidian-400">
                Dynamic TDEE: {biometrics.tdee.totalTDEE} kcal → Target: -250 kcal Deficit (Clamped 1,950–2,150)
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
            {biometrics.recomp.targetCalories} kcal / day
          </span>
        </div>

        {/* 3 Macro Cards with Peri-Workout Carb Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Protein */}
          <div className="p-4 rounded-2xl bg-obsidian-850/80 border border-obsidian-750/90 relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-obsidian-400">
                Protein (2.1g/kg)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Non-Negotiable
              </span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-mono font-bold text-obsidian-50">
                {biometrics.macros.protein.grams}
              </span>
              <span className="text-xs text-obsidian-400 font-mono">g</span>
            </div>
            <p className="text-[11px] text-obsidian-400 mt-1">
              {biometrics.macros.protein.kcal} kcal ({biometrics.macros.protein.pct}%)
            </p>
            <div className="w-full bg-obsidian-900 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (data.user.proteinToday / biometrics.macros.protein.grams) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-obsidian-400 mt-1">
              <span>Logged: {data.user.proteinToday}g</span>
              <span>Goal: {biometrics.macros.protein.grams}g</span>
            </div>
          </div>

          {/* Dietary Fats */}
          <div className="p-4 rounded-2xl bg-obsidian-850/80 border border-obsidian-750/90">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-obsidian-400">
                Dietary Fats (0.85g/kg)
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                Endocrine
              </span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-mono font-bold text-obsidian-50">
                {biometrics.macros.fats.grams}
              </span>
              <span className="text-xs text-obsidian-400 font-mono">g</span>
            </div>
            <p className="text-[11px] text-obsidian-400 mt-1">
              {biometrics.macros.fats.kcal} kcal ({biometrics.macros.fats.pct}%)
            </p>
            <p className="text-[10px] text-obsidian-400 mt-3 font-mono">
              Optimized for natural testosterone & cell membrane integrity
            </p>
          </div>

          {/* Carbohydrates & Peri-Workout Clustering */}
          <div className="p-4 rounded-2xl bg-obsidian-850/80 border border-obsidian-750/90 relative border-l-2 border-l-amber-500">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-obsidian-400">
                Complex Carbs
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                Glycogen
              </span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-mono font-bold text-obsidian-50">
                {biometrics.macros.carbs.grams}
              </span>
              <span className="text-xs text-obsidian-400 font-mono">g</span>
            </div>
            <p className="text-[11px] text-obsidian-400 mt-1">
              {biometrics.macros.carbs.kcal} kcal ({biometrics.macros.carbs.pct}%)
            </p>
            {/* Peri-workout clustering badge */}
            <div className="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300">
              <div className="flex justify-between font-bold">
                <span>Peri-Workout (60%):</span>
                <span>{biometrics.macros.carbs.periWorkoutGrams}g</span>
              </div>
              <div className="flex justify-between text-obsidian-400 text-[10px] mt-0.5">
                <span>Rest of day:</span>
                <span>{biometrics.macros.carbs.restOfDayGrams}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Counter Quick Stepper */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-obsidian-750 text-xs">
          <div className="flex items-center space-x-2 text-obsidian-300">
            <Footprints className="w-4 h-4 text-cyan-400" />
            <span className="font-mono">Daily Steps:</span>
            <span className="font-mono font-bold text-obsidian-100">{data.user.stepsToday.toLocaleString()}</span>
            <span className="text-[11px] text-obsidian-400 font-mono">(+{Math.round(data.user.stepsToday * 0.04)} kcal boost)</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => updateBiometrics({ stepsToday: Math.max(0, data.user.stepsToday - 1000) })}
              className="px-2 py-1 rounded-lg bg-obsidian-800 text-obsidian-300 hover:text-obsidian-100 border border-obsidian-700 text-xs font-mono"
            >
              -1k Steps
            </button>
            <button
              onClick={() => updateBiometrics({ stepsToday: data.user.stepsToday + 1000 })}
              className="px-2 py-1 rounded-lg bg-obsidian-800 text-obsidian-300 hover:text-obsidian-100 border border-obsidian-700 text-xs font-mono"
            >
              +1k Steps
            </button>
          </div>
        </div>
      </div>

      {/* SUNDAY RECOVERY PROTOCOL VIEW (when active) */}
      {forceSundayMode ? (
        <div className="rounded-3xl glass-card border border-cyan-500/30 p-5 sm:p-7 shadow-cyan-glow space-y-6 animate-fade-in">
          <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-obsidian-700/60">
            <div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-display font-bold text-obsidian-50">
                  Sunday Recovery & Recharge Protocol
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-obsidian-300 mt-1">
                Strict biological and neurological regeneration. Streak automatically carries over to Monday.
              </p>
            </div>

            {allSundayDone ? (
              <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold text-xs font-mono shadow-cyan-glow animate-pulse">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>RECOVERY SHIELD ACTIVE</span>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-obsidian-300 text-xs font-mono">
                {Object.values(data.sundayChecklist || {}).filter(Boolean).length}/5 Protocols Checked
              </div>
            )}
          </div>

          {/* 5 Sunday Check-in Items */}
          <div className="space-y-3">
            {SUNDAY_RECOVERY_PROTOCOL.map((protocol) => {
              const isChecked = !!data.sundayChecklist[protocol.id];

              return (
                <div
                  key={protocol.id}
                  onClick={() => toggleSundayTask(protocol.id)}
                  className={`flex items-start justify-between p-4 rounded-2xl cursor-pointer transition-all border ${
                    isChecked
                      ? 'bg-cyan-950/25 border-cyan-500/40 text-obsidian-50'
                      : 'bg-obsidian-850/60 border-obsidian-750 hover:border-obsidian-700 text-obsidian-300'
                  }`}
                >
                  <div className="flex items-start space-x-3.5 flex-1 pr-3">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all ${
                        isChecked
                          ? 'bg-cyan-400 border-cyan-400 text-obsidian-950'
                          : 'border-obsidian-600 bg-obsidian-800'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-display font-bold text-obsidian-100">
                          {protocol.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-obsidian-800 text-cyan-400 border border-cyan-900/50">
                          {protocol.target}
                        </span>
                      </div>
                      <p className="text-xs text-obsidian-400 mt-1 leading-relaxed">
                        {protocol.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-850/70 border border-obsidian-750 flex items-center justify-between text-xs text-obsidian-300">
            <span>Need to record your weekly morning scale weight & waist?</span>
            <button
              onClick={() => onSwitchTab('measurements')}
              className="flex items-center space-x-1 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Open Vault</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE WORKOUT LIFTING SESSION */
        <div className="space-y-4">
          {/* Workout Header Bar & Selector */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-display font-bold text-obsidian-50">
                Active Workout: {currentWorkoutDef.code}
              </h2>
            </div>

            {/* Switch Workout Dropdown Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
              {PPL_PROGRAM.map((w) => (
                <button
                  key={w.id}
                  onClick={() => switchActiveWorkout(w.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                    activeWorkoutId === w.id
                      ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-obsidian-glow'
                      : 'bg-obsidian-800 text-obsidian-300 hover:text-obsidian-100 border border-obsidian-700'
                  }`}
                >
                  {w.code}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="rounded-2xl glass-card p-4 border border-obsidian-750 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-mono text-obsidian-400 mb-1.5">
                <span>Workout Completion: {completedExercises}/{totalExercises} Movements</span>
                <span className="font-bold text-emerald-400">{sessionProgressPct}%</span>
              </div>
              <div className="w-full bg-obsidian-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${sessionProgressPct}%` }}
                />
              </div>
            </div>

            <button
              onClick={completeActiveWorkout}
              className="px-4 py-2.5 rounded-xl text-xs font-bold font-sans bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 shadow-obsidian-glow transition-all active:scale-95 whitespace-nowrap"
            >
              Finish Session
            </button>
          </div>

          {/* Exercise Cards */}
          <div className="space-y-4">
            {currentWorkoutDef.exercises.map((exercise, idx) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={idx}
              />
            ))}
          </div>

          {/* Big Finish Button at Bottom */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={completeActiveWorkout}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold font-display uppercase tracking-wider bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 text-obsidian-950 shadow-obsidian-glow hover:brightness-110 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Lock In Session & Advance Streak</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
