"use client";

import { useCallback, useState } from "react";
import { Showreel } from "./Showreel";
import styles from "./Header.module.css";

export function Header() {
  const [showReel, setShowReel] = useState(false);
  const closeShowReel = useCallback(() => setShowReel(false), []);

  return (
    <>
      <Showreel open={showReel} onClose={closeShowReel} />
      <header className={styles.header} data-showreel-open={showReel}>
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
