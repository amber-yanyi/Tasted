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
     wine_name text not null,
     wine_type text not null,
     vintage integer,
     producer text,
     region text,
     clarity text,
     appearance_intensity text,
     color text,
     sweetness text not null,
     acidity text not null,
     tannin text,
     body text not null,
     finish text not null,
     aromas text[],
     quality_level text,
     notes text
   );
   ```

   If upgrading from the previous schema, run:
   ```sql
   alter table tastings
     add column vintage integer,
     add column producer text,
     add column region text,
     add column clarity text,
     add column appearance_intensity text,
     add column color text,
     add column aromas text[],
     add column quality_level text;
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Features

- WSET Level 2 Systematic Approach to Tasting (SAT) form
- Wine identity fields: name, type, vintage, producer, region
- Appearance assessment: clarity, intensity, color (conditional on wine type)
- Nose & palate: sweetness, acidity, tannin (red only), body, finish
- Aroma tag selection grouped by primary, secondary, and tertiary categories
- Quality level assessment
- View all tastings with producer and vintage info
- View individual tasting details
- Dark mode support
- Clean, minimal, editorial design

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
