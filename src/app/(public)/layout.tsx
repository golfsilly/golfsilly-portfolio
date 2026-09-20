import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { messages } from "@/i18n/messages";
import { getAppLocale } from "@/i18n/get-locale";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const locale = await getAppLocale();
  return (
    <>
      <a className="skip-link" href="#main">
        {messages[locale].nav.skip}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer locale={locale} />
    </>
  );
}
