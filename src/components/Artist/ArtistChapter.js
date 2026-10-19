import styles from "./ArtistChapter.module.css";

const count = (n) => String(n).padStart(2, "0");

// A handful of images with a line or two of text. The layout name picks the
// arrangement (see ArtistChapter.module.css)
export function ArtistChapter({ chapter, number }) {
  return (
    <section className={styles.chapter} data-layout={chapter.layout} aria-labelledby={`chapter-${number}`}>
      <div className={styles.text} data-scroll-reveal>
        <h2 id={`chapter-${number}`} className={styles.title}>
          {count(number)} — {chapter.title}
        </h2>
        <p>{chapter.text}</p>
      </div>

      <div className={styles.images}>
        {chapter.images.map((image, index) => (
          <figure key={index} className={styles.figure} data-scroll-reveal="image" data-scroll-delay={(index % 2) * 100}>
            <div className={styles.frame}>
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                style={{ objectPosition: image.crop }}
              />
            </div>
            <figcaption className={styles.caption} aria-hidden="true">
              {count(number)}.{index + 1}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
