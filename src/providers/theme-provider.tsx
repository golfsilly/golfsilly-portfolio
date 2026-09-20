"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";
import {
  DEFAULT_PALETTE,
  PALETTE_STORAGE_KEY,
  palettePresets,
  resolvePalette,
  type PaletteId,
} from "@/lib/theme-presets";

type PaletteContextValue = {
  palette: PaletteId;
  setPalette: (palette: PaletteId) => void;
};

const PaletteContext = createContext<PaletteContextValue | null>(null);

const paletteBootstrap = `(() => {
  try {
    const value = localStorage.getItem(${JSON.stringify(PALETTE_STORAGE_KEY)});
    const allowed = ${JSON.stringify(Object.keys(palettePresets))};
    const palette = allowed.includes(value) ? value : ${JSON.stringify(DEFAULT_PALETTE)};
    document.documentElement.dataset.palette = palette;
  } catch {
    document.documentElement.dataset.palette = ${JSON.stringify(DEFAULT_PALETTE)};
  }
})();`;

export function usePalette() {
  const context = useContext(PaletteContext);
  if (!context) throw new Error("usePalette must be used within ThemeProvider");
  return context;
}

function Notifications() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      richColors
      closeButton
      position="bottom-right"
    />
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const palette = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("golfsilly-palette-change", onStoreChange);
      return () =>
        window.removeEventListener("golfsilly-palette-change", onStoreChange);
    },
    () => resolvePalette(window.localStorage.getItem(PALETTE_STORAGE_KEY)),
    () => DEFAULT_PALETTE,
  );

  const paletteContext: PaletteContextValue = {
    palette,
    setPalette: (nextPalette: PaletteId) => {
      window.localStorage.setItem(PALETTE_STORAGE_KEY, nextPalette);
      document.documentElement.dataset.palette = nextPalette;
      window.dispatchEvent(new Event("golfsilly-palette-change"));
    },
  };

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PaletteContext.Provider value={paletteContext}>
        <script
          id="palette-bootstrap"
          dangerouslySetInnerHTML={{ __html: paletteBootstrap }}
        />
        <MotionConfig reducedMotion="user">
          {children}
          <Notifications />
        </MotionConfig>
      </PaletteContext.Provider>
    </NextThemesProvider>
  );
}
