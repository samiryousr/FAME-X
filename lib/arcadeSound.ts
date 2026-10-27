// 8-bit Retro Arcade Sound Synthesizer via Web Audio API (100% Native - بدون أي ملفات خارجية)

let audioCtx: AudioContext | null = null;
let isMuted = false;
let currentMusicGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopArcadeMusic() {
  if (currentMusicGain) {
    try {
      const now = audioCtx?.currentTime || 0;
      currentMusicGain.gain.setValueAtTime(currentMusicGain.gain.value, now);
      currentMusicGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
      setTimeout(() => {
        try {
          currentMusicGain?.disconnect();
        } catch {
          // ignore
        }
        currentMusicGain = null;
      }, 60);
    } catch {
      currentMusicGain = null;
    }
  }
}

export function toggleArcadeMute(): boolean {
  isMuted = !isMuted;
  if (isMuted) {
    stopArcadeMusic();
  }
  return isMuted;
}

export function getArcadeMuteState(): boolean {
  return isMuted;
}

/**
 * ⚡ صوت تشغيل شاشة CRT (CRT Screen Power On Buzz)
 */
export function playCrtPowerOnSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(90, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.32);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.4);
}

/**
 * 🎵 موسيقى الآركيد الكلاسيكية 8-bit الحماسية عند بدء تشغيل الجهاز
 * (Arcade Boot Chiptune Theme - Web Audio API Native Synth)
 */
export function playArcadeStartupMusic() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  stopArcadeMusic();

  const now = ctx.currentTime + 0.02;

  // Master Gain for Theme Music
  const musicMaster = ctx.createGain();
  musicMaster.gain.setValueAtTime(0.18, now);
  musicMaster.connect(ctx.destination);
  currentMusicGain = musicMaster;

  // Standard Chiptune Frequencies
  const C4 = 261.63;
  const C5 = 523.25, E5 = 659.25, G5 = 783.99, A5 = 880.00, B5 = 987.77;
  const C6 = 1046.50, D6 = 1174.66, E6 = 1318.51, G6 = 1567.98;
  const C3 = 130.81, E3 = 164.81, G3 = 196.00, A3 = 220.00, F3 = 174.61;

  // 1. Lead Melody (Square Wave Chiptune Lead)
  const leadNotes: [number, number, number][] = [
    // Phase A: Rapid Arpeggio Spark (0.0s - 0.6s)
    [C5, 0.00, 0.07],
    [E5, 0.08, 0.07],
    [G5, 0.16, 0.07],
    [C6, 0.24, 0.12],
    [B5, 0.38, 0.07],
    [G5, 0.46, 0.07],
    [C6, 0.54, 0.16],

    // Phase B: Catchy Upbeat 8-Bit Groove (0.75s - 1.8s)
    [G5, 0.75, 0.08],
    [G5, 0.85, 0.08],
    [A5, 0.95, 0.10],
    [G5, 1.07, 0.10],
    [C6, 1.20, 0.14],
    [D6, 1.36, 0.12],
    [E6, 1.50, 0.22],
    [D6, 1.74, 0.14],

    // Phase C: Triumphant Fanfare Outro (1.95s - 2.8s)
    [E5, 1.95, 0.08],
    [G5, 2.05, 0.08],
    [C6, 2.15, 0.12],
    [E6, 2.30, 0.16],
    [G6, 2.48, 0.45],
  ];

  // 2. Bass Line (Triangle Wave Retro Bass)
  const bassNotes: [number, number, number][] = [
    [C3, 0.00, 0.20],
    [C3, 0.24, 0.20],
    [E3, 0.48, 0.20],
    [G3, 0.75, 0.20],
    [A3, 0.95, 0.20],
    [F3, 1.20, 0.20],
    [G3, 1.45, 0.22],
    [C3, 1.95, 0.25],
    [G3, 2.22, 0.22],
    [C4, 2.48, 0.50],
  ];

  // Schedule Lead
  leadNotes.forEach(([freq, offset, dur]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = now + offset;

    osc.type = "square";
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.13, t);
    gain.gain.setValueAtTime(0.13, t + dur * 0.75);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(gain);
    gain.connect(musicMaster);

    osc.start(t);
    osc.stop(t + dur + 0.04);
  });

  // Schedule Bass
  bassNotes.forEach(([freq, offset, dur]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = now + offset;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(gain);
    gain.connect(musicMaster);

    osc.start(t);
    osc.stop(t + dur + 0.04);
  });
}

/**
 * 🪙 صوت إدخال العملة الكلاسيكي (Coin Insert)
 */
export function playCoinSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  // نغمة B5 ثم E6 الكلاسيكية
  osc.frequency.setValueAtTime(987.77, now);
  osc.frequency.setValueAtTime(1318.51, now + 0.08);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.setValueAtTime(0.18, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.45);
}

/**
 * 🎮 صوت تبديل اللاعب وأزرار الآركيد الأساسية (8-bit Select/Blip)
 */
export function playSelectSound(pitchFactor = 1) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  const baseFreq = 440 * pitchFactor;
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, now + 0.09);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
}

/**
 * 🕹️ صوت حركة عصا التحكم الميكانيكية (Mechanical Joystick Click)
 */
export function playJoystickSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(260, now);
  osc.frequency.exponentialRampToValueAtTime(65, now + 0.06);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.07);
}

/**
 * ⚡ صوت ليزر هجومي / تفاعل سريع (Arcade Laser Zap)
 */
export function playLaserSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(1400, now);
  osc.frequency.exponentialRampToValueAtTime(160, now + 0.11);

  gain.gain.setValueAtTime(0.14, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
}

/**
 * 🍄 صوت قفزة آركيد كلاسيكية (Retro Jump / Spring)
 */
export function playJumpSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(680, now + 0.11);

  gain.gain.setValueAtTime(0.13, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
}

/**
 * ⭐ صوت ترقية / باور أب / زيادة الليفل (Level Up / Power-up Arpeggio)
 */
export function playPowerUpSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // أربيجيو خماسي صاعد سريع ومبهج: E4, G#4, B4, E5, G#5
  const notes = [329.63, 415.3, 493.88, 659.25, 830.61];

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + idx * 0.045;

    osc.type = "square";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.13, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.15);
  });
}

/**
 * 🌀 صوت الانتقال / الصعود الفضائي (Warp / Teleport Chirp)
 */
export function playWarpSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(1450, now + 0.18);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.2);
}

/**
 * 🔔 صوت الرنين الثنائي / نغمة الإنجاز (Harmonic Chime)
 */
export function playChimeSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [1046.5, 1318.51]; // C6 & E6 harmony

  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  });
}

/**
 * 🚀 صوت بدء اللعبة الرسمي (Press Start Fanfare)
 */
export function playStartSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const noteStart = now + idx * 0.07;

    osc.type = "square";
    osc.frequency.setValueAtTime(freq, noteStart);

    gain.gain.setValueAtTime(0.14, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteStart);
    osc.stop(noteStart + 0.2);
  });
}

/**
 * 📺 صوت تشغيل التلفزيون والدخول في القناة (CRT TV Turn-on & Warp In)
 */
export function playTvWarpSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. فرقعة تشغيل شاشة التلفزيون الكلاسيكية (CRT Zap)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sawtooth";
  osc1.frequency.setValueAtTime(2400, now);
  osc1.frequency.exponentialRampToValueAtTime(160, now + 0.12);
  gain1.gain.setValueAtTime(0.22, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.15);

  // 2. صوت اندفاع الكاميرا والدخول في القناة (Deep Sub Warp Sweep)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(90, now + 0.08);
  osc2.frequency.exponentialRampToValueAtTime(950, now + 0.45);
  gain2.gain.setValueAtTime(0.01, now + 0.08);
  gain2.gain.linearRampToValueAtTime(0.24, now + 0.35);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.08);
  osc2.stop(now + 0.52);

  // 3. نغمة الوصول للقناة وضبط الإشارة (Channel Lock Chime)
  const osc3 = ctx.createOscillator();
  const gain3 = ctx.createGain();
  osc3.type = "sine";
  osc3.frequency.setValueAtTime(1046.5, now + 0.48);
  gain3.gain.setValueAtTime(0.14, now + 0.48);
  gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
  osc3.connect(gain3);
  gain3.connect(ctx.destination);
  osc3.start(now + 0.48);
  osc3.stop(now + 0.75);
}

// مؤشر تسلسلي لتنويع الأصوات عند النقرات المتتالية
let soundVariationIndex = 0;

/**
 * 🎲 تشغيل صوت آركيد متنوع وعشوائي للنقرات العامة
 */
export function playRandomArcadeSound() {
  if (isMuted) return;

  soundVariationIndex = (soundVariationIndex + 1) % 6;
  // إضافة تنويع طفيف في التردد (+/- 4%) لإعطاء إحساس حيوي غير مكرر
  const pitchJitter = 0.96 + Math.random() * 0.08;

  switch (soundVariationIndex) {
    case 0:
      playSelectSound(1.2 * pitchJitter);
      break;
    case 1:
      playLaserSound();
      break;
    case 2:
      playJumpSound();
      break;
    case 3:
      playChimeSound();
      break;
    case 4:
      playSelectSound(0.9 * pitchJitter);
      break;
    case 5:
      playSelectSound(1.5 * pitchJitter);
      break;
    default:
      playSelectSound(pitchJitter);
  }
}

/**
 * تم حصر الأصوات في جهاز الأركيد فقط بناءً على طلب العميل
 */
export function initGlobalArcadeSounds() {
  // الأصوات محصورة فقط في جهاز الأركيد (Hero Arcade Cabinet)
}
