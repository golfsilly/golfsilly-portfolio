import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="not-found container-shell">
      <p className="eyebrow">404 / {t("label")}</p>
      <h1>{t("title")}</h1>
      <p>{t("body")}</p>
      <Link href="/" className="button-primary">
        {t("back")}
        <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}
