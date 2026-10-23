# INV Compass

Internal CRM and project-operations app for INV Home. The rulebook is [`CLAUDE.md`](CLAUDE.md); the product specs are in [`docs/`](docs).

Stack: Next.js (App Router) + TypeScript + Tailwind + shadcn-style components, Supabase, Vitest, Playwright, pnpm, Vercel.

## Run it on your computer

You need Node 22 and pnpm 10.

```bash
pnpm install
cp .env.example .env.local     # then fill in the publishable key (see below)
pnpm dev                       # http://localhost:3000
```

## Settings (environment variables)

| Name                                   | Secret?                  | What it is                                                                                           |
| -------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | No                       | `https://qiitpirpnqaonnzmdmhc.supabase.co`. The app refuses to start with any other project address. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | No (public by design)    | Supabase dashboard > Project Settings > API Keys > "publishable".                                    |
| `SUPABASE_SERVICE_ROLE_KEY`            | **Yes. Server only.**    | Supabase dashboard > Project Settings > API Keys > "secret". Not needed until the invite step.       |

Real values live in `.env.local` (never committed) and in Vercel. A pre-commit check blocks any commit that contains a secret key, a service-role key, a database password, or an `.env` file other than `.env.example`.

## Commands

| Command           | What it does                                                       |
| ----------------- | ------------------------------------------------------------------ |
| `pnpm dev`        | Start the app locally                                              |
| `pnpm build`      | Make the production build                                          |
| `pnpm typecheck`  | Check the TypeScript types                                         |
| `pnpm lint`       | Check code quality and accessibility rules                         |
| `pnpm format`     | Tidy the code formatting                                           |
| `pnpm test`       | Run unit tests (Vitest)                                            |
| `pnpm test:e2e`   | Run browser tests with an accessibility scan (Playwright)          |

In the cloud sandbox, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/opt/pw-browsers/chromium` before `pnpm test:e2e`.

## Preview on Vercel

1. In Vercel choose **Add New > Project** and import `inv-500/INV-COMPASS`.
2. Vercel detects Next.js by itself. Leave the build settings alone.
3. Open **Environment Variables** and add the three names above. Tick **Production** and **Preview** for each. Paste the secret key here yourself, never in chat.
4. Press **Deploy**. Every branch and pull request then gets its own preview link, and the home page shows whether the app reached its database.
