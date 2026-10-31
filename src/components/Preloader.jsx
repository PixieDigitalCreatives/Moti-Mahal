import { useLayoutEffect, useRef } from 'react';
import gateSvg from '../assets/gate.svg?raw';
import { runPreloader } from '../lib/preloader.js';
import { startScroll, stopScroll } from '../lib/smooth.js';
import { useExperience } from '../context/Experience.jsx';

/** First-visit intro: the gate draws itself, opens, and the camera flies through the arch. */
export default function Preloader() {
  const { phase, setPhase, reveal } = useExperience();
  const root = useRef(null);

  useLayoutEffect(() => {
    if (phase !== 'preloading') return undefined;
    stopScroll();
    return runPreloader(root.current, {
      onReveal: reveal,
      onDone: () => {
        try { sessionStorage.setItem('mr-entered', '1'); } catch (_) { /* private mode */ }
        document.documentElement.classList.remove('is-preloading');
        startScroll();
        setPhase('ready');
      },
    });
  }, []);

  if (phase !== 'preloading') return null;

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader__backdrop" data-preloader-backdrop />
      <div className="preloader__zoom" data-preloader-zoom dangerouslySetInnerHTML={{ __html: gateSvg }} />
      <div className="preloader__ui" data-preloader-ui>
        <div className="preloader__brand"><span>Moti Restro</span><span>Jaypee Greens · Greater Noida</span></div>
        <div className="preloader__count" data-preloader-count>000</div>
        <div className="preloader__bar"><i data-preloader-bar /></div>
      </div>
      <button className="preloader__skip" type="button" data-preloader-skip>Skip intro</button>
    </div>
  );
}
