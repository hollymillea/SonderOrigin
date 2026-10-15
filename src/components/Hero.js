"use client";

import { useState } from "react";
import styles from "./Hero.module.css";

const artists = [
  { name: "Ali Coulibably", image: "/images/1.png", placement: "high" },
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
  const [logoOnRight, setLogoOnRight] = useState(false);
  const [imagesOnTop, setImagesOnTop] = useState(false);
  const active = hovered ?? focused ?? selected;

  return (
    <main
      id="clients"
      className={`${styles.section} ${logoOnRight ? styles.logoRight : ""} ${imagesOnTop ? styles.imagesTop : ""}`}
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
            aria-label={`Place logo on the ${logoOnRight ? "left" : "right"}`}
            aria-pressed={logoOnRight}
            onClick={() => setLogoOnRight((onRight) => !onRight)}
          >
            <span className={styles.toggleIndicator} aria-hidden="true" />
            Logo <span aria-hidden="true">{logoOnRight ? "Right" : "Left"}</span>
          </button>
          <button
            type="button"
            className={styles.animationToggle}
            aria-label={`Place images ${imagesOnTop ? "down the side" : "along the top"}`}
            aria-pressed={imagesOnTop}
            onClick={() => setImagesOnTop((onTop) => !onTop)}
          >
            <span className={styles.toggleIndicator} aria-hidden="true" />
            Images <span aria-hidden="true">{imagesOnTop ? "Top" : "Side"}</span>
          </button>
        </div>
        <ol
          id="artist-list"
          className={`${styles.artists} ${active !== null ? styles.hasActive : ""} ${nameAnimation ? styles.animated : ""}`}
          style={{ "--artist-count": artists.length }}
        >
          {artists.map((artist, index) => (
            <li key={artist.name} className={active === index ? styles.activeRow : ""}>
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

      <div className={`${styles.logo} ${styles.logoForeground}`} aria-hidden="true">
        <img src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg" alt="" width="473" height="252" />
      </div>

    </main>
  );
}
