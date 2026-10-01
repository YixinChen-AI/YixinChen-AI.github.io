import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { en, zh, shared, links } from '../content/profile.mjs';
import { research } from '../content/research.mjs';
import { publicationDetails } from '../content/publication-details.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const styleVersion = createHash('sha256').update(fs.readFileSync(path.join(root, 'assets/css/style.css'))).digest('hex').slice(0, 12);
const scriptVersion = createHash('sha256').update(fs.readFileSync(path.join(root, 'assets/js/main.js'))).digest('hex').slice(0, 12);
const e = s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const imageVersions = new Map();
function imageUrl(src) {
  if (!imageVersions.has(src)) {
    imageVersions.set(src, createHash('sha256').update(fs.readFileSync(path.join(root, src))).digest('hex').slice(0, 12));
  }
  return `${src}?v=${imageVersions.get(src)}`;
}
const cvE = s => e(String(s).replaceAll('–', '-').replaceAll('‑', '-'));
const link = (href, label) => `<a class="text-link" href="${e(href)}">${e(label)}</a>`;

function researchFigureLink(w, r) {
  const src = e(imageUrl(w.preview || w.image));
  const alt = e(w.previewAlt || w.alt);
  const picture = w.crop
    ? `<svg viewBox="${w.crop.join(' ')}" width="${w.crop[2]}" height="${w.crop[3]}" role="img" aria-label="${alt}"><image href="${src}" width="${w.width}" height="${w.height}" /></svg>`
    : `<img src="${src}" alt="${alt}" width="${w.width}" height="${w.height}" loading="lazy">`;
  return `<a class="figure-link${w.dark ? ' dark-figure' : ''}" href="${e(w.image)}" data-photo data-display="${w.dark ? 'dark' : 'light'}" data-caption="${e(w.fullCaption)}" data-alt="${e(w.alt)}" aria-label="${e(r.figureLink)}: ${e(w.name)}">${picture}</a>`;
}

function researchWork(w, r) {
  const credit = w.credit.href ? `<a href="${e(w.credit.href)}">${e(w.credit.label)}</a>` : e(w.credit.label);
  return `<article class="selected-work" id="research-${e(w.id)}" aria-labelledby="research-title-${e(w.id)}">
    <div class="research-copy"><p class="research-venue">${e(w.venue)}</p><h3 id="research-title-${e(w.id)}">${e(w.title)}</h3>
      <p class="research-summary">${e(w.summary)}</p>
      <div class="research-links">${w.links.map(l => link(l.href, l.label)).join('')}</div>
    </div>
    <figure class="research-figure research-figure-${e(w.id)}">${researchFigureLink(w, r)}
      <figcaption>${credit}${w.license ? `, <a href="${e(w.license.href)}">${e(w.license.label)}</a>` : ''}</figcaption>
    </figure>
  </article>`;
}

function renderChallenges(t) {
  const entries = [
    { id: 'challenge-autopet', title: t.awardTitle, image: shared.awardImage, alt: t.awardAlt },
    { id: 'challenge-cmr-multi', title: t.awards[0].title },
    { id: 'challenge-reg2', title: t.awards[1].title, ...t.posterPhotos[0] },
    { id: 'challenge-mvaa', title: t.workshop.title, ...t.posterPhotos[1] },
  ];
  return entries.map(entry => {
    const title = `<span class="publication-title">${e(entry.title)}</span>`;
    const photo = entry.image
      ? `<img src="${e(imageUrl(entry.image))}" alt="${e(entry.alt)}" width="3000" height="4000" loading="lazy">`
      : `<div class="challenge-placeholder">${e(t.photoPlaceholder)}</div>`;
    return `<details class="publication-entry challenge-entry" id="${entry.id}"><summary>${title}</summary><div class="challenge-photo">${photo}</div></details>`;
  }).join('');
}

function renderPublicationDirectory(source, key, t) {
  const groups = [...source.matchAll(/<section class="publication-group"[^>]*>([\s\S]*?)<\/section>/g)]
    .map(match => match[1]).filter(group => /<h3[^>]*>20\d{2}<\/h3>/.test(group));
  let index = 0;
  const html = groups.map(group => {
    const year = group.match(/<h3[^>]*>(20\d{2})<\/h3>/)?.[1];
    const entries = [...group.matchAll(/<article class="pub"[^>]*>([\s\S]*?)<\/article>/g)].map(match => {
      const article = match[1];
      const existingId = match[0].match(/<article class="pub" id="([^"]+)"/)?.[1];
      const detail = publicationDetails[index++];
      const title = article.match(/<h4 class="ptitle">([\s\S]*?)<\/h4>/)?.[1];
      const authors = article.match(/<p class="authors">([\s\S]*?)<\/p>/)?.[1];
      const venue = article.match(/<p class="venue">([\s\S]*?)<\/p>/)?.[1];
      const links = article.match(/<div class="links">([\s\S]*?)<\/div>/)?.[1] || '';
      if (!detail || !title || !authors || !venue) throw new Error(`Incomplete publication entry: ${year}`);
      if (!title.replace(/<[^>]*>/g, '').startsWith(detail.match)) {
        throw new Error(`Publication details do not match the title at position ${index}: ${detail.id}`);
      }
      if (detail.image && !fs.existsSync(path.join(root, 'assets/img/publications', detail.image))) {
        throw new Error(`Missing publication image: ${detail.image}`);
      }
      const role = authors.match(/<span class="author-role">([\s\S]*?)<\/span>/)?.[0] || '';
      const fullAuthors = detail.authors
        ? e(detail.authors).replace('Yixin Chen', `<span class="me">Yixin Chen</span>${role}`)
        : authors;
      const imageCredit = detail.source
        ? `<a href="${e(detail.source)}">${key === 'en' ? 'Figure source' : '图片来源'}</a>`
        : key === 'en' ? "Authors' manuscript" : '作者手稿';
      const license = detail.license ? `, <a href="${e(detail.license)}">CC BY-NC-ND 4.0</a>` : '';
      const featuredWork = research[key].works.find(work => work.id === detail.id);
      const figureAlt = key === 'en' ? `Figure for ${title.replace(/<[^>]*>/g, '')}` : `${title.replace(/<[^>]*>/g, '')} 的论文配图`;
      const figureSrc = detail.image ? imageUrl(`assets/img/publications/${detail.image}`) : '';
      const picture = featuredWork ? researchFigureLink(featuredWork, research[key]) : `<a class="figure-link" href="${e(figureSrc)}" data-photo data-caption="${e(title.replace(/<[^>]*>/g, ''))}" data-alt="${e(figureAlt)}" aria-label="${e(research[key].figureLink)}: ${e(title.replace(/<[^>]*>/g, ''))}"><img src="${e(figureSrc)}" alt="${e(figureAlt)}" loading="lazy"></a>`;
      const image = detail.image ? `<figure class="publication-image">${picture}<figcaption>${imageCredit}${license}</figcaption></figure>` : '';
      return `<details class="publication-entry" id="${e(existingId || `paper-${detail.id}`)}"><summary><span class="publication-title">${title}</span><span class="publication-venue">${venue}</span></summary><div class="publication-detail${detail.image ? '' : ' publication-detail-text'}">${image}<div class="publication-copy"><p>${e(detail[key])}</p><p class="publication-authors">${fullAuthors}</p>${links ? `<div class="publication-links">${links}</div>` : ''}</div></div></details>`;
    }).join('');
    return `<section class="publication-year" aria-labelledby="paper-year-${year}"><h3 id="paper-year-${year}">${year}</h3>${year === '2026' ? renderChallenges(t) : ''}${entries}</section>`;
  }).join('');
  if (index !== publicationDetails.length) throw new Error(`Expected ${publicationDetails.length} peer-reviewed papers, found ${index}`);
  return html;
}

function render(t, key) {
  const isEn = key === 'en';
  const r = research[key];
  const url = `https://yixinchen-ai.github.io/${isEn ? '' : 'index.zh.html'}`;
  const publications = fs.readFileSync(path.join(root, `content/publications.${key}.html`), 'utf8');
  const publicationDirectory = renderPublicationDirectory(publications, key, t);
  const introPublications = e(t.introPublications).replace(/Nature Communications|IEEE TMI|IEEE TRPMS|EJNMMI/g, '<strong>$&</strong>');
  const timeline = t.timeline.map(item => `<li class="timeline-${e(item.category)}"><div class="timeline-meta"><span class="timeline-year">${e(item.year)}</span><span class="timeline-category">${e(t.timelineCategories[item.category])}</span></div><p>${e(item.text)}</p></li>`).join('');

  return `<!doctype html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(t.title)}</title><meta name="description" content="${e(t.description)}"><meta name="author" content="Yixin Chen">
  <meta property="og:type" content="website"><meta property="og:title" content="${e(t.title)}"><meta property="og:description" content="${e(t.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="https://yixinchen-ai.github.io/assets/img/avatar.png"><meta name="twitter:card" content="summary">
  <meta name="theme-color" content="#ffffff"><link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en" href="https://yixinchen-ai.github.io/"><link rel="alternate" hreflang="zh-CN" href="https://yixinchen-ai.github.io/index.zh.html"><link rel="alternate" hreflang="x-default" href="https://yixinchen-ai.github.io/">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/css/style.css?v=${styleVersion}"><script src="assets/js/main.js?v=${scriptVersion}" defer></script>
</head>
<body id="top">
<a class="skip-link" href="#main">${e(t.skip)}</a>
<header class="site-header"><div class="header-inner"><a class="site-name" href="#top">Yixin Chen</a><nav aria-label="${isEn ? 'Main navigation' : '主导航'}"><a href="#research">${t.nav[1]}</a><a href="#publications">${t.nav[2]}</a><button type="button" popovertarget="journey" aria-controls="journey" aria-expanded="false">${t.nav[0]}</button><a href="#contact">${t.nav[3]}</a></nav><div class="language" role="group" aria-label="Language / 语言"><a href="index.html" lang="en" hreflang="en" ${isEn ? 'aria-current="page"' : ''}>English</a><a href="index.zh.html" lang="zh-CN" hreflang="zh-CN" ${!isEn ? 'aria-current="page"' : ''}>中文</a></div></div></header>
<main id="main" class="page">
<section class="hero" aria-labelledby="name"><div class="identity"><div class="name-line"><h1 id="name">${e(t.name)}</h1><span class="other-name">${e(t.otherName)}</span></div><p class="affiliation">${e(t.affiliation)}</p></div><figure class="portrait"><a href="${shared.portraitImage}" data-photo data-caption="${e(t.portraitCaption)}"><img src="${shared.portraitImage}" alt="${e(t.portraitAlt)}" width="1254" height="1254" fetchpriority="high"></a></figure><div class="hero-links">${link(links.email, t.email)}${link(links.scholar, t.scholar)}${link(links.github, 'GitHub')}<a class="text-link" href="${e(links.cvEn)}" download>${e(t.cvEn)}</a><a class="text-link" href="${e(links.cvZh)}" download>${e(t.cvZh)}</a></div><p class="intro" id="research-funding"><strong>${e(t.introFunding)}</strong> ${e(t.intro)} ${introPublications}</p></section>
<section id="research" class="selected-research" aria-labelledby="research-title"><div class="section-heading"><h2 id="research-title">${e(r.heading)}</h2></div>${r.works.map(w => researchWork(w, r)).join('')}</section>
<section id="publications" class="publications" aria-labelledby="pub-title"><div class="section-heading"><h2 id="pub-title">${e(t.publications)}</h2>${link(links.scholar, t.allPapers)}</div><div class="publication-directory">${publicationDirectory}</div></section>
<section class="service" aria-labelledby="service-title"><h2 id="service-title">${e(t.service)}</h2><dl><div><dt>${e(t.patentTitle)}</dt><dd>${e(t.patentDetail)}</dd></div><div><dt>${e(t.reviewTitle)}</dt><dd>${e(t.reviewDetail)}</dd></div><div><dt>${e(t.teachingTitle)}</dt><dd>${e(t.teachingDetail)} <a class="text-link" href="${e(links.course)}">${e(t.teachingLink)}</a></dd></div><div><dt>${e(t.writingTitle)}</dt><dd>${e(t.writingDetail)}</dd></div></dl></section>
<section id="contact" class="contact" aria-labelledby="contact-title"><h2 id="contact-title">${e(t.contactTitle)}</h2><div class="email-list"><a href="${links.email}">yixinchen0320@gmail.com</a><a href="${links.pku}">2311110791@stu.pku.edu.cn <span>(${e(t.pkuEmail)})</span></a></div><div class="contact-links">${link(links.scholar, 'Google Scholar')}${link(links.github, 'GitHub')}${link(links.orcid, 'ORCID')}</div></section>
<footer><span>${e(t.footer)}</span><span>${e(t.updated)}</span><a href="#top">${isEn ? 'Back to top' : '返回顶部'}</a></footer>
</main>
<button class="timeline-trigger" type="button" popovertarget="journey" aria-controls="journey" aria-expanded="false">${e(t.journey)}</button>
<aside id="journey" class="timeline-panel" popover="auto" role="dialog" aria-labelledby="journey-title"><div class="timeline-heading"><h2 id="journey-title">${e(t.journey)}</h2><button class="timeline-close" type="button" popovertarget="journey" popovertargetaction="hide" aria-label="${e(t.closeJourney)}" autofocus>×</button></div><ol class="timeline-list" tabindex="0" aria-label="${e(t.journey)}">${timeline}</ol></aside>
<dialog class="photo-viewer" aria-label="${isEn ? 'Image viewer' : '图片预览'}"><button class="close-photo" aria-label="${isEn ? 'Close image' : '关闭图片'}">×</button><figure><img alt=""><figcaption></figcaption></figure><a class="original-image text-link" target="_blank" rel="noopener">${isEn ? 'Open original image' : '打开原始图片'}</a></dialog>
</body></html>`;
}

const cvLabels = {
  en: {
    title: 'Yixin Chen | Curriculum Vitae',
    description: 'Curriculum vitae of Yixin Chen, PhD candidate at Peking University.',
    research: 'Research profile', education: 'Education', results: 'Challenge results and research funding',
    experience: 'Professional experience', publications: 'Publications and presentations',
    service: 'Patents, teaching and academic service',
    pku: 'Peking University', pkuDegree: 'PhD in Medical Technology',
    xmu: 'Xiamen University', xmuDegree: "BSc in Automation; second bachelor's degree in Mathematical Finance",
    autopet: 'MICCAI autoPET V challenge, interactive PET/CT lesion segmentation.',
  },
  zh: {
    title: '陈亦新 | 个人简历',
    description: '陈亦新，北京大学医学技术博士研究生。',
    research: '研究方向', education: '教育经历', results: '挑战赛成绩与科研项目',
    experience: '工作经历', publications: '论文与会议报告',
    service: '专利、教学与学术服务',
    pku: '北京大学', pkuDegree: '医学技术博士研究生',
    xmu: '厦门大学', xmuDegree: '自动化本科，数理金融第二学位',
    autopet: 'MICCAI autoPET V 挑战赛，交互式 PET/CT 病灶分割。',
  },
};

function renderCv(t, key) {
  const labels = cvLabels[key];
  const publications = fs.readFileSync(path.join(root, `content/publications.${key}.html`), 'utf8')
    .replaceAll('–', '-')
    .replaceAll('‑', '-');
  const challengeItems = [
    { title: t.awardTitle, detail: labels.autopet },
    ...t.awards.map(item => ({ title: item.title, detail: item.detail })),
  ];
  const cv = `<!doctype html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${cvE(labels.title)}</title>
  <meta name="description" content="${cvE(labels.description)}">
  <link rel="stylesheet" href="assets/css/cv.css">
</head>
<body>
<header class="cv-header">
  <div><h1>${cvE(t.name)}</h1><p class="cv-role">${cvE(t.affiliation)}</p></div>
  <address><a href="${links.email}">yixinchen0320@gmail.com</a><a href="${links.pku}">2311110791@stu.pku.edu.cn</a><a href="https://yixinchen-ai.github.io">yixinchen-ai.github.io</a></address>
  <nav><a href="${links.scholar}">Google Scholar</a><a href="${links.github}">GitHub</a><a href="${links.orcid}">ORCID</a></nav>
</header>
<main>
  <section><h2>${cvE(labels.research)}</h2><p>${cvE(t.intro)}</p></section>
  <section><h2>${cvE(labels.education)}</h2>
    <article class="cv-entry"><div><h3>${cvE(labels.pku)}</h3><p>${cvE(labels.pkuDegree)}</p></div><p class="cv-date">${cvE(t.phdDate)}</p></article>
    <article class="cv-entry"><div><h3>${cvE(t.londonTitle)}</h3><p>${cvE(t.londonDegree)}</p></div><p class="cv-date">${cvE(t.londonDate)}</p></article>
    <article class="cv-entry"><div><h3>${cvE(labels.xmu)}</h3><p>${cvE(labels.xmuDegree)}</p></div><p class="cv-date">2015-2019</p></article>
  </section>
  <section><h2>${cvE(labels.results)}</h2>
    ${challengeItems.map(item => `<article class="cv-entry"><div><h3>${cvE(item.title)}</h3><p>${cvE(item.detail)}</p></div><p class="cv-date">2026</p></article>`).join('')}
    <article class="cv-entry"><div><h3>${cvE(t.fundingTitle)}</h3><p>${cvE(t.fundingBody)}</p></div><p class="cv-date">${cvE(t.fundingDate)}</p></article>
  </section>
  <section><h2>${cvE(labels.experience)}</h2>
    ${t.jobs.map(item => `<article class="cv-entry"><div><h3>${cvE(item.name)}</h3><p class="cv-subtitle">${cvE(item.role)}</p>${item.paragraphs.map(p => `<p>${cvE(p)}</p>`).join('')}</div><p class="cv-date">${cvE(item.date)}</p></article>`).join('')}
  </section>
  <section class="cv-publications"><h2>${cvE(labels.publications)}</h2>${publications}</section>
  <section><h2>${cvE(labels.service)}</h2>
    <article class="cv-entry"><div><h3>${cvE(t.patentTitle)}</h3><p>${cvE(t.patentDetail)}</p></div></article>
    <article class="cv-entry"><div><h3>${cvE(t.reviewTitle)}</h3><p>${cvE(t.reviewDetail)}</p></div></article>
    <article class="cv-entry"><div><h3>${cvE(t.teachingTitle)}</h3><p>${cvE(t.teachingDetail)}</p></div></article>
    <article class="cv-entry"><div><h3>${cvE(t.bookName)}</h3><p>${cvE(t.bookDetail)}</p></div><p class="cv-date">2021</p></article>
  </section>
</main>
</body></html>`;
  if (cv.includes(String.fromCharCode(183))) throw new Error('Forbidden separator character in CV');
  return cv;
}

for (const [key, text] of [['en', en], ['zh', zh]]) {
  const html = render(text, key);
  if (html.includes(String.fromCharCode(183))) throw new Error('Forbidden separator character');
  fs.writeFileSync(path.join(root, key === 'en' ? 'index.html' : 'index.zh.html'), html);
}
fs.writeFileSync(path.join(root, 'cv.html'), renderCv(en, 'en'));
fs.writeFileSync(path.join(root, 'cv.zh.html'), renderCv(zh, 'zh'));
console.log('Built English and Chinese homepages and CV sources.');
