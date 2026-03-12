import { useState } from "react";
import styles from "./Hero.module.css";

const artists = [
  { name: "Ali Coulibably", image: "/images/1.png", color: "#E8DCC7" },
  { name: "Annahstasia", image: "/images/2.png", color: "#DAD8E6" },
  { name: "MRCY", image: "/images/3.png", color: "#D6E3DA" },
  { name: "Olivia Dean", image: "/images/4.png", color: "#F1D6D6" },
  { name: "Joviale", image: "/images/5.png", color: "#E6E1D4" },
  { name: "Cari", image: "/images/6.png", color: "#D9E1EC" },
  { name: "Gia Ford", image: "/images/7.png", color: "#E4D8E8" },
  { name: "Jessy Blakemore", image: "/images/8.png", color: "#E7E3DB" },
];

export function Hero() {
  const [hoveredArtist, setHoveredArtist] = useState("");
  const [bgColor, setBgColor] = useState("");

  return (
    <div className={styles.section}>
      <section
        className={`${styles.container} ${
          hoveredArtist ? styles.containerHovered : ""
        }`}
        style={{ backgroundColor: bgColor }}
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
              onMouseEnter={() => {
                setHoveredArtist(artist.name);
                setBgColor(artist.color);
              }}
              onMouseLeave={() => {
                setHoveredArtist("");
                setBgColor("");
              }}
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