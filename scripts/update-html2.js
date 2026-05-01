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

const FA_URL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
const FA_INTEGRITY = 'sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==';

const FA_ASYNC = `<link rel="preload" href="${FA_URL}" as="style" onload="this.onload=null;this.rel='stylesheet'" integrity="${FA_INTEGRITY}" crossorigin="anonymous" referrerpolicy="no-referrer">
<noscript><link rel="stylesheet" href="${FA_URL}" integrity="${FA_INTEGRITY}" crossorigin="anonymous" referrerpolicy="no-referrer"></noscript>`;

for (const file of getHtmlFiles(root)) {
  let c = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. FontAwesome → async (match any variant of the link tag)
  if (c.includes(FA_URL) && !c.includes('rel="preload"') && !c.includes("rel='preload'")) {
    c = c.replace(/<link[^>]*font-awesome[^>]*\/>/gs, FA_ASYNC);
    c = c.replace(/<link[^>]*font-awesome[^>]*>/gs, FA_ASYNC);
    changed = true;
  }

  // 2. Logo → <picture> with WebP (subpages use /images/logo.png)
  if (c.includes('/images/logo.png') && !c.includes('logo-315.webp')) {
    c = c.replace(
      /<img src="\/images\/logo\.png" alt="([^"]*)"/g,
      '<picture><source srcset="/images/logo-315.webp" type="image/webp"><img src="/images/logo.png" alt="$1"'
    );
    // Close the picture tag after the img closing
    c = c.replace(/(<picture><source srcset="\/images\/logo-315\.webp" type="image\/webp"><img[^>]*>)(?!<\/picture>)/g, '$1</picture>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, c, 'utf8');
    console.log('Updated:', path.relative(root, file));
  }
}
console.log('Done.');
