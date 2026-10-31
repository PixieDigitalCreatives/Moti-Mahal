import { useLayoutEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { scrollToEl } from '../lib/smooth.js';
import { useHeroIntro } from '../hooks/useHeroIntro.js';
import { usePageReveals } from '../hooks/usePageReveals.js';
import { categories } from '../data/menu.js';
import { PHONE_DISPLAY, PHONE_TEL } from '../data/site.js';
import PageHero from '../components/PageHero.jsx';
import Button from '../components/Button.jsx';
import Footer from '../components/Footer.jsx';
import MenuNav from '../components/menu/MenuNav.jsx';
import MenuBook from '../components/menu/MenuBook.jsx';
import MenuList from '../components/menu/MenuList.jsx';

export default function Menu() {
  const page = useRef(null);
  const bookPanel = useRef(null);
  const listPanel = useRef(null);
  const bookApi = useRef(null);
  const [params, setParams] = useSearchParams();
  // The book is the default view; ?view=list opens the classic list.
  const view = params.get('view') === 'list' ? 'list' : 'book';
  const viewRef = useRef(view);
  viewRef.current = view;
  const [active, setActive] = useState(categories[0].id);
  const switched = useRef(false);

  useHeroIntro(page);
  usePageReveals(page);

  const panelEl = (v) => (v === 'book' ? bookPanel.current : listPanel.current)?.firstElementChild ?? null;

  const switchView = (next) => {
    if (next === view) return;
    if (view === 'book') bookApi.current?.suspend();
    gsap.to(panelEl(view), {
      autoAlpha: 0, y: 24, duration: 0.35, ease: 'power2.in',
      onComplete: () => {
        gsap.set(panelEl(view), { clearProps: 'opacity,visibility,transform' });
        switched.current = true;
        setParams(next === 'list' ? { view: 'list' } : {}, { replace: true, preventScrollReset: true });
      },
    });
  };

  // After a switch: restore the book, re-measure triggers and bring the new panel in.
  useLayoutEffect(() => {
    if (!switched.current) return;
    switched.current = false;
    if (view === 'book') bookApi.current?.refresh();
    ScrollTrigger.refresh();
    const el = panelEl(view);
    scrollToEl(view === 'book' ? el.querySelector('[data-book-host]') : el, true, view === 'book' ? -170 : -100);
    gsap.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'restro', clearProps: 'transform' });
  }, [view]);

  const goToCategory = (id) => {
    setActive(id);
    if (view === 'book') {
      scrollToEl(panelEl('book').querySelector('[data-book-host]'), false, -170);
      bookApi.current?.goToChapter(id);
    } else {
      scrollToEl(document.getElementById(id));
    }
  };

  return (
    <div ref={page}>
      <title>Menu — Moti Restro Jaypee Greens | Tandoori, Curries, Biryani</title>
      <meta name="description" content="The Moti Restro menu: tandoori chicken, butter chicken, dal makhani, mutton rogan josh, dum biryani, breads and desserts. Jaypee Greens, Greater Noida." />
      <main id="main">
        <PageHero image="/images/spices.webp" alt="Whole and ground spices on a dark table" crumb="Menu" title={<>The <em>Menu</em></>} minHeight="72svh">
          <p className="lead">Recipes guarded for generations — fired in clay, finished with butter, and served the way they were meant to be.</p>
          <div className="menu-note__legend">
            <span><i className="diet diet--veg" aria-hidden="true" /> Vegetarian</span>
            <span><i className="diet diet--nonveg" aria-hidden="true" /> Non-vegetarian</span>
          </div>
        </PageHero>

        <MenuNav active={active} view={view} onCategory={goToCategory} onView={switchView} />

        <div ref={bookPanel}>
          <MenuBook visible={view === 'book'} apiRef={bookApi} onChapter={(id) => id && viewRef.current === 'book' && setActive(id)} />
        </div>
        <div ref={listPanel}>
          <MenuList visible={view === 'list'} onActive={(id) => viewRef.current === 'list' && setActive(id)} />
        </div>

        <div className="container menu-note">
          <p>Please let our team know about allergies or dietary needs. Menu and prices are subject to change.</p>
          <div className="menu-note__legend">
            <span><i className="diet diet--veg" aria-hidden="true" /> Veg</span>
            <span><i className="diet diet--nonveg" aria-hidden="true" /> Non-veg</span>
          </div>
        </div>

        <section className="cta" style={{ minHeight: '76svh' }}>
          <div className="cta__media" data-parallax="18"><img src="/images/naan-slate.webp" alt="" loading="lazy" /></div>
          <div className="cta__inner">
            <p className="label" data-fade>Takeaway &amp; home delivery</p>
            <h2 className="display cta__title" data-split>Hungry<br /><em>at home?</em></h2>
            <p className="lead" data-fade>Call us to order — packed hot, straight from the tandoor.</p>
            <div className="cta__btns" data-fade>
              <Button href={PHONE_TEL}>Call {PHONE_DISPLAY}</Button>
              <Button href="/visit#reserve" variant="outline">Reserve a Table</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
