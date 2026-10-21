import { gsap, finePointer } from './gsap.js';

export function initCursor() {
  if (!finePointer) return;
  const dot = Object.assign(document.createElement('div'), { className: 'cursor' });
  const ring = Object.assign(document.createElement('div'), { className: 'cursor-ring', innerHTML: '<span class="cursor-ring__label"></span>' });
  const label = ring.firstChild;
  document.body.append(dot, ring);

  const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });
  gsap.set([dot, ring], { x: innerWidth / 2, y: innerHeight / 2 });

  addEventListener('pointermove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });

  const interactive = 'a, button, [data-cursor], [data-cursor-label], input, select, textarea, .masonry__item';
  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest(interactive);
    if (!el) return;
    const text = el.closest('[data-cursor-label]')?.dataset.cursorLabel;
    if (text) { label.textContent = text; ring.classList.add('is-label'); }
    else ring.classList.add('is-hover');
  });
  document.addEventListener('pointerout', (e) => {
    const el = e.target.closest(interactive);
    if (!el || el.contains(e.relatedTarget)) return;
    ring.classList.remove('is-hover', 'is-label');
  });
  document.addEventListener('pointerdown', () => gsap.to(ring, { scale: 0.85, duration: 0.2 }));
  document.addEventListener('pointerup', () => gsap.to(ring, { scale: 1, duration: 0.4 }));
  document.documentElement.addEventListener('pointerleave', () => gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 }));
  document.documentElement.addEventListener('pointerenter', () => gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 }));
}

export function initMagnetic(scope = document) {
  if (!finePointer) return;
  scope.querySelectorAll('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.36);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}
