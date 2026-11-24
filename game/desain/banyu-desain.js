// Tiga konsep desain BANYU (tokoh utama). Nanti satu dipilih untuk game.
import { PixelCanvas } from '../src/art/pixelkit.js';

const OUT = '#24121a'; // garis tepi

// Kulit sawo matang
const SKIN = { s0: '#eab78c', s1: '#d0966a', s2: '#a86a42', s3: '#7a4429' };

// ------------------------------------------------------------------
// Bagian wajah yang dipakai bersama
// ------------------------------------------------------------------
function head(pc, K = SKIN) {
  // Leher
  pc.rect(27, 44, 10, 12, K.s1);
  pc.within(K.s1, () => pc.poly([[27, 44], [37, 44], [37, 50], [32, 52], [27, 50]], K.s2));
  // Telinga
  pc.ellipse(18, 34, 2.4, 3.8, K.s1);
  pc.ellipse(46, 34, 2.4, 3.8, K.s2);
  pc.set(18, 33, K.s2);
  pc.set(18, 34, K.s2);
  pc.set(46, 34, K.s3);
  // Bentuk kepala
  pc.poly([[19, 17], [45, 17], [47, 26], [47, 34], [45, 40], [40, 46], [35, 49], [29, 49], [24, 46], [19, 40], [17, 34], [17, 26]], K.s1);
  // Bayangan sisi kanan wajah (cahaya dari kiri atas)
  pc.within(K.s1, () => pc.poly([[42, 17], [48, 17], [48, 35], [45, 41], [40, 47], [35, 50], [33, 50], [38, 45], [42, 39], [44, 32], [44, 24]], K.s2));
  // Kilau pipi kiri
  pc.within(K.s1, () => {
    pc.set(22, 38, K.s0);
    pc.set(23, 38, K.s0);
    pc.set(21, 37, K.s0);
  });
  // Hidung
  pc.set(33, 38, K.s2);
  pc.set(33, 39, K.s2);
  pc.set(32, 40, K.s3);
  pc.set(33, 40, K.s3);
}

// Bayangan rambut di dahi (digambar sebelum poni)
function foreheadShadow(pc, y0 = 23, y1 = 26, K = SKIN) {
  pc.within([K.s1, K.s0], () => pc.rect(17, y0, 31, y1 - y0 + 1, K.s2));
  pc.within([K.s2], () => pc.rect(42, y0, 6, y1 - y0 + 1, K.s3));
}

function eyes(pc, iris, pupil, hi, style = 'normal') {
  const map = { K: OUT, I: iris, P: pupil, H: hi, W: '#f6efe6', L: SKIN.s3 };
  const rows = {
    normal: ['..KKKK.', '.KKKKKK', 'K.IHIW.', '..IPIW.', '..III..', '...LL..'],
    tajam: ['.......', 'KKKKKKK', '.KIHIWK', '..IPIW.', '..III..', '...LL..'],
    ceria: ['..KKKK.', '.KKKKKK', 'K.IHIW.', '..IPIW.', '..LIL..', '.......'],
  }[style];
  pc.patch(22, 30, rows, map);
  pc.patch(36, 30, rows, map, true);
}

function brows(pc, c, style = 'normal') {
  if (style === 'marah') {
    // Alis menukik ke tengah (bertekad)
    pc.line(21, 26, 27, 28, c).line(21, 27, 26, 29, c);
    pc.line(43, 26, 37, 28, c).line(43, 27, 38, 29, c);
  } else if (style === 'jahil') {
    // Alis kiri naik, kanan turun
    pc.line(21, 27, 23, 25, c).line(23, 25, 27, 26, c).line(22, 27, 27, 27, c);
    pc.line(37, 28, 43, 27, c).line(37, 29, 42, 28, c);
  } else {
    pc.line(21, 28, 23, 26, c).line(23, 26, 27, 27, c).line(22, 28, 27, 28, c);
    pc.line(43, 28, 41, 26, c).line(41, 26, 37, 27, c).line(42, 28, 37, 28, c);
  }
}

function mouth(pc, style) {
  const map = { K: OUT, T: '#f4eee0', M: '#6a2422', R: '#b8504a', S: SKIN.s2 };
  if (style === 'nyengir') pc.patch(28, 42, ['KKKKKKK', '.TTTTT.', '..MRM..', '...S...'], map);
  else if (style === 'senyum-miring') pc.patch(29, 43, ['.....K', 'KKKKK.', '.SS...'], map);
  else pc.patch(29, 43, ['.KKKK.', '..SS..'], map);
}

// ------------------------------------------------------------------
// KONSEP A: "ANAK PANTAI"
// Polos dan ceria. Rompi nila terbuka, kalung kerang, rambut hitam berantakan.
// ------------------------------------------------------------------
const A = {
  hair: { h0: '#55557e', h1: '#2a2840', h2: '#16142a' },
  vest: { v0: '#4f6cc0', v1: '#2f428a', v2: '#1e2a5e' },
  trim: '#e7c873',
  shell: '#f6ecd8',
};

export function portraitA() {
  const pc = new PixelCanvas(64, 64);
  const H = A.hair;
  // Badan: dada telanjang dengan rompi
  pc.poly([[6, 64], [10, 57], [19, 52], [27, 50], [37, 50], [45, 52], [54, 57], [58, 64]], SKIN.s1);
  pc.within(SKIN.s1, () => {
    pc.poly([[40, 51], [46, 52], [54, 57], [58, 64], [44, 64], [42, 58]], SKIN.s2);
    pc.line(27, 54, 30, 55, SKIN.s2).line(37, 54, 34, 55, SKIN.s2);
    pc.line(26, 61, 30, 62, SKIN.s2).line(38, 61, 34, 62, SKIN.s2);
  });
  pc.poly([[6, 64], [10, 57], [19, 52], [26, 50], [24, 57], [23, 64]], A.vest.v1);
  pc.poly([[58, 64], [54, 57], [45, 52], [38, 50], [40, 57], [41, 64]], A.vest.v2);
  pc.within(A.vest.v1, () => pc.poly([[9, 58], [18, 53], [20, 54], [12, 60]], A.vest.v0));
  pc.line(26, 50, 23, 64, A.trim).line(38, 50, 41, 64, A.trim);
  head(pc);
  foreheadShadow(pc);
  eyes(pc, '#5a3422', '#1e1010', '#ffffff', 'ceria');
  brows(pc, H.h2, 'normal');
  mouth(pc, 'nyengir');
  // Kalung tali dengan kerang
  pc.line(27, 51, 29, 55, '#5a3a24').line(29, 55, 32, 57, '#5a3a24').line(32, 57, 35, 55, '#5a3a24').line(35, 55, 37, 51, '#5a3a24');
  pc.ellipse(29.5, 56, 1.2, 1.2, A.shell);
  pc.ellipse(34.5, 56, 1.2, 1.2, A.shell);
  pc.ellipse(32, 59, 1.8, 2.2, A.shell);
  pc.set(32, 59, '#cdb89a');
  pc.set(32, 60, '#cdb89a');

  const hl = pc.layer();
  // Rambut: massa utama
  hl.poly([[15, 27], [13, 17], [18, 9], [26, 5], [35, 4], [43, 6], [49, 11], [51, 19], [50, 28], [47, 31], [46, 23], [18, 23], [17, 31]], H.h1);
  // Jambul-jambul berantakan di atas
  for (const t of [[[18, 10], [25, 6], [16, 2]], [[26, 6], [33, 4], [28, 0]], [[34, 4], [41, 6], [40, 0]], [[42, 7], [49, 12], [55, 6]], [[13, 16], [18, 10], [9, 9]], [[48, 14], [51, 20], [57, 15]]]) hl.poly(t, H.h1);
  // Poni
  for (const t of [[[18, 22], [24, 22], [20, 30]], [[23, 22], [29, 22], [26, 29]], [[28, 22], [35, 22], [31, 28]], [[34, 22], [40, 22], [38, 29]], [[39, 22], [46, 22], [44, 31]]]) hl.poly(t, H.h1);
  // Bayangan & kilau rambut
  hl.within(H.h1, () => {
    hl.poly([[40, 8], [52, 14], [52, 30], [46, 31], [45, 22], [38, 22]], H.h2);
    hl.rect(17, 22, 30, 2, H.h2);
    hl.line(21, 12, 25, 10, H.h0).line(27, 9, 31, 8, H.h0).line(33, 8, 36, 8, H.h0).line(22, 13, 24, 12, H.h0);
    hl.line(15, 18, 16, 15, H.h0);
  });
  hl.outline(OUT);
  pc.draw(hl);
  pc.outline(OUT);
  return pc;
}

// ------------------------------------------------------------------
// KONSEP B: "PEWARIS PUSAKA"
// Serius dan pemberani. Iket batik biru-hijau, baju kutung krem, selendang.
// ------------------------------------------------------------------
const B = {
  hair: { h0: '#4a5878', h1: '#1e2232', h2: '#0f111b' },
  iket: { i0: '#46b6b2', i1: '#1f7f82', i2: '#13555a', dot: '#e6f4e8' },
  baju: { b0: '#f4ead2', b1: '#dccba4', b2: '#b09a72' },
  gold: { g0: '#f2d46a', g1: '#c9962e' },
};

export function portraitB() {
  const pc = new PixelCanvas(64, 64);
  const H = B.hair;
  // Rambut belakang (pendek, hanya terlihat di samping)
  pc.poly([[15, 22], [49, 22], [50, 33], [47, 40], [17, 40], [14, 33]], H.h2);
  // Baju kutung (tanpa lengan) dengan kerah V
  pc.poly([[6, 64], [10, 57], [19, 52], [27, 50], [37, 50], [45, 52], [54, 57], [58, 64]], B.baju.b1);
  pc.poly([[6, 64], [10, 57], [14, 54], [14, 64]], SKIN.s1);
  pc.poly([[58, 64], [54, 57], [50, 54], [50, 64]], SKIN.s2);
  pc.within(B.baju.b1, () => {
    pc.poly([[14, 55], [20, 52], [24, 53], [17, 58]], B.baju.b0);
    pc.poly([[40, 52], [46, 53], [50, 55], [50, 64], [44, 64]], B.baju.b2);
  });
  pc.poly([[27, 50], [37, 50], [32, 58]], SKIN.s1);
  pc.within(SKIN.s1, () => pc.poly([[34, 50], [37, 50], [32, 58]], SKIN.s2));
  pc.line(27, 50, 32, 58, B.baju.b2).line(37, 50, 32, 58, B.baju.b2);
  // Selendang diagonal
  pc.poly([[38, 51], [44, 52], [26, 64], [18, 64]], B.iket.i1);
  pc.within(B.iket.i1, () => {
    pc.line(39, 52, 21, 64, B.iket.i0);
    pc.line(43, 53, 26, 64, B.iket.i2);
  });
  // Kelat bahu emas
  pc.rect(10, 58, 4, 2, B.gold.g0).rect(50, 58, 4, 2, B.gold.g1);
  head(pc);
  foreheadShadow(pc, 22, 25);
  eyes(pc, '#3a2418', '#120a08', '#8af0ff', 'tajam');
  brows(pc, H.h2, 'marah');
  mouth(pc, 'datar');
  // Rambut depan: jambul mencuat di atas iket, poni menyamping, cambang pendek
  const hl = pc.layer();
  hl.poly([[15, 21], [14, 13], [19, 7], [28, 3], [38, 4], [46, 8], [50, 15], [50, 21]], H.h1);
  for (const t of [[[19, 9], [26, 5], [19, 0]], [[28, 4], [35, 3], [33, -2]], [[38, 4], [45, 8], [49, 1]], [[45, 9], [50, 15], [56, 9]]]) hl.poly(t, H.h1);
  hl.poly([[16, 21], [22, 21], [20, 33], [18, 37], [16, 31]], H.h1);
  hl.poly([[42, 21], [48, 21], [48, 31], [47, 37], [44, 33]], H.h1);
  for (const t of [[[19, 21], [30, 21], [21, 31]], [[27, 21], [36, 21], [30, 28]], [[34, 21], [43, 21], [41, 29]]]) hl.poly(t, H.h1);
  hl.within(H.h1, () => {
    hl.poly([[42, 6], [56, 9], [50, 21], [48, 37], [44, 34], [42, 21]], H.h2);
    hl.line(21, 9, 26, 7, H.h0).line(29, 5, 34, 5, H.h0).line(16, 15, 18, 11, H.h0);
    hl.line(17, 23, 18, 29, H.h0);
  });
  hl.outline(OUT);
  pc.draw(hl);
  // Iket (ikat kepala batik) melintang di atas dahi
  pc.poly([[14, 15], [24, 11], [40, 11], [50, 15], [50, 20], [40, 17], [24, 17], [14, 21]], B.iket.i1);
  pc.within(B.iket.i1, () => {
    pc.poly([[14, 15], [24, 11], [32, 11], [32, 13], [24, 13], [14, 17]], B.iket.i0);
    pc.poly([[40, 17], [50, 20], [50, 18], [40, 15]], B.iket.i2);
    for (const [x, y] of [[18, 17], [23, 15], [28, 14], [33, 14], [38, 14], [43, 16], [47, 18]]) pc.set(x, y, B.iket.dot);
  });
  // Simpul dan ekor iket di sisi kanan
  pc.ellipse(51, 17, 3, 3, B.iket.i1);
  pc.poly([[52, 18], [58, 26], [56, 30], [50, 21]], B.iket.i1);
  pc.poly([[53, 16], [61, 18], [60, 22], [52, 19]], B.iket.i2);
  pc.set(51, 16, B.iket.i0);
  pc.outline(OUT);
  return pc;
}

// ------------------------------------------------------------------
// KONSEP C: "NELAYAN LINCAH"
// Jahil dan cerdik. Rambut merah kecokelatan terbakar matahari,
// caping di punggung, kain kotak-kotak oranye diselempangkan.
// ------------------------------------------------------------------
const C = {
  hair: { h0: '#d08a50', h1: '#94502c', h2: '#5e2c1a' },
  caping: { c0: '#ecc878', c1: '#c99a4a', c2: '#946a2c' },
  shirt: { t0: '#4c5c88', t1: '#2e3858', t2: '#1d2340' },
  kain: { k0: '#f08a3a', k1: '#c25a1e', k2: '#7e3412' },
};

export function portraitC() {
  const pc = new PixelCanvas(64, 64);
  const H = C.hair;
  // Caping (topi bambu) tergantung di punggung: terlihat seperti lingkaran di belakang kepala
  pc.ellipse(32, 26, 29, 25, C.caping.c1);
  pc.within(C.caping.c1, () => {
    pc.ellipse(29, 22, 24, 20, C.caping.c0);
    for (let a = 0; a < 16; a++) {
      const ang = (a / 16) * Math.PI * 2;
      pc.line(32, 26, 32 + Math.cos(ang) * 30, 26 + Math.sin(ang) * 26, C.caping.c2);
    }
  });
  pc.within(C.caping.c0, () => {
    for (let a = 0; a < 16; a++) {
      const ang = (a / 16) * Math.PI * 2;
      pc.line(32, 26, 32 + Math.cos(ang) * 30, 26 + Math.sin(ang) * 26, C.caping.c1);
    }
  });
  // Kemeja lusuh warna biru tua
  pc.poly([[6, 64], [10, 57], [19, 52], [27, 50], [37, 50], [45, 52], [54, 57], [58, 64]], C.shirt.t1);
  pc.within(C.shirt.t1, () => {
    pc.poly([[10, 58], [18, 53], [22, 54], [13, 61]], C.shirt.t0);
    pc.poly([[42, 52], [46, 53], [54, 57], [58, 64], [46, 64]], C.shirt.t2);
  });
  // Kerah terbuka
  pc.poly([[28, 50], [36, 50], [32, 56]], SKIN.s1);
  pc.poly([[25, 50], [28, 50], [31, 56], [27, 55]], C.shirt.t0);
  pc.poly([[39, 50], [36, 50], [33, 56], [37, 55]], C.shirt.t2);
  // Kain kotak-kotak oranye diselempangkan
  pc.poly([[16, 53], [23, 51], [46, 64], [36, 64]], C.kain.k1);
  pc.within(C.kain.k1, () => {
    for (let y = 50; y < 64; y++) for (let x = 14; x < 48; x++) if (((x >> 1) + (y >> 1)) % 2 === 0) pc.set(x, y, C.kain.k0);
    pc.line(16, 54, 37, 64, C.kain.k2);
  });
  // Tali caping di leher
  pc.line(20, 44, 27, 51, '#7a5a30').line(44, 44, 37, 51, '#7a5a30');
  head(pc);
  foreheadShadow(pc, 23, 26);
  eyes(pc, '#8a5418', '#2a1408', '#ffffff', 'normal');
  brows(pc, H.h2, 'jahil');
  mouth(pc, 'senyum-miring');
  // Plester di pipi
  pc.rect(38, 38, 5, 3, '#f2dcb0');
  pc.set(39, 39, '#c8aa80');
  pc.set(41, 39, '#c8aa80');
  const hl = pc.layer();
  // Rambut liar mencuat ke samping
  hl.poly([[14, 28], [12, 18], [17, 9], [26, 4], [36, 4], [45, 7], [51, 13], [52, 22], [50, 30], [47, 32], [46, 23], [18, 23], [17, 33]], H.h1);
  for (const t of [[[14, 16], [18, 11], [5, 10]], [[13, 22], [15, 28], [4, 26]], [[19, 8], [27, 5], [22, -1]], [[29, 4], [37, 4], [35, -2]], [[40, 5], [48, 9], [52, 1]], [[48, 11], [52, 18], [61, 12]], [[50, 20], [51, 28], [60, 26]]]) hl.poly(t, H.h1);
  for (const t of [[[18, 22], [25, 22], [19, 31]], [[24, 22], [31, 22], [28, 29]], [[30, 22], [37, 22], [33, 27]], [[36, 22], [43, 22], [41, 30]], [[41, 22], [47, 22], [46, 32]]]) hl.poly(t, H.h1);
  hl.within(H.h1, () => {
    hl.poly([[44, 8], [62, 12], [60, 30], [47, 32], [46, 22], [42, 22]], H.h2);
    hl.rect(17, 22, 30, 2, H.h2);
    hl.line(20, 11, 25, 8, H.h0).line(27, 7, 33, 6, H.h0).line(15, 17, 17, 13, H.h0).line(8, 11, 13, 13, H.h0).line(22, 2, 24, 6, H.h0);
  });
  hl.outline(OUT);
  pc.draw(hl);
  pc.outline(OUT);
  return pc;
}

// ==================================================================
// BADAN PENUH (48x86) dan SPRITE GAME (16x24)
// ==================================================================

// Kepala kecil untuk gambar badan penuh
function smallHead(pc, o) {
  const K = SKIN;
  pc.rect(22, 19, 5, 5, K.s1);
  pc.rect(22, 19, 5, 1, K.s2);
  pc.poly([[18, 7], [30, 7], [31, 12], [31, 15], [29, 18], [26, 20], [22, 20], [19, 18], [17, 15], [17, 12]], K.s1);
  pc.within(K.s1, () => pc.poly([[28, 7], [32, 7], [32, 15], [29, 19], [26, 21], [25, 21], [28, 17], [29, 13]], K.s2));
  pc.set(16, 13, K.s1).set(16, 14, K.s1).set(32, 13, K.s2).set(32, 14, K.s2);
  // Mata
  pc.rect(19, 13, 3, 1, OUT).rect(26, 13, 3, 1, OUT);
  pc.set(20, 14, o.iris).set(21, 14, o.hi ?? '#ffffff').set(19, 14, OUT);
  pc.set(27, 14, o.iris).set(26, 14, o.hi ?? '#ffffff').set(28, 14, OUT);
  // Alis
  if (o.brow === 'marah') pc.line(19, 11, 21, 12, o.browC).line(29, 11, 27, 12, o.browC);
  else if (o.brow === 'jahil') pc.line(19, 11, 21, 10, o.browC).line(26, 12, 28, 12, o.browC);
  else pc.line(19, 11, 21, 11, o.browC).line(26, 11, 28, 11, o.browC);
  pc.set(25, 16, K.s2);
  if (o.mouth === 'nyengir') pc.set(22, 17, OUT).rect(23, 17, 2, 1, '#f4eee0').set(25, 17, OUT).rect(23, 18, 2, 1, '#8a4030');
  else if (o.mouth === 'miring') pc.set(23, 18, OUT).set(24, 18, OUT).set(25, 17, OUT);
  else pc.rect(23, 18, 2, 1, OUT);
}

// Tubuh dasar: kaki, badan, lengan (kulit)
function smallBody(pc, arms) {
  const K = SKIN;
  // Kaki
  pc.thick([[21, 44], [20, 62], [20, 80]], 2, K.s1);
  pc.thick([[27, 44], [28, 62], [28, 80]], 2, K.s2);
  pc.poly([[16, 80], [22, 80], [22, 83], [15, 83]], K.s1);
  pc.poly([[26, 80], [32, 80], [33, 83], [26, 83]], K.s2);
  // Badan
  pc.poly([[16, 23], [32, 23], [33, 27], [31, 42], [17, 42], [15, 27]], K.s1);
  pc.within(K.s1, () => pc.poly([[28, 23], [34, 23], [33, 42], [27, 42], [29, 30]], K.s2));
  // Lengan
  pc.thick(arms.left, 1.8, K.s1);
  pc.thick(arms.right, 1.8, K.s2);
  const l = arms.left[arms.left.length - 1];
  const r = arms.right[arms.right.length - 1];
  pc.ellipse(l[0], l[1] + 1, 2, 2, K.s1);
  pc.ellipse(r[0], r[1] + 1, 2, 2, K.s2);
}

export function fullA() {
  const pc = new PixelCanvas(52, 92);
  pc.ox = 2;
  pc.oy = 5;
  const H = A.hair;
  // Joran bambu di belakang
  pc.line(37, 44, 46, 1, '#c9a24e').line(38, 44, 47, 1, '#9a7430');
  pc.line(46, 1, 47, 30, '#e8e0d0');
  smallBody(pc, { left: [[15, 26], [13, 34], [12, 41]], right: [[33, 26], [35, 34], [36, 41]] });
  // Celana batik krem sebatas lutut
  pc.poly([[16, 42], [32, 42], [33, 58], [25, 58], [24, 50], [23, 58], [15, 58]], '#e8d8b0');
  pc.within('#e8d8b0', () => {
    for (let k = -20; k < 40; k += 4) pc.line(14 + k, 42, 14 + k + 16, 58, '#3a4a8a');
    pc.poly([[28, 42], [33, 42], [33, 58], [27, 58]], '#c2b088');
  });
  pc.within('#3a4a8a', () => pc.poly([[28, 42], [33, 42], [33, 58], [27, 58]], '#26305e'));
  // Sabuk kain merah dengan simpul
  pc.rect(16, 41, 17, 3, '#b83a2a').rect(16, 41, 17, 1, '#d85a3a');
  pc.poly([[17, 43], [20, 43], [19, 52], [16, 50]], '#b83a2a');
  // Rompi nila terbuka
  pc.poly([[15, 24], [21, 23], [21, 41], [16, 41], [15, 30]], A.vest.v1);
  pc.poly([[33, 24], [27, 23], [27, 41], [32, 41], [33, 30]], A.vest.v2);
  pc.line(21, 23, 21, 40, A.trim).line(27, 23, 27, 40, A.trim);
  pc.within(A.vest.v1, () => pc.line(16, 25, 17, 33, A.vest.v0));
  // Kalung kerang
  pc.set(22, 25, '#5a3a24').set(23, 26, A.shell).set(24, 27, A.shell).set(25, 26, A.shell).set(26, 25, '#5a3a24');
  smallHead(pc, { iris: '#5a3422', browC: H.h2, mouth: 'nyengir' });
  const hl = pc.layer();
  hl.poly([[16, 13], [15, 7], [19, 3], [25, 1], [31, 3], [33, 8], [32, 14], [30, 10], [18, 10]], H.h1);
  for (const t of [[[17, 4], [21, 2], [14, -1]], [[23, 2], [27, 1], [25, -3]], [[29, 2], [33, 5], [36, -1]], [[32, 7], [34, 11], [37, 6]], [[15, 8], [17, 5], [12, 4]]]) hl.poly(t, H.h1);
  for (const t of [[[18, 10], [22, 10], [19, 14]], [[21, 10], [26, 10], [23, 13]], [[25, 10], [30, 10], [29, 14]]]) hl.poly(t, H.h1);
  hl.within(H.h1, () => {
    hl.poly([[28, 2], [37, 6], [33, 14], [30, 10]], H.h2);
    hl.line(20, 4, 24, 3, H.h0);
  });
  hl.outline(OUT);
  pc.draw(hl);
  pc.outline(OUT);
  return pc;
}

export function fullB() {
  const pc = new PixelCanvas(52, 92);
  pc.ox = 2;
  pc.oy = 5;
  const H = B.hair;
  // Ekor iket berkibar (di belakang)
  pc.poly([[31, 9], [42, 14], [44, 20], [33, 12]], B.iket.i2);
  pc.poly([[31, 10], [39, 20], [37, 23], [31, 13]], B.iket.i1);
  smallBody(pc, { left: [[15, 26], [13, 34], [12, 41]], right: [[33, 26], [35, 33], [32, 39]] });
  // Celana komprang cokelat tua sampai betis
  pc.poly([[16, 44], [32, 44], [34, 67], [26, 67], [24, 52], [22, 67], [14, 67]], '#5a4030');
  pc.within('#5a4030', () => pc.poly([[28, 44], [33, 44], [34, 67], [27, 67]], '#3e2c22'));
  // Baju kutung krem sampai pinggul
  pc.poly([[16, 23], [32, 23], [33, 28], [32, 47], [16, 47], [15, 28]], B.baju.b1);
  pc.within(B.baju.b1, () => {
    pc.poly([[28, 23], [34, 23], [33, 47], [28, 47]], B.baju.b2);
    pc.line(17, 25, 17, 45, B.baju.b0);
  });
  pc.poly([[21, 23], [27, 23], [24, 29]], SKIN.s1);
  // Sabuk
  pc.rect(16, 42, 17, 2, '#6a4a2a');
  // Selendang biru-hijau melintang
  pc.thick([[31, 24], [24, 34], [18, 45]], 1.6, B.iket.i1);
  pc.within(B.iket.i1, () => pc.line(30, 23, 17, 44, B.iket.i0));
  // Keris di pinggang kanan: warangka, gandar, dan hulu bercahaya biru
  pc.poly([[28, 40], [35, 39], [35, 41], [28, 42]], '#7a4a24');
  pc.thick([[33, 41], [35, 56]], 1, '#5a3418');
  pc.rect(31, 37, 2, 3, '#4a2a14');
  pc.set(31, 36, '#8af0ff').set(32, 36, '#c8fbff');
  // Kelat bahu emas
  pc.rect(12, 29, 4, 1, B.gold.g0).rect(33, 29, 4, 1, B.gold.g1);
  smallHead(pc, { iris: '#3a2418', browC: H.h2, brow: 'marah' });
  const hl = pc.layer();
  hl.poly([[16, 13], [15, 7], [19, 3], [25, 1], [31, 3], [33, 8], [32, 15], [30, 10], [18, 10]], H.h1);
  for (const t of [[[18, 3], [23, 1], [18, -2]], [[25, 1], [30, 2], [31, -3]], [[30, 3], [33, 7], [37, 2]]]) hl.poly(t, H.h1);
  hl.poly([[16, 10], [19, 10], [18, 17], [16, 15]], H.h1);
  hl.poly([[30, 10], [32, 10], [32, 16], [30, 16]], H.h1);
  for (const t of [[[18, 10], [24, 10], [19, 14]], [[23, 10], [29, 10], [28, 14]]]) hl.poly(t, H.h1);
  hl.within(H.h1, () => hl.poly([[29, 2], [37, 2], [33, 16], [30, 10]], H.h2));
  // Iket
  hl.poly([[15, 7], [20, 5], [29, 5], [33, 7], [33, 10], [29, 8], [20, 8], [15, 10]], B.iket.i1);
  hl.within(B.iket.i1, () => {
    hl.line(16, 7, 20, 5, B.iket.i0).line(20, 5, 26, 5, B.iket.i0);
    hl.set(19, 7, B.iket.dot).set(23, 6, B.iket.dot).set(27, 6, B.iket.dot);
  });
  hl.ellipse(33, 9, 1.8, 1.8, B.iket.i1);
  hl.outline(OUT);
  pc.draw(hl);
  pc.outline(OUT);
  return pc;
}

export function fullC() {
  const pc = new PixelCanvas(52, 92);
  pc.ox = 2;
  pc.oy = 5;
  const H = C.hair;
  // Caping di punggung
  pc.ellipse(24, 13, 20, 17, C.caping.c1);
  pc.within(C.caping.c1, () => {
    pc.ellipse(22, 11, 17, 14, C.caping.c0);
    for (let a = 0; a < 16; a++) {
      const ang = (a / 16) * Math.PI * 2;
      pc.line(24, 13, 24 + Math.cos(ang) * 21, 13 + Math.sin(ang) * 18, C.caping.c2);
    }
  });
  pc.within(C.caping.c0, () => {
    for (let a = 0; a < 16; a++) {
      const ang = (a / 16) * Math.PI * 2;
      pc.line(24, 13, 24 + Math.cos(ang) * 21, 13 + Math.sin(ang) * 18, C.caping.c1);
    }
  });
  pc.outline(OUT);
  // Tali caping
  pc.line(14, 20, 21, 24, '#7a5a30').line(34, 20, 27, 24, '#7a5a30');
  // Serampang (tombak ikan bermata tiga), batang di belakang tangan
  pc.line(39, 84, 39, 6, '#8a6438').line(40, 84, 40, 6, '#5e4224');
  pc.rect(36, 5, 8, 1, '#b8bcc4');
  pc.line(36, 5, 36, 0, '#d8dce4').line(39, 5, 39, -1, '#ffffff').line(40, 5, 40, -1, '#b8bcc4').line(43, 5, 43, 0, '#b8bcc4');
  pc.set(37, 1, '#d8dce4').set(42, 1, '#b8bcc4');
  smallBody(pc, { left: [[15, 26], [13, 34], [12, 41]], right: [[33, 26], [36, 32], [39, 36]] });
  // Celana pendek cokelat
  pc.poly([[16, 42], [32, 42], [33, 56], [25, 56], [24, 50], [23, 56], [15, 56]], '#7a5636');
  pc.within('#7a5636', () => pc.poly([[28, 42], [33, 42], [33, 56], [27, 56]], '#553a24'));
  // Kemeja biru tua, lengan digulung sampai siku
  pc.poly([[16, 23], [32, 23], [33, 28], [32, 44], [16, 44], [15, 28]], C.shirt.t1);
  pc.within(C.shirt.t1, () => pc.poly([[28, 23], [34, 23], [33, 44], [28, 44]], C.shirt.t2));
  pc.thick([[15, 26], [14, 31]], 2.2, C.shirt.t1);
  pc.thick([[33, 26], [35, 30]], 2.2, C.shirt.t2);
  pc.rect(12, 32, 5, 1, C.shirt.t0).rect(33, 31, 5, 1, C.shirt.t0);
  pc.poly([[21, 23], [27, 23], [24, 28]], SKIN.s1);
  // Kain kotak-kotak oranye diselempangkan
  pc.thick([[17, 24], [24, 33], [31, 43]], 2, C.kain.k1);
  pc.within(C.kain.k1, () => {
    for (let y = 20; y < 48; y++) for (let x = 12; x < 36; x++) if (((x >> 1) + (y >> 1)) % 2 === 0) pc.set(x, y, C.kain.k0);
  });
  pc.poly([[30, 42], [34, 43], [33, 50], [30, 48]], C.kain.k1);
  // Gelang tali di pergelangan kaki
  pc.rect(18, 77, 5, 1, '#c8a050');
  smallHead(pc, { iris: '#8a5418', browC: H.h2, brow: 'jahil', mouth: 'miring' });
  pc.rect(27, 15, 2, 1, '#f2dcb0');
  const hl = pc.layer();
  hl.poly([[16, 14], [14, 8], [19, 3], [25, 1], [31, 2], [34, 7], [33, 15], [30, 10], [18, 10]], H.h1);
  for (const t of [[[15, 6], [18, 3], [9, 2]], [[15, 10], [16, 14], [9, 13]], [[19, 3], [24, 1], [20, -3]], [[26, 1], [31, 2], [32, -3]], [[31, 3], [34, 7], [40, 3]], [[33, 9], [33, 13], [39, 12]]]) hl.poly(t, H.h1);
  for (const t of [[[18, 10], [22, 10], [18, 15]], [[21, 10], [26, 10], [24, 13]], [[25, 10], [30, 10], [30, 15]]]) hl.poly(t, H.h1);
  hl.within(H.h1, () => {
    hl.poly([[29, 1], [41, 3], [34, 15], [30, 10]], H.h2);
    hl.line(19, 4, 24, 2, H.h0).line(11, 3, 15, 4, H.h0);
  });
  hl.outline(OUT);
  pc.draw(hl);
  pc.outline(OUT);
  return pc;
}

// ---------------- Sprite kecil untuk di dalam game (16x24) ----------------
function chibiBase(pc, o) {
  const K = SKIN;
  // Kaki & badan
  pc.rect(5, 18, 2, 4, K.s1).rect(9, 18, 2, 4, K.s2);
  pc.rect(4, 22, 3, 1, K.s1).rect(9, 22, 3, 1, K.s2);
  pc.poly([[4, 12], [12, 12], [12, 19], [4, 19]], o.top);
  pc.within(o.top, () => pc.rect(10, 12, 2, 7, o.topS));
  pc.rect(4, 17, 8, 3, o.bottom);
  pc.within(o.bottom, () => pc.rect(10, 17, 2, 3, o.bottomS));
  pc.rect(3, 13, 1, 4, K.s1).rect(12, 13, 1, 4, K.s2);
  // Kepala besar
  pc.poly([[3, 3], [13, 3], [14, 7], [13, 10], [11, 12], [5, 12], [3, 10], [2, 7]], K.s1);
  pc.within(K.s1, () => pc.poly([[11, 3], [15, 3], [14, 10], [11, 13], [12, 8]], K.s2));
  pc.rect(5, 7, 1, 2, OUT).rect(10, 7, 1, 2, OUT);
  pc.set(5, 8, o.iris).set(10, 8, o.iris);
  pc.rect(7, 10, 2, 1, o.mouthC ?? '#8a4030');
}

export function chibiA() {
  const pc = new PixelCanvas(18, 27);
  pc.ox = 1;
  pc.oy = 2;
  chibiBase(pc, { top: SKIN.s1, topS: SKIN.s2, bottom: '#e8d8b0', bottomS: '#c2b088', iris: '#5a3422' });
  pc.rect(4, 12, 2, 5, A.vest.v1).rect(10, 12, 2, 5, A.vest.v2);
  pc.set(7, 13, A.shell).set(8, 13, A.shell);
  pc.rect(4, 16, 8, 1, '#b83a2a');
  const H = A.hair;
  pc.poly([[2, 6], [2, 2], [5, 0], [11, 0], [14, 2], [14, 6], [12, 5], [4, 5]], H.h1);
  pc.set(1, 1, H.h1).set(7, -1, H.h1).set(14, 0, H.h1).set(4, 6, H.h1).set(8, 6, H.h1).set(11, 6, H.h1);
  pc.within(H.h1, () => pc.rect(11, 0, 4, 7, H.h2).line(5, 1, 8, 1, H.h0));
  pc.outline(OUT);
  return pc;
}

export function chibiB() {
  const pc = new PixelCanvas(18, 27);
  pc.ox = 1;
  pc.oy = 2;
  chibiBase(pc, { top: B.baju.b1, topS: B.baju.b2, bottom: '#5a4030', bottomS: '#3e2c22', iris: '#3a2418' });
  pc.set(10, 13, B.iket.i1).set(9, 14, B.iket.i1).set(8, 15, B.iket.i1).set(7, 16, B.iket.i1);
  pc.set(12, 17, '#8af0ff');
  const H = B.hair;
  pc.poly([[2, 7], [2, 2], [5, 0], [11, 0], [14, 2], [14, 7], [12, 5], [4, 5]], H.h1);
  pc.set(4, 6, H.h1).set(8, 6, H.h1);
  pc.within(H.h1, () => pc.rect(11, 0, 4, 8, H.h2));
  pc.rect(2, 3, 13, 2, B.iket.i1).set(5, 3, B.iket.i0).set(8, 3, B.iket.dot).set(11, 3, B.iket.dot);
  pc.set(15, 4, B.iket.i1).set(15, 5, B.iket.i2);
  pc.outline(OUT);
  return pc;
}

export function chibiC() {
  const pc = new PixelCanvas(18, 27);
  pc.ox = 1;
  pc.oy = 2;
  pc.ellipse(8, 6, 8.5, 6.5, C.caping.c2);
  pc.within(C.caping.c2, () => {
    pc.ellipse(7.5, 5.5, 7, 5, C.caping.c0);
    pc.line(8, 6, 0, 6, C.caping.c1).line(8, 6, 16, 6, C.caping.c1).line(8, 6, 2, 0, C.caping.c1).line(8, 6, 14, 0, C.caping.c1);
  });
  pc.outline(OUT);
  chibiBase(pc, { top: C.shirt.t1, topS: C.shirt.t2, bottom: '#7a5636', bottomS: '#553a24', iris: '#8a5418' });
  pc.set(4, 12, C.kain.k0).set(5, 13, C.kain.k1).set(6, 14, C.kain.k0).set(7, 15, C.kain.k1).set(8, 16, C.kain.k0);
  pc.rect(10, 10, 2, 1, '#f2dcb0');
  const H = C.hair;
  pc.poly([[2, 6], [1, 2], [5, 0], [11, 0], [15, 2], [14, 6], [12, 5], [4, 5]], H.h1);
  pc.set(0, 1, H.h1).set(0, 4, H.h1).set(7, -1, H.h1).set(15, 0, H.h1).set(15, 4, H.h1).set(4, 6, H.h1).set(11, 6, H.h1);
  pc.within(H.h1, () => pc.rect(11, 0, 5, 7, H.h2).line(4, 1, 8, 1, H.h0));
  pc.outline(OUT);
  // Serampang
  pc.line(14, 23, 14, 4, '#8a6438');
  pc.set(13, 3, '#d8dce4').set(14, 2, '#ffffff').set(15, 3, '#d8dce4');
  return pc;
}
