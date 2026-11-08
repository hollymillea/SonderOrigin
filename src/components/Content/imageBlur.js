// While a photo loads, its frame shows Sanity's tiny preview of it, stretched
// so it reads as a soft blur. The photo covers it once loaded.
export const blurBehind = (lqip, position) =>
  lqip ? { backgroundImage: `url("${lqip}")`, backgroundSize: "cover", backgroundPosition: position || "center" } : undefined;
