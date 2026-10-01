(() => {
  const sectionLinks = [...document.querySelectorAll('.site-header nav a')];
  const sections = [...document.querySelectorAll('main > section[id]')];

  function highlight(items, anchors, offset) {
    let current;
    for (const item of items) {
      if (item.getBoundingClientRect().top <= offset) current = item;
    }
    for (const anchor of anchors) {
      if (current && anchor.hash === `#${current.id}`) anchor.setAttribute('aria-current', 'location');
      else anchor.removeAttribute('aria-current');
    }
  }

  let queued = false;
  function update() {
    highlight(sections, sectionLinks, 180);
    queued = false;
  }
  addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();

  const timeline = document.getElementById('journey');
  const timelineTriggers = document.querySelectorAll('[popovertarget="journey"][aria-expanded]');
  if (typeof timeline?.showPopover === 'function') {
    timeline.addEventListener('toggle', event => {
      const open = event.newState === 'open';
      for (const trigger of timelineTriggers) trigger.setAttribute('aria-expanded', String(open));
      if (!open && location.hash === '#journey') history.replaceState(null, '', location.pathname + location.search);
    });
    function openLinkedTimeline() {
      if (location.hash === '#journey' && !timeline.matches(':popover-open')) timeline.showPopover();
    }
    addEventListener('hashchange', openLinkedTimeline);
    openLinkedTimeline();
  }

  const dialog = document.querySelector('.photo-viewer');
  if (typeof dialog?.showModal === 'function') {
    const image = dialog.querySelector('img');
    const caption = dialog.querySelector('figcaption');
    const original = dialog.querySelector('.original-image');
    let trigger;
    for (const anchor of document.querySelectorAll('[data-photo]')) {
      anchor.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        trigger = anchor;
        image.src = anchor.href;
        image.classList.toggle('on-dark', anchor.dataset.display === 'dark');
        image.alt = anchor.dataset.alt || anchor.querySelector('img')?.alt || anchor.dataset.caption;
        caption.textContent = anchor.dataset.caption;
        original.href = anchor.href;
        dialog.showModal();
      });
    }
    dialog.querySelector('.close-photo').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      image.removeAttribute('src');
      original.removeAttribute('href');
      trigger?.focus({ preventScroll: true });
    });
  }

  for (const link of document.querySelectorAll('.language a')) {
    link.addEventListener('click', () => { if (location.hash) link.hash = location.hash; });
  }

  function openLinkedPublication() {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target?.matches('details.publication-entry')) target.open = true;
  }
  addEventListener('hashchange', openLinkedPublication);
  openLinkedPublication();
})();
