import { notFound } from "next/navigation";
import { ArtistPageContent } from "../../../components/Artist/ArtistPageContent";
import { artists, artistSlug } from "../../../data/artists";

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
  const slug = (await params).slug;
  const index = findArtist(slug);
  if (index < 0) notFound();
  return <ArtistPageContent slug={slug} />;
}
