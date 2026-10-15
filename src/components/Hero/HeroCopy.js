import { artists } from "@/data/artists";
import styles from "./HeroCopy.module.css";

// The small text in the hero's top row, and the spots an artist's description
// can show in. Descriptions all share one cell and crossfade

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

// "Selected artists" and the count; in "label" mode the descriptions sit under it
export function RosterLabel({ children }) {
  return (
    <div className={`${styles.microText} ${styles.rosterLabel}`}>
      <p>
        Selected artists<br />
        <span aria-hidden="true">{String(artists.length).padStart(2, "0")}</span>
      </p>
      {children && <div className={styles.labelCopy}>{children}</div>}
    </div>
  );
}

// The collective's intro. In "intro" mode the descriptions swap in for it
export function Intro({ ref, showIntro, children }) {
  return (
    <div ref={ref} className={`${styles.microText} ${styles.intro}`}>
      <p className={`${styles.introText} ${showIntro ? styles.shown : ""}`} aria-hidden={!showIntro}>
        Sonder Origin is a collective dedicated to elevating artists and building lasting worlds around them.
      </p>
      {children}
    </div>
  );
}

// "caption" mode: descriptions under the framed image
export function CaptionCopy({ children }) {
  return <div className={`${styles.microText} ${styles.captionCopy}`}>{children}</div>;
}

// "name" mode: descriptions level with the active name, y measured in Hero.js
export function NameCopy({ ref, y, children }) {
  return (
    <div ref={ref} className={`${styles.microText} ${styles.nameCopy}`} style={{ "--copy-y": `${y}px` }}>
      {children}
    </div>
  );
}
