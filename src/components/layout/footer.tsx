import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { messages } from "@/i18n/messages";
import type { Locale } from "@/i18n/routing";
import { ConsentTrigger } from "@/features/consent/consent-trigger";

export function Footer({ locale }: { locale: Locale }) {
  const t = messages[locale];
  return (
    <footer className="site-footer container-shell">
      <div>
        <Link href="/" className="wordmark">
          g<span className="brand-dot">.</span>
        </Link>
        <p>{t.footer.tagline}</p>
      </div>
      <div className="footer-meta">
        <span>© {new Date().getFullYear()} golfsilly</span>
        <span>{t.footer.credit}</span>
      </div>
      <ConsentTrigger />
      <a href="#main" className="back-top">
        {t.home.backToTop}
        <ArrowUpRight size={16} />
      </a>
    </footer>
  );
}
