// Renders build/diagrams/*.svg to PNG in images/ (white background) with headless Chromium.
// Run after editing an SVG: node build/diagrams/render.mjs   (set CHROMIUM_PATH if Playwright has no browser)
import { chromium } from 'playwright';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const fontCss = readFileSync(join(root, 'node_modules', '@fontsource', 'inter', 'index.css'), 'utf8')
  .replace(/url\(\.\/files\//g, `url(file://${join(root, 'node_modules', '@fontsource', 'inter', 'files')}/`);
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
for (const f of readdirSync(here).filter((n) => n.endsWith('.svg'))) {
  const svg = readFileSync(join(here, f), 'utf8');
  const [, , w, h] = svg.match(/viewBox="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(`<style>${fontCss}*{margin:0}svg{display:block;width:${w}px;height:${h}px}</style>${svg}`);
  await page.evaluate(() => document.fonts.ready);
  const out = join(root, 'images', f.replace(/\.svg$/, '.png'));
  await page.screenshot({ path: out, omitBackground: false });
  console.log(`Wrote ${out}`);
  await page.close();
}
await browser.close();
