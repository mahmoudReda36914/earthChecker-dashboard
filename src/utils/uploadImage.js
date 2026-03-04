import api from '../lib/axios'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_SIZE      = 5 * 1024 * 1024   // 5 MB

/**
 * Upload an image to Cloudinary via the backend.
 * The backend handles Cloudinary credentials — nothing is exposed to the browser.
 *
 * @param {File}     file          - Native File object
 * @param {function} [onProgress]  - Optional progress callback (0-100)
 * @param {string}   [folder]      - Cloudinary folder, default: 'uploads'
 * @returns {Promise<string>}      - Cloudinary secure_url
 *
 * @example
 * const url = await uploadImage(file)
 * const url = await uploadImage(file, pct => setProgress(pct), 'modules')
 */
export async function uploadImage(file, onProgress, folder = 'uploads') {
  if (!file) throw new Error('No file provided')

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WEBP, GIF, SVG`)
  }

  if (file.size > MAX_SIZE) {
    throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum is 5 MB.`)
  }

  const formData = new FormData()
  formData.append('image', file)

  const response = await api.post(`/upload/image?folder=${folder}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
      ? (e) => {
          const pct = e.total ? Math.round((e.loaded * 100) / e.total) : 0
          onProgress(pct)
        }
      : undefined,
  })

  const url = response.data?.data?.url
  if (!url) throw new Error('Upload succeeded but no URL was returned')
  return url
}
