import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { gsap, useGSAP } from '../lib/gsap.js';
import { onScroll, startScroll, stopScroll } from '../lib/smooth.js';
import { NAV_LINKS, PHONE_DISPLAY, PHONE_TEL } from '../data/site.js';
import Logo from './Logo.jsx';
import Button from './Button.jsx';

const MOBILE_LINKS = [{ to: '/', label: 'Home' }, ...NAV_LINKS.slice(0, 3), { to: '/visit', label: 'Visit & Reserve' }];

export default function Nav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const tl = useRef(null);
  const openRef = useRef(open);
  openRef.current = open;

  // Glass pill once scrolled; slides away on the way down, returns on the way up.
  useEffect(() => {
    let last = 0;
    return onScroll((y) => {
      const nav = navRef.current;
      if (!nav) return;
      nav.classList.toggle('is-scrolled', y > 40);
      if (!openRef.current) {
        const hide = y > last && y > 420;
        nav.classList.toggle('is-hidden', hide);
        document.documentElement.classList.toggle('nav-hidden', hide);
      }
      last = y;
    });
  }, []);

  useGSAP(() => {
    const overlay = overlayRef.current;
    const links = overlay.querySelectorAll('.menu-overlay__links a, .menu-overlay__foot > *');
    gsap.set(overlay, { autoAlpha: 0 });
    tl.current = gsap.timeline({ paused: true })
      .set(overlay, { autoAlpha: 1 })
      .fromTo(overlay, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' })
      .from(links, { yPercent: 60, autoAlpha: 0, duration: 0.9, stagger: 0.06 }, '-=0.35');
  }, { scope: overlayRef });

  const toggled = useRef(false);
  useEffect(() => {
    if (!tl.current) return;
    if (!toggled.current) { toggled.current = true; return; } // nothing to undo on mount
    navRef.current.classList.remove('is-hidden');
    if (open) { tl.current.timeScale(1).play(); stopScroll(); }
    else { tl.current.timeScale(1.6).reverse(); startScroll(); }
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const current = (to) => (to === pathname ? 'page' : undefined);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="nav" ref={navRef}>
        <div className="nav__inner">
          <Logo data-cursor />
          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a key={l.to} href={l.to} aria-current={current(l.to)}>{l.label}</a>
            ))}
          </nav>
          <div className="nav__actions">
            <a className="nav__phone" href={PHONE_TEL}>{PHONE_DISPLAY}</a>
            <Button href="/visit#reserve" variant="outline" size="sm">Reserve</Button>
            <button
              className="nav__toggle"
              type="button"
              aria-expanded={open}
              aria-controls="menu-overlay"
              onClick={() => setOpen((o) => !o)}
            >
              <span /><span />
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            </button>
          </div>
        </div>
      </header>
      <div className="menu-overlay" id="menu-overlay" ref={overlayRef}>
        <nav className="menu-overlay__links" aria-label="Mobile">
          {MOBILE_LINKS.map((l, i) => (
            <a key={l.to} href={l.to} aria-current={current(l.to)}>
              <span>{String(i).padStart(2, '0')}</span>{l.label}
            </a>
          ))}
        </nav>
        <div className="menu-overlay__foot">
          <a href={PHONE_TEL}>Call {PHONE_DISPLAY}</a>
          <span>Open daily · 11 AM – 11 PM</span>
          <span>Sun Twilight, Sector 27, Jaypee Greens</span>
        </div>
      </div>
    </>
  );
}
