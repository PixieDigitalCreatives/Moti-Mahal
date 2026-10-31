import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, Flip, ScrollTrigger } from '../lib/gsap.js';
import { startScroll, stopScroll } from '../lib/smooth.js';
import { useHeroIntro } from '../hooks/useHeroIntro.js';
import { usePageReveals } from '../hooks/usePageReveals.js';
import { Icon } from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import Button from '../components/Button.jsx';
import Footer from '../components/Footer.jsx';

const PHOTOS = [
  { img: 'butter-chicken-smoke', title: 'Butter chicken', tags: ['food'], size: 'wide', alt: 'Smoky butter chicken' },
  { img: 'flames', title: 'The flame', tags: ['fire'], size: 'tall', alt: 'Tall flames in the kitchen' },
  { img: 'dining-room', title: 'The dining room', tags: ['ambience'], size: 'tall', alt: 'Dining room laid for service' },
  { img: 'thali-spread', title: 'The thali', tags: ['food'], size: 'sq', alt: 'Thali spread' },
  { img: 'tandoor-skewers', title: 'Off the skewer', tags: ['fire', 'food'], size: 'tall', alt: 'Kebabs on skewers over the tandoor' },
  { img: 'royal-ambience', title: 'Evening light', tags: ['ambience'], size: 'wide', alt: 'A rose on a marble table in a gilded room' },
  { img: 'dal-makhani', title: 'Dal makhani', tags: ['food'], size: 'sq', alt: 'Dal makhani in a black pot' },
  { img: 'kitchen-fire', title: 'Into the night', tags: ['fire'], size: 'sq', alt: 'Cooking over flames in the dark' },
  { img: 'biryani-plate', title: 'Biryani', tags: ['food'], size: 'tall', alt: 'Plated biryani' },
  { img: 'warm-interior', title: 'Set for dinner', tags: ['ambience'], size: 'sq', alt: 'Warm wood-panelled interior' },
  { img: 'spices', title: 'The spice box', tags: ['food'], size: 'wide', alt: 'Spices spread on a table' },
  { img: 'naan-slate', title: 'Fresh from the tandoor', tags: ['food', 'fire'], size: 'sq', alt: 'Naan on slate' },
  { img: 'arches-agra', title: 'Arches', tags: ['ambience'], size: 'sq', alt: 'Mughal arches' },
  { img: 'gulab-jamun', title: 'Gulab jamun', tags: ['food'], size: 'sq', alt: 'Gulab jamun in a kadhai' },
  { img: 'seekh-kebab', title: 'Seekh kebab', tags: ['fire', 'food'], size: 'sq', alt: 'Seekh kebabs on a charcoal grill' },
  { img: 'marble-arches', title: 'Marble and light', tags: ['ambience'], size: 'wide', alt: 'White marble arches' },
];

const FILTERS = [['all', 'All'], ['food', 'Food'], ['fire', 'Fire'], ['ambience', 'Ambience']];

const MOODS = [
  ['flames', 'Fire', 'The tandoor roars from noon; every kebab carries its smoke.'],
  ['spices', 'Spice', 'Whole spices roasted and ground by hand each morning.'],
  ['family-feast', 'Feast', 'Handis passed across the table, plates refilled, stories shared.'],
  ['royal-ambience', 'Night', 'Soft gold light, slow conversation, one more round of naan.'],
];

const label = (tag) => tag.charAt(0).toUpperCase() + tag.slice(1);

export default function Gallery() {
  const page = useRef(null);
  const grid = useRef(null);
  const flipState = useRef(null);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null); // index into the visible list

  useHeroIntro(page);
  usePageReveals(page, (root) => {
    root.querySelectorAll('.masonry__item img').forEach((img, i) => {
      const amt = [6, 10, 4][i % 3];
      gsap.fromTo(img, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });

  const visible = PHOTOS.filter((p) => filter === 'all' || p.tags.includes(filter));

  const changeFilter = (f) => {
    if (f === filter) return;
    flipState.current = Flip.getState(grid.current.children);
    setFilter(f);
  };

  // Animate the grid from its previous layout once React has applied the new filter.
  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.9, ease: 'restro', absolute: true, scale: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.7 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.5 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
    flipState.current = null;
  }, [filter]);

  return (
    <div ref={page}>
      <title>Gallery — Moti Restro Jaypee Greens</title>
      <meta name="description" content="Food, fire and evenings at Moti Restro, Jaypee Greens — a gallery of tandoori classics, curries and our dining room." />
      <main id="main">
        <PageHero image="/images/thali-spread.webp" alt="A thali spread of curries, breads and rice on black stone" crumb="Gallery" title={<>Moments<br /><em>from Moti Restro</em></>} minHeight="78svh" />

        <section className="section container" style={{ paddingTop: 'clamp(60px, 7vw, 100px)' }}>
          <div className="filters" role="group" aria-label="Filter photos">
            {FILTERS.map(([id, text]) => (
              <button type="button" key={id} aria-pressed={filter === id} onClick={() => changeFilter(id)}>{text}</button>
            ))}
          </div>
          <div className="masonry" ref={grid}>
            {PHOTOS.map((p) => {
              const shown = visible.includes(p);
              return (
                <figure
                  key={p.img}
                  className={`masonry__item masonry__item--${p.size}${shown ? '' : ' is-out'}`}
                  data-flip-id={p.img}
                  tabIndex={shown ? 0 : -1}
                  role="button"
                  aria-label={`View ${p.title}`}
                  data-cursor-label="View"
                  onClick={() => setOpen(visible.indexOf(p))}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(visible.indexOf(p)); } }}
                >
                  <img src={`/images/${p.img}.webp`} alt={p.alt} loading="lazy" />
                  <figcaption><span>{p.title}</span><span className="label">{label(p.tags[0])}</span></figcaption>
                </figure>
              );
            })}
          </div>
        </section>

        <section className="section bg-900">
          <div className="container">
            <div className="sec-head">
              <h2 className="h2" data-split>Four moods<br /><em>of an evening</em></h2>
              <p className="lead muted" data-fade>Hover to step into each one.</p>
            </div>
            <div className="moods" data-stagger>
              {MOODS.map(([img, title, text], i) => (
                <div className="mood" tabIndex={0} key={title}>
                  <img src={`/images/${img}.webp`} alt="" loading="lazy" />
                  <div>
                    <p className="label">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="mood__title">{title}</h3>
                    <p className="mood__text">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section container" style={{ textAlign: 'center' }}>
          <p className="label" data-fade>Share your evening</p>
          <h2 className="h2" style={{ margin: '22px 0 34px' }} data-split>Tag us in<br /><em>your moments</em></h2>
          <Button href="#" variant="outline" data-fade>Follow on Instagram</Button>
        </section>
      </main>
      <Footer />
      {open !== null && <Lightbox photos={visible} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Lightbox({ photos, index, onIndex, onClose }) {
  const box = useRef(null);
  const img = useRef(null);
  const photo = photos[index];

  const close = useCallback(() => {
    gsap.to(box.current, { autoAlpha: 0, duration: 0.35, onComplete: onClose });
  }, [onClose]);
  const step = useCallback((d) => {
    gsap.to(img.current, {
      autoAlpha: 0, x: -30 * d, duration: 0.25,
      onComplete: () => onIndex((index + d + photos.length) % photos.length),
    });
  }, [index, photos.length, onIndex]);

  useLayoutEffect(() => {
    stopScroll();
    gsap.fromTo(box.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
    box.current.querySelector('.lightbox__close').focus();
    return () => startScroll();
  }, []);

  useLayoutEffect(() => {
    gsap.fromTo(img.current, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, x: 0, duration: 0.6 });
  }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close, step]);

  return (
    <div className="lightbox" ref={box} role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={(e) => e.target === box.current && close()}>
      <button className="lightbox__close" type="button" onClick={close}>Close</button>
      <button className="lightbox__btn lightbox__btn--prev" type="button" aria-label="Previous photo" onClick={() => step(-1)}><Icon name="arrow-l" /></button>
      <figure className="lightbox__fig">
        <img ref={img} src={`/images/${photo.img}.webp`} alt={photo.alt} />
        <figcaption className="lightbox__cap">
          <span className="h3">{photo.title}</span>
          <span className="label">{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
        </figcaption>
      </figure>
      <button className="lightbox__btn lightbox__btn--next" type="button" aria-label="Next photo" onClick={() => step(1)}><Icon name="arrow" /></button>
    </div>
  );
}
