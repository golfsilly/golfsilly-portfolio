import "./globals.css";
import Link from "next/link";
import { siteUrl } from "@/lib/site";
import { fontVariables } from "@/lib/fonts";

export const metadata = {
  metadataBase: siteUrl,
  title: "404 — golfsilly",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="th" className={fontVariables}>
      <body>
        <main className="not-found container-shell">
          <p className="eyebrow">404 / SIGNAL LOST</p>
          <h1>ไม่พบหน้านี้</h1>
          <p>Page not found.</p>
          <Link className="button-primary" href="/">
            กลับหน้าแรก / Home
          </Link>
        </main>
      </body>
    </html>
  );
}
