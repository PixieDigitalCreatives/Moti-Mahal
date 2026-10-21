import { useRef } from 'react';
import { Icon } from './Icon.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

/**
 * Pill button with a rolling label and arrow. Renders an <a> when given `href`
 * (internal routes get the page curtain automatically), otherwise a <button>.
 */
export default function Button({ href, variant = 'gold', size, arrow = true, magnetic = variant !== 'link', className = '', children, ...rest }) {
  const ref = useRef(null);
  useMagnetic(ref, magnetic);
  const cls = ['btn', `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(' ');
  const inner = (
    <>
      <span className="btn__label"><span>{children}</span></span>
      {arrow && <Icon name="arrow" />}
    </>
  );
  if (href) {
    return <a ref={ref} href={href} className={cls} {...rest}>{inner}</a>;
  }
  return <button ref={ref} type="button" className={cls} {...rest}>{inner}</button>;
}
