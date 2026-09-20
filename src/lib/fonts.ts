import localFont from "next/font/local";

// Packages pin the actual font files; builds never contact Google Fonts.
const thai = localFont({
  src: "../../node_modules/@fontsource-variable/noto-sans-thai/files/noto-sans-thai-thai-wght-normal.woff2",
  variable: "--font-thai",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC",
    },
  ],
});
const latin = localFont({
  src: "../../node_modules/@fontsource-variable/noto-sans-thai/files/noto-sans-thai-latin-wght-normal.woff2",
  variable: "--font-latin",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: false,
});
const mono = localFont({
  src: "../../node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: false,
});

export const fontVariables = `${thai.variable} ${latin.variable} ${mono.variable}`;
