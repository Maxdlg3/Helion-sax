const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imgDir = path.join(__dirname, '../images');
const targets = [
  { src: 'hero-mariage.jpg',        out: 'hero-mariage.webp',        width: 1920 },
  { src: 'hero-entreprise.jpg',     out: 'hero-entreprise.webp',     width: 1920 },
  { src: 'hero-apropos.jpg',        out: 'hero-apropos.webp',        width: 1920 },
  { src: 'hero-tarifs.jpg',         out: 'hero-tarifs.webp',         width: 1920 },
  { src: 'helion-portrait.jpg',     out: 'helion-portrait.webp',     width: 800  },
  { src: 'client-helion.jpeg',      out: 'client-helion.webp',       width: 400  },
  { src: 'Client.png',              out: 'client.webp',              width: 400  },
  { src: 'mariage.jfif',            out: 'mariage.webp',             width: 400  },
  { src: 'helion-sax-club-paris.jpeg', out: 'helion-sax-club-paris.webp', width: 1920 },
  { src: 'elion-sax-soiree-privee.jpeg', out: 'elion-sax-soiree-privee.webp', width: 1920 },
];

(async () => {
  for (const { src, out, width } of targets) {
    const input  = path.join(imgDir, src);
    const output = path.join(imgDir, out);
    if (!fs.existsSync(input)) { console.log(`SKIP (not found): ${src}`); continue; }
    if (fs.existsSync(output)) { console.log(`SKIP (exists):    ${out}`); continue; }
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(output);
    const inKB  = Math.round(fs.statSync(input).size  / 1024);
    const outKB = Math.round(fs.statSync(output).size / 1024);
    console.log(`OK  ${src.padEnd(40)} ${inKB}KB → ${outKB}KB`);
  }
})();
