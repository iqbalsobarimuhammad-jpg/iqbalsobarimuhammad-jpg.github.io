import { StartScene } from './scenes/StartScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { TitleScene } from './scenes/TitleScene.js';

async function loadFonts() {
  const list = [
    ['Pixelify Sans', 'assets/fonts/pixelify-sans-latin-400-normal.woff2', '400'],
    ['Pixelify Sans', 'assets/fonts/pixelify-sans-latin-700-normal.woff2', '700'],
    ['Jersey 10', 'assets/fonts/jersey-10-latin-400-normal.woff2', '400'],
  ];
  await Promise.all(
    list.map(async ([family, url, weight]) => {
      try {
        const f = new FontFace(family, `url(${url})`, { weight });
        await f.load();
        document.fonts.add(f);
      } catch (e) {
        console.warn('Font gagal dimuat:', family, e);
      }
    }),
  );
}

await loadFonts();

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#000000',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  audio: { noAudio: true },
  input: { activePointers: 2 },
  scene: [StartScene, IntroScene, TitleScene],
});
