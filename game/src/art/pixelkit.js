// PixelKit: kanvas piksel sederhana untuk menggambar tokoh titik demi titik.
// Semua bentuk digambar tanpa anti-aliasing, jadi hasilnya pixel art asli.

export class PixelCanvas {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.d = new Array(w * h).fill(null);
    this.clip = null; // kalau diisi Set warna: hanya boleh menimpa piksel berwarna itu
    this.ox = 0; // geser semua gambar (supaya bagian yang mencuat tidak terpotong)
    this.oy = 0;
  }

  get(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    return this.d[y * this.w + x];
  }

  set(x, y, c) {
    x = Math.floor(x) + this.ox;
    y = Math.floor(y) + this.oy;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return this;
    const i = y * this.w + x;
    if (this.clip && !this.clip.has(this.d[i])) return this;
    this.d[i] = c;
    return this;
  }

  // Gambar hanya di atas warna tertentu (untuk bayangan / motif)
  within(colors, fn) {
    const prev = this.clip;
    this.clip = new Set(Array.isArray(colors) ? colors : [colors]);
    fn();
    this.clip = prev;
    return this;
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
    return this;
  }

  // Poligon (titik-titik dalam koordinat piksel)
  poly(pts, c) {
    let minY = Infinity;
    let maxY = -Infinity;
    for (const [, y] of pts) {
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const sy = y + 0.5;
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [x0, y0] = pts[i];
        const [x1, y1] = pts[(i + 1) % pts.length];
        if ((y0 <= sy && y1 > sy) || (y1 <= sy && y0 > sy)) xs.push(x0 + ((sy - y0) / (y1 - y0)) * (x1 - x0));
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++) this.set(x, y, c);
      }
    }
    return this;
  }

  ellipse(cx, cy, rx, ry, c) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x + 0.5 - cx) / rx;
        const dy = (y + 0.5 - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.set(x, y, c);
      }
    }
    return this;
  }

  line(x0, y0, x1, y1, c) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
    return this;
  }

  // Garis tebal (lengan, kaki, tongkat)
  thick(pts, r, c) {
    for (let i = 0; i + 1 < pts.length; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2));
      for (let k = 0; k <= n; k++) {
        const t = k / n;
        this.ellipse(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r, r, c);
      }
    }
    return this;
  }

  // Tempel pola ASCII. map: { 'K': '#000', ... }, '.' atau spasi = lewati
  patch(x, y, rows, map, mirror = false) {
    rows.forEach((row, j) => {
      const chars = [...row];
      const w = chars.length;
      chars.forEach((ch, i) => {
        const c = map[ch];
        if (c) this.set(mirror ? x + (w - 1 - i) : x + i, y + j, c);
      });
    });
    return this;
  }

  // Garis tepi di sekeliling semua piksel yang terisi
  outline(c, ignore = []) {
    const ign = new Set(ignore);
    const add = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.get(x, y) !== null) continue;
        const n = [this.get(x - 1, y), this.get(x + 1, y), this.get(x, y - 1), this.get(x, y + 1)];
        if (n.some((v) => v !== null && !ign.has(v))) add.push([x, y]);
      }
    }
    for (const [x, y] of add) this.d[y * this.w + x] = c;
    return this;
  }

  // Kanvas kosong seukuran ini (lapisan terpisah)
  layer() {
    const l = new PixelCanvas(this.w, this.h);
    l.ox = this.ox;
    l.oy = this.oy;
    return l;
  }

  // Tempel lapisan lain di atas kanvas ini
  draw(other, dx = 0, dy = 0) {
    for (let y = 0; y < other.h; y++) {
      for (let x = 0; x < other.w; x++) {
        const v = other.d[y * other.w + x];
        if (v) this.set(x + dx - this.ox, y + dy - this.oy, v);
      }
    }
    return this;
  }

  // Ganti warna A jadi B di seluruh kanvas (atau di area tertentu)
  replace(a, b) {
    for (let i = 0; i < this.d.length; i++) if (this.d[i] === a) this.d[i] = b;
    return this;
  }

  toCanvas(scale = 1, bg = null) {
    const c = document.createElement('canvas');
    c.width = this.w * scale;
    c.height = this.h * scale;
    const ctx = c.getContext('2d');
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, c.width, c.height);
    }
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const v = this.d[y * this.w + x];
        if (!v) continue;
        ctx.fillStyle = v;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
    return c;
  }
}
