<script setup lang="ts">
// import { onMounted, ref } from 'vue'
import { useMiniLiveIframe } from './dh_helper/miniLiveIframe'
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'
import UnityWebgl from 'unity-webgl'
import UnityVue from 'unity-webgl/vue'
// import { FabComponent as EjsFab } from '@syncfusion/ej2-vue-buttons'
import DigitalHuman from '@/dh_helper/controller.ts'
import { getAndPlayAudio, playAudio } from '@/dh_helper/audio.ts'

const { iframeSrc, iframeContainer, iframeWidth, iframeHeight, onDragStart } = useMiniLiveIframe()
const unityContext = new UnityWebgl({
  loaderUrl: 'https://academy-1258888325.cos.ap-chongqing.myqcloud.com/WebGL.loader.js',
  dataUrl: 'https://academy-1258888325.cos.ap-chongqing.myqcloud.com/WebGL.data',
  frameworkUrl: 'https://academy-1258888325.cos.ap-chongqing.myqcloud.com/WebGL.framework.js',
  codeUrl: 'https://academy-1258888325.cos.ap-chongqing.myqcloud.com/WebGL.wasm',
}) // Check before release, if in need it could be a OSS/COS address

unityContext.addUnityListener('gameStart', (msg) => {
  alert(msg)
  console.log('gameStart : ', msg)
})
/// 和iframe通信
const dh = ref()

let iframeWindow = dh.value

const test = async () => {
  iframeWindow = dh.value
  if (!iframeWindow) {
    console.error('iframe not loaded yet')
    return
  }
  const iframeModule = iframeWindow.contentWindow.Module
  console.log(iframeModule)
  const response = await fetch('/test.wav')
  const arrayBuffer = await response.arrayBuffer() // 获取 ArrayBuffer
  DigitalHuman.speak(new Uint8Array(arrayBuffer), iframeModule)
  await playAudio(arrayBuffer)
}

let message = ref('')
</script>

<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../node_modules/@material-design-icons/font';
</style>

<template>
  <!--  <div style="height: 100%; width: 100%; position: absolute; top: 0; left: 0">-->
  <!--    <UnityVue :unity="unityContext" tabindex="0" />-->
  <!--  </div>-->
  <v-btn @click="test"> Speak with test wav</v-btn>
  <div ref="iframeContainer" class="draggable-container">
    <div class="drag-overlay" @mousedown="onDragStart" @touchstart="onDragStart"></div>
    <iframe
      ref="dh"
      frameborder="0"
      :src="iframeSrc"
      :style="{ width: iframeWidth + 'px', height: iframeHeight + 'px' }"
    >
    </iframe>
    <!--  <div class="drag-handle"   style="position: absolute; top: 0; left: 0; width: 100%; height: 30px; cursor: move; z-index: 10000; background: rgba(0,0,0,0.1);">-->

    <!--  </div>-->
  </div>
  <v-text-field v-model="message" label="Message" />
  <v-btn @click="getAndPlayAudio(message, dh.contentWindow.Module)"></v-btn>
</template>
<style scoped>
.draggable-container {
  position: absolute;
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  will-change: transform;
}

.draggable-container.dragging {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  cursor: grabbing;
  opacity: 0.95;
}

/* 👇 遮罩层，透明且覆盖整个 iframe 区域，负责触发拖动事件 */
.drag-overlay {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  cursor: grab;
  z-index: 2;
}
</style>
