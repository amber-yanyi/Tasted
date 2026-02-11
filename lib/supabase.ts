import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Tasting {
  id: string
  created_at: string
  wine_name: string
  wine_type: 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Fortified'
  vintage: number | null
  producer: string | null
  region: string | null
  clarity: 'Clear' | 'Hazy' | null
  appearance_intensity: 'Pale' | 'Medium' | 'Deep' | null
  color: string | null
  sweetness: 'Dry' | 'Medium' | 'Sweet'
  acidity: 'Low' | 'Medium' | 'High'
  tannin: 'Low' | 'Medium' | 'High' | null
  body: 'Light' | 'Medium' | 'Full'
  mousse: 'Delicate' | 'Creamy' | 'Aggressive' | null
  finish: 'Short' | 'Medium' | 'Long'
  aromas: string[] | null
  quality_level: string | null
  notes: string | null
}
