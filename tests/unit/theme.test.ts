import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_PALETTE,
  PALETTE_STORAGE_KEY,
  paletteIds,
  palettePresets,
  resolvePalette,
} from "@/lib/theme-presets";

describe("theme palettes", () => {
  it("defines five complete palettes with light and dark tokens", () => {
    assert.equal(paletteIds.length, 5);
    for (const id of paletteIds) {
      for (const mode of ["light", "dark"] as const) {
        const tokens = palettePresets[id][mode];
        assert.equal(Object.values(tokens).every(Boolean), true);
      }
    }
  });

  it("falls back to cyan orbit for unknown storage values", () => {
    assert.equal(resolvePalette(null), DEFAULT_PALETTE);
    assert.equal(resolvePalette("unknown"), DEFAULT_PALETTE);
    assert.equal(resolvePalette("rose-infrared"), "rose-infrared");
  });

  it("uses a dedicated local storage key", () => {
    assert.equal(PALETTE_STORAGE_KEY, "golfsilly-palette");
  });
});
