"use client";

import { useEffect, useRef, useState } from "react";
import { artists } from "@/data/artists";

// How many copies of the roster the looping list starts with; more are added
// on tall screens so it can always wrap without a visible jump
const MIN_COPIES = 4;

// Snap catches the list when it stops within this many names of a pass start
const SNAP_NAMES = 3;

// Which artist is showing, and how the names list scrolls to get there.
// Hover, focus, click and swipe all track a position in the (possibly
// repeated) list; the artist shown is that position's artist.
//   repeatNames  - loop the roster endlessly (desktop only)
//   snapToPass   - ease to the start of a pass when the list stops near one
//   holdHover    - wait a moment before letting go of a hover
//   listRef      - the names list
//   sectionRef   - the hero, which gets --names-end for the phone layout
//   onListScroll - called as the names scroll
export function useArtistBrowsing({ repeatNames, snapToPass, holdHover, listRef, sectionRef, onListScroll }) {
  const [hovered, setHovered] = useState(null);
  const hoverLeaveTimer = useRef(0);
  useEffect(() => () => clearTimeout(hoverLeaveTimer.current), []);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);
  const [scrolled, setScrolled] = useState(null);
  // Phones always show the roster once: they step through one artist at a time
  const [isPhone, setIsPhone] = useState(false);
  const loopNames = repeatNames && !isPhone;
  const loopRef = useRef(loopNames);
  loopRef.current = loopNames;
  const [copies, setCopies] = useState(MIN_COPIES);
  const listCopies = loopNames ? copies : 1;
  const [moreBelow, setMoreBelow] = useState(false);
  const snapRef = useRef(snapToPass);
  snapRef.current = snapToPass;
  const snapTimer = useRef(0);
  // Eased scrolling for snap mode: where the list is heading, the animation
  // frame, and the current swipe (when it started, its direction, and the pass
  // start it isn't allowed to go past)
  const glide = useRef({ target: null, frame: 0, lastWheel: 0, lastSpeed: 0, direction: 0, limit: null });
  const lastScroll = useRef(0);
  // A position just after the mobile roster is an unselected end state.
  const swipePosition = !loopNames && scrolled === artists.length ? null : scrolled;
  const activePosition = hovered ?? focused ?? selected ?? swipePosition;
  const phonePosition = useRef(-1);
  phonePosition.current = activePosition ?? scrolled ?? -1;
  const active = activePosition === null ? null : activePosition % artists.length;

  // On desktop scrolling only moves the names; it doesn't pick an artist
  const handleListScroll = () => {
    lastScroll.current = performance.now();
    wrapLoop();
    onListScroll?.();
    markMoreBelow();
    // Once scrolling settles, check whether to snap to a pass start
    clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(snapNearPassStart, 70);
  };

  // Snap: when the list stops within a few names of the start of a pass,
  // ease so that pass's first name sits at the top. Anywhere else it stays put.
  // Desktop, repeated names only (phones step through artists instead)
  const snapNearPassStart = () => {
    const list = listRef.current;
    if (!snapRef.current || !loopRef.current || window.matchMedia("(max-width: 760px)").matches) return;
    const padding = parseFloat(getComputedStyle(list, "::before").height) || 0;
    let nearest = null;
    list.querySelectorAll("li[data-pos]").forEach((item) => {
      if (Number(item.dataset.pos) % artists.length !== 0) return;
      const target = item.offsetTop - padding;
      const distance = Math.abs(target - list.scrollTop);
      // Within SNAP_NAMES names of the pass start
      if (distance < item.offsetHeight * SNAP_NAMES && (!nearest || distance < nearest.distance)) {
        nearest = { target, distance };
      }
    });
    if (nearest && nearest.distance > 1) glideTo(nearest.target);
  };

  // Where each pass's first name sits at the top of the list
  const passStarts = () => {
    const list = listRef.current;
    const padding = parseFloat(getComputedStyle(list, "::before").height) || 0;
    return [...list.querySelectorAll("li[data-pos]")]
      .filter((item) => Number(item.dataset.pos) % artists.length === 0)
      .map((item) => item.offsetTop - padding);
  };

  // Ease the list toward a scroll position
  const glideTo = (target) => {
    const list = listRef.current;
    const g = glide.current;
    g.target = target;
    if (g.frame) return;
    const step = () => {
      const remaining = g.target - list.scrollTop;
      if (Math.abs(remaining) <= 1) {
        list.scrollTop = g.target;
        g.target = null;
        g.frame = 0;
        return;
      }
      // Always move at least a whole pixel, or the browser rounds the step away
      // and the glide stalls short of its target
      list.scrollTop += Math.sign(remaining) * Math.max(1, Math.abs(remaining) * 0.2);
      g.frame = requestAnimationFrame(step);
    };
    g.frame = requestAnimationFrame(step);
  };

  // Height of one pass through the roster
  const getSetHeight = () => {
    const list = listRef.current;
    const first = list.querySelector('li[data-pos="0"]');
    const next = list.querySelector(`li[data-pos="${artists.length}"]`);
    return first && next ? next.offsetTop - first.offsetTop : 0;
  };

  // Looping: when the scroll nears either end, jump back or forward one pass.
  // The passes are identical, so the jump is invisible. Positions held by
  // click/focus/swipe shift with it so they keep pointing at the same name
  const wrapLoop = () => {
    if (!loopRef.current) return 0;
    const list = listRef.current;
    const setHeight = getSetHeight();
    if (!setHeight) return 0;
    let shift = 0;
    if (list.scrollTop < setHeight) shift = 1;
    else if (list.scrollTop > list.scrollHeight - list.clientHeight - setHeight) shift = -1;
    if (!shift) return 0;
    list.scrollTop += shift * setHeight;
    // Keep an eased scroll heading for the same name after the jump
    const g = glide.current;
    if (g.target !== null) g.target += shift * setHeight;
    if (g.limit !== null) g.limit += shift * setHeight;
    const move = (position) => (position === null ? null : position + shift * artists.length);
    setSelected(move);
    setFocused(move);
    setScrolled(move);
    return shift;
  };

  // Flags when names continue below the visible area, for the fade hint
  // (always true when looping, since the names never run out)
  const markMoreBelow = () => {
    const list = listRef.current;
    if (loopRef.current) {
      setMoreBelow(true);
      return;
    }
    const last = list.querySelector("li[data-pos]:last-of-type");
    if (!last) return;
    const hidden = last.getBoundingClientRect().bottom > list.getBoundingClientRect().bottom + 4;
    setMoreBelow(hidden);
  };


  useEffect(() => {
    const phone = window.matchMedia("(max-width: 760px)");
    const update = () => setIsPhone(phone.matches);
    update();
    phone.addEventListener("change", update);
    return () => phone.removeEventListener("change", update);
  }, []);

  // Phones: when a long roster runs off the bottom, keep the selected name in view
  useEffect(() => {
    const list = listRef.current;
    if (!window.matchMedia("(max-width: 760px)").matches) return;
    // Both ends show the intro; keep the names at the end reached by the swipe.
    if (active === null) {
      list.scrollTo({ top: scrolled === artists.length ? list.scrollHeight : 0, behavior: "smooth" });
      return;
    }
    const item = list.querySelector(`li[data-pos="${activePosition}"]`);
    if (!item) return;
    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;
    let next = list.scrollTop;
    if (bottom > list.scrollTop + list.clientHeight) next = bottom - list.clientHeight;
    else if (top < list.scrollTop) next = top;
    if (next !== list.scrollTop) list.scrollTo({ top: next, behavior: "smooth" });
  }, [activePosition, scrolled]);

  // Names start at the bottom of the screen and can scroll up until the first one
  // reaches the top. Looping lists have no ends, so no extra space
  useEffect(() => {
    const list = listRef.current;
    const fit = () => {
      const items = list.querySelectorAll("li[data-pos]");
      const first = items[0];
      const last = items[items.length - 1];
      const namesHeight = last.offsetTop + last.offsetHeight - first.offsetTop;
      list.style.setProperty("--scroll-space", loopRef.current ? "0px" : `${Math.max(0, list.clientHeight - namesHeight)}px`);
      // Enough passes that the loop can always wrap out of sight
      const setHeight = getSetHeight();
      if (loopRef.current && setHeight) setCopies(Math.max(MIN_COPIES, Math.ceil(list.clientHeight / setHeight) + 3));
      // On phones the images fill the space below the names
      const section = sectionRef.current;
      // A long roster runs past the bottom of the list, so stop at the list's edge
      const namesBottom = Math.min(last.getBoundingClientRect().bottom, list.getBoundingClientRect().bottom);
      const namesEnd = namesBottom - section.getBoundingClientRect().top;
      section.style.setProperty("--names-end", `${Math.round(namesEnd)}px`);
      markMoreBelow();
    };
    fit();
    // Looping starts one pass in, so it can scroll both ways straight away, with
    // that pass's first name at the top of the screen
    if (loopNames) {
      const firstName = list.querySelector(`li[data-pos="${artists.length}"]`);
      const padding = parseFloat(getComputedStyle(list, "::before").height) || 0;
      list.scrollTop = firstName.offsetTop - Math.max(padding, 16);
    } else {
      list.scrollTop = 0;
    }
    const observer = new ResizeObserver(fit);
    observer.observe(list);
    return () => observer.disconnect();
  }, [loopNames, listCopies]);

  // Phones: names don't scroll freely; every STEP px of swipe (or wheel, for
  // narrow desktop windows) moves one artist
  useEffect(() => {
    const list = listRef.current;
    const phone = window.matchMedia("(max-width: 760px)");
    const STEP = 32;
    let travelled = 0;
    let lastY = null;
    let restingAtEnd = false;
    let swipeDirection = 0;
    let lastPhoneWheel = 0;

    const advance = (delta) => {
      const direction = Math.sign(delta);
      if (!direction) return;
      // Reversing is a new movement, even without lifting a finger or waiting
      // for wheel momentum to finish. Discard distance from the old direction.
      if (direction !== swipeDirection) {
        restingAtEnd = false;
        travelled = 0;
      }
      swipeDirection = direction;
      if (restingAtEnd) return;
      travelled += delta;
      while (Math.abs(travelled) >= STEP) {
        const direction = Math.sign(travelled);
        travelled -= direction * STEP;
        // One empty step follows the last artist. A fresh forward swipe starts
        // again; reversing from that step returns to the last artist.
        const current = phonePosition.current;
        const next = current === artists.length && direction > 0
          ? 0
          : Math.max(-1, Math.min(artists.length, current + direction));
        phonePosition.current = next;
        setScrolled(next < 0 ? null : next);
        setSelected(null);
        setHovered(null);
        setFocused(null);
        if (list.contains(document.activeElement)) document.activeElement.blur();
        // Finish this gesture at the empty end, even if it has momentum left.
        if (next === artists.length) {
          restingAtEnd = true;
          travelled = 0;
          break;
        }
      }
    };

    const touchStart = (event) => {
      lastY = event.touches[0].clientY;
      travelled = 0;
      restingAtEnd = false;
      swipeDirection = 0;
    };
    const touchMove = (event) => {
      if (!phone.matches || lastY === null) return;
      event.preventDefault();
      const y = event.touches[0].clientY;
      advance(lastY - y);
      lastY = y;
    };
    const touchEnd = () => {
      lastY = null;
      travelled = 0;
      restingAtEnd = false;
      swipeDirection = 0;
    };

    // Wider screens: scrolling anywhere on the page, header included, moves the names
    const wheel = (event) => {
      if (event.ctrlKey) return;
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      if (phone.matches) {
        event.preventDefault();
        const now = performance.now();
        if (now - lastPhoneWheel > 220) {
          restingAtEnd = false;
          travelled = 0;
        }
        lastPhoneWheel = now;
        advance(delta);
        return;
      }
      // Snap mode: eased scrolling, and one swipe (including its trackpad
      // momentum) can carry the list at most to the next pass start
      if (loopRef.current && snapRef.current) {
        event.preventDefault();
        const g = glide.current;
        const now = performance.now();
        const direction = Math.sign(delta);
        const speed = Math.abs(delta);
        const from = g.target ?? list.scrollTop;
        // A new swipe starts after a pause, a change of direction, or when the
        // scroll speeds up again: trackpad momentum only ever slows down, so a
        // speed-up means fresh fingers, even while the last swipe is still coasting
        const atLimit = g.limit !== null && Math.abs(from - g.limit) < 2;
        const speedingUp = speed > 4 && speed > g.lastSpeed * 1.4;
        if (now - g.lastWheel > 220 || direction !== g.direction || (atLimit && speedingUp)) {
          // A new swipe: find the next pass start in the direction of travel
          const starts = passStarts();
          g.direction = direction;
          g.limit = direction > 0
            ? starts.find((start) => start > from + 2) ?? null
            : [...starts].reverse().find((start) => start < from - 2) ?? null;
        }
        g.lastWheel = now;
        g.lastSpeed = speed;
        let target = from + delta;
        if (g.limit !== null) target = direction > 0 ? Math.min(target, g.limit) : Math.max(target, g.limit);
        lastScroll.current = now;
        glideTo(target);
        return;
      }
      if (list.contains(event.target)) return;
      // Keep the page itself still (no bounce), and move the names instead
      event.preventDefault();
      list.scrollTop += delta;
    };

    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchmove", touchMove, { passive: false });
    window.addEventListener("touchend", touchEnd);
    window.addEventListener("touchcancel", touchEnd);
    window.addEventListener("wheel", wheel, { passive: false });
    return () => {
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", touchEnd);
      window.removeEventListener("touchcancel", touchEnd);
      window.removeEventListener("wheel", wheel);
    };
  }, []);

  // Pointer, focus and click handling for the name at a list position
  const nameHandlers = (position) => ({
    onPointerEnter: (event) => {
      // Names sliding under a still pointer while scrolling shouldn't count as hover
      const scrolling = performance.now() - lastScroll.current < 200;
      if (event.pointerType !== "touch" && !scrolling) {
        clearTimeout(hoverLeaveTimer.current);
        setHovered(position);
      }
    },
    onPointerLeave: () => {
      clearTimeout(hoverLeaveTimer.current);
      if (holdHover) hoverLeaveTimer.current = setTimeout(() => setHovered(null), 150);
      else setHovered(null);
    },
    onFocus: () => setFocused(position),
    onBlur: () => setFocused(null),
    onClick: () => setSelected(selected === position ? null : position),
    onKeyDown: (event) => {
      if (event.key === "Escape") {
        setSelected(null);
        event.currentTarget.blur();
      }
    },
  });

  // Back to no artist picked, e.g. when the list changes shape
  const clearSelection = () => {
    setSelected(null);
    setScrolled(null);
  };

  return {
    active,
    activePosition,
    selected,
    loopNames,
    listCopies,
    moreBelow,
    handleListScroll,
    nameHandlers,
    clearSelection,
  };
}
