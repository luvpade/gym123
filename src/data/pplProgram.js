/**
 * SLEEPER BUILD OS - 6-MONTH PPL ROTATION
 * Streamlined, gym-accurate 5-day rotation with seamless swap alternates,
 * exact rep brackets, rest timer configs, and biomechanical focus targets.
 */

export const PPL_PROGRAM = [
  {
    id: 'push-a',
    code: 'PUSH A',
    title: 'Clavicular Chest Shelf & 3D Deltoid Width',
    subtitle: 'Upper pectoralis emphasis & lateral delt capping',
    focus: 'Clavicular Pecs, Lateral Deltoids, Tricep Lateral Head',
    dayIndex: 1, // Mon
    color: '#10B981',
    exercises: [
      {
        id: 'incline-chest-press',
        name: 'Plate-Loaded Incline Chest Press',
        targetSets: 3,
        targetReps: '6-8 reps',
        repMin: 6,
        repMax: 8,
        category: 'compound',
        restSeconds: 90,
        loadType: 'per-side',
        loadLabel: 'Per Side',
        loadNote: 'Weight loaded on each horn (e.g. 32.5 kg/side = 65 kg total plates)',
        muscle: 'Upper Chest (Clavicular)',
        alternate: {
          name: 'Incline Dumbbell Bench Press',
          notes: 'Set bench to 30° incline. Drive dumbbells slightly inward at apex without clanking.'
        },
        cue: 'Converging path to upper clavicle. 3s negative, 0.5s dead-stop at bottom.'
      },
      {
        id: 'overhead-press',
        name: 'Plate-Loaded Overhead Shoulder Press',
        targetSets: 3,
        targetReps: '8-10 reps',
        repMin: 8,
        repMax: 10,
        category: 'compound',
        restSeconds: 90,
        loadType: 'per-side',
        loadLabel: 'Per Side',
        loadNote: 'Weight loaded on each horn (e.g. 42.5 kg/side = 85 kg total plates)',
        muscle: 'Anterior & Side Delts',
        alternate: {
          name: 'Seated Dumbbell Shoulder Press',
          notes: 'Keep elbows tucked at 30° in front of the coronal plane.'
        },
        cue: 'Stack wrists over elbows. Press in scapular plane without arching lumbar.'
      },
      {
        id: 'cable-crossovers',
        name: 'Low-to-High Cable Crossovers',
        targetSets: 3,
        targetReps: '12-15 reps',
        repMin: 12,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Upper Inner Chest',
        alternate: {
          name: 'Incline Cable Flys',
          notes: 'Low pulley bench setup focusing on deep clavicular peak contraction.'
        },
        cue: 'Scoop upward from mid-shin to chin level; cross hands for 1s squeeze.'
      },
      {
        id: 'db-lateral-raises',
        name: 'Standing Dumbbell Lateral Raises',
        targetSets: 4,
        targetReps: '12-15 reps',
        repMin: 12,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Lateral Deltoids',
        alternate: {
          name: 'Single-Arm Cable Lateral Raise',
          notes: 'Set pulley to wrist height, lean away 10° for constant tension.'
        },
        cue: '15° torso hinge, lead with elbows, 3s isometric hold on the final rep.'
      },
      {
        id: 'tricep-pushdown',
        name: 'Cable Tricep Rope Pushdowns',
        targetSets: 3,
        targetReps: '10-12 reps',
        repMin: 10,
        repMax: 12,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Lateral Tricep Sweep',
        alternate: {
          name: 'EZ-Bar Tricep Pushdown',
          notes: 'Keep elbows pinned to ribs, drive downward through palms.'
        },
        cue: 'Lock elbows against ribs; aggressively flare rope apart at your pockets.'
      },
      {
        id: 'hanging-leg-raises',
        name: 'Hanging Knee / Leg Raises',
        targetSets: 3,
        targetReps: '12-15 reps',
        repMin: 12,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Lower Rectus Abdominis',
        alternate: {
          name: 'Roman Chair Leg Raises',
          notes: 'Supported forearm position, curl pelvis upward toward chest.'
        },
        cue: 'Do not swing. Posteriorly tilt pelvis to curl knees up to sternum.'
      }
    ]
  },
  {
    id: 'pull-a',
    code: 'PULL A',
    title: 'Lat Width & V-Taper Expansion',
    subtitle: 'Upper back width, lower lat stretch & rear delts',
    focus: 'Lats, Teres Major, Upper Back, Biceps',
    dayIndex: 2, // Tue
    color: '#06B6D4',
    exercises: [
      {
        id: 'assisted-pullup',
        name: 'Assisted Pull-Up Machine',
        targetSets: 4,
        targetReps: '6-8 reps',
        repMin: 6,
        repMax: 8,
        category: 'compound',
        restSeconds: 90,
        muscle: 'Lats & Teres Major',
        alternate: {
          name: 'Wide-Grip Lat Pulldown',
          notes: 'Pull to collarbone while driving elbows straight down.'
        },
        cue: 'Full dead-hang stretch at bottom. Drive elbows down toward back pockets.'
      },
      {
        id: 'tbar-row',
        name: 'Chest-Supported T-Bar Row',
        targetSets: 3,
        targetReps: '8-10 reps',
        repMin: 8,
        repMax: 10,
        category: 'compound',
        restSeconds: 90,
        muscle: 'Mid-Back & Rhomboids',
        alternate: {
          name: 'Incline Dumbbell Row',
          notes: 'Lie prone on 30° incline bench; row dumbbells with neutral palms.'
        },
        cue: 'Sternum glued to pad, eliminate bounce. Drive elbows behind ribcage.'
      },
      {
        id: 'neutral-pulldown',
        name: 'Single-Arm Neutral Cable Pulldown',
        targetSets: 3,
        targetReps: '10-12 reps',
        repMin: 10,
        repMax: 12,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Lower Lat Origin',
        alternate: {
          name: 'Close-Grip V-Bar Pulldown',
          notes: 'Drive elbows into hips with slight torso lean.'
        },
        cue: 'Slight lateral crunch as you drive single elbow straight into hip iliac crest.'
      },
      {
        id: 'face-pulls',
        name: 'Cable Face Pulls (High Pulley)',
        targetSets: 3,
        targetReps: '15 reps',
        repMin: 15,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Rear Delts & Rotator Cuff',
        alternate: {
          name: 'Reverse Pec Deck Fly',
          notes: 'Seat adjusted so handles align at nose level.'
        },
        cue: 'Rope to eye-level; externally rotate forearms like a double bicep pose.'
      },
      {
        id: 'incline-bicep-curls',
        name: 'Incline Dumbbell Bicep Curls',
        targetSets: 3,
        targetReps: '10-12 reps',
        repMin: 10,
        repMax: 12,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Bicep Long Head',
        alternate: {
          name: 'Cable Rope Hammer Curls',
          notes: 'Keep thumbs up for brachialis and brachioradialis development.'
        },
        cue: 'Max stretch at bottom; supinate hard at peak contraction.'
      },
      {
        id: 'cable-woodchoppers',
        name: 'Cable Woodchoppers (High-to-Low)',
        targetSets: 3,
        targetReps: '15 reps/side',
        repMin: 15,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Internal & External Obliques',
        alternate: {
          name: 'Hanging Oblique Raises',
          notes: 'Twist knees toward armpits to target lateral trunk stabilizers.'
        },
        cue: 'Pivot rear foot; rotate forcefully through core rather than arms.'
      }
    ]
  },
  {
    id: 'legs-core',
    code: 'LEGS & CORE',
    title: 'Athletic Base & Midsection Compression',
    subtitle: 'Quad sweep, posterior chain & core bracing',
    focus: 'Quadriceps, Hamstrings, Calves, Deep Core',
    dayIndex: 3, // Wed
    color: '#F59E0B',
    exercises: [
      {
        id: 'leg-press',
        name: '45° Plate-Loaded Leg Press',
        targetSets: 3,
        targetReps: '8-10 reps',
        repMin: 8,
        repMax: 10,
        category: 'compound',
        restSeconds: 90,
        muscle: 'Quadriceps & Glute Base',
        alternate: {
          name: 'Smith Machine Squat',
          notes: 'Feet slightly forward to maximize knee flexion and quad tension.'
        },
        cue: 'Shoulder-width mid-plate stance. Lower deep without lumbar lifting off pad.'
      },
      {
        id: 'hamstring-curls',
        name: 'Hamstring Curls (Lying or Seated)',
        targetSets: 3,
        targetReps: '10-12 reps',
        repMin: 10,
        repMax: 12,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Biceps Femoris & Semitendinosus',
        alternate: {
          name: 'Dumbbell Romanian Deadlift',
          notes: 'Hinge hips backwards, keep dumbbells skimming your shins.'
        },
        cue: 'Dorsiflex ankles (pull toes to shins). 3-second negative descent.'
      },
      {
        id: 'leg-extensions',
        name: 'Leg Extensions',
        targetSets: 3,
        targetReps: '12-15 reps',
        repMin: 12,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Rectus Femoris (Quad Teardrop)',
        alternate: {
          name: 'Sissy Squats',
          notes: 'Bodyweight or plate held at chest with extreme quad stretch.'
        },
        cue: 'Hold a 1s peak squeeze at the top of every rep; do not kick with hips.'
      },
      {
        id: 'calf-raises',
        name: 'Standing Calf Raises',
        targetSets: 4,
        targetReps: '15 reps',
        repMin: 15,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Gastrocnemius',
        alternate: {
          name: 'Seated Calf Machine',
          notes: 'Targets soleus with bent-knee position.'
        },
        cue: '2s deep stretch at bottom, drive through big toes, 1s peak contraction.'
      },
      {
        id: 'cable-crunches',
        name: 'Cable Rope Kneeling Crunches',
        targetSets: 3,
        targetReps: '12-15 reps',
        repMin: 12,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Upper & Middle Abdominals',
        alternate: {
          name: 'Decline Weighted Crunches',
          notes: 'Hold plate at collarbone, roll spinal column smoothly.'
        },
        cue: 'Lock hips in space; round upper spine and curl ribcage into pelvis.'
      },
      {
        id: 'captains-chair',
        name: "Captain's Chair Leg Raises",
        targetSets: 3,
        targetReps: '15 reps',
        repMin: 15,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Lower Abdominals & Hip Flexors',
        alternate: {
          name: 'Lying Reverse Crunches',
          notes: 'Keep hands on floor, roll pelvis off mat toward ceiling.'
        },
        cue: 'Posterior pelvic tuck. Raise knees past waist level to fully engage lower abs.'
      }
    ]
  },
  {
    id: 'push-b',
    code: 'PUSH B',
    title: 'Torso Density & Lateral Delt Capping',
    subtitle: 'Horizontal chest pressing, side delt volume & tricep stretch',
    focus: 'Sternal Pectorals, Clavicular Shelf, Tricep Long Head',
    dayIndex: 4, // Thu
    color: '#10B981',
    exercises: [
      {
        id: 'bench-press',
        name: 'Flat Barbell Bench Press',
        targetSets: 3,
        targetReps: '6-8 reps',
        repMin: 6,
        repMax: 8,
        category: 'compound',
        restSeconds: 90,
        muscle: 'Sternal Pectoralis Major',
        alternate: {
          name: 'Flat Machine Chest Press',
          notes: 'Lock back into pad, drive handles with continuous tension.'
        },
        cue: 'Retract scapulae into bench, touch lower sternum with 45° elbow tuck.'
      },
      {
        id: 'incline-chest-press-b',
        name: 'Plate-Loaded Incline Chest Press',
        targetSets: 3,
        targetReps: '8-10 reps',
        repMin: 8,
        repMax: 10,
        category: 'compound',
        restSeconds: 90,
        loadType: 'per-side',
        loadLabel: 'Per Side',
        loadNote: 'Weight loaded on each horn (e.g. 32.5 kg/side = 65 kg total plates)',
        muscle: 'Clavicular Pecs',
        alternate: {
          name: 'Low-Incline Dumbbell Press',
          notes: '15-20° bench angle for balanced upper-chest stimulation.'
        },
        cue: 'Lower weight with 3s tempo, explode through heels and palms.'
      },
      {
        id: 'db-lateral-raises-b',
        name: 'Standing Dumbbell Lateral Raises',
        targetSets: 4,
        targetReps: '12-15 reps',
        repMin: 12,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Lateral Deltoids',
        alternate: {
          name: 'Cable Lateral Raises',
          notes: 'Cross cables behind back for a continuous strength curve.'
        },
        cue: 'Pinkies slightly higher than thumbs. Zero torso bounce.'
      },
      {
        id: 'pec-deck-fly',
        name: 'Pec Deck Fly Machine',
        targetSets: 3,
        targetReps: '12-15 reps',
        repMin: 12,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Inner Chest Squeeze',
        alternate: {
          name: 'Cable Flat Bench Flys',
          notes: 'Deep pec stretch without overextending anterior shoulder capsule.'
        },
        cue: 'Elbows slightly bent, bring pads together and flex inner chest for 1 full second.'
      },
      {
        id: 'overhead-tricep-ext',
        name: 'Overhead Cable Rope Tricep Extension',
        targetSets: 3,
        targetReps: '10-12 reps',
        repMin: 10,
        repMax: 12,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Tricep Long Head (Bulk)',
        alternate: {
          name: 'Incline DB Tricep Extension',
          notes: 'Lie on 45° incline bench, drop dumbbells behind head.'
        },
        cue: 'Maintain shoulder flexion to put long head on maximum stretch; spread rope at apex.'
      },
      {
        id: 'kneeling-crunches',
        name: 'Kneeling Cable Crunches',
        targetSets: 3,
        targetReps: '15 reps',
        repMin: 15,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Rectus Abdominis',
        alternate: {
          name: 'Hanging Knee Raises',
          notes: 'Hang from pull-up bar, draw knees to chest.'
        },
        cue: 'Keep glutes locked near thighs. Flex spine like a rolling wheel.'
      }
    ]
  },
  {
    id: 'pull-b',
    code: 'PULL B',
    title: 'Upper Back Thickness & Arm Sweep',
    subtitle: 'Vertical pull, heavy single-arm row & bicep peak',
    focus: 'Mid-Back Thickness, Rear Delts, Biceps & Brachialis',
    dayIndex: 5, // Fri
    color: '#06B6D4',
    exercises: [
      {
        id: 'vbar-pulldown',
        name: 'Close-Grip V-Bar Lat Pulldown',
        targetSets: 3,
        targetReps: '8-10 reps',
        repMin: 8,
        repMax: 10,
        category: 'compound',
        restSeconds: 90,
        muscle: 'Lower Latissimus Dorsi',
        alternate: {
          name: 'Neutral-Grip Assisted Pull-Up',
          notes: 'Slight hollow body position, pull until chin clears palms.'
        },
        cue: 'Lean back 10-15°, depress shoulder blades, drive elbows into side ribcage.'
      },
      {
        id: 'db-row',
        name: 'One-Arm Dumbbell Row',
        targetSets: 3,
        targetReps: '8-10 reps/side',
        repMin: 8,
        repMax: 10,
        category: 'compound',
        restSeconds: 90,
        muscle: 'Lat Thickness & Spinal Erectors',
        alternate: {
          name: 'Seated Cable Row',
          notes: 'Neutral handle, pull straight to navel without hyperextending lower back.'
        },
        cue: 'Pull in a sweeping J-curve back to the hip crease. Do not shrug traps.'
      },
      {
        id: 'rear-delt-fly',
        name: 'Pec Deck Rear Delt Fly',
        targetSets: 3,
        targetReps: '15 reps',
        repMin: 15,
        repMax: 15,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Posterior Deltoids',
        alternate: {
          name: 'Bent-Over Dumbbell Fly',
          notes: 'Hinge forward 45°, lead with elbows.'
        },
        cue: 'Neutral grip with soft elbow bend. Push out wide toward perimeter walls.'
      },
      {
        id: 'ez-bar-curls',
        name: 'Standing EZ-Bar / Cable Bicep Curls',
        targetSets: 3,
        targetReps: '8-10 reps',
        repMin: 8,
        repMax: 10,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Biceps Brachii',
        alternate: {
          name: 'Dumbbell Alternating Curls',
          notes: 'Supinate palm as dumbbell passes knee height.'
        },
        cue: 'Elbows pinned to sides. Full extension at bottom, squeeze bicep hard at top.'
      },
      {
        id: 'hammer-curls',
        name: 'Cross-Body Dumbbell Hammer Curls',
        targetSets: 3,
        targetReps: '10-12 reps',
        repMin: 10,
        repMax: 12,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Brachialis & Forearm Brachioradialis',
        alternate: {
          name: 'Cable Rope Hammer Curls',
          notes: 'Constant cable tension throughout range.'
        },
        cue: 'Curl dumbbell across torso toward opposite shoulder to push the bicep peak upward.'
      },
      {
        id: 'angled-knee-raises',
        name: 'Hanging Angled Knee Raises',
        targetSets: 3,
        targetReps: '12 reps',
        repMin: 12,
        repMax: 12,
        category: 'isolation',
        restSeconds: 60,
        muscle: 'Obliques & Serratus Anterior',
        alternate: {
          name: 'Bicycle Crunches',
          notes: 'Slow 2s rotational tempo, touch elbow to opposite knee.'
        },
        cue: 'Alternate rotating knees toward left and right armpits for lateral core compression.'
      }
    ]
  }
];

export const SUNDAY_RECOVERY_PROTOCOL = [
  {
    id: 'steps',
    title: 'Active Step Recharge',
    description: '8,000–10,000 steps walked at conversational pace for lymphatic drainage & active recovery.',
    target: '8,000 - 10,000 steps',
    icon: 'Footprints'
  },
  {
    id: 'audit',
    title: 'Fasted Biometric Audit',
    description: 'Empty-stomach morning weight and navel waist circumference logged in the Measurement Vault.',
    target: 'Logged in Vault',
    icon: 'Ruler'
  },
  {
    id: 'protein',
    title: 'Anabolic Tissue Repair',
    description: '140g protein non-negotiable target hit to sustain positive nitrogen balance and muscular protein synthesis.',
    target: '≥ 140g Protein',
    icon: 'Beef'
  },
  {
    id: 'posture',
    title: 'Posture & Thoracic Reset',
    description: '10 minutes of doorway pec stretches, wall chin-tucks, and dead-hang decompression to reset spinal alignment.',
    target: '10 mins decompression',
    icon: 'Activity'
  },
  {
    id: 'sleep',
    title: 'Sleep Target',
    description: '8 hours of uninterrupted deep restorative sleep logged for maximal growth hormone secretion.',
    target: '8 hours sleep',
    icon: 'Moon'
  }
];
