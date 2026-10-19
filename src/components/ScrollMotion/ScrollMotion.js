"use client";

import { useEffect, useRef } from "react";

// Content is visible without JavaScript. Animate once, leaving native scroll
// and the page's existing grid, sticky text and image crops intact.
export function ScrollMotion({ children, as: Tag = "main" }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!("IntersectionObserver" in window) || !Element.prototype.animate) return;

    let observer;
    const animations = new Map();
    const reset = () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    const setup = () => {
      reset();
      if (preference.matches) return;

      observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          animations.get(target)?.play();
          observer.unobserve(target);
        });
      }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });

      root.querySelectorAll("[data-scroll-reveal]").forEach((element) => {
        // Don't hide content already passed when restoring a scroll position.
        if (element.getBoundingClientRect().bottom <= 0) return;
        const image = element.dataset.scrollReveal === "image";
        const distance = image ? "0 0" : "0 22px";
        const animation = element.animate([
          { opacity: 0, translate: distance },
          { opacity: 1, translate: "0 0" },
        ], {
          duration: image ? 1000 : 750,
          delay: Number(element.dataset.scrollDelay || 0),
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        });
        animation.pause();
        animation.currentTime = 0;
        animation.onfinish = () => {
          animation.cancel();
          animations.delete(element);
        };
        animations.set(element, animation);
        observer.observe(element);
      });
    };
    // Keyboard navigation should never land on a hidden link.
    const revealFocused = (event) => {
      animations.forEach((animation, element) => {
        if (element.contains(event.target)) {
          animation.cancel();
          animations.delete(element);
          observer?.unobserve(element);
        }
      });
    };

    setup();
    preference.addEventListener("change", setup);
    root.addEventListener("focusin", revealFocused);
    return () => {
      reset();
      preference.removeEventListener("change", setup);
      root.removeEventListener("focusin", revealFocused);
    };
  }, []);

  return <Tag ref={ref}>{children}</Tag>;
}
