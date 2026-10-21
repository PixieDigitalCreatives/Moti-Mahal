import { gsap, Flip, ScrollTrigger } from '../core/gsap.js';
import { stopScroll, startScroll } from '../core/smooth.js';

export function init() {
  parallaxTiles();
  filters();
  lightbox();
}

function parallaxTiles() {
  gsap.utils.toArray('.masonry__item img').forEach((img, i) => {
    const amt = [6, 10, 4][i % 3];
    gsap.fromTo(img, { yPercent: -amt }, {
      yPercent: amt, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function filters() {
  const buttons = gsap.utils.toArray('[data-filter]');
  const items = gsap.utils.toArray('.masonry__item');
  buttons.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    const state = Flip.getState(items);
    items.forEach((it) => it.classList.toggle('is-out', f !== 'all' && !it.dataset.tags.split(' ').includes(f)));
    Flip.from(state, {
      duration: 0.9, ease: 'mahal', absolute: true, scale: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.7 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.5 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }));
}

function lightbox() {
  const box = document.querySelector('[data-lightbox]');
  if (!box) return;
  const img = box.querySelector('[data-lb-img]');
  const title = box.querySelector('[data-lb-title]');
  const meta = box.querySelector('[data-lb-meta]');
  let list = [];
  let index = 0;
  let opener = null;

  const render = () => {
    const it = list[index];
    img.src = it.querySelector('img').currentSrc || it.querySelector('img').src;
    img.alt = it.querySelector('img').alt;
    title.textContent = it.dataset.title;
    meta.textContent = `${String(index + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`;
  };
  const open = (item) => {
    list = gsap.utils.toArray('.masonry__item:not(.is-out)');
    index = list.indexOf(item);
    opener = item;
    render();
    box.classList.add('is-open');
    stopScroll();
    gsap.fromTo(box, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
    gsap.fromTo(img, { scale: 0.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8 });
    box.querySelector('[data-lb-close]').focus();
  };
  const close = () => {
    gsap.to(box, { autoAlpha: 0, duration: 0.35, onComplete: () => { box.classList.remove('is-open'); startScroll(); opener?.focus(); } });
  };
  const step = (d) => {
    index = (index + d + list.length) % list.length;
    gsap.to(img, { autoAlpha: 0, x: -30 * d, duration: 0.25, onComplete: () => { render(); gsap.fromTo(img, { autoAlpha: 0, x: 30 * d }, { autoAlpha: 1, x: 0, duration: 0.5 }); } });
  };

  document.querySelectorAll('.masonry__item').forEach((it) => {
    it.addEventListener('click', () => open(it));
    it.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(it); } });
  });
  box.querySelector('[data-lb-close]').addEventListener('click', close);
  box.querySelector('[data-lb-prev]').addEventListener('click', () => step(-1));
  box.querySelector('[data-lb-next]').addEventListener('click', () => step(1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
}
