// Layar pertama: "Sentuh layar untuk memulai".
// Wajib ada karena browser HP baru mengizinkan suara setelah layar disentuh.
import { makeBaseTextures } from '../art/pixel.js';
import * as bd from '../art/backdrops.js';
import { Gamelan } from '../audio/gamelan.js';
import { text, isPortrait } from '../ui.js';

function paintAll(scene) {
  const art = {
    night: bd.nightSea(scene),
    hall: bd.balairung(scene),
    oath: bd.sumpahClose(scene),
    fleet: bd.armadaSea(scene),
    burn: bd.burningVillage(scene),
    village: bd.kalisari(scene),
    shore: bd.shore(scene),
    split: bd.split(scene),
  };
  bd.ships(scene);
  bd.banyuWalk(scene);
  scene.registry.set('art', art);
}

export class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  create() {
    makeBaseTextures(this);
    this.ready = false;

    const tap = text(this, 480, 270, 'SENTUH LAYAR UNTUK MEMULAI', { size: 30, color: '#f3e2c0', spacing: 2 });
    this.tweens.add({ targets: tap, alpha: 0.25, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    text(this, 480, 330, 'Nyalakan suara untuk mendengar gamelan', { size: 18, color: '#8f8676' });
    this.hint = text(this, 480, 470, 'Putar HP ke posisi mendatar (landscape) biar layarnya penuh', { size: 18, color: '#d9a066' });
    this.hint.setVisible(isPortrait());
    this.scale.on('resize', () => this.hint.setVisible(isPortrait()));

    // Lukis semua latar sambil menunggu sentuhan pertama
    this.time.delayedCall(30, () => {
      paintAll(this);
      this.ready = true;
    });

    const go = () => {
      if (!this.ready || this.started) return;
      this.started = true;
      let audio = this.registry.get('audio');
      if (!audio) {
        try {
          audio = new Gamelan();
          this.registry.set('audio', audio);
        } catch (e) {
          console.warn('Audio tidak tersedia', e);
        }
      }
      audio?.resume();
      // Layar penuh + kunci landscape (hanya di HP)
      if (this.sys.game.device.input.touch && !this.scale.isFullscreen) {
        try {
          this.scale.startFullscreen();
          screen.orientation?.lock?.('landscape').catch(() => {});
        } catch (e) {
          /* tidak apa-apa */
        }
      }
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Intro'));
    };
    this.input.on('pointerup', go);
    this.input.keyboard?.on('keydown', go);
  }
}
