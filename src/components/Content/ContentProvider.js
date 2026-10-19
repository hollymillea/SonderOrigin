"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { about as initialAbout } from "@/data/about";
import { artists as initialArtists } from "@/data/artists";
import { gallery as initialGallery } from "@/data/gallery";
import { settings as initialSettings } from "@/data/settings";

const initialContent = {
  about: initialAbout,
  artists: initialArtists,
  gallery: initialGallery,
  settings: initialSettings,
};

const ContentContext = createContext(initialContent);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    let cancelled = false;
    let timer;

    const refresh = async () => {
      try {
        const response = await fetch("/api/preview-content", { cache: "no-store" });
        if (response.status === 401 || response.status === 404) return;
        if (!response.ok) throw new Error(`Preview returned ${response.status}`);
        const next = await response.json();
        if (!cancelled) {
          setContent(next);
          timer = window.setTimeout(refresh, 1200);
        }
      } catch (error) {
        console.warn("Sanity preview refresh failed", error);
        if (!cancelled) timer = window.setTimeout(refresh, 5000);
      }
    };

    refresh();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
