// Siluet tokoh, bangunan, kapal, dan pohon.
// Semua digambar dengan path kanvas, lalu dipertajam lewat stamp().

function poly(ctx, pts, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
}

function ell(ctx, x, y, rx, ry, color, rot = 0) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.6, rx), Math.max(0.6, ry), rot, 0, Math.PI * 2);
  ctx.fill();
}

function line(ctx, pts, w, color, cap = 'round') {
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, w);
  ctx.lineCap = cap;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
}

// ------------------------------------------------------------------
// MAHAPATIH MAHESA: bahu lebar, kuluk (topi tinggi), jubah berkibar,
// tombak luk tegak di tangan kanan.
// x = tengah kaki, y = garis kaki, h = tinggi badan (tanpa tombak)
// ------------------------------------------------------------------
export function mahesa(ctx, x, y, h, color, opt = {}) {
  const u = h / 100;
  const wind = opt.wind ?? 1;
  const f = opt.facing ?? 1; // 1 = menghadap kanan
  const X = (dx) => x + dx * u * f;
  const Y = (dy) => y - dy * u;

  // Jubah (di belakang badan)
  if (opt.cape !== false) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(X(-16), Y(80));
    ctx.quadraticCurveTo(X(-30 - 10 * wind), Y(50), X(-44 - 22 * wind), Y(14));
    ctx.lineTo(X(-36 - 18 * wind), Y(18));
    ctx.lineTo(X(-34 - 20 * wind), Y(9));
    ctx.lineTo(X(-24 - 12 * wind), Y(15));
    ctx.lineTo(X(-20 - 8 * wind), Y(6));
    ctx.quadraticCurveTo(X(-12), Y(30), X(-6), Y(55));
    ctx.lineTo(X(10), Y(80));
    ctx.closePath();
    ctx.fill();
  }

  // Kaki
  line(ctx, [[X(-9), Y(22)], [X(-15), Y(1)]], 6 * u, color);
  line(ctx, [[X(9), Y(22)], [X(14), Y(1)]], 6 * u, color);
  poly(ctx, [[X(-19), Y(0)], [X(-10), Y(0)], [X(-12), Y(4)]], color);
  poly(ctx, [[X(10), Y(0)], [X(19), Y(0)], [X(13), Y(4)]], color);

  // Kain (dodot) yang mengembang
  poly(ctx, [[X(-11), Y(54)], [X(11), Y(54)], [X(17), Y(20)], [X(5), Y(17)], [X(0), Y(24)], [X(-6), Y(17)], [X(-18), Y(21)]], color);
  // Selendang pinggang yang berkibar
  poly(ctx, [[X(-8), Y(52)], [X(-24 - 6 * wind), Y(32)], [X(-21 - 6 * wind), Y(29)], [X(-4), Y(47)]], color);

  // Badan (dada bidang)
  poly(ctx, [[X(-10), Y(54)], [X(10), Y(54)], [X(18), Y(78)], [X(14), Y(82)], [X(-14), Y(82)], [X(-19), Y(78)]], color);
  ell(ctx, X(-16), Y(78), 5 * u, 4.5 * u, color);
  ell(ctx, X(16), Y(78), 5 * u, 4.5 * u, color);
  // Hiasan bahu (kelat bahu / sumping)
  poly(ctx, [[X(-21), Y(80)], [X(-25), Y(86)], [X(-17), Y(82)]], color);
  poly(ctx, [[X(21), Y(80)], [X(25), Y(86)], [X(17), Y(82)]], color);

  // Leher dan kepala
  ctx.fillStyle = color;
  ctx.fillRect(Math.min(X(-2.6), X(2.6)), Y(89), 5.2 * u, 8 * u);
  ell(ctx, X(0.5), Y(92.5), 6.4 * u, 7.4 * u, color);
  // Dagu & janggut runcing
  poly(ctx, [[X(-1), Y(87)], [X(6.5), Y(88)], [X(3), Y(83.5)]], color);
  // Sumping (hiasan telinga) bersayap
  poly(ctx, [[X(-5), Y(94)], [X(-12), Y(99)], [X(-13), Y(95)], [X(-8), Y(90)]], color);
  poly(ctx, [[X(5.5), Y(94)], [X(12), Y(98)], [X(12.5), Y(94.5)], [X(8), Y(90.5)]], color);
  // Jamang (ikat mahkota) lalu kuluk yang sedikit mengembang
  poly(ctx, [[X(-7.2), Y(96)], [X(7.4), Y(96)], [X(7.2), Y(99.5)], [X(-7), Y(99.5)]], color);
  poly(ctx, [[X(-5), Y(99)], [X(5.2), Y(99)], [X(6.6), Y(109)], [X(-6.4), Y(109)]], color);
  poly(ctx, [[X(-7.2), Y(109)], [X(7.4), Y(109)], [X(5.6), Y(111.5)], [X(-5.4), Y(111.5)]], color);
  ell(ctx, X(0), Y(112.5), 1.6 * u, 1.6 * u, color);

  // Lengan kiri: tangan di gagang keris
  line(ctx, [[X(-18), Y(78)], [X(-22), Y(64)], [X(-11), Y(56)]], 5.5 * u, color);
  poly(ctx, [[X(-12), Y(58)], [X(-7), Y(62)], [X(-5), Y(58)], [X(-10), Y(54)]], color);

  // Lengan kanan: memegang tombak
  const sx = 29;
  if (opt.spear !== false) {
    line(ctx, [[X(18), Y(78)], [X(27), Y(68)], [X(sx), Y(88)]], 5.5 * u, color);
    // Batang tombak
    const top = opt.spearTop ?? 150;
    line(ctx, [[X(sx), Y(-1)], [X(sx), Y(top)]], 2.4 * u, color, 'butt');
    // Mata tombak berluk: bilah yang meliuk dan meruncing
    const bt = top;
    const N = 10;
    const L = 26;
    const left = [];
    const right = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const half = 3.4 * (1 - t) + 0.3;
      const wave = Math.sin(i * 1.25) * 1.3 * (1 - t * 0.4);
      left.push([X(sx - half + wave), Y(bt + t * L)]);
      right.push([X(sx + half + wave), Y(bt + t * L)]);
    }
    poly(ctx, [...left, ...right.reverse()], color);
    // Ganja (pangkal bilah) dan rumbai yang menjuntai
    poly(ctx, [[X(sx - 4.5), Y(bt)], [X(sx + 4.5), Y(bt)], [X(sx + 3), Y(bt - 2.5)], [X(sx - 3), Y(bt - 2.5)]], color);
    poly(ctx, [[X(sx - 2.5), Y(bt - 2)], [X(sx + 2.5), Y(bt - 2)], [X(sx + 1 - 3 * wind), Y(bt - 13)], [X(sx - 4 - 3 * wind), Y(bt - 11)]], color);
  } else {
    line(ctx, [[X(18), Y(78)], [X(22), Y(62)], [X(20), Y(50)]], 5.5 * u, color);
  }
  return { spearTipX: X(sx), spearTipY: Y((opt.spearTop ?? 150) + 26) };
}

// ------------------------------------------------------------------
// BANYU: bocah kurus, rambut berantakan, ikat kepala yang berkibar.
// pose: 'stand' | 'raise' (mengangkat keris) | 'look' (memandang laut)
// ------------------------------------------------------------------
export function banyu(ctx, x, y, h, color, opt = {}) {
  const u = h / 100;
  const f = opt.facing ?? 1;
  const pose = opt.pose ?? 'stand';
  const wind = opt.wind ?? 1;
  const X = (dx) => x + dx * u * f;
  const Y = (dy) => y - dy * u;

  // Kaki
  line(ctx, [[X(-5), Y(32)], [X(-8), Y(1)]], 6 * u, color);
  line(ctx, [[X(5), Y(32)], [X(8), Y(1)]], 6 * u, color);
  // Celana komprang sampai lutut
  poly(ctx, [[X(-10), Y(50)], [X(10), Y(50)], [X(13), Y(28)], [X(2), Y(27)], [X(0), Y(34)], [X(-2), Y(27)], [X(-13), Y(28)]], color);
  // Badan
  poly(ctx, [[X(-10), Y(50)], [X(10), Y(50)], [X(13), Y(70)], [X(-13), Y(70)]], color);
  ell(ctx, X(-11), Y(69), 3.5 * u, 3 * u, color);
  ell(ctx, X(11), Y(69), 3.5 * u, 3 * u, color);
  // Leher dan kepala (kepala besar, khas anak-anak)
  ctx.fillStyle = color;
  ctx.fillRect(Math.min(X(-3), X(3)), Y(77), 6 * u, 8 * u);
  ell(ctx, X(1), Y(84), 9.5 * u, 10 * u, color);
  // Rambut berantakan
  const spikes = [[-9, 90, -14, 97], [-5, 93, -6, 101], [0, 94, 2, 102], [5, 93, 9, 100], [8, 89, 14, 93]];
  for (const [ax, ay, bx, by] of spikes) poly(ctx, [[X(ax - 3), Y(ay - 2)], [X(bx), Y(by)], [X(ax + 3), Y(ay)]], color);
  // Ikat kepala dan ekornya yang berkibar
  poly(ctx, [[X(-8), Y(90)], [X(-14 - 5 * wind), Y(88)], [X(-17 - 6 * wind), Y(82)], [X(-8), Y(86)]], color);
  poly(ctx, [[X(-8), Y(87)], [X(-12 - 4 * wind), Y(78)], [X(-10 - 4 * wind), Y(75)], [X(-6), Y(84)]], color);

  let tip = null;
  if (pose === 'raise') {
    // Tangan kiri mengepal di samping
    line(ctx, [[X(-12), Y(68)], [X(-17), Y(55)], [X(-15), Y(45)]], 4.5 * u, color);
    // Tangan kanan mengangkat keris
    line(ctx, [[X(12), Y(68)], [X(20), Y(82)], [X(22), Y(100)]], 4.5 * u, color);
    poly(ctx, [[X(19), Y(100)], [X(25), Y(100)], [X(24), Y(104)], [X(20), Y(104)]], color);
    // Bilah keris berluk
    const pts = [[X(20.5), Y(104)]];
    for (let i = 1; i <= 7; i++) pts.push([X(20.5 + (i % 2 ? -1.4 : 1)), Y(104 + i * 4.2)]);
    pts.push([X(22.5), Y(140)]);
    for (let i = 7; i >= 1; i--) pts.push([X(24 + (i % 2 ? 1.4 : -1)), Y(104 + i * 4.2)]);
    pts.push([X(24), Y(104)]);
    poly(ctx, pts, color);
    tip = { x: X(22.5), y: Y(132) };
  } else if (pose === 'reach') {
    // Membungkuk sedikit, tangan menjulur ke depan bawah
    line(ctx, [[X(12), Y(68)], [X(22), Y(58)], [X(30), Y(48)]], 4.5 * u, color);
    line(ctx, [[X(-12), Y(68)], [X(-14), Y(54)], [X(-11), Y(44)]], 4.5 * u, color);
  } else {
    line(ctx, [[X(-12), Y(68)], [X(-15), Y(55)], [X(-13), Y(43)]], 4.5 * u, color);
    line(ctx, [[X(12), Y(68)], [X(15), Y(55)], [X(13), Y(43)]], 4.5 * u, color);
  }
  return tip;
}

// Prajurit Pasukan Bayang
export function soldier(ctx, x, y, h, color, opt = {}) {
  const u = h / 100;
  const f = opt.facing ?? 1;
  const X = (dx) => x + dx * u * f;
  const Y = (dy) => y - dy * u;
  line(ctx, [[X(-6), Y(40)], [X(-12), Y(1)]], 7 * u, color);
  line(ctx, [[X(6), Y(40)], [X(12), Y(1)]], 7 * u, color);
  poly(ctx, [[X(-12), Y(62)], [X(12), Y(62)], [X(16), Y(32)], [X(-16), Y(32)]], color);
  poly(ctx, [[X(-12), Y(60)], [X(12), Y(60)], [X(15), Y(82)], [X(-15), Y(82)]], color);
  ell(ctx, X(0), Y(89), 7 * u, 8 * u, color);
  // Helm berjambul
  poly(ctx, [[X(-8), Y(91)], [X(8), Y(91)], [X(5), Y(100)], [X(-5), Y(100)]], color);
  poly(ctx, [[X(-1), Y(100)], [X(2), Y(100)], [X(-6), Y(110)]], color);
  // Perisai bundar
  ell(ctx, X(15), Y(58), 10 * u, 14 * u, color);
  // Tombak miring
  line(ctx, [[X(-20), Y(10)], [X(6), Y(140)]], 2.2 * u, color, 'butt');
  poly(ctx, [[X(4.5), Y(138)], [X(9), Y(138)], [X(8.5), Y(156)]], color);
}

// Rakyat jelata berlutut / bersujud
export function kneeler(ctx, x, y, h, color, opt = {}) {
  const u = h / 100;
  const f = opt.facing ?? 1;
  const X = (dx) => x + dx * u * f;
  const Y = (dy) => y - dy * u;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(X(-26), Y(0));
  ctx.quadraticCurveTo(X(-28), Y(40), X(-8), Y(52));
  ctx.quadraticCurveTo(X(12), Y(58), X(22), Y(34));
  ctx.lineTo(X(26), Y(20));
  ctx.lineTo(X(14), Y(12));
  ctx.lineTo(X(6), Y(0));
  ctx.closePath();
  ctx.fill();
  ell(ctx, X(26), Y(26), 8 * u, 8.5 * u, color);
  // Tangan terulur ke tanah
  line(ctx, [[X(16), Y(36)], [X(30), Y(12)], [X(36), Y(2)]], 5 * u, color);
  if (opt.child) ell(ctx, X(-20), Y(28), 10 * u, 16 * u, color);
}

// Bangsawan duduk bersila menunduk
export function seated(ctx, x, y, h, color, opt = {}) {
  const u = h / 100;
  const f = opt.facing ?? 1;
  const X = (dx) => x + dx * u * f;
  const Y = (dy) => y - dy * u;
  ell(ctx, X(0), Y(10), 26 * u, 11 * u, color);
  poly(ctx, [[X(-14), Y(12)], [X(14), Y(12)], [X(16), Y(52)], [X(-10), Y(56)]], color);
  ell(ctx, X(10), Y(62), 9 * u, 10 * u, color);
  poly(ctx, [[X(2), Y(68)], [X(16), Y(68)], [X(13), Y(78)], [X(4), Y(78)]], color);
}

// Rakyat berdiri biasa (penduduk desa)
export function villager(ctx, x, y, h, color, opt = {}) {
  const u = h / 100;
  const f = opt.facing ?? 1;
  const X = (dx) => x + dx * u * f;
  const Y = (dy) => y - dy * u;
  poly(ctx, [[X(-10), Y(60)], [X(10), Y(60)], [X(14), Y(0)], [X(-14), Y(0)]], color);
  poly(ctx, [[X(-11), Y(60)], [X(11), Y(60)], [X(12), Y(80)], [X(-12), Y(80)]], color);
  ell(ctx, X(0), Y(89), 8 * u, 9 * u, color);
  if (opt.hat) poly(ctx, [[X(-18), Y(92)], [X(18), Y(92)], [X(0), Y(106)]], color);
  if (opt.bundle) ell(ctx, X(0), Y(104), 10 * u, 6 * u, color);
}

// ------------------------------------------------------------------
// BANGUNAN
// ------------------------------------------------------------------

// Pendapa beratap joglo (balairung istana)
export function joglo(ctx, cx, by, w, color) {
  const u = w / 100;
  ctx.fillStyle = color;
  // Lantai bertingkat dan tangga
  ctx.fillRect(cx - 54 * u, by - 4 * u, 108 * u, 4 * u + 1);
  ctx.fillRect(cx - 50 * u, by - 8 * u, 100 * u, 4 * u + 1);
  // Tiang-tiang
  for (let i = 0; i < 8; i++) {
    const px = cx - 44 * u + i * (88 / 7) * u;
    ctx.fillRect(Math.round(px), by - 33 * u, Math.max(1, 2 * u), 26 * u);
  }
  // Atap bawah (melengkung)
  ctx.beginPath();
  ctx.moveTo(cx - 60 * u, by - 31 * u);
  ctx.quadraticCurveTo(cx - 45 * u, by - 34 * u, cx - 30 * u, by - 44 * u);
  ctx.lineTo(cx + 30 * u, by - 44 * u);
  ctx.quadraticCurveTo(cx + 45 * u, by - 34 * u, cx + 60 * u, by - 31 * u);
  ctx.lineTo(cx + 60 * u, by - 29 * u);
  ctx.lineTo(cx - 60 * u, by - 29 * u);
  ctx.closePath();
  ctx.fill();
  // Atap atas (brunjung) yang curam
  ctx.beginPath();
  ctx.moveTo(cx - 32 * u, by - 43 * u);
  ctx.quadraticCurveTo(cx - 20 * u, by - 50 * u, cx - 11 * u, by - 68 * u);
  ctx.lineTo(cx + 11 * u, by - 68 * u);
  ctx.quadraticCurveTo(cx + 20 * u, by - 50 * u, cx + 32 * u, by - 43 * u);
  ctx.closePath();
  ctx.fill();
  // Bubungan dan hiasan ujung
  ctx.fillRect(cx - 13 * u, by - 70 * u, 26 * u, 2.5 * u);
  poly(ctx, [[cx - 13 * u, by - 69 * u], [cx - 17 * u, by - 76 * u], [cx - 11 * u, by - 70 * u]], color);
  poly(ctx, [[cx + 13 * u, by - 69 * u], [cx + 17 * u, by - 76 * u], [cx + 11 * u, by - 70 * u]], color);
}

// Candi bentar (gapura terbelah) khas era Wilwapura
export function candiBentar(ctx, cx, by, h, gap, color) {
  const u = h / 100;
  ctx.fillStyle = color;
  for (const side of [-1, 1]) {
    const inner = cx + side * gap * 0.5;
    const rect = (x0, w, y0, hh) => {
      const a = inner;
      const b = inner + side * w * u;
      ctx.fillRect(Math.min(a, b), by - (y0 + hh) * u, Math.abs(b - a), hh * u + 1);
    };
    rect(0, 46, 0, 10); // kaki
    rect(0, 40, 10, 6);
    rect(0, 34, 16, 34); // tubuh
    rect(0, 38, 50, 4); // pelipit
    let w = 34;
    let yy = 54;
    for (let i = 0; i < 6; i++) {
      rect(0, w, yy, 6);
      rect(0, w + 3, yy + 5, 1.6);
      w -= 5;
      yy += 7;
    }
    rect(0, 6, yy, 8); // puncak
  }
}

// Meru (menara beratap tumpang)
export function meru(ctx, cx, by, w, tiers, color) {
  const u = w / 100;
  ctx.fillStyle = color;
  ctx.fillRect(cx - 30 * u, by - 30 * u, 60 * u, 30 * u);
  let y = by - 30 * u;
  let ww = 100;
  for (let i = 0; i < tiers; i++) {
    poly(ctx, [[cx - ww * 0.5 * u, y], [cx + ww * 0.5 * u, y], [cx + ww * 0.34 * u, y - 10 * u], [cx - ww * 0.34 * u, y - 10 * u]], color);
    ctx.fillRect(cx - ww * 0.2 * u, y - 13 * u, ww * 0.4 * u, 3 * u + 1);
    y -= 13 * u;
    ww *= 0.84;
  }
  ctx.fillRect(cx - 1 * u, y - 10 * u, Math.max(1, 2 * u), 10 * u);
}

// Rumah panggung nelayan di atas air
export function stiltHut(ctx, x, floorY, waterY, w, color, opt = {}) {
  ctx.fillStyle = color;
  // Tiang
  for (const px of [0.05, 0.35, 0.65, 0.92]) ctx.fillRect(Math.round(x + px * w), floorY, 1, waterY - floorY);
  // Lantai
  ctx.fillRect(x - 2, floorY - 1, w + 4, 2);
  // Dinding
  ctx.fillRect(x, floorY - w * 0.42, w, w * 0.42);
  // Atap rumbia (pelana) dengan tepi bergerigi
  ctx.beginPath();
  ctx.moveTo(x - w * 0.18, floorY - w * 0.38);
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    ctx.lineTo(x - w * 0.18 + t * w * 1.36, floorY - w * 0.38 + (i % 2 ? 1.5 : 0));
  }
  ctx.lineTo(x + w * 0.5, floorY - w * 1.02);
  ctx.closePath();
  ctx.fill();
  // Tangga
  if (opt.ladder) {
    line(ctx, [[x + w + 2, floorY], [x + w + 6, waterY]], 1, color, 'butt');
  }
}

// Pohon kelapa
export function palm(ctx, x, by, h, color, lean = 0.3, seed = 1) {
  const tx = x + lean * h * 0.45;
  const ty = by - h;
  // Batang melengkung
  const steps = 24;
  ctx.fillStyle = color;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = x + (tx - x) * t * t;
    const py = by + (ty - by) * t;
    const r = (1 - t) * h * 0.035 + h * 0.018;
    ctx.beginPath();
    ctx.arc(px, py, Math.max(0.6, r), 0, Math.PI * 2);
    ctx.fill();
  }
  // Pelepah daun yang menjuntai
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI + (i / (n - 1)) * Math.PI + Math.sin(seed * 7 + i) * 0.15;
    const len = h * (0.42 + 0.1 * Math.sin(seed * 3 + i * 2));
    const ex = tx + Math.cos(a) * len;
    const ey = ty + Math.sin(a) * len * 0.35 + len * 0.45;
    const mx = tx + Math.cos(a) * len * 0.55;
    const my = ty + Math.sin(a) * len * 0.6 - len * 0.05;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(mx, my - h * 0.04, ex, ey);
    ctx.quadraticCurveTo(mx, my + h * 0.05, tx, ty + h * 0.02);
    ctx.fill();
  }
  // Buah kelapa
  ell(ctx, tx - 1, ty + 2, h * 0.03 + 0.6, h * 0.03 + 0.6, color);
}

// Kapal jong besar dengan layar tanja (miring)
export function jong(ctx, x, wy, s, hull, sail, flag) {
  const X = (dx) => x + dx * s;
  const Y = (dy) => wy - dy * s;
  // Lambung kapal
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(X(-34), Y(12));
  ctx.lineTo(X(-26), Y(7));
  ctx.lineTo(X(24), Y(7));
  ctx.lineTo(X(36), Y(13));
  ctx.quadraticCurveTo(X(30), Y(-2), X(16), Y(-3));
  ctx.lineTo(X(-20), Y(-3));
  ctx.quadraticCurveTo(X(-30), Y(0), X(-34), Y(12));
  ctx.fill();
  // Anjungan buritan
  ctx.fillRect(X(-28), Y(14), 10 * s, 6 * s);
  poly(ctx, [[X(-30), Y(14)], [X(-16), Y(14)], [X(-23), Y(18)]], hull);
  // Tiang dan layar
  const masts = [[-8, 44], [8, 38], [22, 24]];
  for (const [mx, mh] of masts) {
    ctx.fillStyle = hull;
    ctx.fillRect(X(mx), Y(mh + 2), Math.max(1, 1.2 * s), mh * s - 4 * s);
    const pts = [[X(mx - 11), Y(10)], [X(mx + 11), Y(12)], [X(mx + 13), Y(mh)], [X(mx - 7), Y(mh - 5)]];
    poly(ctx, pts, sail);
    // Bilah-bilah layar
    ctx.strokeStyle = hull;
    ctx.lineWidth = 1;
    for (let k = 1; k < 4; k++) {
      const t = k / 4;
      const ax = pts[0][0] + (pts[3][0] - pts[0][0]) * t;
      const ay = pts[0][1] + (pts[3][1] - pts[0][1]) * t;
      const bx = pts[1][0] + (pts[2][0] - pts[1][0]) * t;
      const byy = pts[1][1] + (pts[2][1] - pts[1][1]) * t;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, byy);
      ctx.stroke();
    }
    // Panji di puncak tiang
    if (flag) poly(ctx, [[X(mx), Y(mh + 2)], [X(mx), Y(mh + 6)], [X(mx - 9), Y(mh + 5)]], flag);
  }
  // Cadik / dayung samping
  ctx.fillStyle = hull;
  ctx.fillRect(X(-22), Y(3), 40 * s, Math.max(1, s));
}

// Perahu jukung kecil bercadik
export function jukung(ctx, x, wy, s, color, opt = {}) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, wy - 3 * s);
  ctx.quadraticCurveTo(x, wy + 2 * s, x + 12 * s, wy - 3 * s);
  ctx.lineTo(x + 9 * s, wy);
  ctx.lineTo(x - 9 * s, wy);
  ctx.closePath();
  ctx.fill();
  // Cadik
  ctx.fillRect(x - 6 * s, wy - 2 * s, 1, 3 * s);
  ctx.fillRect(x + 5 * s, wy - 2 * s, 1, 3 * s);
  ctx.fillRect(x - 10 * s, wy + 1 * s, 20 * s, 1);
  if (opt.sail) poly(ctx, [[x, wy - 3 * s], [x, wy - 18 * s], [x + 9 * s, wy - 5 * s]], color);
  if (opt.fisher) {
    ell(ctx, x - 3 * s, wy - 8 * s, 1.5 * s, 1.6 * s, color);
    ctx.fillRect(x - 4.2 * s, wy - 7 * s, 2.4 * s, 5 * s);
    poly(ctx, [[x - 7 * s, wy - 9 * s], [x + 1 * s, wy - 9 * s], [x - 3 * s, wy - 11.5 * s]], color);
  }
}

// Gunung api
export function volcanoPeak(x, top, slope, crater) {
  return { x, top, slope, crater };
}
