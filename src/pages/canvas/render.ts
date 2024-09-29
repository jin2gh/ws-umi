import { Frame, GifReader } from 'omggif'

interface IImgData extends ImageData {
  frame?: number
}

let reader: GifReader
let timeout: number = -1
let frameNumber = 0
let previousFrameInfo: Frame
let previousImageData: IImgData | undefined
let loops = 0

function draw(ctx: CanvasRenderingContext2D) {
  if (!reader) return

  if (frameNumber === reader.numFrames()) {
    frameNumber = 0

    if (--loops === 0) {
      return
    }
  }

  const frameInfo = reader.frameInfo(frameNumber)
  timeout = window.setTimeout(() => draw(ctx), frameInfo.delay * 10)

  if (frameNumber === 0) {
    // Always clear whole canvas on the first frame
    ctx.clearRect(0, 0, reader.width, reader.height)
  }

  if (previousFrameInfo) {
    switch (previousFrameInfo.disposal) {
      case 0:
        // "No disposal specified" - do nothing, we draw over the existing canvas
        break
      case 1:
        // "Do not dispose" - do nothing, we draw over the existing canvas
        break
      case 2:
        // "Restore to background" - browsers ignore background color, so
        // in practice it is always "Restore to transparent"
        ctx.clearRect(
          previousFrameInfo.x,
          previousFrameInfo.y,
          previousFrameInfo.width,
          previousFrameInfo.height
        )
        break
      case 3:
        // "Restore to previous" - revert back to most recent frame that was
        // not set to "Restore to previous", or frame 0
        if (previousImageData) {
          ctx.putImageData(previousImageData, 0, 0)
        }
        break
      default:
        console.error('Disposal method is unsupported')
    }
  }

  if (frameNumber === 0 || frameInfo.disposal < 2) {
    // save this frame in case we need to revert to it later
    previousImageData = ctx.getImageData(0, 0, reader.width, reader.height)
    if (previousImageData) {
      previousImageData.frame = frameNumber
    }
  }

  // draw frame on top of existing canvas data
  const imageData = ctx.getImageData(0, 0, reader.width, reader.height)
  if (imageData) {
    reader.decodeAndBlitFrameRGBA(frameNumber, imageData.data)
    // ctx.putImageData(imageData, 0, 0, frameInfo.x, frameInfo.y, frameInfo.width, frameInfo.height); 这个写法在微信小程序<实机>上有卡顿问题
    ctx.putImageData(imageData, 0, 0)
    previousFrameInfo = frameInfo
    frameNumber++
  }
}
  

export function parseGif(canvas: HTMLCanvasElement, array: Uint8Array) {
  reader = new GifReader(array)
  frameNumber = 0
  loops = reader.loopCount()

  clearTimeout(timeout)
  canvas.width = reader.width
  canvas.height = reader.height
  const context = canvas.getContext('2d')
  if (context) draw(context)
}
