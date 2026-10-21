import { Icon } from './Icon.jsx';

export default function Logo(props) {
  return (
    <a href="/" className="logo" aria-label="Moti Mahal, Jaypee Greens — home" {...props}>
      <Icon name="mark" className="logo__mark" />
      <span className="logo__text">
        <span className="logo__name">Moti Mahal</span>
        <span className="logo__sub">Jaypee Greens</span>
      </span>
    </a>
  );
}
