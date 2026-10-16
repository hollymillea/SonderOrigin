import Link from "next/link";
import { PortraitIntro } from "@/components/Artist/PortraitIntro";
import { about } from "@/data/about";
import { artists, artistSlug } from "@/data/artists";
import styles from "./About.module.css";

// Shan's portrait and name, as an artist page opens, then her story in a
// readable size with the roster and services in small columns beneath
export function About() {
  return (
    <main>
      <PortraitIntro name={about.name} label={<>About<br />{about.role}</>} image={about.image}>
        {about.intro}
      </PortraitIntro>

      <section className={styles.story} aria-label={`About ${about.name}`}>
        <p className={styles.label}>01 — Her work</p>

        <div className={styles.bio}>
          {about.bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className={styles.list}>
          <p className={styles.listTitle}>Selected artists</p>
          <ul>
            {artists.map((artist) => (
              <li key={artist.name}>
                <Link href={`/artists/${artistSlug(artist)}/`}>{artist.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.list} ${styles.services}`}>
          <p className={styles.listTitle}>Services</p>
          <ul>
            {about.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
