import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.items} aria-label="Primary">
        <a href="#film">SHOWREEL</a>
        <a href="#clients">GALLERY</a>
        <a href="#about">ABOUT</a>
        <span>CONTACT</span>
      </nav>
      <a href="/" className={styles.brandMark} aria-label="Sonder Origin home">
        <img src="/images/icon.png" alt="" width="200" height="119" />
      </a>
    </header>
  );
}
