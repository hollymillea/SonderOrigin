import Link from "next/link";
import { artistSlug } from "@/data/artists";
import styles from "./ArtistList.module.css";

// The big names. When looping, the roster repeats with a spiral divider
// starting each pass; scrolling and selection come from useArtistBrowsing
export function ArtistList({ artists, ref, loopNames, copies, activePosition, moreBelow, onScroll, nameHandlers }) {
  return (
    <ol
      id="artist-list"
      ref={ref}
      onScroll={onScroll}
      style={{ "--artist-count": artists.length }}
      className={`${styles.artists} ${activePosition !== null ? styles.hasActive : ""} ${moreBelow ? styles.moreBelow : ""}`}
    >
      {Array.from({ length: copies }, (_, copy) => [
        loopNames && (
          <li key={`divider-${copy}`} className={styles.divider} aria-hidden="true">
            <img src="/images/cursor@2x.png" alt="" width="64" height="64" />
          </li>
        ),
        ...artists.map((artist, index) => {
          const position = copy * artists.length + index;
          // Screen readers and the keyboard only get one pass
          const isRepeat = loopNames && copy !== 1;
          return (
            <li key={position} data-pos={position} aria-hidden={isRepeat || undefined}>
              <Link
                href={`/artists/${artistSlug(artist)}/`}
                tabIndex={isRepeat ? -1 : undefined}
                className={`${styles.artist} ${activePosition === position ? styles.active : ""}`}
                {...nameHandlers(position)}
              >
                <span className={styles.name}>{artist.name}</span>
              </Link>
            </li>
          );
        }),
      ])}
    </ol>
  );
}
