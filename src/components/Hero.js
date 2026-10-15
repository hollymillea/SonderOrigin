"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

const artists = [
  {
    name: "Abi Coulibably",
    image: "/images/1.png",
    placement: "high",
    description: "As Aby’s full-time manager, we work closely with her to build a career that’s as honest and genre-defiant as her music. Strategy, storytelling, and space to grow—always on her terms.",
  },
  {
    name: "Annahstasia",
    image: "/images/2.png",
    placement: "middle",
    description: "For Annahstasia’s Tether release, we leaned into her world of sensuality, earth, and ritual. Our content honored the craft and emotion she pours into every part of her work while highlighting the multi-talented being she is.",
  },
  {
    name: "MRCY",
    image: "/images/3.png",
    placement: "lower",
    description: "Collaborating with MRCY on their Volume 2 era, we created content that matched the depth and texture of their sound. Soul, jazz, and electronic influences shaped a world that feels both grounded and expansive.",
  },
  {
    name: "Olivia Dean",
    image: "/images/4.png",
    placement: "middle",
    description: "For Olivia Dean’s Messy Tour, we created content that mirrored her soulful, genre-blending sound and commitment to authenticity. From intimate backstage moments to dynamic stage visuals, our work captured the warmth, imperfection, and emotional honesty that define her artistry. We aimed to reflect Olivia’s embrace of life’s messiness and her desire to connect deeply with her audience.",
  },
  {
    name: "Joviale",
    image: "/images/5.png",
    placement: "high",
    description: "Joviale’s Mount Crystal universe is cinematic, strange, and stunning. We built content that matched their vision—full of danger, desire, and raw beauty.",
  },
  {
    name: "Cari",
    image: "/images/6.png",
    placement: "lower",
    description: "With Cari, we shaped the rollout for her single Bleeding—from content to strategy. Everything was rooted in her bold, empowering energy and her instinct for visual storytelling.",
  },
  {
    name: "Gia Ford",
    image: "/images/7.png",
    placement: "high",
    description: "Our work with Gia Ford spans the re-release of her debut album Turbo Dreams and the early creative direction for her upcoming project. Both phases are a chance to explore her world visually and strategically, staying close to the mood, detail, and edge that defines her.",
  },
  {
    name: "Jessy Blakemore",
    image: "/images/8.png",
    placement: "middle",
    description: "We’re working with Jessy Blakemore to hone her creative visual identity, shaping the content and campaign assets around her music. Together, we’re building the visuals for her upcoming singles, including her latest feature on Russ’s track Recognize.",
  },
];

// The Images toggle cycles through these
const imagePlacements = ["right", "top", "bottom"];
const imagePlacementClass = { right: "imagesRight", top: "imagesTop", bottom: "imagesBottom" };

// The Copy toggle cycles the artist description between these spots
const copyPlacements = ["intro", "name", "label"];

export function Hero() {
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);
  const [nameAnimation, setNameAnimation] = useState(true);
  const [namesOnTop, setNamesOnTop] = useState(false);
  const namesOnTopRef = useRef(namesOnTop);
  const [imagePlacement, setImagePlacement] = useState("right");
  const [copyPlacement, setCopyPlacement] = useState("intro");
  const [copyY, setCopyY] = useState(0);
  const [scrolled, setScrolled] = useState(null);
  const listRef = useRef(null);
  const rosterRef = useRef(null);
  const nameCopyRef = useRef(null);
  const lastScroll = useRef(0);
  const active = hovered ?? focused ?? selected ?? scrolled;

  // Scrolling steps through the artists: the scroll range is split into equal steps,
  // the first showing the intro and then one per artist
  const pickFromScroll = () => {
    const list = listRef.current;
    const range = list.scrollHeight - list.clientHeight;
    if (range <= 0) return;
    // Distance travelled from where the names rest (bottom, or top when flipped)
    const travelled = namesOnTopRef.current ? range - list.scrollTop : list.scrollTop;
    const step = Math.floor((travelled / range) * (artists.length + 1)) - 1;
    setScrolled(step < 0 ? null : Math.min(artists.length - 1, step));
    // Scrolling takes over from a clicked or hovered name
    setSelected(null);
    setHovered(null);
    lastScroll.current = performance.now();
    placeNameCopy();
  };

  // In "name" mode the description lines up with the active name, kept on screen
  const placeNameCopy = () => {
    const copy = nameCopyRef.current;
    const button = listRef.current?.querySelector(`.${styles.active}`);
    if (!copy || !button) return;
    const rosterBox = rosterRef.current.getBoundingClientRect();
    const top = button.getBoundingClientRect().top - rosterBox.top;
    setCopyY(Math.max(0, Math.min(top, rosterBox.height - copy.offsetHeight)));
  };

  useLayoutEffect(placeNameCopy, [active, copyPlacement]);

  // Names start at the bottom of the screen and can scroll up until the first one reaches the top
  useEffect(() => {
    const list = listRef.current;
    const fit = () => {
      const items = list.children;
      const first = items[0];
      const last = items[items.length - 1];
      const namesHeight = last.offsetTop + last.offsetHeight - first.offsetTop;
      list.style.setProperty("--scroll-space", `${Math.max(0, list.clientHeight - namesHeight)}px`);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // Names rest at the bottom, or at the top when flipped
  useLayoutEffect(() => {
    namesOnTopRef.current = namesOnTop;
    const list = listRef.current;
    list.scrollTop = namesOnTop ? list.scrollHeight - list.clientHeight : 0;
    setScrolled(null);
  }, [namesOnTop]);

  // Scrolling anywhere on the page, header included, moves the names.
  // When the names rest at the top, scrolling down moves them down
  useEffect(() => {
    const list = listRef.current;
    const forwardWheel = (event) => {
      if (event.ctrlKey) return;
      if (list.contains(event.target) && !namesOnTopRef.current) return;
      // Keep the page itself still (no bounce), and move the names instead
      event.preventDefault();
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      list.scrollTop += namesOnTopRef.current ? -delta : delta;
    };
    window.addEventListener("wheel", forwardWheel, { passive: false });
    return () => window.removeEventListener("wheel", forwardWheel);
  }, []);

  const descriptions = artists.map((artist, index) => (
    <p
      key={artist.name}
      className={`${styles.introText} ${active === index ? styles.shown : ""}`}
      aria-hidden={active !== index}
    >
      <span className={styles.descriptionLabel}>
        {String(index + 1).padStart(2, "0")} — {artist.name}
      </span>
      {artist.description}
    </p>
  ));

  return (
    <main
      id="clients"
      className={`${styles.section} ${styles[imagePlacementClass[imagePlacement]]}`}
    >
      <h1 className={styles.heading}>Selected artists</h1>

      <div className={styles.logo}>
        <img src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg" alt="Sonder Origin" width="473" height="252" />
      </div>

      <div className={styles.roster} ref={rosterRef}>
        <div className={`${styles.microText} ${styles.rosterLabel}`}>
          <p>
            Selected artists<br />
            <span aria-hidden="true">{String(artists.length).padStart(2, "0")}</span>
          </p>
          {copyPlacement === "label" && <div className={styles.labelCopy}>{descriptions}</div>}
        </div>

        {/* In "intro" mode the intro swaps to the active artist's description */}
        <div className={`${styles.microText} ${styles.intro}`}>
          <p
            className={`${styles.introText} ${active === null || copyPlacement !== "intro" ? styles.shown : ""}`}
            aria-hidden={active !== null && copyPlacement === "intro"}
          >
            Sonder Origin is a collective dedicated to elevating artists and building lasting worlds around them.
          </p>
          {copyPlacement === "intro" && descriptions}
        </div>

        {copyPlacement === "name" && (
          <div
            ref={nameCopyRef}
            className={`${styles.microText} ${styles.nameCopy}`}
            style={{ "--copy-y": `${copyY}px` }}
          >
            {descriptions}
          </div>
        )}
        <p className={`${styles.microText} ${styles.services}`}>
          <span>Creative direction<br />Social strategy<br />Content creation</span>
        </p>
        <div className={styles.studioNote}>
          <p className={`${styles.microText} ${styles.note}`}>
            <span>Artist-led. Story-driven.<br />Moment by moment,<br />era by era.</span>
          </p>
          <button
            type="button"
            className={styles.animationToggle}
            aria-label="Animate artist names"
            aria-pressed={nameAnimation}
            aria-controls="artist-list"
            onClick={() => setNameAnimation((enabled) => !enabled)}
          >
            <span className={styles.toggleIndicator} aria-hidden="true" />
            Motion <span aria-hidden="true">{nameAnimation ? "On" : "Off"}</span>
          </button>
          <button
            type="button"
            className={styles.animationToggle}
            aria-label={`Rest artist names at the ${namesOnTop ? "bottom" : "top"}`}
            aria-pressed={namesOnTop}
            aria-controls="artist-list"
            onClick={() => setNamesOnTop((onTop) => !onTop)}
          >
            <span className={styles.toggleIndicator} aria-hidden="true" />
            Text <span aria-hidden="true">{namesOnTop ? "Top" : "Bottom"}</span>
          </button>
          <button
            type="button"
            className={styles.animationToggle}
            aria-label={`Image placement: ${imagePlacement}. Change placement`}
            aria-pressed={imagePlacement !== "right"}
            onClick={() => setImagePlacement((current) => imagePlacements[(imagePlacements.indexOf(current) + 1) % imagePlacements.length])}
          >
            <span className={styles.toggleIndicator} aria-hidden="true" />
            Images <span aria-hidden="true">{imagePlacement}</span>
          </button>
          <button
            type="button"
            className={styles.animationToggle}
            aria-label={`Description placement: ${copyPlacement}. Change placement`}
            aria-pressed={copyPlacement !== "intro"}
            onClick={() => setCopyPlacement((current) => copyPlacements[(copyPlacements.indexOf(current) + 1) % copyPlacements.length])}
          >
            <span className={styles.toggleIndicator} aria-hidden="true" />
            Copy <span aria-hidden="true">{copyPlacement}</span>
          </button>
        </div>
        <ol
          id="artist-list"
          ref={listRef}
          onScroll={pickFromScroll}
          className={`${styles.artists} ${active !== null ? styles.hasActive : ""} ${nameAnimation ? styles.animated : ""}`}
        >
          {artists.map((artist, index) => (
            <li key={artist.name}>
              <button
                type="button"
                className={`${styles.artist} ${active === index ? styles.active : ""}`}
                aria-controls="artist-preview"
                aria-pressed={selected === index}
                onPointerEnter={(event) => {
                  // Names sliding under a still pointer while scrolling shouldn't count as hover
                  const scrolling = performance.now() - lastScroll.current < 200;
                  if (event.pointerType !== "touch" && !scrolling) setHovered(index);
                }}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setFocused(index)}
                onBlur={() => setFocused(null)}
                onClick={() => setSelected(selected === index ? null : index)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSelected(null);
                    event.currentTarget.blur();
                  }
                }}
              >
                <span className={styles.name}>{artist.name}</span>
              </button>
            </li>
          ))}
        </ol>

        <aside id="artist-preview" className={styles.preview} aria-label="Artist portrait">
          {artists.map((artist, index) => (
            <img
              key={artist.name}
              src={artist.image}
              alt={artist.name}
              width="1500"
              height="1500"
              className={`${styles.portrait} ${styles[artist.placement]} ${active === index ? styles.visible : ""}`}
              aria-hidden={active !== index}
            />
          ))}
        </aside>
      </div>

    </main>
  );
}
