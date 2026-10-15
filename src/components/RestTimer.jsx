import React from 'react';
import { useStorage } from '../context/StorageContext';
import { Play, Pause, X, Plus, Minus, Maximize2, Minimize2, Timer } from 'lucide-react';

export default function RestTimer() {
  const { restTimer, adjustRestTimer, minimizeRestTimer, dismissRestTimer } = useStorage();

  if (!restTimer.active) return null;

  const { duration, remaining, exerciseName, minimized } = restTimer;
  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;
  const strokeDashoffset = 283 - (283 * progress) / 100;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Minimized floating pill mode
  if (minimized) {
    return (
      <div
        onClick={minimizeRestTimer}
        className="fixed bottom-20 md:bottom-8 right-4 z-50 flex items-center space-x-3 px-4 py-2.5 rounded-full bg-obsidian-850/95 border border-amber-500/40 shadow-amber-glow backdrop-blur-xl cursor-pointer hover:border-amber-400 transition-all group animate-bounce duration-1000"
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <Timer className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-mono font-bold text-amber-300">
            {formatTime(remaining)}
          </span>
          <span className="text-[10px] text-obsidian-400 font-medium truncate max-w-[100px]">
            {exerciseName || 'Rest Period'}
          </span>
        </div>
        <Maximize2 className="w-3.5 h-3.5 text-obsidian-400 group-hover:text-obsidian-100 transition-colors ml-1" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 w-72 sm:w-80 rounded-2xl glass-card p-4 border border-amber-500/30 shadow-amber-glow animate-fade-in backdrop-blur-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-obsidian-700/60">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">
            Dynamic Rest Interval
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={minimizeRestTimer}
            className="p-1 rounded-lg text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-750 transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={dismissRestTimer}
            className="p-1 rounded-lg text-obsidian-400 hover:text-rose-400 hover:bg-obsidian-750 transition-colors"
            title="Dismiss Timer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Dial & Exercise Name */}
      <div className="flex items-center space-x-4 my-2">
        <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#161E2E"
              strokeWidth="7"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#F59E0B"
              strokeWidth="7"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-mono font-bold text-obsidian-50 tracking-tight">
              {formatTime(remaining)}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-obsidian-400">
              Left
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-obsidian-400 uppercase tracking-wider font-medium">
            Next Set Recovery
          </p>
          <h4 className="text-sm font-semibold text-obsidian-100 truncate mt-0.5" title={exerciseName}>
            {exerciseName || 'Active Rest'}
          </h4>
          <p className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1 font-mono">
            <span>⚡ Glycogen Replenish</span>
          </p>
        </div>
      </div>

      {/* Quick Adjustment Controls */}
      <div className="flex items-center justify-between pt-2 mt-2 border-t border-obsidian-700/60">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => adjustRestTimer(-15)}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-obsidian-800 text-obsidian-300 hover:text-obsidian-50 hover:bg-obsidian-700 border border-obsidian-700 transition-colors"
          >
            -15s
          </button>
          <button
            onClick={() => adjustRestTimer(30)}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-obsidian-800 text-obsidian-300 hover:text-obsidian-50 hover:bg-obsidian-700 border border-obsidian-700 transition-colors"
          >
            +30s
          </button>
        </div>

        <button
          onClick={dismissRestTimer}
          className="text-xs text-obsidian-400 hover:text-amber-300 font-medium transition-colors"
        >
          Skip Rest
        </button>
      </div>
    </div>
  );
}
