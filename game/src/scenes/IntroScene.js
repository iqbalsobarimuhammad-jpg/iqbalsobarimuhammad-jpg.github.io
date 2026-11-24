// INTRO: "Sumpah Bara", pembukaan cerita bergaya sinematik.
import { S } from '../art/pixel.js';
import { Waves, Twinkles, Birds, fire, embers, smoke, sparkles } from '../fx.js';
import { text, tapArea } from '../ui.js';

const BAR = 60; // tinggi pita hitam sinematik (atas & bawah)

export class IntroScene extends Phaser.Scene {
  constructor() {
    super('Intro');
  }

  create() {
    this.audio = this.registry.get('audio');
    this.art = this.registry.get('art');
    this.objs = [];
    this.anim = [];
    this.finished = false;

    // Kamera dunia (bisa di-zoom/fade) + kamera UI (pita hitam & teks)
    this.cam = this.cameras.main;
    this.cam.setBackgroundColor('#000000');
    this.uiCam = this.cameras.add(0, 0, 960, 540);

    const ui = [];
    ui.push(this.add.rectangle(0, 0, 960, BAR, 0x000000).setOrigin(0).setDepth(90));
    ui.push(this.add.rectangle(0, 540 - BAR, 960, BAR, 0x000000).setOrigin(0).setDepth(90));
    this.sub = text(this, 480, 540 - BAR / 2, '', { size: 24, wrap: 900, lineSpacing: 2 }).setDepth(95);
    ui.push(this.sub);
    this.skip = text(this, 944, BAR / 2, 'LEWATI  >>', { size: 18, color: '#bfb6a0', ox: 1 }).setDepth(99).setAlpha(0);
    tapArea(this.skip, 24, 16).on('pointerup', () => this.finish());
    this.tweens.add({ targets: this.skip, alpha: 0.8, duration: 800, delay: 1200 });
    ui.push(this.skip);
    this.cam.ignore(ui);
    this.uiObjs = ui;

    this.input.keyboard?.on('keydown', (e) => {
      if (['Escape', 'Enter', ' '].includes(e.key)) this.finish();
    });
    this.events.on('update', (time) => {
      const t = time / 1000;
      for (const a of this.anim) a.update(t);
    });

    this.run();
  }

  // ---------------- alat bantu ----------------
  wait(ms) {
    return new Promise((r) => this.time.delayedCall(ms, r));
  }

  fadeOut(ms = 800) {
    return new Promise((r) => {
      this.cam.once('camerafadeoutcomplete', r);
      this.cam.fadeOut(ms, 0, 0, 0);
    });
  }

  fadeIn(ms = 800) {
    this.cam.fadeIn(ms, 0, 0, 0);
    return this.wait(ms);
  }

  keep(o) {
    this.uiCam.ignore(o);
    this.objs.push(o);
    return o;
  }

  keepUI(o) {
    this.cam.ignore(o);
    this.objs.push(o);
    return o;
  }

  animate(a) {
    this.uiCam.ignore(a.g);
    this.anim.push(a);
    return a;
  }

  bg(key, depth = 0) {
    return this.keep(this.add.image(0, 0, key).setOrigin(0).setScale(S).setDepth(depth));
  }

  clear() {
    this.tweens.killTweensOf(this.objs);
    this.cam.zoomEffect.reset();
    for (const o of this.objs) o.destroy();
    for (const a of this.anim) a.destroy();
    this.objs = [];
    this.anim = [];
    this.tweens.killTweensOf(this.sub);
    this.sub.setText('').setAlpha(1);
    this.cam.setZoom(1);
  }

  music(name) {
    this.audio?.seq.play(name);
  }

  sfx(fn) {
    const a = this.audio;
    if (a && a.ctx.state === 'running') fn(a, a.now);
  }

  // Ketik teks huruf demi huruf
  type(obj, str, speed = 32, from = 0) {
    return new Promise((res) => {
      const chars = [...str];
      let i = from;
      obj.setText(chars.slice(0, i).join(''));
      if (i >= chars.length) return res();
      this.time.addEvent({
        delay: speed,
        repeat: chars.length - i - 1,
        callback: () => {
          i++;
          obj.setText(chars.slice(0, i).join(''));
          if (i >= chars.length) res();
        },
      });
    });
  }

  // Narasi di pita bawah
  async say(str, hold = 2300) {
    const s = this.sub;
    this.tweens.killTweensOf(s);
    s.setAlpha(1);
    const full = s.getWrappedText(str).join('\n');
    await this.type(s, full, 30);
    await this.wait(hold);
    await new Promise((r) => this.tweens.add({ targets: s, alpha: 0, duration: 300, onComplete: r }));
    s.setText('');
  }

  finish() {
    if (this.finished) return;
    this.finished = true;
    this.music('judul');
    this.cam.fadeOut(400, 0, 0, 0);
    this.time.delayedCall(420, () => this.scene.start('Title', { fromIntro: true }));
  }

  async run() {
    const shots = [this.shotNusantara, this.shotNightSea, this.shotOath, this.shotWar, this.shotVillage, this.shotLight, this.shotSplit];
    // Untuk pengembangan: ?adegan=3 langsung loncat ke adegan ke-3
    const start = Math.max(1, parseInt(new URLSearchParams(location.search).get('adegan') || '1', 10)) - 1;
    if (start > 0) this.cam.fadeOut(1, 0, 0, 0);
    for (const shot of shots.slice(start)) {
      if (this.finished) return;
      await shot.call(this);
    }
    this.finish();
  }

  // ---------------- ADEGAN ----------------

  // 1. Kartu judul "NUSANTARA"
  async shotNusantara() {
    this.music('sunyi');
    this.sfx((a, t) => a.gong(t + 0.05, 46, 1));
    const t1 = this.keepUI(text(this, 480, 245, 'NUSANTARA', { display: true, size: 104, color: '#f3e2c0', spacing: 10 }).setAlpha(0).setDepth(20));
    this.tweens.add({ targets: t1, alpha: 1, duration: 2000 });
    await this.wait(2300);
    const t2 = this.keepUI(text(this, 480, 330, 'Ribuan pulau. Ribuan bahasa. Satu lautan.', { size: 24, color: '#b8ab95' }).setAlpha(0).setDepth(20));
    this.tweens.add({ targets: t2, alpha: 1, duration: 1400 });
    await this.wait(3600);
    this.tweens.add({ targets: [t1, t2], alpha: 0, duration: 1000 });
    await this.wait(1100);
    this.clear();
    this.cam.fadeOut(1, 0, 0, 0);
  }

  // 2. Laut malam di Tanah Wilwa
  async shotNightSea() {
    const m = this.art.night;
    this.bg(m.key);
    this.animate(new Twinkles(this, 11, 45, 92, 1));
    this.animate(
      new Waves(this, {
        y0: m.horizon + 1,
        y1: 180,
        seed: 3,
        count: 110,
        colors: ['#3a3170', '#4c3f86', '#5a4a96'],
        refl: { x: m.moon.x, w: 34, color: '#f6e9c8', count: 60 },
        depth: 2,
      }),
    );
    this.keep(smoke(this, m.crater.x, m.crater.y - 2, { tint: 0x30265a, alpha: 0.6, w: 2, freq: 260, scale: 0.5, depth: 1 }));
    this.music('laut');
    this.cam.zoomTo(1.04, 22000, 'Sine.easeInOut');
    await this.fadeIn(1800);
    await this.say('Di zaman ketika laut menjadi jalan dan pulau menjadi rumah, berdirilah sebuah kerajaan besar di Tanah Wilwa...');
    await this.say('Wilwapura.', 1500);
    await this.say('Dan di sana, seorang anak rakyat jelata naik menjadi orang terkuat di kerajaan: sang Mahapatih.', 2500);
    await this.fadeOut(1000);
    this.clear();
  }

  // 3. Sumpah Bara di balairung istana
  async shotOath() {
    const m = this.art.hall;
    this.bg(m.key);
    for (const b of m.braziers) {
      this.keep(fire(this, b.x, b.y, { w: 7, size: 0.9, depth: 8 }));
      this.keep(smoke(this, b.x, b.y - 12, { w: 3, alpha: 0.35, freq: 240, tint: 0x220909, depth: 7 }));
    }
    this.keep(embers(this, { freq: 150 }));
    this.music('sumpah');
    this.cam.zoomTo(1.05, 16000, 'Sine.easeInOut');
    await this.fadeIn(1300);
    await this.say('Di hadapan raja muda dan para bangsawan, sang Mahapatih mengangkat tombaknya...');
    await this.say('...lalu mengucapkan sumpah yang kelak membakar seluruh Nusantara.', 1600);

    // Potong ke wajah sang Mahapatih
    this.clear();
    this.cam.flash(300, 255, 190, 120);
    this.sfx((a, t) => a.impact(t, 0.7));
    const c = this.art.oath;
    this.bg(c.key);
    this.keep(embers(this, { freq: 55, speed: 1.3 }));
    this.cam.zoomTo(1.06, 15000, 'Sine.easeInOut');
    await this.wait(900);

    const q = this.keepUI(text(this, 700, 250, '', { size: 30, color: '#ffe2b0', wrap: 420, lineSpacing: 10 }).setDepth(20));
    const l1 = '"Tidak akan kucicipi manisnya istirahat...';
    const l2 = `${l1}\n\n...sebelum seluruh Nusantara berlutut di bawah satu panji!"`;
    await this.type(q, l1, 48);
    await this.wait(900);
    await this.type(q, l2, 44, [...l1].length);
    this.sfx((a, t) => {
      a.impact(t, 1);
      a.thunder(t + 0.05, 0.7);
    });
    this.cam.shake(600, 0.008);
    this.cam.flash(350, 255, 110, 50);
    const cr = this.keepUI(text(this, 700, 395, '- Sumpah Bara, Mahapatih Mahesa -', { size: 20, color: '#d99a70' }).setAlpha(0).setDepth(20));
    this.tweens.add({ targets: cr, alpha: 1, duration: 1000 });
    await this.wait(3600);
    this.tweens.add({ targets: [q, cr], alpha: 0, duration: 800 });
    await this.fadeOut(900);
    this.clear();
  }

  // 4. Armada berlayar, desa-desa terbakar
  async shotWar() {
    const m = this.art.fleet;
    this.bg(m.key);
    this.animate(
      new Waves(this, {
        y0: m.horizon + 1,
        y1: 180,
        seed: 8,
        count: 130,
        colors: ['#8a2a1e', '#a8402a', '#6a1c18'],
        drift: -8,
        refl: { x: 262, w: 30, color: '#ff9a4a', count: 30 },
        depth: 2,
      }),
    );
    const fleet = [
      ['ship_far', 30, m.horizon + 5, 14],
      ['ship_far', 120, m.horizon + 6, 15],
      ['ship_far', 205, m.horizon + 4, 13],
      ['ship_mid', -30, m.horizon + 22, 26],
      ['ship_mid', 170, m.horizon + 26, 28],
      ['ship_big', 40, m.horizon + 64, 42],
    ];
    for (const [k, x, y, v] of fleet) {
      const img = this.keep(this.add.image(x * S, y * S, k).setOrigin(0.5, 1).setScale(S).setDepth(3 + v / 10));
      this.tweens.add({ targets: img, x: img.x + v * S * 16, duration: 16000 });
      this.tweens.add({ targets: img, y: img.y + S, duration: 1300 + v * 12, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    this.keep(embers(this, { freq: 200, speed: 0.6 }));
    this.music('perang');
    await this.fadeIn(900);
    await this.say('Armada Wilwapura berlayar. Satu demi satu pulau ditaklukkan.', 2000);

    await this.fadeOut(450);
    this.clear();
    const b = this.art.burn;
    this.bg(b.key);
    for (const f of b.fires) {
      this.keep(fire(this, f.x, f.y + 6, { w: f.w, size: 1.35, freq: 12, depth: 3 }));
      this.keep(smoke(this, f.x, f.y - 8, { w: 6, alpha: 0.6, scale: 1.5, freq: 130, depth: 2 }));
    }
    this.keep(embers(this, { freq: 45, speed: 1.2 }));
    this.sfx((a, t) => a.crackle(t, 10, 0.8));
    this.cam.zoomTo(1.04, 12000, 'Sine.easeInOut');
    await this.fadeIn(500);
    this.cam.shake(300, 0.003);
    await this.say('Yang menolak, dibakar.', 1300);
    await this.say('Yang tunduk, diperas sampai kering.', 1500);
    await this.say('Rakyat kecil yang menanggung bara dari sumpah itu.', 2200);
    this.music('sunyi');
    await this.fadeOut(1600);
    this.clear();
  }

  // 5. Desa nelayan Kalisari saat fajar
  async shotVillage() {
    const m = this.art.village;
    this.bg(m.key);
    this.animate(
      new Waves(this, {
        y0: m.horizon + 1,
        y1: 150,
        seed: 21,
        count: 120,
        colors: ['#ffe0c0', '#f7c6b0', '#c3a6c6'],
        refl: { x: m.sun.x, w: 36, color: '#fff2d0', count: 70 },
        depth: 2,
      }),
    );
    this.animate(
      new Birds(this, [
        { x: 40, y: 38, vx: 5 },
        { x: 52, y: 44, vx: 5.4 },
        { x: 30, y: 48, vx: 4.8 },
        { x: 230, y: 26, vx: -3.6 },
        { x: 170, y: 58, vx: 3 },
      ]),
    );
    // Banyu berjalan di pantai
    const boy = this.keep(this.add.image(310 * S, 157 * S, 'banyu_walk0').setOrigin(0.5, 1).setScale(S).setDepth(6));
    this.tweens.add({ targets: boy, x: 236 * S, duration: 11000, ease: 'Sine.easeOut' });
    let fr = 0;
    const step = this.time.addEvent({
      delay: 260,
      loop: true,
      callback: () => {
        fr ^= 1;
        boy.setTexture(`banyu_walk${fr}`);
        if (boy.x <= 237 * S) {
          boy.setTexture('banyu_walk0');
          step.remove();
        }
      },
    });
    this.music('desa');
    await this.fadeIn(2000);
    await this.say('Namun jauh dari istana, di sebuah desa nelayan kecil bernama Kalisari...');
    await this.say('...hiduplah seorang bocah bernama Banyu.', 1800);
    await this.say('Ia belum tahu apa-apa tentang perang. Yang ia tahu hanya laut, ibunya, dan dongeng tentang Mahapatih yang gagah berani.', 2600);
    await this.fadeOut(1200);
    step.remove();
    this.clear();
  }

  // 6. Cahaya biru dari dasar laut
  async shotLight() {
    const m = this.art.shore;
    this.bg(m.key);
    this.animate(
      new Waves(this, {
        y0: m.horizon + 1,
        y1: 180,
        seed: 31,
        count: 140,
        colors: ['#ffe6c8', '#e8b8b0', '#a49ac6'],
        refl: { x: 74, w: 44, color: '#fff4d8', count: 70 },
        depth: 2,
      }),
    );
    const gx = m.glow.x * S;
    const gy = m.glow.y * S;
    const glow = this.keep(this.add.image(gx, gy, 'glow').setScale(1.2).setTint(0x5ad8ff).setBlendMode('ADD').setAlpha(0).setDepth(10));
    const core = this.keep(this.add.image(gx, gy, 'glow').setScale(0.4).setTint(0xe8ffff).setBlendMode('ADD').setAlpha(0).setDepth(11));
    const rays = [-16, 0, 14].map((ang, i) =>
      this.keep(
        this.add
          .image(gx + (i - 1) * 18, gy, 'ray')
          .setOrigin(0.5, 1)
          .setScale(3, 3.4)
          .setAngle(ang)
          .setTint(0x8ae8ff)
          .setBlendMode('ADD')
          .setAlpha(0)
          .setDepth(9),
      ),
    );
    this.music('cahaya');
    await this.fadeIn(1400);
    await this.say('Sampai suatu pagi, laut memberinya sesuatu.', 1200);

    this.sfx((a, t) => a.shimmer(t, 1));
    this.tweens.add({ targets: glow, alpha: 0.9, duration: 1600 });
    this.tweens.add({ targets: core, alpha: 1, duration: 1200 });
    this.tweens.add({ targets: glow, scale: 1.6, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    rays.forEach((r, i) => this.tweens.add({ targets: r, alpha: 0.55, duration: 1400 + i * 300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }));
    this.keep(sparkles(this, m.glow.x, m.glow.y, { w: 10, freq: 40 }));
    await this.say('Sebuah cahaya biru, berdenyut dari dasar laut... seolah memanggil namanya.', 1800);

    this.sfx((a, t) => a.whoosh(t, 1.6, 1));
    this.tweens.killTweensOf(glow);
    this.tweens.add({ targets: glow, scale: 14, alpha: 1, duration: 1700, ease: 'Quad.easeIn' });
    await this.wait(1500);
    this.cam.flash(900, 255, 255, 255);
    this.sfx((a, t) => a.impact(t, 0.8));
    await this.wait(120);
    this.clear();
  }

  // 7. Bara vs Tirta
  async shotSplit() {
    const m = this.art.split;
    this.bg(m.key);
    // Api di sisi kiri, kilau air di sisi kanan
    this.keep(
      this.add
        .particles(0, 0, 'px', {
          x: { min: 0, max: 420 },
          y: { min: 560, max: 580 },
          lifespan: { min: 2500, max: 5000 },
          speedY: { min: -140, max: -50 },
          speedX: { min: -10, max: 30 },
          scale: 3,
          tint: [0xffc060, 0xff7a30, 0xffe8a0],
          alpha: { start: 1, end: 0 },
          blendMode: 'ADD',
          frequency: 40,
          advance: 3000,
        })
        .setDepth(5),
    );
    this.keep(
      this.add
        .particles(0, 0, 'px', {
          x: { min: 520, max: 980 },
          y: { min: 560, max: 580 },
          lifespan: { min: 3000, max: 6000 },
          speedY: { min: -90, max: -30 },
          speedX: { min: -15, max: 15 },
          scale: 3,
          tint: [0xa8f0ff, 0x5ad0ff, 0xffffff],
          alpha: { start: 0.9, end: 0 },
          blendMode: 'ADD',
          frequency: 50,
          advance: 3000,
        })
        .setDepth(5),
    );
    if (m.tip) {
      const kx = m.tip.x * S;
      const ky = m.tip.y * S;
      const kg = this.keep(this.add.image(kx, ky, 'glow').setScale(1.1).setTint(0x7ae8ff).setBlendMode('ADD').setAlpha(0.85).setDepth(6));
      this.tweens.add({ targets: kg, scale: 1.5, alpha: 1, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.keep(sparkles(this, m.tip.x, m.tip.y + 6, { w: 3, h: 8, freq: 70 }));
    }
    const bara = this.keepUI(text(this, 230, 120, 'BARA', { display: true, size: 76, color: '#ffb060', spacing: 6 }).setAlpha(0).setDepth(20));
    const tirta = this.keepUI(text(this, 770, 120, 'TIRTA', { display: true, size: 76, color: '#a8f4ff', spacing: 6 }).setAlpha(0).setDepth(20));
    this.music('perang');
    this.cam.fadeIn(10);
    this.cam.flash(700, 255, 255, 255);
    this.tweens.add({ targets: bara, alpha: 1, duration: 900, delay: 400 });
    this.tweens.add({ targets: tirta, alpha: 1, duration: 900, delay: 1300 });
    await this.wait(600);
    await this.say('Yang satu ingin menyatukan Nusantara dengan api dan ketakutan.', 1500);
    await this.say('Yang satu lagi... dengan kepercayaan.', 2000);
    this.sfx((a, t) => a.impact(t, 1));
    this.cam.shake(400, 0.006);
    await this.fadeOut(1200);
    this.clear();
  }
}
