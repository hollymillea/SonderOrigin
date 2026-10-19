"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Showreel.module.css";

// Full-screen showreel behind the header. Plays while open; falls back to a
// still if the video can't play
export function Showreel({ open, onClose, settings }) {
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!open) {
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
  }, [open]);

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
        src={settings.showreelUrl}
        poster={settings.showreelPoster.src}
        muted
        loop
        playsInline
        preload="none"
        width="1920"
        height="1080"
        hidden={videoUnavailable}
        onError={() => setVideoUnavailable(true)}
      />
      {videoUnavailable && <img src={settings.showreelPoster.src} alt={settings.showreelPoster.alt} width="1500" height="1500" />}
      <p className={styles.showreelLabel}>Showreel {videoUnavailable && <span>Video unavailable</span>}</p>
    </div>
  );
}
