import React, { useState } from 'react';
import { useStorage } from '../../context/StorageContext';
import { calculateBodyFatPct, inchesToCm, cmToInches } from '../../engine/metabolic';
import {
  Ruler,
  Calendar,
  Sparkles,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { triggerHaptic } from '../../engine/audio';

export default function MeasurementsTab() {
  const { data, biometrics, logMeasurement } = useStorage();
  const [modalType, setModalType] = useState(null); // 'weekly' | 'monthly' | null

  // Calculate Deltas between first scan and latest scan
  const allScans = data.measurements || [];
  const firstScan = allScans[0] || {};
  const latestScan = allScans[allScans.length - 1] || {};

  const deltsDelta = latestScan.shouldersCm && firstScan.shouldersCm
    ? (latestScan.shouldersCm - firstScan.shouldersCm).toFixed(1)
    : '+0.8';

  const waistDelta = latestScan.waistInches && firstScan.waistInches
    ? (latestScan.waistInches - firstScan.waistInches).toFixed(1)
    : '-1.3';

  const chestDelta = latestScan.chestCm && firstScan.chestCm
    ? (latestScan.chestCm - firstScan.chestCm).toFixed(1)
    : '+0.8';

  const leftThighDelta = latestScan.leftThighCm && firstScan.leftThighCm
    ? (latestScan.leftThighCm - firstScan.leftThighCm).toFixed(1)
    : '+0.6';

  const armDelta = latestScan.rightArmCm && firstScan.rightArmCm
    ? (latestScan.rightArmCm - firstScan.rightArmCm).toFixed(1)
    : '+0.7';

  // Check-In Form State
  const [formData, setFormData] = useState({
    weightKg: data.user.weightKg,
    waistInches: data.user.waistInches,
    waistCm: data.user.waistCm,
    chestCm: latestScan.chestCm || 99.2,
    shouldersCm: latestScan.shouldersCm || 119.2,
    leftArmCm: latestScan.leftArmCm || 35.8,
    rightArmCm: latestScan.rightArmCm || 36.0,
    leftThighCm: latestScan.leftThighCm || 55.4,
    rightThighCm: latestScan.rightThighCm || 55.6,
    leftCalfCm: latestScan.leftCalfCm || 36.8,
    rightCalfCm: latestScan.rightCalfCm || 36.8,
    neckCm: data.user.neckCm || 37.5
  });

  const handleInputChange = (field, val) => {
    const num = Number(val) || 0;
    setFormData((prev) => {
      const next = { ...prev, [field]: num };
      if (field === 'waistInches') {
        next.waistCm = inchesToCm(num);
      } else if (field === 'waistCm') {
        next.waistInches = cmToInches(num);
      }
      return next;
    });
  };

  const handleSaveMeasurement = (e) => {
    e.preventDefault();
    triggerHaptic([50, 50, 50]);

    const bf = calculateBodyFatPct({
      heightCm: data.user.heightCm,
      waistCm: formData.waistCm,
      neckCm: formData.neckCm
    });

    logMeasurement({
      type: modalType === 'monthly' ? 'monthly_full' : 'weekly_fast',
      ...formData,
      bodyFatPct: bf
    });

    setModalType(null);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-card border border-obsidian-750/90 shadow-glass-card">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
              Anthropometric Vault
            </span>
            <span className="text-xs font-mono text-obsidian-400">Weekly & Monthly Calibrations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-obsidian-50 tracking-tight mt-1">
            Body Measurement Lab
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-400 mt-0.5">
            Track skeletal frame expansion, V-Taper deltas, and limb hypertrophy with sub-centimeter precision.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setModalType('weekly')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-obsidian-800 hover:bg-obsidian-750 text-obsidian-200 border border-obsidian-700 transition-all active:scale-95 flex items-center space-x-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Weekly Check-in</span>
          </button>
          <button
            onClick={() => setModalType('monthly')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 shadow-obsidian-glow transition-all active:scale-95 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Full 30-Day Scan</span>
          </button>
        </div>
      </div>

      {/* DELTA BADGES DISPLAY GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Navel Waist Delta */}
        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">Navel Waist</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center">
              <ArrowDownRight className="w-3 h-3" /> {waistDelta} in
            </span>
          </div>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-xl sm:text-2xl font-mono font-bold text-obsidian-50">{data.user.waistInches}"</span>
            <span className="text-xs text-obsidian-400 font-mono">({data.user.waistCm} cm)</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-1">Midsection Compression</p>
        </div>

        {/* Shoulders Delta */}
        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">Deltoids</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +{deltsDelta} cm
            </span>
          </div>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-xl sm:text-2xl font-mono font-bold text-obsidian-50">{latestScan.shouldersCm || 119.2}</span>
            <span className="text-xs text-obsidian-400 font-mono">cm</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-1">Upper Width Expansion</p>
        </div>

        {/* Chest Delta */}
        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">Chest Shelf</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +{chestDelta} cm
            </span>
          </div>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-xl sm:text-2xl font-mono font-bold text-obsidian-50">{latestScan.chestCm || 99.2}</span>
            <span className="text-xs text-obsidian-400 font-mono">cm</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-1">Nipple Line Circumference</p>
        </div>

        {/* Flexed Arm Delta */}
        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">Arms (Peak)</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +{armDelta} cm
            </span>
          </div>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-xl sm:text-2xl font-mono font-bold text-obsidian-50">{latestScan.rightArmCm || 36.0}</span>
            <span className="text-xs text-obsidian-400 font-mono">cm</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-1">R: 36.0cm | L: 35.8cm</p>
        </div>

        {/* Thighs Delta */}
        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">Thigh Sweep</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +{leftThighDelta} cm
            </span>
          </div>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-xl sm:text-2xl font-mono font-bold text-obsidian-50">{latestScan.rightThighCm || 55.6}</span>
            <span className="text-xs text-obsidian-400 font-mono">cm</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-1">Quad Athletic Foundation</p>
        </div>
      </div>

      {/* AUTOMATED CHECK-IN PROMPT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sunday Morning Check-In Prompt */}
        <div className="p-5 rounded-3xl glass-card border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-cyan-glow" />
              <h3 className="text-sm font-display font-bold text-obsidian-100">
                Weekly Fasted Sunday Check-In
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Every Sunday
            </span>
          </div>
          <p className="text-xs text-obsidian-300 leading-relaxed">
            Record empty-stomach morning weight and relaxed navel waist circumference to maintain true recomp velocity without water weight noise.
          </p>
          <button
            onClick={() => setModalType('weekly')}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-obsidian-800 hover:bg-obsidian-750 border border-cyan-500/40 text-cyan-300 flex items-center justify-center space-x-2 transition-all"
          >
            <span>Log Fasted Weight & Waist</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 30-Day Anthropometric Scan Prompt */}
        <div className="p-5 rounded-3xl glass-card border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-obsidian-glow" />
              <h3 className="text-sm font-display font-bold text-obsidian-100">
                Monthly Full Anthropometric Scan
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Every 30 Days
            </span>
          </div>
          <p className="text-xs text-obsidian-300 leading-relaxed">
            Measure full 8-point perimeter: Chest, Shoulders, Left/Right Thighs, Left/Right Calves, Flexed Arms, and Neck.
          </p>
          <button
            onClick={() => setModalType('monthly')}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold shadow-obsidian-glow flex items-center justify-center space-x-2 transition-all"
          >
            <span>Execute 30-Day Body Scan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* HISTORICAL MEASUREMENT LOGS TABLE */}
      <div className="rounded-3xl glass-card border border-obsidian-700/80 p-5 sm:p-6 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-display font-bold text-obsidian-50">
              Anthropometric Ledger & Scan History
            </h3>
          </div>
          <span className="text-xs font-mono text-obsidian-400">
            {allScans.length} Check-ins Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-obsidian-750 text-obsidian-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Scale (kg)</th>
                <th className="py-2.5 px-3">Waist</th>
                <th className="py-2.5 px-3">Est. BF%</th>
                <th className="py-2.5 px-3">Delts</th>
                <th className="py-2.5 px-3">Chest</th>
                <th className="py-2.5 px-3">L / R Arm</th>
                <th className="py-2.5 px-3">L / R Thigh</th>
                <th className="py-2.5 px-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800/80 text-obsidian-200">
              {[...allScans].reverse().map((scan, idx) => (
                <tr key={idx} className="hover:bg-obsidian-850/60 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-obsidian-100">{scan.date}</td>
                  <td className="py-2.5 px-3 text-cyan-300 font-bold">{scan.weightKg} kg</td>
                  <td className="py-2.5 px-3 text-amber-300">{scan.waistInches}" ({scan.waistCm}cm)</td>
                  <td className="py-2.5 px-3 text-emerald-400">{scan.bodyFatPct ? `${scan.bodyFatPct}%` : '—'}</td>
                  <td className="py-2.5 px-3">{scan.shouldersCm ? `${scan.shouldersCm}cm` : '—'}</td>
                  <td className="py-2.5 px-3">{scan.chestCm ? `${scan.chestCm}cm` : '—'}</td>
                  <td className="py-2.5 px-3">
                    {scan.leftArmCm ? `${scan.leftArmCm} / ${scan.rightArmCm}cm` : '—'}
                  </td>
                  <td className="py-2.5 px-3">
                    {scan.leftThighCm ? `${scan.leftThighCm} / ${scan.rightThighCm}cm` : '—'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase ${
                        scan.type === 'monthly_full'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-obsidian-800 text-obsidian-400 border border-obsidian-700'
                      }`}
                    >
                      {scan.type === 'monthly_full' ? 'Full Scan' : 'Weekly Fasted'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: LOG NEW MEASUREMENTS */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass-card border border-emerald-500/40 p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-obsidian-700/60">
              <div className="flex items-center space-x-2">
                <Ruler className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-display font-bold text-obsidian-50">
                  {modalType === 'monthly' ? 'Monthly Full Anthropometric Scan' : 'Weekly Fasted Sunday Check-In'}
                </h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg text-obsidian-400 hover:text-obsidian-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeasurement} className="py-4 space-y-4">
              {/* Primary Biometrics: Weight & Navel Waist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-obsidian-400 mb-1">
                    Morning Scale Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.weightKg}
                    onChange={(e) => handleInputChange('weightKg', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm font-semibold text-cyan-300"
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
                    value={formData.waistInches}
                    onChange={(e) => handleInputChange('waistInches', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm font-semibold text-amber-300"
                  />
                  <span className="text-[10px] text-obsidian-500 font-mono mt-0.5 block">
                    Equal to: {formData.waistCm} cm
                  </span>
                </div>
              </div>

              {/* Monthly Full Scan Additional Metrics */}
              {modalType === 'monthly' && (
                <div className="space-y-3 pt-2 border-t border-obsidian-750">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    30-Day Perimeter Scans (cm)
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-obsidian-400 mb-1">
                        Deltoids Width (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.shouldersCm}
                        onChange={(e) => handleInputChange('shouldersCm', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-obsidian-400 mb-1">
                        Chest across Nipples (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.chestCm}
                        onChange={(e) => handleInputChange('chestCm', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-obsidian-400 mb-1">
                        Left Arm (Flexed Bicep)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.leftArmCm}
                        onChange={(e) => handleInputChange('leftArmCm', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-obsidian-400 mb-1">
                        Right Arm (Flexed Bicep)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.rightArmCm}
                        onChange={(e) => handleInputChange('rightArmCm', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-obsidian-400 mb-1">
                        Left Thigh Circumference
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.leftThighCm}
                        onChange={(e) => handleInputChange('leftThighCm', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-obsidian-400 mb-1">
                        Right Thigh Circumference
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.rightThighCm}
                        onChange={(e) => handleInputChange('rightThighCm', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-obsidian-400 mb-1">
                        Neck Circumference (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.neckCm}
                        onChange={(e) => handleInputChange('neckCm', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-obsidian-400 mb-1">
                        Left / Right Calves (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.rightCalfCm}
                        onChange={(e) => {
                          handleInputChange('rightCalfCm', e.target.value);
                          handleInputChange('leftCalfCm', e.target.value);
                        }}
                        className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-obsidian-750 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-obsidian-400 hover:text-obsidian-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 shadow-obsidian-glow transition-all"
                >
                  Commit to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
