"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import styles from "./ArtistName.module.css";

// The artist's name in the hero's stretched type, one word per line (or the
// lines given), sized so the longest line fills the width. CSS makes a close
// guess from the letter count; this measures the real glyphs and corrects it
export function ArtistName({ name, lines, as: Tag = "h1", className = "", scrollTitle = false }) {
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

  useEffect(() => {
    if (!scrollTitle) return;
    const box = ref.current.parentElement;
    const section = box.closest("section");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (preference.matches) {
        box.style.removeProperty("--title-progress");
        return;
      }
      const rect = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height));
      box.style.setProperty("--title-progress", progress.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
      box.style.removeProperty("--title-progress");
    };
  }, [scrollTitle]);

  return (
    <div className={`${styles.box} ${scrollTitle ? styles.scrollTitle : ""} ${className}`}>
      <Tag ref={ref} className={styles.name} style={{ "--lines": words.length, "--longest": longest }}>
        {words.map((word, index) => (
          <span key={index} className={styles.line} style={scrollTitle ? { "--line-direction": index % 2 ? -1 : 1, "--line-lift": 24 + index * 16 } : undefined}>
            {word}
          </span>
        ))}
      </Tag>
    </div>
  );
}
