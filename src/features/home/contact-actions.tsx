"use client";

import { ArrowUpRight, Copy } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ContactActions({ email }: { email: string }) {
  const t = useTranslations("home");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  }
  return (
    <div className="contact-actions">
      <a className="button-primary" href={`mailto:${email}`}>
        {t("email")}
        <ArrowUpRight size={18} />
      </a>
      <Button variant="outline" onClick={copyEmail}>
        <Copy size={16} />
        {t("copy")}
      </Button>
      <span className="contact-email">{email}</span>
    </div>
  );
}
