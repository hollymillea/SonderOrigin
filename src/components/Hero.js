import styles from "./Hero.module.css";

export function Hero() {
  return (
    <div className={styles.section}>
      <div className={styles.texts}>
        <p className={styles.microText + " " + styles.microText1}>
          Sonder Origin is a collective dedicated to elevating artists through Creative Direction, Social Strategy, and Content Creation.
        </p>
        <p className={styles.microText}>
          We champion authenticity, crafting storytelling-driven content that reflects who the artist truly is - moment by moment, era by era.
        </p>
        <p className={styles.microText}>
          Social media is our stage for immersive storytelling.
        </p>
        <p className={styles.microText}>
          Where aesthetic, narrative, and identity come together to build lasting worlds that evolve with the artist.
        </p>
        <p className={styles.microText}>
          Our goal is to create content that not only resonates now, but stands the test of time.
        </p>
      </div>
    <section className={styles.container} data-header="light">
      <div className={styles.imageContainer}>
        <img
          className={styles.image}
          src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg"
          alt="SonderOrigin logo"
        />
      </div>
      <div className={styles.clients}>
        <img src="/images/1.png"/>
        <img src="/images/2.png"/>
        <img src="/images/3.png"/>
        <img src="/images/4.png"/>
        <img src="/images/5.png"/>
        <img src="/images/6.png"/>
        <img src="/images/7.png"/>
        <img src="/images/8.png"/>
      </div>

    </section>
    </div>
  );
}