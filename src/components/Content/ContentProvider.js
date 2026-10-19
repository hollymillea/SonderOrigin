"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { about as initialAbout } from "../../data/about";
import { artists as initialArtists } from "../../data/artists";
import { gallery as initialGallery } from "../../data/gallery";
import { settings as initialSettings } from "../../data/settings";

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

    const refresh = async () => {
      try {
        const response = await fetch("/api/content", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Content fetch returned ${response.status}`);
        }

        const next = await response.json();

        if (!cancelled) {
          setContent(next);
        }
      } catch (error) {
        console.warn("Sanity content refresh failed:", error);
      }
    };

    refresh();

    return () => {
      cancelled = true;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
