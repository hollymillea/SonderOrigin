"use client";

import { useEffect, useRef } from "react";
import styles from "./TouchSpiral.module.css";

// Touch screens never see the spiral cursor, so the spiral follows a dragging
// finger instead, trailing a little behind so it peeks out from under it, and
// turning as it goes; it unwinds and fades when the finger lifts. It only
// appears once the finger starts to drag: anything appearing on a plain tap
// makes iPhone Safari treat the tap as a hover and drop the click (the
// showreel icon, the names). Moved straight on the element, so dragging
// doesn't re-render the hero
export function TouchSpiral() {
  const ref = useRef(null);

  useEffect(() => {
    const spiral = ref.current;
    const touchOnly = window.matchMedia("(hover: none) and (pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // How much of the remaining distance to the finger the spiral covers
    // each frame: lower trails further behind
    const FOLLOW = 0.16;
    // How far the finger moves before it counts as a drag
    const DRAG_SLOP = 8;
    let touching = false;
    let startX = 0;
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
      startX = touch.clientX;
      startY = touch.clientY;
      touching = true;
    };
    const move = (event) => {
      if (!touching) return;
      const touch = event.touches[0];
      if (spiral.dataset.state !== "down") {
        if (Math.hypot(touch.clientX - startX, touch.clientY - startY) < DRAG_SLOP) return;
        // The drag has started: appear where the finger first touched, then
        // follow it
        cancelAnimationFrame(frame);
        frame = 0;
        x = startX;
        y = startY;
        turn = 0;
        draw();
        spiral.style.setProperty("--turn", "0deg");
        spiral.dataset.state = "down";
      }
      fingerX = touch.clientX;
      fingerY = touch.clientY;
      if (!frame) frame = requestAnimationFrame(follow);
      // About a full turn for every 32px the finger travels
      turn = ((startY - touch.clientY) / 32) * 360;
      spiral.style.setProperty("--turn", `${turn}deg`);
    };
    const end = () => {
      touching = false;
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
