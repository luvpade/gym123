import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_SEED_DATA } from '../data/initialData';
import { PPL_PROGRAM } from '../data/pplProgram';
import { runBiometricAudit } from '../engine/metabolic';
import {
  playTimerCompleteSound,
  playCountdownTick,
  playSetCompleteSound,
  playOverloadFanfare,
  triggerHaptic
} from '../engine/audio';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'sleeper_build_v2_data';

const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  // Load data from LocalStorage or fall back to INITIAL_SEED_DATA
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.version === 2) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
    return INITIAL_SEED_DATA;
  });

  // Active rest timer state
  const [restTimer, setRestTimer] = useState({
    active: false,
    duration: 90,
    remaining: 90,
    exerciseName: '',
    minimized: false,
  });

  // Diagnostic modal state
  const [diagnosticModal, setDiagnosticModal] = useState({
    isOpen: false,
    exerciseId: null,
    info: null,
  });

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to persist state to local storage:', e);
    }
  }, [data]);

  // Rest Timer Interval Effect
  useEffect(() => {
    let interval = null;
    if (restTimer.active && restTimer.remaining > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (!prev.active) return prev;
          const nextRemaining = prev.remaining - 1;

          // Sound tick on last 3 seconds
          if (nextRemaining <= 3 && nextRemaining > 0 && !data.user.audioMuted) {
            playCountdownTick();
          }

          if (nextRemaining <= 0) {
            if (!data.user.audioMuted) {
              playTimerCompleteSound();
            } else {
              triggerHaptic([150, 80, 150]);
            }
            return { ...prev, active: false, remaining: 0 };
          }
          return { ...prev, remaining: nextRemaining };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [restTimer.active, restTimer.remaining, data.user.audioMuted]);

  // Biometric Engine Computation
  const biometrics = runBiometricAudit({
    heightCm: data.user.heightCm,
    weightKg: data.user.weightKg,
    waistInches: data.user.waistInches,
    waistCm: data.user.waistCm,
    neckCm: data.user.neckCm,
    steps: data.user.stepsToday,
    isWorkoutDay: data.user.isWorkoutDay,
    age: data.user.age
  });

  // Check if today is Sunday
  const isSunday = new Date().getDay() === 0;

  // Actions
  const updateBiometrics = (updates) => {
    setData((prev) => {
      const updatedUser = { ...prev.user, ...updates };
      // Keep waistCm and waistInches in sync
      if (updates.waistInches && !updates.waistCm) {
        updatedUser.waistCm = Number((updates.waistInches * 2.54).toFixed(1));
      } else if (updates.waistCm && !updates.waistInches) {
        updatedUser.waistInches = Number((updates.waistCm / 2.54).toFixed(1));
      }
      return { ...prev, user: updatedUser };
    });
  };

  const startRestTimer = (seconds = 90, exerciseName = '') => {
    setRestTimer({
      active: true,
      duration: seconds,
      remaining: seconds,
      exerciseName,
      minimized: false,
    });
  };

  const adjustRestTimer = (deltaSeconds) => {
    setRestTimer((prev) => {
      const nextRemaining = Math.max(5, prev.remaining + deltaSeconds);
      const nextDuration = Math.max(nextRemaining, prev.duration);
      return { ...prev, remaining: nextRemaining, duration: nextDuration };
    });
  };

  const minimizeRestTimer = () => {
    setRestTimer((prev) => ({ ...prev, minimized: !prev.minimized }));
  };

  const dismissRestTimer = () => {
    setRestTimer((prev) => ({ ...prev, active: false, remaining: 0 }));
  };

  const openDiagnostic = (exerciseId, info) => {
    setDiagnosticModal({
      isOpen: true,
      exerciseId,
      info,
    });
  };

  const closeDiagnostic = () => {
    setDiagnosticModal({
      isOpen: false,
      exerciseId: null,
      info: null,
    });
  };

  const swapExercise = (exerciseId) => {
    setData((prev) => {
      const currentActive = prev.activeSession;
      const currentEx = currentActive.exercises[exerciseId] || { sets: [], isSwapped: false };
      const nextSwapped = !currentEx.isSwapped;

      return {
        ...prev,
        activeSession: {
          ...currentActive,
          exercises: {
            ...currentActive.exercises,
            [exerciseId]: {
              ...currentEx,
              isSwapped: nextSwapped,
            },
          },
        },
        swappedExercises: {
          ...prev.swappedExercises,
          [exerciseId]: nextSwapped,
        },
      };
    });
  };

  const updateSet = (exerciseId, setIndex, field, value) => {
    setData((prev) => {
      const currentActive = prev.activeSession;
      const exState = currentActive.exercises[exerciseId] || { sets: [], isSwapped: false };
      const newSets = [...(exState.sets || [])];

      if (!newSets[setIndex]) {
        newSets[setIndex] = { setNumber: setIndex + 1, weight: 0, reps: 0, completed: false };
      }

      newSets[setIndex] = {
        ...newSets[setIndex],
        [field]: Number(value) || 0,
      };

      return {
        ...prev,
        activeSession: {
          ...currentActive,
          exercises: {
            ...currentActive.exercises,
            [exerciseId]: {
              ...exState,
              sets: newSets,
            },
          },
        },
      };
    });
  };

  const toggleSetComplete = (exerciseId, setIndex, exercise) => {
    setData((prev) => {
      const currentActive = prev.activeSession;
      const exState = currentActive.exercises[exerciseId] || { sets: [], isSwapped: false };
      const newSets = [...(exState.sets || [])];

      if (!newSets[setIndex]) {
        newSets[setIndex] = { setNumber: setIndex + 1, weight: 0, reps: 0, completed: false };
      }

      const nextCompleted = !newSets[setIndex].completed;
      newSets[setIndex] = {
        ...newSets[setIndex],
        completed: nextCompleted,
      };

      // If marking completed: trigger audio and dynamic rest timer
      if (nextCompleted) {
        if (!prev.user.audioMuted) {
          playSetCompleteSound();
        } else {
          triggerHaptic([70, 40, 70]);
        }

        // Rest timer duration based on compound (90s) vs isolation (60s)
        const restDuration = exercise?.restSeconds || (exercise?.category === 'compound' ? 90 : 60);
        const name = exercise ? (exState.isSwapped ? exercise.alternate.name : exercise.name) : 'Rest Period';
        startRestTimer(restDuration, name);
      }

      return {
        ...prev,
        activeSession: {
          ...currentActive,
          exercises: {
            ...currentActive.exercises,
            [exerciseId]: {
              ...exState,
              sets: newSets,
            },
          },
        },
      };
    });
  };

  const quickAdjustWeight = (exerciseId, setIndex, delta) => {
    setData((prev) => {
      const currentActive = prev.activeSession;
      const exState = currentActive.exercises[exerciseId] || { sets: [], isSwapped: false };
      const newSets = [...(exState.sets || [])];

      if (!newSets[setIndex]) {
        newSets[setIndex] = { setNumber: setIndex + 1, weight: 0, reps: 0, completed: false };
      }

      const currentWeight = Number(newSets[setIndex].weight) || 0;
      const nextWeight = Math.max(0, Number((currentWeight + delta).toFixed(2)));

      newSets[setIndex] = {
        ...newSets[setIndex],
        weight: nextWeight,
      };

      triggerHaptic(20);

      return {
        ...prev,
        activeSession: {
          ...currentActive,
          exercises: {
            ...currentActive.exercises,
            [exerciseId]: {
              ...exState,
              sets: newSets,
            },
          },
        },
      };
    });
  };

  const quickAdjustReps = (exerciseId, setIndex, delta) => {
    setData((prev) => {
      const currentActive = prev.activeSession;
      const exState = currentActive.exercises[exerciseId] || { sets: [], isSwapped: false };
      const newSets = [...(exState.sets || [])];

      if (!newSets[setIndex]) {
        newSets[setIndex] = { setNumber: setIndex + 1, weight: 0, reps: 0, completed: false };
      }

      const currentReps = Number(newSets[setIndex].reps) || 0;
      const nextReps = Math.max(0, currentReps + delta);

      newSets[setIndex] = {
        ...newSets[setIndex],
        reps: nextReps,
      };

      triggerHaptic(20);

      return {
        ...prev,
        activeSession: {
          ...currentActive,
          exercises: {
            ...currentActive.exercises,
            [exerciseId]: {
              ...exState,
              sets: newSets,
            },
          },
        },
      };
    });
  };

  const switchActiveWorkout = (workoutId) => {
    const workoutDef = PPL_PROGRAM.find((w) => w.id === workoutId);
    if (!workoutDef) return;

    setData((prev) => {
      // Find latest completed session for this workout to carry over weights
      const pastSessions = (prev.workoutHistory || []).filter((s) => s.workoutId === workoutId);
      const lastSession = pastSessions[pastSessions.length - 1];

      const initialExercises = {};
      workoutDef.exercises.forEach((ex) => {
        const isSwapped = prev.swappedExercises[ex.id] || false;
        const pastExSets = lastSession?.exercises?.[ex.id]?.sets || [];

        const defaultSets = [];
        for (let i = 0; i < ex.targetSets; i++) {
          const pastSet = pastExSets[i];
          defaultSets.push({
            setNumber: i + 1,
            weight: pastSet ? pastSet.weight : 20,
            reps: pastSet ? pastSet.reps : (ex.repMin || 8),
            completed: false,
          });
        }

        initialExercises[ex.id] = {
          isSwapped,
          sets: defaultSets,
        };
      });

      return {
        ...prev,
        activeSession: {
          workoutId,
          date: new Date().toISOString().split('T')[0],
          isCompleted: false,
          exercises: initialExercises,
        },
      };
    });
  };

  const completeActiveWorkout = () => {
    setData((prev) => {
      const active = prev.activeSession;
      const todayDate = new Date().toISOString().split('T')[0];

      // Calculate how many exercises have at least 1 completed set
      let completedExercisesCount = 0;
      Object.values(active.exercises || {}).forEach((ex) => {
        if (ex.sets?.some((s) => s.completed)) {
          completedExercisesCount++;
        }
      });

      // Non-punitive streak logic:
      // Increment active streak if user records either:
      // a) A completed gym workout session (at least 3 exercises checked)
      // OR b) Hits daily nutrition targets (Calories & Protein within 10%)
      const qualifiesWorkout = completedExercisesCount >= 3;
      const caloriesTarget = biometrics.recomp.targetCalories;
      const proteinTarget = biometrics.macros.protein.grams;

      const caloriesWithin10Pct = Math.abs(prev.user.caloriesToday - caloriesTarget) / caloriesTarget <= 0.1;
      const proteinWithin10Pct = prev.user.proteinToday >= proteinTarget * 0.9;
      const qualifiesNutrition = caloriesWithin10Pct && proteinWithin10Pct;

      const streakShouldIncrement = qualifiesWorkout || qualifiesNutrition;
      const newStreak = streakShouldIncrement ? prev.user.streakDays + 1 : prev.user.streakDays;

      // Add to workout history
      const historyEntry = {
        date: todayDate,
        workoutId: active.workoutId,
        exercises: active.exercises,
      };

      const updatedHistory = [...(prev.workoutHistory || []), historyEntry];

      // Confetti celebration & audio
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#06B6D4', '#F59E0B'],
        });
      } catch (e) {
        // Ignore
      }

      if (!prev.user.audioMuted) {
        playOverloadFanfare();
      }

      return {
        ...prev,
        workoutHistory: updatedHistory,
        user: {
          ...prev.user,
          streakDays: newStreak,
          lastActiveDate: todayDate,
        },
        activeSession: {
          ...active,
          isCompleted: true,
        },
      };
    });
  };

  const toggleSundayTask = (taskId) => {
    setData((prev) => {
      const updatedChecklist = {
        ...prev.sundayChecklist,
        [taskId]: !prev.sundayChecklist[taskId],
      };

      // If all completed, trigger celebration
      const allDone = Object.values(updatedChecklist).every(Boolean);
      if (allDone && !prev.user.audioMuted) {
        playOverloadFanfare();
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#10B981', '#38BDF8', '#F59E0B'],
          });
        } catch {
          // Ignore
        }
      }

      return {
        ...prev,
        sundayChecklist: updatedChecklist,
      };
    });
  };

  const logMeasurement = (newRecord) => {
    setData((prev) => {
      const todayDate = new Date().toISOString().split('T')[0];
      const record = {
        date: todayDate,
        ...newRecord,
      };

      const updatedMeasurements = [...prev.measurements, record];

      // Also update current active user weight and waist
      const updatedUser = {
        ...prev.user,
        weightKg: record.weightKg || prev.user.weightKg,
        waistInches: record.waistInches || prev.user.waistInches,
        waistCm: record.waistCm || prev.user.waistCm,
      };

      return {
        ...prev,
        measurements: updatedMeasurements,
        user: updatedUser,
      };
    });
  };

  const exportDataJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sleeper_build_os_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (fileContent) => {
    try {
      const parsed = JSON.parse(fileContent);
      if (!parsed || !parsed.user || !parsed.workoutHistory) {
        throw new Error('Invalid Sleeper Build OS data structure');
      }
      setData(parsed);
      return { success: true, message: 'Data successfully restored!' };
    } catch (err) {
      return { success: false, message: err.message || 'Failed to import backup file' };
    }
  };

  const resetToInitialData = () => {
    setData(INITIAL_SEED_DATA);
    localStorage.removeItem(STORAGE_KEY);
  };

  const toggleAudio = () => {
    setData((prev) => ({
      ...prev,
      user: { ...prev.user, audioMuted: !prev.user.audioMuted },
    }));
  };

  return (
    <StorageContext.Provider
      value={{
        data,
        biometrics,
        isSunday,
        restTimer,
        diagnosticModal,
        updateBiometrics,
        startRestTimer,
        adjustRestTimer,
        minimizeRestTimer,
        dismissRestTimer,
        openDiagnostic,
        closeDiagnostic,
        swapExercise,
        updateSet,
        toggleSetComplete,
        quickAdjustWeight,
        quickAdjustReps,
        switchActiveWorkout,
        completeActiveWorkout,
        toggleSundayTask,
        logMeasurement,
        exportDataJSON,
        importDataJSON,
        resetToInitialData,
        toggleAudio,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
}
