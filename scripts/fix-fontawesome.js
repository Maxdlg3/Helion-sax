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
const FA_INT = 'sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==';

const CORRECT = `<link rel="preload" href="${FA_URL}" as="style" onload="this.onload=null;this.rel='stylesheet'" integrity="${FA_INT}" crossorigin="anonymous" referrerpolicy="no-referrer">
<noscript><link rel="stylesheet" href="${FA_URL}" integrity="${FA_INT}" crossorigin="anonymous" referrerpolicy="no-referrer"></noscript>`;

for (const file of getHtmlFiles(root)) {
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('font-awesome')) continue;

  // Remove everything related to font-awesome (all variants) and replace with single correct block
  // Match from first font-awesome link/tag start to the last </noscript> closing it
  c = c.replace(/(<link[^>]*font-awesome[^>]*>[\s\S]*?<\/noscript>\s*<\/noscript>|<link[^>]*font-awesome[^>]*\/>\s*|<link[^>]*font-awesome[^>]*>\s*<noscript>[\s\S]*?<\/noscript>\s*)/g, '');

  // Now find where to insert: after the cdnjs preconnect line or before </head>
  if (!c.includes('font-awesome')) {
    // Insert before </head> or before the style.css link
    c = c.replace('<link rel="stylesheet" href="/style.css">', `${CORRECT}\n<link rel="stylesheet" href="/style.css">`);
    c = c.replace('<link rel="stylesheet" href="style.css">', `${CORRECT}\n<link rel="stylesheet" href="style.css">`);
  }

  fs.writeFileSync(file, c, 'utf8');
  console.log('Fixed:', path.relative(root, file));
}
console.log('Done.');
