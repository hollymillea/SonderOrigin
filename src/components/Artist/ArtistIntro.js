import Link from "next/link";
import { artists } from "@/data/artists";
import { ArtistName } from "./ArtistName";
import styles from "./ArtistIntro.module.css";

const count = (n) => String(n).padStart(2, "0");

// First screen: the small text along the top, the portrait in the last third
// and the name across the bottom, inverting where it crosses the photo
export function ArtistIntro({ artist, index }) {
  return (
    <section className={styles.intro}>
      <div className={`${styles.microText} ${styles.meta}`}>
        <Link href="/" className={styles.back}>← Selected artists</Link>
        <p>
          Artist<br />
          {count(index + 1)} / {count(artists.length)}
        </p>
      </div>

      <p className={`${styles.microText} ${styles.about}`}>{artist.description}</p>

      <div className={styles.portrait} style={{ "--portrait-crop": artist.crop, "--portrait-zoom": artist.cropZoom }}>
        <img src={artist.image} alt={artist.name} width="1500" height="1500" />
      </div>

      <ArtistName name={artist.name} className={styles.name} />
    </section>
  );
}
