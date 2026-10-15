"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

export function Header() {
  const [showReel, setShowReel] = useState(false);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!showReel) {
      video.pause();
      return;
    }
    let cancelled = false;
    video.play().catch((error) => {
      if (!cancelled && error.name !== "AbortError") setVideoUnavailable(true);
    });
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [showReel]);

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
        aria-label="Sonder Origin showreel"
      >
        <video
          ref={videoRef}
          src="https://freight.cargo.site/m/V2402719754386806942896197344540/Shan_Reel_2025_v2.MP4"
          poster="/images/4.png"
          muted
          loop
          playsInline
          preload="none"
          width="1920"
          height="1080"
          hidden={videoUnavailable}
          onError={() => setVideoUnavailable(true)}
        />
        {videoUnavailable && <img src="/images/4.png" alt="Olivia Dean — showreel fallback image" width="1500" height="1500" />}
        <p className={styles.showreelLabel}>Showreel {videoUnavailable && <span>Video unavailable</span>}</p>
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
