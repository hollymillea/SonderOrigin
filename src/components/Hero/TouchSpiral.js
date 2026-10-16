"use client";

import { useEffect, useRef } from "react";
import styles from "./TouchSpiral.module.css";

// Touch screens never see the spiral cursor, so the spiral appears under the
// finger instead. It turns with the swipe, like winding a dial through the
// artists, and unwinds and fades when the finger lifts. Moved straight on the
// element, so swiping doesn't re-render the hero
export function TouchSpiral() {
  const ref = useRef(null);

  useEffect(() => {
    const spiral = ref.current;
    const touchOnly = window.matchMedia("(hover: none) and (pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let startY = 0;
    let turn = 0;

    const place = (touch) => {
      spiral.style.setProperty("--x", `${touch.clientX}px`);
      spiral.style.setProperty("--y", `${touch.clientY}px`);
    };
    const start = (event) => {
      if (!touchOnly.matches || reduced.matches) return;
      const touch = event.touches[0];
      startY = touch.clientY;
      turn = 0;
      place(touch);
      spiral.style.setProperty("--turn", "0deg");
      spiral.dataset.state = "down";
    };
    const move = (event) => {
      if (spiral.dataset.state !== "down") return;
      const touch = event.touches[0];
      place(touch);
      // About a full turn for every artist stepped (32px of swipe each)
      turn = ((startY - touch.clientY) / 32) * 360;
      spiral.style.setProperty("--turn", `${turn}deg`);
    };
    const end = () => {
      if (spiral.dataset.state !== "down") return;
      spiral.style.setProperty("--turn", `${turn - 180}deg`);
      spiral.dataset.state = "up";
    };

    window.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", end);
    window.addEventListener("touchcancel", end);
    return () => {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
      window.removeEventListener("touchcancel", end);
    };
  }, []);

  return (
    <div ref={ref} className={styles.spiral} aria-hidden="true">
      <img src="/images/spiral.png" alt="" width="1667" height="1667" />
    </div>
  );
}
