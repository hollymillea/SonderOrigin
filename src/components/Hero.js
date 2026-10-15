"use client";

import { useState } from "react";
import styles from "./Hero.module.css";

const artists = [
  { name: "Ali Coulibably", image: "/images/1.png", placement: "high" },
  { name: "Annahstasia", image: "/images/2.png", placement: "edge" },
  { name: "MRCY", image: "/images/3.png", placement: "wide" },
  { name: "Olivia Dean", image: "/images/4.png", placement: "edge" },
  { name: "Joviale", image: "/images/5.png", placement: "high" },
  { name: "Cari", image: "/images/6.png", placement: "wide" },
  { name: "Gia Ford", image: "/images/7.png", placement: "high" },
  { name: "Jessy Blakemore", image: "/images/8.png", placement: "edge" },
];

export function Hero() {
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);
  const active = hovered ?? focused ?? selected;

  return (
    <main id="clients" className={styles.section}>
      <h1 className={styles.heading}>Selected artists</h1>

      <div className={styles.logo}>
        <img src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg" alt="Sonder Origin" width="473" height="252" />
      </div>

      <div className={styles.roster}>
        <p className={`${styles.microText} ${styles.intro}`}>
          Sonder Origin is a collective dedicated to elevating artists and building lasting worlds around them.
        </p>
        <p className={`${styles.microText} ${styles.services}`}>
          Creative direction<br />Social strategy<br />Content creation
        </p>
        <p className={`${styles.microText} ${styles.note}`}>
          Artist-led. Story-driven.<br />Moment by moment,<br />era by era.
        </p>
        <ol className={`${styles.artists} ${active !== null ? styles.hasActive : ""}`}>
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

    </main>
  );
}
