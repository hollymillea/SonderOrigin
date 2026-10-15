import styles from "./StudioInfo.module.css";

// Services and the studio note, with the design toggles tucked under the note
export function StudioInfo({ children }) {
  return (
    <>
      <p className={styles.services}>
        <span>Creative direction<br />Social strategy<br />Content creation</span>
      </p>
      <div className={styles.studioNote}>
        <p className={styles.note}>
          <span>Artist-led. Story-driven.<br />Moment by moment,<br />era by era.</span>
        </p>
        {children}
      </div>
    </>
  );
}

// One design toggle: a dot (filled when pressed), its name and current value
export function DesignToggle({ label, value, pressed, ariaLabel, onClick }) {
  return (
    <button type="button" className={styles.toggle} aria-label={ariaLabel} aria-pressed={pressed} onClick={onClick}>
      <span className={styles.toggleIndicator} aria-hidden="true" />
      {label} <span aria-hidden="true">{value}</span>
    </button>
  );
}
