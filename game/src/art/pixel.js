// Alat bantu gambar pixel art.
// Semua gambar dilukis di kanvas kecil (320x180), lalu diperbesar 3x
// supaya tampilannya kotak-kotak khas game retro.

export const LW = 320; // lebar layar versi kecil
export const LH = 180; // tinggi layar versi kecil
export const S = 3;    // faktor perbesaran (320x180 -> 960x540)

// Angka acak yang bisa diulang (seed sama = hasil sama)
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hex(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function hexNum(c) {
  return parseInt(c.slice(1), 16);
}

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
const th = (x, y) => (BAYER[y & 3][x & 3] + 0.5) / 16;

// Bikin tekstur kanvas Phaser
export function newCanvas(scene, key, w = LW, h = LH) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.createCanvas(key, w, h);
  const ctx = tex.getContext();
  ctx.imageSmoothingEnabled = false;
  return { tex, ctx, w, h, key };
}

// Kanvas biasa (bukan tekstur) untuk lapisan sementara
export function tmpCanvas(w = LW, h = LH) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  return { c, ctx };
}

// Gradasi vertikal dengan dithering (titik-titik khas retro)
export function vgrad(ctx, x0, y0, w, h, stops) {
  if (w <= 0 || h <= 0) return;
  const img = ctx.getImageData(x0, y0, w, h);
  const d = img.data;
  const cols = stops.map(hex);
  if (cols.length === 1) cols.push(cols[0]);
  const n = cols.length - 1;
  for (let y = 0; y < h; y++) {
    const t = h <= 1 ? 0 : (y / (h - 1)) * n;
    const i = Math.min(n - 1, Math.floor(t));
    const f = t - i;
    for (let x = 0; x < w; x++) {
      const c = f > th(x0 + x, y0 + y) ? cols[i + 1] : cols[i];
      const p = (y * w + x) * 4;
      d[p] = c[0];
      d[p + 1] = c[1];
      d[p + 2] = c[2];
      d[p + 3] = 255;
    }
  }
  ctx.putImageData(img, x0, y0);
}

// Gradasi horizontal dengan dithering
export function hgrad(ctx, x0, y0, w, h, stops) {
  if (w <= 0 || h <= 0) return;
  const img = ctx.getImageData(x0, y0, w, h);
  const d = img.data;
  const cols = stops.map(hex);
  if (cols.length === 1) cols.push(cols[0]);
  const n = cols.length - 1;
  for (let x = 0; x < w; x++) {
    const t = w <= 1 ? 0 : (x / (w - 1)) * n;
    const i = Math.min(n - 1, Math.floor(t));
    const f = t - i;
    for (let y = 0; y < h; y++) {
      const c = f > th(x0 + x, y0 + y) ? cols[i + 1] : cols[i];
      const p = (y * w + x) * 4;
      d[p] = c[0];
      d[p + 1] = c[1];
      d[p + 2] = c[2];
      d[p + 3] = 255;
    }
  }
  ctx.putImageData(img, x0, y0);
}

// Lingkaran berpendar (makin ke tepi makin jarang titiknya)
export function glowDisc(ctx, cx, cy, r, color, falloff = 1, strength = 1) {
  const c = hex(color);
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const x0 = Math.max(0, Math.floor(cx - r));
  const y0 = Math.max(0, Math.floor(cy - r));
  const x1 = Math.min(W, Math.ceil(cx + r));
  const y1 = Math.min(H, Math.ceil(cy + r));
  const w = x1 - x0;
  const h = y1 - y0;
  if (w <= 0 || h <= 0) return;
  const img = ctx.getImageData(x0, y0, w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x0 + x + 0.5 - cx;
      const dy = y0 + y + 0.5 - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) / r;
      if (dist >= 1) continue;
      const v = Math.pow(1 - dist, falloff) * strength;
      if (v > th(x0 + x, y0 + y)) {
        const p = (y * w + x) * 4;
        d[p] = c[0];
        d[p + 1] = c[1];
        d[p + 2] = c[2];
        d[p + 3] = 255;
      }
    }
  }
  ctx.putImageData(img, x0, y0);
}

// Lingkaran padat
export function disc(ctx, cx, cy, r, color) {
  glowDisc(ctx, cx, cy, r, color, 0, 2);
}

// Lingkaran padat dengan bayangan sisi (bulan/matahari)
export function shadedDisc(ctx, cx, cy, r, light, dark, dir = -1) {
  disc(ctx, cx, cy, r, light);
  const c = hex(dark);
  const x0 = Math.floor(cx - r);
  const y0 = Math.floor(cy - r);
  const w = Math.ceil(r * 2);
  const img = ctx.getImageData(x0, y0, w, w);
  const d = img.data;
  for (let y = 0; y < w; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (x0 + x + 0.5 - cx) / r;
      const dy = (y0 + y + 0.5 - cy) / r;
      if (dx * dx + dy * dy >= 1) continue;
      const v = Math.max(0, dx * dir * 0.9 + 0.1 - dy * 0.2);
      if (v * 1.3 > th(x0 + x, y0 + y) + 0.25) {
        const p = (y * w + x) * 4;
        d[p] = c[0];
        d[p + 1] = c[1];
        d[p + 2] = c[2];
      }
    }
  }
  ctx.putImageData(img, x0, y0);
}

// Bikin tepi gambar tajam (hapus anti-aliasing)
export function crisp(ctx) {
  const { width: w, height: h } = ctx.canvas;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 3; i < d.length; i += 4) d[i] = d[i] >= 100 ? 255 : 0;
  ctx.putImageData(img, 0, 0);
}

// Gambar bentuk di lapisan terpisah, dipertajam, lalu ditempel
export function stamp(ctx, draw, w = ctx.canvas.width, h = ctx.canvas.height) {
  const t = tmpCanvas(w, h);
  draw(t.ctx);
  crisp(t.ctx);
  ctx.drawImage(t.c, 0, 0);
}

// Bintang-bintang
export function stars(ctx, seed, count, yMax, colors = ['#ffffff', '#cfd6ff', '#ffe9c4']) {
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(r() * ctx.canvas.width);
    const y = Math.floor(Math.pow(r(), 1.4) * yMax);
    ctx.fillStyle = colors[Math.floor(r() * colors.length)];
    ctx.globalAlpha = 0.35 + r() * 0.65;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalAlpha = 1;
}

// Pulau / perbukitan siluet
export function island(ctx, x0, x1, baseY, height, color, seed, peaks = []) {
  const r = rng(seed);
  const ph = [r() * 6.28, r() * 6.28, r() * 6.28];
  ctx.fillStyle = color;
  for (let x = Math.max(0, Math.floor(x0)); x < Math.min(ctx.canvas.width, x1); x++) {
    const u = (x - x0) / (x1 - x0);
    const taper = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, u))), 0.55);
    let v =
      Math.sin(x * 0.045 + ph[0]) * 0.5 +
      Math.sin(x * 0.11 + ph[1]) * 0.3 +
      Math.sin(x * 0.27 + ph[2]) * 0.2;
    v = (v + 1) / 2;
    let top = baseY - height * taper * (0.55 + 0.45 * v);
    for (const p of peaks) {
      const dx = Math.abs(x - p.x);
      const vt = p.top + Math.max(0, dx - (p.crater || 0)) * p.slope * (1 + dx * 0.012);
      top = Math.min(top, vt);
    }
    top = Math.round(top);
    if (top < baseY) ctx.fillRect(x, top, 1, Math.ceil(baseY - top));
  }
}

// Daratan bergelombang sampai bawah layar
export function ground(ctx, y, amp, color, seed, freq = 1) {
  const r = rng(seed);
  const ph = [r() * 6.28, r() * 6.28];
  ctx.fillStyle = color;
  const H = ctx.canvas.height;
  for (let x = 0; x < ctx.canvas.width; x++) {
    const v = Math.sin(x * 0.02 * freq + ph[0]) * 0.6 + Math.sin(x * 0.07 * freq + ph[1]) * 0.4;
    const top = Math.round(y - ((v + 1) / 2) * amp);
    ctx.fillRect(x, top, 1, H - top);
  }
}

// Awan berlapis (pita horizontal ber-dither)
export function cloudBand(ctx, y, h, color, seed, density = 0.5) {
  const c = hex(color);
  const W = ctx.canvas.width;
  const r = rng(seed);
  const ph = [r() * 6.28, r() * 6.28, r() * 6.28];
  const img = ctx.getImageData(0, y, W, h);
  const d = img.data;
  for (let yy = 0; yy < h; yy++) {
    const ny = yy / h;
    for (let x = 0; x < W; x++) {
      const n =
        Math.sin(x * 0.03 + ph[0] + ny * 2) * 0.5 +
        Math.sin(x * 0.071 + ph[1] - ny * 3) * 0.3 +
        Math.sin(x * 0.15 + ph[2]) * 0.2;
      const shape = Math.sin(Math.PI * ny);
      const v = ((n + 1) / 2) * shape * density * 1.6;
      if (v > th(x, y + yy) + 0.15) {
        const p = (yy * W + x) * 4;
        d[p] = c[0];
        d[p + 1] = c[1];
        d[p + 2] = c[2];
        d[p + 3] = 255;
      }
    }
  }
  ctx.putImageData(img, 0, y);
}

// Tekstur-tekstur kecil untuk partikel dan cahaya
export function makeBaseTextures(scene) {
  if (!scene.textures.exists('px')) {
    const t = newCanvas(scene, 'px', 1, 1);
    t.ctx.fillStyle = '#fff';
    t.ctx.fillRect(0, 0, 1, 1);
    t.tex.refresh();
  }
  if (!scene.textures.exists('px2')) {
    const t = newCanvas(scene, 'px2', 2, 2);
    t.ctx.fillStyle = '#fff';
    t.ctx.fillRect(0, 0, 2, 2);
    t.tex.refresh();
  }
  if (!scene.textures.exists('glow')) {
    const t = newCanvas(scene, 'glow', 48, 48);
    glowDisc(t.ctx, 24, 24, 24, '#ffffff', 1.6, 1);
    t.tex.refresh();
  }
  if (!scene.textures.exists('glowSoft')) {
    const t = newCanvas(scene, 'glowSoft', 64, 64);
    glowDisc(t.ctx, 32, 32, 32, '#ffffff', 2.4, 0.7);
    t.tex.refresh();
  }
  if (!scene.textures.exists('ray')) {
    const t = newCanvas(scene, 'ray', 10, 90);
    const img = t.ctx.getImageData(0, 0, 10, 90);
    for (let y = 0; y < 90; y++) {
      for (let x = 0; x < 10; x++) {
        const v = (y / 90) * (1 - Math.abs(x - 4.5) / 5);
        if (v > th(x, y)) {
          const p = (y * 10 + x) * 4;
          img.data[p] = img.data[p + 1] = img.data[p + 2] = img.data[p + 3] = 255;
        }
      }
    }
    t.ctx.putImageData(img, 0, 0);
    t.tex.refresh();
  }
}
