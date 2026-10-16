import { artists } from "./artists";

// PLACEHOLDER CONTENT. Each artist page is a run of chapters: a handful of
// images with a line or two of text. Until real work is in, every artist gets
// the same four chapters filled from the shared image pool, rotated so each
// page leads with that artist's own portrait.
//
// Chapter layouts (see ArtistChapter.module.css):
//   lead   one wide image, then a staggered pair
//   bleed  one image edge to edge, text beneath
//   pair   a tall image and a shorter one, then a wide one
//   grid   squares in a staggered row

const halftones = artists.map((artist) => ({ src: artist.image, width: 1500, height: 1500, crop: artist.crop }));

const stills = [
  { src: "/images/Screenshot%202026-03-12%20at%2021.52.30.png", width: 2068, height: 1166, crop: "45% 60%" },
  { src: "/images/Screenshot%202026-03-12%20at%2021.53.23.png", width: 2062, height: 1158, crop: "center" },
];

export function getArtistWork(index) {
  const artist = artists[index];
  const pick = (offset) => ({ ...halftones[(index + offset) % halftones.length], alt: `${artist.name} — placeholder image` });
  const still = (offset) => ({ ...stills[(index + offset) % stills.length], alt: `${artist.name} — placeholder still` });

  return [
    {
      title: "The campaign",
      text: "Rollout imagery for the lead single. Shot over two days, built around one colour and one feeling.",
      layout: "lead",
      images: [pick(0), pick(1), pick(2)],
    },
    {
      title: "On the road",
      text: "Tour stills from the first leg, between soundcheck and stage.",
      layout: "bleed",
      images: [still(0)],
    },
    {
      title: "Studio",
      text: "Quiet days in the room. Portraits made while the record was still taking shape.",
      layout: "pair",
      images: [pick(3), pick(4), still(1)],
    },
    {
      title: "Live",
      text: "Four nights, four cities. Content cut the same evening and out by morning.",
      layout: "grid",
      images: [pick(5), pick(6), pick(7), pick(0)],
    },
  ];
}
