import React, { useState } from 'react';
import { useStorage } from '../../context/StorageContext';
import { PPL_PROGRAM, SUNDAY_RECOVERY_PROTOCOL } from '../../data/pplProgram';
import ExerciseCard from '../ExerciseCard';
import {
  Dumbbell,
  CheckCircle2,
  Sparkles,
  Shield,
  ShieldCheck,
  Timer,
  ChevronRight,
  Flame,
  Zap,
  RotateCcw
} from 'lucide-react';

export default function WorkoutTab() {
  const {
    data,
    switchActiveWorkout,
    completeActiveWorkout,
    toggleSundayTask,
    isSunday
  } = useStorage();

  const activeWorkoutId = data.activeSession.workoutId;
  const [selectedTabId, setSelectedTabId] = useState(activeWorkoutId || 'push-a');

  const isViewingSunday = selectedTabId === 'sunday';
  const currentWorkoutDef = PPL_PROGRAM.find((w) => w.id === selectedTabId) || PPL_PROGRAM[0];

  const handleSelectDay = (dayId) => {
    setSelectedTabId(dayId);
    if (dayId !== 'sunday') {
      switchActiveWorkout(dayId);
    }
  };

  const allSundayDone = Object.values(data.sundayChecklist || {}).every(Boolean);

  // Calculate session completion progress
  const totalExercises = currentWorkoutDef?.exercises?.length || 0;
  let completedExercises = 0;
  if (!isViewingSunday && currentWorkoutDef) {
    currentWorkoutDef.exercises.forEach((ex) => {
      const exState = data.activeSession.exercises[ex.id];
      if (exState && exState.sets?.some((s) => s.completed)) {
        completedExercises++;
      }
    });
  }

  const sessionProgressPct = totalExercises > 0
    ? Math.round((completedExercises / totalExercises) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Bar: PPL Split Segmented Day Switcher */}
      <div className="p-4 sm:p-5 rounded-3xl glass-card border border-obsidian-750/90 shadow-glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
              Training Session & Split Manager
            </span>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-obsidian-50 tracking-tight">
              {isViewingSunday ? 'Sunday Biological Recovery' : `${currentWorkoutDef.code}: ${currentWorkoutDef.title}`}
            </h1>
          </div>

          {!isViewingSunday && (
            <button
              onClick={completeActiveWorkout}
              className="px-5 py-2.5 rounded-xl text-xs font-bold font-sans bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 shadow-obsidian-glow transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Finish Workout</span>
            </button>
          )}
        </div>

        {/* 6-Day Unified PPL Split Navigation Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1.5 rounded-2xl bg-obsidian-900/90 border border-obsidian-800">
          {PPL_PROGRAM.map((w) => {
            const isSelected = selectedTabId === w.id;
            return (
              <button
                key={w.id}
                onClick={() => handleSelectDay(w.id)}
                className={`py-2 px-2 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-obsidian-glow'
                    : 'text-obsidian-400 hover:text-obsidian-200 hover:bg-obsidian-800'
                }`}
              >
                <span className="text-xs font-mono font-bold block">{w.code}</span>
                <span className="text-[9px] uppercase tracking-wider block opacity-80 truncate">
                  {w.id.replace('-', ' ')}
                </span>
              </button>
            );
          })}

          {/* Sunday Recovery Tab in the PPL selector */}
          <button
            onClick={() => handleSelectDay('sunday')}
            className={`py-2 px-2 rounded-xl text-center transition-all ${
              isViewingSunday
                ? 'bg-cyan-500 text-obsidian-950 font-bold shadow-cyan-glow'
                : 'text-obsidian-400 hover:text-cyan-300 hover:bg-obsidian-800'
            }`}
          >
            <span className="text-xs font-mono font-bold block">RECOVERY</span>
            <span className="text-[9px] uppercase tracking-wider block opacity-80">
              Sunday
            </span>
          </button>
        </div>
      </div>

      {/* SUNDAY RECOVERY PROTOCOL VIEW (if Sunday selected) */}
      {isViewingSunday ? (
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
                Zero lifting today. Non-punitive recovery ensures your streak never decrements.
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
        </div>
      ) : (
        /* ACTIVE WORKOUT EXERCISE CARDS */
        <div className="space-y-4">
          {/* Progress Header */}
          <div className="rounded-2xl glass-card p-4 border border-obsidian-750 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-mono text-obsidian-400 mb-1.5">
                <span>Workout Progress: {completedExercises}/{totalExercises} Movements Logged</span>
                <span className="font-bold text-emerald-400">{sessionProgressPct}%</span>
              </div>
              <div className="w-full bg-obsidian-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${sessionProgressPct}%` }}
                />
              </div>
            </div>
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
