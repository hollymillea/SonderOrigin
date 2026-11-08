"use client";

import { useRef, useState } from "react";
import { ArtistList } from "./ArtistList";
import { ArtistPreview } from "./ArtistPreview";
import { ArtistDescriptions, Intro, RosterLabel } from "./HeroCopy";
import { StudioInfo } from "./StudioInfo";
import { useArtistBrowsing } from "./useArtistBrowsing";
import styles from "./Hero.module.css";
import { useContent } from "../Content/ContentProvider";
import { artistSlug } from "../../data/artists";
import { SiteLogo } from "../Logo/SiteLogo";

export function Hero() {
  const { artists, settings } = useContent();
  return <ArtistRoster key={artists.map(artistSlug).join(",")} artists={artists} settings={settings} />;
}

function ArtistRoster({ artists, settings }) {
  const listRef = useRef(null);
  const sectionRef = useRef(null);
  const browsing = useArtistBrowsing({ artists, listRef, sectionRef });
  const { active } = browsing;

  // Keep the last portrait beneath the closing wipe.
  const [lastActive, setLastActive] = useState(null);
  if (active !== null && active !== lastActive) setLastActive(active);

  return (
    <main id="clients" ref={sectionRef} className={styles.section} data-artist-active={active !== null}>
      <h1 className={styles.heading}>{settings.selectedArtistsHeading || 'Selected artists'}</h1>

      <div className={styles.logo}>
        <SiteLogo />
      </div>

      {active !== null && (
        <div className={`${styles.logo} ${styles.columnLogo}`} aria-hidden="true">
          <SiteLogo alt="" />
        </div>
      )}

      <div className={styles.roster}>
        <RosterLabel artists={artists} heading={settings.selectedArtistsHeading || 'Selected artists'} showCount={settings.showArtistCount ?? true} />
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
