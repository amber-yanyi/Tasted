# Tasted

A simple, minimal website for logging wines and simplified WSET tasting notes.

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
     sweetness text not null,
     acidity text not null,
     tannin text,
     body text not null,
     finish text not null,
     notes text
   );
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Features

- Add wine tasting entries with simplified WSET categories
- View all tastings
- View individual tasting details
- Conditional tannin field for red wines only
- Dark mode support
- Clean, minimal, editorial design

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
