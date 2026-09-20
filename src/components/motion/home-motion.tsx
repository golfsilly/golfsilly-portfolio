"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const Scenes = dynamic(() => import("./scroll-scenes"), { ssr: false });
const query = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

export function HomeMotion() {
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
  return enabled ? <Scenes /> : null;
}
