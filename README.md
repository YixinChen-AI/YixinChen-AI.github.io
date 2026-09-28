# YixinChen-AI.github.io

Personal academic homepage of **Yixin Chen (陈亦新)**, PhD candidate in Medical Imaging AI at Peking University.

Live: <https://yixinchen-ai.github.io>

## Structure

```
.
├── index.html        # Generated English homepage (default)
├── index.zh.html     # Generated Chinese homepage
├── content/
│   ├── profile.mjs   # Bilingual introduction and timeline
│   └── publications.*.html # Publication entries
├── scripts/
│   ├── build.mjs     # Generate both static pages
│   └── preview.mjs   # Local preview on port 4173
├── assets/
│   ├── css/style.css # Responsive academic timeline layout
│   ├── js/main.js    # Year navigation and photo viewer
│   └── img/          # Portrait, award photo and book cover
├── .nojekyll         # disable GitHub Pages Jekyll processing
└── README.md
```

## Local preview

The generated pages open directly in a browser. To update the content and serve a preview, run with Node.js:

```sh
node scripts/build.mjs
node scripts/preview.mjs
```

English: <http://127.0.0.1:4173/>

Chinese: <http://127.0.0.1:4173/index.zh.html>

Edit `content/profile.mjs` for the timeline and introduction, or the publication fragments for paper details. Run the build after editing. No package installation is needed.

## Deploy

This repo is the GitHub Pages source. Pushing to `main` triggers the existing publishing workflow. Local edits and previews do not publish changes.
