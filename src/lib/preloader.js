import { gsap, reduced, wait, fontsReady } from './gsap.js';

const pad = (n) => String(Math.round(n)).padStart(3, '0');

function heroImageReady() {
  const img = document.querySelector('[data-hero-media] img, [data-page-hero-media] img');
  if (!img) return Promise.resolve();
  if (img.complete && img.naturalWidth) return img.decode?.().catch(() => {}) ?? Promise.resolve();
  return new Promise((r) => {
    img.addEventListener('load', r, { once: true });
    img.addEventListener('error', r, { once: true });
  });
}

/**
 * The Mahal gate intro:
 *   1. gold line-art draws itself while fonts and the hero image load (000 -> 100)
 *   2. the facade, sky and studded doors illuminate
 *   3. the doors swing open on a pool of lamplight
 *   4. the camera dives through the arch into the live hero underneath
 * Returns a cleanup function.
 */
export function runPreloader(root, { onReveal, onDone } = {}) {
  const $ = (s) => root.querySelector(s);
  const svg = $('.gate-svg');
  const zoom = $('[data-preloader-zoom]');
  const backdrop = $('[data-preloader-backdrop]');
  const ui = $('[data-preloader-ui]');
  const countEl = $('[data-preloader-count]');
  const bar = $('[data-preloader-bar]');
  const skip = $('[data-preloader-skip]');
  const lines = gsap.utils.toArray(svg.querySelectorAll('.gate-lines path:not(.gate-pearls)'));
  const pearls = svg.querySelector('.gate-pearls');
  const sky = svg.querySelector('.gate-sky');
  const solids = svg.querySelector('.gate-solid');
  const doors = svg.querySelector('.gate-doors');
  const doorL = svg.querySelector('.gate-door--l');
  const doorR = svg.querySelector('.gate-door--r');
  const glow = svg.querySelector('.gate-glow');

  const ready = Promise.race([Promise.all([fontsReady(4000), heroImageReady()]), wait(7000)]);
  const timelines = [];
  let done = false;
  let revealed = false;

  const reveal = () => {
    if (revealed) return;
    revealed = true;
    onReveal?.();
  };
  const finish = () => {
    if (done) return;
    done = true;
    onDone?.();
  };
  const onSkip = () => {
    timelines.forEach((t) => t.pause());
    gsap.to(root, { autoAlpha: 0, duration: 0.5, onComplete: finish });
    reveal();
  };
  skip.addEventListener('click', onSkip);

  if (reduced) {
    ready.then(() => wait(500)).then(() => {
      if (done) return;
      gsap.to(root, { autoAlpha: 0, duration: 0.6, onComplete: finish });
      reveal();
    });
  } else {
    gsap.set(lines, { drawSVG: '0%' });
    gsap.set([sky, solids, doors, pearls, glow], { opacity: 0 });
    const count = { v: 0 };
    const setCount = () => {
      countEl.textContent = pad(count.v);
      bar.style.transform = `scaleX(${count.v / 100})`;
    };

    // Draw from the portal outward and from the ground up.
    const delays = lines.map((p) => {
      const b = p.getBBox();
      return (Math.abs(b.x + b.width / 2 - 720) / 720) * 1.05 + ((900 - (b.y + b.height / 2)) / 900) * 0.5;
    });

    const draw = gsap.timeline();
    timelines.push(draw);
    draw
      .from(ui, { autoAlpha: 0, y: 20, duration: 1, ease: 'power3.out' }, 0)
      .to(lines, { drawSVG: '100%', duration: 1.5, ease: 'power2.inOut', stagger: (i) => delays[i] }, 0.15)
      .to(count, { v: 88, duration: 2.7, ease: 'power1.inOut', onUpdate: setCount }, 0)
      .to(pearls, { opacity: 1, duration: 0.9, ease: 'power2.out' }, 1.7);

    Promise.all([draw.then(), ready]).then(() => {
      if (done) return;
      const r = glow.getBoundingClientRect();
      gsap.set(zoom, { transformOrigin: `${r.left + r.width / 2}px ${r.top + r.height * 0.62}px` });
      const heroMedia = document.querySelector('[data-hero-media], [data-page-hero-media]');

      const tl = gsap.timeline();
      timelines.push(tl);
      tl.to(count, { v: 100, duration: 0.5, ease: 'power2.out', onUpdate: setCount })
        .to([sky, solids], { opacity: 1, duration: 1.1, ease: 'power2.inOut' }, '<')
        .to(doors, { opacity: 1, duration: 0.9, ease: 'power2.inOut' }, '<0.1')
        .to(lines, { opacity: 0.6, duration: 1 }, '<')
        .set(backdrop, { autoAlpha: 0 })
        .to([ui, skip], { autoAlpha: 0, y: 16, duration: 0.6, ease: 'power2.in' }, '+=0.1')
        .addLabel('open', '-=0.25')
        .to(glow, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 'open')
        .to(doorL, { scaleX: 0.02, skewY: -14, svgOrigin: '606 900', duration: 1.3, ease: 'power3.inOut' }, 'open')
        .to(doorR, { scaleX: 0.02, skewY: 14, svgOrigin: '834 900', duration: 1.3, ease: 'power3.inOut' }, 'open')
        .addLabel('zoom', '-=0.3')
        .to(zoom, { scale: 10, duration: 1.7, ease: 'power3.in' }, 'zoom')
        .to(glow, { opacity: 0, duration: 0.8, ease: 'power1.in' }, 'zoom+=0.45')
        .add(() => {
          if (heroMedia) gsap.fromTo(heroMedia, { scale: 1.28 }, { scale: 1, duration: 2.4, ease: 'expo.out' });
          reveal();
        }, 'zoom+=1.0')
        .to(root, { autoAlpha: 0, duration: 0.45, ease: 'power1.out' }, 'zoom+=1.3')
        .add(finish);
    });
  }

  return () => {
    skip.removeEventListener('click', onSkip);
    timelines.forEach((t) => t.kill());
  };
}
