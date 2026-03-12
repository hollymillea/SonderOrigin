import { useEffect } from "react";

const THEMES = {
  light:  { background: "var(--background)", foreground: "var(--foreground)" },
  dark:   { background: "black", foreground: "var(--accent)", border: "var(--accent)" },
//   accent: { background: "rgba(255,120,0)", foreground: "var(--foreground)" },
    accent: { background: "var(--accent)", foreground: "var(--foreground)" },
};

function setHeaderTheme(name) {
  const theme = THEMES[name] || THEMES.light;

  console.log("Setting header theme:", name, theme);

  document.documentElement.style.setProperty("--header-background", theme.background);
  document.documentElement.style.setProperty("--header-foreground", theme.foreground);
  document.documentElement.style.setProperty("--header-border", theme.border || "transparent");
}

export function useHeaderTheme() {
  useEffect(() => {
    const sections = document.querySelectorAll("[data-header]");
    if (!sections.length) return;

    const headerHeight =
      parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--header-height")
      ) || 0;

    const observer = new IntersectionObserver(
        (entries) => {
            const hit = entries.find((e) => e.isIntersecting);
            if (!hit) return;

            const themeName = hit.target.dataset.header;
            setHeaderTheme(themeName);
        },
        {
            root: null,
            threshold: 0,
            // only count as intersecting when it reaches the line just under the header
            rootMargin: `-${headerHeight}px 0px -99% 0px`,
        }
        );

    sections.forEach((section) => observer.observe(section));

    // Set initial theme
    setHeaderTheme(sections[0].dataset.header);

    return () => observer.disconnect();
  }, []);
}