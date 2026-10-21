import { useEffect, useRef } from 'react';
import { gsap, SplitText, useGSAP, fontsReady, reduced } from '../lib/gsap.js';
import { useExperience } from '../context/Experience.jsx';

/**
 * Hides the page headline as soon as the route mounts and rises it in, line by line,
 * the moment the experience reveals the page (after the preloader or the curtain).
 */
export function useHeroIntro(scope) {
  const { revealKey } = useExperience();
  const mountedAt = useRef(revealKey);
  const state = useRef({ ready: false, pending: false, played: false, play: null });

  useGSAP((_, contextSafe) => {
    if (reduced) return;
    const title = scope.current.querySelector('[data-hero-title]');
    const items = gsap.utils.toArray(scope.current.querySelectorAll('[data-hero-item]'));
    if (!title) return;
    gsap.set(title, { autoAlpha: 0 });
    gsap.set(items, { autoAlpha: 0, y: 34 });

    fontsReady().then(contextSafe(() => {
      const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
      gsap.set(split.lines, { yPercent: 115 });
      gsap.set(title, { autoAlpha: 1 });
      state.current.play = contextSafe(() => {
        if (state.current.played) return;
        state.current.played = true;
        gsap.timeline({ onComplete: () => split.revert() })
          .to(split.lines, { yPercent: 0, duration: 1.6, ease: 'expo.out', stagger: 0.13 })
          .to(items, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 }, 0.35);
      });
      state.current.ready = true;
      if (state.current.pending) state.current.play();
    }));
  }, { scope });

  useEffect(() => {
    if (revealKey <= mountedAt.current) return;
    if (state.current.ready) state.current.play?.();
    else state.current.pending = true;
  }, [revealKey]);
}
