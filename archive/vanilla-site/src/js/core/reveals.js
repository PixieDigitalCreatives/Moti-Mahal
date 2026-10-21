import { gsap, ScrollTrigger, SplitText, fontsReady, reduced } from './gsap.js';

/** Prepares the hero headline so it can rise in the moment the page is revealed. */
export async function prepareHero() {
  const title = document.querySelector('[data-hero-title]');
  const items = gsap.utils.toArray('[data-hero-item]');
  if (!title || reduced) return { play() {} };
  await fontsReady();
  const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
  gsap.set(split.lines, { yPercent: 115 });
  gsap.set(items, { autoAlpha: 0, y: 34 });
  let played = false;
  return {
    play() {
      if (played) return;
      played = true;
      gsap.timeline({ onComplete: () => split.revert() })
        .to(split.lines, { yPercent: 0, duration: 1.6, ease: 'expo.out', stagger: 0.13 })
        .to(items, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 }, 0.35);
    },
  };
}

export function initReveals(scope = document) {
  const q = (sel) => gsap.utils.toArray(scope.querySelectorAll(sel));

  if (reduced) {
    q('[data-scrub-words]').forEach((el) => gsap.set(el, { opacity: 1 }));
    return;
  }

  q('[data-split]').forEach((el) => {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    gsap.from(split.lines, {
      yPercent: 115, duration: 1.4, ease: 'expo.out', stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onComplete: () => split.revert(),
    });
  });

  q('[data-fade]').forEach((el) => {
    gsap.from(el, { y: 40, autoAlpha: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });

  q('[data-stagger]').forEach((el) => {
    gsap.from(el.children, { y: 50, autoAlpha: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  q('[data-parallax]').forEach((el) => {
    const amt = parseFloat(el.dataset.parallax) || 14;
    gsap.fromTo(el, { yPercent: -amt / 2 }, {
      yPercent: amt / 2, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  q('[data-parallax-img]').forEach((img) => {
    gsap.set(img, { scale: 1.18 });
    gsap.fromTo(img, { yPercent: -7 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // Images grow in as they enter, then darken and fade as they leave.
  // One timeline per element over its whole pass, so the in and out phases never fight.
  q('[data-scale-fade]').forEach((el) => {
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      .fromTo(el, { scale: 0.84, opacity: 0.35, filter: 'brightness(1)' }, { scale: 1, opacity: 1, duration: 0.45, ease: 'none' })
      .to(el, { duration: 0.25 })
      .to(el, { opacity: 0.3, filter: 'brightness(0.55)', duration: 0.3, ease: 'none' });
  });

  // Word-by-word illumination tied to scroll.
  q('[data-scrub-words]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', wordsClass: 'scrub-word' });
    gsap.fromTo(split.words, { opacity: 0.13 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 48%', scrub: true },
    });
    el.querySelectorAll('[data-pill]').forEach((pill) => {
      gsap.fromTo(pill, { clipPath: 'inset(0% 50% 0% 50% round 100px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 100px)', ease: 'none',
        scrollTrigger: { trigger: pill, start: 'top 82%', end: 'top 55%', scrub: true },
      });
    });
  });

  q('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 2.2, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.v); },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  q('[data-spin]').forEach((el) => {
    gsap.to(el, { rotate: 360, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  });

  // Footer wordmark: letters rise as the footer arrives.
  q('[data-footer-word]').forEach((el) => {
    const split = SplitText.create(el, { type: 'chars', charsClass: 'fw-char' });
    gsap.from(split.chars, {
      yPercent: 60, autoAlpha: 0, ease: 'none', stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom 85%', scrub: 1 },
    });
  });

  q('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Generic page-hero parallax for inner pages.
  q('[data-page-hero-media]').forEach((el) => {
    gsap.to(el, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
  });
}

export { ScrollTrigger };
