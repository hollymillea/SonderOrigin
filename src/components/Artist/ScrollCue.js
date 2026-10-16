"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./PortraitIntro.module.css";

// Space between the arrows and the top of the big name's letters, and the
// least space kept under the description
const GAP = 32;
const MIN_GAP = 12;
// Space between the header and the next section's content after clicking
const CONTENT_GAP = 28;

// How far below the top of a line's box its letters start (negative when
// they rise above it). The tight line height pulls the box in around the
// font's content area, so the capitals can poke out above it by an amount
// that depends on the font; a canvas measures where the ink really starts
function inkTop(line) {
  const style = getComputedStyle(line);
  const context = document.createElement("canvas").getContext("2d");
  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const metrics = context.measureText(line.textContent);
  const content = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  // The content area sits centred in the box, so the font's top is this far
  // inside the box's top (half the leading: negative here, so above it)
  const halfLeading = (line.offsetHeight - content) / 2;
  // The letters' top is below the font's top by the unused ascent
  return halfLeading + metrics.fontBoundingBoxAscent - metrics.actualBoundingBoxAscent;
}

// An element's layout position within an ancestor, adding up offsets through
// each offset parent on the way (the name's box is one, as a size container).
// Offsets ignore transforms, so the name's rise-in animation doesn't count
function offsetWithin(element, ancestor) {
  let top = 0;
  let left = 0;
  for (let node = element; node && node !== ancestor; node = node.offsetParent) {
    top += node.offsetTop;
    left += node.offsetLeft;
  }
  return { top, left };
}

// The three arrows on the first screen. They sit a set gap above the letters
// of the big name directly beneath them, however tall the name runs, but
// never on the description. Clicking them scrolls to the section after the
// first screen, clear of the sticky header
export function ScrollCue() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const cue = ref.current;
    const section = cue.closest("section");
    const name = section.querySelector("h1");
    const description = cue.previousElementSibling;
    let cancelled = false;

    const place = () => {
      if (cancelled) return;
      const stretch = parseFloat(getComputedStyle(name).getPropertyValue("--name-stretch")) || 1;
      const cueLeft = offsetWithin(cue, section).left;
      const cueRight = cueLeft + cue.offsetWidth;
      // The first line of the name that reaches under the arrows; a short
      // first line (JESSY over BLAKEMORE) leaves the space beneath them open
      const lines = [...name.children];
      const line = lines.find((each) => {
        const left = offsetWithin(each, section).left;
        return left + each.offsetWidth * stretch > cueLeft && left < cueRight;
      }) ?? lines.at(-1);
      const letters = offsetWithin(line, section).top + inkTop(line);
      const descriptionBottom = offsetWithin(description, section).top + description.offsetHeight;
      let top = letters - GAP - cue.offsetHeight;
      if (top < descriptionBottom + MIN_GAP) {
        // No room between the description and the name (a long description
        // on a short, wide screen): sit level with the description's last
        // line instead, at the end of the third, if that line leaves room
        const range = document.createRange();
        range.selectNodeContents(description);
        const lastLine = [...range.getClientRects()].at(-1);
        const sectionLeft = section.getBoundingClientRect().left;
        const clear = lastLine && lastLine.right - sectionLeft + MIN_GAP <= cueLeft;
        top = clear ? descriptionBottom - cue.offsetHeight : descriptionBottom + MIN_GAP;
      }
      cue.style.setProperty("--cue-top", `${Math.round(top)}px`);
    };

    place();
    document.fonts?.ready.then(place);
    const observer = new ResizeObserver(place);
    observer.observe(section);
    // The name's box refits the name on resize; watching both catches the
    // refit as soon as it lands
    observer.observe(name.parentElement);
    observer.observe(name);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  // Brings the next section's first line of content up under the header,
  // the same distance below it as the first screen's text sits
  const scrollOn = () => {
    const next = ref.current.closest("section")?.nextElementSibling;
    if (!next) return;
    const content = next.firstElementChild ?? next;
    const header = document.querySelector("header")?.offsetHeight ?? 0;
    const top = content.getBoundingClientRect().top + window.scrollY - header - CONTENT_GAP;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.microText} ${styles.scrollCue}`}
      aria-label="Scroll to the next section"
      onClick={scrollOn}
    >
      <span className={styles.arrow} aria-hidden="true">↓</span>
      <span className={styles.arrow} aria-hidden="true">↓</span>
      <span className={styles.arrow} aria-hidden="true">↓</span>
    </button>
  );
}
