import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { messages } from "./messages";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const requestedLocale = locale ?? (await requestLocale);
  const resolvedLocale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: messages[resolvedLocale],
  };
});
