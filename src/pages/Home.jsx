import { Fragment, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { useHeroIntro } from '../hooks/useHeroIntro.js';
import { usePageReveals } from '../hooks/usePageReveals.js';
import { Icon } from '../components/Icon.jsx';
import Button from '../components/Button.jsx';
import Footer from '../components/Footer.jsx';
import { PHONE_DISPLAY, PHONE_TEL } from '../data/site.js';

const SIGNATURES = [
  { name: 'Butter Chicken', price: '₹380', desc: 'Tandoor-roasted chicken folded into a velvet tomato, butter & fenugreek gravy.', img: 'butter-chicken', alt: 'Butter chicken with cream and fresh herbs', tag: 'House original' },
  { name: 'Dal Makhani', price: '₹280', desc: 'Black lentils slow-cooked on low coals, finished with white butter & cream.', img: 'dal-makhani', alt: 'Dal makhani with a swirl of cream in a black pot', tag: 'Simmered overnight' },
  { name: 'Mutton Rogan Josh', price: '₹450', desc: 'Kashmiri-style lamb braised with fennel, ginger and the warmth of red chilli.', img: 'rogan-josh', alt: 'Mutton rogan josh in a copper handi' },
  { name: 'Chicken Biryani', price: '₹320', desc: 'Long-grain basmati layered with saffron & whole spices, sealed and slow-steamed.', img: 'biryani', alt: 'Chicken biryani in a brass handi', tag: 'Dum-cooked' },
  { name: 'Paneer Tikka Masala', price: '₹310', desc: 'Charred cottage-cheese tikka in a smoky, spiced onion-tomato masala.', img: 'paneer-tikka', alt: 'Paneer tikka sizzling with peppers and onions' },
];

const MARQUEE = [
  { items: ['Butter Chicken', 'Dal Makhani', 'Tandoori Chicken', 'Seekh Kebab'], dir: -1 },
  { items: ['Rogan Josh', 'Dum Biryani', 'Garlic Naan', 'Gulab Jamun'], dir: 1, outline: true },
];

const LEGACY = [
  { img: 'arch-corridor', alt: 'Ornate Mughal archway in a dark hall', label: 'The first fire', note: 'Old Delhi, 1947' },
  { img: 'kitchen-fire', alt: 'A cook working over open flames in a dark kitchen', label: 'The craft', note: 'Charcoal, never gas' },
  { img: 'copper-handis', alt: 'Copper handis of butter chicken and dal on a wooden table', label: 'The table', note: 'Jaypee Greens, today' },
];

export default function Home() {
  const page = useRef(null);
  useHeroIntro(page);
  usePageReveals(page, (root) => {
    heroScroll(root);
    signatures(root);
    archReveal(root);
    marquees(root);
  });

  return (
    <div ref={page}>
      <title>Moti Mahal Jaypee Greens — Tandoori &amp; Mughlai Restaurant, Greater Noida</title>
      <meta name="description" content="Moti Mahal, Jaypee Greens: charcoal tandoor kebabs, butter chicken, dal makhani and dum biryani in Sun Twilight, Sector 27, Greater Noida. Open daily 11 AM – 11 PM." />
      <main id="main">
        {/* HERO */}
        <section className="hero" data-hero>
          <div className="hero__media" data-hero-media>
            <img src="/images/family-feast.webp" alt="Copper handis of curry being served at a festive table" fetchPriority="high" width="2000" height="2000" />
          </div>
          <div className="hero__wash" />
          <div className="hero__content">
            <p className="kicker" data-hero-item><span className="orn"><i /></span>Jaypee Greens · Greater Noida<span className="orn"><i /></span></p>
            <h1 className="display hero__title" data-hero-title>Where the tandoor<br /> became a <em>legend</em></h1>
            <p className="lead hero__lead" data-hero-item>Charcoal-kissed kebabs, curries simmered through the night, and the butter chicken Delhi fell in love with — served in the heart of Jaypee Greens.</p>
            <div className="hero__ctas" data-hero-item>
              <Button href="/visit#reserve">Reserve a Table</Button>
              <Button href="/menu" variant="outline">Explore the Menu</Button>
            </div>
          </div>
          <div className="hero__bar" data-hero-item>
            <span>Open daily · 11 AM – 11 PM</span>
            <span className="scroll-cue">Scroll<i /></span>
            <span>Sun Twilight · Sector 27</span>
          </div>
        </section>

        {/* MANIFESTO: words light up with scroll, image pills open inline */}
        <section className="section manifesto container glow-ambient">
          <Icon name="star" className="manifesto__star" data-spin />
          <p className="manifesto__text" data-scrub-words>
            For generations our kitchen has kept one promise —{' '}
            <span className="pill" data-pill><img src="/images/flames.webp" alt="" loading="lazy" /></span>{' '}
            charcoal, patience and spice, in perfect proportion. Kebabs kissed by the{' '}
            <span className="pill" data-pill><img src="/images/tandoor-skewers.webp" alt="" loading="lazy" /></span>{' '}
            tandoor, dal simmered{' '}
            <span className="pill" data-pill><img src="/images/dal-makhani.webp" alt="" loading="lazy" /></span>{' '}
            through the night, and every plate served like family.
          </p>
          <p className="manifesto__sign" data-fade>— The Moti Mahal Kitchen</p>
        </section>

        {/* SIGNATURES: pinned horizontal scroll */}
        <section className="signatures bg-900" data-hscroll>
          <div className="container signatures__head">
            <h2 className="h2" data-split>Signatures<br /><em>of the house</em></h2>
            <div className="signatures__intro" data-fade>
              <p className="lead muted">The dishes that built our name — slow-cooked, hand-ground and finished exactly the way they were meant to be.</p>
              <Button href="/menu" variant="link">View the full menu</Button>
            </div>
          </div>
          <div className="hscroll" data-hscroll-pin>
            <div className="hscroll__viewport">
              <div className="hscroll__track" data-hscroll-track>
                {SIGNATURES.map((d) => (
                  <article className="dish" data-cursor-label="Taste" key={d.name}>
                    <div className="dish__media arch-frame">
                      <div className="arch"><img src={`/images/${d.img}.webp`} alt={d.alt} loading="lazy" data-hscroll-img /></div>
                      {d.tag && <span className="dish__tag">{d.tag}</span>}
                    </div>
                    <div className="dish__row"><h3 className="dish__name">{d.name}</h3><span className="price dish__price">{d.price}</span></div>
                    <p className="dish__desc">{d.desc}</p>
                  </article>
                ))}
                <article className="dish dish--end">
                  <div>
                    <p className="h3">Fifty more reasons<br /><em>to stay a while</em></p>
                    <Button href="/menu">Open the Menu</Button>
                  </div>
                </article>
              </div>
            </div>
            <div className="container hscroll__progress" aria-hidden="true">
              <span className="label">Scroll to explore</span>
              <span className="hscroll__bar"><i data-hscroll-bar /></span>
              <span className="label" data-hscroll-count>01 — 06</span>
            </div>
          </div>
        </section>

        {/* EXPERIENCE BENTO */}
        <section className="section container">
          <div className="bento-head">
            <h2 className="h2" data-split>More than a meal —<br /><em>an evening at the Mahal</em></h2>
          </div>
          <div className="bento" data-stagger>
            <article className="bento__card bento__card--xl" data-cursor-label="Fire">
              <img src="/images/tandoor-skewers.webp" alt="Skewers of kebabs roasting over the tandoor" loading="lazy" />
              <p className="label">From noon till close</p>
              <h3>Live Tandoor</h3>
              <p>Clay ovens fired with charcoal — kebabs, tikkas and breads, straight off the skewer and onto your table.</p>
            </article>
            <article className="bento__card bento__card--wide">
              <img src="/images/biryani-plate.webp" alt="Plated biryani with mint and onions" loading="lazy" />
              <p className="label">Sealed &amp; slow-cooked</p>
              <h3>Dum Biryani</h3>
              <p>Saffron basmati layered with spice and steam, opened at the table.</p>
            </article>
            <article className="bento__card">
              <img src="/images/rogan-josh.webp" alt="Rich mutton curry" loading="lazy" />
              <p className="label">Time-honoured</p>
              <h3>Mughlai Classics</h3>
            </article>
            <article className="bento__card bento__card--gold">
              <Icon name="star" className="star" />
              <p className="label">Takeaway &amp; delivery</p>
              <h3>Delivered hot</h3>
              <a href={PHONE_TEL}>Call {PHONE_DISPLAY}</a>
            </article>
          </div>
        </section>

        {/* ARCH REVEAL: the arch window grows to fill the screen */}
        <section className="arch-reveal" data-arch-reveal>
          <div className="arch-reveal__stage">
            <h2 className="arch-reveal__word arch-reveal__word--l" data-ar-left>Step into</h2>
            <div className="arch-reveal__window" data-ar-window>
              <div className="arch"><img src="/images/dining-room.webp" alt="Elegant dining room laid for service" loading="lazy" data-ar-img /></div>
              <div className="arch-reveal__pearls" data-ar-pearls />
            </div>
            <h2 className="arch-reveal__word arch-reveal__word--r" data-ar-right>the Mahal</h2>
            <p className="arch-reveal__cap" data-ar-cap>Warm brass, soft light and tables made for long conversations — family dinners, celebrations and everything in between.</p>
            <div className="arch-reveal__end" data-ar-end>
              <p className="label">Family dinners · Celebrations · Corporate lunches</p>
              <p className="h2">Tables made for <em>long conversations</em></p>
              <Button href="/visit#reserve">Book your evening</Button>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="marquee" aria-label="House favourites">
          {MARQUEE.map((row) => (
            <div className={`marquee__row${row.outline ? ' marquee__row--outline' : ''}`} data-marquee={row.dir} key={row.items[0]}>
              {[0, 1, 2].map((copy) => (
                <div className="marquee__group" aria-hidden={copy > 0 || undefined} key={copy}>
                  {row.items.map((item) => (
                    <Fragment key={item}>
                      <span className="marquee__item">{item}</span>
                      <svg className="marquee__star" viewBox="0 0 28 28" aria-hidden="true"><use href="#i-star" /></svg>
                    </Fragment>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </section>

        {/* LEGACY */}
        <section className="section container legacy">
          <div className="legacy__text">
            <p className="label">Our story</p>
            <h2 className="h2" data-split>A legacy written<br /><em>in fire</em></h2>
            <p className="lead muted" data-fade>The Moti Mahal name has stood for the clay tandoor since 1947, when a kitchen in Old Delhi’s Daryaganj changed the way India ate. Our Jaypee Greens home carries those recipes forward — the same marinades, the same patience, the same fire.</p>
            <Button href="/story" variant="outline" data-fade>Read our story</Button>
          </div>
          <div className="legacy__media">
            {LEGACY.map((f) => (
              <figure className="legacy__fig" data-scale-fade key={f.img}>
                <div className="frame"><img src={`/images/${f.img}.webp`} alt={f.alt} loading="lazy" data-parallax-img /></div>
                <figcaption><span className="label">{f.label}</span><span>{f.note}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="cta__media" data-parallax="18"><img src="/images/royal-ambience.webp" alt="" loading="lazy" /></div>
          <div className="cta__inner">
            <span className="orn" style={{ color: 'var(--gold)' }} data-fade><i /></span>
            <h2 className="display cta__title" data-split>Your table<br /><em>awaits</em></h2>
            <p className="lead" data-fade>Lunch, dinner or a celebration — reserve in under a minute, or simply call us.</p>
            <div className="cta__btns" data-fade>
              <Button href="/visit#reserve">Reserve a Table</Button>
              <Button href={PHONE_TEL} variant="outline">Call {PHONE_DISPLAY}</Button>
            </div>
            <div className="cta__facts" data-stagger>
              <div><p className="label">Find us</p><p>Sun Twilight, Sector 27, Jaypee Greens</p></div>
              <div><p className="label">Hours</p><p>Every day · 11 AM – 11 PM</p></div>
              <div><p className="label">By metro</p><p>Near Delta 1 Station</p></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* ---------- page animations (run inside the route's GSAP context) ---------- */

function heroScroll(root) {
  const hero = root.querySelector('[data-hero]');
  gsap.to(hero.querySelector('[data-hero-media] img'), { yPercent: 10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to(hero.querySelector('.hero__content'), { yPercent: -18, autoAlpha: 0.15, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
}

function signatures(root) {
  const section = root.querySelector('[data-hscroll]');
  const pin = section.querySelector('[data-hscroll-pin]');
  const track = section.querySelector('[data-hscroll-track]');
  const bar = section.querySelector('[data-hscroll-bar]');
  const counter = section.querySelector('[data-hscroll-count]');
  const cards = gsap.utils.toArray(track.children);
  const total = String(cards.length).padStart(2, '0');

  // Pinned on every screen size: a vertical scroll (wheel, trackpad or touch) moves the dishes sideways.
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    pin.classList.add('is-pinned');
    const distance = () => Math.max(0, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'center center',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          gsap.set(bar, { scaleX: 0.05 + self.progress * 0.95 });
          const i = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
          counter.textContent = `${String(i).padStart(2, '0')} — ${total}`;
        },
      },
    });

    // Inside the moving track: images drift against the motion, cards rise as they enter.
    section.querySelectorAll('[data-hscroll-img]').forEach((img) => {
      gsap.fromTo(img, { xPercent: -7 }, {
        xPercent: 7, ease: 'none',
        scrollTrigger: { trigger: img.closest('.dish'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      });
    });
    cards.forEach((card) => {
      gsap.from(card, {
        y: 80, rotate: 2.5, autoAlpha: 0.4, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 105%', end: 'left 60%', scrub: true },
      });
    });

    return () => pin.classList.remove('is-pinned');
  });
}

function archReveal(root) {
  const sec = root.querySelector('[data-arch-reveal]');
  const win = sec.querySelector('[data-ar-window]');
  const img = sec.querySelector('[data-ar-img]');
  const end = sec.querySelector('[data-ar-end]');

  // Scale needed for the arch window to swallow the viewport (origin at 50% / 80%).
  const coverScale = () => {
    const w = win.offsetWidth;
    const h = win.offsetHeight;
    const originY = (innerHeight - h) / 2 + h * 0.8;
    const s1 = innerWidth / w;
    const s2 = originY / Math.max(1, h * 0.8 - w * 0.5);
    const s3 = (innerHeight - originY) / (h * 0.2);
    return Math.max(s1, s2, s3) * 1.08;
  };

  gsap.set(win, { transformOrigin: '50% 80%' });
  gsap.timeline({
    scrollTrigger: { trigger: sec, start: 'top top', end: '+=190%', pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
  })
    .from(win, { scale: 0.72, duration: 0.25, ease: 'power1.out' }, 0)
    .to(win, { scale: () => coverScale(), duration: 1, ease: 'power2.in' }, 0.25)
    .to(img, { scale: 1, duration: 1.25, ease: 'none' }, 0)
    .to(sec.querySelector('[data-ar-left]'), { xPercent: -70, autoAlpha: 0, duration: 0.6, ease: 'power1.in' }, 0.3)
    .to(sec.querySelector('[data-ar-right]'), { xPercent: 70, autoAlpha: 0, duration: 0.6, ease: 'power1.in' }, 0.3)
    .to(sec.querySelector('[data-ar-cap]'), { autoAlpha: 0, y: 40, duration: 0.3 }, 0.25)
    .to(sec.querySelector('[data-ar-pearls]'), { autoAlpha: 0, duration: 0.3 }, 0.5)
    .to(end, { autoAlpha: 1, duration: 0.25 }, 1.05)
    .from(end.children, { y: 50, autoAlpha: 0, stagger: 0.06, duration: 0.3 }, 1.08)
    .set(end, { pointerEvents: 'auto' }, 1.2)
    .to({}, { duration: 0.25 });
}

// Infinite rows that speed up with scroll velocity and follow the scroll direction.
function marquees(root) {
  root.querySelectorAll('[data-marquee]').forEach((row) => {
    const w = row.querySelector('.marquee__group').offsetWidth;
    const dir = Number(row.dataset.marquee) || -1;
    const loop = gsap.fromTo(row, { x: dir < 0 ? 0 : -w }, { x: dir < 0 ? -w : 0, duration: w / 70, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      trigger: row, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        const sign = self.direction;
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 5);
        gsap.to(loop, {
          timeScale: sign * boost, duration: 0.25, overwrite: true,
          onComplete: () => gsap.to(loop, { timeScale: sign, duration: 1.4, ease: 'power2.out' }),
        });
      },
    });
  });
}
