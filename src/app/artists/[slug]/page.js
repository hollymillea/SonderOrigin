import { notFound } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { ArtistChapter } from "@/components/Artist/ArtistChapter";
import { ArtistIntro } from "@/components/Artist/ArtistIntro";
import { NextArtist } from "@/components/Artist/NextArtist";
import { artists, artistSlug } from "@/data/artists";
import { getArtistWork } from "@/data/artistWork";
import styles from "./page.module.css";

// One page per artist, built ahead of time for the static export
export const dynamicParams = false;

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artistSlug(artist) }));
}

const findArtist = (slug) => artists.findIndex((artist) => artistSlug(artist) === slug);

export async function generateMetadata({ params }) {
  const artist = artists[findArtist((await params).slug)];
  if (!artist) return {};
  return {
    title: `${artist.name} — Sonder Origin`,
    description: artist.description,
  };
}

export default async function ArtistPage({ params }) {
  const index = findArtist((await params).slug);
  if (index < 0) notFound();
  const artist = artists[index];

  return (
    <div className={`helvetica-now-display ${styles.page}`}>
      <Header />
      <main>
        <ArtistIntro artist={artist} index={index} />
        {getArtistWork(index).map((chapter, number) => (
          <ArtistChapter key={number} chapter={chapter} number={number + 1} />
        ))}
        <NextArtist index={index} />
      </main>
    </div>
  );
}
