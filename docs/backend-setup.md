# Backend setup

The application uses Supabase for PostgreSQL and Storage. Authentication is
owned by Better Auth; Supabase Auth is intentionally not enabled.

## 1. Supabase

1. Create a Free project and record the database password.
2. In **Connect**, copy the Supavisor transaction URL (port `6543`) into
   `DATABASE_URL`. Add `sslmode=require&pgbouncer=true` when those parameters
   are not already present.
3. Copy the Supavisor session URL (port `5432`) into `DIRECT_URL`. This URL is
   used only by Prisma CLI migrations.
4. Follow Supabase's Prisma guide to create a dedicated `prisma` database role.
   Use that role in both URLs.
5. Keep the `app` schema out of **Data API > Exposed schemas**. The first Prisma
   migration creates it and all application tables.
6. Create a public Storage bucket named `project-media`. Do not add anonymous
   insert, update, or delete policies. Admin uploads use the server-only service
   role after Better Auth authorization.

## 2. GitHub OAuth

Create a GitHub OAuth App. Use these callback URLs:

- Local: `http://localhost:3000/api/auth/callback/github`
- Production: `https://your-domain.com/api/auth/callback/github`

The first admin account should use the same verified primary email as GitHub.
GitHub sign-up is disabled, so OAuth cannot create arbitrary accounts.

## 3. Environment and database

Copy `.env.example` to `.env.local`, fill every backend variable, then run:

```sh
pnpm db:deploy
pnpm db:generate
pnpm auth:create-admin --email owner@example.com --name "Owner" --role admin
```

`auth:generate` is reserved for Better Auth schema or plugin changes. Review its
output before applying it and keep every generated auth model in Prisma schema
`app`; Prisma migrations remain the only database schema history.

Set the same variables in Vercel. Preview and production deployments should use
separate Supabase projects when preview data must be isolated. Apply migrations
with `pnpm db:deploy` before promoting the deployment; do not run migrations
inside a request or serverless function.

## 4. Storage and deletion behavior

Uploads accept JPEG, PNG, WebP, and AVIF up to 5 MB. Database updates complete
before an old image is removed. Permanent deletion removes the database record
first and then attempts Storage cleanup. If cleanup fails, the API reports a
warning and the unreferenced object can be removed from the Supabase dashboard.
