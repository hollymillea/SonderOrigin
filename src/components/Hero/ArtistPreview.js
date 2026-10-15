import { artists } from "@/data/artists";
import styles from "./ArtistPreview.module.css";

// In stack mode each print lands slightly offset, so the pile reads as separate prints
const printShift = [[-2, 1], [3, -2], [-1, 3], [2, 2], [-3, -1], [1, -3], [3, 1], [-2, -2]];

// The artist portraits. Where they sit depends on the image placement on the
// hero (see ArtistPreview.module.css).
//   active    - the artist showing, or null
//   stack     - artists in the order they were shown, oldest first; this
//               sets which print sits on top
//   stacking  - stack mode: the earlier prints stay on the table
//   lingering - an artist kept visible after it stops being active (thirds
//               wipes the photo out rather than fading it)
export function ArtistPreview({ active, stack, stacking, lingering }) {
  return (
    <aside id="artist-preview" className={styles.preview} aria-label="Artist portrait">
      {artists.map((artist, index) => {
        const onTable = stacking && stack.includes(index);
        const visible = active === index || onTable || lingering === index;
        return (
          <div
            key={index}
            className={`${styles.portrait} ${styles[artist.placement]} ${visible ? styles.visible : ""}`}
            style={{
              "--portrait-crop": artist.crop,
              "--portrait-zoom": artist.cropZoom,
              zIndex: stack.indexOf(index) + 1,
              // How many prints sit on top of this one; deeper prints fade out
              "--depth": onTable ? stack.length - 1 - stack.indexOf(index) : 0,
              "--shift-x": `${printShift[index % printShift.length][0]}%`,
              "--shift-y": `${printShift[index % printShift.length][1]}%`,
            }}
            aria-hidden={active !== index}
          >
            <img src={artist.image} alt={artist.name} width="1500" height="1500" />
          </div>
        );
      })}
    </aside>
  );
}
