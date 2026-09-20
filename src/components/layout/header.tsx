"use client";

import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeSettings } from "./theme-settings";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const nextLocale = locale === "th" ? "en" : "th";
  const links = [
    { href: "/projects", label: t("work") },
    { href: "/#about", label: t("about") },
    { href: "/#stack", label: t("stack") },
  ];
  return (
    <header className="site-header">
      <div className="container-shell header-inner">
        <Link
          href="/"
          className="wordmark"
          aria-label={`golfsilly — ${t("home")}`}
        >
          golfsilly<span className="brand-dot">.</span>
        </Link>
        <nav className="desktop-nav" aria-label={t("label")}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={
                link.href === "/projects" && pathname.startsWith("/projects")
                  ? "page"
                  : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href={pathname}
            locale={nextLocale}
            className="language-switch mono"
            aria-label={`TH / EN — ${t("language")}`}
            onClick={(event) => {
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
                return;
              event.preventDefault();
              document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
              router.replace(
                `${pathname}${window.location.search}${window.location.hash}`,
                { locale: nextLocale, scroll: false },
              );
              router.refresh();
            }}
          >
            <span className={locale === "th" ? "language-active" : ""}>TH</span>
            <span className="language-divider">/</span>
            <span className={locale === "en" ? "language-active" : ""}>EN</span>
          </Link>
          <span className="header-divider" />
          <ThemeSettings />
          <Link href="/#contact" className="header-contact">
            {t("contact")}
            <ArrowUpRight size={16} />
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="mobile-menu-trigger header-icon"
                  aria-label={t("open")}
                />
              }
            >
              <Menu size={21} />
            </SheetTrigger>
            <SheetContent className="mobile-sheet" showCloseButton={false}>
              <SheetHeader>
                <SheetTitle>
                  golfsilly<span className="brand-dot">.</span>
                </SheetTitle>
                <SheetDescription>{t("label")}</SheetDescription>
              </SheetHeader>
              <SheetClose
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mobile-menu-close"
                    aria-label={t("close")}
                  />
                }
              >
                <X size={21} />
              </SheetClose>
              <nav aria-label={t("label")} className="mobile-nav">
                {[
                  { href: "/", label: t("home") },
                  ...links,
                  { href: "/#contact", label: t("contact") },
                ].map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    <span className="mono">0{i + 1}</span>
                    {link.label}
                    <ArrowUpRight size={20} />
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <noscript>
        <nav className="noscript-nav" aria-label={t("label")}>
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/#contact">{t("contact")}</Link>
        </nav>
      </noscript>
    </header>
  );
}
