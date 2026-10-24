import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { en, zh, shared, links, emails } from '../content/profile.mjs';
import { research } from '../content/research.mjs';
import { publicationDetails } from '../content/publication-details.mjs';
import { patents, patentCategories, patentText } from '../content/patents.mjs';
import { visitors } from '../content/visitors.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const styleVersion = createHash('sha256').update(fs.readFileSync(path.join(root, 'assets/css/style.css'))).digest('hex').slice(0, 12);
const scriptVersion = createHash('sha256').update(fs.readFileSync(path.join(root, 'assets/js/main.js'))).digest('hex').slice(0, 12);
const visitorScriptVersion = createHash('sha256').update(fs.readFileSync(path.join(root, 'assets/js/visitors.js'))).digest('hex').slice(0, 12);
const e = s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const imageVersions = new Map();
function imageUrl(src) {
  if (!imageVersions.has(src)) {
    imageVersions.set(src, createHash('sha256').update(fs.readFileSync(path.join(root, src))).digest('hex').slice(0, 12));
  }
  return `${src}?v=${imageVersions.get(src)}`;
}
const cvE = e;
const cvCssString = s => String(s).replaceAll('\\', '\\\\').replaceAll('"', '\\"');
const link = (href, label) => `<a class="text-link" href="${e(href)}">${e(label)}</a>`;
const equalContributionNotes = {
  en: '* Equal contribution.',
  zh: '* 共同第一作者。',
};

function equalContributionNames(authors) {
  const marker = '<span class="author-role">*</span>';
  const names = [];
  let cursor = 0;
  while ((cursor = authors.indexOf(marker, cursor)) !== -1) {
    const before = authors.slice(0, cursor);
    const segment = before.slice(before.lastIndexOf(',') + 1).replace(/<[^>]*>/g, '').trim();
    if (segment) names.push(segment);
    cursor += marker.length;
  }
  return names;
}

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
    { id: 'challenge-autopet', title: t.awardTitle, detail: `${t.awardBody} ${t.awardPresentation}`, image: shared.awardImage, width: 3000, height: 4000, alt: t.awardAlt, href: links.autopet, link: t.awardLink },
    { id: 'challenge-cmr-multi', ...t.awards[0], placeholder: true },
    { id: 'challenge-reg2', ...t.awards[1], detail: `${t.regChallengeBody} ${t.awards[1].detail}`, image: shared.regAwardImage, width: 960, height: 1280, alt: t.regAwardAlt },
    { id: 'challenge-chimera-agent', ...t.chimeraAward, image: shared.chimeraAwardImage, width: 1192, height: 1280 },
  ];
  return entries.map(entry => {
    const title = `<span class="publication-title"><span class="challenge-year">2026</span> ${e(entry.title)}</span>`;
    const photo = entry.image
      ? `<div class="challenge-photo"><a href="${e(entry.image)}" data-photo data-caption="${e(entry.title)}" data-alt="${e(entry.alt)}" aria-label="${e(t.fullPhoto)}"><img src="${e(imageUrl(entry.image))}" alt="${e(entry.alt)}" width="${entry.width}" height="${entry.height}" loading="lazy"></a></div>`
      : entry.placeholder ? `<div class="challenge-placeholder">${e(t.photoPlaceholder)}</div>` : '';
    const methodLink = entry.href ? `<div class="challenge-links">${link(entry.href, entry.link)}</div>` : '';
    return `<details class="publication-entry challenge-entry" id="${entry.id}"><summary>${title}</summary><div class="challenge-detail"><p>${e(entry.detail)}</p>${methodLink}${photo}</div></details>`;
  }).join('');
}

function renderNews(t) {
  return `<div class="news-list">${t.news.map(item => `<article class="news-item"><time class="news-date" datetime="${e(item.date)}">${e(item.date)}</time><div class="news-copy"><h3 class="news-title"><a href="${e(item.href)}">${e(item.title)}</a></h3><p class="news-source">${e(t.newsSource)}</p></div></article>`).join('')}</div>`;
}

function patentCounts() {
  return patents.reduce((counts, patent) => {
    counts[patent.category] += 1;
    return counts;
  }, { total: patents.length, granted: 0, published: 0, pct: 0 });
}

function patentInventors(inventors, key) {
  return inventors.map(name => name === zh.name
    ? `<strong>${e(key === 'en' ? `${en.name} (${zh.name})` : name)}</strong>`
    : e(name)).join(key === 'en' ? ', ' : '、');
}

function patentMetadata(patent, key) {
  const text = patentText[key];
  const fields = [
    [text.application, patent.applicationNumber, patent.filingDate],
    [text.publication, patent.publicationNumber, patent.publicationDate],
    ...(patent.grantNumber ? [[text.grant, patent.grantNumber, patent.grantDate]] : []),
  ];
  const items = fields.map(([label, number, date]) => `<span class="patent-field">${e(label)} ${e(number)} (${e(date)})</span>`);
  if (key === 'en') return items.slice(0, 2).join('; ') + (items[2] ? `<br>${items[2]}` : '') + '.';
  return items.join('；') + '。';
}

function renderPatentGroups(key) {
  return patentCategories.map(category => {
    const items = patents.filter(patent => patent.category === category.id)
      .sort((a, b) => (b.grantDate || b.publicationDate).localeCompare(a.grantDate || a.publicationDate) || b.filingDate.localeCompare(a.filingDate))
      .map(patent => `<li class="patent-item"><h4><a href="${e(patent.url)}">${e(patent.title[key])}</a></h4><p class="patent-inventors">${patentInventors(patent.inventors, key)}</p><p class="patent-metadata">${patentMetadata(patent, key)}</p></li>`).join('');
    return `<section class="patent-group" aria-labelledby="patent-${e(category.id)}-${e(key)}"><h3 id="patent-${e(category.id)}-${e(key)}">${e(category.label[key])}</h3><ol class="patent-list">${items}</ol></section>`;
  }).join('');
}

function patentSummary(key) {
  return patentText[key].summary(patentCounts());
}

function renderPublicationDirectory(source, key) {
  const groups = [...source.matchAll(/<section class="publication-group"[^>]*>([\s\S]*?)<\/section>/g)].map(match => match[1]);
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
      let fullAuthors = authors;
      if (detail.authors) {
        fullAuthors = e(detail.authors);
        for (const name of equalContributionNames(authors)) {
          fullAuthors = fullAuthors.replace(e(name), `${e(name)}<span class="author-role">*</span>`);
        }
        fullAuthors = fullAuthors.replace('Yixin Chen', '<span class="me">Yixin Chen</span>');
      }
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
    return `<section class="publication-year" aria-labelledby="paper-year-${year}"><h3 id="paper-year-${year}">${year}</h3>${entries}</section>`;
  }).join('');
  if (index !== publicationDetails.length) throw new Error(`Expected ${publicationDetails.length} papers, found ${index}`);
  return html;
}

function render(t, key) {
  const isEn = key === 'en';
  const r = research[key];
  const v = visitors[key];
  const url = new URL(isEn ? '' : 'index.zh.html', links.home).href;
  const publications = fs.readFileSync(path.join(root, `content/publications.${key}.html`), 'utf8');
  const publicationDirectory = renderPublicationDirectory(publications, key);
  const emailText = Object.values(emails).map(address => `<span>${e(address)}</span>`).join('');
  const introPublications = e(t.introPublications).replace(/Nature Communications|IEEE TMI|IEEE TRPMS|EJNMMI/g, '<strong>$&</strong>');
  const timeline = t.timeline.map(item => `<li class="timeline-${e(item.category)}"><div class="timeline-meta"><span class="timeline-year">${e(item.year)}</span><span class="timeline-category">${e(t.timelineCategories[item.category])}</span></div><p>${e(item.text)}</p></li>`).join('');

  return `<!doctype html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="format-detection" content="email=no">
  <title>${e(t.title)}</title><meta name="description" content="${e(t.description)}"><meta name="author" content="Yixin Chen">
  <meta property="og:type" content="website"><meta property="og:title" content="${e(t.title)}"><meta property="og:description" content="${e(t.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${new URL(shared.portraitImage, links.home).href}"><meta name="twitter:card" content="summary">
  <meta name="theme-color" content="#ffffff"><link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en" href="${links.home}"><link rel="alternate" hreflang="zh-CN" href="${new URL('index.zh.html', links.home).href}"><link rel="alternate" hreflang="x-default" href="${links.home}">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/css/style.css?v=${styleVersion}"><script src="assets/js/main.js?v=${scriptVersion}" defer></script><script src="assets/js/visitors.js?v=${visitorScriptVersion}" defer></script>
</head>
<body id="top">
<a class="skip-link" href="#main">${e(t.skip)}</a>
<header class="site-header"><div class="header-inner"><a class="site-name" href="#top">Yixin Chen</a><nav aria-label="${isEn ? 'Main navigation' : '主导航'}"><a href="#research">${t.nav[1]}</a><a href="#publications">${t.nav[2]}</a><button type="button" popovertarget="journey" aria-controls="journey" aria-expanded="false">${t.nav[0]}</button><a href="#contact">${t.nav[3]}</a></nav><div class="language" role="group" aria-label="Language / 语言"><a href="index.html" lang="en" hreflang="en" ${isEn ? 'aria-current="page"' : ''}>English</a><a href="index.zh.html" lang="zh-CN" hreflang="zh-CN" ${!isEn ? 'aria-current="page"' : ''}>中文</a></div></div></header>
<main id="main" class="page">
<section class="hero" aria-labelledby="name"><div class="identity"><div class="name-line"><h1 id="name">${e(t.name)}</h1><span class="other-name">${e(t.otherName)}</span></div><p class="affiliation">${e(t.affiliation)}</p></div><figure class="portrait"><a href="${shared.portraitImage}" data-photo data-caption="${e(t.portraitCaption)}"><img src="${shared.portraitImage}" alt="${e(t.portraitAlt)}" width="1254" height="1254" fetchpriority="high"></a></figure><p class="intro" id="research-funding"><strong>${e(t.introFunding)}</strong> ${e(t.intro)} ${introPublications}</p><div class="hero-contact"><div class="hero-links">${link(links.scholar, t.scholar)}${link(links.github, 'GitHub')}<a class="text-link" href="${e(links.cvEn)}" download>${e(t.cvEn)}</a><a class="text-link" href="${e(links.cvZh)}" download>${e(t.cvZh)}</a></div></div></section>
<section id="research" class="selected-research" aria-labelledby="research-title"><div class="section-heading"><h2 id="research-title">${e(r.heading)}</h2></div>${r.works.map(w => researchWork(w, r)).join('')}</section>
<section id="publications" class="publications" aria-labelledby="pub-title"><div class="section-heading"><h2 id="pub-title">${e(t.publications)}</h2>${link(links.scholar, t.allPapers)}</div><div class="publication-directory">${publicationDirectory}<p class="publication-role-note">${e(equalContributionNotes[key])}</p></div></section>
<section id="challenges" class="challenges" aria-labelledby="challenges-title"><div class="section-heading"><h2 id="challenges-title">${e(t.challengesTitle)}</h2></div>${renderChallenges(t)}</section>
<section id="news" class="news" aria-labelledby="news-title"><div class="section-heading"><h2 id="news-title">${e(t.newsTitle)}</h2></div>${renderNews(t)}</section>
<section class="service" aria-labelledby="service-title"><h2 id="service-title">${e(t.service)}</h2><dl><div><dt>${e(patentText[key].heading)}</dt><dd>${e(patentSummary(key))}</dd></div><div><dt>${e(t.reviewTitle)}</dt><dd>${e(t.reviewDetail)}</dd></div><div><dt>${e(t.teachingTitle)}</dt><dd>${e(t.teachingDetail)} <a class="text-link" href="${e(links.course)}">${e(t.teachingLink)}</a></dd></div><div><dt>${e(t.writingTitle)}</dt><dd>${e(t.writingDetail)}</dd></div></dl></section>
<section id="contact" class="contact" aria-labelledby="contact-title"><h2 id="contact-title">${e(t.contactTitle)}</h2><div class="email-list">${emailText}</div><div class="contact-links"><a class="text-link" href="${e(imageUrl(shared.wechatImage))}" data-photo data-caption="${e(t.wechatCaption)}" data-alt="${e(t.wechatAlt)}" aria-haspopup="dialog">${e(t.wechatLabel)}</a>${link(links.scholar, 'Google Scholar')}${link(links.github, 'GitHub')}${link(links.orcid, 'ORCID')}</div></section>
<section id="visitors" class="visitors" aria-labelledby="visitors-title" data-endpoint="${e(visitors.endpoint)}" data-unavailable="${e(v.unavailable)}" data-empty="${e(v.empty)}" data-hint="${e(v.hint)}"><div class="visitor-heading"><h2 id="visitors-title">${e(v.title)}</h2><p class="visitor-period">${e(v.since)}</p></div><p class="visitor-status" role="status">${e(v.loading)}</p><div class="visitor-map" data-src="${e(imageUrl('assets/img/world.svg'))}"></div><div class="visitor-map-caption"><p class="visitor-readout" aria-live="polite"></p><div class="visitor-legend" hidden><span>${e(v.low)}</span><span class="visitor-scale" aria-hidden="true"></span><span>${e(v.high)}</span></div></div><p class="visitor-note">${e(v.privacy)}</p><p class="visitor-credit">${e(v.credit)}: <a href="https://github.com/VictorCazanave/svg-maps/tree/master/packages/world">MapSVG / SVG Maps</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p></section>
<footer><span>${e(t.footer)}</span><span>${e(t.updated)}</span><a href="#top">${isEn ? 'Back to top' : '返回顶部'}</a></footer>
</main>
<button class="timeline-trigger" type="button" popovertarget="journey" aria-controls="journey" aria-expanded="false">${e(t.journey)}</button>
<aside id="journey" class="timeline-panel" popover="auto" role="dialog" aria-labelledby="journey-title"><div class="timeline-heading"><h2 id="journey-title">${e(t.journey)}</h2><button class="timeline-close" type="button" popovertarget="journey" popovertargetaction="hide" aria-label="${e(t.closeJourney)}" autofocus>×</button></div><ol class="timeline-list" tabindex="0" aria-label="${e(t.journey)}">${timeline}</ol></aside>
<dialog class="photo-viewer" aria-label="${isEn ? 'Image viewer' : '图片预览'}"><button class="close-photo" aria-label="${isEn ? 'Close image' : '关闭图片'}">×</button><figure><img alt=""><figcaption></figcaption></figure><a class="original-image text-link" target="_blank" rel="noopener">${isEn ? 'Open original image' : '打开原始图片'}</a></dialog>
</body></html>`;
}

const cvTalksHeading = 'Oral presentations';

const cvLabels = {
  en: {
    title: 'Yixin Chen | Curriculum Vitae',
    description: 'Curriculum vitae of Yixin Chen, PhD candidate at Peking University.',
    research: 'Research profile', education: 'Education', selected: 'Selected research', funding: 'Research funding',
    experience: 'Professional experience', publications: 'Publications',
    awards: 'MICCAI challenge awards', teaching: 'Teaching', book: 'Book', patents: 'Patents', service: 'Academic service',
    firstAuthor: 'First author', coFirstAuthor: 'Co-first author',
    email: 'Email', website: 'Academic website', code: 'Research code', papers: 'Publications', scholar: 'Google Scholar',
    pku: 'Peking University', supervisor: 'Supervisor',
    xmu: 'Xiamen University', xmuDegree: "BSc in Automation; second bachelor's degree in Mathematical Finance",
  },
  zh: {
    title: '陈亦新 | 个人简历',
    description: '陈亦新，北京大学医学技术博士研究生。',
    research: '研究方向', education: '教育经历', selected: '代表性研究成果', funding: '主持科研项目',
    experience: '工作经历', publications: '论文',
    awards: 'MICCAI 挑战赛奖项', teaching: '教学经历', book: '著作', patents: '专利', service: '学术服务',
    firstAuthor: '第一作者', coFirstAuthor: '共同第一作者',
    email: '邮箱', website: '个人主页', code: '研究代码', papers: '学术论文', scholar: '谷歌学术',
    pku: '北京大学', supervisor: '导师',
    xmu: '厦门大学', xmuDegree: '自动化本科，数理金融第二学位',
  },
};

function publicationLinks(article) {
  return {
    paper: article.match(/<div class="links">[\s\S]*?<a href="([^"]+)"/)?.[1],
    code: article.match(/<a href="([^"]+)">(?:Code|代码)<\/a>/)?.[1],
  };
}

function publicationRecord(source, workId) {
  const detail = publicationDetails.find(item => item.id === workId);
  const articles = [...source.matchAll(/<article class="pub"[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
  const article = articles.find(item => {
    const title = item.match(/<h4 class="ptitle">([\s\S]*?)<\/h4>/)?.[1] || '';
    return title.replace(/<[^>]*>/g, '').startsWith(detail.match);
  });
  if (!article) throw new Error(`Missing CV publication for representative work: ${workId}`);
  const title = article.match(/<h4 class="ptitle">([\s\S]*?)<\/h4>/)?.[1];
  const authors = article.match(/<p class="authors">([\s\S]*?)<\/p>/)?.[1];
  const venue = article.match(/<p class="venue">([\s\S]*?)<\/p>/)?.[1];
  if (!title || !authors || !venue) throw new Error(`Incomplete representative publication: ${workId}`);
  return { title, authors, venue, ...publicationLinks(article) };
}

function publicationContribution(authors, labels) {
  const me = '<span class="me">Yixin Chen</span>';
  const myPosition = authors.indexOf(me);
  if (myPosition === -1) return '';
  const afterMe = authors.slice(myPosition + me.length);
  if (afterMe.startsWith('<span class="author-role">*</span>')) return labels.coFirstAuthor;
  return authors.trimStart().startsWith(me) ? labels.firstAuthor : '';
}

function inlineVenue(venue) {
  return venue.replace(/<span class="publication-status">/g, '; <span class="publication-status">');
}

function citationSentence(html) {
  return html.trim() + (/[.!?]$/.test(html.replace(/<[^>]*>/g, '').trim()) ? ' ' : '. ');
}

function cvPublicationVenue(venue, title) {
  const plainTitle = title.replace(/<[^>]*>/g, '');
  const citation = publicationDetails.find(detail => plainTitle.startsWith(detail.match))?.citation;
  if (!citation) return inlineVenue(venue);
  const location = citation.pages || citation.articleNumber;
  const volume = citation.volume
    ? `${citation.series ? `${citation.series} ` : ''}${citation.volume}${citation.issue ? `(${citation.issue})` : ''}`
    : '';
  const details = volume
    ? `${volume}${location ? `:${location}` : ''}`
    : `${citation.pages.includes('-') ? 'pp.' : 'p.'} ${citation.pages}`;
  const statusPosition = venue.indexOf('<span class="publication-status">');
  const position = statusPosition === -1 ? venue.length : statusPosition;
  const withDetails = venue.slice(0, position).replace(/\d{4}$/, year => `<span class="cv-citation-location">${year}, ${cvE(details)}</span>`);
  return inlineVenue(`${withDetails}${venue.slice(position)}`);
}

function renderCvPublications(source) {
  let number = 0;
  return source.replace(/<article class="pub"[^>]*>[\s\S]*?<\/article>/g, article => {
    const id = article.match(/<article class="pub" id="([^"]+)"/)?.[1];
    const title = article.match(/<h4 class="ptitle">([\s\S]*?)<\/h4>/)[1];
    const authors = article.match(/<p class="authors">([\s\S]*?)<\/p>/)[1];
    const venue = article.match(/<p class="venue">([\s\S]*?)<\/p>/)[1];
    const { paper: href, code } = publicationLinks(article);
    const linkedTitle = href ? `<a href="${href}">${title}</a>` : title;
    return `<article class="pub"${id ? ` id="${id}"` : ''}><span class="cv-pub-number">${++number}.</span><p class="cv-citation"><span class="authors">${citationSentence(authors)}</span><span class="ptitle">${citationSentence(linkedTitle)}</span><span class="venue">${citationSentence(cvPublicationVenue(venue, title)).trimEnd()}</span>${code ? `&nbsp;<a class="cv-code" href="${code}">[Code]</a>` : ''}</p></article>`;
  });
}

function renderCv(t, key) {
  const labels = cvLabels[key];
  const source = fs.readFileSync(path.join(root, `content/publications.${key}.html`), 'utf8');
  const publications = renderCvPublications(source);
  const selectedWorks = research[key].works.map(work => ({
    work,
    publication: publicationRecord(source, work.id),
  }));
  const lucida = publicationDetails.find(item => item.id === 'lucida');
  selectedWorks.splice(2, 0, {
    work: { name: lucida.name, summary: lucida[key].replace(`${lucida.name} `, key === 'en' ? 'It ' : '') },
    publication: publicationRecord(source, lucida.id),
  });
  const challengeItems = [
    { title: t.awardTitle },
    ...t.awards.map(item => ({ title: item.title })),
    t.chimeraAward,
  ];
  const cv = `<!doctype html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${cvE(labels.title)}</title>
  <meta name="description" content="${cvE(labels.description)}">
  <link rel="stylesheet" href="assets/css/cv.css">
  <style>@page { @bottom-right { content: "${cvCssString(t.updated)}"; } }</style>
</head>
<body class="cv-${key}">
<header class="cv-header">
  <div class="cv-identity"><h1>${cvE(t.name)}<span class="cv-other-name">${cvE(t.otherName)}</span></h1><p class="cv-role">${cvE(t.affiliation)}</p></div>
  <img class="cv-portrait" src="${cvE(shared.portraitImage)}" alt="${cvE(t.portraitAlt)}" width="1254" height="1254">
  <address><dl class="cv-contacts">
    <div class="cv-contact-item"><dt>${cvE(labels.email)}${key === 'en' ? ':' : '：'}</dt><dd><a href="${links.email}">${cvE(emails.gmail)}</a></dd></div>
    <div class="cv-contact-item"><dt>${cvE(labels.website)}${key === 'en' ? ':' : '：'}</dt><dd><a href="${e(links.home)}">${cvE(new URL(links.home).host)}</a></dd></div>
    <div class="cv-contact-item cv-contact-secondary"><dt>${cvE(labels.code)}${key === 'en' ? ':' : '：'}</dt><dd><a href="${links.github}">GitHub / ${cvE(new URL(links.github).pathname.slice(1))}</a></dd></div>
    <div class="cv-contact-item cv-contact-secondary"><dt>${cvE(labels.papers)}${key === 'en' ? ':' : '：'}</dt><dd><a href="${links.scholar}">${cvE(labels.scholar)}</a></dd></div>
  </dl></address>
</header>
<main>
  <section class="cv-profile"><h2>${cvE(labels.research)}</h2><p>${cvE(t.intro)}</p></section>
  <section class="cv-education"><h2>${cvE(labels.education)}</h2>
    <article class="cv-entry"><div><h3>${cvE(labels.pku)}</h3><p>${cvE(t.phdDegree)}${key === 'en' ? `, expected ${cvE(shared.expectedGraduationYear)}` : `，预计 ${cvE(shared.expectedGraduationYear)} 年毕业`}</p><p>${cvE(t.phdInstitute)}${key === 'en' ? '; ' : '，'}${cvE(labels.supervisor)}${key === 'en' ? ': ' : '：'}${cvE(t.phdSupervisor)}</p></div><p class="cv-date">${cvE(t.phdDate)}</p></article>
    <article class="cv-entry"><div><h3>${cvE(t.londonTitle)}</h3><p>${cvE(t.londonDegree)}</p></div><p class="cv-date">${cvE(t.londonDate)}</p></article>
    <article class="cv-entry"><div><h3>${cvE(labels.xmu)}</h3><p>${cvE(labels.xmuDegree)}</p></div><p class="cv-date">2015–2019${key === 'zh' ? ' 年' : ''}</p></article>
  </section>
  <section class="cv-funding"><h2>${cvE(labels.funding)}</h2>
    <article class="cv-entry"><div><h3>${cvE(t.fundingTitle)}</h3><p>${cvE(t.fundingBody)}</p></div><p class="cv-date">${cvE(t.fundingDate)}</p></article>
  </section>
  <section class="cv-selected"><h2>${cvE(labels.selected)}</h2>
    ${selectedWorks.map(({ work, publication }) => `<article class="cv-highlight"><p><strong>${cvE(work.name)}${key === 'en' ? '.' : '：'}</strong>${key === 'en' ? ' ' : ''}${cvE(work.summary)}</p><p class="cv-highlight-meta">${inlineVenue(publication.venue)}${key === 'en' ? '; ' : '；'}${cvE(publicationContribution(publication.authors, labels))}${publication.paper ? ` &nbsp;<a href="${cvE(publication.paper)}">[${cvE(t.paperLink)}]</a>` : ''}${publication.code ? ` &nbsp;<a href="${cvE(publication.code)}">[${cvE(t.codeLink)}]</a>` : ''}</p></article>`).join('')}
  </section>
  <section class="cv-talks"><h2>${cvE(cvTalksHeading)}</h2>
    ${shared.presentations.talks.map(talk => `<article class="cv-entry"><div><h3>${talk.publicationId ? publicationRecord(source, talk.publicationId).title : cvE(talk.title)}</h3><p>${cvE(talk.event)}${key === 'en' ? ', ' : '，'}${cvE(shared.presentations.location[key])}</p></div><p class="cv-date">${cvE(talk.date)}</p></article>`).join('')}
  </section>
  <section class="cv-publications"><h2>${cvE(labels.publications)}</h2><p class="cv-publication-note">${cvE(equalContributionNotes[key])}</p>${publications}</section>
  <section><h2>${cvE(labels.experience)}</h2>
    ${t.jobs.map(item => `<article class="cv-entry"><div><h3>${cvE(item.name)}</h3><p class="cv-subtitle">${cvE(item.role)}</p>${item.paragraphs.map(p => `<p>${cvE(p)}</p>`).join('')}</div><p class="cv-date">${cvE(item.date)}</p></article>`).join('')}
  </section>
  <section class="cv-teaching"><h2>${cvE(labels.teaching)}</h2>
    <article class="cv-entry"><div><h3>${cvE(t.teachingTitle)}</h3><p>${cvE(t.teachingDetail)} <a href="${e(links.course)}">${cvE(t.teachingLink)}</a></p></div></article>
  </section>
  <section><h2>${cvE(labels.book)}</h2>
    <article class="cv-entry"><div><h3>${cvE(t.bookName)}</h3>${t.bookOriginalTitle ? `<p>${cvE(t.bookOriginalTitle)}</p>` : ''}<p>${cvE(t.bookDetail)}</p></div><p class="cv-date">${cvE(shared.book.year)}</p></article>
  </section>
  <section class="cv-patents"><h2>${cvE(labels.patents)}</h2><p class="patent-summary">${cvE(patentSummary(key))}</p>${renderPatentGroups(key)}</section>
  <section class="cv-awards"><h2>${cvE(labels.awards)}</h2>
    ${challengeItems.map(item => `<article class="cv-entry"><div><h3>${cvE(item.title)}</h3>${item.detail ? `<p>${cvE(item.detail)}</p>` : ''}</div><p class="cv-date">2026</p></article>`).join('')}
  </section>
  <section class="cv-service"><h2>${cvE(labels.service)}</h2>
    <p><strong>${cvE(t.reviewTitle)}</strong>${key === 'en' ? ', ' : '：'}${cvE(t.reviewDetail)}</p>
  </section>
  <section class="cv-news"><h2>${cvE(t.newsTitle)}</h2><p class="cv-news-source">${cvE(t.newsSource)}</p>
    ${t.news.map(item => `<article class="cv-entry"><div><h3><a href="${cvE(item.href)}">${cvE(item.title)}</a></h3></div><p class="cv-date">${cvE(item.date)}</p></article>`).join('')}
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
