"use client";

import { useState } from "react";
import styles from "./Hero.module.css";

const artists = [
  { name: "Ali Coulibably", image: "/images/1.png" },
  { name: "Annahstasia", image: "/images/2.png" },
  { name: "MRCY", image: "/images/3.png" },
  { name: "Olivia Dean", image: "/images/4.png" },
  { name: "Joviale", image: "/images/5.png" },
  { name: "Cari", image: "/images/6.png" },
  { name: "Gia Ford", image: "/images/7.png" },
  { name: "Jessy Blakemore", image: "/images/8.png" },
];

export function Hero() {
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);
  const active = hovered ?? focused ?? selected;

  return (
    <main id="clients" className={styles.section}>
      <h1 className={styles.heading}>Selected artists</h1>

      <div className={styles.roster}>
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

        <aside id="artist-preview" className={`${styles.preview} ${active !== null ? styles.previewActive : ""}`} aria-label="Artist portrait">
          <div className={styles.imageFrame}>
            {artists.map((artist, index) => (
              <img
                key={artist.name}
                src={artist.image}
                alt={artist.name}
                width="1500"
                height="1500"
                className={`${styles.portrait} ${active === index ? styles.visible : ""}`}
                aria-hidden={active !== index}
              />
            ))}
          </div>
        </aside>
      </div>

    </main>
  );
}
