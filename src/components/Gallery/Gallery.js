"use client";

import Link from "next/link";
import styles from "./Gallery.module.css";
import { useContent } from "@/components/Content/ContentProvider";

const count = (n) => String(n).padStart(2, "0");

// The images set loosely over the 12 columns. Hovering one draws its caption
// out beneath it, if it has one
export function Gallery() {
  const { gallery } = useContent();
  return (
    <main className={styles.gallery}>
      <div className={styles.top}>
        <div className={styles.meta}>
          <Link href="/" className={styles.back}>← Selected artists</Link>
          <h1>
            Gallery<br />
            <span aria-hidden="true">{count(gallery.length)}</span>
          </h1>
        </div>
        <p className={styles.intro}>Moments from the artists we work with, era by era.</p>
      </div>

      <ul className={styles.grid}>
        {gallery.map((image, index) => (
          <li key={index} className={styles.item}>
            <figure className={styles.figure} style={image.ratio && { "--ratio": image.ratio }}>
              <div className={styles.frame} data-under-header>
                <img
                  src={image.src}
                  alt={image.alt || image.caption || "Gallery image"}
                  width={image.width}
                  height={image.height}
                  loading={index < 3 ? "eager" : "lazy"}
                  style={{ objectPosition: image.crop }}
                />
              </div>
              {image.caption && (
                <figcaption className={styles.caption}>
                  <span>{image.caption}</span>
                  <span className={styles.rule} aria-hidden="true" />
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </main>
  );
}
