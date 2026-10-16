import Link from "next/link";
import { artists, artistSlug } from "@/data/artists";
import { ArtistName } from "./ArtistName";
import styles from "./NextArtist.module.css";

const count = (n) => String(n).padStart(2, "0");

// Closes the page on the next artist's name, after the hero's spiral divider
export function NextArtist({ index }) {
  const nextIndex = (index + 1) % artists.length;
  const next = artists[nextIndex];

  return (
    <footer className={styles.footer}>
      <img className={styles.divider} src="/images/cursor@2x.png" alt="" width="64" height="64" />

      <Link href={`/artists/${artistSlug(next)}/`} className={styles.link}>
        <span className={styles.label}>
          Next artist<br />
          {count(nextIndex + 1)} / {count(artists.length)}
        </span>
        <ArtistName name={next.name} as="span" className={styles.name} />
      </Link>
    </footer>
  );
}
