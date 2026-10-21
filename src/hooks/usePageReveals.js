import { useGSAP } from '../lib/gsap.js';
import { initReveals } from '../lib/reveals.js';
import { useExperience } from '../context/Experience.jsx';

/**
 * Binds the shared scroll reveals (plus any page-specific timeline) once the intro has finished.
 * Everything is created inside the route's GSAP context and reverted when the route unmounts.
 */
export function usePageReveals(scope, pageAnimations) {
  const { phase } = useExperience();
  useGSAP(() => {
    if (phase !== 'ready') return;
    initReveals(scope.current);
    pageAnimations?.(scope.current);
  }, { scope, dependencies: [phase] });
}
