"use client";

import { useEffect } from "react";
import { useContent } from "../Content/ContentProvider";

// Applies the cursor chosen in Site settings → General. Without a setting the
// spiral cursor from globals.css stays in place.
export function SiteCursor() {
  const { cursor } = useContent().settings;
  const enabled = cursor?.enabled;
  const src = cursor?.src;
  const src2x = cursor?.src2x;
  const [x, y] = cursor?.hotspot || [];

  useEffect(() => {
    const root = document.documentElement;
    if (enabled === false) {
      root.style.cursor = "auto";
    } else if (src) {
      root.style.cursor = `url("${src}") ${x} ${y}, auto`;
      root.style.cursor = `image-set(url("${src}") 1x, url("${src2x}") 2x) ${x} ${y}, auto`;
    } else {
      root.style.removeProperty("cursor");
    }
    return () => root.style.removeProperty("cursor");
  }, [enabled, src, src2x, x, y]);

  return null;
}
