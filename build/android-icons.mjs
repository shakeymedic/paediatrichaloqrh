// Generates the Android launcher icons from the paediatric app icons (purple, "PQRH"), so the
// children's app never looks like the adult HALO QRH on a phone. Run when icons/ change: node build/android-icons.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const full = join(root, 'icons', 'icon-512.png');       // square, for Android 7 and earlier
const maskable = join(root, 'icons', 'maskable-512.png'); // logo and label inside the safe zone
const res = join(root, 'android', 'app', 'src', 'main', 'res');
const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

for (const [name, scale] of Object.entries(densities)) {
  const dir = join(res, `mipmap-${name}`);
  mkdirSync(dir, { recursive: true });
  const legacy = Math.round(48 * scale);
  await sharp(full).resize(legacy, legacy).png().toFile(join(dir, 'ic_launcher.png'));
  // Adaptive icon foreground on a purple 108dp canvas: the maskable icon is shrunk to 76% so the logo and the
  // "PQRH" label stay inside the 66dp safe circle that round launcher masks keep
  const canvas = Math.round(108 * scale);
  const inner = Math.round(canvas * 0.76);
  await sharp({ create: { width: canvas, height: canvas, channels: 4, background: '#7c3aed' } })
    .composite([{ input: await sharp(maskable).resize(inner, inner).png().toBuffer(), gravity: 'centre' }])
    .png().toFile(join(dir, 'ic_launcher_foreground.png'));
}
console.log('Android icons written');
