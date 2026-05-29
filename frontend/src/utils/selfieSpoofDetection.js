const ANALYSIS_MAX_SIDE = 220
const EDGE_DIFF_THRESHOLD = 34
const MIN_EDGE_STRENGTH = 0.45

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Image could not be loaded.'))
    }
    image.src = objectUrl
  })
}

function sampleSource(source) {
  const sourceWidth = source.videoWidth || source.naturalWidth || source.width || 1
  const sourceHeight = source.videoHeight || source.naturalHeight || source.height || 1
  const scale = Math.min(1, ANALYSIS_MAX_SIDE / Math.max(sourceWidth, sourceHeight))
  const width = Math.max(1, Math.round(sourceWidth * scale))
  const height = Math.max(1, Math.round(sourceHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return null

  context.drawImage(source, 0, 0, width, height)
  const pixels = context.getImageData(0, 0, width, height).data

  return { width, height, pixels }
}

function luminanceAt(sample, x, y) {
  const index = ((y * sample.width) + x) * 4
  return (sample.pixels[index] * 0.299) + (sample.pixels[index + 1] * 0.587) + (sample.pixels[index + 2] * 0.114)
}

function averageRegion(sample, left, top, right, bottom) {
  const x1 = Math.max(0, Math.floor(left * sample.width))
  const x2 = Math.min(sample.width, Math.ceil(right * sample.width))
  const y1 = Math.max(0, Math.floor(top * sample.height))
  const y2 = Math.min(sample.height, Math.ceil(bottom * sample.height))
  let total = 0
  let count = 0

  for (let y = y1; y < y2; y += 1) {
    for (let x = x1; x < x2; x += 1) {
      total += luminanceAt(sample, x, y)
      count += 1
    }
  }

  return count ? total / count : 0
}

function verticalEdgeCandidates(sample) {
  const candidates = []
  const yStart = Math.floor(sample.height * 0.16)
  const yEnd = Math.floor(sample.height * 0.88)
  const xStart = Math.floor(sample.width * 0.05)
  const xEnd = Math.floor(sample.width * 0.95)

  for (let x = xStart; x < xEnd; x += 1) {
    let hits = 0
    let total = 0
    let count = 0

    for (let y = yStart; y < yEnd; y += 2) {
      const diff = Math.abs(luminanceAt(sample, x, y) - luminanceAt(sample, Math.min(sample.width - 1, x + 1), y))
      total += diff
      count += 1
      if (diff >= EDGE_DIFF_THRESHOLD) hits += 1
    }

    const strength = count ? hits / count : 0
    if (strength >= MIN_EDGE_STRENGTH) {
      candidates.push({ pos: x / sample.width, strength, diff: total / count })
    }
  }

  return mergeNearbyCandidates(candidates)
}

function horizontalEdgeCandidates(sample) {
  const candidates = []
  const xStart = Math.floor(sample.width * 0.14)
  const xEnd = Math.floor(sample.width * 0.86)
  const yStart = Math.floor(sample.height * 0.05)
  const yEnd = Math.floor(sample.height * 0.95)

  for (let y = yStart; y < yEnd; y += 1) {
    let hits = 0
    let total = 0
    let count = 0

    for (let x = xStart; x < xEnd; x += 2) {
      const diff = Math.abs(luminanceAt(sample, x, y) - luminanceAt(sample, x, Math.min(sample.height - 1, y + 1)))
      total += diff
      count += 1
      if (diff >= EDGE_DIFF_THRESHOLD) hits += 1
    }

    const strength = count ? hits / count : 0
    if (strength >= MIN_EDGE_STRENGTH) {
      candidates.push({ pos: y / sample.height, strength, diff: total / count })
    }
  }

  return mergeNearbyCandidates(candidates)
}

function mergeNearbyCandidates(candidates) {
  const merged = []

  candidates.forEach((candidate) => {
    const previous = merged[merged.length - 1]
    if (previous && Math.abs(previous.pos - candidate.pos) < 0.035) {
      if (candidate.strength > previous.strength || candidate.diff > previous.diff) {
        previous.pos = candidate.pos
        previous.strength = candidate.strength
        previous.diff = candidate.diff
      }
    } else {
      merged.push({ ...candidate })
    }
  })

  return merged
}

function hasScreenRectangle(verticalEdges, horizontalEdges) {
  for (const leftEdge of verticalEdges) {
    for (const rightEdge of verticalEdges) {
      if (rightEdge.pos - leftEdge.pos < 0.44 || rightEdge.pos - leftEdge.pos > 0.92) continue
      if (leftEdge.pos > 0.38 || rightEdge.pos < 0.62) continue

      for (const topEdge of horizontalEdges) {
        for (const bottomEdge of horizontalEdges) {
          if (bottomEdge.pos - topEdge.pos < 0.36 || bottomEdge.pos - topEdge.pos > 0.88) continue
          if (topEdge.pos > 0.34 || bottomEdge.pos < 0.58) continue
          return true
        }
      }
    }
  }

  return false
}

function hasDarkPhoneFrame(sample) {
  const center = averageRegion(sample, 0.30, 0.20, 0.70, 0.78)
  const left = averageRegion(sample, 0.02, 0.18, 0.12, 0.82)
  const right = averageRegion(sample, 0.88, 0.18, 0.98, 0.82)
  const top = averageRegion(sample, 0.22, 0.02, 0.78, 0.12)
  const bottom = averageRegion(sample, 0.22, 0.86, 0.78, 0.98)

  const sideFrame = left < 88 && right < 88 && center - ((left + right) / 2) > 42
  const topBottomFrame = top < 92 && bottom < 92 && center - ((top + bottom) / 2) > 36

  return center > 95 && sideFrame && topBottomFrame
}

export async function detectPhonePhotoSpoof(file) {
  if (!file || !file.type?.startsWith('image/')) {
    return { suspicious: false, reason: 'not_image' }
  }

  try {
    const image = await loadImageFromFile(file)
    const sample = sampleSource(image)
    if (!sample) return { suspicious: false, reason: 'unavailable' }

    const verticalEdges = verticalEdgeCandidates(sample)
    const horizontalEdges = horizontalEdgeCandidates(sample)
    const screenRectangle = hasScreenRectangle(verticalEdges, horizontalEdges)
    const darkPhoneFrame = hasDarkPhoneFrame(sample)

    return {
      suspicious: screenRectangle || darkPhoneFrame,
      reason: screenRectangle ? 'screen_rectangle' : darkPhoneFrame ? 'phone_frame' : null,
    }
  } catch {
    return { suspicious: false, reason: 'unavailable' }
  }
}

export function detectPhonePhotoSpoofInVideo(video) {
  if (!video || video.readyState < 2) {
    return { suspicious: false, reason: 'not_ready' }
  }

  try {
    const sample = sampleSource(video)
    if (!sample) return { suspicious: false, reason: 'unavailable' }

    const verticalEdges = verticalEdgeCandidates(sample)
    const horizontalEdges = horizontalEdgeCandidates(sample)
    const screenRectangle = hasScreenRectangle(verticalEdges, horizontalEdges)
    const darkPhoneFrame = hasDarkPhoneFrame(sample)

    return {
      suspicious: screenRectangle || darkPhoneFrame,
      reason: screenRectangle ? 'screen_rectangle' : darkPhoneFrame ? 'phone_frame' : null,
    }
  } catch {
    return { suspicious: false, reason: 'unavailable' }
  }
}
