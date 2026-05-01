# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build commands

```bash
npm run build            # recompile Tailwind + minify CSS + minify JS
npm run build:tailwind   # tailwind.css from src/input.css
npm run build:css        # style.css from style.src.css (minified)
npm run build:js         # script.js from script.src.js (minified)
npm run build:webp       # convert new images to WebP via scripts/convert-webp.js
```

**Always run `npm run build` after editing `style.src.css` or `script.src.js`.** The `.src.*` files are the editable sources; `style.css` and `script.js` are the minified outputs committed to the repo.

## Architecture

Static site for helionsax.com (saxophoniste événementiel, Paris). Deployed via GitHub Pages (CNAME → helionsax.com). No framework, no SSG — raw HTML/CSS/JS.

### File roles

| File | Role |
|---|---|
| `style.src.css` | Editable CSS source — edit this, then `npm run build:css` |
| `style.css` | Minified CSS output — do not edit directly |
| `script.src.js` | Editable JS source — edit this, then `npm run build:js` |
| `script.js` | Minified JS output — do not edit directly |
| `src/input.css` | Tailwind entry point (`@import "tailwindcss"`) |
| `tailwind.css` | Compiled Tailwind (8KB) — replaces the CDN on all pages |
| `scripts/convert-webp.js` | One-time image conversion via `sharp` |

### Page structure

- `index.html` — homepage
- `mariage/`, `entreprise/`, `a-propos/`, `tarifs/` — main service pages
- `blog/*/` — SEO blog articles
- `saxophoniste-{ville}/` — local SEO landing pages (lyon, bordeaux, marseille, lille, beaune)

All pages share the same top-bar, menu drawer, footer, and JS (`script.js`). Each page loads `/style.css`, `/tailwind.css`, FontAwesome CDN, and Google Fonts (Playfair Display + Cormorant Garamond).

### CSS background images vs `<picture>`

Hero sections use CSS `background-image` (not `<img>`), so WebP is handled via `image-set()` in the inline style. Only `<img>` tags use `<picture>` + `<source type="image/webp">`.

### Schema.org

`index.html` has a single `@graph` JSON-LD block with `LocalBusiness + MusicGroup`, `FAQPage`, reviews, and offers. Sub-pages each have their own `Service + FAQPage + BreadcrumbList` schema. **Do not add a second `LocalBusiness` block** — it was removed intentionally to avoid duplicate entity confusion in Google.

### Images

- WebP versions exist for: `helion-sax-club-paris`, `elion-sax-soiree-privee`, `helion-portrait`, `client-helion`, `client` (from Client.png), `mariage`
- Hero background images (`hero-mariage.jpg`, etc.) have **no WebP** — their JPEGs are already heavily compressed and the WebP output was larger
- `mariage.jfif` was renamed to `mariage.jpg` — do not re-introduce `.jfif` references

### Key JS behaviours (script.src.js)

- `initHeroAnimation` — parallax + slow zoom on desktop only (disabled < 992px), pauses via IntersectionObserver when hero is off-screen
- `initLazyYoutube` — `.youtube-lazy[data-videoid]` divs become iframes on click; thumbnails loaded lazily
- `handlePreloader` — hides after `window.load` + 800ms minimum display, 2500ms hard cap
- `initClientSlider` — manual prev/next carousel for testimonials
