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
