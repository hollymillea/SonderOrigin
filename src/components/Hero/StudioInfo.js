import styles from "./StudioInfo.module.css";

// Services and the studio note.
export function StudioInfo() {
  return (
    <>
      <p className={styles.services}>
        <span>Creative direction<br />Social strategy<br />Content creation</span>
      </p>
      <div className={styles.studioNote}>
        <p className={styles.note}>
          <span>Artist-led. Story-driven.<br />Moment by moment,<br />era by era.</span>
        </p>
      </div>
    </>
  );
}
