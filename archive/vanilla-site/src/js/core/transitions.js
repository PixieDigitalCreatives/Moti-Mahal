import { gsap, reduced } from './gsap.js';
import { stopScroll } from './smooth.js';

const NAMES = {
  '/': 'Home',
  '/index.html': 'Home',
  '/menu.html': 'The Menu',
  '/story.html': 'Our Story',
  '/gallery.html': 'Gallery',
  '/visit.html': 'Visit & Reserve',
};
const titleFor = (path) => NAMES[path] || 'Moti Restro';

const curtain = () => document.querySelector('[data-curtain]');

function setTitle(path) {
  const t = document.querySelector('[data-curtain-title]');
  if (t) t.innerHTML = `<span><small>Moti Restro</small>${titleFor(path)}</span>`;
}

export function initTransitions() {
  const el = curtain();
  if (!el) return;
  const covering = document.documentElement.classList.contains('is-curtain');
  gsap.set(el, { yPercent: covering ? 0 : 115, y: 0 });
  document.documentElement.classList.remove('is-curtain');

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !(url.pathname in NAMES)) return;
    if (url.pathname === location.pathname || (url.pathname === '/index.html' && location.pathname === '/')) return;
    e.preventDefault();
    leave(url);
  });

  // Returning via the back button restores a frozen page: make sure the curtain is gone.
  addEventListener('pageshow', (e) => { if (e.persisted) gsap.set(el, { yPercent: 115 }); });
}

function leave(url) {
  const el = curtain();
  try { sessionStorage.setItem('mm-curtain', '1'); } catch (_) {}
  if (reduced) { location.href = url.href; return; }
  setTitle(url.pathname);
  stopScroll();
  gsap.timeline({ onComplete: () => { location.href = url.href; } })
    .fromTo(el, { yPercent: 115 }, { yPercent: 0, duration: 0.95, ease: 'expo.inOut' })
    .from(el.querySelector('[data-curtain-title]'), { autoAlpha: 0, y: 30, duration: 0.6, ease: 'power3.out' }, '-=0.35');
}

/** Lifts the curtain on arrival. Resolves once the page is visible. */
export function revealCurtain(onReveal) {
  const el = curtain();
  try { sessionStorage.removeItem('mm-curtain'); } catch (_) {}
  if (!el || gsap.getProperty(el, 'yPercent') > 100) { onReveal?.(); return Promise.resolve(); }
  setTitle(location.pathname);
  return new Promise((resolve) => {
    gsap.timeline({ delay: 0.1, onComplete: resolve })
      .to(el.querySelector('[data-curtain-title]'), { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' })
      .to(el, { yPercent: -125, duration: 1.15, ease: 'expo.inOut' }, '-=0.15')
      .add(() => onReveal?.(), '-=0.75')
      .set(el, { yPercent: 115 })
      .set(el.querySelector('[data-curtain-title]'), { autoAlpha: 1, y: 0 });
  });
}
