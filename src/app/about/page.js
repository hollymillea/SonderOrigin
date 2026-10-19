import { Header } from "../../components/Header/Header";
import { About } from "../../components/About/About";
import styles from "./page.module.css";

export const metadata = {
  title: "About — Sonder Origin",
  description: "Shan and Sonder Origin: artist-led, story-driven.",
};

export default function AboutPage() {
  return (
    <div className={`helvetica-now-display surface ${styles.page}`}>
      <Header />
      <About />
    </div>
  );
}
