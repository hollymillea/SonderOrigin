"use client";

import { useEffect, useRef } from "react";
import styles from "./TouchSpiral.module.css";

// Touch screens never see the spiral cursor, so the spiral appears where the
// finger lands instead. While dragging it trails a little behind the finger,
// so it peeks out from under it, and turns as it goes; it unwinds and fades
// when the finger lifts. Moved straight on the element, so dragging doesn't
// re-render the hero
export function TouchSpiral() {
  const ref = useRef(null);

  useEffect(() => {
    const spiral = ref.current;
    const touchOnly = window.matchMedia("(hover: none) and (pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // How much of the remaining distance to the finger the spiral covers
    // each frame: lower trails further behind
    const FOLLOW = 0.16;
    let startY = 0;
    let turn = 0;
    // Where the spiral is drawn and where the finger is
    let x = 0;
    let y = 0;
    let fingerX = 0;
    let fingerY = 0;
    let frame = 0;

    const draw = () => {
      spiral.style.setProperty("--x", `${x}px`);
      spiral.style.setProperty("--y", `${y}px`);
    };
    // Eases toward the finger until it catches up
    const follow = () => {
      x += (fingerX - x) * FOLLOW;
      y += (fingerY - y) * FOLLOW;
      draw();
      frame = Math.hypot(fingerX - x, fingerY - y) > 0.5 ? requestAnimationFrame(follow) : 0;
    };
    const start = (event) => {
      if (!touchOnly.matches || reduced.matches) return;
      const touch = event.touches[0];
      cancelAnimationFrame(frame);
      frame = 0;
      // Lands right where the finger does
      x = fingerX = touch.clientX;
      y = fingerY = touch.clientY;
      startY = touch.clientY;
      turn = 0;
      draw();
      spiral.style.setProperty("--turn", "0deg");
      spiral.dataset.state = "down";
    };
    const move = (event) => {
      if (spiral.dataset.state !== "down") return;
      const touch = event.touches[0];
      fingerX = touch.clientX;
      fingerY = touch.clientY;
      if (!frame) frame = requestAnimationFrame(follow);
      // About a full turn for every 32px the finger travels
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
      cancelAnimationFrame(frame);
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
