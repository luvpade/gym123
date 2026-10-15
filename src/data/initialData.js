/**
 * SLEEPER BUILD OS - REALISTIC SEED DATA
 * Pre-populates the 8-week recomp timeline, historical exercise sets with overload triggers,
 * stall diagnostics, and anthropometric scans for immediate aesthetic fidelity on launch.
 */

export const INITIAL_SEED_DATA = {
  version: 2,
  user: {
    sex: 'male',
    age: 26,
    heightCm: 172,
    weightKg: 66.4,
    waistInches: 30.5,
    waistCm: 77.5,
    neckCm: 37.5,
    stepsToday: 9450,
    caloriesToday: 2050,
    proteinToday: 142,
    waterMl: 2250,
    deficit: 250,
    homeHabits: {
      morningWeighIn: true,
      waterGoal: false,
      proteinGoal: true,
      postureReset: false,
      sleepGoal: true
    },
    isWorkoutDay: true,
    streakDays: 18,
    lastActiveDate: '2026-10-15',
    audioMuted: false,
    hapticEnabled: true
  },
  
  // Weekly & Monthly Anthropometric Vault Logs
  measurements: [
    {
      date: '2026-08-20',
      weightKg: 67.4,
      waistInches: 31.8,
      waistCm: 80.8,
      chestCm: 98.4,
      shouldersCm: 118.2,
      leftArmCm: 35.1,
      rightArmCm: 35.3,
      leftThighCm: 54.8,
      rightThighCm: 55.0,
      leftCalfCm: 36.5,
      rightCalfCm: 36.5,
      neckCm: 37.5,
      bodyFatPct: 17.4,
      type: 'monthly_full'
    },
    {
      date: '2026-08-27',
      weightKg: 67.2,
      waistInches: 31.6,
      waistCm: 80.3,
      type: 'weekly_fast'
    },
    {
      date: '2026-09-03',
      weightKg: 67.0,
      waistInches: 31.4,
      waistCm: 79.8,
      type: 'weekly_fast'
    },
    {
      date: '2026-09-10',
      weightKg: 66.9,
      waistInches: 31.2,
      waistCm: 79.2,
      type: 'weekly_fast'
    },
    {
      date: '2026-09-17',
      weightKg: 66.7,
      waistInches: 31.0,
      waistCm: 78.7,
      chestCm: 98.7,
      shouldersCm: 118.6,
      leftArmCm: 35.5,
      rightArmCm: 35.7,
      leftThighCm: 55.1,
      rightThighCm: 55.3,
      leftCalfCm: 36.7,
      rightCalfCm: 36.7,
      neckCm: 37.5,
      bodyFatPct: 16.2,
      type: 'monthly_full'
    },
    {
      date: '2026-09-24',
      weightKg: 66.6,
      waistInches: 30.8,
      waistCm: 78.2,
      type: 'weekly_fast'
    },
    {
      date: '2026-10-01',
      weightKg: 66.5,
      waistInches: 30.7,
      waistCm: 78.0,
      type: 'weekly_fast'
    },
    {
      date: '2026-10-08',
      weightKg: 66.4,
      waistInches: 30.6,
      waistCm: 77.7,
      type: 'weekly_fast'
    },
    {
      date: '2026-10-15',
      weightKg: 66.4,
      waistInches: 30.5,
      waistCm: 77.5,
      chestCm: 99.2,
      shouldersCm: 119.2,
      leftArmCm: 35.8,
      rightArmCm: 36.0,
      leftThighCm: 55.4,
      rightThighCm: 55.6,
      leftCalfCm: 36.8,
      rightCalfCm: 36.8,
      neckCm: 37.5,
      bodyFatPct: 15.3,
      type: 'monthly_full'
    }
  ],

  // Historical workout sessions
  workoutHistory: [
    {
      date: '2026-10-10',
      workoutId: 'push-a',
      exercises: {
        'incline-chest-press': {
          sets: [
            { setNumber: 1, weight: 32.5, reps: 7, completed: true },
            { setNumber: 2, weight: 32.5, reps: 7, completed: true },
            { setNumber: 3, weight: 32.5, reps: 6, completed: true }
          ]
        },
        'overhead-press': {
          sets: [
            { setNumber: 1, weight: 40, reps: 9, completed: true },
            { setNumber: 2, weight: 40, reps: 8, completed: true },
            { setNumber: 3, weight: 40, reps: 8, completed: true }
          ]
        },
        'db-lateral-raises': {
          sets: [
            { setNumber: 1, weight: 10, reps: 15, completed: true },
            { setNumber: 2, weight: 10, reps: 15, completed: true },
            { setNumber: 3, weight: 10, reps: 15, completed: true },
            { setNumber: 4, weight: 10, reps: 15, completed: true }
          ]
        }
      }
    },
    {
      date: '2026-10-13',
      workoutId: 'push-a',
      exercises: {
        'incline-chest-press': {
          sets: [
            { setNumber: 1, weight: 32.5, reps: 7, completed: true },
            { setNumber: 2, weight: 32.5, reps: 7, completed: true },
            { setNumber: 3, weight: 32.5, reps: 6, completed: true }
          ]
        },
        'overhead-press': {
          sets: [
            { setNumber: 1, weight: 42.5, reps: 8, completed: true },
            { setNumber: 2, weight: 42.5, reps: 8, completed: true },
            { setNumber: 3, weight: 42.5, reps: 8, completed: true }
          ]
        },
        'db-lateral-raises': {
          sets: [
            { setNumber: 1, weight: 12.5, reps: 13, completed: true },
            { setNumber: 2, weight: 12.5, reps: 12, completed: true },
            { setNumber: 3, weight: 12.5, reps: 12, completed: true },
            { setNumber: 4, weight: 12.5, reps: 12, completed: true }
          ]
        }
      }
    },
    {
      date: '2026-10-11',
      workoutId: 'pull-a',
      exercises: {
        'assisted-pullup': {
          sets: [
            { setNumber: 1, weight: 20, reps: 8, completed: true },
            { setNumber: 2, weight: 20, reps: 8, completed: true },
            { setNumber: 3, weight: 20, reps: 8, completed: true },
            { setNumber: 4, weight: 20, reps: 8, completed: true }
          ]
        },
        'tbar-row': {
          sets: [
            { setNumber: 1, weight: 45, reps: 9, completed: true },
            { setNumber: 2, weight: 45, reps: 8, completed: true },
            { setNumber: 3, weight: 45, reps: 8, completed: true }
          ]
        }
      }
    },
    {
      date: '2026-10-12',
      workoutId: 'legs-core',
      exercises: {
        'leg-press': {
          sets: [
            { setNumber: 1, weight: 140, reps: 10, completed: true },
            { setNumber: 2, weight: 140, reps: 10, completed: true },
            { setNumber: 3, weight: 140, reps: 10, completed: true }
          ]
        },
        'hamstring-curls': {
          sets: [
            { setNumber: 1, weight: 45, reps: 11, completed: true },
            { setNumber: 2, weight: 45, reps: 10, completed: true },
            { setNumber: 3, weight: 45, reps: 10, completed: true }
          ]
        }
      }
    }
  ],

  // Today's Active Session Working State
  activeSession: {
    workoutId: 'push-a',
    date: '2026-10-15',
    isCompleted: false,
    exercises: {
      'incline-chest-press': {
        isSwapped: false,
        sets: [
          { setNumber: 1, weight: 32.5, reps: 7, completed: false },
          { setNumber: 2, weight: 32.5, reps: 7, completed: false },
          { setNumber: 3, weight: 32.5, reps: 6, completed: false }
        ]
      },
      'overhead-press': {
        isSwapped: false,
        sets: [
          { setNumber: 1, weight: 42.5, reps: 8, completed: false },
          { setNumber: 2, weight: 42.5, reps: 8, completed: false },
          { setNumber: 3, weight: 42.5, reps: 8, completed: false }
        ]
      },
      'cable-crossovers': {
        isSwapped: false,
        sets: [
          { setNumber: 1, weight: 15, reps: 14, completed: false },
          { setNumber: 2, weight: 15, reps: 13, completed: false },
          { setNumber: 3, weight: 15, reps: 12, completed: false }
        ]
      },
      'db-lateral-raises': {
        isSwapped: false,
        sets: [
          { setNumber: 1, weight: 12.5, reps: 14, completed: false },
          { setNumber: 2, weight: 12.5, reps: 13, completed: false },
          { setNumber: 3, weight: 12.5, reps: 13, completed: false },
          { setNumber: 4, weight: 12.5, reps: 12, completed: false }
        ]
      },
      'tricep-pushdown': {
        isSwapped: false,
        sets: [
          { setNumber: 1, weight: 22.5, reps: 12, completed: false },
          { setNumber: 2, weight: 22.5, reps: 11, completed: false },
          { setNumber: 3, weight: 22.5, reps: 10, completed: false }
        ]
      },
      'hanging-leg-raises': {
        isSwapped: false,
        sets: [
          { setNumber: 1, weight: 0, reps: 15, completed: false },
          { setNumber: 2, weight: 0, reps: 14, completed: false },
          { setNumber: 3, weight: 0, reps: 12, completed: false }
        ]
      }
    }
  },

  // Swapped exercises preferences { [exerciseId]: boolean }
  swappedExercises: {},

  // Sunday Recovery Checklist State
  sundayChecklist: {
    steps: true,
    audit: true,
    protein: true,
    posture: false,
    sleep: true
  }
};
