export const paletteIds = [
  "cyan-orbit",
  "violet-signal",
  "amber-studio",
  "emerald-field",
  "rose-infrared",
] as const;

export type PaletteId = (typeof paletteIds)[number];

export type ThemeTokens = {
  background: string;
  foreground: string;
  card: string;
  muted: string;
  mutedForeground: string;
  primary: string;
  primaryForeground: string;
  border: string;
  destructive: string;
  glow: string;
  grid: string;
  visualDeep: string;
  visualHighlight: string;
  visualBorder: string;
  visualForeground: string;
};

export type PalettePreset = {
  light: ThemeTokens;
  dark: ThemeTokens;
};

export const DEFAULT_PALETTE: PaletteId = "cyan-orbit";
export const PALETTE_STORAGE_KEY = "golfsilly-palette";

const cyanLight: ThemeTokens = {
  background: "#f6f8fa",
  foreground: "#17232d",
  card: "#ffffff",
  muted: "#e9eff3",
  mutedForeground: "#526371",
  primary: "#087585",
  primaryForeground: "#ffffff",
  border: "#d3dde4",
  destructive: "#ba2534",
  glow: "#11b6cf",
  grid: "#87a0b017",
  visualDeep: "#0c202d",
  visualHighlight: "#235b68",
  visualBorder: "#488492",
  visualForeground: "#e1f6f7",
};

const cyanDark: ThemeTokens = {
  ...cyanLight,
  background: "#090f16",
  foreground: "#ecf2f7",
  card: "#101922",
  muted: "#16232e",
  mutedForeground: "#9eafbd",
  primary: "#75e4ed",
  primaryForeground: "#09232a",
  border: "#26333f",
  destructive: "#ff8d94",
  glow: "#26d5e9",
  grid: "#8eaac110",
};

export const palettePresets: Record<PaletteId, PalettePreset> = {
  "cyan-orbit": { light: cyanLight, dark: cyanDark },
  "violet-signal": {
    light: {
      ...cyanLight,
      background: "#f8f7fc",
      foreground: "#251d36",
      card: "#ffffff",
      muted: "#eeebf8",
      mutedForeground: "#675d78",
      primary: "#6d4ac7",
      border: "#ddd6ef",
      glow: "#ab8cff",
      grid: "#b6a7de22",
    },
    dark: {
      ...cyanDark,
      background: "#100d1b",
      foreground: "#f2edff",
      card: "#181329",
      muted: "#211a35",
      mutedForeground: "#b9acd5",
      primary: "#c7b3ff",
      primaryForeground: "#1e1237",
      border: "#392d55",
      destructive: "#ff9ab7",
      glow: "#ab8cff",
      grid: "#c6b6ff18",
    },
  },
  "amber-studio": {
    light: {
      ...cyanLight,
      background: "#fbf8f2",
      foreground: "#302318",
      card: "#fffdf8",
      muted: "#f3eadc",
      mutedForeground: "#756354",
      primary: "#a85b16",
      border: "#e5d4c1",
      destructive: "#b42318",
      glow: "#f4b866",
      grid: "#caa77e24",
    },
    dark: {
      ...cyanDark,
      background: "#17110b",
      foreground: "#fff4e4",
      card: "#21170e",
      muted: "#2d2114",
      mutedForeground: "#c7ae92",
      primary: "#f3b35b",
      primaryForeground: "#2b1706",
      border: "#493520",
      destructive: "#ff9b7d",
      glow: "#f4b866",
      grid: "#e6b77718",
    },
  },
  "emerald-field": {
    light: {
      ...cyanLight,
      background: "#f3faf7",
      foreground: "#142a25",
      card: "#ffffff",
      muted: "#e3f2ed",
      mutedForeground: "#55736a",
      primary: "#087e68",
      border: "#c9e1d9",
      destructive: "#b4234d",
      glow: "#33d9b2",
      grid: "#75cdb522",
    },
    dark: {
      ...cyanDark,
      background: "#071713",
      foreground: "#e9fff8",
      card: "#0d211c",
      muted: "#113027",
      mutedForeground: "#98cabe",
      primary: "#62dfbe",
      primaryForeground: "#062c24",
      border: "#1e463c",
      destructive: "#ff9bb3",
      glow: "#33d9b2",
      grid: "#84e7cf18",
    },
  },
  "rose-infrared": {
    light: {
      ...cyanLight,
      background: "#fff7f8",
      foreground: "#321d26",
      card: "#ffffff",
      muted: "#f7e5eb",
      mutedForeground: "#7e5b67",
      primary: "#b53d62",
      border: "#ebcbd7",
      destructive: "#b4234d",
      glow: "#ff6f9a",
      grid: "#e8a6ba22",
    },
    dark: {
      ...cyanDark,
      background: "#1b0b13",
      foreground: "#ffeaf0",
      card: "#27111b",
      muted: "#341522",
      mutedForeground: "#d2a4b2",
      primary: "#ff93af",
      primaryForeground: "#3a101f",
      border: "#5a2c3d",
      destructive: "#ff9ca8",
      glow: "#ff6f9a",
      grid: "#ff9dbb18",
    },
  },
};

export function isPaletteId(
  value: string | null | undefined,
): value is PaletteId {
  return Boolean(value && paletteIds.includes(value as PaletteId));
}

export function resolvePalette(value: string | null | undefined): PaletteId {
  return isPaletteId(value) ? value : DEFAULT_PALETTE;
}
