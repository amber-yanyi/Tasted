/**
 * Wine label field extraction.
 *
 * Scope note: this reads only what is *printed on the label* — identity and
 * provenance. It deliberately does not touch acidity, tannin, body, sweetness,
 * finish, or aroma. Those are sensory judgements the taster makes in the glass;
 * a label carries no information about them, so a model asked to fill them in
 * would be inventing data. They stay the user's to write.
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

// Gemini's structured-output schema. Every field is nullable: a label that
// doesn't print a vintage should come back with vintage: null, not a guess.
export const LABEL_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    wine_name: {
      type: 'string',
      nullable: true,
      description:
        'The name of the wine as printed. May be a cuvée or vineyard name (e.g. "Les Charmes"), an estate name used as the wine name (e.g. "Château Margaux"), or a grape name if that is how the wine is labelled. Exclude the vintage and the producer if they appear separately.',
    },
    producer: {
      type: 'string',
      nullable: true,
      description:
        'The winery, estate, or domaine that made the wine (e.g. "Domaine Leflaive", "Penfolds"). If the estate name doubles as the wine name, repeat it here.',
    },
    vintage: {
      type: 'integer',
      nullable: true,
      description:
        'The harvest year, 1900-2099. Null for non-vintage wines (often marked NV, common on Champagne). Do not confuse with an "established"/"since" year, which is usually smaller and near the estate name.',
    },
    country: {
      type: 'string',
      nullable: true,
      description:
        'Country of origin in English (e.g. "France", "Italy", "Australia"). Infer from the appellation when not printed outright — Barolo implies Italy, Rioja implies Spain.',
    },
    region: {
      type: 'string',
      nullable: true,
      description:
        'The wine region or appellation (e.g. "Barossa Valley", "Puligny-Montrachet", "Rioja Alta"). Prefer the specific appellation over the broad region when both appear.',
    },
    grape_variety: {
      type: 'string',
      nullable: true,
      description:
        'Grape variety or varieties, comma-separated if a blend (e.g. "Syrah", "Cabernet Sauvignon, Merlot"). Often absent on European labels — infer from the appellation only when it is unambiguous (Chablis is Chardonnay, Barolo is Nebbiolo). Otherwise null.',
    },
    wine_type: {
      type: 'string',
      nullable: true,
      enum: ['Red', 'White', 'Rosé', 'Sparkling', 'Fortified'],
      description:
        'Infer from the label: colour cues, grape variety, appellation, or terms like Champagne/Crémante (Sparkling), Port/Sherry/Madeira (Fortified), Rosé/Rosato/Blush (Rosé).',
    },
    alcohol: {
      type: 'number',
      nullable: true,
      description:
        'Alcohol by volume as a number, e.g. 13.5 for "13.5% vol". Omit the percent sign.',
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
  ],
} as const

export const LABEL_EXTRACTION_PROMPT = `You are reading a photograph of a wine bottle label to log a tasting note.

Extract only what the label tells you. For each field, return null rather than a guess when the label does not support an answer — a null the taster can fill in is far more useful than a plausible invention they have to notice and correct.

Two kinds of inference are welcome, because they are facts about wine rather than guesses about this bottle:
- Deriving country from an appellation (Barolo means Italy).
- Deriving grape from a strictly single-variety appellation (Chablis means Chardonnay, Barolo means Nebbiolo). Do not guess the grape for appellations that permit blends or several varieties.

Labels are often not in English. Read French, Italian, Spanish, German, and Portuguese labels as they are, but return country and wine_type in English.

If the image is not a wine label, or is too blurry or dark to read, return null for every field.`
