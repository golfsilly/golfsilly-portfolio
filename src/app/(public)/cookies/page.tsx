import { PolicyPage } from "@/features/consent/policy-page";
import { pageMetadata } from "@/lib/site";
import { getAppLocale } from "@/i18n/get-locale";

export async function generateMetadata() {
  const locale = await getAppLocale();
  return pageMetadata(locale, "/cookies", "Cookie policy — golfsilly");
}

export default async function CookiesPage() {
  return <PolicyPage locale={await getAppLocale()} type="cookies" />;
}
