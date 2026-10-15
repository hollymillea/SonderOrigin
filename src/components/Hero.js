"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

const artists = [
  { name: "Abi Coulibably", image: "/images/1.png", placement: "high" },
  { name: "Annahstasia", image: "/images/2.png", placement: "middle" },
  { name: "MRCY", image: "/images/3.png", placement: "lower" },
  { name: "Olivia Dean", image: "/images/4.png", placement: "middle" },
  { name: "Joviale", image: "/images/5.png", placement: "high" },
  { name: "Cari", image: "/images/6.png", placement: "lower" },
  { name: "Gia Ford", image: "/images/7.png", placement: "high" },
  { name: "Jessy Blakemore", image: "/images/8.png", placement: "middle" },
];

export function Hero() {
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);
  const [nameAnimation, setNameAnimation] = useState(true);
  const [textAgainstLogo, setTextAgainstLogo] = useState(false);
  const [imagesOnTop, setImagesOnTop] = useState(false);
  const listRef = useRef(null);
  const active = hovered ?? focused ?? selected;

  // Names start at the bottom of the screen and can scroll up until the first one reaches the top
  useEffect(() => {
    const list = listRef.current;
    const fit = () => {
      const items = list.children;
      const first = items[0];
      const last = items[items.length - 1];
      const namesHeight = last.offsetTop + last.offsetHeight - first.offsetTop;
      list.style.setProperty("--scroll-space", `${Math.max(0, list.clientHeight - namesHeight)}px`);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // Scrolling anywhere on the page, header included, moves the names
  useEffect(() => {
    const list = listRef.current;
    const forwardWheel = (event) => {
      if (list.contains(event.target) || event.ctrlKey) return;
      // Keep the page itself still (no bounce), and move the names instead
      event.preventDefault();
      list.scrollTop += event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
    };
    window.addEventListener("wheel", forwardWheel, { passive: false });
    return () => window.removeEventListener("wheel", forwardWheel);
  }, []);

  return (
    <main
      id="clients"
      className={`${styles.section} ${textAgainstLogo ? styles.textRight : ""} ${imagesOnTop ? styles.imagesTop : ""}`}
    >
      <h1 className={styles.heading}>Selected artists</h1>

      <div className={styles.logo}>
        <img src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg" alt="Sonder Origin" width="473" height="252" />
      </div>

      <div className={styles.roster}>
        <p className={`${styles.microText} ${styles.intro}`}>
          <span>Sonder Origin is a collective dedicated to elevating artists and building lasting worlds around them.</span>
        </p>
        <p className={`${styles.microText} ${styles.services}`}>
          <span>Creative direction<br />Social strategy<br />Content creation</span>
        </p>
        <div className={styles.studioNote}>
          <p className={`${styles.microText} ${styles.note}`}>
            <span>Artist-led. Story-driven.<br />Moment by moment,<br />era by era.</span>
          </p>
          <button
            type="button"
            className={styles.animationToggle}
            aria-label="Animate artist names"
            aria-pressed={nameAnimation}
            aria-controls="artist-list"
            onClick={() => setNameAnimation((enabled) => !enabled)}
          >
            <span className={styles.toggleIndicator} aria-hidden="true" />
            Motion <span aria-hidden="true">{nameAnimation ? "On" : "Off"}</span>
          </button>
          <button
            type="button"
            className={styles.animationToggle}
            aria-label={`Align artist names ${textAgainstLogo ? "left" : "right, against the logo"}`}
            aria-pressed={textAgainstLogo}
            aria-controls="artist-list"
            onClick={() => setTextAgainstLogo((against) => !against)}
          >
            <span className={styles.toggleIndicator} aria-hidden="true" />
            Text <span aria-hidden="true">{textAgainstLogo ? "Right" : "Left"}</span>
          </button>
          <button
            type="button"
            className={styles.animationToggle}
            aria-label={`Place images ${imagesOnTop ? "on the right" : "along the top"}`}
            aria-pressed={imagesOnTop}
            onClick={() => setImagesOnTop((onTop) => !onTop)}
          >
            <span className={styles.toggleIndicator} aria-hidden="true" />
            Images <span aria-hidden="true">{imagesOnTop ? "Top" : "Right"}</span>
          </button>
        </div>
        <ol
          id="artist-list"
          ref={listRef}
          className={`${styles.artists} ${active !== null ? styles.hasActive : ""} ${nameAnimation ? styles.animated : ""}`}
        >
          {artists.map((artist, index) => (
            <li key={artist.name}>
              <button
                type="button"
                className={`${styles.artist} ${active === index ? styles.active : ""}`}
                aria-controls="artist-preview"
                aria-pressed={selected === index}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch") setHovered(index);
                }}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setFocused(index)}
                onBlur={() => setFocused(null)}
                onClick={() => setSelected(selected === index ? null : index)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSelected(null);
                    event.currentTarget.blur();
                  }
                }}
              >
                <span className={styles.name}>{artist.name}</span>
              </button>
            </li>
          ))}
        </ol>

        <aside id="artist-preview" className={styles.preview} aria-label="Artist portrait">
          {artists.map((artist, index) => (
            <img
              key={artist.name}
              src={artist.image}
              alt={artist.name}
              width="1500"
              height="1500"
              className={`${styles.portrait} ${styles[artist.placement]} ${active === index ? styles.visible : ""}`}
              aria-hidden={active !== index}
            />
          ))}
        </aside>
      </div>

      <div className={`${styles.logo} ${styles.logoGhost}`} aria-hidden="true">
        <img src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg" alt="" width="473" height="252" />
      </div>

    </main>
  );
}
