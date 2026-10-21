import { useEffect } from 'react';
import { gsap, finePointer } from '../lib/gsap.js';

/** Pulls an element gently toward the pointer while hovered (mouse/trackpad only). */
export function useMagnetic(ref, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !finePointer) return undefined;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.45)' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.36);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.set(el, { clearProps: 'x,y' });
    };
  }, [ref, enabled]);
}
