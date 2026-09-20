import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["th", "en"],
  defaultLocale: "th",
  // Keep the locale internal to next-intl; the browser only sees clean paths.
  localePrefix: "never",
  // Clean paths use the locale cookie to select the rendered translation.
  // The proxy applies the Thai default without consulting Accept-Language.
  localeDetection: false,
  // A single clean URL cannot represent two indexable language variants.
  alternateLinks: false,
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  },
});

export type Locale = (typeof routing.locales)[number];
