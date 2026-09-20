import { HomePage } from "@/features/home/home-page";
import { getAppLocale } from "@/i18n/get-locale";

export default async function Page() {
  return <HomePage locale={await getAppLocale()} />;
}
