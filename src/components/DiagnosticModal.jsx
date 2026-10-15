import React from 'react';
import { useStorage } from '../context/StorageContext';
import { AlertTriangle, CheckCircle2, ChevronRight, X, Sparkles, Activity, ShieldAlert } from 'lucide-react';

export default function DiagnosticModal() {
  const { diagnosticModal, closeDiagnostic } = useStorage();

  if (!diagnosticModal.isOpen || !diagnosticModal.info) return null;

  const { title, tip, focusArea, quickFix } = diagnosticModal.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-2xl glass-card border border-amber-500/40 p-6 shadow-2xl relative overflow-hidden"
        style={{
          boxShadow: '0 0 50px -10px rgba(245, 158, 11, 0.25), 0 20px 40px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-obsidian-700/60 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-amber-400">
                  Biomechanical Diagnostic
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Stall Detected
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-display font-bold text-obsidian-50 mt-0.5">
                {title}
              </h3>
            </div>
          </div>

          <button
            onClick={closeDiagnostic}
            className="p-1.5 rounded-lg text-obsidian-400 hover:text-obsidian-100 hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Body */}
        <div className="py-4 space-y-4 relative z-10">
          {/* Target Fiber Badge */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 flex items-center space-x-1.5 text-obsidian-200">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-obsidian-400">Target Vector:</span>
              <span className="font-semibold text-cyan-300">{focusArea}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 flex items-center space-x-1.5 text-obsidian-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-obsidian-400">Adjustment:</span>
              <span className="font-semibold text-amber-300">{quickFix}</span>
            </div>
          </div>

          {/* Coach Deep-Dive Tip */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-100/90 text-sm leading-relaxed font-sans">
            <p className="font-medium text-amber-300 mb-1 flex items-center gap-1.5 text-xs tracking-wider uppercase">
              <span>Automated Overload Coach Analysis</span>
            </p>
            {tip}
          </div>

          {/* Execution Checklist */}
          <div className="space-y-2 pt-1">
            <h5 className="text-xs font-mono uppercase tracking-wider text-obsidian-400">
              Pre-Flight Protocol (Next Attempt)
            </h5>
            <div className="space-y-1.5 text-xs text-obsidian-300">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Maintain exact weight load; prioritize full mechanical stretch over ego load.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Enforce 3-second eccentric negative and 0.5s pause in deep stretched position.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Verify pre-workout hydration (500ml water + pinch of sodium 45m prior).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-obsidian-700/60 flex items-center justify-end space-x-3 relative z-10">
          <button
            onClick={closeDiagnostic}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-obsidian-950 shadow-amber-glow transition-all active:scale-95"
          >
            Acknowledge & Calibrate Form
          </button>
        </div>
      </div>
    </div>
  );
}
