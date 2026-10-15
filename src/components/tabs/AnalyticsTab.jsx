import React, { useState } from 'react';
import { useStorage } from '../../context/StorageContext';
import { PPL_PROGRAM } from '../../data/pplProgram';
import { calculate1RM } from '../../engine/overload';
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
  LineChart as LineChartIcon,
  TrendingUp,
  Dumbbell,
  Ruler,
  Layers,
  Scale,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

export default function AnalyticsTab() {
  const { data, biometrics } = useStorage();

  // All unique exercises across program for the dropdown
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
  const [measurementSubTab, setMeasurementSubTab] = useState('recomp'); // 'recomp' | 'vtaper' | 'symmetry'

  // Build timeline data for selected exercise
  const exerciseOverloadData = (data.workoutHistory || [])
    .filter((session) => session.exercises && session.exercises[selectedExerciseId])
    .map((session) => {
      const exData = session.exercises[selectedExerciseId];
      const sets = exData.sets || [];
      const maxWeight = sets.length > 0 ? Math.max(...sets.map((s) => Number(s.weight) || 0)) : 0;
      
      // Calculate max estimated 1RM across sets in this session
      const estimated1RMs = sets.map((s) => calculate1RM(Number(s.weight) || 0, Number(s.reps) || 0));
      const max1RM = estimated1RMs.length > 0 ? Math.max(...estimated1RMs) : 0;

      return {
        date: session.date ? session.date.substring(5) : '—',
        fullDate: session.date,
        maxWeight,
        estimated1RM: max1RM,
        volume: sets.reduce((acc, s) => acc + ((Number(s.weight) || 0) * (Number(s.reps) || 0)), 0)
      };
    });

  // Recomposition Dual-Axis Timeline Data (Weight vs Navel Waist)
  const recompTimelineData = (data.measurements || []).map((m) => ({
    date: m.date ? m.date.substring(5) : '—',
    fullDate: m.date,
    weightKg: m.weightKg,
    waistInches: m.waistInches || Number((m.waistCm / 2.54).toFixed(1)),
    bodyFatPct: m.bodyFatPct || 16.0
  }));

  // Upper Body Width vs Midsection (V-Taper Timeline)
  const vTaperTimelineData = (data.measurements || [])
    .filter((m) => m.shouldersCm && m.waistCm)
    .map((m) => {
      const ratio = Number((m.shouldersCm / m.waistCm).toFixed(2));
      return {
        date: m.date ? m.date.substring(5) : '—',
        shouldersCm: m.shouldersCm,
        chestCm: m.chestCm,
        waistCm: m.waistCm,
        vTaperRatio: ratio
      };
    });

  // Latest Full Scan for Limb Symmetry
  const fullScans = (data.measurements || []).filter((m) => m.type === 'monthly_full');
  const latestScan = fullScans[fullScans.length - 1] || data.measurements[data.measurements.length - 1] || {};

  const symmetryData = [
    {
      segment: 'Arms (Flexed Bicep)',
      Left: latestScan.leftArmCm || 35.8,
      Right: latestScan.rightArmCm || 36.0,
      unit: 'cm',
      delta: Math.abs((latestScan.leftArmCm || 35.8) - (latestScan.rightArmCm || 36.0)).toFixed(1)
    },
    {
      segment: 'Thigh Circumference',
      Left: latestScan.leftThighCm || 55.4,
      Right: latestScan.rightThighCm || 55.6,
      unit: 'cm',
      delta: Math.abs((latestScan.leftThighCm || 55.4) - (latestScan.rightThighCm || 55.6)).toFixed(1)
    },
    {
      segment: 'Calf Circumference',
      Left: latestScan.leftCalfCm || 36.8,
      Right: latestScan.rightCalfCm || 36.8,
      unit: 'cm',
      delta: Math.abs((latestScan.leftCalfCm || 36.8) - (latestScan.rightCalfCm || 36.8)).toFixed(1)
    }
  ];

  // Current V-Taper Ratio
  const currentRatio = latestScan.shouldersCm && latestScan.waistCm
    ? (latestScan.shouldersCm / latestScan.waistCm).toFixed(2)
    : '1.54';

  const selectedExerciseObj = allExercises.find((e) => e.id === selectedExerciseId) || allExercises[0];

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Analytics Banner */}
      <div className="p-5 rounded-3xl glass-card border border-obsidian-750/90 shadow-glass-card">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 uppercase">
            Multi-Metric Vector Lab
          </span>
          <span className="text-xs font-mono text-obsidian-400">Offline Recomp Analytics</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-obsidian-50 tracking-tight mt-1">
          Anthropometric & Progressive Overload Vectors
        </h1>
        <p className="text-xs sm:text-sm text-obsidian-400 mt-0.5">
          Dual-axis recomp correlation, 1RM Brzycki/Epley velocity, and golden ratio V-Taper tracking.
        </p>
      </div>

      {/* METABOLIC BREAKDOWN HIGHLIGHT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">
            Dynamic BMR (Katch)
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl sm:text-2xl font-mono font-bold text-obsidian-50">{biometrics.bmr}</span>
            <span className="text-xs text-obsidian-400 font-mono">kcal</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-0.5">
            Mifflin MSJ: {biometrics.bmrMifflin} kcal
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">
            Total TDEE (Active)
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl sm:text-2xl font-mono font-bold text-cyan-400">{biometrics.tdee.totalTDEE}</span>
            <span className="text-xs text-obsidian-400 font-mono">kcal</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-0.5">
            Step boost: +{biometrics.tdee.stepBoost} | Lift: +{biometrics.tdee.workoutSurplus}
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">
            Lean Body Mass (LBM)
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">{biometrics.lbmKg}</span>
            <span className="text-xs text-obsidian-400 font-mono">kg</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-0.5">
            Fat Mass: {biometrics.fatMassKg} kg ({biometrics.bodyFatPct}% BF)
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-obsidian-750">
          <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-400">
            V-Taper Golden Ratio
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl sm:text-2xl font-mono font-bold text-amber-400">{currentRatio}</span>
            <span className="text-xs text-obsidian-400 font-mono">x</span>
          </div>
          <p className="text-[10px] text-obsidian-400 font-mono mt-0.5">
            Target: 1.618 (Delts / Waist)
          </p>
        </div>
      </div>

      {/* CHART 1: EXERCISE WEIGHT & 1RM OVERLOAD CURVE */}
      <div className="rounded-3xl glass-card border border-obsidian-700/80 p-5 sm:p-6 shadow-glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-obsidian-50">
                Exercise Load & Estimated 1RM Velocity
              </h3>
              <p className="text-xs text-obsidian-400 font-mono">
                Historical peak weight & calculated maximal output across sessions
              </p>
            </div>
          </div>

          {/* Exercise Dropdown Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-mono text-obsidian-400">Movement:</label>
            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-obsidian-850 text-obsidian-100 border border-obsidian-700 focus:outline-none focus:border-emerald-500"
            >
              {allExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart View */}
        {exerciseOverloadData.length > 0 ? (
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={exerciseOverloadData}>
                <defs>
                  <linearGradient id="color1RM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                <XAxis dataKey="date" stroke="#7B8DA8" fontSize={11} tickLine={false} />
                <YAxis stroke="#7B8DA8" fontSize={11} domain={['dataMin - 5', 'dataMax + 5']} tickLine={false} unit="kg" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0E121B',
                    borderColor: '#2F3C54',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#E8EDF5' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="estimated1RM"
                  name="Estimated 1RM (kg)"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#color1RM)"
                />
                <Area
                  type="monotone"
                  dataKey="maxWeight"
                  name="Top Set Working Weight (kg)"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWeight)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center rounded-2xl bg-obsidian-850/50 border border-obsidian-800 text-obsidian-400 text-xs">
            <p>No historical sessions recorded yet for {selectedExerciseObj.name}.</p>
            <p className="text-[11px] text-obsidian-500 mt-1">Complete your next session in the Today tab to render curves.</p>
          </div>
        )}
      </div>

      {/* CHART 2: ANTHROPOMETRIC RECOMP & SYMMETRY LAB */}
      <div className="rounded-3xl glass-card border border-obsidian-700/80 p-5 sm:p-6 shadow-glass-card space-y-4">
        {/* Sub-Tabs: Recomp Dual-Axis vs V-Taper vs Limb Symmetry */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-obsidian-750 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-obsidian-50">
                Anthropometric Vector Correlation
              </h3>
              <p className="text-xs text-obsidian-400 font-mono">
                Visualizing true recomp: Waist drops while lean weight sustains
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-obsidian-850 p-1 rounded-xl border border-obsidian-700">
            <button
              onClick={() => setMeasurementSubTab('recomp')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                measurementSubTab === 'recomp'
                  ? 'bg-emerald-500 text-obsidian-950 shadow-obsidian-glow'
                  : 'text-obsidian-400 hover:text-obsidian-200'
              }`}
            >
              Dual-Axis Recomp
            </button>
            <button
              onClick={() => setMeasurementSubTab('vtaper')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                measurementSubTab === 'vtaper'
                  ? 'bg-emerald-500 text-obsidian-950 shadow-obsidian-glow'
                  : 'text-obsidian-400 hover:text-obsidian-200'
              }`}
            >
              V-Taper Expansion
            </button>
            <button
              onClick={() => setMeasurementSubTab('symmetry')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                measurementSubTab === 'symmetry'
                  ? 'bg-emerald-500 text-obsidian-950 shadow-obsidian-glow'
                  : 'text-obsidian-400 hover:text-obsidian-200'
              }`}
            >
              Limb Symmetry
            </button>
          </div>
        </div>

        {/* View A: Recomp Dual-Axis Chart */}
        {measurementSubTab === 'recomp' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-mono text-obsidian-400 px-1">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Scale Weight (kg) [Left Axis]
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Navel Waist (inches) [Right Inverted Axis]
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recompTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                  <XAxis dataKey="date" stroke="#7B8DA8" fontSize={11} tickLine={false} />
                  {/* Left Y Axis: Weight */}
                  <YAxis
                    yAxisId="left"
                    stroke="#06B6D4"
                    fontSize={11}
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tickLine={false}
                    unit="kg"
                  />
                  {/* Right Y Axis: Inverted Waist Circumference */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#F59E0B"
                    fontSize={11}
                    reversed={true}
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    tickLine={false}
                    unit='"'
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0E121B',
                      borderColor: '#2F3C54',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="weightKg"
                    name="Scale Weight (kg)"
                    stroke="#06B6D4"
                    strokeWidth={2.5}
                    dot={{ fill: '#06B6D4', r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="waistInches"
                    name="Navel Waist (inches - Inverted)"
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    dot={{ fill: '#F59E0B', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-obsidian-400 text-center font-mono">
              💡 Recomposition signature: Inverted waist line trending upward signifies narrowing midsection while scale weight holds steady.
            </p>
          </div>
        )}

        {/* View B: V-Taper Expansion (Shoulders + Chest vs Waist) */}
        {measurementSubTab === 'vtaper' && (
          <div className="space-y-3 animate-fade-in">
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vTaperTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                  <XAxis dataKey="date" stroke="#7B8DA8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#7B8DA8" fontSize={11} domain={['dataMin - 3', 'dataMax + 3']} tickLine={false} unit="cm" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0E121B',
                      borderColor: '#2F3C54',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="shouldersCm"
                    name="Shoulders (Delts) cm"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="chestCm"
                    name="Chest Circumference cm"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={{ fill: '#06B6D4', r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="waistCm"
                    name="Navel Waist cm"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="p-3 rounded-2xl bg-obsidian-850 border border-obsidian-750 flex items-center justify-between text-xs font-mono">
              <span className="text-obsidian-400">Current V-Taper Index (Shoulders / Waist):</span>
              <span className="font-bold text-emerald-400 text-sm">{currentRatio}x</span>
            </div>
          </div>
        )}

        {/* View C: Limb Symmetry (Left vs Right Arm & Leg) */}
        {measurementSubTab === 'symmetry' && (
          <div className="space-y-4 animate-fade-in">
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={symmetryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                  <XAxis dataKey="segment" stroke="#7B8DA8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#7B8DA8" fontSize={11} domain={['dataMin - 5', 'dataMax + 5']} tickLine={false} unit="cm" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0E121B',
                      borderColor: '#2F3C54',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Left" name="Left Limb (cm)" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Right" name="Right Limb (cm)" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {symmetryData.map((item) => (
                <div key={item.segment} className="p-3 rounded-2xl bg-obsidian-850 border border-obsidian-750 text-xs font-mono">
                  <div className="text-obsidian-400 truncate">{item.segment}</div>
                  <div className="flex justify-between items-baseline mt-1 font-bold">
                    <span className="text-cyan-400">L: {item.Left} cm</span>
                    <span className="text-emerald-400">R: {item.Right} cm</span>
                  </div>
                  <div className="text-[10px] text-obsidian-500 mt-1">
                    Delta: {item.delta} cm ({Number(item.delta) <= 0.3 ? '✅ Symmetrical' : '⚠️ Slight imbalance'})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
