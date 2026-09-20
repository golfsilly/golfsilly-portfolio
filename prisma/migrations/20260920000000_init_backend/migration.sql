CREATE SCHEMA IF NOT EXISTS "app";

CREATE TYPE "app"."ProjectLocale" AS ENUM ('th', 'en');
CREATE TYPE "app"."ProjectTone" AS ENUM ('cyan', 'violet', 'amber');

CREATE TABLE "app"."user" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "image" TEXT,
  "role" TEXT DEFAULT 'user',
  "banned" BOOLEAN DEFAULT false,
  "banReason" TEXT,
  "banExpires" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "app"."session" (
  "id" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "token" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL,
  "impersonatedBy" TEXT,
  CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "app"."account" (
  "id" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP(3),
  "refreshTokenExpiresAt" TIMESTAMP(3),
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "app"."verification" (
  "id" TEXT NOT NULL,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3),
  CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "app"."Project" (
  "id" UUID NOT NULL,
  "slug" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "sample" BOOLEAN NOT NULL DEFAULT false,
  "tone" "app"."ProjectTone" NOT NULL DEFAULT 'cyan',
  "stack" TEXT[] NOT NULL,
  "imagePath" TEXT,
  "liveUrl" TEXT,
  "sourceUrl" TEXT,
  "archivedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "app"."ProjectTranslation" (
  "id" UUID NOT NULL,
  "projectId" UUID NOT NULL,
  "locale" "app"."ProjectLocale" NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "imageAlt" TEXT NOT NULL,
  "problem" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "approach" TEXT NOT NULL,
  "outcome" TEXT NOT NULL,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProjectTranslation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_email_key" ON "app"."user"("email");
CREATE UNIQUE INDEX "session_token_key" ON "app"."session"("token");
CREATE INDEX "session_userId_idx" ON "app"."session"("userId");
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "app"."account"("providerId", "accountId");
CREATE INDEX "account_userId_idx" ON "app"."account"("userId");
CREATE INDEX "verification_identifier_idx" ON "app"."verification"("identifier");
CREATE UNIQUE INDEX "Project_slug_key" ON "app"."Project"("slug");
CREATE INDEX "Project_archivedAt_sortOrder_idx" ON "app"."Project"("archivedAt", "sortOrder");
CREATE UNIQUE INDEX "ProjectTranslation_projectId_locale_key" ON "app"."ProjectTranslation"("projectId", "locale");
CREATE INDEX "ProjectTranslation_locale_publishedAt_idx" ON "app"."ProjectTranslation"("locale", "publishedAt");

ALTER TABLE "app"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "app"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "app"."ProjectTranslation" ADD CONSTRAINT "ProjectTranslation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "app"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
