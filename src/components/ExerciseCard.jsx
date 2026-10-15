import React, { useState } from 'react';
import { useStorage } from '../context/StorageContext';
import { evaluateDoubleProgression, checkStallCondition } from '../engine/overload';
import {
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  ArrowRightLeft,
  Flame,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';

export default function ExerciseCard({ exercise, index }) {
  const {
    data,
    updateSet,
    toggleSetComplete,
    quickAdjustWeight,
    quickAdjustReps,
    swapExercise,
    openDiagnostic
  } = useStorage();

  const [isExpanded, setIsExpanded] = useState(true);

  // Active workout exercise state
  const exerciseState = data.activeSession.exercises[exercise.id] || {
    isSwapped: false,
    sets: []
  };

  const isSwapped = exerciseState.isSwapped;
  const currentDisplayName = isSwapped ? exercise.alternate.name : exercise.name;
  const currentCue = isSwapped ? exercise.alternate.notes : exercise.cue;

  // Determine last session's stats for this exercise
  const pastSessions = (data.workoutHistory || []).filter(
    (s) => s.exercises && s.exercises[exercise.id]
  );
  const lastSession = pastSessions[pastSessions.length - 1];
  const lastSessionSets = lastSession?.exercises?.[exercise.id]?.sets || [];

  // Check Progressive Overload status
  const overloadStatus = evaluateDoubleProgression(exercise, exerciseState.sets);

  // Check Stall Diagnostics
  const stallEvaluation = checkStallCondition(exercise.id, data.workoutHistory);

  return (
    <div className="rounded-2xl glass-card border border-obsidian-700/80 overflow-hidden transition-all duration-300 hover:border-obsidian-600/80 shadow-glass-card">
      {/* Exercise Header */}
      <div className="p-4 sm:p-5 flex flex-col space-y-3 bg-gradient-to-r from-obsidian-850/80 to-obsidian-900/60 border-b border-obsidian-700/60">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-xs font-mono font-bold text-obsidian-400">
                0{index + 1}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-obsidian-800 text-obsidian-300 border border-obsidian-700">
                {exercise.category}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40">
                {exercise.targetSets} × {exercise.targetReps}
              </span>
              {exercise.loadLabel && (
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 flex items-center gap-1"
                  title={exercise.loadNote}
                >
                  <span>⚖️ {exercise.loadLabel}</span>
                </span>
              )}
              {isSwapped && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-950/60 text-violet-300 border border-violet-700/50 flex items-center gap-1">
                  <ArrowRightLeft className="w-2.5 h-2.5" /> Alt Movement
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-display font-bold text-obsidian-50 tracking-tight mt-1 truncate" title={currentDisplayName}>
              {currentDisplayName}
            </h3>

            <p className="text-xs text-obsidian-400 mt-0.5 line-clamp-1">
              {currentCue}
            </p>
          </div>

          {/* Right Header Actions: Swap & Accordion toggle */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => swapExercise(exercise.id)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-obsidian-800 hover:bg-obsidian-750 text-obsidian-300 hover:text-obsidian-100 border border-obsidian-700 transition-all active:scale-95"
              title={`Swap to: ${isSwapped ? exercise.name : exercise.alternate.name}`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Swap</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-800 transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dynamic Overload Status Banner */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          {overloadStatus.status === 'overload' && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-pulse-subtle">
              <Flame className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{overloadStatus.badge}: {overloadStatus.recommendation}</span>
            </div>
          )}

          {overloadStatus.status === 'bracket' && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-medium">
              <Target className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span>{overloadStatus.badge}: {overloadStatus.text}</span>
            </div>
          )}

          {overloadStatus.status === 'drop' && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{overloadStatus.badge}: {overloadStatus.text}</span>
            </div>
          )}

          {/* Biomechanical Stall Trigger Button */}
          {stallEvaluation.isStalled && (
            <button
              onClick={() => openDiagnostic(exercise.id, stallEvaluation.diagnostic)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-semibold shadow-amber-glow transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>View Stall Diagnostic</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Set Table */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-3">
          {/* Table Header Labels */}
          <div className="grid grid-cols-12 gap-2 text-[11px] font-mono uppercase tracking-wider text-obsidian-400 px-2 pb-1">
            <div className="col-span-1 text-center">Set</div>
            <div className="col-span-3">Previous</div>
            <div className="col-span-4 flex items-center space-x-1">
              <span>Load (kg)</span>
              {exercise.loadLabel && (
                <span className="text-[9px] text-cyan-400 font-mono">
                  ({exercise.loadLabel.toLowerCase()})
                </span>
              )}
            </div>
            <div className="col-span-3 text-center">Reps</div>
            <div className="col-span-1 text-center">Done</div>
          </div>

          {/* Set Rows */}
          {Array.from({ length: exercise.targetSets }).map((_, setIdx) => {
            const setObj = exerciseState.sets?.[setIdx] || {
              setNumber: setIdx + 1,
              weight: 0,
              reps: 0,
              completed: false
            };

            const lastSet = lastSessionSets[setIdx];
            const lastSessionLabel = lastSet
              ? `${lastSet.weight} kg ${exercise.loadType === 'per-side' ? '/side' : ''} × ${lastSet.reps}`
              : '—';

            return (
              <div
                key={setIdx}
                className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition-all ${
                  setObj.completed
                    ? 'bg-emerald-950/20 border border-emerald-500/30'
                    : 'bg-obsidian-850/60 border border-obsidian-750/70 hover:border-obsidian-700'
                }`}
              >
                {/* Set Number */}
                <div className="col-span-1 text-center font-mono text-xs font-bold text-obsidian-300">
                  {setIdx + 1}
                </div>

                {/* Previous Performance */}
                <div className="col-span-3">
                  <span className="text-[11px] font-mono text-obsidian-400 bg-obsidian-900/80 px-2 py-1 rounded-md border border-obsidian-800 block truncate">
                    {lastSessionLabel}
                  </span>
                </div>

                {/* Weight Input + Quick Steppers */}
                <div className="col-span-4">
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={setObj.weight === 0 ? '' : setObj.weight}
                      placeholder="0"
                      onChange={(e) => updateSet(exercise.id, setIdx, 'weight', e.target.value)}
                      className="w-14 sm:w-16 px-2 py-1.5 rounded-lg text-center font-mono text-xs sm:text-sm font-semibold glass-input focus:ring-1 focus:ring-emerald-500"
                    />
                    {/* Quick-tap steppers */}
                    <div className="flex flex-col sm:flex-row space-y-0.5 sm:space-y-0 sm:space-x-1">
                      <button
                        type="button"
                        onClick={() => quickAdjustWeight(exercise.id, setIdx, 1.25)}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-obsidian-750 hover:bg-obsidian-700 text-obsidian-300 border border-obsidian-650"
                        title="Add 1.25 kg"
                      >
                        +1.25
                      </button>
                      <button
                        type="button"
                        onClick={() => quickAdjustWeight(exercise.id, setIdx, 2.5)}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-obsidian-750 hover:bg-obsidian-700 text-obsidian-300 border border-obsidian-650"
                        title="Add 2.5 kg"
                      >
                        +2.5
                      </button>
                    </div>
                  </div>
                  {/* Per-Side Total Weight helper */}
                  {exercise.loadType === 'per-side' && Number(setObj.weight) > 0 && (
                    <span className="text-[9px] font-mono text-obsidian-400 block mt-0.5 tracking-tight">
                      Total plates: <span className="text-cyan-400 font-semibold">{Number((setObj.weight * 2).toFixed(1))}kg</span>
                    </span>
                  )}
                </div>

                {/* Reps Input + Quick +/- */}
                <div className="col-span-3 flex items-center justify-center space-x-1">
                  <button
                    type="button"
                    onClick={() => quickAdjustReps(exercise.id, setIdx, -1)}
                    className="w-5 h-6 rounded flex items-center justify-center text-xs font-mono bg-obsidian-800 text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-750 border border-obsidian-700"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={setObj.reps === 0 ? '' : setObj.reps}
                    placeholder="0"
                    onChange={(e) => updateSet(exercise.id, setIdx, 'reps', e.target.value)}
                    className="w-10 sm:w-12 px-1 py-1.5 rounded-lg text-center font-mono text-xs sm:text-sm font-semibold glass-input focus:ring-1 focus:ring-cyan-500"
                  />

                  <button
                    type="button"
                    onClick={() => quickAdjustReps(exercise.id, setIdx, 1)}
                    className="w-5 h-6 rounded flex items-center justify-center text-xs font-mono bg-obsidian-800 text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-750 border border-obsidian-700"
                  >
                    +
                  </button>
                </div>

                {/* Set Complete Checkmark Button */}
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => toggleSetComplete(exercise.id, setIdx, exercise)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      setObj.completed
                        ? 'bg-emerald-500 text-obsidian-950 shadow-obsidian-glow scale-105'
                        : 'bg-obsidian-800 hover:bg-obsidian-750 text-obsidian-500 hover:text-obsidian-300 border border-obsidian-700'
                    }`}
                    title={setObj.completed ? 'Completed' : 'Mark Complete & Start Rest'}
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
