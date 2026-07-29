import { useEffect, useRef, useState } from "react";
import { api } from "./api/client";
import type { LiveSnapshot } from "./types";

/** Polls the live operations feed on an interval. */
export function useLive(intervalMs = 3000) {
  const [snap, setSnap] = useState<LiveSnapshot | null>(null);
  const [online, setOnline] = useState(true);
  useEffect(() => {
    let alive = true;
    const tick = () =>
      api.live()
        .then((s) => { if (alive) { setSnap(s); setOnline(true); } })
        .catch(() => alive && setOnline(false));
    tick();
    const id = setInterval(tick, intervalMs);
    return () => { alive = false; clearInterval(id); };
  }, [intervalMs]);
  return { snap, online };
}

/** Tweens a displayed number toward a target for a smooth "live" feel. */
export function useCountUp(target: number, ms = 700) {
  const [val, setVal] = useState(target);
  const from = useRef(target);
  const raf = useRef(0);
  useEffect(() => {
    // When the tab isn't visible, rAF/timers are throttled — snap to the true
    // value so the number is always correct (animation is cosmetic only).
    const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.visibilityState !== "visible" || reduce) {
      setVal(target);
      from.current = target;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let done = false;
    const finish = () => { if (!done) { done = true; setVal(target); from.current = target; } };
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(a + (target - a) * e);
      if (p < 1) raf.current = requestAnimationFrame(step);
      else finish();
    };
    raf.current = requestAnimationFrame(step);
    // Safety net: guarantees the correct value lands even if rAF is throttled
    // (backgrounded tab / non-compositing view).
    const fallback = window.setTimeout(finish, ms + 250);
    return () => { cancelAnimationFrame(raf.current); window.clearTimeout(fallback); };
  }, [target, ms]);
  return val;
}

/** Adds `.in` to `.reveal` elements as they scroll into view. */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Animates ROI `.track i` bars to their data-w width once visible. */
export function useTracks(deps: unknown[] = []) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll<HTMLElement>(".track i").forEach((i) => {
              i.style.width = i.dataset.w || "0%";
            });
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll("[data-tracks]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Toggles `.scrolled` on the nav after a small scroll. */
export function useNavScroll() {
  useEffect(() => {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
