export interface Tasting {
  id: string
  created_at: string
  user_id: string
  wine_name: string
  wine_type: 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Fortified'
  vintage: number | null
  producer: string | null
  region: string | null
  country: string | null
  grape_variety: string | null
  alcohol: number | null
  label_image_url: string | null
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
