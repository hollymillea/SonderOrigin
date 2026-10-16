import { Header } from "@/components/Header/Header";
import { Hero } from "@/components/Hero/Hero";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={`helvetica-now-display surface ${styles.page}`}>
      <Header />
      <Hero />
    </div>
  );
}
