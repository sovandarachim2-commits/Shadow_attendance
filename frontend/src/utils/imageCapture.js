/** Target under Laravel `max:4096` (KB) validation on visit/attendance uploads. */
const UPLOAD_MAX_BYTES = 3.5 * 1024 * 1024
const UPLOAD_MAX_DIMENSION = 1920

export async function compressImageForUpload(file, {
  maxBytes = UPLOAD_MAX_BYTES,
  maxDimension = UPLOAD_MAX_DIMENSION,
  quality = 0.85,
  unmirror = false,
  fileName,
} = {}) {
  if (!file || !file.type?.startsWith('image/')) return file

  const imageUrl = URL.createObjectURL(file)

  try {
    const image = await loadImage(imageUrl)
    const sourceWidth = image.naturalWidth || image.width
    const sourceHeight = image.naturalHeight || image.height
    const { width, height } = scaleToMax(sourceWidth, sourceHeight, maxDimension)

    const needsWork = unmirror
      || file.size > maxBytes
      || sourceWidth > maxDimension
      || sourceHeight > maxDimension
      || !file.type.includes('jpeg')

    if (!needsWork) return file

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) return file

    if (unmirror) {
      context.translate(width, 0)
      context.scale(-1, 1)
    }
    context.drawImage(image, 0, 0, width, height)

    let nextQuality = quality
    let blob = await canvasToBlob(canvas, nextQuality)

    while (blob && blob.size > maxBytes && nextQuality > 0.5) {
      nextQuality -= 0.1
      blob = await canvasToBlob(canvas, nextQuality)
    }

    if (!blob) return file

    const baseName = (fileName || file.name || 'photo').replace(/\.[^.]+$/, '')
    return new File([blob], `${baseName}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })
  } catch {
    return file
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

function scaleToMax(width, height, maxDimension) {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height }
  }
  const ratio = Math.min(maxDimension / width, maxDimension / height)
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  }
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality)
  })
}

export async function unmirrorFrontCameraImage(file) {
  if (!file || !file.type?.startsWith('image/')) return file

  const imageUrl = URL.createObjectURL(file)

  try {
    const image = await loadImage(imageUrl)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth || image.width
    canvas.height = image.naturalHeight || image.height

    const context = canvas.getContext('2d')
    if (!context) return file

    context.translate(canvas.width, 0)
    context.scale(-1, 1)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.92)
    })

    if (!blob) return file

    return new File([blob], file.name || 'selfie.jpg', {
      type: blob.type || file.type || 'image/jpeg',
      lastModified: Date.now(),
    })
  } catch {
    return file
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}
