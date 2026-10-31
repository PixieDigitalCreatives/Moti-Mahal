import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { useHeroIntro } from '../hooks/useHeroIntro.js';
import { usePageReveals } from '../hooks/usePageReveals.js';
import { Icon } from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import Button from '../components/Button.jsx';
import Footer from '../components/Footer.jsx';
import { MAPS_URL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP } from '../data/site.js';

const toISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

// 30-minute slots between 12:00 and 22:30.
const TIME_SLOTS = Array.from({ length: 22 }, (_, i) => {
  const m = 12 * 60 + i * 30;
  const h = Math.floor(m / 60);
  return `${((h + 11) % 12) + 1}:${String(m % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
});

const GUESTS = [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['8', '7 – 8'], ['10', '9 – 12'], ['12+', '12+ (large group)']];
const OCCASIONS = ['None', 'Birthday', 'Anniversary', 'Family gathering', 'Business meal'];

const FAQ = [
  ['Do I need to reserve in advance?', 'Walk-ins are always welcome. For weekend evenings, festivals and groups we recommend reserving a few hours ahead so we can hold the right table for you.'],
  ['Can you host birthdays and family gatherings?', 'Yes. Tell us the occasion and number of guests when you reserve and our team will help with seating and a menu that suits the group.'],
  ['Do you offer takeaway and delivery?', `We do. Call ${PHONE_DISPLAY} to place an order — everything is packed hot, straight from the kitchen.`],
  ['Are there vegetarian options?', 'Plenty — from paneer tikka and dal makhani to fresh tandoori breads. Every dish on our menu is marked veg or non-veg.'],
];

export default function Visit() {
  const page = useRef(null);
  useHeroIntro(page);
  usePageReveals(page);

  return (
    <div ref={page}>
      <title>Visit &amp; Reserve — Moti Restro Jaypee Greens, Greater Noida</title>
      <meta name="description" content="Reserve a table at Moti Restro, FF-16 & 17, Sun Twilight, Sector 27, Jaypee Greens, Greater Noida. Open daily 11 AM – 11 PM. Call 087962 77703." />
      <main id="main">
        <PageHero image="/images/warm-interior.webp" alt="Warm dining room with set tables" crumb="Visit & Reserve" title={<>Your table<br /><em>awaits</em></>} minHeight="78svh">
          <p className="lead">On the first floor of Sun Twilight, a short walk from Delta 1 metro. We confirm every reservation personally.</p>
        </PageHero>

        <section className="section container visit" id="reserve">
          <div>
            <h2 className="h2" style={{ marginBottom: 44 }} data-split>Find<br /><em>Moti Restro</em></h2>
            <dl className="info-list" data-stagger>
              <div className="info">
                <dt className="label">Address</dt>
                <dd className="info__value">
                  <strong>Sun Twilight, Jaypee Greens</strong>
                  <span>Shop No. FF-16 &amp; 17, 1st Floor, Metro Street, Sector 27, Greater Noida, Uttar Pradesh 201310</span>
                  <Button href={MAPS_URL} variant="link" target="_blank" rel="noopener noreferrer">Get directions</Button>
                </dd>
              </div>
              <div className="info">
                <dt className="label">Phone</dt>
                <dd className="info__value"><strong><a href={PHONE_TEL}>{PHONE_DISPLAY}</a></strong><span>Reservations, takeaway &amp; delivery</span></dd>
              </div>
              <div className="info">
                <dt className="label">Hours</dt>
                <dd className="info__value"><strong>11 AM – 11 PM</strong><span>Open every day, lunch &amp; dinner</span></dd>
              </div>
              <div className="info">
                <dt className="label">Getting here</dt>
                <dd className="info__value"><strong>Near Delta 1 Metro</strong><span>Aqua Line · a short walk to Sun Twilight</span></dd>
              </div>
            </dl>
          </div>
          <ReservationForm />
        </section>

        <section className="container" style={{ paddingBottom: 'var(--section-y)' }}>
          <div className="map-wrap" data-fade>
            <iframe title="Map showing Moti Restro at Sun Twilight, Jaypee Greens" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Sun+Twilight+Jaypee+Greens+Sector+27+Greater+Noida&output=embed" />
            <div className="map-card">
              <p className="label">Moti Restro</p>
              <p>FF-16 &amp; 17, Sun Twilight, Sector 27, Jaypee Greens</p>
              <Button href={MAPS_URL} variant="link" target="_blank" rel="noopener noreferrer">Open in Maps</Button>
            </div>
          </div>
        </section>

        <section className="section bg-900">
          <div className="container">
            <div className="sec-head sec-head--center"><h2 className="h2" data-split>Good<br /><em>to know</em></h2></div>
            <div className="faq">
              {FAQ.map(([q, a]) => <FaqItem q={q} a={a} key={q} />)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const body = useRef(null);
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    gsap.to(body.current, { height: open ? 'auto' : 0, duration: 0.7, ease: 'restro', onComplete: () => ScrollTrigger.refresh() });
  }, [open]);
  return (
    <div className="faq__item">
      <button className="faq__q" type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{q}<i aria-hidden="true" /></button>
      <div className="faq__a" ref={body}><p>{a}</p></div>
    </div>
  );
}

const rules = {
  name: (v) => v.trim().length >= 2 || 'Please tell us your name.',
  phone: (v) => /^[+\d][\d\s-]{8,14}$/.test(v.trim()) || 'Please enter a valid phone number.',
};

function ReservationForm() {
  const today = useMemo(() => toISO(new Date()), []);
  const [values, setValues] = useState({ name: '', phone: '', date: today, time: '8:00 PM', guests: '2', occasion: 'None', notes: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);
  const formRef = useRef(null);
  const successRef = useRef(null);

  const validate = (key, v) => {
    if (key === 'date') return (v && v >= today) || 'Please choose today or a later date.';
    return rules[key] ? rules[key](v) : true;
  };
  const set = (key) => (e) => setValues((s) => ({ ...s, [key]: e.target.value }));
  const blur = (key) => () => {
    const res = validate(key, values[key]);
    setErrors((s) => ({ ...s, [key]: res === true ? '' : res }));
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    ['name', 'phone', 'date'].forEach((k) => {
      const res = validate(k, values[k]);
      if (res !== true) next[k] = res;
    });
    setErrors(next);
    if (Object.keys(next).length) {
      formRef.current.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    const pretty = new Date(`${values.date}T00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    const msg = [
      'Hello Moti Restro, I would like to reserve a table.',
      `Name: ${values.name}`, `Phone: ${values.phone}`, `Date: ${pretty}`, `Time: ${values.time}`, `Guests: ${values.guests}`,
      values.occasion !== 'None' ? `Occasion: ${values.occasion}` : '',
      values.notes ? `Requests: ${values.notes}` : '',
    ].filter(Boolean).join('\n');
    const link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank', 'noopener');
    gsap.to(formRef.current, {
      autoAlpha: 0, y: -20, duration: 0.4,
      onComplete: () => setSent({ link, summary: `${values.guests} ${values.guests === '1' ? 'guest' : 'guests'} · ${pretty} · ${values.time}` }),
    });
  };

  useLayoutEffect(() => {
    if (sent) gsap.from(successRef.current.children, { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.9 });
    ScrollTrigger.refresh();
  }, [sent]);

  const reset = () => {
    setSent(null);
    setValues({ name: '', phone: '', date: today, time: '8:00 PM', guests: '2', occasion: 'None', notes: '' });
  };

  const field = (key) => ({ className: `field${errors[key] ? ' is-invalid' : ''}` });

  return (
    <div className="form-card" data-fade>
      {!sent ? (
        <form ref={formRef} noValidate onSubmit={submit}>
          <div className="form-card__head">
            <p className="label">Reservation</p>
            <h3 className="h3">Reserve a table</h3>
            <p className="muted">Send us your request and we will confirm within minutes.</p>
          </div>
          <div className="form-grid">
            <div {...field('name')}>
              <label htmlFor="f-name">Your name</label>
              <input id="f-name" name="name" type="text" autoComplete="name" placeholder="Full name" value={values.name} onChange={set('name')} onBlur={blur('name')} aria-invalid={!!errors.name} />
              <span className="field__error" aria-live="polite">{errors.name}</span>
            </div>
            <div {...field('phone')}>
              <label htmlFor="f-phone">Phone</label>
              <input id="f-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="98xxxxxxxx" value={values.phone} onChange={set('phone')} onBlur={blur('phone')} aria-invalid={!!errors.phone} />
              <span className="field__error" aria-live="polite">{errors.phone}</span>
            </div>
            <div {...field('date')}>
              <label htmlFor="f-date">Date</label>
              <input id="f-date" name="date" type="date" min={today} value={values.date} onChange={set('date')} onBlur={blur('date')} aria-invalid={!!errors.date} />
              <span className="field__error" aria-live="polite">{errors.date}</span>
            </div>
            <div className="field">
              <label htmlFor="f-time">Time</label>
              <select id="f-time" name="time" value={values.time} onChange={set('time')}>
                {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-guests">Guests</label>
              <select id="f-guests" name="guests" value={values.guests} onChange={set('guests')}>
                {GUESTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-occasion">Occasion</label>
              <select id="f-occasion" name="occasion" value={values.occasion} onChange={set('occasion')}>
                {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="field field--full">
              <label htmlFor="f-notes">Special requests</label>
              <textarea id="f-notes" name="notes" rows="3" placeholder="High chair, allergies, a quiet corner…" value={values.notes} onChange={set('notes')} />
            </div>
          </div>
          <div className="form-actions">
            <Button type="submit">Request reservation</Button>
            <small>Or call <a href={PHONE_TEL} style={{ color: 'var(--gold)' }}>{PHONE_DISPLAY}</a></small>
          </div>
        </form>
      ) : (
        <div className="form-success" role="status" ref={successRef}>
          <Icon name="star" width="34" height="34" style={{ color: 'var(--gold)' }} />
          <h3 className="h3">Almost there</h3>
          <p className="muted">{sent.summary}</p>
          <p className="muted" style={{ maxWidth: '38ch' }}>We opened WhatsApp with your request ready to send. Tap send and our team will confirm shortly.</p>
          <Button href={sent.link} target="_blank" rel="noopener noreferrer">Open WhatsApp again</Button>
          <Button variant="link" arrow={false} onClick={reset}>Make another request</Button>
        </div>
      )}
    </div>
  );
}
