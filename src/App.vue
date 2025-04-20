<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMiniLiveIframe } from './dh_helper/miniLiveIframe'
// import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import UnityWebgl from 'unity-webgl'
import UnityVue from 'unity-webgl/vue'
// import { FabComponent as EjsFab } from '@syncfusion/ej2-vue-buttons'
import ChatBox from './components/ChatBox.vue'
import DigitalHuman from '@/dh_helper/controller.ts'
import { getAndPlayAudio, playAudio } from '@/dh_helper/audio.ts'
import MicRecorder from './assets/utils/MicRecorder'

/*       数字人控制       */
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
/*       聊天框相关控件       */
const recorder = new MicRecorder()
let message = ref('')
const tab = ref('one')
const isRecording = ref(false)
const startRecording = async () => {
  console.log('startRecording')
  isRecording.value = true
  // 调用麦克风
  await recorder.startRecording()
}
const stopRecording = async () => {
  console.log('stopRecording')
  // 添加停止录音的逻辑
  isRecording.value = false
  await recorder.stopRecording()
  console.log('Recording File: ', recorder.recordingFile)
}

const textFieldLoading = ref(false)
const sendTextMessage = async () => {
  console.log('sendTextMessage')
  if (message.value !== '') {
    // 发送消息
    console.log('发送消息:', message.value)
    message.value = '' // 清空输入框
    textFieldLoading.value = true
    console.log(dh.value)
    const dhIframe = dh.value
    await getAndPlayAudio(message.value, dhIframe)
    textFieldLoading.value = false
  }
}
</script>

<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../node_modules/@material-design-icons/font';
</style>

<template>
    Unity视窗 fixed
    <div style="height: 100%; width: 100%; position: absolute; top: 0; left: 0">
      <UnityVue :unity="unityContext" tabindex="0" />
    </div>
  <!--  数字人窗口  -->
  <div ref="iframeContainer" class="draggable-container">
    <div class="drag-overlay" @mousedown="onDragStart" @touchstart="onDragStart"></div>
    <iframe
      ref="dh"
      frameborder="0"
      :src="iframeSrc"
      :style="{ width: iframeWidth + 'px', height: iframeHeight + 'px' }"
    >
    </iframe>
  </div>
  <!--  聊天窗口  -->
  <v-card
    class="chat-box"
    width="90%"
    style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%)"
  >
    <v-alert style="z-index: 10000" v-if="isRecording" variant="tonal" type="warning" height="50px">
      <span style="margin-left: 10px">说话中...</span>
    </v-alert>
    <v-tabs v-model="tab" bg-color="primary" height="30px">
      <v-tab value="one">语音</v-tab>
      <v-tab value="two">文字</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <!--语音输入-->
        <v-tabs-window-item value="one">
          <v-btn
            @mousedown="startRecording"
            @mouseup="stopRecording"
            @touchstart="startRecording"
            @touchend="stopRecording"
            style="width: 100%"
            variant="outlined"
          >
            按住说话
          </v-btn>
        </v-tabs-window-item>
        <!--文字输入-->
        <v-tabs-window-item value="two">
          <v-card>
            <v-text-field
              v-model="message"
              label="请输入..."
              variant="filled"
              auto-grow
              :loading="textFieldLoading"
            ></v-text-field>
            <v-btn style="width: 100%" @click="sendTextMessage">发送</v-btn>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
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

html,
body,
#app {
  height: 100%;
  overflow: hidden; /* 关键：防止多余滚动 */
}

input,
textarea,
select {
  font-size: 16px; /* iOS Safari 自动放大的临界点 */
}
</style>
