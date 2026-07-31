/**
 * Wine label field extraction.
 *
 * Two jobs, not one:
 *
 *   1. Read what is printed on the label (OCR-ish).
 *   2. Complete the identity fields the label leaves out.
 *
 * Job 2 is the one that matters most. Old World labels routinely print only an
 * estate and an appellation — no grape, sometimes no region beyond the
 * appellation name. If we only transcribed, the app would help least exactly
 * where a taster needs it most: a New World label that spells out
 * "Barossa Valley Shiraz 2020" would log completely, while a Puligny-Montrachet
 * would land half-empty. That is backwards, so we infer.
 *
 * What we will NOT infer: acidity, tannin, body, sweetness, finish, aroma.
 * Those are sensory judgements made in the glass, not facts about the bottle —
 * no amount of research can supply them, and guessing would hollow out the part
 * of the app that carries the user's own developing palate.
 *
 * Inferred values are returned like any other: they are high-confidence facts
 * about the appellation, not hedges, and flagging them for review would put work
 * back on the taster for no gain. Every field lands in an editable input, so a
 * wrong one is corrected the same way a misread one is.
 */

export type ExtractedLabel = {
  wine_name: string | null
  producer: string | null
  vintage: number | null
  country: string | null
  region: string | null
  grape_variety: string | null
  wine_type: 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Fortified' | null
  alcohol: number | null
}

export const EXTRACTED_LABEL_FIELDS: (keyof ExtractedLabel)[] = [
  'wine_name',
  'producer',
  'vintage',
  'country',
  'region',
  'grape_variety',
  'wine_type',
  'alcohol',
]


// Gemini's structured-output schema. Fields stay nullable — an unreadable label
// should yield nulls, not invention — but "not printed" is no longer a reason
// for null. It is a reason to infer.
export const LABEL_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    wine_name: {
      type: 'string',
      nullable: true,
      description:
        'The name of the wine as printed: a cuvée or vineyard name ("Les Folatières"), an estate name used as the wine name ("Château Margaux"), or a grape name if that is how it is labelled. Exclude vintage and producer when they appear separately.',
    },
    producer: {
      type: 'string',
      nullable: true,
      description:
        'The winery, estate, or domaine (e.g. "Domaine Leflaive", "Penfolds"). If the estate name doubles as the wine name, repeat it here.',
    },
    vintage: {
      type: 'integer',
      nullable: true,
      description:
        'The harvest year, 1900-2099. Null for non-vintage wines (often "NV" or "Sans Année", common on Champagne). Never take an "established"/"fondée en"/"since" year as the vintage — those sit near the estate name and are usually much older.',
    },
    country: {
      type: 'string',
      nullable: true,
      description: 'Country of origin, in English (e.g. "France", "Italy", "Australia").',
    },
    region: {
      type: 'string',
      nullable: true,
      description:
        'Wine region or appellation (e.g. "Barossa Valley", "Puligny-Montrachet", "Rioja Alta"). Prefer the specific appellation when both a broad region and an appellation appear.',
    },
    grape_variety: {
      type: 'string',
      nullable: true,
      description:
        'Grape variety, or varieties comma-separated for a blend (e.g. "Chardonnay", "Cabernet Sauvignon, Merlot"). Usually absent from Old World labels — infer it from the appellation. Give the dominant varieties, not every grape legally permitted.',
    },
    wine_type: {
      type: 'string',
      nullable: true,
      enum: ['Red', 'White', 'Rosé', 'Sparkling', 'Fortified'],
      description: 'Style of the wine.',
    },
    alcohol: {
      type: 'number',
      nullable: true,
      description:
        'Alcohol by volume as a number — 13.5 for "13,5% vol". Read this off the label only; do not estimate it.',
    },
    label_text: {
      type: 'string',
      description:
        'Every word visible on the label, transcribed verbatim in reading order, original languages, no translation or commentary. Transcribe faithfully, including small print.',
    },
  },
  required: [
    'wine_name',
    'producer',
    'vintage',
    'country',
    'region',
    'grape_variety',
    'wine_type',
    'alcohol',
    'label_text',
  ],
} as const

export const LABEL_EXTRACTION_PROMPT = `You are identifying a wine from a photograph of its label, to prefill a tasting note.

You have two jobs.

FIRST, read the label. Labels are often not in English — read French, Italian, Spanish, German, and Portuguese as printed, but return country and wine_type in English.

SECOND, and just as important: complete the fields the label does not print. Old World labels frequently name only an estate and an appellation, leaving grape, region, and style unstated. Fill those in from what you know about the appellation and the producer. A taster reading a Puligny-Montrachet label should get "Chardonnay" from you, because the appellation permits nothing else — not a blank field, and not a request that they look it up themselves.

Use appellation rules, which are facts rather than guesses:
- Chablis, Puligny-Montrachet, Meursault, white Burgundy generally: Chardonnay
- Red Burgundy, Gevrey-Chambertin, Volnay: Pinot Noir
- Barolo, Barbaresco: Nebbiolo
- Chianti, Brunello di Montalcino: Sangiovese
- Sancerre, Pouilly-Fumé: Sauvignon Blanc
- Rioja: Tempranillo-dominant
- Northern Rhône reds (Côte-Rôtie, Hermitage): Syrah
- Châteauneuf-du-Pape: Grenache-dominant blend
- Left Bank Bordeaux (Pauillac, Margaux, Saint-Julien): Cabernet Sauvignon-dominant blend
- Right Bank Bordeaux (Saint-Émilion, Pomerol): Merlot-dominant blend
This list is illustrative, not exhaustive — apply the same reasoning to any appellation you recognise, and use web search when the producer or cuvée is specific enough to look up and you are unsure.

Give the dominant varieties rather than everything an appellation legally permits: Châteauneuf-du-Pape allows thirteen grapes, but "Grenache, Syrah, Mourvèdre" is the useful answer. Where a region genuinely spans several styles with no way to narrow it down — non-vintage Champagne could be any blend of three grapes — leave the field null rather than picking arbitrarily.

Before filling any field, return label_text: a verbatim transcription of every word visible on the label, in reading order and in its original language, with no translation or commentary. Include the small print. Transcribing first keeps the extracted fields anchored to what the bottle actually says.

Inference fills gaps; it never overrides the glass. Names printed on the label — producer, cuvée, appellation — must be copied exactly as printed, character for character, even when they resemble a producer you know. If the label reads "Château Beauregard", that is the answer, and correcting it to a similarly-named estate you are more familiar with turns a correct reading into a wrong one. Transcribe first, and only reach for knowledge where the label is silent.

Two fields are read-only, never inferred:
- vintage — a specific bottle's year is on the label or it is unknowable. Do not estimate it.
- alcohol — likewise. Do not estimate a typical ABV for the style.

One field to leave alone rather than fill speculatively: grape_variety on a wine whose appellation permits several blends with no way to narrow it down. Non-vintage Champagne may be any proportion of Chardonnay, Pinot Noir, and Pinot Meunier — listing all three is not information, it is the definition of the region. Null is the more useful answer there.

If the image is not a wine label, or is too blurry or dark to make out, return null for every field.`
