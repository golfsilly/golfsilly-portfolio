"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  return (
    <div className="not-found container-shell">
      <h1>{t("title")}</h1>
      <p>{t("body")}</p>
      <Button onClick={reset}>{t("retry")}</Button>
    </div>
  );
}
