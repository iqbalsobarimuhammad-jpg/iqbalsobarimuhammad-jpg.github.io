// Efek bergerak: ombak, bintang berkelip, burung, api, asap, bara, kilau.
import { rng, hexNum, S, LW } from './art/pixel.js';

// Kilau ombak di permukaan laut
export class Waves {
  constructor(scene, o) {
    this.g = scene.add.graphics().setScale(S).setDepth(o.depth ?? 5);
    const r = rng(o.seed ?? 1);
    this.items = [];
    this.drift = o.drift ?? 0;
    const cols = (o.colors || ['#ffffff']).map(hexNum);
    const span = o.y1 - o.y0;
    for (let i = 0; i < (o.count ?? 80); i++) {
      const y = o.y0 + Math.floor(Math.pow(r(), 1.25) * span);
      const p = (y - o.y0) / span;
      this.items.push({
        x: r() * (LW + 40) - 20,
        y,
        len: 1 + r() * 5 * (0.5 + p * 1.6),
        ph: r() * 6.28,
        sp: 0.6 + r() * 1.6,
        c: cols[Math.floor(r() * cols.length)],
        a: 0.5 + r() * 0.5,
      });
    }
    if (o.refl) {
      const rc = hexNum(o.refl.color);
      for (let i = 0; i < (o.refl.count ?? 40); i++) {
        const y = o.y0 + Math.floor(Math.pow(r(), 1.1) * span);
        const p = (y - o.y0) / span;
        this.items.push({
          x: o.refl.x + (r() - 0.5) * o.refl.w * (0.35 + p * 1.2),
          y,
          len: 2 + r() * 6 * (0.6 + p),
          ph: r() * 6.28,
          sp: 1 + r() * 2,
          c: rc,
          a: 1,
          fixed: true,
        });
      }
    }
  }

  update(t) {
    const g = this.g;
    g.clear();
    for (const it of this.items) {
      const k = Math.sin(t * it.sp + it.ph);
      if (k < -0.25) continue;
      const l = Math.max(1, Math.round(it.len * (0.45 + 0.55 * k)));
      let x = it.x + Math.sin(t * 0.45 + it.ph) * 1.5 - l / 2;
      if (!it.fixed && this.drift) x = ((x + t * this.drift) % (LW + 40) + LW + 40) % (LW + 40) - 20;
      g.fillStyle(it.c, it.a);
      g.fillRect(Math.round(x), it.y, l, 1);
    }
  }

  destroy() {
    this.g.destroy();
  }
}

// Bintang yang berkelip
export class Twinkles {
  constructor(scene, seed, count, yMax, depth = 2) {
    this.g = scene.add.graphics().setScale(S).setDepth(depth);
    const r = rng(seed);
    this.items = [];
    for (let i = 0; i < count; i++) {
      this.items.push({ x: Math.floor(r() * LW), y: Math.floor(Math.pow(r(), 1.5) * yMax), ph: r() * 6.28, sp: 1 + r() * 3, big: r() < 0.15 });
    }
  }

  update(t) {
    const g = this.g;
    g.clear();
    for (const s of this.items) {
      const a = 0.5 + 0.5 * Math.sin(t * s.sp + s.ph);
      if (a < 0.3) continue;
      g.fillStyle(0xffffff, a);
      g.fillRect(s.x, s.y, 1, 1);
      if (s.big && a > 0.8) {
        g.fillStyle(0xdfe6ff, a * 0.5);
        g.fillRect(s.x - 1, s.y, 1, 1);
        g.fillRect(s.x + 1, s.y, 1, 1);
        g.fillRect(s.x, s.y - 1, 1, 1);
        g.fillRect(s.x, s.y + 1, 1, 1);
      }
    }
  }

  destroy() {
    this.g.destroy();
  }
}

// Burung camar terbang
export class Birds {
  constructor(scene, list, color = '#3a2a4c', depth = 6) {
    this.g = scene.add.graphics().setScale(S).setDepth(depth);
    this.c = hexNum(color);
    this.list = list.map((b) => ({ ...b, ph: Math.random() * 6 }));
  }

  update(t) {
    const g = this.g;
    g.clear();
    g.fillStyle(this.c, 1);
    for (const b of this.list) {
      const x = Math.round(b.x + b.vx * t);
      const y = Math.round(b.y + Math.sin(t * 0.8 + b.ph) * 2);
      const up = Math.sin(t * 9 + b.ph) > 0;
      g.fillRect(x, y, 1, 1);
      g.fillRect(x - 1, y + (up ? -1 : 0), 1, 1);
      g.fillRect(x + 1, y + (up ? -1 : 0), 1, 1);
      g.fillRect(x - 2, y + (up ? -2 : 1), 1, 1);
      g.fillRect(x + 2, y + (up ? -2 : 1), 1, 1);
    }
  }

  destroy() {
    this.g.destroy();
  }
}

// Api (koordinat dalam satuan layar kecil 320x180)
export function fire(scene, x, y, o = {}) {
  const w = (o.w ?? 6) * S;
  const k = o.size ?? 1;
  return scene.add
    .particles(0, 0, 'px', {
      x: { min: x * S - w / 2, max: x * S + w / 2 },
      y: { min: y * S - 2, max: y * S + 4 },
      lifespan: { min: 380 * k, max: 900 * k },
      speedY: { min: -75 * k, max: -30 * k },
      speedX: { min: -14, max: 14 },
      scale: { start: 5 * k, end: 1 },
      color: [0xfff6b0, 0xffc040, 0xff6a1a, 0xa81c0a, 0x3a0805],
      colorEase: 'quad.out',
      alpha: { start: 1, end: 0.15 },
      blendMode: 'ADD',
      frequency: o.freq ?? 22,
      quantity: o.qty ?? 1,
      advance: 1200,
    })
    .setDepth(o.depth ?? 8);
}

// Bara api yang beterbangan ke atas
export function embers(scene, o = {}) {
  return scene.add
    .particles(0, 0, 'px', {
      x: { min: -40, max: 1000 },
      y: { min: 560, max: 600 },
      lifespan: { min: 5000, max: 9000 },
      speedY: { min: -110 * (o.speed ?? 1), max: -40 * (o.speed ?? 1) },
      speedX: { min: -25, max: 35 },
      scale: { start: 3, end: 3 },
      tint: o.tint ?? [0xffc060, 0xff7a30, 0xffe8a0, 0xff4a20],
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD',
      frequency: o.freq ?? 80,
      advance: 6000,
    })
    .setDepth(o.depth ?? 30);
}

// Asap
export function smoke(scene, x, y, o = {}) {
  return scene.add
    .particles(0, 0, 'glowSoft', {
      x: { min: x * S - (o.w ?? 8) * S, max: x * S + (o.w ?? 8) * S },
      y: y * S,
      lifespan: { min: 3500, max: 6000 },
      speedY: { min: -45, max: -20 },
      speedX: { min: 6, max: 24 },
      scale: { start: (o.scale ?? 1) * 0.7, end: (o.scale ?? 1) * 2.6 },
      tint: o.tint ?? 0x1a0808,
      alpha: { start: o.alpha ?? 0.55, end: 0 },
      frequency: o.freq ?? 180,
      advance: 4000,
    })
    .setDepth(o.depth ?? 7);
}

// Kilau cahaya biru yang naik (pusaka air)
export function sparkles(scene, x, y, o = {}) {
  return scene.add
    .particles(0, 0, 'px', {
      x: { min: x * S - (o.w ?? 10) * S, max: x * S + (o.w ?? 10) * S },
      y: { min: y * S - (o.h ?? 2) * S, max: y * S + (o.h ?? 2) * S },
      lifespan: { min: 900, max: 2200 },
      speedY: { min: -70, max: -15 },
      speedX: { min: -12, max: 12 },
      scale: { start: 3, end: 3 },
      tint: o.tint ?? [0xd8fbff, 0x7ae8ff, 0x3ab8ff, 0xffffff],
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD',
      frequency: o.freq ?? 50,
      advance: 1500,
    })
    .setDepth(o.depth ?? 12);
}

// Hujan rintik (opsional)
export function rain(scene, o = {}) {
  return scene.add
    .particles(0, 0, 'px', {
      x: { min: 0, max: 1100 },
      y: -20,
      lifespan: 900,
      speedY: { min: 700, max: 900 },
      speedX: { min: -220, max: -180 },
      scaleX: 1,
      scaleY: 6,
      rotate: 14,
      tint: o.tint ?? 0x9ab0d0,
      alpha: { start: 0.5, end: 0.3 },
      frequency: o.freq ?? 8,
    })
    .setDepth(o.depth ?? 25);
}
