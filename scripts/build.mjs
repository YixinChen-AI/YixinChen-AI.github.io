import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { en, zh, shared, links } from '../content/profile.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const e = s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const link = (href, label) => `<a class="text-link" href="${e(href)}">${e(label)}</a>`;
const chapter = (year, body) => `<li class="chapter" id="year-${year}"><h3 class="year">${year}</h3><div class="chapter-body">${body}</div></li>`;
const paper = p => `<article class="research-entry"><div class="entry-heading"><h4><a href="${e(p.href)}">${e(p.title)}</a></h4><span class="venue-label">${e(p.venue)}</span></div><p>${e(p.body)}</p></article>`;
const job = j => `<article class="work-entry"><h4>${e(j.name)}</h4><p>${e(j.role)}</p><p class="date">${e(j.date)}</p></article>`;

function render(t, key) {
  const isEn = key === 'en';
  const url = `https://yixinchen-ai.github.io/${isEn ? '' : 'index.zh.html'}`;
  const publications = fs.readFileSync(path.join(root, `content/publications.${key}.html`), 'utf8');
  const chapters = [
    chapter('2026', `
      <p class="date latest-date">${e(t.latestLabel)}</p>
      <div class="award-feature">
        <figure>
          <a href="${shared.awardImage}" class="photo-link" data-photo data-caption="${e(t.awardCaption)}" aria-label="${e(t.fullPhoto)}">
            <img src="${shared.awardImage}" alt="${e(t.awardAlt)}" width="3000" height="4000" loading="lazy">
          </a>
          <figcaption>${e(t.awardCaption)} <a href="${shared.awardImage}" data-photo data-caption="${e(t.awardCaption)}" aria-label="${e(t.fullPhoto)}"><span>${e(t.fullPhoto)}</span></a></figcaption>
        </figure>
        <div class="challenge-results">
          <article class="autoPET-result"><h4>${e(t.awardTitle)}</h4><p>${e(t.awardBody)}</p>${link(links.autopet, t.awardLink)}</article>
          ${t.awards.map(a => `<article><h4>${e(a.title)}</h4><p>${e(a.detail)}</p>${link(a.href, a.link)}</article>`).join('')}
        </div>
      </div>
      <article class="clinical-entry"><div class="entry-heading"><h4>${e(t.clinicalTitle)}</h4><span class="venue-label">${e(t.clinicalStatus)}</span></div><p>${e(t.clinicalBody)}</p></article>
      <article class="funding-entry"><h4>${e(t.fundingTitle)}</h4><p>${e(t.fundingBody)}</p><p class="date">${e(t.fundingDate)}</p></article>`),
    chapter('2025', `<article class="research-entry mpum-entry"><div class="entry-heading"><h4>${e(t.mpumTitle)}</h4><span class="venue-label">Nature Communications</span></div><p>${e(t.mpumBody)}</p><div class="links">${link(links.mpum, t.paperLink)}${link(links.mpumCode, t.codeLink)}</div></article>`),
    chapter('2024', t.papers2024.map(paper).join('')),
    chapter('2023', `${paper(t.paper2023)}<article class="education-entry"><h4>${e(t.phdTitle)}</h4><p class="date">${e(t.phdDate)}</p></article>`),
    chapter('2022', job(t.jobs[0])),
    chapter('2021', `<article class="book-feature"><a href="${shared.bookImage}" class="book-image" data-photo data-caption="${e(t.bookName)}"><img src="${shared.bookImage}" alt="${e(t.bookAlt)}" width="435" height="592" loading="lazy"></a><div><h4>${e(t.bookName)}</h4><p>${e(t.bookDetail)}</p></div></article>`),
    chapter('2020', job(t.jobs[1])),
    chapter('2019', `<article class="education-entry"><h4>${e(t.londonTitle)}</h4><p>${e(t.londonDegree)}</p><p class="date">${e(t.londonDate)}</p><p class="london-note">${e(t.londonBody)}</p></article><p class="undergraduate">${e(t.undergraduate)}</p>`),
  ].join('\n');

  return `<!doctype html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(t.title)}</title><meta name="description" content="${e(t.description)}"><meta name="author" content="Yixin Chen">
  <meta property="og:type" content="website"><meta property="og:title" content="${e(t.title)}"><meta property="og:description" content="${e(t.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="https://yixinchen-ai.github.io/assets/img/avatar.png"><meta name="twitter:card" content="summary">
  <meta name="theme-color" content="#ffffff"><link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en" href="https://yixinchen-ai.github.io/"><link rel="alternate" hreflang="zh-CN" href="https://yixinchen-ai.github.io/index.zh.html"><link rel="alternate" hreflang="x-default" href="https://yixinchen-ai.github.io/">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/css/style.css"><script src="assets/js/main.js" defer></script>
</head>
<body id="top">
<a class="skip-link" href="#main">${e(t.skip)}</a>
<header class="site-header"><div class="header-inner"><a class="site-name" href="#top">Yixin Chen</a><nav aria-label="${isEn ? 'Main navigation' : '主导航'}"><a href="#journey">${t.nav[0]}</a><a href="#publications">${t.nav[1]}</a><a href="#contact">${t.nav[2]}</a></nav><div class="language"><a href="index.html" lang="en" ${isEn ? 'aria-current="page"' : ''}>EN</a><a href="index.zh.html" lang="zh-CN" ${!isEn ? 'aria-current="page"' : ''}>中文</a></div></div></header>
<main id="main" class="page">
<section class="hero" aria-labelledby="name"><div class="identity"><div class="name-line"><h1 id="name">${e(t.name)}</h1><span class="other-name">${e(t.otherName)}</span></div><p class="affiliation">${e(t.affiliation)}</p></div><figure class="portrait"><a href="${shared.portraitImage}" data-photo data-caption="${e(t.portraitCaption)}"><img src="${shared.portraitImage}" alt="${e(t.portraitAlt)}" width="1254" height="1254" fetchpriority="high"></a></figure><p class="intro">${e(t.intro)}</p><div class="hero-links">${link(links.email, t.email)}${link(links.scholar, t.scholar)}${link(links.github, 'GitHub')}</div></section>
<section id="journey" class="journey" aria-labelledby="journey-title"><div class="section-heading"><h2 id="journey-title">${e(t.journey)}</h2></div><div class="journey-layout"><aside class="year-index"><nav aria-label="${e(t.yearNav)}">${shared.years.map(y => `<a href="#year-${y}">${y}</a>`).join('')}</nav></aside><ol class="chapters">${chapters}</ol></div></section>
<section id="publications" class="publications" aria-labelledby="pub-title"><div class="section-heading"><h2 id="pub-title">${e(t.publications)}</h2>${link(links.scholar, t.allPapers)}</div><div class="pub-list">${publications}</div></section>
<section class="service" aria-labelledby="service-title"><h2 id="service-title">${e(t.service)}</h2><dl><div><dt>${e(t.patentTitle)}</dt><dd>${e(t.patentDetail)}</dd></div><div><dt>${e(t.reviewTitle)}</dt><dd>${e(t.reviewDetail)}</dd></div></dl></section>
<section id="contact" class="contact" aria-labelledby="contact-title"><h2 id="contact-title">${e(t.contactTitle)}</h2><div class="email-list"><a href="${links.email}">yixinchen0320@gmail.com</a><a href="${links.pku}">2311110791@stu.pku.edu.cn <span>(${e(t.pkuEmail)})</span></a></div><div class="contact-links">${link(links.scholar, 'Google Scholar')}${link(links.github, 'GitHub')}${link(links.orcid, 'ORCID')}</div></section>
<footer><span>${e(t.footer)}</span><span>${e(t.updated)}</span><a href="#top">${isEn ? 'Back to top' : '返回顶部'}</a></footer>
</main>
<dialog class="photo-viewer" aria-label="${isEn ? 'Photo viewer' : '照片预览'}"><button class="close-photo" aria-label="${isEn ? 'Close photo' : '关闭照片'}">×</button><figure><img alt=""><figcaption></figcaption></figure></dialog>
</body></html>`;
}

for (const [key, text] of [['en', en], ['zh', zh]]) {
  const html = render(text, key);
  if (html.includes(String.fromCharCode(183))) throw new Error('Forbidden separator character');
  fs.writeFileSync(path.join(root, key === 'en' ? 'index.html' : 'index.zh.html'), html);
}
console.log('Built English and Chinese homepages.');
