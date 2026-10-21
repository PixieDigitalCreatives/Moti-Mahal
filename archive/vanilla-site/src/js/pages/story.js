import { gsap, ScrollTrigger } from '../core/gsap.js';

export function init() {
  chapters();
  ribbon();
}

// The outlined year on the left swaps as each chapter crosses the middle of the screen.
function chapters() {
  const years = gsap.utils.toArray('[data-year-label]');
  const dots = gsap.utils.toArray('[data-chapter-dot]');
  const set = (i) => {
    years.forEach((y, j) => y.classList.toggle('is-active', i === j));
    dots.forEach((d, j) => d.classList.toggle('is-active', i === j));
  };
  gsap.utils.toArray('[data-chapter]').forEach((ch, i) => {
    ScrollTrigger.create({ trigger: ch, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && set(i) });
    const img = ch.querySelector('img');
    if (img) gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  set(0);
}

// A strip of images that slides sideways as you scroll down past it.
function ribbon() {
  const strip = document.querySelector('[data-ribbon]');
  if (!strip) return;
  gsap.fromTo(strip, { x: () => innerWidth * 0.1 }, {
    x: () => -(strip.scrollWidth - innerWidth * 0.9), ease: 'none',
    scrollTrigger: { trigger: strip.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
  });
}
