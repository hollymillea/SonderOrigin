import styles from "./ArtistPreview.module.css";

// Keep the outgoing portrait visible beneath the desktop closing wipe.
export function ArtistPreview({ artists, active, lingering }) {
  return (
    <aside id="artist-preview" className={styles.preview} aria-label="Artist portrait">
      {artists.map((artist, index) => (
        <div
          key={artist.name}
          className={`${styles.portrait} ${active === index || lingering === index ? styles.visible : ""}`}
          style={{ "--portrait-crop": artist.crop, "--portrait-zoom": artist.cropZoom }}
          aria-hidden={active !== index}
        >
          <img src={artist.image} alt={artist.name} width="1500" height="1500" />
        </div>
      ))}
    </aside>
  );
}
