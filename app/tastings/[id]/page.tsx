import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DeleteTastingButton from '@/components/DeleteTastingButton'
import { getLabelImageUrl } from '@/lib/labelStorage'
import { getT, getLocale } from '@/lib/i18n/server'
import { term } from '@/lib/i18n/wineTerms'

export const dynamic = 'force-dynamic'

export default async function TastingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const t = await getT()
  const locale = await getLocale()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch tasting and ensure it belongs to the user
  const { data: tasting, error } = await supabase
    .from('tastings')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !tasting) {
    notFound()
  }

  // The bucket is private, so the label needs a signed URL at render time.
  const labelUrl = tasting.label_image_url
    ? await getLabelImageUrl(supabase, tasting.label_image_url)
    : null

  const AttributeRow = ({ label, value }: { label: string; value: string | null }) => {
    if (!value) return null

    return (
      <div className="flex items-start py-3 border-b border-stone-200 dark:border-stone-800 last:border-0">
        <dt className="w-32 text-sm font-medium text-stone-500 dark:text-stone-400">{label}</dt>
        <dd className="flex-1 text-sm text-stone-900 dark:text-stone-100">{value}</dd>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/tastings"
        className="inline-flex items-center text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 mb-8 transition-colors"
      >
        &larr; {t('backToTastings')}
      </Link>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="font-serif text-4xl font-semibold text-stone-900 dark:text-stone-100">
              {tasting.wine_name}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/tastings/${id}/edit`}
                className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded-md hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                {t('edit')}
              </Link>
              <DeleteTastingButton id={id} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-stone-600 dark:text-stone-400">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
              {term(tasting.wine_type, locale, 'wineType')}
            </span>
            {tasting.vintage && (
              <span className="text-sm font-medium">{tasting.vintage}</span>
            )}
            <span className="text-sm">
              {new Date(tasting.created_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          {(tasting.producer || tasting.region || tasting.country) && (
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              {[tasting.producer, tasting.region, tasting.country]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
          {(tasting.grape_variety || tasting.alcohol) && (
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              {[tasting.grape_variety, tasting.alcohol && `${tasting.alcohol}% ABV`]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </div>

        {labelUrl && (
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
              {t('labelHeading')}
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={labelUrl}
              alt={`Label of ${tasting.wine_name}`}
              className="w-full max-w-sm rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
            />
          </div>
        )}

        {/* Appearance */}
        {(tasting.clarity || tasting.appearance_intensity || tasting.color) && (
          <div className="bg-stone-50 dark:bg-stone-900/50 rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              {t('sectionAppearance')}
            </h2>
            <dl className="space-y-0">
              <AttributeRow label={t('clarity')} value={term(tasting.clarity ?? '', locale, 'clarity')} />
              <AttributeRow label={t('intensity')} value={term(tasting.appearance_intensity ?? '', locale, 'intensity')} />
              <AttributeRow label={t('color')} value={term(tasting.color ?? '', locale, 'color')} />
            </dl>
          </div>
        )}

        {/* Nose & Palate */}
        <div className="bg-stone-50 dark:bg-stone-900/50 rounded-lg p-6">
          <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
            {t('sectionPalate')}
          </h2>
          <dl className="space-y-0">
            <AttributeRow label={t('sweetness')} value={term(tasting.sweetness ?? '', locale, 'sweetness')} />
            <AttributeRow label={t('acidity')} value={term(tasting.acidity ?? '', locale, 'level')} />
            {tasting.wine_type === 'Red' && tasting.tannin && (
              <AttributeRow label={t('tannin')} value={term(tasting.tannin ?? '', locale, 'level')} />
            )}
            <AttributeRow label={t('body')} value={term(tasting.body ?? '', locale, 'body')} />
            {tasting.wine_type === 'Sparkling' && tasting.mousse && (
              <AttributeRow label={t('mousse')} value={term(tasting.mousse ?? '', locale, 'mousse')} />
            )}
            <AttributeRow label={t('finish')} value={term(tasting.finish ?? '', locale, 'finish')} />
          </dl>
        </div>

        {/* Aromas & Flavors */}
        {tasting.aromas && tasting.aromas.length > 0 && (
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
              {t('sectionAromas')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {tasting.aromas.map((aroma: string) => (
                <span
                  key={aroma}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                >
                  {term(aroma, locale)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Conclusions */}
        {tasting.quality_level && (
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
              {t('sectionConclusions')}
            </h2>
            <p className="text-sm text-stone-700 dark:text-stone-300">
              <span className="font-medium text-stone-500 dark:text-stone-400">{t('qualityLevel')}:</span>{' '}
              {term(tasting.quality_level, locale, 'quality')}
            </p>
          </div>
        )}

        {/* Notes */}
        {tasting.notes && (
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
              {t('notesHeading')}
            </h2>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
              {tasting.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
