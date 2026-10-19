import { artists } from "@/data/artists";
import styles from "./HeroCopy.module.css";
import { settings } from "@/data/settings";

// Intro and artist descriptions share one cell and crossfade.

// Every artist's description, with only the active one shown
export function ArtistDescriptions({ active }) {
  return artists.map((artist, index) => (
    <p
      key={index}
      className={`${styles.introText} ${active === index ? styles.shown : ""}`}
      aria-hidden={active !== index}
    >
      <span className={styles.descriptionLabel}>
        {String(index + 1).padStart(2, "0")} — {artist.name}
      </span>
      {artist.description}
    </p>
  ));
}

// Selected artists and the roster count.
export function RosterLabel() {
  return (
    <div className={`${styles.microText} ${styles.rosterLabel}`}>
      <p>
        Selected artists<br />
        <span aria-hidden="true">{String(artists.length).padStart(2, "0")}</span>
      </p>
    </div>
  );
}

// The collective intro gives way to the active artist description.
export function Intro({ showIntro, children }) {
  return (
    <div className={`${styles.microText} ${styles.intro}`}>
      <p className={`${styles.introText} ${showIntro ? styles.shown : ""}`} aria-hidden={!showIntro}>
        {settings.intro}
      </p>
      {children}
    </div>
  );
}
