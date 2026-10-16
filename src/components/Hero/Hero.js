"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArtistList } from "./ArtistList";
import { ArtistPreview } from "./ArtistPreview";
import { ArtistDescriptions, CaptionCopy, Intro, NameCopy, RosterLabel } from "./HeroCopy";
import { DesignToggle, StudioInfo } from "./StudioInfo";
import { useArtistBrowsing } from "./useArtistBrowsing";
import styles from "./Hero.module.css";

// The Images toggle cycles through these
const imagePlacements = ["right", "frame", "column", "panel"];
const imagePlacementLabel = { right: "right", frame: "centre", column: "column", panel: "panel" };

// The Copy toggle cycles the artist description between these spots
const copyPlacements = ["intro", "name", "label"];

// The design toggles under the studio note. Hidden for now; set to true to
// bring them back
const SHOW_DESIGN_TOGGLES = false;

const next = (list, current) => list[(list.indexOf(current) + 1) % list.length];

// The page's modes are set as data attributes on <main>, which each
// component's styles (and the header's) key off:
//   data-image-placement  right | frame | column | panel
//   data-thirds           column mode on three equal sections
//   data-artist-active    an artist is showing
//   data-stacking         prints pile up as you browse
export function Hero() {
  const [imagePlacement, setImagePlacement] = useState("column");
  const [copyPlacement, setCopyPlacement] = useState("intro");
  const [stackPrints, setStackPrints] = useState(true);
  // Thirds: column mode laid out on three equal vertical sections
  const [thirds, setThirds] = useState(true);
  // Names toggle: the roster once, or repeated endlessly with a divider between passes
  const [repeatNames, setRepeatNames] = useState(true);
  const [snapToPass, setSnapToPass] = useState(true);
  const useThirds = thirds && imagePlacement === "column";
  const singleImage = imagePlacement === "column" || imagePlacement === "panel";
  const stackImages = stackPrints && !singleImage;
  const [stack, setStack] = useState([]);
  const [copyY, setCopyY] = useState(0);
  const listRef = useRef(null);
  const rosterRef = useRef(null);
  const introRef = useRef(null);
  const sectionRef = useRef(null);
  const nameCopyRef = useRef(null);

  const {
    active,
    activePosition,
    selected,
    loopNames,
    listCopies,
    moreBelow,
    handleListScroll,
    nameHandlers,
    clearSelection,
  } = useArtistBrowsing({
    repeatNames,
    snapToPass,
    // Thirds holds a hover briefly, so brushing off the names doesn't wipe
    // the photo out and straight back in
    holdHover: useThirds,
    listRef,
    sectionRef,
    onListScroll: () => placeNameCopy(),
  });

  // Thirds wipes the photo out rather than fading it, so the last artist's
  // portrait stays up underneath the wipe
  const [lastActive, setLastActive] = useState(null);
  if (active !== null && active !== lastActive) setLastActive(active);
  // Frame mode puts the description under the image as a caption
  const fixedIntro = (imagePlacement === "right" && stackPrints) || singleImage;
  const copySpot = imagePlacement === "frame" ? "caption" : fixedIntro ? "intro" : copyPlacement;

  // Keep prints crossing the description columns below the copy.
  useLayoutEffect(() => {
    const intro = introRef.current;
    const roster = rosterRef.current;
    const placeImages = () => {
      const top = intro.getBoundingClientRect().bottom - roster.getBoundingClientRect().top + 32;
      roster.style.setProperty("--right-images-top", `${Math.ceil(top)}px`);
    };
    placeImages();
    const observer = new ResizeObserver(placeImages);
    observer.observe(intro);
    observer.observe(roster);
    return () => observer.disconnect();
  }, []);

  // In "name" mode the description lines up with the active name, kept on screen
  const placeNameCopy = () => {
    const copy = nameCopyRef.current;
    const button = listRef.current?.querySelector(`li[data-pos="${activePosition}"] a`);
    if (!copy || !button) return;
    const rosterBox = rosterRef.current.getBoundingClientRect();
    const top = button.getBoundingClientRect().top - rosterBox.top;
    setCopyY(Math.max(0, Math.min(top, rosterBox.height - copy.offsetHeight)));
  };

  useLayoutEffect(placeNameCopy, [active, copySpot]);

  // Prints pile up as you move through the artists; going back to one lifts off
  // everything above it, and returning to the intro clears the table
  useEffect(() => {
    setStack((current) => {
      if (active === null) return [];
      const position = current.indexOf(active);
      return position >= 0 ? current.slice(0, position + 1) : [...current, active];
    });
  }, [active]);

  const descriptions = <ArtistDescriptions active={active} />;

  return (
    <main
      id="clients"
      ref={sectionRef}
      className={styles.section}
      data-image-placement={imagePlacement}
      data-thirds={useThirds}
      data-artist-active={active !== null}
      data-stacking={stackImages}
    >
      <h1 className={styles.heading}>Selected artists</h1>

      <div className={styles.logo}>
        <img src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg" alt="Sonder Origin" width="473" height="252" />
      </div>

      {imagePlacement === "column" && active !== null && (
        <div className={`${styles.logo} ${styles.columnLogo}`} aria-hidden="true">
          <img src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg" alt="" width="473" height="252" />
        </div>
      )}

      <div className={styles.roster} ref={rosterRef}>
        <RosterLabel>{copySpot === "label" && descriptions}</RosterLabel>

        <Intro ref={introRef} showIntro={active === null || copySpot !== "intro"}>
          {copySpot === "intro" && descriptions}
        </Intro>

        {copySpot === "caption" && <CaptionCopy>{descriptions}</CaptionCopy>}

        {copySpot === "name" && <NameCopy ref={nameCopyRef} y={copyY}>{descriptions}</NameCopy>}

        <StudioInfo>
          {SHOW_DESIGN_TOGGLES && (<>
          <DesignToggle
            label="Images"
            value={imagePlacementLabel[imagePlacement]}
            pressed={imagePlacement !== "right"}
            ariaLabel={`Image placement: ${imagePlacementLabel[imagePlacement]}. Change placement`}
            onClick={() => setImagePlacement((current) => next(imagePlacements, current))}
          />
          {imagePlacement === "column" && (
            <DesignToggle
              label="Thirds"
              value={thirds ? "On" : "Off"}
              pressed={thirds}
              ariaLabel="Lay the page out in three equal columns"
              onClick={() => setThirds((on) => !on)}
            />
          )}
          {!fixedIntro && (
            <DesignToggle
              label="Copy"
              value={copyPlacement}
              pressed={copyPlacement !== "intro"}
              ariaLabel={`Description placement: ${copyPlacement}. Change placement`}
              onClick={() => setCopyPlacement((current) => next(copyPlacements, current))}
            />
          )}
          {!singleImage && (
            <DesignToggle
              label="Stack"
              value={stackPrints ? "On" : "Off"}
              pressed={stackPrints}
              ariaLabel="Stack artist images as you browse"
              onClick={() => setStackPrints((on) => !on)}
            />
          )}
          <DesignToggle
            label="Names"
            value={repeatNames ? "Repeated" : "Once"}
            pressed={repeatNames}
            ariaLabel={repeatNames ? "Show the artist list once" : "Repeat the artist list endlessly"}
            onClick={() => {
              setRepeatNames((on) => !on);
              clearSelection();
              setStack([]);
            }}
          />
          <DesignToggle
            label="Snap"
            value={snapToPass ? "On" : "Off"}
            pressed={snapToPass}
            ariaLabel="Snap to the start of each pass of names"
            onClick={() => setSnapToPass((on) => !on)}
          />
          </>)}
        </StudioInfo>

        <ArtistList
          ref={listRef}
          loopNames={loopNames}
          copies={listCopies}
          activePosition={activePosition}
          selected={selected}
          moreBelow={moreBelow}
          onScroll={handleListScroll}
          nameHandlers={nameHandlers}
        />

        <ArtistPreview
          active={active}
          stack={stack}
          stacking={stackImages}
          lingering={useThirds && active === null ? lastActive : null}
        />
      </div>
    </main>
  );
}
