// LAYAR JUDUL: "SUMPAH BARA"
import { S, makeBaseTextures } from '../art/pixel.js';
import { Waves, Twinkles, embers } from '../fx.js';
import { text, tapArea } from '../ui.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    makeBaseTextures(this);
    this.audio = this.registry.get('audio');
    const art = this.registry.get('art');
    this.anim = [];
    this.modal = null;

    const m = art.night;
    this.add.image(0, 0, m.key).setOrigin(0).setScale(S);
    this.anim.push(new Twinkles(this, 12, 45, 92, 1));
    this.anim.push(
      new Waves(this, {
        y0: m.horizon + 1,
        y1: 180,
        seed: 4,
        count: 110,
        colors: ['#3a3170', '#4c3f86', '#5a4a96'],
        refl: { x: m.moon.x, w: 34, color: '#f6e9c8', count: 60 },
        depth: 2,
      }),
    );
    embers(this, { freq: 260, speed: 0.7, depth: 4 });
    // Gelap di tengah biar judul terbaca
    this.add.rectangle(480, 210, 960, 300, 0x000000, 0.35).setDepth(3);

    this.events.on('update', (time) => {
      const t = time / 1000;
      for (const a of this.anim) a.update(t);
    });

    // Judul dengan gradasi api
    const title = text(this, 480, 170, 'SUMPAH BARA', { display: true, size: 132, color: '#ffb050', spacing: 6, stroke: '#2a0606', strokeThickness: 8 }).setDepth(10);
    const grd = title.context.createLinearGradient(0, 0, 0, title.height);
    grd.addColorStop(0.15, '#fff1b0');
    grd.addColorStop(0.5, '#ff9a3a');
    grd.addColorStop(0.9, '#c2261a');
    title.setFill(grd);
    const sub = text(this, 480, 262, 'KISAH DARI TANAH WILWAPURA', { size: 22, color: '#e9d8b8', spacing: 5 }).setDepth(10);

    title.setAlpha(0).setScale(1.08);
    sub.setAlpha(0);
    this.tweens.add({ targets: title, alpha: 1, scale: 1, duration: 1600, ease: 'Cubic.easeOut' });
    this.tweens.add({ targets: sub, alpha: 1, duration: 1200, delay: 900 });

    // Menu
    const items = [
      ['MULAI PETUALANGAN', () => this.showModal('BAB 1: ABU KALISARI', 'Sang empu masih menempa bab ini.\nTunggu update berikutnya!')],
      ['PUTAR ULANG INTRO', () => this.replay()],
      [
        'TENTANG GAME',
        () =>
          this.showModal(
            'SUMPAH BARA  -  versi 0.1 (Prolog)',
            'Kisah fiksi yang terinspirasi sejarah Majapahit.\nSemua nama dan tokoh adalah rekaan.\n\nMusik: gamelan sintesis buatan sendiri\nMesin: Phaser  -  Huruf: Pixelify Sans & Jersey 10',
          ),
      ],
    ];
    this.sel = 0;
    this.menu = items.map(([label, fn], i) => {
      const t = text(this, 480, 360 + i * 48, label, { size: 26, color: '#d8ccb4', spacing: 2 }).setDepth(10).setAlpha(0);
      tapArea(t, 60, 10)
        .on('pointerover', () => this.select(i))
        .on('pointerup', () => {
          if (this.modal) return;
          this.select(i);
          this.click();
          fn();
        });
      this.tweens.add({ targets: t, alpha: 1, duration: 600, delay: 1600 + i * 150 });
      t.fn = fn;
      return t;
    });
    this.cursor = text(this, 0, 0, '>', { size: 26, color: '#ffb050' }).setDepth(10).setAlpha(0);
    this.tweens.add({ targets: this.cursor, alpha: 1, duration: 600, delay: 1600 });
    this.tweens.add({ targets: this.cursor, x: '+=6', duration: 450, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.select(0);

    text(this, 16, 524, 'v0.1  Prolog', { size: 16, color: '#7d7466', ox: 0 }).setDepth(10);

    this.input.keyboard?.on('keydown', (e) => {
      if (this.modal) {
        if (['Enter', ' ', 'Escape'].includes(e.key)) this.closeModal();
        return;
      }
      if (e.key === 'ArrowDown') this.select((this.sel + 1) % this.menu.length);
      if (e.key === 'ArrowUp') this.select((this.sel + this.menu.length - 1) % this.menu.length);
      if (e.key === 'Enter' || e.key === ' ') {
        this.click();
        this.menu[this.sel].fn();
      }
    });

    this.cameras.main.fadeIn(900, 0, 0, 0);
    this.audio?.seq.play('judul');
    if (this.audio && this.audio.ctx.state === 'running') this.audio.gong(this.audio.now + 0.05, 46, 1);
  }

  select(i) {
    if (i !== this.sel && this.audio && this.audio.ctx.state === 'running') this.audio.peking(this.audio.now, 540, 0.2);
    this.sel = i;
    this.menu.forEach((t, j) => t.setColor(j === i ? '#fff1c8' : '#a89c86'));
    const t = this.menu[i];
    this.tweens.killTweensOf(this.cursor, ['y']);
    this.cursor.setPosition(t.x - t.width / 2 - 28, t.y);
  }

  click() {
    if (this.audio && this.audio.ctx.state === 'running') this.audio.bonang(this.audio.now, 410, 0.6);
  }

  replay() {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Intro'));
  }

  showModal(head, body) {
    if (this.modal) return;
    const c = this.add.container(0, 0).setDepth(50);
    const shade = this.add.rectangle(480, 270, 960, 540, 0x000000, 0.6).setInteractive();
    const box = this.add.rectangle(480, 270, 640, 280, 0x140c18, 0.96).setStrokeStyle(4, 0xc8883a);
    const inner = this.add.rectangle(480, 270, 620, 260).setStrokeStyle(2, 0x5a3a2a);
    const h = text(this, 480, 175, head, { size: 26, color: '#ffcf80' });
    const b = text(this, 480, 268, body, { size: 20, color: '#e8dcc4', lineSpacing: 6 });
    const ok = text(this, 480, 368, '[ OK ]', { size: 22, color: '#fff1c8' });
    c.add([shade, box, inner, h, b, ok]);
    c.setAlpha(0);
    this.tweens.add({ targets: c, alpha: 1, duration: 200 });
    shade.on('pointerup', () => this.closeModal());
    this.modal = c;
  }

  closeModal() {
    if (!this.modal) return;
    const c = this.modal;
    this.tweens.add({ targets: c, alpha: 0, duration: 150, onComplete: () => c.destroy() });
    this.time.delayedCall(160, () => (this.modal = null));
  }
}
