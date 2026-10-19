import { Header } from "../../components/Header/Header";
import { Gallery } from "../../components/Gallery/Gallery";
import styles from "./page.module.css";

export const metadata = {
  title: "Gallery — Sonder Origin",
  description: "Moments from the artists Sonder Origin works with.",
};

export default function GalleryPage() {
  return (
    <div className={`helvetica-now-display surface ${styles.page}`}>
      <Header />
      <Gallery />
    </div>
  );
}
