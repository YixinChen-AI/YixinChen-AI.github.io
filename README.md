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
│   ├── patents.mjs   # Patent titles, inventors, identifiers, dates and categories
│   ├── research.mjs  # Research summaries and figure credits
│   ├── publications.*.html # Full bilingual publication entries for the CV
│   └── publication-details.mjs # Homepage summaries, paper images and verified citation fields
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

The same preview serves `cv.html`, `cv.zh.html` and both PDF download links. The PDF routes reuse `links.cvEn` and `links.cvZh` from `content/profile.mjs`.

Edit `content/profile.mjs` for the timeline, introduction and doctoral education, `content/research.mjs` for the research features, the publication fragments for titles, venues and author lists, or `content/publication-details.mjs` for the homepage's short summaries, images and shared CV citation fields. Run the build after editing. No package installation is needed.

The current public pages are `index.html` and `index.zh.html`; the current downloadable CVs are `output/pdf/Yixin-Chen-CV.pdf` and `output/pdf/Yixin-Chen-CV-ZH.pdf`. The homepage and CV share 21 publication records, including the REG², CMRSeg and MVAA workshop papers in 2026. Both the homepage and the CV keep five yearly groups, in reverse chronological order. Their workshop venues and Poster / Oral labels remain attached to the individual records; their official MICCAI open-access pages were checked on 2 October 2026. Paper images are stored in `assets/img/publications/`. When an original figure is unavailable, its entry remains text-only rather than displaying an unrelated image.

The Publications section contains papers only. The separate Challenges and presentations section follows it, with one expandable row each for autoPET V, CMR-MULTI, REG² and CHIMERA-agent. Each row shows the year and result, then expands to its brief introduction and available presentation information, method link and event photography. The autoPET, REG² and CHIMERA-agent award photos open full-size; CMR-MULTI retains its previously requested photo placeholder. Standalone poster-photo rows are removed, and poster portraits are no longer displayed. Original photo assets are retained. Challenges remain outside the personal timeline. Both CVs also include the CHIMERA-agent Innovative Agent Solution Award.

The independent News coverage / 新闻报道 section follows Challenges and presentations and precedes Teaching, patents and reviewing on the homepage. It lists two reports from the Institute of Medical Technology, Peking University Health Science Center in reverse chronological order. The CVs list both reports with titles, dates and links in a standalone Peking University news coverage / 北大新闻报道 section. The CV keeps the English CHIMERA-agent award name, Innovative Agent Solution Award.

The REG² fourth-place award photo was supplied by the user on 7 October 2026. Its unchanged 960 × 1280 JPEG is stored locally at `/Volumes/ssd2/grandchallenge/AUTOPET2026/MICCAI 2026颁奖现场合影/REG2_第四名_获奖照片.jpg` and served from `assets/img/reg2-award-2026.jpg`.

The CHIMERA-agent award photo was supplied by the user on 2 October 2026. Its unchanged 1192 × 1280 JPEG is stored locally at `/Volumes/ssd2/grandchallenge/AUTOPET2026/MICCAI 2026颁奖现场合影/CHIMERA-agent_创新智能体方案奖_颁奖合影.jpg` and served from `assets/img/chimera-agent-award-2026.jpg`. The award name and team name are transcribed from the photograph; no numerical ranking is assigned to this award.

The homepage introduction combines the research profile, NSFC project leadership and first-author publications in one paragraph. Only the funding sentence and journal names are emphasized. On screens up to 760px wide, the introduction follows the name and affiliation, with profile and CV links underneath. Gmail, 126 and PKU student email addresses appear only in Contact as selectable plain text, not links or buttons. The addresses come from `emails` in `content/profile.mjs`. Scholar, GitHub and CV links retain their compact row near the introduction. The work section is titled Representative Works / 代表作, with Works / 代表作 in navigation. Funding is no longer a separate homepage feature; its detailed record remains in both CVs. Research summaries state each method's purpose, while the MASLD entry retains its sample size and findings. The 641–760px layout keeps research images beside the text; the compact three-work phone layout is unchanged.

The timeline opens only when a Timeline / 时间线 button is activated. The bottom-right button appears only at viewport widths of 1400px or more, where it fits outside the content column. Narrower screens retain the header button. Both buttons and the panel use the same name. Old `#journey` URLs do not open the panel automatically. It uses the bilingual `timeline` entries in `content/profile.mjs`, covering funding, education, employment and book publication in reverse chronological order. Education dates and markers are blue, employment is brown, and grant/book records are grey; each entry also has a text category. The book entry shows only its title and publisher under the publication year. On phones the panel is a scrollable bottom sheet. Papers remain in the yearly directory and challenges have their own section; detailed employment and education records remain in both CVs.

The platform reported that the introductory computer vision course was withdrawn when checked on 24 October 2026. The homepage and CV retain the recording experience without a course link.

The homepage and CV list the Peking University teaching assistant role separately from independent course recording. On 24 October 2026, the owner confirmed the role for Principles of Medical Imaging Equipment, whose English title is listed on [Prof. Zhaoheng Xie's teaching page](https://xiezhaoheng.github.io/#teaching). The shared course title is defined in `shared.teachingAssistantCourse` in `content/profile.mjs`. Personal appointment dates and duties are omitted because they have not been established; the instructor's course offering dates are not used as appointment dates.

The homepages and both CVs use the same bilingual content files. The current downloadable CVs each have four pages. Page one presents the research profile, a brief output summary, education, the NSFC project, four representative works, a separate Book / 著作 section and Peking University news coverage / 北大新闻报道. Page two contains teaching, professional experience, International conference presentations / 国际学术会议报告经历 and academic service. Page three contains the complete publication list. Page four contains the complete patent list. Each section presents the relevant evidence: research and project leadership, teaching, clinical algorithm development, conference communication and challenge results, peer review, academic authorship or intellectual property.

The first-page summary counts 14 first/co-first-author papers, seven other collaborative papers, 12 patent records (five granted), one sole-authored book and three oral presentations at international conferences. Counts come from the same records and author-role parser as the detailed lists; the oral count uses `shared.presentations.talks`. Concise wording keeps the summary on one line on A4 and desktop, using 10 pt in Chinese and 9.3 pt in English; phones wrap naturally. At the owner's request on 25 October 2026, the complete publication list uses year headings only, with one numbering sequence. Workshop papers appear with the other 2026 papers and retain their actual venues and Poster / Oral labels. All 21 citations preserve their titles, authors, status, bibliographic details and links. Do not add separate workshop or author-role groups.

The representative works are MPUM, PCNet, LUCIDA and MASLD. Each work begins with the venue, author role and available Paper / Code links, then gives the full English title and a brief research description. Paper titles, including MPUM, PCNet and LUCIDA, use regular weight. Venues and key quantitative findings are emphasized. Do not add thematic subheadings between the four works. Titles, venues, status, roles and links reuse the publication records; descriptions reuse the existing research content. The MPUM description names the collaboration with Shandong Provincial Qianfoshan Hospital; the MASLD description names the collaborations with the First Affiliated Hospital of Henan Medical University in Xinxiang and Shandong Provincial Qianfoshan Hospital. The grant lead sentence highlights the principal-investigator role, grant number and RMB 300,000 award.

Teaching and the sole-authored book are independent sections. Teaching keeps the confirmed Peking University assistant role and independently recorded introductory and intermediate courses; its shorter recording description uses the first clause of the shared teaching detail. Professional experience combines each company and job title on one line, then states the main development and clinical integration work. Job descriptions have one source in `content/profile.mjs`. The CV section International conference presentations / 国际学术会议报告经历 contains the three oral reports associated with autoPET V, CMR-MULTI and CHIMERA-agent. Each entry leads with MICCAI 2026 Oral presentation in bold, followed by the challenge and its result in regular weight, with the actual report date aligned right and below the entry on phones. The challenge wording identifies the context of these workshop reports. The report-to-award association is defined by `challengeId` in `shared.presentations.talks`; the conference name and dates come from the same shared presentation records. The homepage and CV reuse `challengeEntries` for award identity and ordering. Both news records appear with their complete titles, dates and links in a standalone section; news links are not repeated beside funding or presentations.

The patent list retains all 12 complete titles, inventor order, a link to the public document, and the current grant or publication number and date. It groups records into granted Chinese inventions, published Chinese applications and a published PCT application. Earlier application and publication stages remain in `content/patents.mjs` but are omitted from the CV when a later grant is available. Do not repeat the full application-to-grant history in each CV entry. Sorting and summary counts use the same patent records.

The CV uses deep navy headings on pale blue-grey background bars, black body text, a 3:4 portrait and an update-date-only footer. Body text remains 10.3 pt and the bibliography 10 pt. Section gaps and line spacing are compact; explicit page breaks start publications and teaching. Doctoral education keeps the expected graduation year without a month. Regenerate and visually inspect both PDFs before replacing the fixed files in `output/pdf/`; temporary candidates belong in `tmp/pdfs/` and are deleted after verification. GitHub Pages rebuilds the HTML and publishes the committed PDFs unchanged.

The structure was checked against [Marianne Rakic's MIT CV](https://mariannerakic.github.io/assets/resume_Marianne.pdf), [Aishik Konwer's Stony Brook CV](https://aishikkonwer95.github.io/CV_Aishik_Nov24.pdf), [Yoonseok Choi's Yonsei CV](https://yoonseokchoi-ai.github.io/cv/cv_yoonseokchoi.pdf), and [Oxford's academic-application guidance](https://www.ox.ac.uk/careers/careers-guidance/job-search-and-applications/writing-applications/academic-applications).

The doctoral entry specifies Medical Imaging Technology, the Institute of Medical Technology at Peking University Health Science Center, and supervisor Prof. Zhaoheng Xie / 谢肇恒教授, using the title confirmed by the author. The institute and supervisor were verified against the [institute's report](https://imt.bjmu.edu.cn/xsfc/5f411968b96d4de2b79ebea2ff7c4ed9.htm); the English institute name follows its official English website. The expected graduation year remains 2027.

The book's Chinese title, `深度学习理论与实战——PyTorch案例详解`, and English cover title, `Deep Learning Theory and Practice Using PyTorch`, follow the original cover in `assets/img/book.png`. Both CVs and the homepage timeline reuse `shared.book`. The Chinese CV section is titled 著作; its entry retains the sole-author credit, publisher, year and ISBN.

CV volume, issue, page range and article-number fields have one bilingual source: `citation` in `content/publication-details.mjs`. They were checked against publisher records and Crossref deposits on 24 October 2026; verification URLs are recorded in each entry. The 2026 TRPMS kinetic-inference article has no assigned volume or issue in the checked record, so its provisional journal pagination is omitted. MICCAI 2026 workshop volumes are included where assigned, while their pending pages remain omitted. Accepted manuscripts retain their existing labels. These fields supplement the CV bibliography without changing the homepage publication summaries.

The CV header labels each link by its purpose: Email, Academic website, Research code and Publications, with corresponding Chinese labels. The email address and homepage domain remain visible; GitHub uses the account name and Google Scholar uses the platform name instead of a query string. All destinations come from `links` in `content/profile.mjs`, including the shared homepage origin. GitHub and Google Scholar were checked on 24 October 2026 for matching identity and research records. ORCID is omitted from the CV. Public profile records were inspected but not edited.

## Research images

Contact includes a WeChat / 微信 link that opens the existing image viewer. The user-supplied contact QR image is saved unchanged at `assets/img/wechat-qr.jpg`, which is both the canonical local copy and the website asset. It was supplied for the homepage on 2 October 2026. The viewer also provides the original image for saving or scanning. No personal WeChat ID is inferred from the account nickname or email addresses.

- MPUM: Figure 1 from Nature Communications, credited under CC BY-NC-ND 4.0. The inline viewport shows the complete input-to-segmentation example in panel c; the viewer opens the complete original figure.
- PCNet: the complete anatomical hierarchy from the author's official repository, displayed on a dark background so its white labels remain readable.
- MASLD: panel B of Figure 2 from the accepted EJNMMI manuscript, showing the whole-body segmentation and organ groups; the viewer opens the complete original figure.
- VP-SFDA: method framework, Figure 2. LUCIDA: framework, Figure 1. Both are extracted from the paper without page headers, body text or captions.
- NeuronCtrl and Rethinking Disentanglement: complete Figure 2 frameworks, including the bottom legends and output paths.
- Adnexal masses: illustrated classification framework, Figure 2. Myocardial infarction: image-to-prediction workflow, Figure 3. Atrial septal defect: quantification examples, Figure 6.

Each paper uses one selected figure consistently. The three featured papers share the same image renderer with the yearly directory. Inline viewports use source-pixel coordinates, not device-dependent zoom offsets; original figures remain intact. Compressed WebP previews and original PNGs serve different display sizes. Other figures keep their natural aspect ratios. Every paper image opens in the full-size viewer, and image URLs carry content hashes to refresh changed assets.

## Visitor map

The bilingual visitor map is rendered after Contact, with a maximum width of 560px and a visible October 2026 collection start date. Its single configuration is `content/visitors.mjs`. The public statistics service is `https://yixin-visitor-stats.yixinchen970320.chatgpt.site`, with its canonical source at `/Volumes/ssd2/github/yixin-visitor-stats`. The owner approved public Sites hosting on 2 October 2026; the homepage remains on GitHub Pages. Collection starts with that deployment and does not reconstruct earlier visits.

`assets/js/visitors.js` uses `GET /stats` and `POST /visit`, returning `{ "total": 0, "countries": {} }` with two-letter country/region codes and non-negative integer counts. Each eligible public page load counts once, including reloads and language changes; these are visits, not unique people. The backend uses trusted edge IP geolocation and stores only country/region counts. Raw IP addresses and individual visit records are absent from the app database. Local previews and browsers requesting Do Not Track or Global Privacy Control only read totals. Unknown locations and recognized crawlers are skipped. Failed requests display an unavailable state rather than invented counts. The map loads near the viewport and supports pointer, touch and keyboard selection; source and license are recorded in `content/world-map-source.md`.

## Deploy

This repo is the GitHub Pages source. Pages uses GitHub Actions as its single publishing entry. Pushing to `main` triggers `.github/workflows/static.yml`, which builds the HTML and deploys the approved PDFs from `output/pdf/` with the site. Local edits and previews do not publish changes.
