import { useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { useHeroIntro } from '../hooks/useHeroIntro.js';
import { usePageReveals } from '../hooks/usePageReveals.js';
import PageHero from '../components/PageHero.jsx';
import Button from '../components/Button.jsx';
import Footer from '../components/Footer.jsx';

const CHAPTERS = [
  {
    year: '1947',
    img: 'arches-agra', alt: 'Cusped Mughal arches in sunlight',
    label: 'Chapter one · The first fire',
    title: 'A tandoor in Old Delhi',
    text: 'The Moti Restro story began in 1947 in Daryaganj, Old Delhi, around a clay tandoor that would change how India ate. Chicken marinated in yoghurt and spice met the searing heat of charcoal — and tandoori cooking found its home at the restaurant table.',
  },
  {
    year: 'Craft',
    img: 'butter-chicken-smoke', alt: 'Smoky butter chicken in a metal bowl',
    label: 'Chapter two · The classics',
    title: 'Butter, tomato and patience',
    text: 'From that fire came the dishes the Moti Restro name is known for: butter chicken, rich with tomato and white butter, and dal makhani, black lentils left to simmer through the night. We still cook them the long way — there is no shortcut to that depth.',
  },
  {
    year: 'Today',
    img: 'warm-interior', alt: 'Warm, wood-panelled dining room with set tables',
    label: 'Chapter three · Jaypee Greens',
    title: 'A new home, the same fire',
    text: 'In Sun Twilight, at the heart of Jaypee Greens, our kitchen carries those recipes forward for a new neighbourhood — the same marinades, the same hand-ground masalas, the same charcoal. Pull up a chair; you are family here.',
  },
];

const RIBBON = [
  ['copper-handis', 'Copper handis of curry'],
  ['flames', 'Flames rising from a pan'],
  ['thali-spread', 'A thali of breads, curries and rice'],
  ['arch-ornate', 'An ornate carved doorway'],
  ['tandoori-dark', 'Tandoori chicken with greens'],
  ['royal-ambience', 'A rose on a marble table in a gilded room'],
];

export default function Story() {
  const page = useRef(null);
  const [chapter, setChapter] = useState(0);
  useHeroIntro(page);
  usePageReveals(page, (root) => {
    // The outlined title on the left swaps as each chapter crosses the middle of the screen.
    root.querySelectorAll('[data-chapter]').forEach((ch, i) => {
      ScrollTrigger.create({ trigger: ch, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && setChapter(i) });
      gsap.fromTo(ch.querySelector('img'), { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // A strip of images that slides sideways as you scroll past it.
    const strip = root.querySelector('[data-ribbon]');
    gsap.fromTo(strip, { x: () => innerWidth * 0.1 }, {
      x: () => -(strip.scrollWidth - innerWidth * 0.9), ease: 'none',
      scrollTrigger: { trigger: strip.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
    });
  });

  return (
    <div ref={page}>
      <title>Our Story — Moti Restro Jaypee Greens | A Legacy Written in Fire</title>
      <meta name="description" content="The Moti Restro legacy of the clay tandoor, butter chicken and dal makhani — now in Jaypee Greens, Greater Noida." />
      <main id="main">
        <PageHero image="/images/arch-corridor.webp" alt="Ornate Mughal archway leading through a dark hall" crumb="Our Story" title={<>A legacy<br /><em>written in fire</em></>}>
          <p className="lead">Some kitchens follow trends. Ours follows a flame that has burned since 1947.</p>
        </PageHero>

        <section className="section container">
          <p className="intro-big" data-scrub-words>
            Before there was a menu, there was a clay oven, a bed of glowing charcoal and a cook who believed that patience was the most important spice. Everything we serve still begins there.
          </p>
        </section>

        <section className="container chapters" style={{ paddingBottom: 'var(--section-y)' }}>
          <div className="chapters__sticky" aria-hidden="true">
            <p className="label">The Moti Restro story</p>
            <div className="chapters__years">
              {CHAPTERS.map((c, i) => (
                <span className={`chapters__year${i === chapter ? ' is-active' : ''}`} key={c.year}>{c.year}</span>
              ))}
            </div>
            <div className="chapters__dots">
              {CHAPTERS.map((c, i) => <i className={i === chapter ? 'is-active' : undefined} key={c.year} />)}
            </div>
          </div>
          <div>
            {CHAPTERS.map((c) => (
              <article className="chapter" data-chapter key={c.year}>
                <div className="chapter__img"><img src={`/images/${c.img}.webp`} alt={c.alt} loading="lazy" /></div>
                <p className="label">{c.label}</p>
                <h2 className="h3">{c.title}</h2>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section bg-900">
          <div className="container">
            <div className="sec-head">
              <h2 className="h2" data-split>The craft,<br /><em>in numbers</em></h2>
              <p className="lead muted" data-fade>Four things we refuse to compromise on, no matter how busy the evening.</p>
            </div>
            <div className="craft" data-stagger>
              <div className="craft__item"><span className="craft__num"><span data-count="480">480</span>°</span><p className="label">Tandoor heat</p><p>Charcoal-fired clay ovens, hot enough to char and seal in seconds.</p></div>
              <div className="craft__item"><span className="craft__num">Overnight</span><p className="label">Dal makhani</p><p>Black lentils simmered on low coals until they turn to velvet.</p></div>
              <div className="craft__item"><span className="craft__num">Daily</span><p className="label">Hand-ground</p><p>Masalas roasted and ground in our kitchen every morning.</p></div>
              <div className="craft__item"><span className="craft__num" data-count="1947">1947</span><p className="label">The legacy</p><p>The year the Moti Restro tandoor story began in Old Delhi.</p></div>
            </div>
          </div>
        </section>

        <section className="section" style={{ overflow: 'hidden' }}>
          <div className="container sec-head">
            <h2 className="h2" data-split>Inside<br /><em>Moti Restro</em></h2>
            <Button href="/gallery" variant="link">Open the gallery</Button>
          </div>
          <div className="ribbon" data-ribbon>
            {RIBBON.map(([img, alt]) => (
              <figure key={img}><img src={`/images/${img}.webp`} alt={alt} loading="lazy" /></figure>
            ))}
          </div>
        </section>

        <section className="cta">
          <div className="cta__media" data-parallax="18"><img src="/images/family-feast.webp" alt="" loading="lazy" /></div>
          <div className="cta__inner">
            <span className="orn" style={{ color: 'var(--gold)' }} data-fade><i /></span>
            <h2 className="display cta__title" data-split>Taste<br /><em>the legacy</em></h2>
            <div className="cta__btns" data-fade>
              <Button href="/visit#reserve">Reserve a Table</Button>
              <Button href="/menu" variant="outline">Explore the Menu</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
