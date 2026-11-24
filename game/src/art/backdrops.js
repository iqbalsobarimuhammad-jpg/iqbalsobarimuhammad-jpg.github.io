// Lukisan latar untuk tiap adegan intro (dilukis sekali di awal, lalu dipakai ulang)
import { newCanvas, tmpCanvas, vgrad, glowDisc, disc, shadedDisc, stamp, stars, island, cloudBand, crisp, LW, LH } from './pixel.js';
import * as sh from './shapes.js';

// 1. Laut malam, bulan, dan gunung api di kejauhan
export function nightSea(scene, key = 'bg_night') {
  const { tex, ctx } = newCanvas(scene, key);
  const HY = 112;
  vgrad(ctx, 0, 0, LW, HY, ['#07061a', '#110f33', '#20184b', '#3c255c', '#6a3a6a']);
  stars(ctx, 7, 170, 96);
  glowDisc(ctx, 232, 44, 40, '#2f2766', 1.1, 0.9);
  glowDisc(ctx, 232, 44, 24, '#5a4a8a', 1.3, 0.8);
  shadedDisc(ctx, 232, 44, 12, '#f6e9c8', '#c4ad8a', -1);
  cloudBand(ctx, 52, 9, '#2a2152', 31, 0.55);
  cloudBand(ctx, 78, 8, '#4a2d63', 32, 0.5);
  island(ctx, -20, 160, HY, 26, '#251b44', 3, [sh.volcanoPeak(66, HY - 46, 0.9, 3)]);
  island(ctx, 120, 200, HY, 9, '#2e2250', 5);
  island(ctx, 255, 345, HY, 12, '#2e2250', 9);
  // Asap tipis dari kawah
  glowDisc(ctx, 66, HY - 52, 10, '#3a2a5a', 1.2, 0.7);
  vgrad(ctx, 0, HY, LW, LH - HY, ['#2a2258', '#16133c', '#0b0a25', '#050414']);
  tex.refresh();
  return { key, horizon: HY, moon: { x: 232, y: 44 }, crater: { x: 66, y: HY - 46 } };
}

// 2. Balairung istana Trowangga saat senja
export function balairung(scene, key = 'bg_hall') {
  const { tex, ctx } = newCanvas(scene, key);
  const HY = 128;
  vgrad(ctx, 0, 0, LW, HY, ['#1c0a1a', '#4a1121', '#8e2420', '#cf4d1f', '#f39a3d']);
  glowDisc(ctx, 160, 116, 90, '#ff9a3c', 1.3, 0.8);
  disc(ctx, 160, 116, 30, '#ffc96a');
  glowDisc(ctx, 160, 116, 26, '#fff0b8', 1.2, 0.9);
  cloudBand(ctx, 28, 18, '#5a1525', 11, 0.6);
  cloudBand(ctx, 62, 12, '#a8382a', 12, 0.5);
  cloudBand(ctx, 92, 8, '#d9652b', 13, 0.45);
  // Kota di kejauhan
  stamp(ctx, (c) => {
    const far = '#4d1519';
    sh.candiBentar(c, 52, HY + 2, 58, 9, far);
    sh.candiBentar(c, 268, HY + 2, 58, 9, far);
    sh.meru(c, 18, HY + 2, 22, 6, far);
    sh.meru(c, 302, HY + 2, 22, 6, far);
    c.fillStyle = far;
    for (let i = 0; i < 18; i++) {
      const x = 80 + i * 9 + ((i * 7) % 5);
      if (x > 100 && x < 220) continue;
      c.fillRect(x, HY - 6 - (i % 3) * 2, 7, 8 + (i % 3) * 2);
      c.beginPath();
      c.moveTo(x - 2, HY - 6 - (i % 3) * 2);
      c.lineTo(x + 3.5, HY - 12 - (i % 3) * 2);
      c.lineTo(x + 9, HY - 6 - (i % 3) * 2);
      c.fill();
    }
  });
  vgrad(ctx, 0, HY, LW, LH - HY, ['#2a0b0f', '#1a060a', '#0e0305']);
  const hallY = 140;
  // Pelataran batu yang memantulkan cahaya senja
  vgrad(ctx, 0, hallY, LW, LH - hallY, ['#7a2a1a', '#4a1412', '#24080a']);
  glowDisc(ctx, 160, hallY + 4, 70, '#a8461e', 1.4, 0.7);
  stamp(ctx, (c) => {
    const col = '#0d0306';
    c.fillStyle = col;
    c.fillRect(0, hallY - 1, LW, 2);
    sh.joglo(c, 160, hallY, 150, col);
    // Tangga
    for (let i = 0; i < 3; i++) c.fillRect(150 - i * 4, hallY + i * 2, 20 + i * 8, 2);
    // Tungku api (anglo) berkaki tiga
    for (const bx of [112, 208]) {
      c.fillRect(bx - 5, hallY - 12, 10, 3);
      c.beginPath();
      c.moveTo(bx - 4, hallY - 9);
      c.lineTo(bx - 7, hallY);
      c.lineTo(bx - 5, hallY);
      c.lineTo(bx, hallY - 8);
      c.lineTo(bx + 5, hallY);
      c.lineTo(bx + 7, hallY);
      c.lineTo(bx + 4, hallY - 9);
      c.fill();
    }
    // Para bangsawan bersila
    const nob = '#060102';
    for (let i = 0; i < 6; i++) {
      sh.seated(c, 16 + i * 18, 152, 13, nob, { facing: 1 });
      sh.seated(c, 304 - i * 18, 152, 13, nob, { facing: -1 });
      sh.seated(c, 24 + i * 19, 162, 15, nob, { facing: 1 });
      sh.seated(c, 296 - i * 19, 162, 15, nob, { facing: -1 });
    }
    // Sang Mahapatih di puncak pelataran
    sh.mahesa(c, 160, hallY - 8, 32, '#050001', { wind: 0.7 });
  });
  tex.refresh();
  return { key, braziers: [{ x: 112, y: hallY - 13 }, { x: 208, y: hallY - 13 }] };
}

// 3. Mahesa dari dekat, di depan matahari merah raksasa
export function sumpahClose(scene, key = 'bg_oath') {
  const { tex, ctx } = newCanvas(scene, key);
  vgrad(ctx, 0, 0, LW, LH, ['#120206', '#3a0910', '#771616', '#b0301a', '#c9461e']);
  glowDisc(ctx, 112, 96, 120, '#d84a22', 1.0, 0.8);
  disc(ctx, 112, 96, 60, '#f07a36');
  glowDisc(ctx, 112, 96, 58, '#ffc168', 1.1, 0.95);
  glowDisc(ctx, 112, 96, 34, '#fff0c0', 1.5, 0.8);
  cloudBand(ctx, 66, 10, '#3a0910', 5, 0.75);
  cloudBand(ctx, 108, 7, '#57101a', 6, 0.6);
  cloudBand(ctx, 140, 14, '#2a060b', 8, 0.8);
  stamp(ctx, (c) => {
    sh.mahesa(c, 100, 198, 124, '#070103', { wind: 1.25, spearTop: 118 });
  });
  tex.refresh();
  return { key };
}

// 4a. Laut merah dan armada (latar saja; kapal terpisah)
export function armadaSea(scene, key = 'bg_fleet') {
  const { tex, ctx } = newCanvas(scene, key);
  const HY = 104;
  vgrad(ctx, 0, 0, LW, HY, ['#12030a', '#3a0912', '#76161a', '#b23a1f', '#d9662a']);
  cloudBand(ctx, 14, 34, '#2a070c', 41, 0.75);
  cloudBand(ctx, 54, 22, '#5a131a', 42, 0.6);
  glowDisc(ctx, 262, HY, 40, '#ff7a2a', 1.4, 0.7);
  island(ctx, 210, 320, HY, 14, '#3a0d10', 44);
  glowDisc(ctx, 262, HY - 2, 12, '#ffb04a', 1.2, 0.8);
  vgrad(ctx, 0, HY, LW, LH - HY, ['#5a1416', '#32090d', '#180407', '#080203']);
  tex.refresh();
  return { key, horizon: HY };
}

export function ships(scene) {
  const mk = (key, s, hull, sail, flag) => {
    const w = Math.ceil(80 * s);
    const h = Math.ceil(62 * s);
    const { tex, ctx } = newCanvas(scene, key, w, h);
    sh.jong(ctx, w / 2, h - 4 * s, s, hull, sail, flag);
    crisp(ctx);
    tex.refresh();
  };
  mk('ship_big', 1.3, '#0b0204', '#3d0c10', '#d42020');
  mk('ship_mid', 0.85, '#1c0507', '#521215', '#c81e1e');
  mk('ship_far', 0.5, '#3e0f12', '#6a1c1c', '#c84a2a');
}

// 4b. Desa yang dibakar
export function burningVillage(scene, key = 'bg_burn') {
  const { tex, ctx } = newCanvas(scene, key);
  const HY = 128;
  vgrad(ctx, 0, 0, LW, HY, ['#0a0205', '#240709', '#55110f', '#9a2e14', '#d65a1c']);
  cloudBand(ctx, 8, 50, '#1a0507', 51, 0.8);
  cloudBand(ctx, 48, 30, '#3a0c0c', 52, 0.6);
  glowDisc(ctx, 160, 150, 190, '#c4501e', 1.7, 0.6);
  vgrad(ctx, 0, HY, LW, LH - HY, ['#2a0a08', '#120304', '#080102']);
  const fires = [];
  stamp(ctx, (c) => {
    const col = '#140304';
    const huts = [[18, 26], [58, 30], [104, 24], [176, 32], [222, 26], [268, 30]];
    for (const [x, w] of huts) {
      sh.stiltHut(c, x, 124, 129, w, col);
      fires.push({ x: x + w / 2, y: 124 - w * 0.85, w: w * 0.9 });
    }
    // Pohon kelapa gosong
    c.fillStyle = col;
    for (const [x, h] of [[150, 46], [312, 40], [6, 34]]) {
      c.fillRect(x, 129 - h, 2, h);
      c.fillRect(x - 3, 129 - h, 8, 1);
      c.fillRect(x - 1, 129 - h - 2, 4, 2);
    }
    c.fillStyle = '#0a0102';
    c.fillRect(0, 129, LW, 3);
  });
  // Tanah yang diterangi kobaran api
  vgrad(ctx, 0, 132, LW, LH - 132, ['#7a2412', '#4a120c', '#240607', '#100203']);
  glowDisc(ctx, 160, 206, 72, '#9a3414', 1.2, 0.8);
  stamp(ctx, (c) => {
    const s = '#040001';
    sh.soldier(c, 30, 156, 32, s, { facing: 1 });
    sh.soldier(c, 62, 160, 36, s, { facing: 1 });
    sh.soldier(c, 262, 158, 34, s, { facing: -1 });
    sh.soldier(c, 294, 162, 38, s, { facing: -1 });
    sh.kneeler(c, 116, 152, 18, s, { facing: -1 });
    sh.kneeler(c, 146, 155, 20, s, { facing: -1, child: true });
    sh.kneeler(c, 184, 152, 18, s, { facing: 1 });
    sh.kneeler(c, 212, 155, 19, s, { facing: 1 });
  });
  tex.refresh();
  return { key, fires };
}

// 5. Desa Kalisari saat fajar
export function kalisari(scene, key = 'bg_village') {
  const { tex, ctx } = newCanvas(scene, key);
  const HY = 104;
  vgrad(ctx, 0, 0, LW, HY, ['#26305e', '#4d4a7f', '#9a6f97', '#e0928a', '#f9c38f', '#ffe0a8']);
  stars(ctx, 77, 30, 30, ['#ffffff', '#dfe4ff']);
  glowDisc(ctx, 246, HY, 70, '#ffd9a0', 1.5, 0.75);
  disc(ctx, 246, HY, 13, '#fff4d6');
  cloudBand(ctx, 36, 10, '#a77391', 4, 0.5);
  cloudBand(ctx, 62, 8, '#f0a58f', 6, 0.45);
  cloudBand(ctx, 84, 6, '#ffd0a0', 7, 0.4);
  island(ctx, 150, 232, HY, 9, '#a07898', 21);
  island(ctx, 280, 350, HY, 15, '#8d6a8c', 22, [sh.volcanoPeak(312, HY - 20, 1.1, 1)]);
  vgrad(ctx, 0, HY, LW, LH - HY, ['#f5b896', '#cc929a', '#8f7ca6', '#585b92', '#363c72']);
  const col = '#3a2a4c';
  stamp(ctx, (c) => {
    sh.stiltHut(c, 6, 120, 134, 26, col, { ladder: true });
    sh.stiltHut(c, 42, 117, 132, 22, col);
    sh.stiltHut(c, 74, 122, 136, 30, col, { ladder: true });
    sh.stiltHut(c, 116, 119, 132, 18, col);
    // Titian bambu
    c.fillStyle = col;
    c.fillRect(0, 134, 150, 1);
    for (let x = 2; x < 150; x += 9) c.fillRect(x, 134, 1, 5);
    sh.jukung(c, 152, 118, 0.55, '#6a5a84', { sail: true });
    sh.jukung(c, 196, 124, 0.45, '#76628e', { sail: true });
  });
  // Pantai
  stamp(ctx, (c) => {
    c.fillStyle = '#5a3e5c';
    c.beginPath();
    c.moveTo(120, LH);
    c.quadraticCurveTo(170, 150, 230, 146);
    c.quadraticCurveTo(290, 141, LW, 138);
    c.lineTo(LW, LH);
    c.closePath();
    c.fill();
    c.fillStyle = '#432c48';
    c.beginPath();
    c.moveTo(150, LH);
    c.quadraticCurveTo(200, 162, 260, 158);
    c.quadraticCurveTo(300, 155, LW, 152);
    c.lineTo(LW, LH);
    c.closePath();
    c.fill();
    const pc = '#2a1d3a';
    sh.palm(c, 304, 150, 62, pc, -0.4, 2);
    sh.palm(c, 274, 152, 46, pc, -0.22, 5);
    sh.palm(c, 138, 152, 40, '#33244a', 0.3, 3);
    sh.jukung(c, 214, 158, 1, pc, {});
  });
  tex.refresh();
  return { key, horizon: HY, sun: { x: 246, y: HY } };
}

// 6. Banyu berdiri di air dangkal, menghadap laut
export function shore(scene, key = 'bg_shore') {
  const { tex, ctx } = newCanvas(scene, key);
  const HY = 86;
  vgrad(ctx, 0, 0, LW, HY, ['#34437a', '#6c66a0', '#c98e98', '#f6bf98', '#ffdcaa']);
  glowDisc(ctx, 74, HY, 64, '#ffdca8', 1.4, 0.8);
  disc(ctx, 74, HY, 16, '#fff6dc');
  cloudBand(ctx, 30, 10, '#9a7aa6', 61, 0.5);
  cloudBand(ctx, 58, 8, '#f2ac96', 62, 0.45);
  island(ctx, 200, 300, HY, 10, '#a37f9e', 63);
  vgrad(ctx, 0, HY, LW, LH - HY, ['#f4ba9c', '#bf929f', '#7a72a2', '#454f88', '#2a3366']);
  const waterY = 150;
  const save = ctx.getImageData(0, waterY, LW, LH - waterY);
  stamp(ctx, (c) => sh.banyu(c, 168, 176, 66, '#1c1830', { pose: 'reach', facing: -1, wind: 0.8 }));
  ctx.putImageData(save, 0, waterY);
  tex.refresh();
  return { key, horizon: HY, waterY, glow: { x: 146, y: 152 } };
}

// 7. Layar terbelah: Bara (merah) vs Tirta (biru)
export function split(scene, key = 'bg_split') {
  const { tex, ctx } = newCanvas(scene, key);
  const A = tmpCanvas();
  vgrad(A.ctx, 0, 0, LW, LH, ['#1a0306', '#5a0e10', '#a82a18', '#e8642a', '#ffb050']);
  glowDisc(A.ctx, 76, 104, 70, '#ffcf70', 1.3, 0.8);
  stamp(A.ctx, (c) => sh.mahesa(c, 82, 198, 104, '#0a0103', { wind: 1.1, spearTop: 118 }));
  const B = tmpCanvas();
  vgrad(B.ctx, 0, 0, LW, LH, ['#01061a', '#06204a', '#0f4f84', '#2a92b8', '#7ae0e6']);
  glowDisc(B.ctx, 246, 100, 70, '#a8f0ff', 1.3, 0.75);
  let tip = null;
  stamp(B.ctx, (c) => {
    tip = sh.banyu(c, 244, 198, 92, '#020612', { pose: 'raise', facing: -1, wind: -1 });
  });
  ctx.drawImage(A.c, 0, 0);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(188, 0);
  ctx.lineTo(LW, 0);
  ctx.lineTo(LW, LH);
  ctx.lineTo(132, LH);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(B.c, 0, 0);
  ctx.restore();
  // Garis pembelah
  ctx.fillStyle = '#fff4dc';
  for (let y = 0; y < LH; y++) {
    const x = Math.round(188 - (56 * y) / LH);
    ctx.fillRect(x - 1, y, 2, 1);
  }
  tex.refresh();
  return { key, tip };
}

// Sprite Banyu kecil untuk berjalan di pantai (2 frame)
export function banyuWalk(scene) {
  for (let f = 0; f < 2; f++) {
    const key = `banyu_walk${f}`;
    const { tex, ctx } = newCanvas(scene, key, 24, 24);
    sh.banyu(ctx, 12, 23, 20, '#241a34', { facing: -1, pose: 'stand', wind: 0.6 + f * 0.4 });
    if (f === 1) {
      // Langkah kaki bergantian
      ctx.clearRect(0, 18, 24, 6);
      ctx.fillStyle = '#241a34';
      ctx.fillRect(9, 18, 2, 5);
      ctx.fillRect(13, 18, 2, 4);
      ctx.fillRect(14, 21, 2, 2);
    }
    crisp(ctx);
    tex.refresh();
  }
}
