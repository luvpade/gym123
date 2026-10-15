import React, { useState } from 'react';
import { useStorage } from '../../context/StorageContext';
import { PPL_PROGRAM } from '../../data/pplProgram';
import { STALL_DIAGNOSTICS } from '../../engine/overload';
import {
  Dumbbell,
  ArrowRightLeft,
  Timer,
  Target,
  Sparkles,
  Info,
  CheckCircle,
  Play,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function PplSplitTab({ onSwitchTab }) {
  const { data, switchActiveWorkout, swapExercise, openDiagnostic } = useStorage();
  const [selectedDayId, setSelectedDayId] = useState(data.activeSession.workoutId || 'push-a');

  const selectedWorkout = PPL_PROGRAM.find((w) => w.id === selectedDayId) || PPL_PROGRAM[0];

  const handleSelectAsActive = (workoutId) => {
    switchActiveWorkout(workoutId);
    onSwitchTab('today');
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="p-5 rounded-3xl glass-card border border-obsidian-750/90 shadow-glass-card">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 uppercase">
            6-Month Progression Architecture
          </span>
          <span className="text-xs font-mono text-obsidian-400">Gym-Accurate & Streamlined</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-obsidian-50 tracking-tight mt-1">
          PPL Hypertrophy & Recomp Rotation
        </h1>
        <p className="text-xs sm:text-sm text-obsidian-400 mt-0.5">
          Clavicular shelf, V-taper expansion, 3D delts, and serratus/core compression. Zero room fluff.
        </p>
      </div>

      {/* 5-Day Workout Pill Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {PPL_PROGRAM.map((w) => {
          const isSelected = selectedDayId === w.id;
          const isActiveSession = data.activeSession.workoutId === w.id;

          return (
            <button
              key={w.id}
              onClick={() => setSelectedDayId(w.id)}
              className={`p-3.5 rounded-2xl text-left transition-all border relative ${
                isSelected
                  ? 'bg-obsidian-800 border-emerald-500/60 shadow-obsidian-glow'
                  : 'bg-obsidian-850/70 border-obsidian-750 hover:border-obsidian-700'
              }`}
            >
              {isActiveSession && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-obsidian-glow" />
              )}
              <span className="text-[11px] font-mono font-bold uppercase text-emerald-400">
                {w.code}
              </span>
              <h4 className="text-xs sm:text-sm font-display font-bold text-obsidian-100 mt-0.5 truncate">
                {w.title.split('&')[0]}
              </h4>
              <p className="text-[10px] text-obsidian-400 font-mono mt-1">
                {w.exercises.length} Movements
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Workout Detail View */}
      <div className="rounded-3xl glass-card border border-obsidian-700/80 p-5 sm:p-7 shadow-glass-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-obsidian-700/60">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                {selectedWorkout.code}
              </span>
              <span className="text-xs font-mono text-obsidian-400">
                Primary Focus: {selectedWorkout.focus}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-display font-extrabold text-obsidian-50 mt-1">
              {selectedWorkout.title}
            </h2>
            <p className="text-xs sm:text-sm text-obsidian-300 mt-0.5">
              {selectedWorkout.subtitle}
            </p>
          </div>

          <button
            onClick={() => handleSelectAsActive(selectedWorkout.id)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 shadow-obsidian-glow transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch This Workout</span>
          </button>
        </div>

        {/* Exercise Rotation List */}
        <div className="space-y-4">
          {selectedWorkout.exercises.map((exercise, index) => {
            const isSwapped = data.swappedExercises[exercise.id] || false;
            const currentName = isSwapped ? exercise.alternate.name : exercise.name;
            const hasDiagnostic = !!STALL_DIAGNOSTICS[exercise.id];

            return (
              <div
                key={exercise.id}
                className="p-4 sm:p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 hover:border-obsidian-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-obsidian-800 border border-obsidian-700 flex items-center justify-center text-xs font-mono font-bold text-obsidian-300 flex-shrink-0 mt-0.5">
                      0{index + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-xs sm:text-sm font-display font-bold text-obsidian-100">
                          {currentName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-obsidian-800 text-obsidian-300 border border-obsidian-700">
                          {exercise.category}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40">
                          {exercise.targetSets} sets × {exercise.targetReps}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 flex items-center gap-1">
                          <Timer className="w-3 h-3" /> {exercise.restSeconds}s rest
                        </span>
                      </div>
                      <p className="text-xs text-obsidian-400 mt-1 font-sans">
                        {isSwapped ? exercise.alternate.notes : exercise.cue}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Swap Toggle & Diagnostics Preview */}
                  <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center">
                    {hasDiagnostic && (
                      <button
                        onClick={() => openDiagnostic(exercise.id, STALL_DIAGNOSTICS[exercise.id])}
                        className="p-2 rounded-xl text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                        title="View Biomechanical Stall Cues"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => swapExercise(exercise.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isSwapped
                          ? 'bg-violet-950/40 text-violet-300 border-violet-700/50'
                          : 'bg-obsidian-800 text-obsidian-300 hover:text-obsidian-100 border-obsidian-700'
                      }`}
                      title={`Swap between ${exercise.name} and ${exercise.alternate.name}`}
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isSwapped ? 'Swapped to Alt' : 'Swap to Alt'}</span>
                    </button>
                  </div>
                </div>

                {/* Sub-card with Alternate Movement Info */}
                <div className="p-2.5 rounded-xl bg-obsidian-900/60 border border-obsidian-800 text-xs text-obsidian-400 flex items-center justify-between">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="font-mono text-[10px] uppercase text-obsidian-400">Available Equivalent:</span>
                    <span className="font-medium text-obsidian-200 truncate">
                      {isSwapped ? exercise.name : exercise.alternate.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400/90 whitespace-nowrap ml-2">
                    Zero data loss swap
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
