"use client";

import { useEffect, useState } from "react";
import styles from "./Header.module.css";

export function Header() {
  const [showReel, setShowReel] = useState(false);

  useEffect(() => {
    if (!showReel) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setShowReel(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showReel]);

  return (
    <>
      <div
        id="showreel-preview"
        className={`${styles.showreel} ${showReel ? styles.showreelOpen : ""}`}
        aria-hidden={!showReel}
        role="region"
        aria-label="Showreel placeholder"
      >
        <img src="/images/4.png" alt="Olivia Dean — temporary showreel image" width="1500" height="1500" />
        <p className={styles.showreelLabel}>Showreel <span>Coming soon</span></p>
      </div>
      <header className={styles.header}>
        <nav className={styles.items} aria-label="Primary">
          <button
            type="button"
            className={styles.brandMark}
            aria-label="Preview Sonder Origin showreel"
            aria-expanded={showReel}
            aria-controls="showreel-preview"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setShowReel(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") setShowReel(false);
            }}
            onFocus={(event) => {
              if (event.currentTarget.matches(":focus-visible")) setShowReel(true);
            }}
            onBlur={() => setShowReel(false)}
            onClick={() => {
              if (window.matchMedia("(hover: hover)").matches) setShowReel(true);
              else setShowReel((open) => !open);
            }}
          >
            <img src="/images/icon.png" alt="" width="200" height="119" />
          </button>
          <a href="#clients">GALLERY</a>
          <a href="#about">ABOUT</a>
          <span>CONTACT</span>
        </nav>
      </header>
    </>
  );
}
