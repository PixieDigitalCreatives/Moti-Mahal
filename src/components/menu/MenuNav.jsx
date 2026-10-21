import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap.js';
import { categories } from '../../data/menu.js';

/** Sticky category bar with a sliding gold pill, plus the Book / List view switch. */
export default function MenuNav({ active, view, onCategory, onView }) {
  const listRef = useRef(null);
  const pillRef = useRef(null);
  const toggleRef = useRef(null);
  const thumbRef = useRef(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    const link = listRef.current.querySelector(`[data-cat-link="${active}"]`);
    if (!link) return;
    gsap.to(pillRef.current, {
      x: link.offsetLeft, y: link.offsetTop, width: link.offsetWidth, height: link.offsetHeight,
      duration: first.current ? 0 : 0.6, ease: 'mahal',
    });
    listRef.current.scrollTo({ left: link.offsetLeft - 40, behavior: first.current ? 'auto' : 'smooth' });
  }, [active]);

  useLayoutEffect(() => {
    const btn = toggleRef.current.querySelector(`[data-view="${view}"]`);
    gsap.to(thumbRef.current, { x: btn.offsetLeft - 4, width: btn.offsetWidth, duration: first.current ? 0 : 0.6, ease: 'mahal' });
    first.current = false;
  }, [view]);

  return (
    <nav className="menu-nav" aria-label="Menu categories">
      <div className="menu-nav__bar">
        <div className="menu-nav__list" ref={listRef}>
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              data-cat-link={c.id}
              className={c.id === active ? 'is-active' : undefined}
              onClick={(e) => { e.preventDefault(); onCategory(c.id); }}
            >
              {c.title}
            </a>
          ))}
          <span className="menu-nav__pill" ref={pillRef} aria-hidden="true" />
        </div>
        <div className="view-toggle" role="group" aria-label="Menu view" ref={toggleRef}>
          <button type="button" data-view="book" aria-pressed={view === 'book'} onClick={() => onView('book')}>
            <svg viewBox="0 0 20 16" aria-hidden="true"><path d="M10 3.2C8.2 1.8 5.4 1.2 1.5 1.4v12.2c3.9-.2 6.7.4 8.5 1.8 1.8-1.4 4.6-2 8.5-1.8V1.4c-3.9-.2-6.7.4-8.5 1.8zM10 3.2v12.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
            <span>Book</span>
          </button>
          <button type="button" data-view="list" aria-pressed={view === 'list'} onClick={() => onView('list')}>
            <svg viewBox="0 0 20 16" aria-hidden="true"><path d="M6 3h12M6 8h12M6 13h12M2 3h.01M2 8h.01M2 13h.01" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <span>List</span>
          </button>
          <span className="view-toggle__thumb" ref={thumbRef} aria-hidden="true" />
        </div>
      </div>
    </nav>
  );
}
