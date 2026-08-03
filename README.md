# Tasted

A simple, minimal website for logging wines and WSET Level 2 tasting notes.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Supabase:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy `.env.example` to `.env.local`
   - Add your Supabase URL and anon key to `.env.local`

3. Create the database table:
   ```sql
   create table tastings (
     id uuid default gen_random_uuid() primary key,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     user_id uuid not null references auth.users (id) on delete cascade,
     wine_name text not null,
     wine_type text not null,
     vintage integer,
     producer text,
     region text,
     country text,
     grape_variety text,
     alcohol numeric(4, 1),
     label_image_url text,
     clarity text,
     appearance_intensity text,
     color text,
     sweetness text not null,
     acidity text not null,
     tannin text,
     body text not null,
     mousse text,
     finish text not null,
     aromas text[],
     quality_level text,
     notes text
   );

   create index tastings_user_id_created_at_idx
     on tastings (user_id, created_at desc);
   create index tastings_user_country_idx on tastings (user_id, country);
   create index tastings_user_grape_idx on tastings (user_id, grape_variety);
   ```

4. Enable Row Level Security so users can only reach their own rows:
   ```sql
   alter table tastings enable row level security;

   create policy "Users can read their own tastings"
     on tastings for select
     using (auth.uid() = user_id);

   create policy "Users can insert their own tastings"
     on tastings for insert
     with check (auth.uid() = user_id);

   create policy "Users can update their own tastings"
     on tastings for update
     using (auth.uid() = user_id)
     with check (auth.uid() = user_id);

   create policy "Users can delete their own tastings"
     on tastings for delete
     using (auth.uid() = user_id);
   ```

   RLS is required, not optional: the app talks to Postgres directly with the
   public anon key, so these policies are the only thing isolating one user's
   tastings from another's.

5. Create the label-photo bucket and its policies. The SQL is in
   `supabase/migrations/002_label_capture.sql` — paste it into the SQL editor.
   It creates a **private** `labels` bucket (a tasting note is personal, and a
   public bucket would make every label readable by URL) plus the four storage
   policies that scope each user to their own folder. Without them, uploads
   fail with a 403.

6. Set up label recognition:
   - Get a free Gemini API key at
     [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
   - Add it to `.env.local` as `GEMINI_API_KEY`.

   The key is read only in `app/api/extract-label/route.ts`, server-side — it is
   deliberately not `NEXT_PUBLIC_`, so it never reaches the browser. Without a
   key the app still works; the photo step reports that recognition is not
   configured and everything can be typed by hand.

7. Configure the auth redirect URLs. In the Supabase dashboard under
   **Authentication → URL Configuration**, add your deployed origin's
   `/auth/callback` to the redirect allow-list (e.g.
   `https://your-app.vercel.app/auth/callback`), alongside
   `http://localhost:3000/auth/callback`. Password-reset links are rejected if
   their redirect target is not on this list.

8. (Optional) Enable Google sign-in:
   - In the Supabase dashboard, go to **Authentication → Providers → Google**
     and add your Google OAuth client ID and secret.
   - Add `http://localhost:3000/auth/callback` (and your production equivalent)
     to the provider's allowed redirect URLs.

   Email/password sign-in works without this step.

9. Run the development server:
   ```bash
   npm run dev
   ```

10. Open [http://localhost:3000](http://localhost:3000)

### Migrations

If you already have a `tastings` table from an earlier version, bring it up to
date with whichever of these applies:

```sql
-- from the original schema
alter table tastings
  add column vintage integer,
  add column producer text,
  add column region text,
  add column clarity text,
  add column appearance_intensity text,
  add column color text,
  add column aromas text[],
  add column quality_level text;

-- adds per-user ownership (then apply the RLS policies in step 4)
alter table tastings
  add column user_id uuid references auth.users (id) on delete cascade;
-- backfill or delete pre-auth rows, then:
alter table tastings alter column user_id set not null;

-- adds the sparkling-wine mousse field
alter table tastings add column mousse text;

-- adds the label-capture fields (then run supabase/migrations/002_label_capture.sql
-- for the storage bucket and its policies)
alter table tastings
  add column country text,
  add column grape_variety text,
  add column alcohol numeric(4, 1),
  add column label_image_url text;
```

## Accounts

Signing up takes an email and a password and logs you straight in — there is no
confirmation email to wait for. Google sign-in is offered alongside it.

Forgotten passwords are recovered by email (`/forgot-password`), which is the
only recovery route Supabase offers. That has one consequence worth knowing: an
account created with a mistyped address can never be recovered, because the
reset link goes to a mailbox its owner does not read. Verifying addresses at
signup would close that gap, at the cost of a confirmation step on every signup
and against a built-in mail limit of two messages an hour. For a small invited
group the trade currently favours the faster signup.

## Features

- Photograph a wine label to fill in its details automatically — including the
  ones the label leaves out. Old World labels often print nothing but an estate
  and an appellation; a Puligny-Montrachet still logs its grape as Chardonnay.
  The photo is kept with the tasting.
- WSET Level 2 Systematic Approach to Tasting (SAT) form
- Wine identity fields: name, type, vintage, producer, region, country, grape
  variety, alcohol
- Appearance assessment: clarity, intensity, color (conditional on wine type)
- Nose & palate: sweetness, acidity, tannin (red only), body, mousse
  (sparkling only), finish
- Aroma tag selection grouped by primary, secondary, and tertiary categories,
  filtered to the categories relevant to the selected wine type
- Quality level assessment
- Email/password and Google sign-in, with each user seeing only their own
  tastings
- Create, view, edit, and delete tastings
- Installable as a PWA
- Dark mode support
- Clean, minimal, editorial design

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (auth + Postgres + Storage)
- Gemini Flash-Lite for label recognition
