# Verification — 2026-09-19

The portfolio renders local, typed content through Server Components into localized pages. Client-side controls switch language/theme, open mobile navigation, copy contact details, and enhance motion without hiding the server-rendered content.

## Environment

- Windows, Intel Core i9-13900H, Node.js 22.23.1.
- Next.js 16.3.5 production build; local HTTP server on port 3100.
- Playwright 1.63.0 / Chromium 153.0.8010.12.
- Lighthouse 13.5.0, default mobile simulation and throttling, headless Chromium.
- Audit build used `NEXT_PUBLIC_SITE_URL=http://localhost:3100` so canonical clean URLs and indexability matched the server. This value was set only in the command environment, not committed or saved to an environment file.

## Checks

- ESLint, TypeScript, production build and formatting.
- 5 unit/component tests: complete translations, duplicate slugs, missing project copy, UI key parity, and real contact-button interaction with successful and denied clipboard writes plus Sonner feedback.
- 28 Playwright cases: 16 language/theme/viewport combinations, five color palettes in Light/Dark, clean URL locale persistence with query/hash, legacy prefix redirects, theme persistence and system changes, keyboard-operated mobile menu and restored focus, all six localized project pages, unknown pages/slugs/locales, JavaScript disabled, motion cleanup during navigation/resize/reduced motion, and social/crawler assets.
- Automated axe WCAG A/AA checks on TH/EN × Light/Dark × 320/390/768/1440px, with no violations in this tested scope. Automated checks do not replace a complete manual accessibility audit.
- Desktop dark and mobile light screenshots inspected, including Thai typography, project concepts and stacked mobile sections. Screenshots are written to `artifacts/` for every tested combination.

## Lighthouse mobile

| Page            | Performance | Accessibility | Best practices | SEO | FCP   | LCP   | TBT   | CLS |
| --------------- | ----------- | ------------- | -------------- | --- | ----- | ----- | ----- | --- |
| `/` (TH cookie) | 92          | 100           | 100            | 100 | 0.8 s | 3.3 s | 90 ms | 0   |
| `/` (EN cookie) | 92          | 100           | 100            | 100 | 0.8 s | 3.3 s | 60 ms | 0   |

These are local lab measurements, not field Core Web Vitals or a promise of identical deployed results. In particular, measured LCP is 3.3 seconds; the performance score meets the plan’s ≥90 target, but real images and hosting should be audited again before launch.

Font preloading improved the initial Thai performance score from 88 to 92. Local fonts are loaded through `next/font/local`, with no build-time Google Fonts fetches.

Raw reports: `artifacts/lighthouse-th.report.html`, `artifacts/lighthouse-en.report.html` and their `.json` counterparts. These generated reports are intentionally ignored by Git.

## Reproduce Lighthouse

Build with your actual deployment origin or the local audit origin, then start the same build. Do not build while another process serves the same `.next` directory.

```powershell
$env:NEXT_PUBLIC_SITE_URL = 'http://localhost:3100'
npm.cmd run build
npm.cmd run start -- --port 3100
```

In a second PowerShell terminal, after installing the Playwright browser as described in README:

```powershell
$env:CHROME_PATH = "$PWD/.cache/playwright/chromium-1243/chrome-win64/chrome.exe"
node node_modules/lighthouse/cli/index.js http://localhost:3100/ --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --output=json --output=html --output-path=artifacts/lighthouse-th --quiet
```

For an English audit, set the `NEXT_LOCALE=en` cookie in the browser profile before running Lighthouse. The Chromium revision directory changes when Playwright is upgraded.

## Remaining content work

Project images and case studies are explicitly labeled concepts. A real portrait, biography, work history, contact details, project URLs and public domain have not been supplied. Empty contact fields stay hidden; the clipboard interaction is tested using a fixture address only. No auth/database services or deployment have been created.

When `NEXT_PUBLIC_SITE_URL` is unset, previews intentionally have `noindex` and an empty sitemap, so a preview SEO score will be lower than the configured audit build. Set the real origin and rebuild before publishing.
