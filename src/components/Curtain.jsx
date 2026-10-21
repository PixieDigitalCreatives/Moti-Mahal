import { useLayoutEffect } from 'react';
import { gsap } from '../lib/gsap.js';
import { useExperience } from '../context/Experience.jsx';

/** Arch-topped panel that rises between routes (driven by the experience context). */
export default function Curtain() {
  const { curtainRef } = useExperience();

  // Park it below the viewport as a GSAP-controlled transform.
  useLayoutEffect(() => {
    gsap.set(curtainRef.current, { y: 0, yPercent: 115 });
  }, [curtainRef]);

  return (
    <div className="curtain" ref={curtainRef} aria-hidden="true">
      <svg className="curtain__arch" viewBox="0 0 100 20" preserveAspectRatio="none">
        <path d="M0 20V12C0 6 30 4.4 50 0c20 4.4 50 6 50 12v8z" />
      </svg>
      <div className="curtain__panel" />
      <div className="curtain__title" data-curtain-title />
    </div>
  );
}
