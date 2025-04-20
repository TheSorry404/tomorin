import { ref, onMounted, onUnmounted } from 'vue'

export function useMiniLiveIframe() {
  const iframeSrc = ref('/MiniLive.html')
  const iframeContainer = ref<HTMLIFrameElement | null>(null)
  const iframeWidth = ref(100)
  const iframeHeight = ref(180)

  let isDragging = false
  let startX = 0,
    startY = 0
  let initialLeft = 0,
    initialTop = 0

  const getClientX = (e: MouseEvent | TouchEvent) => {
    if (window.TouchEvent === undefined) return (e as MouseEvent).clientX
    if (window.MouseEvent === undefined) return (e as TouchEvent).touches[0].clientX
    if (e instanceof MouseEvent) return e.clientX
    if (e instanceof TouchEvent) return e.touches[0].clientX
    throw Error('got e has no supported type.')
  }
  const getClientY = (e: MouseEvent | TouchEvent) => {
    if (window.TouchEvent === undefined) return (e as MouseEvent).clientY
    if (window.MouseEvent === undefined) return (e as TouchEvent).touches[0].clientY
    if (e instanceof MouseEvent) return e.clientY
    if (e instanceof TouchEvent) return e.touches[0].clientY
    throw Error('got e has no supported type.')
  }

  const onDragStart = (e: MouseEvent | TouchEvent) => {
    const el = iframeContainer.value
    if (!el) return

    isDragging = true
    el.classList.add('dragging')

    startX = getClientX(e)
    startY = getClientY(e)

    const rect = el.getBoundingClientRect()
    initialLeft = rect.left
    initialTop = rect.top

    document.addEventListener('mousemove', onDragging)
    document.addEventListener('mouseup', onDragEnd)
    document.addEventListener('touchmove', onDragging, { passive: false })
    document.addEventListener('touchend', onDragEnd)
  }

  const onDragging = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !iframeContainer.value) return
    e.preventDefault()

    const dx = getClientX(e) - startX
    const dy = getClientY(e) - startY
    iframeContainer.value.style.left = `${initialLeft + dx}px`
    iframeContainer.value.style.top = `${initialTop + dy}px`
  }

  const onDragEnd = () => {
    isDragging = false
    iframeContainer.value?.classList.remove('dragging')

    document.removeEventListener('mousemove', onDragging)
    document.removeEventListener('mouseup', onDragEnd)
    document.removeEventListener('touchmove', onDragging)
    document.removeEventListener('touchend', onDragEnd)

    const el = iframeContainer.value
    if (el) {
      const rect = el.getBoundingClientRect()
      const outOfBounds =
        rect.left < 0 ||
        rect.top < 0 ||
        rect.right > window.innerWidth ||
        rect.bottom > window.innerHeight

      if (outOfBounds) {
        const el = iframeContainer.value
        if (el) {
          const rect = el.getBoundingClientRect()
          const margin = 10 // Distance from the edge
          const newTop = Math.min(
            Math.max(rect.top, margin),
            window.innerHeight - rect.height - margin,
          )
          const newLeft = Math.min(
            Math.max(rect.left, margin),
            window.innerWidth - rect.width - margin,
          )
          el.style.top = `${newTop}px`
          el.style.left = `${newLeft}px`
        }
      }
    }
  }

  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'video-ratio') {
      const ratio = event.data.ratio
      iframeHeight.value = iframeWidth.value * ratio
    }
  }

  onMounted(() => {
    const el = iframeContainer.value
    if (!el) return
    el.style.position = 'fixed'
    el.style.top = '40px'
    el.style.left = '20px'
    el.style.zIndex = '9999'

    window.addEventListener('message', handleMessage)
  })

  onUnmounted(() => {
    window.removeEventListener('message', handleMessage)
  })

  onUnmounted(() => {
    // remove any future message or event listeners if needed
  })

  return {
    iframeSrc,
    iframeContainer,
    iframeWidth,
    iframeHeight,
    onDragStart,
  }
}
