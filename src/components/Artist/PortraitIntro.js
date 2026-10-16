import Link from "next/link";
import { ArtistName } from "./ArtistName";
import { ScrollCue } from "./ScrollCue";
import styles from "./PortraitIntro.module.css";

// First screen of an artist page or About: a back link over a small label,
// a line or two of copy, the portrait in the last third and the name across
// the bottom, inverting where it crosses the photo
//   label - small text under the back link, e.g. "Artist 04 / 08"
//   image - { src, alt, crop, zoom }
//   lines - optional, how to break the name; otherwise one word per line
export function PortraitIntro({ name, lines, label, image, children }) {
  return (
    <section className={styles.intro}>
      <div className={`${styles.microText} ${styles.meta}`}>
        <Link href="/" className={styles.back}>← Selected artists</Link>
        <p>{label}</p>
      </div>

      <div className={styles.copy}>
        <p className={`${styles.microText} ${styles.about}`}>{children}</p>

        <ScrollCue />
      </div>

      <div className={styles.portrait} data-under-header style={{ "--portrait-crop": image.crop, "--portrait-zoom": image.zoom }}>
        <div className={styles.portraitMotion}>
          <img src={image.src} alt={image.alt} width="1500" height="1500" />
        </div>
      </div>

      <ArtistName name={name} lines={lines} className={styles.name} scrollTitle />
    </section>
  );
}
