export const FONT = '"Pixelify Sans", "Trebuchet MS", sans-serif';
export const DISPLAY = '"Jersey 10", "Pixelify Sans", sans-serif';

// Teks dengan gaya standar game
export function text(scene, x, y, str, o = {}) {
  const t = scene.add.text(x, y, str, {
    fontFamily: o.display ? DISPLAY : FONT,
    fontSize: `${o.size ?? 24}px`,
    color: o.color ?? '#f6ecd6',
    align: o.align ?? 'center',
    fontStyle: o.bold ? 'bold' : 'normal',
    wordWrap: o.wrap ? { width: o.wrap, useAdvancedWrap: true } : undefined,
    lineSpacing: o.lineSpacing ?? 6,
    stroke: o.stroke ?? undefined,
    strokeThickness: o.strokeThickness ?? 0,
  });
  t.setOrigin(o.ox ?? 0.5, o.oy ?? 0.5);
  if (o.shadow !== false) t.setShadow(3, 3, '#000000', 0, true, true);
  if (o.spacing) t.setLetterSpacing(o.spacing);
  return t;
}

// Perbesar area sentuh sebuah objek (biar gampang dipencet di HP)
export function tapArea(obj, padX = 30, padY = 18) {
  obj.setInteractive({
    hitArea: new Phaser.Geom.Rectangle(-padX, -padY, obj.width + padX * 2, obj.height + padY * 2),
    hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    useHandCursor: true,
  });
  return obj;
}

export function isPortrait() {
  return window.innerHeight > window.innerWidth;
}
