# Jayesh — PHP / Laravel Backend Developer

Personal portfolio site. Static, deployment-ready, published to GitHub Pages at
`https://jayesh-official.github.io/portfolio/`.

## Project structure

```
├── partials/                 # one HTML file per section (source of truth)
├── css/style.css             # hand-written stylesheet (source)
├── js/main.js                # interactions (source)
├── img/                      # optimized images (Laracon JPGs ~3.5 MB total)
├── tools/optimize-images.mjs # local image optimizer (sharp)
├── build.php                 # DEV build → index.html at repo root
├── build.prod.php            # PROD build → dist/ (minified + SEO-ready)
└── .github/workflows/deploy.yml
```

## Local development

```
php build.php          # regenerate index.html from partials (unminified)
php -S 127.0.0.1:8000  # serves index.html at repo root
```

Edit a section in `partials/`, then re-run `php build.php`.

## Production build

```
php build.prod.php            # or: npm run build
```

Generates `dist/` containing:

- `index.html` — minified, with SEO `<head>`: description, keywords, canonical,
  Open Graph, Twitter card, `theme-color`, JSON-LD (Person schema)
- `css/style.min.css`, `js/main.min.js` — safe-comment-stripped & minified
- `img/` — only the referenced images, already optimized
- `sitemap.xml`, `robots.txt`, `.nojekyll`

## Deploy (GitHub Pages)

1. Push this repo to GitHub (repo name `portfolio`, user `jayesh-official`).
2. On GitHub: **Settings → Pages → Source: "GitHub Actions"** (optional) or
   **Deploy from a branch: `gh-pages` / root**.
3. The workflow builds `dist/` and pushes it to the `gh-pages` branch automatically
   on every push to `main`.

Your site is published at `https://jayesh-official.github.io/portfolio/`.

### Custom domain (later)

Add a file named `CNAME` at the repo root containing your domain (e.g.
`jayesh.dev`). `build.prod.php` copies it into `dist/` automatically. Then set the
custom domain under **Settings → Pages** and add the DNS record as GitHub
instructs.

## Before you go live

- [ ] Replace placeholder contact details in `partials/contact.html`
      (email, phone, WhatsApp, LinkedIn, GitHub).
- [ ] Replace the placeholder `img/Jayesh_CV.pdf` with your real CV.
- [ ] Update the `sameAs` / `email` values inside `build.prod.php` (JSON-LD) to
      match whatever you fill in for the contact section.

## Performance & correctness notes

- Laracon photos re-encoded to ≤1600px, mozjpeg q80 (~75 MB → 3.5 MB).
- Avatar served as WebP (43 KB) via `<picture>` with PNG fallback.
- All asset paths are relative, so the site works under any GitHub Pages path.
- `prefers-reduced-motion` respected; all images lazy-loaded except critical layout.