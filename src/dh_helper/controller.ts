import { Debugger } from './debugger.ts'

declare const parent: any
declare const Module: any

class DigitalHuman {
  static speak = (message: Uint8Array, iframeModule: any): void => {
    if (!iframeModule) {
      console.log('Module未定义')
      return
    }

    // 将 module 存储为局部变量
    const moduleInstance = iframeModule

    const arrayBuffer = message.buffer
    const view: Uint8Array = new Uint8Array(arrayBuffer)
    const arrayBufferPtr: number = iframeModule._malloc(arrayBuffer.byteLength)
    console.log('arrayBufferPtr', arrayBufferPtr.toString())
    console.log('view', view)

    moduleInstance.HEAPU8.set(view, arrayBufferPtr)
    console.log('buffer.byteLength', arrayBuffer.byteLength)
    moduleInstance._setAudioBuffer(arrayBufferPtr, arrayBuffer.byteLength)
    moduleInstance._free(arrayBufferPtr)
  }
}

;(window as any).DigitalHuman = DigitalHuman
export default DigitalHuman

declare global {
  interface Window {
    Module?: {
      _malloc: (size: number) => number
      _setAudioBuffer: (ptr: number, length: number) => void
      _free: (ptr: number) => void
      HEAPU8: Uint8Array
      // You can add other functions or properties as needed.
    }
  }
}
