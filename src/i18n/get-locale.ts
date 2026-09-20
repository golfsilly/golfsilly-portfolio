import "server-only";

import { getLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "./routing";

export async function getAppLocale(): Promise<Locale> {
  const locale = await getLocale();
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
