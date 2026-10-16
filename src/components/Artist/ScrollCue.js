"use client";

import styles from "./PortraitIntro.module.css";

// The three arrows under the first screen's copy. Clicking them scrolls to
// the section after the first screen, clear of the sticky header
export function ScrollCue() {
  const scrollOn = (event) => {
    const next = event.currentTarget.closest("section")?.nextElementSibling;
    if (!next) return;
    const header = document.querySelector("header")?.offsetHeight ?? 0;
    const top = next.getBoundingClientRect().top + window.scrollY - header;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <button type="button" className={`${styles.microText} ${styles.scrollCue}`} aria-label="Scroll to the next section" onClick={scrollOn}>
      <span className={styles.arrow} aria-hidden="true">↓</span>
      <span className={styles.arrow} aria-hidden="true">↓</span>
      <span className={styles.arrow} aria-hidden="true">↓</span>
    </button>
  );
}
