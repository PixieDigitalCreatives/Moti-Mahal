import Lenis from 'lenis';
import { gsap, ScrollTrigger, reduced } from './gsap.js';

export let lenis = null;

export function initSmooth() {
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.3 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // In-page anchors glide instead of jumping.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash.length < 2) return;
    const target = document.querySelector(url.hash);
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
    history.replaceState(null, '', url.hash);
  });
}

export function scrollToEl(el, immediate = false, offset = -100) {
  if (lenis) lenis.scrollTo(el, { offset, immediate, duration: 1.6 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset, behavior: immediate ? 'auto' : 'smooth' });
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();

export function onScroll(fn) {
  if (lenis) lenis.on('scroll', (l) => fn(l.scroll, l.direction));
  else {
    let last = scrollY;
    addEventListener('scroll', () => { fn(scrollY, scrollY > last ? 1 : -1); last = scrollY; }, { passive: true });
  }
}
