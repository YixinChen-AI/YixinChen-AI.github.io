# YixinChen-AI.github.io

Personal academic homepage of **Yixin Chen (陈亦新)**, PhD candidate in Medical Imaging AI at Peking University.

Live: <https://yixinchen-ai.github.io>

Use this root URL when sharing the homepage: it opens in English. The fixed header has a prominent English / 中文 selector on desktop and mobile, with the current language highlighted. Language switching preserves the current section.

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
│   ├── css/style.css # Responsive homepage and compact timeline panel
│   ├── js/main.js    # Section navigation, timeline panel and photo viewer
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

The 2026 group starts with the autoPET V, CMR-MULTI, REG² and MVAA entries. Each event has a compact result row that expands to its photograph alone. CMR-MULTI currently expands to a labeled photo placeholder at the user's request; replace it when a corresponding photograph is supplied. CV challenge records are unchanged.

The homepage introduction combines the research profile, NSFC project leadership and first-author publications in one paragraph, directly followed by selected research. Only the funding sentence and journal names are emphasized. Gmail, 126 and PKU student email addresses appear as selectable plain text above the profile and in the Contact section; they are not links or buttons. The addresses come from `emails` in `content/profile.mjs`. Scholar, GitHub and CV links have their own compact row. Funding is no longer a separate homepage feature; its detailed record remains in both CVs. Research summaries state each method's purpose, while the MASLD entry retains its sample size and findings.

The timeline opens only when the header or bottom-right Background / 个人经历 button is activated. On phones (640px and below), only the fixed header entry is shown, keeping the page content clear of floating controls. Old `#journey` URLs do not open the panel automatically. It uses the bilingual `timeline` entries in `content/profile.mjs`, covering funding, education, employment and book publication in reverse chronological order. Education dates and markers are blue, employment is brown, and grant/book records are grey; each entry also has a text category. The book entry shows only its title and publisher under the publication year. On phones the panel is a scrollable bottom sheet. Papers and challenge records remain in the yearly directory; detailed employment and education records remain in both CVs.

The homepages and both CVs use the same bilingual content files. The GitHub Pages workflow rebuilds both pages and both downloadable PDFs on every deployment, so CV content does not need to be maintained separately.

## Research images

- MPUM: Figure 1 from Nature Communications, credited under CC BY-NC-ND 4.0. The inline viewport shows the complete input-to-segmentation example in panel c; the viewer opens the complete original figure.
- PCNet: the complete anatomical hierarchy from the author's official repository, displayed on a dark background so its white labels remain readable.
- MASLD: panel B of Figure 2 from the accepted EJNMMI manuscript, showing the whole-body segmentation and organ groups; the viewer opens the complete original figure.
- VP-SFDA: method framework, Figure 2. LUCIDA: framework, Figure 1. Both are extracted from the paper without page headers, body text or captions.
- NeuronCtrl and Rethinking Disentanglement: complete Figure 2 frameworks, including the bottom legends and output paths.
- Adnexal masses: illustrated classification framework, Figure 2. Myocardial infarction: image-to-prediction workflow, Figure 3. Atrial septal defect: quantification examples, Figure 6.

Each paper uses one selected figure consistently. The three featured papers share the same image renderer with the yearly directory. Inline viewports use source-pixel coordinates, not device-dependent zoom offsets; original figures remain intact. Compressed WebP previews and original PNGs serve different display sizes. Other figures keep their natural aspect ratios. Every paper image opens in the full-size viewer, and image URLs carry content hashes to refresh changed assets.

## Visitor map

The bilingual visitor map is rendered after Contact. Its single configuration is `content/visitors.mjs`. The public statistics service is `https://yixin-visitor-stats.yixinchen970320.chatgpt.site`, with its canonical source at `/Volumes/ssd2/github/yixin-visitor-stats`. The owner approved public Sites hosting on 2 October 2026; the homepage remains on GitHub Pages. Collection starts with this deployment and does not reconstruct earlier visits.

`assets/js/visitors.js` uses `GET /stats` and `POST /visit`, returning `{ "total": 0, "countries": {} }` with two-letter country/region codes and non-negative integer counts. Each eligible public page load counts once, including reloads and language changes; these are visits, not unique people. The backend uses trusted edge IP geolocation and stores only country/region counts. Raw IP addresses and individual visit records are absent from the app database. Local previews and browsers requesting Do Not Track or Global Privacy Control only read totals. Unknown locations and recognized crawlers are skipped. Failed requests display an unavailable state rather than invented counts. The map loads near the viewport and supports pointer, touch and keyboard selection; source and license are recorded in `content/world-map-source.md`.

## Deploy

This repo is the GitHub Pages source. Pushing to `main` triggers the existing publishing workflow. Local edits and previews do not publish changes.
