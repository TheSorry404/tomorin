export const backendUrl = 'http://localhost:8000'
export const blobToBase64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      resolve(reader.result) // reader.result 是一个 base64 编码的 Data URL
    }

    reader.onerror = reject

    reader.readAsDataURL(blob) // 读取 Blob 并转换为 base64 的 Data URL
  })
}
