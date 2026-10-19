"use client";

import { notFound } from "next/navigation";
import { useContent } from "../Content/ContentProvider";
import { Header } from "../Header/Header";
import { ArtistChapter } from "./ArtistChapter";
import { ArtistIntro } from "./ArtistIntro";
import { NextArtist } from "./NextArtist";
import { ScrollMotion } from "../ScrollMotion/ScrollMotion";
import { artistSlug } from "../../data/artists";
import styles from "../../app/artists/[slug]/page.module.css";

export function ArtistPageContent({ slug }) {
  const { artists } = useContent();
  const index = artists.findIndex((artist) => artistSlug(artist) === slug);
  if (index < 0) notFound();
  const artist = artists[index];

  return (
    <div className={`helvetica-now-display surface ${styles.page}`}>
      <Header />
      <ScrollMotion key={artistSlug(artist)}>
        <ArtistIntro artist={artist} index={index} total={artists.length} />
        {(artist.chapters || []).map((chapter, number) => (
          <ArtistChapter key={number} chapter={chapter} number={number + 1} />
        ))}
        <NextArtist artists={artists} index={index} />
      </ScrollMotion>
    </div>
  );
}
