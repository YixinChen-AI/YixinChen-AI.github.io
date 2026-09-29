# YixinChen-AI.github.io

Personal academic homepage of **Yixin Chen (陈亦新)**, PhD candidate in Medical Imaging AI at Peking University.

Live: <https://yixinchen-ai.github.io>

## Structure

```
.
├── index.html        # Generated English homepage (default)
├── index.zh.html     # Generated Chinese homepage
├── cv.html           # Generated print-ready English CV source
├── cv.zh.html        # Generated print-ready Chinese CV source
├── output/pdf/       # Generated downloadable English and Chinese CVs
├── content/
│   ├── profile.mjs   # Bilingual introduction and timeline
│   ├── research.mjs  # Research summaries, contributions and figure credits
│   └── publications.*.html # Publication entries
├── scripts/
│   ├── build.mjs     # Generate both static pages
│   ├── build-cv-pdf.mjs # Render the generated CV source as PDF
│   └── preview.mjs   # Local preview on port 4173
├── assets/
│   ├── css/style.css # Responsive academic timeline layout
│   ├── js/main.js    # Year navigation and photo viewer
│   └── img/          # Portrait, award photo, book cover and research figures
├── .nojekyll         # disable GitHub Pages Jekyll processing
└── README.md
```

## Local preview

The generated pages open directly in a browser. To update the content and serve a preview, run with Node.js:

```sh
node scripts/build.mjs
node scripts/build-cv-pdf.mjs
node scripts/preview.mjs
```

English: <http://127.0.0.1:4173/>

Chinese: <http://127.0.0.1:4173/index.zh.html>

Edit `content/profile.mjs` for the timeline and introduction, `content/research.mjs` for the research features, or the publication fragments for paper details. Run the build after editing. No package installation is needed.

The homepages and both CVs use the same bilingual content files. The GitHub Pages workflow rebuilds both pages and both downloadable PDFs on every deployment, so CV content does not need to be maintained separately.

## Research images

- MPUM: complete, unmodified Figure 1 from the Nature Communications article, credited under CC BY-NC-ND 4.0.
- PCNet: original anatomical hierarchy diagram from the author's official repository. The transparent figure is displayed on a dark background so its white labels remain readable.
- MASLD: Figure 2 from the accepted EJNMMI manuscript, rendered as a PNG without changes to the figure.

The site links images to a full-size viewer. Research contributions follow the author-contribution statements; author order alone is not used to infer individual duties.

## Deploy

This repo is the GitHub Pages source. Pushing to `main` triggers the existing publishing workflow. Local edits and previews do not publish changes.
