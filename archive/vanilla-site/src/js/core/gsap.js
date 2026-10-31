import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, Flip, CustomEase);

// Same curve as the CSS --ease token so CSS and GSAP motion feel identical.
CustomEase.create('restro', '0.16, 1, 0.3, 1');
gsap.defaults({ ease: 'restro', duration: 1.2 });
ScrollTrigger.config({ ignoreMobileResize: true });

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let fontsPromise;
export function fontsReady(timeout = 2500) {
  fontsPromise ??= Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(timeout)]);
  return fontsPromise;
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Flip };
