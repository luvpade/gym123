import React, { useState } from 'react';
import { useStorage } from '../../context/StorageContext';
import { PPL_PROGRAM } from '../../data/pplProgram';
import { calculate1RM } from '../../engine/overload';
import { calculateBodyFatPct, inchesToCm, cmToInches } from '../../engine/metabolic';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import {
  TrendingUp,
  Dumbbell,
  Ruler,
  Scale,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Clock,
  ChevronRight,
  X,
  Activity
} from 'lucide-react';
import { triggerHaptic } from '../../engine/audio';

export default function ProgressTab() {
  const { data, biometrics, logMeasurement } = useStorage();

  const [activeSubView, setActiveSubView] = useState('recomp'); // 'recomp' | '1rm' | 'symmetry' | 'ledger'
  const [modalType, setModalType] = useState(null); // 'weekly' | 'monthly' | null

  // All unique exercises across program for the 1RM curve dropdown
  const allExercises = [];
  const seenIds = new Set();
  PPL_PROGRAM.forEach((w) => {
    w.exercises.forEach((ex) => {
      if (!seenIds.has(ex.id)) {
        seenIds.add(ex.id);
        allExercises.push(ex);
      }
    });
  });

  const [selectedExerciseId, setSelectedExerciseId] = useState('incline-chest-press');

  // Deltas calculation
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

  const armDelta = latestScan.rightArmCm && firstScan.rightArmCm
    ? (latestScan.rightArmCm - firstScan.rightArmCm).toFixed(1)
    : '+0.7';

  // 1RM Timeline data
  const exerciseOverloadData = (data.workoutHistory || [])
    .filter((session) => session.exercises && session.exercises[selectedExerciseId])
    .map((session) => {
      const exData = session.exercises[selectedExerciseId];
      const sets = exData.sets || [];
      const maxWeight = sets.length > 0 ? Math.max(...sets.map((s) => Number(s.weight) || 0)) : 0;
      const estimated1RMs = sets.map((s) => calculate1RM(Number(s.weight) || 0, Number(s.reps) || 0));
      const max1RM = estimated1RMs.length > 0 ? Math.max(...estimated1RMs) : 0;

      return {
        date: session.date ? session.date.substring(5) : '—',
        fullDate: session.date,
        maxWeight,
        estimated1RM: max1RM,
      };
    });

  // Recomp Dual-Axis Timeline Data
  const recompTimelineData = (data.measurements || []).map((m) => ({
    date: m.date ? m.date.substring(5) : '—',
    fullDate: m.date,
    weightKg: m.weightKg,
    waistInches: m.waistInches || Number((m.waistCm / 2.54).toFixed(1)),
    bodyFatPct: m.bodyFatPct || 16.0
  }));

  // Limb Symmetry
  const symmetryData = [
    {
      segment: 'Arms (Flexed Bicep)',
      Left: latestScan.leftArmCm || 35.8,
      Right: latestScan.rightArmCm || 36.0,
      unit: 'cm',
    },
    {
      segment: 'Thigh Circumference',
      Left: latestScan.leftThighCm || 55.4,
      Right: latestScan.rightThighCm || 55.6,
      unit: 'cm',
    },
    {
      segment: 'Calf Circumference',
      Left: latestScan.leftCalfCm || 36.8,
      Right: latestScan.rightCalfCm || 36.8,
      unit: 'cm',
    }
  ];

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
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 uppercase">
              Progress & Body Vault
            </span>
            <span className="text-xs font-mono text-obsidian-400">8-Week Historical Trajectory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-obsidian-50 tracking-tight mt-1">
            Recomposition Analytics & Measurements
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-400 mt-0.5">
            Visualize your shrinking waistline, progressive overload velocity, and full anthropometric ledger.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setModalType('weekly')}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-obsidian-800 hover:bg-obsidian-750 text-obsidian-200 border border-obsidian-700 transition-all flex items-center space-x-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Weekly Check-in</span>
          </button>
          <button
            onClick={() => setModalType('monthly')}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 shadow-obsidian-glow transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>30-Day Scan</span>
          </button>
        </div>
      </div>

      {/* DELTA BADGES DISPLAY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">Navel Waist</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center">
              <ArrowDownRight className="w-3 h-3" /> {waistDelta} in
            </span>
          </div>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-2xl font-mono font-bold text-obsidian-50">{data.user.waistInches}"</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-1">Midsection Deficit Trim</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">Deltoids</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +{deltsDelta} cm
            </span>
          </div>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-2xl font-mono font-bold text-obsidian-50">{latestScan.shouldersCm || 119.2} cm</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-1">Upper Width Expansion</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">Chest Shelf</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +{chestDelta} cm
            </span>
          </div>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-2xl font-mono font-bold text-obsidian-50">{latestScan.chestCm || 99.2} cm</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-1">Clavicular Mass</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">Arms (Peak)</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +{armDelta} cm
            </span>
          </div>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-2xl font-mono font-bold text-obsidian-50">{latestScan.rightArmCm || 36.0} cm</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-1">Flexed Bicep Sweep</p>
        </div>
      </div>

      {/* SUB-VIEW SWITCHER PILLS */}
      <div className="rounded-3xl glass-card border border-obsidian-700/80 p-5 sm:p-6 shadow-glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-obsidian-750 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-display font-bold text-obsidian-50">
              Visual Progress Lab
            </h3>
          </div>

          <div className="flex items-center space-x-1 bg-obsidian-850 p-1 rounded-xl border border-obsidian-700">
            <button
              onClick={() => setActiveSubView('recomp')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeSubView === 'recomp'
                  ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-obsidian-glow'
                  : 'text-obsidian-400 hover:text-obsidian-200'
              }`}
            >
              Recomp Dual-Axis
            </button>
            <button
              onClick={() => setActiveSubView('1rm')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeSubView === '1rm'
                  ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-obsidian-glow'
                  : 'text-obsidian-400 hover:text-obsidian-200'
              }`}
            >
              1RM Load Curves
            </button>
            <button
              onClick={() => setActiveSubView('symmetry')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeSubView === 'symmetry'
                  ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-obsidian-glow'
                  : 'text-obsidian-400 hover:text-obsidian-200'
              }`}
            >
              Limb Symmetry
            </button>
            <button
              onClick={() => setActiveSubView('ledger')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeSubView === 'ledger'
                  ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-obsidian-glow'
                  : 'text-obsidian-400 hover:text-obsidian-200'
              }`}
            >
              Measurement Ledger
            </button>
          </div>
        </div>

        {/* View A: Recomp Dual-Axis Chart */}
        {activeSubView === 'recomp' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-mono text-obsidian-400 px-1">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Scale Weight (kg) [Left]
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Navel Waist (in) [Inverted Right]
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recompTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                  <XAxis dataKey="date" stroke="#7B8DA8" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#06B6D4" fontSize={11} domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} unit="kg" />
                  <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={11} reversed={true} domain={['dataMin - 0.5', 'dataMax + 0.5']} tickLine={false} unit='"' />
                  <Tooltip contentStyle={{ backgroundColor: '#0E121B', borderColor: '#2F3C54', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="weightKg" name="Scale Weight (kg)" stroke="#06B6D4" strokeWidth={2.5} dot={{ fill: '#06B6D4', r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="waistInches" name="Navel Waist (in - Inverted)" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: '#F59E0B', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* View B: 1RM Velocity Curves */}
        {activeSubView === '1rm' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-end space-x-2">
              <label className="text-xs font-mono text-obsidian-400">Exercise:</label>
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-obsidian-850 text-obsidian-100 border border-obsidian-700"
              >
                {allExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={exerciseOverloadData}>
                  <defs>
                    <linearGradient id="color1RM2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                  <XAxis dataKey="date" stroke="#7B8DA8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#7B8DA8" fontSize={11} domain={['dataMin - 5', 'dataMax + 5']} tickLine={false} unit="kg" />
                  <Tooltip contentStyle={{ backgroundColor: '#0E121B', borderColor: '#2F3C54', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="estimated1RM" name="Estimated 1RM (kg)" stroke="#10B981" strokeWidth={2.5} fill="url(#color1RM2)" />
                  <Area type="monotone" dataKey="maxWeight" name="Working Load (kg)" stroke="#06B6D4" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* View C: Limb Symmetry */}
        {activeSubView === 'symmetry' && (
          <div className="space-y-4 animate-fade-in">
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={symmetryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                  <XAxis dataKey="segment" stroke="#7B8DA8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#7B8DA8" fontSize={11} domain={['dataMin - 5', 'dataMax + 5']} tickLine={false} unit="cm" />
                  <Tooltip contentStyle={{ backgroundColor: '#0E121B', borderColor: '#2F3C54', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Left" name="Left Limb (cm)" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Right" name="Right Limb (cm)" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* View D: Full Historical Measurement Ledger */}
        {activeSubView === 'ledger' && (
          <div className="overflow-x-auto animate-fade-in">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-obsidian-750 text-obsidian-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Weight</th>
                  <th className="py-2.5 px-3">Waist</th>
                  <th className="py-2.5 px-3">BF%</th>
                  <th className="py-2.5 px-3">Delts</th>
                  <th className="py-2.5 px-3">Chest</th>
                  <th className="py-2.5 px-3">Arms (L/R)</th>
                  <th className="py-2.5 px-3">Thighs (L/R)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800 text-obsidian-200">
                {[...allScans].reverse().map((scan, idx) => (
                  <tr key={idx} className="hover:bg-obsidian-850">
                    <td className="py-2.5 px-3 font-semibold text-obsidian-100">{scan.date}</td>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">{scan.weightKg} kg</td>
                    <td className="py-2.5 px-3 text-amber-300">{scan.waistInches}"</td>
                    <td className="py-2.5 px-3 text-emerald-400">{scan.bodyFatPct ? `${scan.bodyFatPct}%` : '—'}</td>
                    <td className="py-2.5 px-3">{scan.shouldersCm ? `${scan.shouldersCm}cm` : '—'}</td>
                    <td className="py-2.5 px-3">{scan.chestCm ? `${scan.chestCm}cm` : '—'}</td>
                    <td className="py-2.5 px-3">{scan.leftArmCm ? `${scan.leftArmCm} / ${scan.rightArmCm}cm` : '—'}</td>
                    <td className="py-2.5 px-3">{scan.leftThighCm ? `${scan.leftThighCm} / ${scan.rightThighCm}cm` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: LOG NEW MEASUREMENTS */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass-card border border-emerald-500/40 p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-obsidian-700/60">
              <div className="flex items-center space-x-2">
                <Ruler className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-display font-bold text-obsidian-50">
                  {modalType === 'monthly' ? 'Monthly Full Anthropometric Scan' : 'Weekly Fasted Check-In'}
                </h3>
              </div>
              <button onClick={() => setModalType(null)} className="p-1 rounded-lg text-obsidian-400 hover:text-obsidian-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeasurement} className="py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-obsidian-400 mb-1">Morning Scale Weight (kg)</label>
                  <input type="number" step="0.1" required value={formData.weightKg} onChange={(e) => handleInputChange('weightKg', e.target.value)} className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm font-semibold text-cyan-300" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-obsidian-400 mb-1">Navel Waist (inches)</label>
                  <input type="number" step="0.1" required value={formData.waistInches} onChange={(e) => handleInputChange('waistInches', e.target.value)} className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm font-semibold text-amber-300" />
                </div>
              </div>

              {modalType === 'monthly' && (
                <div className="space-y-3 pt-2 border-t border-obsidian-750">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-obsidian-400 mb-1">Deltoids Width (cm)</label>
                      <input type="number" step="0.1" value={formData.shouldersCm} onChange={(e) => handleInputChange('shouldersCm', e.target.value)} className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-obsidian-400 mb-1">Chest across Nipples (cm)</label>
                      <input type="number" step="0.1" value={formData.chestCm} onChange={(e) => handleInputChange('chestCm', e.target.value)} className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-obsidian-400 mb-1">Left Arm (Flexed Bicep)</label>
                      <input type="number" step="0.1" value={formData.leftArmCm} onChange={(e) => handleInputChange('leftArmCm', e.target.value)} className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-obsidian-400 mb-1">Right Arm (Flexed Bicep)</label>
                      <input type="number" step="0.1" value={formData.rightArmCm} onChange={(e) => handleInputChange('rightArmCm', e.target.value)} className="w-full px-3 py-2 rounded-xl glass-input font-mono text-sm" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-obsidian-750 flex items-center justify-end space-x-3">
                <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-obsidian-400 hover:text-obsidian-200">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 shadow-obsidian-glow">Commit to Vault</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
