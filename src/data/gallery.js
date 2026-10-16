import { artists } from "./artists";

// PLACEHOLDER CONTENT. The gallery's images, in order. A caption is optional;
// without one the image shows nothing on hover. Ratio is optional too; by
// default the frames cycle through a few portrait shapes

const halftone = (index, caption) => ({
  src: artists[index].image,
  width: 1500,
  height: 1500,
  crop: artists[index].crop,
  caption,
});

// Video stills keep a landscape frame
const still = (file, caption) => ({ src: `/images/${file}`, width: 2068, height: 1166, crop: "45% 60%", ratio: "16 / 10", caption });

export const gallery = [
  halftone(3, "Olivia Dean — Messy Tour"),
  halftone(1, "Annahstasia — Tether"),
  halftone(6),
  still("Screenshot%202026-03-12%20at%2021.52.30.webp", "On the road, summer"),
  halftone(4, "Joviale — Mount Crystal"),
  halftone(0),
  halftone(2, "MRCY — Volume 2"),
  halftone(7, "Jessy Blakemore — Recognize"),
  still("Screenshot%202026-03-12%20at%2021.53.23.webp"),
  halftone(5, "Cari — Bleeding"),
  halftone(6, "Gia Ford — Turbo Dreams"),
  halftone(1),
  halftone(0, "Abi Coulibably — studio portrait"),
  halftone(3),
  halftone(4, "Joviale — backstage"),
  halftone(2),
  halftone(7),
  still("Screenshot%202026-03-12%20at%2021.52.30.webp", "Soundcheck"),
];
