import { gsap } from './gsap.js';
import { onScroll, stopScroll, startScroll } from './smooth.js';

export function initNav() {
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const overlay = document.querySelector('[data-menu-overlay]');
  const page = document.body.dataset.page;
  document.querySelectorAll(`[data-link="${page}"]`).forEach((a) => a.setAttribute('aria-current', 'page'));

  let open = false;
  let last = 0;
  onScroll((y) => {
    nav.classList.toggle('is-scrolled', y > 40);
    if (!open) {
      const hide = y > last && y > 420;
      nav.classList.toggle('is-hidden', hide);
      document.documentElement.classList.toggle('nav-hidden', hide);
    }
    last = y;
  });

  if (!toggle || !overlay) return;
  const links = overlay.querySelectorAll('.menu-overlay__links a, .menu-overlay__foot > *');
  gsap.set(overlay, { autoAlpha: 0 });

  const tl = gsap.timeline({ paused: true })
    .set(overlay, { autoAlpha: 1 })
    .fromTo(overlay, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' })
    .from(links, { yPercent: 60, autoAlpha: 0, duration: 0.9, stagger: 0.06 }, '-=0.35');

  const set = (state) => {
    open = state;
    toggle.setAttribute('aria-expanded', String(state));
    toggle.querySelector('.sr-only').textContent = state ? 'Close menu' : 'Open menu';
    nav.classList.remove('is-hidden');
    if (state) { tl.timeScale(1).play(); stopScroll(); }
    else { tl.timeScale(1.6).reverse(); startScroll(); }
  };
  toggle.addEventListener('click', () => set(!open));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) set(false); });
  overlay.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
}
