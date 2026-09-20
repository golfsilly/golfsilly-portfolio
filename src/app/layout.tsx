import { NextIntlClientProvider } from "next-intl";
import { fontVariables } from "@/lib/fonts";
import { ThemeProvider } from "@/providers/theme-provider";
import { CookieConsentProvider } from "@/providers/cookie-consent-provider";
import { messages } from "@/i18n/messages";
import { pageMetadata } from "@/lib/site";
import { getAppLocale } from "@/i18n/get-locale";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const locale = await getAppLocale();
  return pageMetadata(locale);
}

export default async function RootLayout({
  children,
}: Readonly<LayoutProps<"/">>) {
  const locale = await getAppLocale();

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages[locale]}>
          <ThemeProvider>
            <CookieConsentProvider>{children}</CookieConsentProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
