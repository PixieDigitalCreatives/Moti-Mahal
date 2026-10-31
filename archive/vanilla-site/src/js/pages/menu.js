import { gsap, ScrollTrigger } from '../core/gsap.js';
import { scrollToEl } from '../core/smooth.js';
import { categories } from '../data/menu.js';
import { buildBook, createBook } from './menu-book.js';

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// The book is the default view; ?view=list opens the classic list.
let view = new URLSearchParams(location.search).get('view') === 'list' ? 'list' : 'book';
let book = null;
let bookData = null;
let listReady = false;
let panels = {};

export function setup() {
  const root = document.querySelector('[data-menu-root]');
  const navList = document.querySelector('[data-menu-nav]');
  const bookEl = document.querySelector('[data-book]');
  if (!root) return;

  navList.insertAdjacentHTML('beforeend', categories.map((c) => `<a href="#${c.id}" data-cat-link="${c.id}">${esc(c.title)}</a>`).join(''));
  navList.insertAdjacentHTML('beforeend', '<span class="menu-nav__pill" data-menu-pill aria-hidden="true"></span>');

  root.innerHTML = categories.map((c, i) => `
    <section class="menu-cat container" id="${c.id}" data-cat="${c.id}" aria-labelledby="${c.id}-title">
      <div class="menu-cat__aside">
        <div class="menu-cat__visual arch-frame" data-cat-visual>
          <div class="arch">
            <img src="${c.image}" alt="" loading="lazy" data-default />
          </div>
        </div>
        <div>
          <p class="label menu-cat__count">${String(i + 1).padStart(2, '0')} · ${c.items.length} dishes</p>
          <h2 class="h2" id="${c.id}-title" data-list-reveal>${esc(c.title)}</h2>
          <p class="muted" style="margin-top:18px;max-width:40ch" data-list-reveal>${esc(c.blurb)}</p>
        </div>
      </div>
      <ul class="menu-list">
        ${c.items.map((it) => `
          <li class="menu-item" data-list-reveal${it.image ? ` data-preview="${it.image}"` : ''}>
            <span class="diet diet--${it.diet}" role="img" aria-label="${it.diet === 'veg' ? 'Vegetarian' : 'Non-vegetarian'}"></span>
            <div class="menu-item__row">
              <h3 class="menu-item__name">${esc(it.name)}</h3>
              <span class="menu-item__lead" aria-hidden="true"></span>
              <span class="price menu-item__price">${esc(it.price)}</span>
            </div>
            <p class="menu-item__desc">${esc(it.desc)}</p>
            ${it.tag ? `<span class="menu-item__tag">${esc(it.tag)}</span>` : ''}
          </li>`).join('')}
      </ul>
    </section>`).join('');

  bookData = buildBook();
  bookEl.innerHTML = bookData.html;

  panels = { book: document.querySelector('[data-panel="book"]'), list: document.querySelector('[data-panel="list"]') };
  panels.book.hidden = view !== 'book';
  panels.list.hidden = view !== 'list';
  syncToggle(false);
}

export function init() {
  if (view === 'book') ensureBook();
  else ensureList();
  initToggle();
  initCategoryLinks();
  initHoverPreviews();
}

/* ---------- view switching ---------- */
function syncToggle(animate = true) {
  const toggle = document.querySelector('[data-view-toggle]');
  if (!toggle) return;
  const thumb = toggle.querySelector('[data-view-thumb]');
  let active = null;
  toggle.querySelectorAll('[data-view]').forEach((b) => {
    const on = b.dataset.view === view;
    b.setAttribute('aria-pressed', String(on));
    if (on) active = b;
  });
  if (active) gsap.to(thumb, { x: active.offsetLeft - 4, width: active.offsetWidth, duration: animate ? 0.6 : 0, ease: 'restro' });
}

function initToggle() {
  document.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
  requestAnimationFrame(() => syncToggle(false));
}

function setView(next) {
  if (next === view) return;
  const from = panels[view];
  const to = panels[next];
  if (view === 'book') book?.suspend();
  view = next;
  syncToggle();
  const url = new URL(location.href);
  if (next === 'list') url.searchParams.set('view', 'list'); else url.searchParams.delete('view');
  history.replaceState(null, '', url);

  gsap.to(from, {
    autoAlpha: 0, y: 24, duration: 0.35, ease: 'power2.in',
    onComplete: () => {
      from.hidden = true;
      gsap.set(from, { clearProps: 'all' });
      to.hidden = false;
      if (next === 'book') ensureBook(); else ensureList();
      ScrollTrigger.refresh();
      scrollToEl(next === 'book' ? to.querySelector('[data-book-host]') : to, true, next === 'book' ? -170 : -100);
      gsap.fromTo(to, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'restro', clearProps: 'transform' });
    },
  });
}

function ensureBook() {
  if (book) { book.refresh(); return; }
  book = createBook(panels.book, bookData.meta, bookData.chapters, { onChapter: (id) => id && view === 'book' && activate(id) });
}

// The list's reveals are bound the first time it becomes visible, so nothing is measured while hidden.
function ensureList() {
  if (listReady) return;
  listReady = true;
  ScrollTrigger.batch('[data-list-reveal]', {
    start: 'top 92%',
    once: true,
    onEnter: (els) => gsap.from(els, { y: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06 }),
  });
  document.querySelectorAll('[data-cat]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section, start: 'top 45%', end: 'bottom 45%',
      onToggle: (self) => self.isActive && view === 'list' && activate(section.dataset.cat),
    });
  });
}

/* ---------- category bar ---------- */
function activate(id) {
  const links = [...document.querySelectorAll('[data-cat-link]')];
  const link = links.find((l) => l.dataset.catLink === id);
  const pill = document.querySelector('[data-menu-pill]');
  const list = document.querySelector('[data-menu-nav]');
  if (!link || link.classList.contains('is-active')) return;
  links.forEach((l) => l.classList.toggle('is-active', l === link));
  gsap.to(pill, { x: link.offsetLeft, y: link.offsetTop, width: link.offsetWidth, height: link.offsetHeight, duration: 0.6, ease: 'restro' });
  list.scrollTo({ left: link.offsetLeft - 40, behavior: 'smooth' });
}

function initCategoryLinks() {
  document.querySelectorAll('[data-cat-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.dataset.catLink;
      activate(id);
      if (view === 'book') {
        scrollToEl(panels.book.querySelector('[data-book-host]'), false, -170);
        book?.goToChapter(id);
      } else {
        scrollToEl(document.getElementById(id));
      }
    });
  });
  const first = document.querySelector('[data-cat-link]');
  if (first) requestAnimationFrame(() => activate(first.dataset.catLink));
}

// List view: hovering a dish swaps the arch image beside it.
function initHoverPreviews() {
  document.querySelectorAll('[data-cat]').forEach((cat) => {
    const frame = cat.querySelector('[data-cat-visual] .arch');
    const base = frame.querySelector('img');
    const cache = new Map([[base.getAttribute('src'), base]]);
    let current = base;
    const show = (src) => {
      let img = cache.get(src);
      if (!img) {
        img = Object.assign(document.createElement('img'), { src, alt: '', className: 'is-hidden', decoding: 'async' });
        frame.appendChild(img);
        cache.set(src, img);
      }
      if (img === current) return;
      current.classList.add('is-hidden');
      img.classList.remove('is-hidden');
      current = img;
    };
    cat.querySelectorAll('[data-preview]').forEach((item) => {
      item.addEventListener('pointerenter', () => show(item.dataset.preview));
    });
    cat.querySelector('.menu-list').addEventListener('pointerleave', () => show(base.getAttribute('src')));
  });
}
