"use client";

import { useRef, useState } from "react";
import { ArtistList } from "./ArtistList";
import { ArtistPreview } from "./ArtistPreview";
import { ArtistDescriptions, Intro, RosterLabel } from "./HeroCopy";
import { StudioInfo } from "./StudioInfo";
import { useArtistBrowsing } from "./useArtistBrowsing";
import styles from "./Hero.module.css";
import { useContent } from "../Content/ContentProvider";

export function Hero() {
  const { artists, settings } = useContent();
  const listRef = useRef(null);
  const sectionRef = useRef(null);
  const browsing = useArtistBrowsing({ artists, listRef, sectionRef });
  const { active } = browsing;

  // Keep the last portrait beneath the closing wipe.
  const [lastActive, setLastActive] = useState(null);
  if (active !== null && active !== lastActive) setLastActive(active);

  return (
    <main id="clients" ref={sectionRef} className={styles.section} data-artist-active={active !== null}>
      <h1 className={styles.heading}>Selected artists</h1>

      <div className={styles.logo}>
        <img src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg" alt="Sonder Origin" width="473" height="252" />
      </div>

      {active !== null && (
        <div className={`${styles.logo} ${styles.columnLogo}`} aria-hidden="true">
          <img src="/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg" alt="" width="473" height="252" />
        </div>
      )}

      <div className={styles.roster}>
        <RosterLabel artists={artists} />
        <Intro showIntro={active === null}>
          <ArtistDescriptions active={active} artists={artists} />
        </Intro>
        <StudioInfo settings={settings} />
        <ArtistList
          artists={artists}
          ref={listRef}
          loopNames={browsing.loopNames}
          copies={browsing.listCopies}
          activePosition={browsing.activePosition}
          moreBelow={browsing.moreBelow}
          onScroll={browsing.handleListScroll}
          nameHandlers={browsing.nameHandlers}
        />
        <ArtistPreview artists={artists} active={active} lingering={active === null ? lastActive : null} />
      </div>
    </main>
  );
}
