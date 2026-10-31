import { useRef } from 'react';
import { useHeroIntro } from '../hooks/useHeroIntro.js';
import Button from '../components/Button.jsx';

export default function NotFound() {
  const page = useRef(null);
  useHeroIntro(page);
  return (
    <main id="main" ref={page} className="cta" style={{ minHeight: '100svh' }}>
      <title>Page not found — Moti Restro Jaypee Greens</title>
      <div className="cta__inner">
        <p className="label" data-hero-item>404</p>
        <h1 className="display cta__title" data-hero-title>This door<br /><em>is closed</em></h1>
        <div className="cta__btns" data-hero-item>
          <Button href="/">Back to Moti Restro</Button>
          <Button href="/menu" variant="outline">See the menu</Button>
        </div>
      </div>
    </main>
  );
}
