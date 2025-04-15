import { ref, onMounted, onUnmounted } from 'vue'

export function useMiniLiveIframe() {
  const iframeSrc = ref('/MiniLive.html')
  const iframeContainer = ref<HTMLIFrameElement | null>(null)
  const iframeWidth = ref(100)
  const iframeHeight = ref(180)

  let isDragging = false
  let startX = 0, startY = 0
  let initialLeft = 0, initialTop = 0

  const getClientX = (e: MouseEvent | TouchEvent) =>
    e instanceof TouchEvent ? e.touches[0].clientX : e.clientX
  const getClientY = (e: MouseEvent | TouchEvent) =>
    e instanceof TouchEvent ? e.touches[0].clientY : e.clientY

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
    el.style.top = '100px'
    el.style.left = '100px'
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
    onDragStart
  }
}
