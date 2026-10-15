/**
 * SLEEPER BUILD OS - AUTONOMOUS PHYSIOLOGICAL & METABOLIC ALGORITHM ENGINE
 * Implements US Navy Body Fat estimation, Katch-McArdle Dynamic BMR,
 * Real-time TDEE step boost & training surplus, clamped Recomposition caloric targeting,
 * and peri-workout macronutrient partitioning.
 */

export const DEFAULT_BIOMETRICS = {
  sex: 'male',
  age: 26,
  heightCm: 172,
  weightKg: 66.4,
  waistInches: 30.5,
  neckCm: 37.5,
  steps: 9200,
  isWorkoutDay: true,
};

/**
 * Calculates Body Fat % via US Navy Anthropometric Formula
 * Male formula: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
 * @param {Object} params
 * @param {number} params.heightCm
 * @param {number} params.waistCm
 * @param {number} [params.neckCm=37.5]
 * @returns {number} Body fat percentage (1 decimal place)
 */
export function calculateBodyFatPct({ heightCm, waistCm, neckCm = 37.5 }) {
  const safeWaist = Math.max(waistCm, 50);
  const safeNeck = Math.min(Math.max(neckCm || 37.5, 25), safeWaist - 5);
  const diff = Math.max(safeWaist - safeNeck, 10);
  
  // log10
  const logWaistNeck = Math.log10(diff);
  const logHeight = Math.log10(heightCm);
  
  const denom = 1.0324 - (0.19077 * logWaistNeck) + (0.15456 * logHeight);
  if (denom <= 0) return 15.0; // fallback safe
  
  let bf = (495 / denom) - 450;
  // clamp to humanly sensible recomp range (6% - 40%)
  bf = Math.max(6.0, Math.min(38.0, bf));
  return Number(bf.toFixed(1));
}

/**
 * Converts inches to centimeters
 */
export function inchesToCm(inches) {
  return Number((inches * 2.54).toFixed(2));
}

/**
 * Converts centimeters to inches
 */
export function cmToInches(cm) {
  return Number((cm / 2.54).toFixed(1));
}

/**
 * Lean Body Mass (LBM) in kg
 * LBM = Weight * (1 - (BF% / 100))
 */
export function calculateLeanBodyMass(weightKg, bodyFatPct) {
  const lbm = weightKg * (1 - (bodyFatPct / 100));
  return Number(lbm.toFixed(1));
}

/**
 * Dynamic BMR via Katch-McArdle formula:
 * BMR = 370 + (21.6 * LBM in kg)
 */
export function calculateBMR(lbmKg) {
  const bmr = 370 + (21.6 * lbmKg);
  return Math.round(bmr);
}

/**
 * Mifflin-St Jeor BMR for Male:
 * 10 * weight + 6.25 * height - 5 * age + 5
 */
export function calculateMifflinStJeor(weightKg, heightCm, age = 26) {
  return Math.round((10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5);
}

/**
 * Dynamic TDEE based on BMR, daily step tier, and workout surplus
 * Baseline: BMR * 1.2
 * Active Step Boost: + (Logged Steps * 0.04 kcal)
 * Workout Day Surplus Burn: + 280 kcal
 */
export function calculateTDEE({ bmr, steps = 8000, isWorkoutDay = true }) {
  const baseline = bmr * 1.2;
  const stepBoost = (steps || 0) * 0.04;
  const workoutSurplus = isWorkoutDay ? 280 : 0;
  const totalTDEE = baseline + stepBoost + workoutSurplus;
  
  return {
    baseline: Math.round(baseline),
    stepBoost: Math.round(stepBoost),
    workoutSurplus,
    totalTDEE: Math.round(totalTDEE)
  };
}

/**
 * Recomposition Caloric Target:
 * Dynamically computed as Target TDEE - 250 kcal (clamped to safe 1,950 - 2,150 kcal range)
 */
export function calculateRecompTarget(tdee) {
  const rawTarget = tdee - 250;
  const clampedTarget = Math.max(1950, Math.min(2150, Math.round(rawTarget)));
  return {
    rawTarget: Math.round(rawTarget),
    targetCalories: clampedTarget,
    isClamped: rawTarget < 1950 || rawTarget > 2150,
    deficit: 250
  };
}

/**
 * Macro Allocation Engine:
 * - Protein: Non-negotiable 2.1g per kg of total body mass
 * - Dietary Fats: 0.85g per kg for endocrine & androgenic optimization
 * - Carbohydrates: Remaining caloric budget allocated to complex carbs
 * - Peri-workout Carbs: 60% clustered around training window
 */
export function calculateMacros(weightKg, targetCalories) {
  // Protein: 2.1g/kg
  const proteinGrams = Math.round(weightKg * 2.1);
  const proteinKcal = proteinGrams * 4;
  
  // Fats: 0.85g/kg
  const fatGrams = Math.round(weightKg * 0.85);
  const fatKcal = fatGrams * 9;
  
  // Remaining kcal to carbs
  const carbKcal = Math.max(0, targetCalories - proteinKcal - fatKcal);
  const carbGrams = Math.round(carbKcal / 4);
  
  // Peri-workout breakdown (60% around workout)
  const periWorkoutCarbs = Math.round(carbGrams * 0.60);
  const restOfDayCarbs = Math.max(0, carbGrams - periWorkoutCarbs);
  
  return {
    calories: targetCalories,
    protein: {
      grams: proteinGrams,
      kcal: proteinKcal,
      pct: Math.round((proteinKcal / targetCalories) * 100),
      multiplier: 2.1
    },
    fats: {
      grams: fatGrams,
      kcal: fatKcal,
      pct: Math.round((fatKcal / targetCalories) * 100),
      multiplier: 0.85
    },
    carbs: {
      grams: carbGrams,
      kcal: carbKcal,
      pct: Math.round((carbKcal / targetCalories) * 100),
      periWorkoutGrams: periWorkoutCarbs,
      restOfDayGrams: restOfDayCarbs,
      periPct: 60
    }
  };
}

/**
 * Composite function running full real-time biometric audit
 */
export function runBiometricAudit(input = DEFAULT_BIOMETRICS) {
  const waistCm = input.waistCm || inchesToCm(input.waistInches || 30.5);
  const waistInches = input.waistInches || cmToInches(waistCm);
  const neckCm = input.neckCm || 37.5;
  const heightCm = input.heightCm || 172;
  const weightKg = input.weightKg || 66.4;
  const steps = input.steps || 9000;
  const isWorkoutDay = input.isWorkoutDay !== undefined ? input.isWorkoutDay : true;
  
  const bodyFatPct = calculateBodyFatPct({ heightCm, waistCm, neckCm });
  const lbmKg = calculateLeanBodyMass(weightKg, bodyFatPct);
  const fatMassKg = Number((weightKg - lbmKg).toFixed(1));
  const bmrKatch = calculateBMR(lbmKg);
  const bmrMifflin = calculateMifflinStJeor(weightKg, heightCm, input.age || 26);
  const tdeeBreakdown = calculateTDEE({ bmr: bmrKatch, steps, isWorkoutDay });
  const recomp = calculateRecompTarget(tdeeBreakdown.totalTDEE);
  const macros = calculateMacros(weightKg, recomp.targetCalories);
  
  return {
    inputs: {
      ...input,
      waistCm,
      waistInches,
      neckCm,
      heightCm,
      weightKg
    },
    bodyFatPct,
    lbmKg,
    fatMassKg,
    bmr: bmrKatch,
    bmrMifflin,
    tdee: tdeeBreakdown,
    recomp,
    macros
  };
}
