"use client";

import { Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useConsentManager } from "@c15t/nextjs";
import { Button } from "@/components/ui/button";

export function ConsentTrigger() {
  const t = useTranslations("consent");
  const { setActiveUI } = useConsentManager();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="cookie-consent-trigger"
      onClick={() => setActiveUI("dialog", { force: true })}
    >
      <Settings2 size={14} aria-hidden="true" />
      {t("trigger")}
    </Button>
  );
}
