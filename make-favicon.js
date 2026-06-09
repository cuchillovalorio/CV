import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const fs = { readFileSync, writeFileSync };

// SVG with black background added over the same viewBox
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="-40 -20 1357.35 874.93" preserveAspectRatio="xMidYMid meet">
  <rect x="-40" y="-20" width="1357.35" height="874.93" fill="#080808"/>
  ${fs.readFileSync(join(__dirname, 'cuchillo-blanco.svg'), 'utf8')
      .replace(/<\?xml.*?\?>\s*/s, '')
      .replace(/<svg[^>]*>/, '')
      .replace(/<\/svg>\s*$/, '')
      .trim()}
</svg>`;

const sizes = [16, 32, 48, 256];

async function main() {
  const pngBuffers = await Promise.all(
    sizes.map(size =>
      sharp(Buffer.from(svgContent))
        .resize(size, size, { fit: 'contain', background: '#080808' })
        .png()
        .toBuffer()
    )
  );

  const ico = await pngToIco(pngBuffers);
  fs.writeFileSync(join(__dirname, 'favicon.ico'), ico);
  console.log('favicon.ico created successfully');
}

main().catch(err => { console.error(err); process.exit(1); });
