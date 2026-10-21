import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { gsap, ScrollTrigger, reduced, fontsReady } from '../lib/gsap.js';
import { initSmooth, scrollToEl, scrollToTop, startScroll, stopScroll } from '../lib/smooth.js';
import { ROUTE_TITLES } from '../data/site.js';

/**
 * Orchestrates how pages appear:
 *   - first visit: the Mahal-gate preloader, then the hero plays
 *   - internal links: an arch-topped curtain rises, the route changes underneath, the curtain lifts
 *   - `revealKey` increments whenever the current page's hero should animate in
 */
const ExperienceContext = createContext(null);
export const useExperience = () => useContext(ExperienceContext);

function setCurtainTitle(el, path) {
  const t = el.querySelector('[data-curtain-title]');
  if (t) t.innerHTML = `<span><small>Moti Mahal</small>${ROUTE_TITLES[path] || 'Moti Mahal'}</span>`;
}

export function ExperienceProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState(() => (document.documentElement.classList.contains('is-preloading') ? 'preloading' : 'ready'));
  const [revealKey, setRevealKey] = useState(0);
  const reveal = useCallback(() => setRevealKey((k) => k + 1), []);
  const curtainRef = useRef(null);
  const pending = useRef(null);
  const busy = useRef(false);
  const firstRoute = useRef(true);

  useLayoutEffect(() => {
    initSmooth();
    if (phase === 'preloading') stopScroll();
  }, []);

  // Returning visitors skip the gate: play the hero once fonts are in.
  useEffect(() => {
    if (phase === 'ready') fontsReady().then(reveal);
  }, []);

  const go = useCallback((href) => {
    const url = new URL(href, window.location.href);
    const path = url.pathname;
    if (path === window.location.pathname) {
      if (url.hash) scrollToEl(document.querySelector(url.hash));
      else scrollToTop();
      return;
    }
    if (busy.current) return;
    const el = curtainRef.current;
    const target = path + url.search + url.hash;
    if (reduced || !el) {
      navigate(target);
      return;
    }
    busy.current = true;
    pending.current = { hash: url.hash };
    setCurtainTitle(el, path);
    stopScroll();
    gsap.timeline({
      onComplete: () => {
        scrollToTop(true);
        navigate(target);
      },
    })
      .fromTo(el, { yPercent: 115 }, { yPercent: 0, duration: 0.95, ease: 'expo.inOut' })
      .fromTo(el.querySelector('[data-curtain-title]'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.35');
  }, [navigate]);

  // Runs after the new route's own layout effects, so the page is mounted under the curtain.
  useLayoutEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    const job = pending.current;
    pending.current = null;
    const el = curtainRef.current;
    ScrollTrigger.refresh();
    if (job && el) {
      const title = el.querySelector('[data-curtain-title]');
      gsap.timeline({ delay: 0.15, onComplete: () => { busy.current = false; } })
        .to(title, { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' })
        .to(el, { yPercent: -125, duration: 1.15, ease: 'expo.inOut' }, '-=0.15')
        .add(() => { reveal(); startScroll(); }, '-=0.75')
        .add(() => { if (job.hash) scrollToEl(document.querySelector(job.hash)); })
        .set(el, { yPercent: 115 });
    } else {
      // Back / forward: no curtain, start at the top and play the hero right away.
      scrollToTop(true);
      reveal();
    }
  }, [location.pathname]);

  // Any plain internal link (nav, buttons, links inside the menu book) gets the curtain.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const sameDoc = url.pathname === window.location.pathname;
      if (!sameDoc && !(url.pathname in ROUTE_TITLES)) return;
      e.preventDefault();
      go(a.getAttribute('href'));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [go]);

  const value = useMemo(() => ({ phase, setPhase, revealKey, reveal, go, curtainRef }), [phase, revealKey, reveal, go]);
  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}
