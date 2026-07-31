# Tasted — Project Conventions

A minimal website for logging wines and WSET Level 2 tasting notes.
See `README.md` for setup, env vars, and the Supabase table schema.

## Scope

This is an **MVP**, not a complex app. Keep things simple and focused — prefer
the small, obvious solution over the general one.

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Supabase (auth + Postgres database + Storage for label photos)
- Gemini Flash-Lite for wine-label recognition
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
- `components/LabelCapture.tsx` — photo capture at the top of the form. Holds the
  compressed file and hands it to the page, which uploads on save; nothing
  reaches Storage from an abandoned form.
- `lib/labelExtraction.ts` — the prompt and response schema. The prompt is the
  substance of this feature; read the header comment before editing it.
- `app/api/extract-label/route.ts` — server-side, so `GEMINI_API_KEY` never
  reaches the browser. Re-validates the model's output before returning it.
- `lib/labelStorage.ts` — upload, sign, delete. The `labels` bucket is private,
  so displaying a label needs a signed URL.

## Label recognition

Two rules hold this feature together; both were learned the hard way.

- **Infer the fields a label omits.** Transcribing alone made the app help least
  where a taster needs it most: New World labels print everything, Old World
  labels print an estate and an appellation. Chablis returns Chardonnay.
- **Never infer sensory fields** — acidity, tannin, body, sweetness, finish,
  aroma. No label carries them, and they are the part of the note that belongs
  to the user's own palate. `vintage` and `alcohol` are also read-only: a
  specific bottle's year is printed or unknowable.

Inferred values are returned unmarked. They are appellation facts rather than
hedges, and every field lands in an editable input.
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
- Schema changes go in `supabase/migrations/` **and** the README's create-table
  SQL, so a fresh project and an existing one both end up correct.
