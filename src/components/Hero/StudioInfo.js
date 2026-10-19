import styles from "./StudioInfo.module.css";
import { settings } from "@/data/settings";

function Lines({ lines }) {
  return lines.map((line, index) => <span key={index}>{index > 0 && <br />}{line}</span>);
}

// Services and the studio note.
export function StudioInfo() {
  return (
    <>
      <p className={styles.services}>
        <span><Lines lines={settings.services} /></span>
      </p>
      <div className={styles.studioNote}>
        <p className={styles.note}>
          <span><Lines lines={settings.studioNote} /></span>
        </p>
      </div>
    </>
  );
}
