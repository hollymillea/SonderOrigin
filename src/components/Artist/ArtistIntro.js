import { artists } from "@/data/artists";
import { PortraitIntro } from "./PortraitIntro";

const count = (n) => String(n).padStart(2, "0");

// An artist page's first screen: their number, description and portrait
export function ArtistIntro({ artist, index }) {
  return (
    <PortraitIntro
      name={artist.name}
      label={<>Artist<br />{count(index + 1)} / {count(artists.length)}</>}
      image={{ src: artist.image, alt: artist.name, crop: artist.crop, zoom: artist.cropZoom }}
    >
      {artist.description}
    </PortraitIntro>
  );
}
