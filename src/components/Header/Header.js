"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Showreel } from "./Showreel";
import styles from "./Header.module.css";
import { useContent } from "../Content/ContentProvider";

export function Header() {
  const { settings } = useContent();
  const [showReel, setShowReel] = useState(false);
  const closeShowReel = useCallback(() => setShowReel(false), []);
  // Away from the home page the icon still previews the reel, but takes you home
  const onHome = usePathname() === "/";
  const router = useRouter();
  const headerRef = useRef(null);
  useOverPhoto(headerRef);
  const touchStart = useRef(null);

  // A tap or click on the icon: home opens and closes the reel (a mouse
  // opens it on hover anyway); anywhere else it goes back home
  const activate = () => {
    if (!onHome) router.push("/");
    else if (window.matchMedia("(hover: hover)").matches) setShowReel(true);
    else setShowReel((open) => !open);
  };

  return (
    <>
      <Showreel open={showReel} onClose={closeShowReel} settings={settings} />
      <header ref={headerRef} className={styles.header} data-showreel-open={showReel}>
        <nav className={styles.items} aria-label="Primary">
          <button
            type="button"
            className={styles.brandMark}
            aria-label={onHome ? "Preview Sonder Origin showreel" : "Sonder Origin home"}
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
            onClick={activate}
            // Taps are handled here rather than left to the click, which
            // iPhone Safari can swallow as a hover, so one tap always acts
            onTouchStart={(event) => {
              const touch = event.touches[0];
              touchStart.current = { x: touch.clientX, y: touch.clientY };
            }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              touchStart.current = null;
              const touch = event.changedTouches[0];
              // A finger that moved off is a drag, not a tap
              if (!start || Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > 8) return;
              // Stops the click that would otherwise follow and act again
              event.preventDefault();
              activate();
            }}
          >
            <img src="/images/icon.png" alt="" width="200" height="119" />
          </button>
          <Link href="/gallery/">GALLERY</Link>
          <Link href="/about/">ABOUT</Link>
          <Link href="/contact/">CONTACT</Link>
        </nav>
      </header>
    </>
  );
}

// Marks each nav item sitting over a photo tagged data-under-header, and the
// header while any is, so those items can switch to solid white ink (see
// Header.module.css). Set straight on the elements to avoid re-rendering on scroll
function useOverPhoto(headerRef) {
  useEffect(() => {
    const header = headerRef.current;
    let frame = 0;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const photos = [...document.querySelectorAll("[data-under-header]")].map((photo) => photo.getBoundingClientRect());
        let any = false;
        for (const item of header.querySelectorAll("nav > *")) {
          const box = item.getBoundingClientRect();
          const x = box.left + box.width / 2;
          const y = box.top + box.height / 2;
          const over = photos.some((photo) => x >= photo.left && x <= photo.right && y >= photo.top && y <= photo.bottom);
          item.toggleAttribute("data-over-photo", over);
          any ||= over;
        }
        header.toggleAttribute("data-over-photo", any);
      });
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [headerRef]);
}
