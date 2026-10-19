"use client";

import Link from "next/link";
import { PortraitIntro } from "../Artist/PortraitIntro";
import { artistSlug } from "../../data/artists";
import styles from "./About.module.css";
import { ScrollMotion } from "../ScrollMotion/ScrollMotion";
import { useContent } from "../Content/ContentProvider";

// Shan's portrait and name, as an artist page opens, then her story in a
// readable size with the roster and services in small columns beneath, signed
// off with the wordmark
export function About() {
  const { about, artists, settings } = useContent();
  const socialLinks = (settings.socialLinks || []).filter((link) => link?.label && link?.url);
  return (
    <ScrollMotion>
      <PortraitIntro name={about.title.join(" ")} lines={about.title} label={<>About<br />{about.role}</>} image={about.image}>
        {about.intro}
      </PortraitIntro>

      <section className={styles.story} aria-label={`About ${about.name}`}>
        <p className={styles.label} data-scroll-reveal>01 — Her work</p>

        <div className={styles.bio}>
          {about.bio.map((paragraph, index) => (
            <p key={index} data-scroll-reveal data-scroll-delay={index * 100}>{paragraph}</p>
          ))}
        </div>

        <div className={styles.list}>
          <p className={styles.listTitle} data-scroll-reveal>Selected artists</p>
          <ul>
            {artists.map((artist, index) => (
              <li key={artist.name} data-scroll-reveal data-scroll-delay={index * 55}>
                <Link href={`/artists/${artistSlug(artist)}/`}>{artist.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.list} ${styles.services}`}>
          <p className={styles.listTitle} data-scroll-reveal>Services</p>
          <ul>
            {about.services.map((service, index) => (
              <li key={service} data-scroll-reveal data-scroll-delay={index * 80}>{service}</li>
            ))}
          </ul>
        </div>

        {socialLinks.length > 0 && (
          <div className={`${styles.list} ${styles.services}`}>
            <p className={styles.listTitle} data-scroll-reveal>Follow</p>
            <ul>
              {socialLinks.map((link, index) => (
                <li key={link.url} data-scroll-reveal data-scroll-delay={index * 80}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <img className={styles.logo} src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg" alt="Sonder Origin" width="473" height="252" />
      </section>
    </ScrollMotion>
  );
}
