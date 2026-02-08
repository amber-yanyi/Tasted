'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const COLOR_OPTIONS: Record<string, string[]> = {
  Red: ['Purple', 'Ruby', 'Garnet', 'Tawny'],
  White: ['Lemon', 'Gold', 'Amber'],
  'Rosé': ['Pink', 'Salmon', 'Orange'],
  Sparkling: ['Lemon', 'Gold', 'Amber'],
  Fortified: ['Lemon', 'Gold', 'Amber'],
}

const AROMA_CATEGORIES = {
  Primary: ['Citrus', 'Green Fruit', 'Stone Fruit', 'Tropical Fruit', 'Red Fruit', 'Black Fruit', 'Floral', 'Herbal', 'Spice'],
  Secondary: ['Yeast', 'Butter', 'Cream', 'Vanilla', 'Toast', 'Oak'],
  Tertiary: ['Dried Fruit', 'Nutty', 'Earth', 'Leather', 'Tobacco', 'Mushroom', 'Honey'],
}

export default function AddTasting() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    wine_name: '',
    wine_type: '' as 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Fortified' | '',
    vintage: '',
    producer: '',
    region: '',
    clarity: '' as 'Clear' | 'Hazy' | '',
    appearance_intensity: '' as 'Pale' | 'Medium' | 'Deep' | '',
    color: '',
    sweetness: '' as 'Dry' | 'Medium' | 'Sweet' | '',
    acidity: '' as 'Low' | 'Medium' | 'High' | '',
    tannin: '' as 'Low' | 'Medium' | 'High' | '',
    body: '' as 'Light' | 'Medium' | 'Full' | '',
    finish: '' as 'Short' | 'Medium' | 'Long' | '',
    aromas: [] as string[],
    quality_level: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: supabaseError } = await supabase.from('tastings').insert({
        wine_name: formData.wine_name,
        wine_type: formData.wine_type,
        vintage: formData.vintage ? parseInt(formData.vintage) : null,
        producer: formData.producer || null,
        region: formData.region || null,
        clarity: formData.clarity || null,
        appearance_intensity: formData.appearance_intensity || null,
        color: formData.color || null,
        sweetness: formData.sweetness,
        acidity: formData.acidity,
        tannin: formData.wine_type === 'Red' ? formData.tannin : null,
        body: formData.body,
        finish: formData.finish,
        aromas: formData.aromas.length > 0 ? formData.aromas : null,
        quality_level: formData.quality_level || null,
        notes: formData.notes || null,
      })

      if (supabaseError) throw supabaseError

      router.push('/tastings')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tasting')
      setLoading(false)
    }
  }

  const handleWineTypeChange = (value: string) => {
    setFormData({ ...formData, wine_type: value as typeof formData.wine_type, color: '', tannin: '' })
  }

  const toggleAroma = (aroma: string) => {
    setFormData(prev => ({
      ...prev,
      aromas: prev.aromas.includes(aroma)
        ? prev.aromas.filter(a => a !== aroma)
        : [...prev.aromas, aroma],
    }))
  }

  const RadioGroup = ({
    label,
    name,
    options,
    value,
    onChange,
  }: {
    label: string
    name: string
    options: string[]
    value: string
    onChange: (value: string) => void
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
        {label}
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-stone-900 dark:text-stone-100"
              required
            />
            <span className="text-sm text-stone-600 dark:text-stone-400">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 className="font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100 pt-4 pb-2 border-b border-stone-200 dark:border-stone-800">
      {children}
    </h2>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl font-semibold text-stone-900 dark:text-stone-100 mb-8">
        Add Tasting
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Wine Identity ── */}
        <SectionHeading>Wine Identity</SectionHeading>

        <div>
          <label htmlFor="wine_name" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Wine Name
          </label>
          <input
            type="text"
            id="wine_name"
            value={formData.wine_name}
            onChange={(e) => setFormData({ ...formData, wine_name: e.target.value })}
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:border-transparent"
            required
          />
        </div>

        <RadioGroup
          label="Wine Type"
          name="wine_type"
          options={['Red', 'White', 'Rosé', 'Sparkling', 'Fortified']}
          value={formData.wine_type}
          onChange={handleWineTypeChange}
        />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="vintage" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Vintage
            </label>
            <input
              type="number"
              id="vintage"
              value={formData.vintage}
              onChange={(e) => setFormData({ ...formData, vintage: e.target.value })}
              placeholder="e.g. 2020"
              min="1900"
              max="2099"
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:border-transparent"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="producer" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Producer
            </label>
            <input
              type="text"
              id="producer"
              value={formData.producer}
              onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
              className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Region
          </label>
          <input
            type="text"
            id="region"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            placeholder="e.g. Barossa Valley, Burgundy"
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:border-transparent"
          />
        </div>

        {/* ── Appearance ── */}
        <SectionHeading>Appearance</SectionHeading>

        <RadioGroup
          label="Clarity"
          name="clarity"
          options={['Clear', 'Hazy']}
          value={formData.clarity}
          onChange={(value) => setFormData({ ...formData, clarity: value as typeof formData.clarity })}
        />

        <RadioGroup
          label="Intensity"
          name="appearance_intensity"
          options={['Pale', 'Medium', 'Deep']}
          value={formData.appearance_intensity}
          onChange={(value) => setFormData({ ...formData, appearance_intensity: value as typeof formData.appearance_intensity })}
        />

        {formData.wine_type && (
          <RadioGroup
            label="Color"
            name="color"
            options={COLOR_OPTIONS[formData.wine_type] || []}
            value={formData.color}
            onChange={(value) => setFormData({ ...formData, color: value })}
          />
        )}

        {/* ── Nose & Palate ── */}
        <SectionHeading>Nose & Palate</SectionHeading>

        <RadioGroup
          label="Sweetness"
          name="sweetness"
          options={['Dry', 'Medium', 'Sweet']}
          value={formData.sweetness}
          onChange={(value) => setFormData({ ...formData, sweetness: value as typeof formData.sweetness })}
        />

        <RadioGroup
          label="Acidity"
          name="acidity"
          options={['Low', 'Medium', 'High']}
          value={formData.acidity}
          onChange={(value) => setFormData({ ...formData, acidity: value as typeof formData.acidity })}
        />

        {formData.wine_type === 'Red' && (
          <RadioGroup
            label="Tannin"
            name="tannin"
            options={['Low', 'Medium', 'High']}
            value={formData.tannin}
            onChange={(value) => setFormData({ ...formData, tannin: value as typeof formData.tannin })}
          />
        )}

        <RadioGroup
          label="Body"
          name="body"
          options={['Light', 'Medium', 'Full']}
          value={formData.body}
          onChange={(value) => setFormData({ ...formData, body: value as typeof formData.body })}
        />

        <RadioGroup
          label="Finish"
          name="finish"
          options={['Short', 'Medium', 'Long']}
          value={formData.finish}
          onChange={(value) => setFormData({ ...formData, finish: value as typeof formData.finish })}
        />

        {/* ── Aromas & Flavors ── */}
        <SectionHeading>Aromas & Flavors</SectionHeading>

        {Object.entries(AROMA_CATEGORIES).map(([category, aromas]) => (
          <div key={category} className="space-y-2">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              {category}
            </label>
            <div className="flex flex-wrap gap-2">
              {aromas.map((aroma) => {
                const selected = formData.aromas.includes(aroma)
                return (
                  <button
                    key={aroma}
                    type="button"
                    onClick={() => toggleAroma(aroma)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      selected
                        ? 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 border-stone-900 dark:border-stone-100'
                        : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600'
                    }`}
                  >
                    {aroma}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* ── Conclusions ── */}
        <SectionHeading>Conclusions</SectionHeading>

        <div>
          <label htmlFor="quality_level" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Quality Level
          </label>
          <select
            id="quality_level"
            value={formData.quality_level}
            onChange={(e) => setFormData({ ...formData, quality_level: e.target.value })}
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:border-transparent"
          >
            <option value="">Select...</option>
            <option value="Poor">Poor</option>
            <option value="Acceptable">Acceptable</option>
            <option value="Good">Good</option>
            <option value="Very Good">Very Good</option>
            <option value="Outstanding">Outstanding</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:border-transparent"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-3 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Tasting'}
        </button>
      </form>
    </div>
  )
}
