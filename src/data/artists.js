// Artist profiles and portrait framing.
export const artists = [
  {
    name: "Abi Coulibably",
    image: "/images/1.png",
    crop: "60% 38%",
    cropZoom: 1.08,
    description: "As Aby’s full-time manager, we work closely with her to build a career that’s as honest and genre-defiant as her music. Strategy, storytelling, and space to grow—always on her terms.",
  },
  {
    name: "Annahstasia",
    image: "/images/2.png",
    crop: "64% 40%",
    cropZoom: 1.14,
    description: "For Annahstasia’s Tether release, we leaned into her world of sensuality, earth, and ritual. Our content honored the craft and emotion she pours into every part of her work while highlighting the multi-talented being she is.",
  },
  {
    name: "MRCY",
    image: "/images/3.png",
    crop: "50% 60%",
    cropZoom: 1.02,
    description: "Collaborating with MRCY on their Volume 2 era, we created content that matched the depth and texture of their sound. Soul, jazz, and electronic influences shaped a world that feels both grounded and expansive.",
  },
  {
    name: "Olivia Dean",
    image: "/images/4.png",
    crop: "42% 28%",
    cropZoom: 1.12,
    description: "For Olivia Dean’s Messy Tour, we created content that mirrored her soulful, genre-blending sound and commitment to authenticity. From intimate backstage moments to dynamic stage visuals, our work captured the warmth, imperfection, and emotional honesty that define her artistry. We aimed to reflect Olivia’s embrace of life’s messiness and her desire to connect deeply with her audience.",
  },
  {
    name: "Joviale",
    image: "/images/5.png",
    crop: "56% 48%",
    cropZoom: 1.1,
    description: "Joviale’s Mount Crystal universe is cinematic, strange, and stunning. We built content that matched their vision—full of danger, desire, and raw beauty.",
  },
  {
    name: "Cari",
    image: "/images/6.png",
    crop: "42% 38%",
    cropZoom: 1.16,
    description: "With Cari, we shaped the rollout for her single Bleeding—from content to strategy. Everything was rooted in her bold, empowering energy and her instinct for visual storytelling.",
  },
  {
    name: "Gia Ford",
    image: "/images/7.png",
    crop: "54% 40%",
    cropZoom: 1.12,
    description: "Our work with Gia Ford spans the re-release of her debut album Turbo Dreams and the early creative direction for her upcoming project. Both phases are a chance to explore her world visually and strategically, staying close to the mood, detail, and edge that defines her.",
  },
  {
    name: "Jessy Blakemore",
    image: "/images/8.png",
    crop: "52% 32%",
    cropZoom: 1.08,
    description: "We’re working with Jessy Blakemore to hone her creative visual identity, shaping the content and campaign assets around her music. Together, we’re building the visuals for her upcoming singles, including her latest feature on Russ’s track Recognize.",
  },
];

// URL segment for an artist's page, e.g. "Olivia Dean" -> "olivia-dean"
export const artistSlug = (artist) =>
  artist.name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
