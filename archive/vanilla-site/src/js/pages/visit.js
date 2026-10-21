import { gsap, ScrollTrigger } from '../core/gsap.js';

const WHATSAPP = '918796277703';

export function init() {
  reservationForm();
  faq();
}

function reservationForm() {
  const card = document.querySelector('[data-form-card]');
  const form = card?.querySelector('form');
  if (!form) return;

  // Earliest bookable date is today; offer 30-minute slots between 12:00 and 22:30.
  const date = form.elements.date;
  const today = new Date();
  const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  date.min = iso(today);
  date.value = iso(today);
  const time = form.elements.time;
  for (let m = 12 * 60; m <= 22 * 60 + 30; m += 30) {
    const h = Math.floor(m / 60), mm = String(m % 60).padStart(2, '0');
    const label = `${((h + 11) % 12) + 1}:${mm} ${h < 12 ? 'AM' : 'PM'}`;
    time.add(new Option(label, label, false, label === '8:00 PM'));
  }

  const rules = {
    name: (v) => v.trim().length >= 2 || 'Please tell us your name.',
    phone: (v) => /^[+\d][\d\s-]{8,14}$/.test(v.trim()) || 'Please enter a valid phone number.',
    date: (v) => (v && v >= date.min) || 'Please choose today or a later date.',
    guests: (v) => !!v || 'How many guests?',
  };
  const check = (el) => {
    const rule = rules[el.name];
    if (!rule) return true;
    const res = rule(el.value);
    const field = el.closest('.field');
    field.classList.toggle('is-invalid', res !== true);
    field.querySelector('.field__error').textContent = res === true ? '' : res;
    el.setAttribute('aria-invalid', String(res !== true));
    return res === true;
  };
  form.addEventListener('blur', (e) => { if (e.target.name in rules) check(e.target); }, true);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = Object.keys(rules).map((k) => form.elements[k]);
    const ok = fields.map(check).every(Boolean);
    if (!ok) { fields.find((f) => f.getAttribute('aria-invalid') === 'true')?.focus(); return; }
    const d = Object.fromEntries(new FormData(form));
    const pretty = new Date(`${d.date}T00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    const msg = [
      'Hello Moti Mahal, I would like to reserve a table.',
      `Name: ${d.name}`, `Phone: ${d.phone}`, `Date: ${pretty}`, `Time: ${d.time}`, `Guests: ${d.guests}`,
      d.occasion && d.occasion !== 'None' ? `Occasion: ${d.occasion}` : '',
      d.notes ? `Requests: ${d.notes}` : '',
    ].filter(Boolean).join('\n');
    const link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    card.querySelector('[data-wa-link]').href = link;
    card.querySelector('[data-summary]').textContent = `${d.guests} ${d.guests === '1' ? 'guest' : 'guests'} · ${pretty} · ${d.time}`;
    gsap.to(form, {
      autoAlpha: 0, y: -20, duration: 0.4, onComplete: () => {
        card.classList.add('is-sent');
        gsap.from(card.querySelector('.form-success').children, { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.9 });
        ScrollTrigger.refresh();
      },
    });
    window.open(link, '_blank', 'noopener');
  });

  card.querySelector('[data-form-reset]')?.addEventListener('click', () => {
    card.classList.remove('is-sent');
    form.reset();
    date.value = iso(today);
    gsap.fromTo(form, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 });
  });
}

function faq() {
  document.querySelectorAll('[data-faq] .faq__q').forEach((q) => {
    const a = q.nextElementSibling;
    q.addEventListener('click', () => {
      const open = q.getAttribute('aria-expanded') === 'true';
      q.setAttribute('aria-expanded', String(!open));
      gsap.to(a, { height: open ? 0 : 'auto', duration: 0.7, ease: 'mahal', onComplete: () => ScrollTrigger.refresh() });
    });
  });
}
