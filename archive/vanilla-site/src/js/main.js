import '../styles/main.css';
import { ScrollTrigger, fontsReady } from './core/gsap.js';
import { initSmooth, startScroll, stopScroll, scrollToEl } from './core/smooth.js';
import { initNav } from './core/nav.js';
import { initCursor, initMagnetic } from './core/cursor.js';
import { initTransitions, revealCurtain } from './core/transitions.js';
import { initReveals, prepareHero } from './core/reveals.js';
import { runPreloader } from './preloader.js';

const pages = {
  home: () => import('./pages/home.js'),
  menu: () => import('./pages/menu.js'),
  story: () => import('./pages/story.js'),
  gallery: () => import('./pages/gallery.js'),
  visit: () => import('./pages/visit.js'),
};

async function boot() {
  const html = document.documentElement;
  const preloading = html.classList.contains('is-preloading');
  const curtained = html.classList.contains('is-curtain');

  initSmooth();
  if (preloading || curtained) stopScroll();
  initTransitions();
  initNav();
  initCursor();

  const page = document.body.dataset.page;
  const [mod, hero] = await Promise.all([pages[page]?.(), prepareHero()]);
  // Page-specific DOM (e.g. the rendered menu) must exist before reveals are bound.
  await mod?.setup?.();

  if (preloading) await runPreloader({ onReveal: () => hero.play() });
  else if (curtained) await revealCurtain(() => hero.play());
  else { await fontsReady(); hero.play(); }

  startScroll();
  initMagnetic();
  initReveals();
  mod?.init?.();
  ScrollTrigger.refresh();

  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) requestAnimationFrame(() => scrollToEl(target));
  }
}

boot();
