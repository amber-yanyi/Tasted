/**
 * Shrink a photo in the browser before it goes anywhere.
 *
 * A phone camera produces 3-4 MB images. Sending those raw makes recognition
 * slower and the upload heavier for no benefit — the label's text is legible
 * well below full sensor resolution. Compressing first also normalizes HEIC from
 * iPhones into JPEG, which the recognition endpoint and Storage both accept.
 */

const MAX_EDGE = 1600
const QUALITY = 0.85

export async function compressImage(file: File): Promise<File> {
  // Draw through an ImageBitmap so HEIC and EXIF-rotated JPEGs come out upright.
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    // Some browsers can't decode the format. Send the original and let the
    // endpoint's type check reject it with a clear message.
    return file
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return file
  }
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', QUALITY)
  )
  if (!blob) return file

  const name = file.name.replace(/\.[^.]+$/, '') || 'label'
  return new File([blob], `${name}.jpg`, { type: 'image/jpeg' })
}
