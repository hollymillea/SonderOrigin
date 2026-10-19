"use client";

import Link from "next/link";
import styles from "./Contact.module.css";
import { ScrollMotion } from "../ScrollMotion/ScrollMotion";
import { useContent } from "../Content/ContentProvider";

// The email and social links from Site settings, large in the right two
// thirds, labelled in small text as on About, signed off with the wordmark
export function Contact() {
  const { settings } = useContent();
  const socialLinks = (settings.socialLinks || []).filter((link) => link?.label && link?.url);
  return (
    <ScrollMotion>
      <section className={styles.contact} aria-label="Contact">
        <div className={styles.meta}>
          <Link href="/" className={styles.back}>← Selected artists</Link>
          <h1 className={styles.label} data-scroll-reveal>Contact</h1>
        </div>

        <div className={styles.links}>
          {settings.email && (
            <div className={styles.group}>
              <p className={styles.groupTitle} data-scroll-reveal>Email</p>
              <a href={`mailto:${settings.email}`} data-scroll-reveal>{settings.email}</a>
            </div>
          )}
          {socialLinks.length > 0 && (
            <div className={styles.group}>
              <p className={styles.groupTitle} data-scroll-reveal>Follow</p>
              <ul>
                {socialLinks.map((link, index) => (
                  <li key={link.url} data-scroll-reveal data-scroll-delay={index * 80}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <img className={styles.logo} src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg" alt="" width="473" height="252" />
      </section>
    </ScrollMotion>
  );
}
