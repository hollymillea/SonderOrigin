"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./ArtistName.module.css";

// The artist's name in the hero's stretched type, one word per line (or the
// lines given), sized so the longest line fills the width. CSS makes a close
// guess from the letter count; this measures the real glyphs and corrects it
export function ArtistName({ name, lines, as: Tag = "h1", className = "" }) {
  const ref = useRef(null);
  const words = lines ?? name.split(" ");
  const longest = Math.max(...words.map((word) => word.length));

  useLayoutEffect(() => {
    const heading = ref.current;
    const box = heading.parentElement;
    let cancelled = false;
    const fit = () => {
      if (cancelled) return;
      const size = parseFloat(getComputedStyle(heading).fontSize);
      const stretch = parseFloat(getComputedStyle(heading).getPropertyValue("--name-stretch")) || 1;
      const widest = Math.max(...[...heading.children].map((line) => line.offsetWidth));
      // Width scales with font size, so one measurement gives the fitted size
      heading.style.setProperty("--fit-size", `${(size * box.clientWidth * 0.995) / (widest * stretch)}px`);
    };
    fit();
    document.fonts?.ready.then(fit);
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [name, lines]);

  return (
    <div className={`${styles.box} ${className}`}>
      <Tag ref={ref} className={styles.name} style={{ "--lines": words.length, "--longest": longest }}>
        {words.map((word, index) => (
          <span key={index} className={styles.line}>
            {word}
          </span>
        ))}
      </Tag>
    </div>
  );
}
