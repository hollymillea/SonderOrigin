import Link from "next/link";
import { artistSlug } from "@/data/artists";
import { ArtistName } from "./ArtistName";
import styles from "./NextArtist.module.css";

const count = (n) => String(n).padStart(2, "0");

// Closes the page on the next artist's name. The spiral above it winds round
// as the page scrolls down to it, and spins while the name is hovered
export function NextArtist({ artists, index }) {
  const nextIndex = (index + 1) % artists.length;
  const next = artists[nextIndex];

  return (
    <footer className={styles.footer}>
      <div className={styles.spiral} aria-hidden="true">
        <img src="/images/spiral.png" alt="" width="1667" height="1667" />
      </div>

      <Link href={`/artists/${artistSlug(next)}/`} className={styles.link} data-scroll-reveal>
        <span className={styles.label}>
          Next artist<br />
          {count(nextIndex + 1)} / {count(artists.length)}
        </span>
        <ArtistName name={next.name} as="span" className={styles.name} />
      </Link>
    </footer>
  );
}
