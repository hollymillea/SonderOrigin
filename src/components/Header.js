import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
        </div>

        <div className={styles.center}>
        </div>

        <nav className={styles.right} aria-label="Primary">
            <div className={styles.items}>
                <a href="#">CLIENTS</a>
                <a href="#">INSTAGRAM</a>
                <a href="#">CONTACT</a>
            </div>
        </nav>
      </div>
    </header>
  );
}