# golfsilly-portfolio

Portfolio สำหรับ Personal brand สไตล์ Futuristic + Glow บน Next.js 16.3 / React 19 รองรับ TH/EN, Light/Dark/System และ responsive แบบ mobile-first

## เริ่มใช้งาน

ใช้ Node.js 22 LTS และ npm ตาม lockfile (ทดสอบบน Node 22.23.1)

```sh
npm ci
npm run dev
```

เปิด http://localhost:3000 — ครั้งแรกใช้ภาษาไทยที่ `/` และจำภาษาที่เลือกผ่านสวิตช์ภาษา โดย URL จะไม่มี `/th` หรือ `/en`

บน Windows ถ้า PowerShell ไม่อนุญาต npm.ps1 ใช้ `npm.cmd` / `npx.cmd` แทน ไม่ต้องเปลี่ยน execution policy

## แก้ข้อมูลให้เป็นของคุณ

- `src/content/profile.ts`: ชื่อ อีเมล social links และชุดเครื่องมือ ค่าอีเมลว่างจะซ่อนปุ่มส่ง/คัดลอกอีเมล
- `/admin/projects`: เพิ่ม แก้ไข เผยแพร่ archive และลบผลงานที่เก็บใน Supabase PostgreSQL
- `src/i18n/messages.ts`: ข้อความ UI, เรื่องราวแนะนำตัว และ SEO ทั้งสองภาษา
- ภาษาใช้ cookie `NEXT_LOCALE` อายุ 1 ปี; ทุกภาษาจะใช้ URL เดียวกัน เช่น `/projects/orbit-workspace`
- `public/images/`: ภาพผลงาน ใช้ alt text ของแต่ละภาษาในข้อมูล project แนะนำรูปอัตราส่วน 1000:720
- `src/app/globals.css`: สี ฟอนต์ ระยะห่าง และ responsive rules; semantic colors รองรับ 5 palettes × Light/Dark ผ่าน `data-palette`

ผลงาน Orbit, Forma และ Mono เป็น **แนวคิดตัวอย่าง** ภาพ SVG ถูกสร้างสำหรับเทมเพลตนี้ ไม่มีงานลูกค้าหรือผลลัพธ์ธุรกิจที่อ้างว่าเกิดขึ้นจริง เปลี่ยน `sample` เป็น `false` เฉพาะผลงานจริงที่คุณใส่เอง ลิงก์ live/source ที่ว่างจะไม่แสดง

เมื่อเพิ่มผลงาน ต้องมี title, category, summary, imageAlt, problem, role, approach และ outcome ครบทั้งสองภาษา การตรวจข้อมูลจะหยุด build ถ้า slug ซ้ำหรือคำแปลขาด

## โครงสร้างและขอบเขต

```text
src/
  app/                   Clean URL routes, root layout, metadata และ error states
  components/ui/         shadcn components บน Base UI
  components/layout/     Header, footer และ navigation
  components/motion/     Motion interactions และ GSAP scroll scenes
  features/home/         Sections หน้าแรกและ contact interaction
  features/projects/     Public project repository, types และ cards
  features/admin/        Admin forms, table, query cache และ UI state
  content/               ข้อมูลตัวตนและ policy ที่แก้ผ่านโค้ด
  i18n/                  Locale routing, navigation, messages
  providers/             Theme, reduced-motion policy และ Sonner
  lib/                   Site configuration, local fonts และ utilities
  proxy.ts               Cookie-based locale routing
```

Public routes: `/`, `/projects`, `/projects/{slug}`, `/privacy` และ `/cookies` พร้อม 404; ไม่มี `[locale]` segment ในโครงสร้าง App Router แล้ว ภาษาอ่านจาก `NEXT_LOCALE` cookie ผ่าน next-intl และใช้ slug เดียวกันทั้งสองภาษา

หน้า public เป็น Server Components และอ่านผลงานจาก Prisma ผ่าน `getProjects(locale)` และ `getProjectBySlug(locale, slug)` เท่านั้น รายการ draft, archived และผลงานที่ไม่มีคำแปลเผยแพร่จะไม่ออกสู่หน้า public

Client Components จำกัดไว้ที่ navigation/theme/contact และ animation Motion ดูแล interaction/reveal ส่วน GSAP ดูแล Hero และจังหวะ Selected Work โดยไม่ควบคุม element เดียวกัน GSAP โหลดเฉพาะ desktop ที่อนุญาต motion พร้อม cleanup ทุกครั้งที่ออกจากหน้า ใช้ native scrolling ไม่มี scroll hijacking

Breakpoints: mobile <768px, tablet 768–1023px, desktop ≥1024px; ผู้ใช้ reduced motion ได้เนื้อหาทันที และเนื้อหาหลัก/ลิงก์ยังใช้ได้เมื่อปิด JavaScript

ฟอนต์ Noto Sans Thai และ Geist Mono ใช้ไฟล์จากแพ็กเกจ Fontsource ผ่าน `next/font/local` พร้อม preload จึงไม่เรียก Google Fonts ขณะ build หรือเปิดเว็บ ใบอนุญาตอยู่ในแพ็กเกจของฟอนต์

ยังไม่มี Blog, ระบบสมาชิก หรือฟอร์มส่งอีเมล ส่วนผลงานจัดการผ่านหลังบ้านที่ `/admin` โดยใช้ Better Auth, Prisma และ Supabase PostgreSQL/Storage

## ตรวจคุณภาพ

```sh
npm run lint
npm run typecheck
npm test
npm run format:check
npm run build
```

ติดตั้ง Chromium สำหรับ E2E ไว้ใน cache ของโปรเจกต์ (PowerShell):

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "$PWD/.cache/playwright"
npx.cmd playwright install chromium
npm.cmd run test:e2e
```

macOS/Linux:

```sh
PLAYWRIGHT_BROWSERS_PATH="$PWD/.cache/playwright" npx playwright install chromium
npm run test:e2e
```

Playwright ใช้ production build ที่พอร์ต 3100 จึงต้อง `npm run build` ก่อน และไม่ควรรัน build/dev ซ้อนกับเซิร์ฟเวอร์ที่ใช้ .next เดียวกัน ถ้ามีเซิร์ฟเวอร์ 3100 เปิดอยู่จะใช้เซิร์ฟเวอร์นั้น ตรวจให้แน่ใจว่าเป็น build ล่าสุด

ชุดทดสอบครอบคลุม 320/390/768/1440px × TH/EN × Light/Dark, 5 palettes, axe accessibility, locale persistence พร้อม query/hash, theme/system, mobile keyboard navigation, project routes, 404, no-JavaScript และ motion lifecycle ส่วน unit tests ตรวจข้อมูล/คำแปล การคัดลอกอีเมล และ theme tokens

Screenshots: `artifacts/` · HTML report: `playwright-report/` · failure traces: `test-results/` — ทั้งหมดไม่ commit

## ก่อนเผยแพร่จริง

1. ใส่ข้อมูลตัวตน ผลงาน รูปภาพ อีเมล และ social links จริง
2. คัดลอก `.env.example` เป็น `.env.local` และตั้ง `NEXT_PUBLIC_SITE_URL` เป็น origin จริง เช่น `https://your-domain.com` โดยไม่มี path
3. Build ใหม่ทุกครั้งที่เปลี่ยนข้อมูลหรือโดเมน แล้วตรวจ metadata, sitemap, social preview และลิงก์จริง
4. Deploy บนโฮสต์ที่รองรับ Next.js Node runtime (ต้องรองรับ Proxy; ไม่ใช้ static export)

ถ้ายังไม่ตั้งโดเมน ระบบจะใช้ localhost สำหรับ preview, ส่ง noindex และ sitemap ว่าง เมื่อตั้ง URL แล้ว metadata, canonical และ robots/sitemap จะใช้ clean URL เดียวกันตาม cookie locale; ไม่มี hreflang เพราะ URL เดียวไม่ได้แทน locale ที่ index แยกกัน หน้า public จะแสดง empty state จนกว่าจะตั้งค่า backend และเผยแพร่ผลงานจาก `/admin`

Social preview สร้างด้วย `next/og` ที่ `/opengraph-image` ส่วน favicon ใช้ `/icon.svg`

ผลวัดและสภาพแวดล้อมทดสอบดูที่ [docs/verification.md](docs/verification.md)

## Environment variables

Environment configuration is validated centrally with [`@t3-oss/env-nextjs`](https://env.t3.gg/docs/nextjs) in `src/env.ts`.

- `NEXT_PUBLIC_SITE_URL` is the optional public origin used by canonical URLs, sitemap, robots, and social metadata.
- An empty value is accepted for local preview; the site then uses `localhost` metadata and disables indexing.
- A non-empty value must be a valid URL. The build fails early when it is invalid.
- Better Auth, Prisma และ Supabase secrets อยู่ใน `server` schema ของ `src/env.ts` และไม่มีค่าใดใช้ prefix `NEXT_PUBLIC_`.

Copy `.env.example` to `.env.local` before local configuration:

```sh
cp .env.example .env.local
```

The app imports validated values from `@/env`; application code should not read `process.env` directly.

## Cookie consent

Cookie consent uses [`@c15t/nextjs`](https://c15t.com/docs/frameworks/next/quickstart) in offline mode. Consent is stored in the browser under the `golfsilly-consent` key and no consent backend or third-party tracking script is loaded in V1.

The banner and preferences panel are custom components built with the existing Base UI/shadcn primitives. Copy lives in `src/i18n/messages.ts`, and the editable policy templates are available at `/privacy` and `/cookies`.

## Backend and portfolio admin

The protected admin area lives at `/admin`. Supabase supplies PostgreSQL and
the public `project-media` Storage bucket; Better Auth is the only auth system.
Supabase Auth and the Supabase Data API are not used for application records.

1. Create a Supabase Free project, a dedicated Prisma database role, and the
   private `app` PostgreSQL schema. Do not add `app` to exposed Data API schemas.
2. Create a public `project-media` bucket. Keep anonymous insert, update, and
   delete disabled because uploads run through authenticated server routes.
3. Create a GitHub OAuth app with callbacks
   `http://localhost:3000/api/auth/callback/github` and
   `https://your-domain.com/api/auth/callback/github`.
4. Copy every backend variable from `.env.example` into `.env.local`.
5. Apply migrations, generate the client, and create the first owner:

```sh
npm run db:deploy
npm run db:generate
npm run auth:create-admin -- --email owner@example.com --name "Owner" --role admin
```

Use the Supavisor transaction pooler on port 6543 for `DATABASE_URL` and the
session pooler on port 5432 for `DIRECT_URL`. Run `npm run db:deploy` before a
production deployment; builds generate the client but never apply migrations.

If every backend variable is empty, the public site remains available with an
empty project state and `/admin/sign-in` shows setup instructions. Supplying
only part of the backend environment is treated as a configuration error.

# golfsilly-portfolio
