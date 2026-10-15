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

// How many copies of the roster the looping list starts with; more are added
// on tall screens so it can always wrap without a visible jump
const MIN_COPIES = 4;

// Snap catches the list when it stops within this many names of a pass start
const SNAP_NAMES = 3;

// The Images toggle cycles through these
const imagePlacements = ["right", "top", "bottom", "frame"];
const imagePlacementClass = { right: "imagesRight", top: "imagesTop", bottom: "imagesBottom", frame: "imagesFrame" };

// In stack mode each print lands slightly offset, so the pile reads as separate prints
const printShift = [[-2, 1], [3, -2], [-1, 3], [2, 2], [-3, -1], [1, -3], [3, 1], [-2, -2]];

// The Copy toggle cycles the artist description between these spots
const copyPlacements = ["intro", "name", "label"];

export function Hero() {
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);
  const [imagePlacement, setImagePlacement] = useState("right");
  const [copyPlacement, setCopyPlacement] = useState("intro");
  const [stackPrints, setStackPrints] = useState(true);
  const [stack, setStack] = useState([]);
  // Names toggle: the roster once, or repeated endlessly with a divider between passes
  const [loopNames, setLoopNames] = useState(true);
  const loopRef = useRef(loopNames);
  loopRef.current = loopNames;
  const [copies, setCopies] = useState(MIN_COPIES);
  const listCopies = loopNames ? copies : 1;
  const listLength = useRef(0);
  listLength.current = listCopies * artists.length;
  const [moreBelow, setMoreBelow] = useState(false);
  const [snapToPass, setSnapToPass] = useState(true);
  const snapRef = useRef(snapToPass);
  snapRef.current = snapToPass;
  const snapTimer = useRef(0);
  const [copyY, setCopyY] = useState(0);
  const [scrolled, setScrolled] = useState(null);
  const listRef = useRef(null);
  const rosterRef = useRef(null);
  const sectionRef = useRef(null);
  const nameCopyRef = useRef(null);
  const lastScroll = useRef(0);
  // Hover, focus, click and swipe all track a position in the (possibly repeated)
  // list; the artist shown is that position's artist
  const activePosition = hovered ?? focused ?? selected ?? scrolled;
  const active = activePosition === null ? null : activePosition % artists.length;
  // Frame mode puts the description under the image as a caption
  const copySpot = imagePlacement === "frame" ? "caption" : copyPlacement;

  // On desktop scrolling only moves the names; it doesn't pick an artist
  const handleListScroll = () => {
    lastScroll.current = performance.now();
    wrapLoop();
    placeNameCopy();
    markMoreBelow();
    // Once scrolling settles, check whether to snap to a pass start
    clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(snapNearPassStart, 140);
  };

  // Snap: when the list stops within a few names of the start of a pass,
  // ease so that pass's first name sits at the top. Anywhere else it stays put.
  // Desktop, repeated names only (phones step through artists instead)
  const snapNearPassStart = () => {
    const list = listRef.current;
    if (!snapRef.current || !loopRef.current || window.matchMedia("(max-width: 760px)").matches) return;
    const padding = parseFloat(getComputedStyle(list, "::before").height) || 0;
    let nearest = null;
    list.querySelectorAll("li[data-pos]").forEach((item) => {
      if (Number(item.dataset.pos) % artists.length !== 0) return;
      const target = item.offsetTop - padding;
      const distance = Math.abs(target - list.scrollTop);
      // Within SNAP_NAMES names of the pass start
      if (distance < item.offsetHeight * SNAP_NAMES && (!nearest || distance < nearest.distance)) {
        nearest = { target, distance };
      }
    });
    if (nearest && nearest.distance > 1) list.scrollTo({ top: nearest.target, behavior: "smooth" });
  };

  // Height of one pass through the roster
  const getSetHeight = () => {
    const list = listRef.current;
    const first = list.querySelector('li[data-pos="0"]');
    const next = list.querySelector(`li[data-pos="${artists.length}"]`);
    return first && next ? next.offsetTop - first.offsetTop : 0;
  };

  // Looping: when the scroll nears either end, jump back or forward one pass.
  // The passes are identical, so the jump is invisible. Positions held by
  // click/focus/swipe shift with it so they keep pointing at the same name
  const wrapLoop = () => {
    if (!loopRef.current) return 0;
    const list = listRef.current;
    const setHeight = getSetHeight();
    if (!setHeight) return 0;
    let shift = 0;
    if (list.scrollTop < setHeight) shift = 1;
    else if (list.scrollTop > list.scrollHeight - list.clientHeight - setHeight) shift = -1;
    if (!shift) return 0;
    list.scrollTop += shift * setHeight;
    const move = (position) => (position === null ? null : position + shift * artists.length);
    setSelected(move);
    setFocused(move);
    setScrolled(move);
    return shift;
  };

  // Flags when names continue below the visible area, for the fade hint
  // (always true when looping, since the names never run out)
  const markMoreBelow = () => {
    const list = listRef.current;
    if (loopRef.current) {
      setMoreBelow(true);
      return;
    }
    const last = list.querySelector("li[data-pos]:last-of-type");
    if (!last) return;
    const hidden = last.getBoundingClientRect().bottom > list.getBoundingClientRect().bottom + 4;
    setMoreBelow(hidden);
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

  useLayoutEffect(placeNameCopy, [active, copySpot]);

  // Phones: when a long roster runs off the bottom, keep the selected name in view
  useEffect(() => {
    const list = listRef.current;
    if (!window.matchMedia("(max-width: 760px)").matches) return;
    // Back at the intro: return to the top of the list
    if (active === null) {
      list.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const item = list.querySelector(`li[data-pos="${activePosition}"]`);
    if (!item) return;
    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;
    let next = list.scrollTop;
    if (bottom > list.scrollTop + list.clientHeight) next = bottom - list.clientHeight;
    else if (top < list.scrollTop) next = top;
    if (next !== list.scrollTop) list.scrollTo({ top: next, behavior: "smooth" });
  }, [activePosition]);

  // Prints pile up as you move through the artists; going back to one lifts off
  // everything above it, and returning to the intro clears the table
  useEffect(() => {
    setStack((current) => {
      if (active === null) return [];
      const position = current.indexOf(active);
      return position >= 0 ? current.slice(0, position + 1) : [...current, active];
    });
  }, [active]);

  // Names start at the bottom of the screen and can scroll up until the first one
  // reaches the top. Looping lists have no ends, so no extra space
  useEffect(() => {
    const list = listRef.current;
    const fit = () => {
      const items = list.querySelectorAll("li[data-pos]");
      const first = items[0];
      const last = items[items.length - 1];
      const namesHeight = last.offsetTop + last.offsetHeight - first.offsetTop;
      list.style.setProperty("--scroll-space", loopRef.current ? "0px" : `${Math.max(0, list.clientHeight - namesHeight)}px`);
      // Enough passes that the loop can always wrap out of sight
      const setHeight = getSetHeight();
      if (loopRef.current && setHeight) setCopies(Math.max(MIN_COPIES, Math.ceil(list.clientHeight / setHeight) + 3));
      // On phones the images fill the space below the names
      const section = sectionRef.current;
      // A long roster runs past the bottom of the list, so stop at the list's edge
      const namesBottom = Math.min(last.getBoundingClientRect().bottom, list.getBoundingClientRect().bottom);
      const namesEnd = namesBottom - section.getBoundingClientRect().top;
      section.style.setProperty("--names-end", `${Math.round(namesEnd)}px`);
      markMoreBelow();
    };
    fit();
    // Looping starts one pass in, so it can scroll both ways straight away, with
    // that pass's first name at the top of the screen
    if (loopNames) {
      const firstName = list.querySelector(`li[data-pos="${artists.length}"]`);
      const padding = parseFloat(getComputedStyle(list, "::before").height) || 0;
      list.scrollTop = firstName.offsetTop - Math.max(padding, 16);
    } else {
      list.scrollTop = 0;
    }
    const observer = new ResizeObserver(fit);
    observer.observe(list);
    return () => observer.disconnect();
  }, [loopNames, listCopies]);

  // Phones: names don't scroll freely; every STEP px of swipe (or wheel, for
  // narrow desktop windows) moves one artist
  useEffect(() => {
    const list = listRef.current;
    const phone = window.matchMedia("(max-width: 760px)");
    const STEP = 32;
    let travelled = 0;
    let lastY = null;

    const advance = (delta) => {
      travelled += delta;
      while (Math.abs(travelled) >= STEP) {
        const direction = Math.sign(travelled);
        travelled -= direction * STEP;
        // Before the first artist is the intro. When looping, swiping on from the
        // last name carries on into the next pass; otherwise it stops there
        setScrolled((current) => {
          const start = current ?? (loopRef.current ? artists.length - 1 : -1);
          const next = start + direction;
          if (loopRef.current) {
            if (current === null && direction < 0) return null;
            return Math.max(0, Math.min(listLength.current - 1, next));
          }
          const clamped = Math.max(-1, Math.min(listLength.current - 1, next));
          return clamped < 0 ? null : clamped;
        });
        setSelected(null);
        setHovered(null);
      }
    };

    const touchStart = (event) => {
      lastY = event.touches[0].clientY;
      travelled = 0;
    };
    const touchMove = (event) => {
      if (!phone.matches || lastY === null) return;
      event.preventDefault();
      const y = event.touches[0].clientY;
      advance(lastY - y);
      lastY = y;
    };
    const touchEnd = () => {
      lastY = null;
    };

    // Wider screens: scrolling anywhere on the page, header included, moves the names
    const wheel = (event) => {
      if (event.ctrlKey) return;
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      if (phone.matches) {
        event.preventDefault();
        advance(delta);
        return;
      }
      if (list.contains(event.target)) return;
      // Keep the page itself still (no bounce), and move the names instead
      event.preventDefault();
      list.scrollTop += delta;
    };

    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchmove", touchMove, { passive: false });
    window.addEventListener("touchend", touchEnd);
    window.addEventListener("wheel", wheel, { passive: false });
    return () => {
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", touchEnd);
      window.removeEventListener("wheel", wheel);
    };
  }, []);

  const descriptions = artists.map((artist, index) => (
    <p
      key={index}
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
      ref={sectionRef}
      className={`${styles.section} ${active !== null ? styles.artistActive : ""} ${styles[imagePlacementClass[imagePlacement]]} ${stackPrints ? styles.stacking : ""}`}
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
          {copySpot === "label" && <div className={styles.labelCopy}>{descriptions}</div>}
        </div>

        {/* In "intro" mode the intro swaps to the active artist's description */}
        <div className={`${styles.microText} ${styles.intro}`}>
          <p
            className={`${styles.introText} ${active === null || copySpot !== "intro" ? styles.shown : ""}`}
            aria-hidden={active !== null && copySpot === "intro"}
          >
            Sonder Origin is a collective dedicated to elevating artists and building lasting worlds around them.
          </p>
          {copySpot === "intro" && descriptions}
        </div>

        {copySpot === "caption" && (
          <div className={`${styles.microText} ${styles.captionCopy}`}>{descriptions}</div>
        )}

        {copySpot === "name" && (
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
          <button
            type="button"
            className={styles.animationToggle}
            aria-label="Stack artist images as you browse"
            aria-pressed={stackPrints}
            onClick={() => setStackPrints((on) => !on)}
          >
            <span className={styles.toggleIndicator} aria-hidden="true" />
            Stack <span aria-hidden="true">{stackPrints ? "On" : "Off"}</span>
          </button>
          <button
            type="button"
            className={styles.animationToggle}
            aria-label={loopNames ? "Show the artist list once" : "Repeat the artist list endlessly"}
            aria-pressed={loopNames}
            onClick={() => {
              setLoopNames((on) => !on);
              setSelected(null);
              setScrolled(null);
              setStack([]);
            }}
          >
            <span className={styles.toggleIndicator} aria-hidden="true" />
            Names <span aria-hidden="true">{loopNames ? "Repeated" : "Once"}</span>
          </button>
          <button
            type="button"
            className={styles.animationToggle}
            aria-label="Snap to the start of each pass of names"
            aria-pressed={snapToPass}
            onClick={() => setSnapToPass((on) => !on)}
          >
            <span className={styles.toggleIndicator} aria-hidden="true" />
            Snap <span aria-hidden="true">{snapToPass ? "On" : "Off"}</span>
          </button>
        </div>
        <ol
          id="artist-list"
          ref={listRef}
          onScroll={handleListScroll}
          style={{ "--artist-count": artists.length }}
          className={`${styles.artists} ${active !== null ? styles.hasActive : ""} ${moreBelow ? styles.moreBelow : ""}`}
        >
          {Array.from({ length: listCopies }, (_, copy) => [
            // A spiral divider marks the start of each pass when the list repeats
            loopNames && (
              <li key={`divider-${copy}`} className={styles.divider} aria-hidden="true">
                <img src="/images/cursor@2x.png" alt="" width="64" height="64" />
              </li>
            ),
            ...artists.map((artist, index) => {
              const position = copy * artists.length + index;
              // Screen readers and the keyboard only get one pass
              const isRepeat = loopNames && copy !== 1;
              return (
                <li key={position} data-pos={position} aria-hidden={isRepeat || undefined}>
                  <button
                    type="button"
                    tabIndex={isRepeat ? -1 : undefined}
                    className={`${styles.artist} ${activePosition === position ? styles.active : ""}`}
                    aria-controls="artist-preview"
                    aria-pressed={selected === position}
                    onPointerEnter={(event) => {
                      // Names sliding under a still pointer while scrolling shouldn't count as hover
                      const scrolling = performance.now() - lastScroll.current < 200;
                      if (event.pointerType !== "touch" && !scrolling) setHovered(position);
                    }}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => setFocused(position)}
                    onBlur={() => setFocused(null)}
                    onClick={() => setSelected(selected === position ? null : position)}
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
              );
            }),
          ])}
        </ol>

        <aside id="artist-preview" className={styles.preview} aria-label="Artist portrait">
          {artists.map((artist, index) => {
            const onTable = stackPrints && stack.includes(index);
            return (
              <div
                key={index}
                className={`${styles.portrait} ${styles[artist.placement]} ${active === index || onTable ? styles.visible : ""} ${active === index ? styles.current : ""}`}
                style={{
                  zIndex: stack.indexOf(index) + 1,
                  // How many prints sit on top of this one; deeper prints fade out
                  "--depth": onTable ? stack.length - 1 - stack.indexOf(index) : 0,
                  "--shift-x": `${printShift[index % printShift.length][0]}%`,
                  "--shift-y": `${printShift[index % printShift.length][1]}%`,
                }}
                aria-hidden={active !== index}
              >
                <img src={artist.image} alt={artist.name} width="1500" height="1500" />
              </div>
            );
          })}
        </aside>
      </div>

    </main>
  );
}
