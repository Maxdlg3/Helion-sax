const fs   = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function getHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getHtmlFiles(full));
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

const FONTS_BLOCK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Playfair+Display:wght@400;600;700&display=swap">`;

for (const file of getHtmlFiles(root)) {
  let c = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Replace Tailwind CDN with compiled file
  if (c.includes('cdn.tailwindcss.com')) {
    c = c.replace('<script src="https://cdn.tailwindcss.com"></script>', '<link rel="stylesheet" href="/tailwind.css">');
    changed = true;
  }

  // 2. Add Google Fonts after cdnjs preconnect (only if not already present)
  if (!c.includes('fonts.googleapis.com')) {
    c = c.replace(
      '<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>',
      `<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>\n${FONTS_BLOCK}`
    );
    changed = true;
  }

  // 3. Rename mariage.jfif → mariage.jpg everywhere
  if (c.includes('mariage.jfif')) {
    c = c.replace(/mariage\.jfif/g, 'mariage.jpg');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, c, 'utf8');
    console.log('Updated:', path.relative(root, file));
  }
}
console.log('Done.');
