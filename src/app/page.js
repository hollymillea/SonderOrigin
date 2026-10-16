import { Header } from "@/components/Header/Header";
import { Hero } from "@/components/Hero/Hero";
import { TouchSpiral } from "@/components/Hero/TouchSpiral";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={`helvetica-now-display surface ${styles.page}`}>
      <Header />
      <Hero />
      {/* Outside the hero, whose isolated stacking would keep it under the
          header */}
      <TouchSpiral />
    </div>
  );
}
