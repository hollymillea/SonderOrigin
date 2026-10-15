import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <a href="#" className={styles.logo} aria-label="Sonder Origin home">
        <img src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg" alt="Sonder Origin" width="473" height="252" />
      </a>
      <nav className={styles.items} aria-label="Primary">
        <a href="#about">About</a>
      </nav>
    </header>
  );
}
