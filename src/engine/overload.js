/**
 * SLEEPER BUILD OS - PROGRESSIVE OVERLOAD ALGORITHM & STALL DIAGNOSTICS
 * Implements double progression protocol, stall detection across consecutive sessions,
 * and lift-specific biomechanical diagnostic drawers.
 */

export const STALL_DIAGNOSTICS = {
  // Key lift-specific biomechanical cues specified in requirements
  'incline-chest-press': {
    title: 'Plate-Loaded Incline Chest Press',
    tip: 'Stall detected. Tip: Lower seat by 1 notch to align the converging trajectory directly with upper clavicular fibers. Focus on a 3-second negative and pause for 0.5s at chest level without touching the stack.',
    focusArea: 'Upper Clavicular Pectoralis Major',
    quickFix: 'Lower seat 1 notch + 0.5s dead-stop at chest'
  },
  'assisted-pullup': {
    title: 'Assisted Pull-Up Machine',
    tip: 'Stall detected. Tip: Emphasize a full dead-hang stretch at the bottom to recruit the teres major and upper lats. Drive elbows down toward your back pockets rather than yanking with forearms.',
    focusArea: 'Teres Major & Latissimus Dorsi Width',
    quickFix: 'Full dead-hang stretch + drive elbows to pockets'
  },
  'tbar-row': {
    title: 'Chest-Supported T-Bar Row',
    tip: 'Stall detected. Tip: Eliminate torso bounce. Glue sternum to pad, set grip slightly wider, and focus on driving elbows behind the ribcage with a 1-second peak squeeze.',
    focusArea: 'Mid-Traps, Rhomboids & Lat Thickness',
    quickFix: 'Sternum glued to pad + 1s isometric contraction'
  },
  'db-lateral-raises': {
    title: 'Standing Dumbbell Lateral Raises',
    tip: 'Stall detected. Tip: Do not swing. Apply a 15° forward torso hinge, lead with elbows (pinkies slightly above thumbs), and hold a 3-second isometric peak on your final rep.',
    focusArea: 'Lateral Deltoid Cap',
    quickFix: '15° torso hinge + lead with elbows + 3s final peak hold'
  },
  'tricep-pushdown': {
    title: 'Cable Tricep Rope Pushdowns',
    tip: 'Stall detected. Tip: Lock elbows tight against ribcage. Flare the rope aggressively apart at your pockets at peak contraction to isolate the lateral tricep sweep.',
    focusArea: 'Lateral & Medial Tricep Head',
    quickFix: 'Lock elbows to ribs + flare rope aggressively at pockets'
  },
  'leg-press': {
    title: '45° Plate-Loaded Leg Press',
    tip: 'Stall detected. Tip: Check foot placement. Set feet shoulder-width in the middle of the footplate to maximize quad tension without lifting your glutes or lumbar off the pad.',
    focusArea: 'Vastus Lateralis & Rectus Femoris (Quad Sweep)',
    quickFix: 'Mid-plate shoulder-width stance + keep lumbar pinned'
  },
  // Additional comprehensive cues for other rotation lifts
  'overhead-press': {
    title: 'Plate-Loaded Overhead Shoulder Press',
    tip: 'Stall detected. Tip: Keep wrists stacked over elbows. Avoid flaring elbows wide; tuck elbows 30° into the scapular plane to transfer maximal force into anterior deltoids.',
    focusArea: 'Anterior & Lateral Deltoid',
    quickFix: '30° scapular tuck + stacked wrists'
  },
  'cable-crossovers': {
    title: 'Low-to-High Cable Crossovers',
    tip: 'Stall detected. Tip: Set pulleys at mid-shin. Scoop upward leading with the inside of your wrists, crossing fists slightly over upper chest for supreme clavicular contraction.',
    focusArea: 'Upper Inner Chest Clavicular Head',
    quickFix: 'Scoop upward + cross wrists at eye-level'
  },
  'vbar-pulldown': {
    title: 'Close-Grip V-Bar Lat Pulldown',
    tip: 'Stall detected. Tip: Lean back only 10-15°. Pull the handle to your lower sternum, depressing your shoulder blades first before bending the elbows.',
    focusArea: 'Lower Lats & Mid-Back Density',
    quickFix: 'Scapular depression first + pull to lower sternum'
  },
  'hamstring-curls': {
    title: 'Hamstring Curls (Lying or Seated)',
    tip: 'Stall detected. Tip: Dorsiflex ankles (pull toes toward shins) to eliminate gastrocnemius assist. Slow the return phase to 3 seconds.',
    focusArea: 'Biceps Femoris & Semitendinosus',
    quickFix: 'Dorsiflex toes + 3s eccentric return'
  },
  'bench-press': {
    title: 'Flat Barbell Bench Press',
    tip: 'Stall detected. Tip: Retract and depress scapulae into the bench. Drive your heels hard into the floor and touch the bar to your lower sternum with tuck at 45°.',
    focusArea: 'Sternal Pectoralis Major',
    quickFix: 'Retract scapulae + 45° elbow tuck + active leg drive'
  },
  'db-row': {
    title: 'One-Arm Dumbbell Row',
    tip: 'Stall detected. Tip: Row the dumbbell in a smooth J-curve toward your hip pocket rather than straight up to your chest. Keeps tension isolated in the lower lat.',
    focusArea: 'Lower Latissimus Dorsi',
    quickFix: 'Row in J-curve back to hip crease'
  },
  'rear-delt-fly': {
    title: 'Pec Deck Rear Delt Fly',
    tip: 'Stall detected. Tip: Use a neutral or pronated grip with elbows softly unlocked. Think of pushing out wide toward the walls rather than pulling straight back.',
    focusArea: 'Posterior Deltoid & Infraspinatus',
    quickFix: 'Push outward toward walls + keep traps relaxed'
  },
  'incline-bicep-curls': {
    title: 'Incline Dumbbell Bicep Curls',
    tip: 'Stall detected. Tip: Keep shoulders pinned back to maximize long-head stretch at the bottom. Supinate hard at top (turn pinkies up).',
    focusArea: 'Bicep Long Head (Peak)',
    quickFix: 'Max stretch at bottom + hard supination at apex'
  },
  'cable-crunches': {
    title: 'Cable Rope Kneeling Crunches',
    tip: 'Stall detected. Tip: Lock hips in place; do not sit back on your heels. Curl your ribcage toward your pelvis like rolling up a poster.',
    focusArea: 'Rectus Abdominis Compression',
    quickFix: 'Fix hip angle + curl ribcage down to pelvis'
  }
};

/**
 * Calculates Estimated 1RM using Brzycki & Epley formulas
 */
export function calculate1RM(weightKg, reps) {
  if (!weightKg || !reps) return 0;
  if (reps === 1) return weightKg;
  
  // Brzycki formula
  const brzycki = weightKg / (1.0278 - (0.0278 * Math.min(reps, 15)));
  // Epley formula
  const epley = weightKg * (1 + (reps / 30));
  
  // Hybrid average
  const hybrid = (brzycki + epley) / 2;
  return Number(hybrid.toFixed(1));
}

/**
 * Evaluates Double Progression Protocol for an active workout exercise
 * @param {Object} exercise - Exercise definition
 * @param {Array} loggedSets - Array of { weight, reps, completed }
 * @returns {Object} status analysis
 */
export function evaluateDoubleProgression(exercise, loggedSets) {
  if (!loggedSets || loggedSets.length === 0) {
    return {
      status: 'idle',
      badge: 'READY',
      text: `Target: ${exercise.targetSets} sets × ${exercise.targetReps}`,
      color: 'slate'
    };
  }

  const completedSets = loggedSets.filter(s => s && s.completed && s.reps > 0);
  if (completedSets.length === 0) {
    return {
      status: 'idle',
      badge: 'READY',
      text: `Target: ${exercise.targetSets} sets × ${exercise.targetReps}`,
      color: 'slate'
    };
  }

  const isCompound = exercise.category === 'compound' || exercise.repMax <= 8;
  const targetMin = exercise.repMin || (isCompound ? 6 : 10);
  const targetMax = exercise.repMax || (isCompound ? 8 : 12);
  const targetSetsCount = exercise.targetSets || 3;

  const allCompleted = completedSets.length >= targetSetsCount;
  const allHitMax = allCompleted && completedSets.every(s => Number(s.reps) >= targetMax);
  const allHitMin = completedSets.every(s => Number(s.reps) >= targetMin);
  const anyDroppedBelow = completedSets.some(s => Number(s.reps) < targetMin);

  if (isCompound) {
    if (allHitMax) {
      return {
        status: 'overload',
        badge: '🔥 OVERLOAD READY',
        text: 'You peaked the rep target! Next session, increase load by +2.5 kg (or +1 machine pin).',
        recommendation: '+2.5 kg load increase',
        color: 'emerald'
      };
    }
    if (allHitMin && allCompleted) {
      return {
        status: 'bracket',
        badge: '🎯 TARGET BRACKET',
        text: 'Target rep bracket maintained. Push for +1 extra rep at this exact weight next session.',
        recommendation: '+1 rep push',
        color: 'cyan'
      };
    }
    if (anyDroppedBelow) {
      return {
        status: 'drop',
        badge: '⚠️ REP DROP DETECTED',
        text: 'Rep drop detected. Hold weight steady; check sleep, hydration, and nutrition before next attempt.',
        recommendation: 'Hold weight steady',
        color: 'amber'
      };
    }
    return {
      status: 'in-progress',
      badge: 'IN PROGRESS',
      text: `${completedSets.length}/${targetSetsCount} sets logged. Focus on smooth 3-second eccentrics.`,
      color: 'slate'
    };
  } else {
    // Isolation Lift Protocol
    if (allHitMax) {
      return {
        status: 'overload',
        badge: '⚡ LOAD UP',
        text: 'Increment by +1.25 kg to +2.5 kg, or add a 2-second isometric peak squeeze.',
        recommendation: '+1.25 kg / peak pause',
        color: 'emerald'
      };
    }
    if (allHitMin && allCompleted) {
      return {
        status: 'bracket',
        badge: '🎯 TARGET BRACKET',
        text: 'Target bracket maintained. Emphasize peak contraction and controlled negatives.',
        recommendation: '+1 rep / mind-muscle squeeze',
        color: 'cyan'
      };
    }
    if (anyDroppedBelow) {
      return {
        status: 'drop',
        badge: '⚠️ REP DROP DETECTED',
        text: 'Rep drop detected. Hold weight steady; prioritize mechanical tension over momentum.',
        recommendation: 'Hold weight steady',
        color: 'amber'
      };
    }
    return {
      status: 'in-progress',
      badge: 'IN PROGRESS',
      text: `${completedSets.length}/${targetSetsCount} sets logged. Keep form crisp.`,
      color: 'slate'
    };
  }
}

/**
 * Checks if an exercise has stalled across the last 2 consecutive sessions
 * @param {string} exerciseId
 * @param {Array} sessionHistory - Array of past session logs containing this exercise
 * @returns {Object} { isStalled: boolean, diagnostic: Object | null }
 */
export function checkStallCondition(exerciseId, sessionHistory = []) {
  if (!sessionHistory || sessionHistory.length < 2) {
    return { isStalled: false, diagnostic: null };
  }

  // Get the last 2 sessions that contain logs for this exercise
  const exerciseSessions = sessionHistory
    .filter(session => session.exercises && session.exercises[exerciseId])
    .slice(-2);

  if (exerciseSessions.length < 2) {
    return { isStalled: false, diagnostic: null };
  }

  const [prevSession, latestSession] = exerciseSessions;
  const prevSets = prevSession.exercises[exerciseId].sets || [];
  const latestSets = latestSession.exercises[exerciseId].sets || [];

  if (prevSets.length === 0 || latestSets.length === 0) {
    return { isStalled: false, diagnostic: null };
  }

  // Compute total volume load (weight * reps) or top set load
  const prevMaxWeight = Math.max(...prevSets.map(s => Number(s.weight) || 0));
  const latestMaxWeight = Math.max(...latestSets.map(s => Number(s.weight) || 0));

  const prevMaxReps = Math.max(...prevSets.map(s => Number(s.reps) || 0));
  const latestMaxReps = Math.max(...latestSets.map(s => Number(s.reps) || 0));

  // Stalled if latest max weight didn't increase AND latest max reps didn't increase
  const weightStalledOrDropped = latestMaxWeight <= prevMaxWeight;
  const repsStalledOrDropped = latestMaxReps <= prevMaxReps;

  const isStalled = weightStalledOrDropped && repsStalledOrDropped;

  const diagnostic = STALL_DIAGNOSTICS[exerciseId] || {
    title: 'Exercise Diagnostics',
    tip: 'Stall detected. Tip: Emphasize a controlled 3-second eccentric phase, eliminate momentum, and ensure 90-120s rest between sets.',
    focusArea: 'Mechanical Tension & Motor Unit Recruitment',
    quickFix: 'Tempo control + extend rest window'
  };

  return {
    isStalled,
    diagnostic: isStalled ? diagnostic : null,
    prevStats: { weight: prevMaxWeight, reps: prevMaxReps },
    latestStats: { weight: latestMaxWeight, reps: latestMaxReps }
  };
}
