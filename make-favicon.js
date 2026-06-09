import opentypeModule from 'opentype.js';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const opentype = opentypeModule.default ?? opentypeModule;
const __dirname = dirname(fileURLToPath(import.meta.url));

const fontPath = String.raw`C:\Users\Equipo\Desktop\CVM\Fuentes\hells-kittchen-devil-god\Hells Kittchen Devil God (Font by Manuel Viergutz)\Hells Kittchen Devil God.ttf`;
const font = opentype.parse(readFileSync(fontPath).buffer);

const SIZE = 500;
const FONT_SIZE = 520;

const pathObj = font.getPath('t', 0, 0, FONT_SIZE);
const bb = pathObj.getBoundingBox();
const glyphW = bb.x2 - bb.x1;
const glyphH = bb.y2 - bb.y1;

const offsetX = (SIZE - glyphW) / 2 - bb.x1;
const offsetY = (SIZE - glyphH) / 2 - bb.y1;

const centeredPath = font.getPath('t', offsetX, offsetY, FONT_SIZE);
const pathData = centeredPath.toPathData(2);

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" fill="#080808"/>
  <path d="${pathData}" fill="#ffffff"/>
</svg>`;

writeFileSync(join(__dirname, 'favicon-t.svg'), svgContent);

const SIZES = [16, 32, 48, 256];

async function main() {
  const pngBuffers = await Promise.all(
    SIZES.map(s =>
      sharp(Buffer.from(svgContent))
        .resize(s, s, { fit: 'cover' })
        .png()
        .toBuffer()
    )
  );
  const ico = await pngToIco(pngBuffers);
  writeFileSync(join(__dirname, 'favicon.ico'), ico);
  console.log('favicon.ico created successfully');
}

main().catch(err => { console.error(err); process.exit(1); });
