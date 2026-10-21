import { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon.jsx';

/**
 * The menu as a leather-bound book (StPageFlip). The engine owns the page DOM,
 * so pages are generated as HTML and handed over once the panel is first shown.
 */
export default function MenuBook({ visible, apiRef, onChapter }) {
  const section = useRef(null);
  const onChapterRef = useRef(onChapter);
  onChapterRef.current = onChapter;
  const [started, setStarted] = useState(visible);

  useEffect(() => { if (visible) setStarted(true); }, [visible]);

  useEffect(() => {
    if (!started) return undefined;
    let api = null;
    let cancelled = false;
    // The page-flip engine is only downloaded once the book is actually shown.
    import('../../lib/menuBook.js').then(({ buildBook, createBook }) => {
      if (cancelled) return;
      const { html, meta, chapters } = buildBook();
      section.current.querySelector('[data-book]').innerHTML = html;
      api = createBook(section.current, meta, chapters, { onChapter: (id) => onChapterRef.current?.(id) });
      apiRef.current = api;
    });
    return () => {
      cancelled = true;
      api?.destroy();
      apiRef.current = null;
    };
  }, [started, apiRef]);

  return (
    <section className="book-section" id="book" aria-label="Menu book" ref={section} hidden={!visible}>
      <div className="book-stage">
        <div className="book-host" data-book-host data-cursor>
          <div className="book-shift" data-book-shift>
            <span className="book-ground" aria-hidden="true" />
            <div className="book" data-book />
          </div>
        </div>
        <div className="book-ui">
          <button className="book-btn" type="button" data-book-prev aria-label="Previous page"><Icon name="arrow-l" /></button>
          <div className="book-status" aria-live="polite">
            <span className="label" data-book-chapter>Cover</span>
            <span className="book-status__name" data-book-label>The Menu</span>
            <span className="book-status__count" data-book-count />
          </div>
          <button className="book-btn" type="button" data-book-next aria-label="Next page"><Icon name="arrow" /></button>
        </div>
        <div className="book-progress" aria-hidden="true"><i data-book-progress /></div>
        <p className="book-hint">
          <span className="hint-fine">Drag a page corner, click the arrows, or use your ← → keys</span>
          <span className="hint-touch">Swipe the page or tap the arrows to turn</span>
        </p>
      </div>
    </section>
  );
}
