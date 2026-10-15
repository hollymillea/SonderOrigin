import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Video } from "@/components/Video";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="helvetica-now-display">
      <Header />
      <Hero />
      <section id="about" className={styles.about}>
        <span className={styles.label}>Our approach</span>
        <p>We champion authenticity, crafting storytelling-driven content that reflects who the artist truly is.</p>
        <span className={styles.note}>Where aesthetic, narrative, and identity come together.</span>
      </section>
      <div id="film" className={styles.film}><Video /></div>
    </div>
  );
}
