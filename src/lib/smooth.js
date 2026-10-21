import Lenis from 'lenis';
import { gsap, ScrollTrigger, reduced } from './gsap.js';

export let lenis = null;

export function initSmooth() {
  if (lenis || reduced) return;
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.3 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollToEl(el, immediate = false, offset = -100) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, immediate, duration: 1.6 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: immediate ? 'auto' : 'smooth' });
}

export function scrollToTop(immediate = false) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();

/** Subscribes to scroll position; returns an unsubscribe function. */
export function onScroll(fn) {
  if (lenis) return lenis.on('scroll', (l) => fn(l.scroll, l.direction));
  let last = window.scrollY;
  const handler = () => {
    fn(window.scrollY, window.scrollY > last ? 1 : -1);
    last = window.scrollY;
  };
  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}
