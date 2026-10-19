"use client";

import { useEffect, useRef } from "react";
import styles from "./Showreel.module.css";

// Full-screen showreel behind the header. Plays while open. If the video
// can't play, onUnavailable lets the header stop offering it
export function Showreel({ open, onClose, onUnavailable, url }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!open) {
      video.pause();
      return;
    }
    let cancelled = false;
    video.play().catch((error) => {
      if (!cancelled && error.name !== "AbortError") onUnavailable();
    });
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [open, onUnavailable]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  return (
    <div
      id="showreel-preview"
      className={`${styles.showreel} ${open ? styles.showreelOpen : ""}`}
      aria-hidden={!open}
      role="region"
      aria-label="Sonder Origin showreel"
    >
      <video
        ref={videoRef}
        src={url}
        muted
        loop
        playsInline
        preload="none"
        width="1920"
        height="1080"
        onError={onUnavailable}
      />
      <p className={styles.showreelLabel}>Showreel</p>
    </div>
  );
}
