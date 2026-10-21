import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap.js';
import { categories } from '../../data/menu.js';

/** One chapter of the classic list: sticky arch image that swaps as you hover dishes. */
function Category({ c, index }) {
  const [shown, setShown] = useState(c.image);
  const [loaded, setLoaded] = useState([c.image]);
  const show = (src) => {
    if (!src) return;
    setLoaded((l) => (l.includes(src) ? l : [...l, src]));
    setShown(src);
  };

  return (
    <section className="menu-cat container" id={c.id} data-cat={c.id} aria-labelledby={`${c.id}-title`}>
      <div className="menu-cat__aside">
        <div className="menu-cat__visual arch-frame">
          <div className="arch">
            {loaded.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" decoding="async" className={src === shown ? undefined : 'is-hidden'} />
            ))}
          </div>
        </div>
        <div>
          <p className="label menu-cat__count">{String(index + 1).padStart(2, '0')} · {c.items.length} dishes</p>
          <h2 className="h2" id={`${c.id}-title`} data-list-reveal>{c.title}</h2>
          <p className="muted" style={{ marginTop: 18, maxWidth: '40ch' }} data-list-reveal>{c.blurb}</p>
        </div>
      </div>
      <ul className="menu-list" onPointerLeave={() => setShown(c.image)}>
        {c.items.map((it) => (
          <li className="menu-item" data-list-reveal key={it.name} onPointerEnter={() => show(it.image)}>
            <span className={`diet diet--${it.diet}`} role="img" aria-label={it.diet === 'veg' ? 'Vegetarian' : 'Non-vegetarian'} />
            <div className="menu-item__row">
              <h3 className="menu-item__name">{it.name}</h3>
              <span className="menu-item__lead" aria-hidden="true" />
              <span className="price menu-item__price">{it.price}</span>
            </div>
            <p className="menu-item__desc">{it.desc}</p>
            {it.tag && <span className="menu-item__tag">{it.tag}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function MenuList({ visible, onActive }) {
  const root = useRef(null);
  const bound = useRef(false);
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  // Reveals and the scroll-spy are bound the first time the list is shown, so nothing is measured while hidden.
  useGSAP(() => {
    if (!visible || bound.current) return;
    bound.current = true;
    ScrollTrigger.batch(root.current.querySelectorAll('[data-list-reveal]'), {
      start: 'top 92%',
      once: true,
      onEnter: (els) => gsap.from(els, { y: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06 }),
    });
    root.current.querySelectorAll('[data-cat]').forEach((section) => {
      ScrollTrigger.create({
        trigger: section, start: 'top 45%', end: 'bottom 45%',
        onToggle: (self) => self.isActive && onActiveRef.current?.(section.dataset.cat),
      });
    });
  }, { scope: root, dependencies: [visible] });

  return (
    <div ref={root} hidden={!visible}>
      {categories.map((c, i) => <Category c={c} index={i} key={c.id} />)}
    </div>
  );
}
