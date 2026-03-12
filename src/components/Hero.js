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
  const [hoveredArtist, setHoveredArtist] = useState("");

  return (
    <div className={styles.section}>
      <section
        className={`${styles.container} ${
          hoveredArtist ? styles.containerHovered : ""
        }`}
        data-header="light"
      >
        <div className={styles.texts}>
          <p className={`${styles.microText} ${styles.t1}`}>
            Sonder Origin is a collective dedicated to elevating artists through
            Creative Direction, Social Strategy, and Content Creation.
          </p>
          <p className={`${styles.microText} ${styles.t2}`}>
            We champion authenticity, crafting storytelling-driven content that
            reflects who the artist truly is — moment by moment, era by era.
          </p>
          <p className={`${styles.microText} ${styles.t3}`}>
            Social media is our stage for immersive storytelling.
          </p>
          <p className={`${styles.microText} ${styles.t4}`}>
            Where aesthetic, narrative, and identity come together to build
            lasting worlds that evolve with the artist.
          </p>
          <p className={`${styles.microText} ${styles.t5}`}>
            Our goal is to create content that not only resonates now, but
            stands the test of time.
          </p>
        </div>

        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg"
            alt="Sonder Origin logo"
          />
        </div>

        <div className={styles.clients}>
          {artists.map((artist) => (
            <div
              key={artist.name}
              className={styles.artist}
              onMouseEnter={() => setHoveredArtist(artist.name)}
              onMouseLeave={() => setHoveredArtist("")}
            >
              <img
                className={styles.artistImage}
                src={artist.image}
                alt={artist.name}
              />
            </div>
          ))}
        </div>

        <div
          className={`${styles.artistDisplay} ${
            hoveredArtist ? styles.artistDisplayVisible : ""
          }`}
        >
          <span className={styles.artistDisplayText}>{hoveredArtist}</span>
        </div>
      </section>
    </div>
  );
}