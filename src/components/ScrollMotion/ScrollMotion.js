"use client";

import { useEffect, useRef } from "react";

// Content is visible without JavaScript. Animate once, leaving native scroll
// and the page's existing grid, sticky text and image crops intact.
export function ScrollMotion({ children, as: Tag = "main" }) {
  const ref = useRef(null);

  useEffect(() => {
    const frames = [...ref.current.querySelectorAll("[data-parallax]")];
    if (!frames.length) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const offsets = new Map();
    let frame = 0;

    const update = () => {
      frame = 0;
      if (preference.matches) return;
      const viewport = window.innerHeight;
      const travel = window.innerWidth <= 760 ? 48 : Math.min(260, viewport * 0.32);
      // Batch measurements before writing styles; a single animation frame
      // handles all photos, with no continuous loop while scrolling is idle.
      const positions = frames.map((element) => {
        const rect = element.getBoundingClientRect();
        // Remove our previous transform from the measurement so motion
        // follows the original grid position without feeding back on itself.
        const top = rect.top - (offsets.get(element) || 0);
        const progress = Math.min(1, Math.max(0, (viewport - top) / (viewport + rect.height)));
        return (progress - 0.5) * travel * Number(element.dataset.parallax);
      });
      frames.forEach((element, index) => {
        offsets.set(element, positions[index]);
        element.style.setProperty("--parallax-offset", `${positions[index].toFixed(3)}px`);
        element.setAttribute("data-parallax-active", "");
      });
    };
    const schedule = () => {
      if (!frame && !preference.matches) frame = requestAnimationFrame(update);
    };
    const reset = () => {
      frames.forEach((element) => {
        element.removeAttribute("data-parallax-active");
        element.style.removeProperty("--parallax-offset");
      });
      offsets.clear();
    };
    const changePreference = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      reset();
      update();
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", changePreference);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", changePreference);
      reset();
    };
  }, []);

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
        const distance = element.hasAttribute("data-parallax") ? "0 0" : image ? "0 40px" : "0 22px";
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
