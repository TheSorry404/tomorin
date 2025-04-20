import controller from './controller.ts'
import DigitalHuman from './controller.ts'

// 定义返回数据的类型
interface StreamChunk {
  chunk_id: number
  audio: string // base64
  answer: string
}

const hello = window.Module
// 传入iframeWindow是iframe的对象
export async function getAndPlayAudio(message: string, iframeWindow: any): Promise<void> {
  console.log(iframeWindow, 'iframeWindow')
  const iframeModule = iframeWindow.contentWindow.Module
  const query = message
  try {
    const response = await fetch('http://localhost:8000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 确保响应体是可读流
    if (!response.body) {
      throw new Error('Response body is not available')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    // 逐块读取流数据
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        console.log('Stream completed')
        break
      }

      // 将 Uint8Array 解码为字符串并追加到缓冲区
      buffer += decoder.decode(value, { stream: true })

      // 按换行符分割缓冲区
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // 保留未完成的行（如果有）

      // 处理每一行完整的 JSON 数据
      for (const line of lines) {
        if (line.trim()) {
          try {
            const chunk: StreamChunk = JSON.parse(line)
            console.log('Received chunk:', chunk)
            const audioString = chunk.audio
            const binary_audio = atob(audioString)
            const audioByteArray = new Uint8Array(binary_audio.length)
            for (let i = 0; i < binary_audio.length; i++) {
              audioByteArray[i] = binary_audio.charCodeAt(i)
            }
            controller.speak(audioByteArray, iframeModule)
            await playAudio(audioByteArray.buffer)
          } catch (e) {
            console.error('Error parsing JSON:', e)
          }
        }
      }
    }

    // 处理缓冲区中剩余的数据（如果有）
    if (buffer.trim()) {
      try {
        const chunk: StreamChunk = JSON.parse(buffer)
        console.log('Received final chunk:', chunk)
      } catch (e) {
        console.error('Error parsing final JSON:', e)
      }
    }
  } catch (error) {
    console.error('Stream error:', error)
  }
}

;(window as any).getAndPlayAudio = getAndPlayAudio

export async function playAudio(audioData: ArrayBuffer): Promise<void> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(
      audioData,
      (buffer: AudioBuffer) => {
        const source = audioContext.createBufferSource()
        source.buffer = buffer
        source.connect(audioContext.destination)
        source.onended = () => {
          resolve()
          audioContext.close()
        }
        source.start(0)
      },
      (error: DOMException) => {
        reject(error)
      },
    )
  })
}

;(window as any).playAudio = playAudio
