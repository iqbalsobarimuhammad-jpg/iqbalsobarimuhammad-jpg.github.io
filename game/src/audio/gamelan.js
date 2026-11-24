// Musik gamelan buatan sendiri, disintesis langsung di browser (Web Audio).
// Tidak ada file musik: saron, bonang, gong, kendang, dan suling semuanya
// "ditiru" dengan rumus suara.

// Laras slendro (5 nada) dan pelog (7 nada), dalam satuan cent
const SL = [0, 231, 474, 717, 955];
const PL = [0, 120, 258, 539, 675, 785, 943];
const SL_BASE = 268;
const PL_BASE = 282;
const SL_IDX = { 1: 0, 2: 1, 3: 2, 5: 3, 6: 4 };

export const sl = (n, oct = 0) => SL_BASE * Math.pow(2, (SL[SL_IDX[n]] + 1200 * oct) / 1200);
export const pl = (n, oct = 0) => PL_BASE * Math.pow(2, (PL[n - 1] + 1200 * oct) / 1200);

// Notasi "kepatihan": "3 5 6 1^ 6 5 3 2_" (^ = oktaf atas, _ = oktaf bawah, . = diam)
function parse(str, fn) {
  return str
    .trim()
    .split(/\s+/)
    .map((tok) => {
      if (tok === '.') return null;
      const n = parseInt(tok[0], 10);
      let oct = 0;
      for (const ch of tok.slice(1)) {
        if (ch === '^') oct++;
        if (ch === '_') oct--;
      }
      return fn(n, oct);
    });
}

export class Gamelan {
  constructor() {
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    const c = this.ctx;

    this.out = c.createGain();
    this.out.gain.value = 0.85;
    this.comp = c.createDynamicsCompressor();
    this.comp.threshold.value = -16;
    this.comp.knee.value = 10;
    this.comp.ratio.value = 4;
    this.comp.attack.value = 0.004;
    this.comp.release.value = 0.25;

    this.verb = c.createConvolver();
    this.verb.buffer = this.impulse(3.2, 2.4);
    this.wet = c.createGain();
    this.wet.gain.value = 0.32;
    this.dry = c.createGain();
    this.dry.gain.value = 1;

    this.bus = c.createGain();
    this.bus.connect(this.dry);
    this.bus.connect(this.wet);
    this.wet.connect(this.verb);
    this.verb.connect(this.comp);
    this.dry.connect(this.comp);
    this.comp.connect(this.out);
    this.out.connect(c.destination);

    // Penyangga noise untuk kendang, napas suling, dll
    const len = c.sampleRate * 2;
    this.noiseBuf = c.createBuffer(1, len, c.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    this.seq = new Sequencer(this);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) c.suspend();
      else c.resume();
    });
  }

  impulse(sec, decay) {
    const c = this.ctx;
    const len = Math.floor(c.sampleRate * sec);
    const b = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = b.getChannelData(ch);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return b;
  }

  resume() {
    return this.ctx.resume();
  }

  get now() {
    return this.ctx.currentTime;
  }

  fadeTo(v, sec = 1) {
    const t = this.now;
    this.out.gain.cancelScheduledValues(t);
    this.out.gain.setValueAtTime(this.out.gain.value, t);
    this.out.gain.linearRampToValueAtTime(v, t + sec);
  }

  env(t, peak, a, d, dest = this.bus) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    g.connect(dest);
    return g;
  }

  osc(type, f, t, dur, dest) {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    o.connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
    return o;
  }

  noise(t, dur, freq, vol, type = 'bandpass', q = 1, dest = this.bus) {
    const c = this.ctx;
    const s = c.createBufferSource();
    s.buffer = this.noiseBuf;
    const fl = c.createBiquadFilter();
    fl.type = type;
    fl.frequency.value = freq;
    fl.Q.value = q;
    const g = this.env(t, vol, 0.002, dur, dest);
    s.connect(fl);
    fl.connect(g);
    s.start(t, Math.random() * 1.5);
    s.stop(t + dur + 0.05);
    return { s, fl, g };
  }

  // Bilah logam: saron, demung, peking
  metal(t, f, vel, partials, decay) {
    for (const [r, a, dk] of partials) {
      const g = this.env(t, 0.22 * vel * a, 0.003, decay * dk);
      this.osc('sine', f * r, t, decay * dk + 0.02, g);
    }
    // "Ombak": nada kembaran yang sedikit sumbang, khas gamelan
    const g2 = this.env(t, 0.08 * vel, 0.004, decay * 0.9);
    this.osc('sine', f * 1.0045, t, decay, g2);
  }

  saron(t, f, vel = 1) {
    this.metal(t, f, vel, [[1, 1, 1], [2.76, 0.42, 0.45], [5.4, 0.18, 0.25], [8.93, 0.06, 0.14]], 1.5);
  }

  demung(t, f, vel = 1) {
    this.metal(t, f / 2, vel * 1.1, [[1, 1, 1], [2.76, 0.35, 0.5], [5.4, 0.12, 0.25]], 2.2);
  }

  peking(t, f, vel = 1) {
    this.metal(t, f * 2, vel * 0.6, [[1, 1, 1], [2.76, 0.3, 0.4], [5.4, 0.1, 0.2]], 0.9);
  }

  bonang(t, f, vel = 1) {
    this.metal(t, f, vel * 0.75, [[1, 1, 1], [1.99, 0.32, 0.6], [3.03, 0.14, 0.35], [4.1, 0.05, 0.2]], 1.2);
  }

  gong(t, f = 48, vel = 1) {
    const parts = [[1, 1, 7.5], [1.0071, 0.75, 7.5], [2.01, 0.3, 4.5], [2.98, 0.14, 2.8], [4.16, 0.05, 1.6]];
    for (const [r, a, dur] of parts) {
      const g = this.env(t, 0.45 * vel * a, 0.025, dur);
      this.osc('sine', f * r, t, dur, g);
    }
    this.noise(t, 0.3, 260, 0.22 * vel, 'lowpass', 0.7);
  }

  kempul(t, f, vel = 1) {
    const parts = [[1, 1, 3.2], [1.008, 0.7, 3.2], [2.02, 0.3, 1.8], [3.1, 0.1, 1]];
    for (const [r, a, dur] of parts) {
      const g = this.env(t, 0.22 * vel * a, 0.012, dur);
      this.osc('sine', f * r, t, dur, g);
    }
  }

  kendang(t, kind, vel = 1) {
    const c = this.ctx;
    if (kind === 'D') {
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(160, t);
      o.frequency.exponentialRampToValueAtTime(62, t + 0.16);
      const g = this.env(t, 0.65 * vel, 0.003, 0.38, this.dry);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.5);
      this.noise(t, 0.04, 900, 0.14 * vel, 'lowpass', 1, this.dry);
    } else if (kind === 't') {
      this.noise(t, 0.07, 2500, 0.38 * vel, 'bandpass', 2.2, this.dry);
      const g = this.env(t, 0.18 * vel, 0.002, 0.06, this.dry);
      this.osc('sine', 410, t, 0.08, g);
    } else if (kind === 'k') {
      this.noise(t, 0.035, 1700, 0.22 * vel, 'bandpass', 4, this.dry);
    }
  }

  suling(t, f, dur, vel = 1) {
    const c = this.ctx;
    const g = c.createGain();
    const peak = 0.13 * vel;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.1);
    g.gain.setValueAtTime(peak, t + Math.max(0.12, dur - 0.15));
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.15);
    g.connect(this.bus);

    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(f * 0.975, t);
    o.frequency.exponentialRampToValueAtTime(f, t + 0.09);
    const lfo = c.createOscillator();
    lfo.frequency.value = 5.3;
    const lg = c.createGain();
    lg.gain.setValueAtTime(0, t);
    lg.gain.linearRampToValueAtTime(f * 0.007, t + Math.max(0.2, dur * 0.7));
    lfo.connect(lg);
    lg.connect(o.frequency);
    o.connect(g);

    const o2 = c.createOscillator();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(f * 2, t);
    const g2 = c.createGain();
    g2.gain.value = 0.12;
    lg.connect(o2.frequency);
    o2.connect(g2);
    g2.connect(g);

    for (const x of [o, o2, lfo]) {
      x.start(t);
      x.stop(t + dur + 0.25);
    }
    // Hembusan napas
    const n = this.noise(t, dur, f * 2, 0.025 * vel, 'bandpass', 2);
    n.g.gain.cancelScheduledValues(t);
    n.g.gain.setValueAtTime(0.0001, t);
    n.g.gain.linearRampToValueAtTime(0.025 * vel, t + 0.06);
    n.g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.1);
  }

  drone(t, f, dur, vol = 0.06) {
    const c = this.ctx;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + Math.min(2, dur * 0.3));
    g.gain.setValueAtTime(vol, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    const fl = c.createBiquadFilter();
    fl.type = 'lowpass';
    fl.frequency.value = 420;
    fl.Q.value = 2;
    fl.connect(g);
    g.connect(this.bus);
    for (const det of [-7, 0, 8]) {
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.detune.value = det;
      o.connect(fl);
      o.start(t);
      o.stop(t + dur + 0.1);
    }
  }

  impact(t, vel = 1) {
    const c = this.ctx;
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(110, t);
    o.frequency.exponentialRampToValueAtTime(32, t + 0.8);
    const g = this.env(t, 0.9 * vel, 0.005, 1.2, this.dry);
    o.connect(g);
    o.start(t);
    o.stop(t + 1.4);
    this.noise(t, 0.7, 500, 0.45 * vel, 'lowpass', 0.8);
    this.gong(t, 44, vel * 0.9);
  }

  thunder(t, vel = 1) {
    for (let i = 0; i < 4; i++) {
      this.noise(t + i * 0.11 + Math.random() * 0.08, 1.4 - i * 0.2, 180 + i * 40, 0.4 * vel, 'lowpass', 0.6);
    }
  }

  whoosh(t, dur = 1.2, vel = 1) {
    const n = this.noise(t, dur, 300, 0.25 * vel, 'bandpass', 1.4);
    n.fl.frequency.setValueAtTime(250, t);
    n.fl.frequency.exponentialRampToValueAtTime(3200, t + dur);
    n.g.gain.cancelScheduledValues(t);
    n.g.gain.setValueAtTime(0.0001, t);
    n.g.gain.linearRampToValueAtTime(0.25 * vel, t + dur * 0.7);
    n.g.gain.linearRampToValueAtTime(0.0001, t + dur);
  }

  shimmer(t, vel = 1) {
    const notes = [1, 2, 3, 5, 6];
    for (let i = 0; i < 9; i++) {
      const n = notes[(i * 3) % 5];
      this.metal(t + i * 0.075, sl(n, 2), 0.28 * vel, [[1, 1, 1], [2.76, 0.3, 0.5]], 2.6);
    }
  }

  crackle(t, dur, vel = 1) {
    for (let i = 0; i < dur * 14; i++) {
      this.noise(t + Math.random() * dur, 0.02, 1200 + Math.random() * 3000, 0.07 * vel * Math.random(), 'highpass', 1);
    }
  }
}

// ------------------------------------------------------------------
// Pola-pola musik untuk tiap adegan
// ------------------------------------------------------------------
const MEL = {
  laut: parse('2 1 2 6_ 2 1 2 6_ 3 5 6 5 3 2 1 6_', sl),
  sumpah: parse('3 2 1 2 3 2 1 7_ 3 2 1 2 5 4 2 1', pl),
  perangA: parse('1 2 3 5 3 2 1 7_ 1 2 3 6 5 3 2 1', pl),
  perangB: parse('5 6 7 1^ 7 6 5 4 5 6 7 2^ 1^ 7 6 5', pl),
  desaBal: parse('3 5 6 5 3 2 1 2 3 5 3 2 1 6_ 1 2', sl),
  judul: parse('6 5 3 2 3 5 6 1^ 6 5 3 5 2 3 5 6', sl),
};

// [nada, oktaf, ketukan]
const DESA_SULING = [[3, 1, 2], [5, 1, 1], [6, 1, 1], [1, 2, 2], [6, 1, 1], [5, 1, 1], [3, 1, 2], [2, 1, 2], [3, 1, 1], [5, 1, 1], [2, 1, 2]];
const desaMap = (() => {
  const m = {};
  let b = 0;
  for (const [n, o, len] of DESA_SULING) {
    m[b] = [n, o, len];
    b += len;
  }
  return m;
})();

const PAT = {
  sunyi: {
    bpm: 40,
    beat(g, b, t, d) {
      if (b % 8 === 0) g.drone(t, sl(2, -2), d * 8.4, 0.05);
    },
  },

  laut: {
    bpm: 58,
    beat(g, b, t, d) {
      const i = b % 16;
      const m = MEL.laut[i];
      if (m) g.saron(t, m, 0.5);
      if (i % 2 === 1 && MEL.laut[(i + 1) % 16]) g.bonang(t + d / 2, MEL.laut[(i + 1) % 16] * 2, 0.3);
      if (i === 0) {
        g.gong(t, 48, 0.85);
        g.drone(t, sl(2, -2), d * 16.5, 0.035);
      }
      if (i === 8) g.kempul(t, sl(6, -1), 0.7);
    },
  },

  sumpah: {
    bpm: 74,
    beat(g, b, t, d) {
      const i = b % 16;
      const m = MEL.sumpah[i];
      if (m) {
        g.demung(t, m, 0.7);
        g.saron(t, m, 0.45);
      }
      if (i % 4 === 0) g.kendang(t, 'D', 0.9);
      if (i % 4 === 1) g.kendang(t + d / 2, 't', 0.6);
      if (i % 4 === 2) {
        g.kendang(t, 'D', 0.7);
        g.kendang(t + d / 2, 'D', 0.6);
      }
      if (i % 4 === 3) g.kendang(t, 't', 0.8);
      if (i % 8 === 0) {
        g.gong(t, 46, 0.9);
        g.drone(t, pl(1, -2), d * 8.4, 0.05);
      }
      if (i % 8 === 4) g.kempul(t, pl(5, -1), 0.6);
    },
  },

  perang: {
    bpm: 112,
    beat(g, b, t, d) {
      const i = b % 16;
      const a = MEL.perangA[i];
      const bb = MEL.perangB[i];
      if (a) g.saron(t, a, 0.55);
      if (bb) g.saron(t + d / 2, bb, 0.42);
      if (a && i % 2 === 0) g.demung(t, a, 0.6);
      const pat = b % 2 === 0 ? ['D', null, 't', 'k'] : ['D', 'k', 't', 't'];
      pat.forEach((p, j) => p && g.kendang(t + (j * d) / 4, p, j === 0 ? 0.9 : 0.55));
      if (i % 4 === 2) g.kempul(t, pl(5, -1), 0.55);
      if (i === 0) {
        g.gong(t, 46, 1);
        g.drone(t, pl(1, -2), d * 16.5, 0.06);
      }
    },
  },

  desa: {
    bpm: 66,
    beat(g, b, t, d) {
      const i = b % 16;
      const s = desaMap[i];
      if (s) g.suling(t, sl(s[0], s[1]), s[2] * d * 0.95, 0.9);
      const m = MEL.desaBal[i];
      if (m && i % 2 === 0) g.saron(t, m, 0.28);
      if (i % 2 === 1 && m) g.bonang(t, m * 2, 0.16);
      if (i === 0) g.gong(t, 48, 0.6);
      if (i === 8) g.kempul(t, sl(6, -1), 0.4);
    },
  },

  cahaya: {
    bpm: 52,
    beat(g, b, t, d) {
      const notes = [1, 2, 3, 5, 6];
      const n = notes[(b * 2 + (b >> 2)) % 5];
      g.peking(t, sl(n, 1), 0.35);
      if (b % 2 === 1) g.peking(t + d / 2, sl(notes[(b + 3) % 5], 1), 0.22);
      if (b % 4 === 0) {
        g.drone(t, sl(1, -1), d * 4.4, 0.03);
        g.kempul(t, sl(2, -1), 0.35);
      }
    },
  },

  judul: {
    bpm: 64,
    beat(g, b, t, d) {
      const i = b % 16;
      const m = MEL.judul[i];
      if (m) {
        g.saron(t, m, 0.5);
        if (i % 2 === 0) g.demung(t, m, 0.45);
      }
      if (i % 2 === 1 && MEL.judul[(i + 1) % 16]) g.bonang(t + d / 2, MEL.judul[(i + 1) % 16] * 2, 0.25);
      if (i % 4 === 0) {
        const nx = MEL.judul[(i + 3) % 16];
        if (nx) g.suling(t + d * 0.1, nx * 2, d * 3.6, 0.7);
      }
      if (i % 4 === 0) g.kendang(t, 'D', 0.5);
      if (i % 4 === 2) g.kendang(t, 't', 0.35);
      if (i === 0) {
        g.gong(t, 48, 0.85);
        g.drone(t, sl(6, -3), d * 16.5, 0.03);
      }
      if (i === 8) g.kempul(t, sl(6, -1), 0.6);
    },
  },
};

class Sequencer {
  constructor(g) {
    this.g = g;
    this.cur = null;
    this.next = undefined;
    this.beat = 0;
    this.nextTime = 0;
    this.timer = null;
  }

  play(name) {
    if (!this.timer) {
      this.cur = name;
      this.beat = 0;
      this.nextTime = this.g.now + 0.06;
      this.timer = setInterval(() => this.tick(), 25);
      return;
    }
    if (name === this.cur && this.next === undefined) return;
    this.next = name;
    // Pindah lagu secepatnya: tarik jadwal ketukan berikut ke "sekarang"
    this.nextTime = Math.min(this.nextTime, this.g.now + 0.05);
  }

  stop() {
    this.next = null;
  }

  tick() {
    const g = this.g;
    if (g.ctx.state !== 'running') return;
    while (this.nextTime < g.now + 0.12) {
      if (this.next !== undefined) {
        this.cur = this.next;
        this.next = undefined;
        this.beat = 0;
      }
      const p = this.cur ? PAT[this.cur] : null;
      const bpm = p ? p.bpm : 60;
      const d = 60 / bpm;
      if (p) p.beat(g, this.beat, this.nextTime, d);
      this.nextTime += d;
      this.beat++;
    }
  }
}
