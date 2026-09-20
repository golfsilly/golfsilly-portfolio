"use client";

import { useState } from "react";
import { Check, ExternalLink, ShieldCheck, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useConsentManager } from "@c15t/nextjs";
import { useHeadlessConsentUI } from "@c15t/nextjs/headless";
import { Link } from "@/i18n/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function CookieConsentUI() {
  return (
    <>
      <ConsentBanner />
      <ConsentPreferences />
    </>
  );
}

function ConsentBanner() {
  const t = useTranslations("consent");
  const { isLoadingConsentInfo } = useConsentManager();
  const { banner, openDialog, performBannerAction } = useHeadlessConsentUI();
  const [saving, setSaving] = useState(false);

  if (isLoadingConsentInfo || !banner.isVisible) return null;

  async function acceptNecessary() {
    setSaving(true);
    try {
      await performBannerAction("accept", { uiSource: "custom-banner" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <aside className="cookie-consent-banner" aria-labelledby="cookie-title">
      <div className="cookie-consent-orb" aria-hidden="true" />
      <div className="cookie-consent-copy">
        <p className="eyebrow">PRIVACY / 01</p>
        <h2 id="cookie-title">{t("banner.title")}</h2>
        <p>{t("banner.description")}</p>
        <div className="cookie-consent-links">
          <Link href="/privacy">
            {t("policy.privacy")}
            <ExternalLink size={12} aria-hidden="true" />
          </Link>
          <Link href="/cookies">
            {t("policy.cookies")}
            <ExternalLink size={12} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="cookie-consent-actions">
        <Button type="button" variant="outline" onClick={openDialog}>
          {t("banner.settings")}
        </Button>
        <Button type="button" onClick={acceptNecessary} disabled={saving}>
          <Check size={15} aria-hidden="true" />
          {t("banner.accept")}
        </Button>
      </div>
    </aside>
  );
}

function ConsentPreferences() {
  const t = useTranslations("consent");
  const { selectedConsents, setActiveUI } = useConsentManager();
  const { dialog, closeUI, saveCustomPreferences } = useHeadlessConsentUI();
  const [saving, setSaving] = useState(false);

  async function savePreferences() {
    setSaving(true);
    try {
      await saveCustomPreferences({ uiSource: "custom-dialog" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet
      open={dialog.isVisible}
      onOpenChange={(open) => (open ? setActiveUI("dialog") : closeUI())}
    >
      <SheetContent
        side="bottom"
        className="cookie-consent-sheet"
        showCloseButton={false}
      >
        <SheetHeader className="cookie-consent-sheet-header">
          <div>
            <p className="eyebrow">PRIVACY / 02</p>
            <SheetTitle>{t("dialog.title")}</SheetTitle>
            <SheetDescription>{t("banner.description")}</SheetDescription>
          </div>
          <SheetClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close"
              />
            }
          >
            <X size={18} aria-hidden="true" />
          </SheetClose>
        </SheetHeader>

        <div className="cookie-consent-sheet-body">
          <div className="cookie-consent-category">
            <div className="cookie-consent-category-icon" aria-hidden="true">
              <ShieldCheck size={20} />
            </div>
            <div className="cookie-consent-category-copy">
              <div className="cookie-consent-category-title">
                <h3>{t("dialog.necessary")}</h3>
                <span className="cookie-consent-required">REQUIRED</span>
              </div>
              <p>{t("dialog.necessaryDescription")}</p>
              <dl className="cookie-consent-table">
                <div>
                  <dt>Cookies</dt>
                  <dd>NEXT_LOCALE, golfsilly-consent</dd>
                </div>
                <div>
                  <dt>Storage</dt>
                  <dd>Language, consent and interface preferences</dd>
                </div>
                <div>
                  <dt>Duration</dt>
                  <dd>Up to 1 year</dd>
                </div>
              </dl>
            </div>
            <span
              className="cookie-consent-switch"
              role="switch"
              aria-checked={selectedConsents.necessary !== false}
              aria-disabled="true"
            >
              <span />
            </span>
          </div>
          <div className="cookie-consent-sheet-links">
            <Link href="/privacy">{t("policy.privacy")}</Link>
            <Link href="/cookies">{t("policy.cookies")}</Link>
          </div>
        </div>

        <SheetFooter className="cookie-consent-sheet-footer">
          <Button type="button" variant="outline" onClick={closeUI}>
            {t("banner.accept")}
          </Button>
          <Button type="button" onClick={savePreferences} disabled={saving}>
            {t("dialog.save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
