(() => {
  const section = document.getElementById('visitors');
  if (!section) return;
  const endpoint = section.dataset.endpoint;
  const status = section.querySelector('.visitor-status');
  const host = section.querySelector('.visitor-map');
  const readout = section.querySelector('.visitor-readout');
  const isZh = document.documentElement.lang.startsWith('zh');
  const names = new Intl.DisplayNames([isZh ? 'zh-CN' : 'en'], { type: 'region' });
  const number = new Intl.NumberFormat(isZh ? 'zh-CN' : 'en');
  const palette = ['#c6dce8', '#91bdd2', '#5f9eba', '#357a9e', '#174e70'];
  let totals;
  let svg;

  function describe(code, fallback) {
    let name = fallback;
    try { name = names.of(code); } catch { /* Keep the map's geographic name. */ }
    const count = totals?.countries[code] || 0;
    return isZh ? `${name}：${number.format(count)} 次访问` : `${name}: ${number.format(count)} ${count === 1 ? 'visit' : 'visits'}`;
  }

  function paint() {
    if (!svg || !totals) return;
    const max = Math.max(1, ...Object.values(totals.countries));
    for (const path of svg.querySelectorAll('path[data-country]')) {
      const count = totals.countries[path.dataset.country] || 0;
      path.style.fill = count ? palette[Math.min(4, Math.floor(4 * Math.log1p(count) / Math.log1p(max)))] : '#e5ebef';
      path.setAttribute('aria-label', describe(path.dataset.country, path.dataset.name));
      path.setAttribute('tabindex', count ? '0' : '-1');
    }
    section.querySelector('.visitor-legend').hidden = !totals.total;
  }

  async function loadMap() {
    try {
      const response = await fetch(host.dataset.src);
      if (!response.ok) throw new Error('Map unavailable');
      const parsed = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
      const source = parsed.documentElement;
      if (source.localName !== 'svg') throw new Error('Invalid map');
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', source.getAttribute('viewBox'));
      svg.setAttribute('aria-label', section.querySelector('h2').textContent);
      svg.setAttribute('role', 'group');
      for (const original of source.querySelectorAll('path[id]')) {
        const path = document.createElementNS(svg.namespaceURI, 'path');
        path.setAttribute('d', original.getAttribute('d'));
        path.dataset.country = original.id.toUpperCase();
        path.dataset.name = original.getAttribute('aria-label');
        path.setAttribute('aria-label', path.dataset.name);
        const select = () => {
          if (!totals) return;
          svg.querySelector('.selected')?.classList.remove('selected');
          path.classList.add('selected');
          readout.textContent = describe(path.dataset.country, path.dataset.name);
        };
        path.addEventListener('pointerenter', select);
        path.addEventListener('click', select);
        path.addEventListener('focus', select);
        svg.append(path);
      }
      host.replaceChildren(svg);
      paint();
    } catch {
      host.hidden = true;
    }
  }

  async function loadTotals() {
    if (!endpoint) {
      status.textContent = section.dataset.unavailable;
      return;
    }
    try {
      const isPublic = location.hostname === 'yixinchen-ai.github.io';
      const collect = isPublic && navigator.doNotTrack !== '1' && !navigator.globalPrivacyControl;
      const response = await fetch(`${endpoint}/${collect ? 'visit' : 'stats'}`, {
        method: collect ? 'POST' : 'GET',
        credentials: 'omit', referrerPolicy: 'no-referrer',
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error('Statistics unavailable');
      const data = await response.json();
      if (!data.countries || typeof data.countries !== 'object' || !Number.isSafeInteger(data.total) || data.total < 0) throw new Error('Invalid totals');
      for (const [code, count] of Object.entries(data.countries)) {
        if (!/^[A-Z]{2}$/.test(code) || !Number.isSafeInteger(count) || count < 0) throw new Error('Invalid country count');
      }
      totals = data;
      status.textContent = data.total
        ? (isZh ? `${number.format(data.total)} 次访问，来自 ${Object.keys(data.countries).length} 个国家或地区` : `${number.format(data.total)} ${data.total === 1 ? 'visit' : 'visits'} from ${Object.keys(data.countries).length} ${Object.keys(data.countries).length === 1 ? 'country or region' : 'countries and regions'}`)
        : section.dataset.empty;
      readout.textContent = data.total ? section.dataset.hint : '';
      paint();
    } catch {
      status.textContent = section.dataset.unavailable;
      readout.textContent = '';
    }
  }

  loadTotals();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); loadMap(); }
    }, { rootMargin: '300px' });
    observer.observe(section);
  } else loadMap();
})();
