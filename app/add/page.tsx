'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AddTasting() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    wine_name: '',
    wine_type: '' as 'Red' | 'White' | 'Sparkling' | 'Fortified' | '',
    sweetness: '' as 'Dry' | 'Medium' | 'Sweet' | '',
    acidity: '' as 'Low' | 'Medium' | 'High' | '',
    tannin: '' as 'Low' | 'Medium' | 'High' | '',
    body: '' as 'Light' | 'Medium' | 'Full' | '',
    finish: '' as 'Short' | 'Medium' | 'Long' | '',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: supabaseError } = await supabase.from('tastings').insert({
        wine_name: formData.wine_name,
        wine_type: formData.wine_type,
        sweetness: formData.sweetness,
        acidity: formData.acidity,
        tannin: formData.wine_type === 'Red' ? formData.tannin : null,
        body: formData.body,
        finish: formData.finish,
        notes: formData.notes || null
      })

      if (supabaseError) throw supabaseError

      router.push('/tastings')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tasting')
      setLoading(false)
    }
  }

  const RadioGroup = ({
    label,
    name,
    options,
    value,
    onChange
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
      <div className="flex gap-4">
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
        {/* Wine Name */}
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

        {/* Wine Type */}
        <RadioGroup
          label="Wine Type"
          name="wine_type"
          options={['Red', 'White', 'Sparkling', 'Fortified']}
          value={formData.wine_type}
          onChange={(value) => setFormData({ ...formData, wine_type: value as any })}
        />

        {/* Sweetness */}
        <RadioGroup
          label="Sweetness"
          name="sweetness"
          options={['Dry', 'Medium', 'Sweet']}
          value={formData.sweetness}
          onChange={(value) => setFormData({ ...formData, sweetness: value as any })}
        />

        {/* Acidity */}
        <RadioGroup
          label="Acidity"
          name="acidity"
          options={['Low', 'Medium', 'High']}
          value={formData.acidity}
          onChange={(value) => setFormData({ ...formData, acidity: value as any })}
        />

        {/* Tannin (conditional) */}
        {formData.wine_type === 'Red' && (
          <RadioGroup
            label="Tannin"
            name="tannin"
            options={['Low', 'Medium', 'High']}
            value={formData.tannin}
            onChange={(value) => setFormData({ ...formData, tannin: value as any })}
          />
        )}

        {/* Body */}
        <RadioGroup
          label="Body"
          name="body"
          options={['Light', 'Medium', 'Full']}
          value={formData.body}
          onChange={(value) => setFormData({ ...formData, body: value as any })}
        />

        {/* Finish */}
        <RadioGroup
          label="Finish"
          name="finish"
          options={['Short', 'Medium', 'Long']}
          value={formData.finish}
          onChange={(value) => setFormData({ ...formData, finish: value as any })}
        />

        {/* Notes */}
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
