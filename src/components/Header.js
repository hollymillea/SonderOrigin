import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.items} aria-label="Primary">
        <a href="#about">About</a>
      </nav>
    </header>
  );
}
