"use client";

import type { ReactNode } from "react";
import { ConsentManagerProvider } from "@c15t/nextjs";
import { CookieConsentUI } from "@/features/consent/consent-ui";
import { consentCategories } from "@/features/consent/types";

const consentOptions = {
  mode: "offline" as const,
  consentCategories: [...consentCategories],
  storageConfig: {
    storageKey: "golfsilly-consent",
    defaultExpiryDays: 365,
  },
  reloadOnConsentRevoked: true,
};

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  return (
    <ConsentManagerProvider options={consentOptions}>
      {children}
      <CookieConsentUI />
    </ConsentManagerProvider>
  );
}
