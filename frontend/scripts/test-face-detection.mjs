/**
 * Headless browser test for face detection (run while Vite dev server is up).
 * Usage: node scripts/test-face-detection.mjs
 */
import { chromium } from 'playwright'
import { writeFileSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const DEV_URL = process.env.VITE_URL || 'https://localhost:5174'
const FACE_IMAGE_URL = `${DEV_URL}/test-face.jpg`

async function main() {
  console.log('Launching Chromium...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ ignoreHTTPSErrors: true })
  const page = await context.newPage()

  const logs = []
  page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`))
  page.on('pageerror', (err) => logs.push(`[pageerror] ${err.message}`))

  console.log(`Opening ${DEV_URL} ...`)
  await page.goto(DEV_URL, { waitUntil: 'networkidle', timeout: 60000 })

  console.log('Downloading test face image...')
  const imageResponse = await page.request.get(FACE_IMAGE_URL)
  if (!imageResponse.ok()) {
    throw new Error(`Failed to download test image: ${imageResponse.status()}`)
  }
  const imageBuffer = await imageResponse.body()
  const tmpPath = join(tmpdir(), `face-test-${Date.now()}.jpg`)
  writeFileSync(tmpPath, imageBuffer)

  console.log('Running detectFaceInPhoto via Vite module...')
  const result = await page.evaluate(async ({ imageBase64 }) => {
    const { detectFaceInPhoto } = await import('/src/utils/faceDetection.js')

    const binary = atob(imageBase64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    const blob = new Blob([bytes], { type: 'image/jpeg' })
    const file = new File([blob], 'test-face.jpg', { type: 'image/jpeg' })

    const started = performance.now()
    const out = await detectFaceInPhoto(file)
    return {
      ...out,
      faceCount: out.faces?.length ?? 0,
      elapsedMs: Math.round(performance.now() - started),
    }
  }, { imageBase64: imageBuffer.toString('base64') })

  unlinkSync(tmpPath)
  await browser.close()

  console.log('\n--- Face detection test result ---')
  console.log(JSON.stringify(result, null, 2))

  if (logs.length) {
    console.log('\n--- Browser console ---')
    logs.forEach((line) => console.log(line))
  }

  if (result.method === 'unavailable') {
    console.error('\nFAIL: Detector unavailable (model/backend did not load).')
    process.exit(1)
  }

  if (!result.detected) {
    console.error(`\nFAIL: Face not detected (method=${result.method}, reason=${result.reason ?? 'unknown'}).`)
    process.exit(1)
  }

  console.log(`\nPASS: Face detected via ${result.method} in ${result.elapsedMs}ms`)
}

main().catch((err) => {
  console.error('\nTest error:', err.message || err)
  process.exit(1)
})
