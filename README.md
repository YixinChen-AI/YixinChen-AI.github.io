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
│   ├── research.mjs  # Research summaries and figure credits
│   ├── publications.*.html # Full bilingual publication entries for the CV
│   └── publication-details.mjs # Bilingual homepage summaries and paper images
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

Edit `content/profile.mjs` for the timeline and introduction, `content/research.mjs` for the research features, the publication fragments for titles, venues and author lists, or `content/publication-details.mjs` for the homepage's short summaries and images. Run the build after editing. No package installation is needed.

The current public pages are `index.html` and `index.zh.html`; the current downloadable CVs are `output/pdf/Yixin-Chen-CV.pdf` and `output/pdf/Yixin-Chen-CV-ZH.pdf`. The homepage displays the 18 papers in the five yearly publication groups. Preprints and challenge abstracts remain in the CV. Paper images are stored in `assets/img/publications/`. When an original figure is unavailable, its entry remains text-only rather than displaying an unrelated image.

The homepages and both CVs use the same bilingual content files. The GitHub Pages workflow rebuilds both pages and both downloadable PDFs on every deployment, so CV content does not need to be maintained separately.

## Research images

- MPUM: Figure 1 from Nature Communications, credited under CC BY-NC-ND 4.0. The inline viewport shows the complete input-to-segmentation example in panel c; the viewer opens the complete original figure.
- PCNet: the complete anatomical hierarchy from the author's official repository, displayed on a dark background so its white labels remain readable.
- MASLD: panel B of Figure 2 from the accepted EJNMMI manuscript, showing the whole-body segmentation and organ groups; the viewer opens the complete original figure.
- VP-SFDA: method framework, Figure 2. LUCIDA: framework, Figure 1. Both are extracted from the paper without page headers, body text or captions.
- NeuronCtrl and Rethinking Disentanglement: complete Figure 2 frameworks, including the bottom legends and output paths.
- Adnexal masses: illustrated classification framework, Figure 2. Myocardial infarction: image-to-prediction workflow, Figure 3. Atrial septal defect: quantification examples, Figure 6.

Each paper uses one selected figure consistently. The three featured papers share the same image renderer with the yearly directory. Inline viewports use source-pixel coordinates, not device-dependent zoom offsets; original figures remain intact. Compressed WebP previews and original PNGs serve different display sizes. Other figures keep their natural aspect ratios. Every paper image opens in the full-size viewer, and image URLs carry content hashes to refresh changed assets.

## Deploy

This repo is the GitHub Pages source. Pushing to `main` triggers the existing publishing workflow. Local edits and previews do not publish changes.
