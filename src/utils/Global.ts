export const backendUrl = 'https://tour.apricityx.top:8000'

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

export const getPosition = async () => {
  const url = `/positions.json`
  const headers = {
    'Content-Type': 'application/json',
  }
  return await fetch(url, {
    method: 'GET',
    headers: headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      console.log(response)
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error)
    })
}
