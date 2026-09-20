import { PolicyPage } from "@/features/consent/policy-page";
import { pageMetadata } from "@/lib/site";
import { getAppLocale } from "@/i18n/get-locale";

export async function generateMetadata() {
  const locale = await getAppLocale();
  return pageMetadata(locale, "/privacy", "Privacy policy — golfsilly");
}

export default async function PrivacyPage() {
  return <PolicyPage locale={await getAppLocale()} type="privacy" />;
}
