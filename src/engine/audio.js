/**
 * SLEEPER BUILD OS - SYNTHETIC AUDIO & HAPTIC VIBRATION ENGINE
 * Zero external audio files. Pure Web Audio API synthesis with harmonic overtones
 * and mobile hardware haptic feedback.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Triggers hardware haptic vibration if supported
 * @param {number|number[]} pattern
 */
export function triggerHaptic(pattern = [100, 50, 100]) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Graceful fallback if unsupported
  }
}

/**
 * Plays a rich, futuristic metallic chime for timer completion
 */
export function playTimerCompleteSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    triggerHaptic([120, 60, 150, 60, 200]);

    const now = ctx.currentTime;
    
    // 3-tone harmonic arpeggio: C5 (523.25 Hz) -> E5 (659.25 Hz) -> G5 (783.99 Hz)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = idx === 3 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + (idx * 0.08));
      
      gain.gain.setValueAtTime(0, now + (idx * 0.08));
      gain.gain.linearRampToValueAtTime(0.18, now + (idx * 0.08) + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx * 0.08) + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + (idx * 0.08));
      osc.stop(now + (idx * 0.08) + 1.25);
    });
  } catch (err) {
    console.warn('Audio playback prevented by browser policy:', err);
  }
}

/**
 * Plays subtle countdown warning tick (e.g., 3s, 2s, 1s remaining)
 */
export function playCountdownTick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    triggerHaptic(30);

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5 pitch

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch {
    // Ignore audio restriction
  }
}

/**
 * Plays set completion affirmation tone
 */
export function playSetCompleteSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    triggerHaptic([60, 40, 60]);

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  } catch {
    // Ignore
  }
}

/**
 * Plays overload unlocked triumphant chord
 */
export function playOverloadFanfare() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    triggerHaptic([100, 50, 100, 50, 250]);

    const now = ctx.currentTime;
    const chords = [587.33, 739.99, 880.0, 1174.66]; // D Major

    chords.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.95);
    });
  } catch {
    // Ignore
  }
}
