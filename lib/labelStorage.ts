import type { SupabaseClient } from '@supabase/supabase-js'

export const LABELS_BUCKET = 'labels'

/**
 * Upload a label photo and return its storage path.
 *
 * Paths are '<user_id>/<random>.jpg' — the leading folder is what the storage
 * RLS policies check, so a user can only write inside their own prefix.
 *
 * We store the path, not a URL: the bucket is private, so URLs have to be signed
 * at read time and would expire if persisted.
 */
export async function uploadLabelImage(
  supabase: SupabaseClient,
  userId: string,
  file: File
): Promise<string> {
  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${userId}/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from(LABELS_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) throw error
  return path
}

/** A short-lived URL for displaying a stored label. */
export async function getLabelImageUrl(
  supabase: SupabaseClient,
  path: string,
  expiresInSeconds = 3600
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(LABELS_BUCKET)
    .createSignedUrl(path, expiresInSeconds)

  if (error || !data) return null
  return data.signedUrl
}

/**
 * Delete a stored label, ignoring failures.
 *
 * Used when replacing a photo or deleting a tasting. A leftover file is a small
 * amount of wasted storage; a thrown error here would block the user's actual
 * intent, which matters more.
 */
export async function deleteLabelImage(
  supabase: SupabaseClient,
  path: string
): Promise<void> {
  await supabase.storage.from(LABELS_BUCKET).remove([path])
}
