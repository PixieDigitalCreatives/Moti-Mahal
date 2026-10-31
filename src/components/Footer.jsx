import { MAPS_URL, NAV_LINKS, PHONE_DISPLAY, PHONE_TEL } from '../data/site.js';
import Logo from './Logo.jsx';
import Button from './Button.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand" data-fade>
            <Logo />
            <p>The legend of the tandoor, served in the heart of Jaypee Greens. Charcoal, patience and spice — the way it has always been.</p>
            <Button href="/visit#reserve">Reserve a Table</Button>
          </div>
          <div className="footer__cols" data-stagger>
            <div className="footer__col">
              <p className="label">Visit</p>
              <p>FF-16 &amp; 17, 1st Floor, Sun Twilight</p>
              <p>Metro Street, Sector 27, Jaypee Greens</p>
              <p>Near Delta 1 Metro Station</p>
              <p>Greater Noida, UP 201310</p>
            </div>
            <div className="footer__col">
              <p className="label">Hours</p>
              <p>Open every day</p>
              <p>11:00 AM – 11:00 PM</p>
              <p>Dine-in · Takeaway · Delivery</p>
            </div>
            <div className="footer__col">
              <p className="label">Connect</p>
              <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">Get Directions</a>
              <a href="#" aria-label="Instagram (link to be added)">Instagram</a>
              <a href="#" aria-label="Facebook (link to be added)">Facebook</a>
            </div>
          </div>
        </div>
        <div className="footer__word" aria-hidden="true" data-footer-word>Moti Restro</div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Moti Restro · Jaypee Greens, Greater Noida</span>
          <nav aria-label="Footer">
            {NAV_LINKS.map((l) => (
              <a key={l.to} href={l.to}>{l.to === '/visit' ? 'Visit & Reserve' : l.label}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
