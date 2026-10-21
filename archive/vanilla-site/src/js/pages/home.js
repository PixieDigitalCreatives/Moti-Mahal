import { gsap, ScrollTrigger } from '../core/gsap.js';

export function init() {
  heroScroll();
  signatures();
  archReveal();
  marquees();
}

function heroScroll() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  gsap.to('[data-hero-media] img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__content', { yPercent: -18, autoAlpha: 0.15, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
}

function signatures() {
  const section = document.querySelector('[data-hscroll]');
  if (!section) return;
  const pin = section.querySelector('[data-hscroll-pin]');
  const track = section.querySelector('[data-hscroll-track]');
  const bar = section.querySelector('[data-hscroll-bar]');
  const counter = section.querySelector('[data-hscroll-count]');
  const cards = gsap.utils.toArray(track.children);
  const total = String(cards.length).padStart(2, '0');

  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    const distance = () => Math.max(0, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'center center',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          gsap.set(bar, { scaleX: 0.05 + self.progress * 0.95 });
          const i = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
          counter.textContent = `${String(i).padStart(2, '0')} — ${total}`;
        },
      },
    });

    // Inside the moving track: images drift against the motion, cards rise as they enter.
    section.querySelectorAll('[data-hscroll-img]').forEach((img) => {
      gsap.fromTo(img, { xPercent: -7 }, {
        xPercent: 7, ease: 'none',
        scrollTrigger: { trigger: img.closest('.dish'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      });
    });
    cards.forEach((card) => {
      gsap.from(card, {
        y: 80, rotate: 2.5, autoAlpha: 0.4, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 105%', end: 'left 60%', scrub: true },
      });
    });
  });
}

function archReveal() {
  const sec = document.querySelector('[data-arch-reveal]');
  if (!sec) return;
  const win = sec.querySelector('[data-ar-window]');
  const img = sec.querySelector('[data-ar-img]');
  const end = sec.querySelector('[data-ar-end]');

  // Scale needed for the arch window to swallow the viewport (origin at 50% / 80%).
  const coverScale = () => {
    const w = win.offsetWidth, h = win.offsetHeight;
    const originY = (innerHeight - h) / 2 + h * 0.8;
    const s1 = innerWidth / w;
    const s2 = originY / Math.max(1, h * 0.8 - w * 0.5);
    const s3 = (innerHeight - originY) / (h * 0.2);
    return Math.max(s1, s2, s3) * 1.08;
  };

  gsap.set(win, { transformOrigin: '50% 80%' });
  const tl = gsap.timeline({
    scrollTrigger: { trigger: sec, start: 'top top', end: '+=190%', pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
  });
  tl.from(win, { scale: 0.72, duration: 0.25, ease: 'power1.out' }, 0)
    .to(win, { scale: () => coverScale(), duration: 1, ease: 'power2.in' }, 0.25)
    .to(img, { scale: 1, duration: 1.25, ease: 'none' }, 0)
    .to('[data-ar-left]', { xPercent: -70, autoAlpha: 0, duration: 0.6, ease: 'power1.in' }, 0.3)
    .to('[data-ar-right]', { xPercent: 70, autoAlpha: 0, duration: 0.6, ease: 'power1.in' }, 0.3)
    .to('[data-ar-cap]', { autoAlpha: 0, y: 40, duration: 0.3 }, 0.25)
    .to('[data-ar-pearls]', { autoAlpha: 0, duration: 0.3 }, 0.5)
    .to(end, { autoAlpha: 1, duration: 0.25 }, 1.05)
    .from(end.children, { y: 50, autoAlpha: 0, stagger: 0.06, duration: 0.3 }, 1.08)
    .set(end, { pointerEvents: 'auto' }, 1.2)
    .to({}, { duration: 0.25 });
}

function marquees() {
  gsap.utils.toArray('[data-marquee]').forEach((row) => {
    const group = row.querySelector('.marquee__group');
    const w = group.offsetWidth;
    const copies = Math.max(1, Math.ceil((innerWidth * 2) / w));
    for (let i = 0; i < copies; i++) {
      const c = group.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      row.appendChild(c);
    }
    const dir = Number(row.dataset.marquee) || -1;
    const loop = gsap.fromTo(row, { x: dir < 0 ? 0 : -w }, { x: dir < 0 ? -w : 0, duration: w / 70, ease: 'none', repeat: -1 });
    let sign = 1;
    ScrollTrigger.create({
      trigger: row, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        sign = self.direction;
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 5);
        gsap.to(loop, {
          timeScale: sign * boost, duration: 0.25, overwrite: true,
          onComplete: () => gsap.to(loop, { timeScale: sign, duration: 1.4, ease: 'power2.out' }),
        });
      },
    });
  });
}
