# Tasted — Project Conventions

A minimal website for logging wines and WSET Level 2 tasting notes.
See `README.md` for setup, env vars, and the Supabase table schema.

## Scope

This is an **MVP**, not a complex app. Keep things simple and focused — prefer
the small, obvious solution over the general one.

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Supabase (auth + Postgres database)
- PWA enabled

## Design System

- **Warm `stone-*` palette throughout** — no `gray-*`.
- **Dark mode supported on every page** (`dark:` variants).
- `font-serif` for headings.
- Primary buttons: `bg-stone-900 dark:bg-stone-100`.
- Clean, minimal, editorial feel.

## Architecture

- `components/TastingForm.tsx` — shared form used by **both** the add and edit
  pages. Change tasting fields here, not in two places.
- `components/DeleteTastingButton.tsx` — client component with a confirm dialog.
- `components/Header.tsx`, `components/LogoutButton.tsx` — chrome.
- Auth: email/password **and** Google OAuth.
- `app/auth/callback/route.ts` handles the OAuth redirect.
- Middleware protects the `/add` and `/tastings/*` routes.

## Routes

- `/` — landing page
- `/login`, `/signup` — auth (have dark mode)
- `/add` — create a tasting (protected)
- `/tastings` — list all tastings (protected)
- `/tastings/[id]` — view one (protected)
- `/tastings/[id]/edit` — edit one (protected)

## Conventions

- Logically separated commits — one concern per commit.
- `.env.local` is gitignored; copy from `.env.example`.
