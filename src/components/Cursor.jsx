import { useEffect, useRef } from 'react';
import { gsap, finePointer } from '../lib/gsap.js';

const INTERACTIVE = 'a, button, [data-cursor], [data-cursor-label], input, select, textarea, .masonry__item';

/** Gold dot + trailing ring; grows over interactive elements and can carry a short label. */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!finePointer) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });
    gsap.set([dot, ring], { x: innerWidth / 2, y: innerHeight / 2 });

    const move = (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = (e) => {
      const el = e.target.closest(INTERACTIVE);
      if (!el) return;
      const text = el.closest('[data-cursor-label]')?.dataset.cursorLabel;
      if (text) { label.textContent = text; ring.classList.add('is-label'); }
      else ring.classList.add('is-hover');
    };
    const out = (e) => {
      const el = e.target.closest(INTERACTIVE);
      if (!el || el.contains(e.relatedTarget)) return;
      ring.classList.remove('is-hover', 'is-label');
    };
    const down = () => gsap.to(ring, { scale: 0.85, duration: 0.2 });
    const up = () => gsap.to(ring, { scale: 1, duration: 0.4 });
    const leave = () => gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
    const enter = () => gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.addEventListener('pointerout', out);
    document.addEventListener('pointerdown', down);
    document.addEventListener('pointerup', up);
    document.documentElement.addEventListener('pointerleave', leave);
    document.documentElement.addEventListener('pointerenter', enter);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerout', out);
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.documentElement.removeEventListener('pointerenter', enter);
    };
  }, []);

  if (!finePointer) return null;
  return (
    <>
      <div className="cursor" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef}><span className="cursor-ring__label" ref={labelRef} /></div>
    </>
  );
}
