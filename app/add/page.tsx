'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const COLOR_OPTIONS: Record<string, string[]> = {
  Red: ['Purple', 'Ruby', 'Garnet', 'Tawny'],
  White: ['Lemon', 'Gold', 'Amber'],
  'Rosé': ['Pink', 'Salmon', 'Orange'],
  Sparkling: ['Lemon', 'Gold', 'Pink'],
  Fortified: ['Lemon', 'Gold', 'Amber', 'Ruby', 'Tawny'],
}

const COLOR_SWATCHES: Record<string, string> = {
  Purple: '#800080',
  Ruby: '#E0115F',
  Garnet: '#733635',
  Tawny: '#CD5700',
  Lemon: '#FAFA33',
  Gold: '#FFD700',
  Amber: '#FFBF00',
  Pink: '#FFB6C1',
  Salmon: '#FA8072',
  Orange: '#FF8C00',
}

// Allowed aroma categories per wine type per group.
// Groups not listed fall through to show all categories (e.g. Tertiary).
const AROMA_CATEGORIES_BY_TYPE: Record<string, Partial<Record<string, string[]>>> = {
  Red: {
    Primary: ['Red Fruit', 'Black Fruit', 'Floral', 'Herbal', 'Spice'],
    Secondary: ['Oak'],
  },
  White: {
    Primary: ['Citrus', 'Green Fruit', 'Stone Fruit', 'Tropical Fruit', 'Floral', 'Herbal'],
    Secondary: ['Malolactic', 'Oak'],
  },
  'Rosé': {
    Primary: ['Citrus', 'Stone Fruit', 'Red Fruit', 'Floral'],
    Secondary: ['Malolactic', 'Oak'],
  },
  Sparkling: {
    Primary: ['Citrus', 'Green Fruit', 'Stone Fruit', 'Red Fruit', 'Floral'],
    Secondary: ['Yeast'],
  },
  Fortified: {
    Primary: ['Citrus', 'Stone Fruit', 'Tropical Fruit', 'Red Fruit', 'Black Fruit', 'Floral', 'Spice'],
    Secondary: ['Oak'],
    Tertiary: ['Dried Fruit', 'Nutty', 'Honey', 'Caramel', 'Chocolate'],
  },
}

const AROMA_DESCRIPTORS: Record<string, Record<string, string[]>> = {
  Primary: {
    'Citrus': ['Lemon', 'Lime', 'Grapefruit', 'Orange'],
    'Green Fruit': ['Green Apple', 'Pear', 'Gooseberry'],
    'Stone Fruit': ['Peach', 'Apricot', 'Nectarine'],
    'Tropical Fruit': ['Banana', 'Pineapple', 'Mango', 'Passion Fruit'],
    'Red Fruit': ['Strawberry', 'Raspberry', 'Red Cherry', 'Plum', 'Redcurrant'],
    'Black Fruit': ['Blackberry', 'Blackcurrant', 'Blueberry', 'Black Cherry'],
    'Floral': ['Blossom', 'Rose', 'Violet'],
    'Herbal': ['Green Bell Pepper', 'Grass', 'Mint', 'Eucalyptus'],
    'Spice': ['Black Pepper', 'Liquorice', 'Cinnamon'],
  },
  Secondary: {
    'Yeast': ['Bread', 'Pastry', 'Biscuit', 'Brioche'],
    'Malolactic': ['Butter', 'Cream', 'Cheese'],
    'Oak': ['Vanilla', 'Toast', 'Cedar', 'Coconut', 'Smoke'],
  },
  Tertiary: {
    'Dried Fruit': ['Fig', 'Prune', 'Raisin', 'Sultana', 'Marmalade'],
    'Nutty': ['Almond', 'Hazelnut', 'Walnut', 'Marzipan'],
    'Earth': ['Wet Leaves', 'Forest Floor', 'Clay', 'Mineral'],
    'Leather': ['Leather', 'Suede', 'Game'],
    'Tobacco': ['Tobacco', 'Cigar Box', 'Dried Leaves'],
    'Mushroom': ['Mushroom', 'Truffle'],
    'Honey': ['Honey', 'Beeswax'],
    'Caramel': ['Caramel', 'Toffee', 'Butterscotch'],
    'Chocolate': ['Dark Chocolate', 'Coffee', 'Mocha'],
  },
}

export default function AddTasting() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

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
    mousse: '' as 'Delicate' | 'Creamy' | 'Aggressive' | '',
    finish: '' as 'Short' | 'Medium' | 'Long' | '',
    aromas: [] as string[],
    quality_level: '',
    notes: '',
  })

  useEffect(() => {
    if (!openCategory) return

    function handleMouseDown(e: MouseEvent) {
      if (popoverRef.current && popoverRef.current.contains(e.target as Node)) return
      setOpenCategory(null)
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [openCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in to add a tasting')
        setLoading(false)
        return
      }

      const { error: supabaseError } = await supabase.from('tastings').insert({
        user_id: user.id,
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
        mousse: formData.wine_type === 'Sparkling' ? formData.mousse || null : null,
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
    setFormData({ ...formData, wine_type: value as typeof formData.wine_type, color: '', tannin: '', mousse: '' })
  }

  const toggleAroma = (value: string) => {
    setFormData(prev => ({
      ...prev,
      aromas: prev.aromas.includes(value)
        ? prev.aromas.filter(a => a !== value)
        : [...prev.aromas, value],
    }))
  }

  const RadioGroup = ({
    label,
    options,
    value,
    onChange,
  }: {
    label: string
    options: string[]
    value: string
    onChange: (value: string) => void
  }) => (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-stone-700 dark:text-stone-300">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onChange(value === option ? '' : option)
            }}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              value === option
                ? 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 border-stone-900 dark:border-stone-100'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )

  const ColorRadioGroup = ({
    label,
    options,
    value,
    onChange,
  }: {
    label: string
    options: string[]
    value: string
    onChange: (value: string) => void
  }) => (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-stone-700 dark:text-stone-300">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onChange(value === option ? '' : option)
            }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              value === option
                ? 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 border-stone-900 dark:border-stone-100'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600'
            }`}
          >
            {COLOR_SWATCHES[option] && (
              <span
                className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-600 shrink-0"
                style={{ backgroundColor: COLOR_SWATCHES[option] }}
              />
            )}
            {option}
          </button>
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

        {!formData.wine_type ? (
          <div className="mt-8 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl py-12 px-6 text-center">
            <p className="text-lg font-serif text-stone-600 dark:text-stone-400">
              Select a Wine Type to begin tasting
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-500 mt-1">
              The full SAT form will appear once you choose above.
            </p>
          </div>
        ) : (
        <>
        {/* ── Appearance ── */}
        <SectionHeading>Appearance</SectionHeading>

        <RadioGroup
          label="Clarity"
          options={['Clear', 'Hazy']}
          value={formData.clarity}
          onChange={(value) => setFormData({ ...formData, clarity: value as typeof formData.clarity })}
        />

        <RadioGroup
          label="Intensity"
          options={['Pale', 'Medium', 'Deep']}
          value={formData.appearance_intensity}
          onChange={(value) => setFormData({ ...formData, appearance_intensity: value as typeof formData.appearance_intensity })}
        />

        {formData.wine_type && (
          <ColorRadioGroup
            label="Color"
            options={COLOR_OPTIONS[formData.wine_type] || []}
            value={formData.color}
            onChange={(value) => setFormData({ ...formData, color: value })}
          />
        )}

        {/* ── Nose & Palate ── */}
        <SectionHeading>Nose & Palate</SectionHeading>

        <RadioGroup
          label="Sweetness"
          options={['Dry', 'Medium', 'Sweet']}
          value={formData.sweetness}
          onChange={(value) => setFormData({ ...formData, sweetness: value as typeof formData.sweetness })}
        />

        <RadioGroup
          label="Acidity"
          options={['Low', 'Medium', 'High']}
          value={formData.acidity}
          onChange={(value) => setFormData({ ...formData, acidity: value as typeof formData.acidity })}
        />

        {formData.wine_type === 'Red' && (
          <RadioGroup
            label="Tannin"
            options={['Low', 'Medium', 'High']}
            value={formData.tannin}
            onChange={(value) => setFormData({ ...formData, tannin: value as typeof formData.tannin })}
          />
        )}

        <RadioGroup
          label="Body"
          options={['Light', 'Medium', 'Full']}
          value={formData.body}
          onChange={(value) => setFormData({ ...formData, body: value as typeof formData.body })}
        />

        {formData.wine_type === 'Sparkling' && (
          <RadioGroup
            label="Mousse"
            options={['Delicate', 'Creamy', 'Aggressive']}
            value={formData.mousse}
            onChange={(value) => setFormData({ ...formData, mousse: value as typeof formData.mousse })}
          />
        )}

        <RadioGroup
          label="Finish"
          options={['Short', 'Medium', 'Long']}
          value={formData.finish}
          onChange={(value) => setFormData({ ...formData, finish: value as typeof formData.finish })}
        />

        {/* ── Aromas & Flavors ── */}
        <SectionHeading>Aromas & Flavors</SectionHeading>

        {formData.aromas.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {formData.aromas.map((descriptor) => (
              <span
                key={descriptor}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
              >
                {descriptor}
                <button
                  type="button"
                  onClick={() => toggleAroma(descriptor)}
                  className="ml-0.5 hover:text-stone-900 dark:hover:text-stone-100"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {Object.entries(AROMA_DESCRIPTORS).map(([group, categories]) => {
          const allowed = formData.wine_type
            ? AROMA_CATEGORIES_BY_TYPE[formData.wine_type]?.[group]
            : null
          const visibleCategories = allowed
            ? Object.entries(categories).filter(([cat]) => allowed.includes(cat))
            : Object.entries(categories)

          if (visibleCategories.length === 0) return null

          return (
          <div key={group} className="space-y-2">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              {group}
            </label>
            <div className="flex flex-wrap gap-2">
              {visibleCategories.map(([category, descriptors]) => {
                const categorySelected = formData.aromas.includes(category)
                const descriptorCount = descriptors.filter(d => formData.aromas.includes(d)).length
                const isActive = categorySelected || descriptorCount > 0
                const isOpen = openCategory === category

                return (
                  <div key={category} className={`relative ${isOpen ? 'z-20' : ''}`} ref={isOpen ? popoverRef : undefined}>
                    <div
                      className={`inline-flex items-center rounded-full border transition-colors ${
                        isActive
                          ? 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 border-stone-900 dark:border-stone-100'
                          : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleAroma(category)}
                        className="pl-3 pr-2 py-1.5 text-sm font-medium inline-flex items-center gap-1.5"
                      >
                        {category}
                        {descriptorCount > 0 && (
                          <span className="opacity-75 text-xs">+{descriptorCount}</span>
                        )}
                      </button>
                      {isActive && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenCategory(isOpen ? null : category)
                          }}
                          className={`pr-2.5 pl-1 py-1.5 border-l ${
                            isActive
                              ? 'border-stone-600 dark:border-stone-400'
                              : 'border-stone-300 dark:border-stone-700'
                          }`}
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
                          </svg>
                        </button>
                      )}
                    </div>

                    {isOpen && (
                      <div className="absolute z-20 mt-2 left-0 min-w-[200px] bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg p-2">
                        {descriptors.map((descriptor) => (
                          <label
                            key={descriptor}
                            className="flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-stone-50 dark:hover:bg-stone-700/50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.aromas.includes(descriptor)}
                              onChange={() => toggleAroma(descriptor)}
                              className="w-4 h-4 rounded border-stone-300 dark:border-stone-600"
                            />
                            <span className="text-sm text-stone-700 dark:text-stone-300">{descriptor}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          )
        })}

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
          disabled={loading || !formData.wine_type}
          className="w-full px-8 py-3 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Tasting'}
        </button>
        </>
        )}
      </form>
    </div>
  )
}
