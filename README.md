# PrismMTR

PrismMTR is a production-minded MVP for a Minecraft Transit Railway community and company management platform. It is Discord-first, company-centric, and structured like a modern app dashboard without live chat.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Prisma
- PostgreSQL
- Auth.js / NextAuth with Discord provider
- Zod
- React Hook Form

## What Is Included

- Public landing, discovery, company, user, and post routes
- Discord-first sign-in flow
- Multi-step onboarding
- Public user profiles and company pages
- Discord-inspired mini profile hover cards and expanded profile dialogs
- Authenticated dashboard
- Company hub with members, projects, posts, applications, invites, and settings
- Moderation queues for posts, companies, reports, and users
- Server-side permission checks and validated server actions
- Prisma schema plus seed data for immediate local testing

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Copy environment variables.

```bash
copy .env.example .env
```

3. Update `.env`.

- `DATABASE_URL` should point to a local PostgreSQL database for local dev.
- `DIRECT_URL` should match `DATABASE_URL` locally.
- `AUTH_SECRET` and `NEXTAUTH_SECRET` should be the same long random string.
- `AUTH_DISCORD_ID` and `AUTH_DISCORD_SECRET` should come from a Discord OAuth application.
- `AUTH_URL` and `NEXTAUTH_URL` should both be set to your local app URL.

4. Apply the schema.

```bash
npm run db:push
```

5. Seed the database.

```bash
npm run db:seed
```

6. Start the app.

```bash
npm run dev
```

7. Open your local app URL in the browser.

## Discord OAuth Setup

Create a Discord OAuth application and add this local callback URL:

- `<LOCAL_APP_URL>/api/auth/callback/discord`

If Discord credentials are missing, the sign-in button stays visible but disabled so the public product can still be explored.

## Netlify Deployment

PrismMTR is prepared for GitHub -> Netlify remote builds. Do not rely on local Windows CLI deploys for this repo.

Target Netlify site:

- your production Netlify site URL

### Build Settings

- Base directory: repository root
- Build command: `npm run build`
- Publish directory: leave blank and let Netlify detect the Next.js app
- Node version: `20`

The repository includes a minimal `netlify.toml` and pins Node 20 for remote Netlify builds.

### Required Netlify Environment Variables

Set these in the Netlify site dashboard:

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `NEXTAUTH_SECRET`
- `AUTH_URL`
- `NEXTAUTH_URL`
- `AUTH_TRUST_HOST`
- `AUTH_DISCORD_ID`
- `AUTH_DISCORD_SECRET`

Recommended production values:

- `DATABASE_URL`: Supabase pooled connection string on port `6543` with `pgbouncer=true&connection_limit=1&sslmode=require`
- `DIRECT_URL`: Supabase direct Postgres connection on port `5432` with `sslmode=require`
- `AUTH_URL`, `NEXTAUTH_URL`: your production site URL
- `AUTH_TRUST_HOST`: `true`

### Prisma + Supabase Production Notes

Use Supabase with two connection strings:

- Runtime queries use `DATABASE_URL`
  This should be the pooled connection string for Prisma in the deployed app.
- Migrations use `DIRECT_URL`
  This should be the direct database connection because Prisma migrate should not run through PgBouncer.
- Both URLs should include `sslmode=require` for deployed Supabase connections.

This is why `prisma/schema.prisma` defines both `url` and `directUrl`.

### Current State Of Prisma In This Repo

This repository currently has:

- `prisma/schema.prisma`
- `prisma/seed.ts`
- no `prisma/migrations` directory yet

That means:

- local/dev setup should use `npm run db:push`
- local/dev seed should use `npm run db:seed`
- production should not run `npm run db:seed`

### Safest Production Database Workflow Right Now

Because this repo does not yet contain committed Prisma migrations, the practical short-term workflow is:

1. Create the Supabase production database.
2. Set production env vars in Netlify.
3. From a trusted local machine, point `.env` at the production Supabase database.
4. Run `npm run db:push` once against production to create the schema.
5. Do not run `npm run db:seed` against production.
6. Deploy the app from GitHub through the Netlify UI.

For future schema changes, the better long-term path is to start using Prisma migrations and commit `prisma/migrations`.

### GitHub -> Netlify Remote Build Flow

1. Push this repo to GitHub.
2. In Netlify, connect the GitHub repository to the existing site or import it into a new site.
3. Keep the build command as `npm run build`.
4. Leave publish directory empty unless Netlify auto-fills the Next.js output handling.
5. Add all production env vars in the Netlify UI before the first production build.
6. Add the Discord production callback URL:
   `<YOUR_PRODUCTION_SITE_URL>/api/auth/callback/discord`

### Prisma Client On Netlify

`next.config.ts` marks `@prisma/client` and `prisma` as server external packages so Prisma stays in the Node runtime path instead of being aggressively bundled into the app build.

The auth route at `src/app/api/auth/[...nextauth]/route.ts` explicitly uses the Node runtime, which is the correct runtime for Prisma and NextAuth on Netlify.

## Future Media Storage

PrismMTR stores media as URL fields today:

- user avatars and banners
- company logos and banners

That keeps the app ready for future Supabase Storage integration without coupling this MVP to a storage implementation too early.

When storage is added later, the application can keep the same database fields and simply start writing Supabase Storage public URLs or signed delivery URLs into them.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run db:migrate
npm run db:deploy
npm run db:push
npm run db:seed
npm run db:studio
```

## Seed Content

The seed script creates:

- multiple users with different site roles
- multiple companies with different approval and privacy states
- member role distribution
- public and pending posts
- projects
- build requests
- invites
- company applications
- notifications
- reports
- activity feed events
- badges

## Project Structure

```text
prisma/
  schema.prisma
  seed.ts
src/
  actions/
  app/
    (site)/
    (app)/
    (staff)/
    api/auth/[...nextauth]/
  components/
    forms/
    layout/
    motion/
    platform/
    providers/
    ui/
  lib/
    auth.ts
    data.ts
    db.ts
    env.ts
    navigation.ts
    permissions.ts
    session.ts
    slug.ts
    validators.ts
```

## Notes

- Discord is the primary authentication path.
- Email/password is stored only as an optional future-ready placeholder.
- Microsoft linking is represented in the data model and settings flow, but the actual launcher integration is intentionally deferred.
- Public content moderation is enforced server-side through validated actions.

## References

- [Netlify Next.js framework docs](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
- [Prisma connection pooling with Supabase](https://www.prisma.io/docs/orm/overview/databases/supabase)
