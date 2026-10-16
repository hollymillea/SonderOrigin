"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Showreel } from "./Showreel";
import styles from "./Header.module.css";

export function Header() {
  const [showReel, setShowReel] = useState(false);
  const closeShowReel = useCallback(() => setShowReel(false), []);
  // Away from the home page the icon still previews the reel, but takes you home
  const onHome = usePathname() === "/";
  const router = useRouter();
  const headerRef = useRef(null);
  useOverPhoto(headerRef);

  return (
    <>
      <Showreel open={showReel} onClose={closeShowReel} />
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
            onClick={() => {
              if (!onHome) router.push("/");
              else if (window.matchMedia("(hover: hover)").matches) setShowReel(true);
              else setShowReel((open) => !open);
            }}
          >
            <img src="/images/icon.png" alt="" width="200" height="119" />
          </button>
          <Link href="/gallery/">GALLERY</Link>
          <a href="#about">ABOUT</a>
          <span>CONTACT</span>
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
