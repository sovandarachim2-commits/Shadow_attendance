const HUMAN_MIN_FACE_SCORE = 0.72
const HUMAN_MIN_BOX_RATIO = 0.08

let humanPromise = null

function supportsNativeFaceDetector() {
  return typeof window !== 'undefined' && 'FaceDetector' in window
}

function buildHumanConfig(backend) {
  const modelUrl = resolveModelUrl('blazeface.json')
  return {
    backend,
    cacheSensitivity: 0,
    filter: { enabled: true, equalization: true, flip: false },
    face: {
      enabled: true,
      detector: {
        enabled: true,
        modelPath: modelUrl,
        rotation: true,
        maxDetected: 2,
        minConfidence: HUMAN_MIN_FACE_SCORE,
      },
      mesh: { enabled: false },
      iris: { enabled: false },
      description: { enabled: false },
      emotion: { enabled: false },
      antispoof: { enabled: false },
      liveness: { enabled: false },
    },
    body: { enabled: false },
    hand: { enabled: false },
    object: { enabled: false },
    segmentation: { enabled: false },
    gesture: { enabled: false },
  }
}

function resolveModelUrl(filename) {
  const baseUrl = typeof import.meta !== 'undefined' && import.meta?.env?.BASE_URL
    ? import.meta.env.BASE_URL
    : '/'

  if (typeof window === 'undefined') {
    return `${baseUrl.replace(/\/+$/, '')}/models/human/${filename}`
  }

  const appRoot = new URL(baseUrl, window.location.origin)
  return new URL(`models/human/${filename}`, appRoot).toString()
}

async function getHumanDetector() {
  if (!humanPromise) {
    humanPromise = import('@vladmandic/human').then(async (module) => {
      const Human = module.Human || module.default

      for (const backend of ['webgl', 'wasm', 'cpu']) {
        try {
          const human = new Human(buildHumanConfig(backend))
          await human.load()
          await human.warmup()
          return human
        } catch {
          // Try next backend.
        }
      }

      throw new Error('No supported backend for face detection.')
    }).catch((err) => {
      humanPromise = null
      throw err
    })
  }

  return humanPromise
}

async function imageFileToBitmap(file) {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file)
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(img)
    }
    img.onerror = reject
    img.src = objectUrl
  })
}


export async function detectFaceInPhoto(file) {
  if (!file) return { detected: false, method: 'none' }

  let image = null
  try {
    image = await imageFileToBitmap(file)
    const human = await getHumanDetector()
    const result = await human.detect(image)
    const imageArea = (image.width || image.naturalWidth || 1) * (image.height || image.naturalHeight || 1)
    const validFaces = (result.face || []).filter((face) => {
      const score = face.faceScore || face.boxScore || 0
      const box = face.box || [0, 0, 0, 0]
      const boxRatio = (box[2] * box[3]) / imageArea
      return score >= HUMAN_MIN_FACE_SCORE && boxRatio >= HUMAN_MIN_BOX_RATIO
    })

    return {
      detected: validFaces.length === 1,
      method: 'human',
      faces: validFaces,
      reason: validFaces.length > 1 ? 'multiple_faces' : validFaces.length === 0 ? 'no_face' : null,
    }
  } catch {
    // Human model failed — try native browser detector before giving up.
  } finally {
    if (image && typeof image.close === 'function') {
      image.close()
    }
  }

  if (supportsNativeFaceDetector()) {
    try {
      image = await imageFileToBitmap(file)
      const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 })
      const faces = await detector.detect(image)
      return { detected: faces.length > 0, method: 'native', faces }
    } catch {
      // Native detector also failed.
    } finally {
      if (image && typeof image.close === 'function') {
        image.close()
      }
    }
  }

  // No reliable face detector available — do NOT fall back to pixel heuristics.
  return { detected: false, method: 'unavailable' }
}
