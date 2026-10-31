import { PageFlip } from 'page-flip/dist/js/page-flip.module.js';
import { gsap, ScrollTrigger, finePointer, reduced } from './gsap.js';
import { categories } from '../data/menu.js';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const SPICE = ['No heat', 'Mild', 'Medium', 'Hot'];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const dietLabel = (d) => (d === 'veg' ? 'Vegetarian' : 'Non-vegetarian');

/* ---------------------------------------------------------------
   Page templates. StPageFlip moves page nodes around itself, so the
   book is built as plain HTML and handed over outside React's tree.
   Every page is one .pg; the engine pairs them into spreads
   (cover alone, then left/right, back cover alone).
   --------------------------------------------------------------- */
const folio = (n) => `<span class="pg__folio">${n}</span>`;
const head = (a, b) => `<header class="paper__head"><span>${esc(a)}</span><span>${esc(b)}</span></header>`;
const frame = '<span class="pg__frame" aria-hidden="true"></span>';

const coverPage = () => `
  <div class="pg pg--hard" data-density="hard">
    <div class="pg__inner cover">
      <span class="cover__frame" aria-hidden="true"></span>
      <span class="cover__corner cover__corner--tl"></span><span class="cover__corner cover__corner--tr"></span>
      <span class="cover__corner cover__corner--bl"></span><span class="cover__corner cover__corner--br"></span>
      <div class="cover__content">
        <svg class="cover__mark" aria-hidden="true"><use href="#i-mark" /></svg>
        <p class="cover__brand foil">Moti Restro</p>
        <span class="cover__rule" aria-hidden="true"><i></i></span>
        <h2 class="cover__title foil">The Menu</h2>
        <p class="cover__sub">Jaypee Greens · Greater Noida</p>
      </div>
      <p class="cover__hint">Drag the corner to open</p>
    </div>
  </div>`;

const insideCoverPage = () => `
  <div class="pg pg--hard" data-density="hard">
    <div class="pg__inner endpaper">
      <div class="endpaper__card">
        <svg class="endpaper__star" aria-hidden="true"><use href="#i-star" /></svg>
        <p class="endpaper__kicker">Welcome to</p>
        <p class="endpaper__title">Moti Restro</p>
        <p class="endpaper__text">Charcoal, patience and spice — recipes kept the slow way. Turn the pages, take your time, and call for us whenever you are ready.</p>
        <p class="endpaper__meta">Open daily · 11 AM – 11 PM</p>
      </div>
    </div>
  </div>`;

const contentsPage = (chapters, n) => `
  <div class="pg pg--soft" data-density="soft">
    <div class="pg__inner paper">${frame}
      ${head('Moti Restro', 'Contents')}
      <div class="toc-wrap">
        <h3 class="paper__title">Contents</h3>
        <ol class="toc">
          ${chapters.map((c) => `<li><button type="button" class="toc__btn" data-goto="${c.start}"><span class="toc__num">${c.roman}</span><span class="toc__name">${esc(c.title)}</span><span class="toc__lead"></span><span class="toc__page">${c.start}</span></button></li>`).join('')}
        </ol>
        <p class="paper__note">Drag a page corner, use the arrows below the book, or your ← → keys.</p>
      </div>
      ${folio(n)}
    </div>
  </div>`;

const openerPage = (c, roman) => `
  <div class="pg pg--soft" data-density="soft">
    <div class="pg__inner opener">
      <img data-src="${c.cover}" alt="" />
      <span class="opener__shade" aria-hidden="true"></span>
      <span class="opener__frame" aria-hidden="true"></span>
      <div class="opener__text">
        <p class="opener__num">Chapter ${roman}</p>
        <h3 class="opener__title">${esc(c.title)}</h3>
      </div>
    </div>
  </div>`;

const introPage = (c, roman, n, dishStarts) => `
  <div class="pg pg--soft" data-density="soft">
    <div class="pg__inner paper">${frame}
      ${head(`Chapter ${roman}`, c.title)}
      <div class="intro">
        <svg class="intro__star" aria-hidden="true"><use href="#i-star" /></svg>
        <h3 class="paper__title">${esc(c.title)}</h3>
        <p class="intro__blurb">${esc(c.blurb)}</p>
        <ul class="intro__list">
          ${c.items.map((it, i) => `<li><button type="button" class="intro__btn" data-goto="${dishStarts[i]}"><i class="diet diet--${it.diet}"></i><span class="intro__name">${esc(it.name)}</span><span class="intro__lead"></span><span class="intro__price">${esc(it.price)}</span></button></li>`).join('')}
        </ul>
      </div>
      ${folio(n)}
    </div>
  </div>`;

const imagePage = (it, c, no, n) => `
  <div class="pg pg--soft" data-density="soft">
    <div class="pg__inner paper paper--image">${frame}
      ${head(`No. ${String(no).padStart(2, '0')}`, c.title)}
      <div class="dish3d" data-tilt>
        <span class="dish3d__shadow" aria-hidden="true"></span>
        <div class="dish3d__card">
          <div class="dish3d__img"><img data-src="${it.image}" alt="${esc(it.name)}" /></div>
          <span class="dish3d__glare" aria-hidden="true"></span>
          <span class="dish3d__frame" aria-hidden="true"></span>
          ${it.tag ? `<span class="dish3d__badge">${esc(it.tag)}</span>` : ''}
        </div>
      </div>
      <p class="dish3d__hint">${finePointer ? 'Hover to view in 3D' : esc(it.name)}</p>
      ${folio(n)}
    </div>
  </div>`;

const detailPage = (it, c, no, n) => `
  <div class="pg pg--soft" data-density="soft">
    <div class="pg__inner paper">${frame}
      ${head(c.title, `No. ${String(no).padStart(2, '0')}`)}
      <div class="detail">
        <div class="detail__meta"><i class="diet diet--${it.diet}" aria-hidden="true"></i><span>${dietLabel(it.diet)}</span>${it.tag ? `<span class="detail__tag">${esc(it.tag)}</span>` : ''}</div>
        <h3 class="detail__name">${esc(it.name)}</h3>
        <p class="detail__price">${esc(it.price)}</p>
        <span class="detail__orn" aria-hidden="true"><i></i></span>
        <p class="detail__desc">${esc(it.desc)}</p>
        <p class="detail__label">Composition</p>
        <ul class="detail__comp">${(it.ingredients || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <div class="detail__row">
          <div>
            <p class="detail__label">Spice</p>
            <span class="spice" role="img" aria-label="${SPICE[it.spice || 0]}">${[1, 2, 3].map((i) => `<i class="${i <= (it.spice || 0) ? 'on' : ''}"></i>`).join('')}<em>${SPICE[it.spice || 0]}</em></span>
          </div>
          ${it.pairs ? `<div><p class="detail__label">Pairs well with</p><p class="detail__pair">${esc(it.pairs)}</p></div>` : ''}
        </div>
      </div>
      ${folio(n)}
    </div>
  </div>`;

const notesPage = (n) => `
  <div class="pg pg--soft" data-density="soft">
    <div class="pg__inner paper">${frame}
      ${head('Moti Restro', 'Notes')}
      <div class="notes">
        <h3 class="paper__title">A few notes</h3>
        <ul class="notes__legend">
          <li><i class="diet diet--veg"></i>Vegetarian</li>
          <li><i class="diet diet--nonveg"></i>Non-vegetarian</li>
          <li><span class="spice"><i class="on"></i><i class="on"></i><i></i></span>Spice level</li>
        </ul>
        <p>Please let our team know about allergies or dietary needs — most dishes can be adjusted for heat.</p>
        <p>Menu and prices are subject to change. Ask about today’s specials from the tandoor.</p>
      </div>
      ${folio(n)}
    </div>
  </div>`;

const insideBackPage = () => `
  <div class="pg pg--hard" data-density="hard">
    <div class="pg__inner endpaper">
      <div class="endpaper__card">
        <svg class="endpaper__star" aria-hidden="true"><use href="#i-star" /></svg>
        <p class="endpaper__kicker">Thank you for</p>
        <p class="endpaper__title">dining with us</p>
        <p class="endpaper__text">Reserve your next evening at Moti Restro, or call us for takeaway and delivery.</p>
        <div class="endpaper__links">
          <a class="endpaper__btn" href="/visit#reserve">Reserve a table</a>
          <a class="endpaper__btn endpaper__btn--ghost" href="tel:+918796277703">Call 087962 77703</a>
        </div>
      </div>
    </div>
  </div>`;

const backCoverPage = () => `
  <div class="pg pg--hard" data-density="hard">
    <div class="pg__inner cover cover--back">
      <span class="cover__frame" aria-hidden="true"></span>
      <div class="cover__content">
        <svg class="cover__mark cover__mark--sm" aria-hidden="true"><use href="#i-mark" /></svg>
        <p class="cover__brand foil">Moti Restro</p>
        <p class="cover__sub">Sun Twilight, Sector 27<br />Jaypee Greens, Greater Noida<br />087962 77703</p>
      </div>
    </div>
  </div>`;

/** Builds the book markup and a per-page index used by the controls. */
export function buildBook() {
  // Pre-compute where every chapter and dish lands so the contents can link forward.
  let idx = 3;
  const chapters = categories.map((c, ci) => {
    const start = idx;
    const dishStarts = c.items.map((_, i) => start + 2 + i * 2);
    idx += 2 + c.items.length * 2;
    return { ...c, roman: ROMAN[ci], start, dishStarts };
  });

  const html = [];
  const meta = [];
  const add = (markup, m) => { html.push(markup); meta.push(m); };

  add(coverPage(), { label: 'The Menu', chapter: 'Cover' });
  add(insideCoverPage(), { label: 'Welcome', chapter: 'Moti Restro' });
  add(contentsPage(chapters, 2), { label: 'Contents', chapter: 'Moti Restro' });
  let no = 0;
  chapters.forEach((c) => {
    const chapter = `Chapter ${c.roman}`;
    add(openerPage(c, c.roman), { label: c.title, chapter, cat: c.id });
    add(introPage(c, c.roman, html.length, c.dishStarts), { label: c.title, chapter, cat: c.id });
    c.items.forEach((it) => {
      no += 1;
      add(imagePage(it, c, no, html.length), { label: it.name, chapter: c.title, cat: c.id });
      add(detailPage(it, c, no, html.length), { label: it.name, chapter: c.title, cat: c.id });
    });
  });
  add(notesPage(html.length), { label: 'Notes', chapter: 'Moti Restro' });
  add(insideBackPage(), { label: 'Thank you', chapter: 'Moti Restro' });
  add(backCoverPage(), { label: 'Moti Restro', chapter: 'Back cover' });

  return { html: html.join(''), meta, chapters };
}

/* ---------------------------------------------------------------
   Behaviour
   --------------------------------------------------------------- */
export function createBook(section, meta, chapters, { onChapter } = {}) {
  const el = section.querySelector('[data-book]');
  const host = section.querySelector('[data-book-host]');
  const shift = section.querySelector('[data-book-shift]');
  const prev = section.querySelector('[data-book-prev]');
  const next = section.querySelector('[data-book-next]');
  const labelEl = section.querySelector('[data-book-label]');
  const chapterEl = section.querySelector('[data-book-chapter]');
  const countEl = section.querySelector('[data-book-count]');
  const progress = section.querySelector('[data-book-progress]');
  const pages = [...el.querySelectorAll('.pg')];
  const total = pages.length;
  const ctx = gsap.context(() => {}, section);

  const flip = new PageFlip(el, {
    width: 520,
    height: 700,
    size: 'stretch',
    minWidth: 280,
    maxWidth: 620,
    minHeight: 360,
    maxHeight: 1200,
    showCover: true,
    usePortrait: true,
    autoSize: true,
    drawShadow: true,
    maxShadowOpacity: 0.5,
    flippingTime: reduced ? 450 : 1100,
    startZIndex: 2,
    mobileScrollSupport: true,
    swipeDistance: 30,
    showPageCorners: true,
    disableFlipByClick: false,
  });

  // Images load just ahead of the reader instead of all 70+ at once.
  const hydrate = (center) => {
    for (let i = Math.max(0, center - 3); i <= Math.min(total - 1, center + 6); i++) {
      pages[i].querySelectorAll('img[data-src]').forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  };
  hydrate(0);
  flip.loadFromHTML(pages);

  const landscape = () => flip.getOrientation() === 'landscape';

  // A closed book only fills the right (or left) half of the spread, so slide it to the centre.
  const setShift = (index) => {
    const front = landscape() && index === 0;
    const back = landscape() && index >= total - 1;
    shift.classList.toggle('is-closed-front', front);
    shift.classList.toggle('is-closed-back', back);
    host.classList.toggle('is-front', front);
    host.classList.toggle('is-back', back);
  };

  const render = (index) => {
    const m = meta[index] || meta[0];
    labelEl.textContent = m.label;
    chapterEl.textContent = m.chapter;
    const shown = landscape() && index > 0 && index < total - 1 ? `${index}–${index + 1}` : `${index + 1}`;
    countEl.textContent = `${shown} / ${total}`;
    prev.disabled = index <= 0;
    next.disabled = index >= total - 1;
    gsap.to(progress, { scaleX: Math.max(0.02, index / (total - 1)), duration: 0.8, ease: 'restro' });
    onChapter?.(m.cat || null);
  };

  flip.on('flip', (e) => {
    hydrate(e.data);
    setShift(e.data);
    render(e.data);
  });
  flip.on('changeState', (e) => {
    const i = flip.getCurrentPageIndex();
    if (e.data === 'flipping' || e.data === 'user_fold') {
      hydrate(i);
      // Opening from either cover: start sliding to the centre while the board swings.
      if (i === 0 || i >= total - 1) {
        shift.classList.remove('is-closed-front', 'is-closed-back');
        host.classList.remove('is-front', 'is-back');
      }
    }
    if (e.data === 'read') setShift(flip.getCurrentPageIndex());
  });
  flip.on('changeOrientation', () => {
    setShift(flip.getCurrentPageIndex());
    render(flip.getCurrentPageIndex());
  });

  setShift(0);
  render(0);

  const onPrev = () => flip.flipPrev('bottom');
  const onNext = () => flip.flipNext('bottom');
  prev.addEventListener('click', onPrev);
  next.addEventListener('click', onNext);

  // Contents / chapter lists inside the book.
  const onGoto = (e) => {
    const btn = e.target.closest('[data-goto]');
    if (!btn) return;
    const target = Number(btn.dataset.goto);
    hydrate(target);
    flip.flip(target, 'bottom');
  };
  el.addEventListener('click', onGoto);

  // Arrow keys while the book is on screen.
  let inView = false;
  const onKey = (e) => {
    if (!inView || section.hidden || e.target.closest('input, textarea, select')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); flip.flipNext('bottom'); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); flip.flipPrev('bottom'); }
  };
  document.addEventListener('keydown', onKey);

  const removeTilt = initTilt(el);

  function tease() {
    // Only on the closed two-page layout; in single-page mode releasing the fold completes a turn.
    if (!landscape() || flip.getCurrentPageIndex() !== 0 || flip.getState() !== 'read') return;
    const r = flip.getBoundsRect();
    const fc = flip.getFlipController();
    fc.showCorner({ x: r.left + r.width - 4, y: r.top + r.height - 4 });
    setTimeout(() => {
      if (flip.getState() === 'fold_corner') fc.showCorner({ x: -9999, y: -9999 });
    }, 1300);
  }

  ctx.add(() => {
    ScrollTrigger.create({ trigger: section, start: 'top 70%', end: 'bottom 30%', onToggle: (s) => { inView = s.isActive; } });
    // Entrance: the closed book rises onto the table, then lifts a corner to invite a turn.
    if (!reduced) {
      gsap.from(host, {
        y: 90, rotationX: 22, autoAlpha: 0, transformPerspective: 1800, transformOrigin: '50% 100%', duration: 1.6, ease: 'expo.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        onComplete: tease,
      });
    }
  });

  // While the panel is hidden the engine measures a zero-width block and can lose its place,
  // so remember the page on the way out and restore it on the way back in.
  let saved = 0;
  return {
    goToChapter(id) {
      const c = chapters.find((x) => x.id === id);
      if (!c) return;
      hydrate(c.start);
      flip.flip(c.start, 'bottom');
    },
    suspend() { saved = flip.getCurrentPageIndex(); },
    refresh() {
      flip.update();
      hydrate(saved);
      flip.turnToPage(saved);
      setShift(saved);
      render(saved);
    },
    destroy() {
      prev.removeEventListener('click', onPrev);
      next.removeEventListener('click', onNext);
      el.removeEventListener('click', onGoto);
      document.removeEventListener('keydown', onKey);
      removeTilt();
      ctx.revert();
      flip.destroy();
    },
  };
}

/* 3D hover: the dish card tilts toward the pointer with a moving glare and parallax layers. */
function initTilt(root) {
  if (!finePointer || reduced) return () => {};
  const offs = [];
  root.querySelectorAll('[data-tilt]').forEach((tilt) => {
    const card = tilt.querySelector('.dish3d__card');
    const glare = tilt.querySelector('.dish3d__glare');
    const shadow = tilt.querySelector('.dish3d__shadow');
    const page = tilt.closest('.pg');
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.7, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.7, ease: 'power3' });
    const z = gsap.quickTo(card, 'z', { duration: 0.7, ease: 'power3' });
    const sx = gsap.quickTo(shadow, 'x', { duration: 0.7, ease: 'power3' });
    const sy = gsap.quickTo(shadow, 'y', { duration: 0.7, ease: 'power3' });
    const move = (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = tilt.getBoundingClientRect();
      const x = Math.min(0.6, Math.max(-0.6, (e.clientX - r.left) / r.width - 0.5));
      const y = Math.min(0.6, Math.max(-0.6, (e.clientY - r.top) / r.height - 0.5));
      rx(-y * 24);
      ry(x * 28);
      z(40);
      sx(-x * 30);
      sy(-y * 20 + 14);
      glare.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
      glare.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
      tilt.classList.add('is-active');
    };
    const leave = () => {
      rx(0); ry(0); z(0); sx(0); sy(0);
      tilt.classList.remove('is-active');
    };
    page.addEventListener('pointermove', move);
    page.addEventListener('pointerleave', leave);
    offs.push(() => {
      page.removeEventListener('pointermove', move);
      page.removeEventListener('pointerleave', leave);
    });
  });
  return () => offs.forEach((off) => off());
}
