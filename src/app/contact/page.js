import { Header } from "../../components/Header/Header";
import { Contact } from "../../components/Contact/Contact";
import styles from "../about/page.module.css";

export const metadata = {
  title: "Contact — Sonder Origin",
  description: "Get in touch with Sonder Origin.",
};

export default function ContactPage() {
  return (
    <div className={`helvetica-now-display surface ${styles.page}`}>
      <Header />
      <Contact />
    </div>
  );
}
