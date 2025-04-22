<script setup lang="ts">
import { useMiniLiveIframe } from '@/dh_controller/miniLiveIframe'
import UnityWebgl from 'unity-webgl'
import DigitalHuman from '@/dh_controller/controller.ts'
import { getAndPlayAudio } from '@/dh_controller/audio.ts'
import MicRecorder from './assets/utils/MicRecorder'
import { backendUrl, blobToBase64 } from './assets/utils/Global'
import { ref } from 'vue'

/*       数字人控制       */
const { iframeSrc, iframeContainer, iframeWidth, iframeHeight, onDragStart } = useMiniLiveIframe()
const unityContext = new UnityWebgl({
  loaderUrl: 'https://acacos-cdn.syan.wang/WebGL.loader.js',
  dataUrl: 'https://acacos-cdn.syan.wang/WebGL.data',
  frameworkUrl: 'https://acacos-cdn.syan.wang/WebGL.framework.js',
  codeUrl: 'https://acacos-cdn.syan.wang/WebGL.wasm',
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
const isQuerying = ref(false)
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
  const recordingBlob = await recorder.stopRecording()
  console.log('Recording File: ', recordingBlob)
  console.log('Record Time:', recorder.getAudioTime())
  isQuerying.value = true
  // 向后端发送请求
  // 将recordingBlob转换为base64
  const base64Recording = await blobToBase64(recordingBlob)
  console.log('base64Recording: ', recordingBlob)
  // 获取建议
  ;(async () => {
    // 获取跳转建议
    const response = await fetch(`${backendUrl}/voice_suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recording: base64Recording }),
    })
    const data = await response.json()
    console.log('Suggestions:', data)
    if (data['suggestion'].length > 0) {
      showSnackbar({
        position: data['suggestion'], // 跳转到地方的位置 这里可能需要做一次翻译 将代号转换为具体的地点
        jumpFun: () => {
          console.log('跳转到:', data['suggestion'])
          // todo
          Camera.moveTo(data['suggestion'])
        },
      })
    }
  })().then((r) => {})

  // 获取语音
  await fetch(`${backendUrl}/voice_ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recording: base64Recording }),
  })
    .then((response) => {
      if (response.ok) {
        console.log('上传成功')
        // 如果后端返回 JSON，可以进一步解析
        return response
      } else {
        throw new Error(`上传失败，状态码：${response.status}`)
      }
    })
    .then(async (data) => {
      await DigitalHuman.speakStream(data, dh.value)
      isQuerying.value = false
    })
    .catch((error) => {
      console.error('上传过程中出错:', error)
      isQuerying.value = false
    })
}

const textFieldLoading = ref(false)
const sendTextMessage = async () => {
  console.log('sendTextMessage')
  if (message.value !== '') {
    // 发送消息
    console.log('发送消息:', message.value)
    textFieldLoading.value = true
    console.log(dh.value)
    const dhIframe = dh.value
    try {
      ;(async () => {
        // 获取跳转建议
        const response = await fetch(`${backendUrl}/suggest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: message.value }),
        })
        const data = await response.json()
        console.log('Suggestions:', data)
        if (data['suggestion'].length > 0) {
          showSnackbar({
            position: data['suggestion'], // 跳转到地方的位置 这里可能需要做一次翻译 将代号转换为具体的地点
            jumpFun: () => {
              console.log('跳转到:', data['suggestion'])
              // todo
            },
          })
        }
      })().then((r) => {})
      await getAndPlayAudio(message.value, dhIframe)
      message.value = '' // 清空输入框
    } catch (e) {
      console.error('获取音频失败:', e)
      alert('服务器忙或服务器未启动，请稍后再试')
    }
    textFieldLoading.value = false
  }
}

/*       提示       */
const snackbar = ref(false)
const suggested_position = ref('')
const jumping = ref(() => {})
const showSnackbar = ({ position, jumpFun }) => {
  suggested_position.value = position
  jumping.value = jumpFun
  snackbar.value = true
}

/*   Google   */
const googleMap = ref<HTMLElement | null>(null)

const initialize = () => {
  const fenway = { lat: 39.9999819, lng: 116.2754613 }
  const map: google.maps.Map = new google.maps.Map(googleMap.value, {
    zoom: 15,
    center: fenway,
    mapTypeId: 'roadmap',
  })
}
declare global {
  interface Window {
    google: any
    map_initialize: () => void
  }
}

// 向外暴露函数
window.map_initialize = initialize
</script>

<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../node_modules/@material-design-icons/font';
</style>

<template>
  <!--  Google视窗 fixed-->
  <div style="height: 100%; width: 100%; position: absolute; top: 0; left: 0" ref="googleMap"></div>
  <!--  Unity视窗 fixed-->
  <!--  <div style="height: 100%; width: 100%; position: absolute; top: 0; left: 0">-->
  <!--    <UnityVue :unity="unityContext" tabindex="0" />-->
  <!--  </div>-->
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
    :loading="textFieldLoading || isQuerying"
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
            :disabled="isQuerying || textFieldLoading"
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
              :loading="textFieldLoading || isQuerying"
              :disabled="textFieldLoading || isQuerying"
            ></v-text-field>
            <v-btn
              style="width: 100%"
              :disabled="textFieldLoading || isQuerying"
              @click="sendTextMessage"
              >发送
            </v-btn>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
  <v-snackbar v-model="snackbar">
    <p>建议前往 {{ suggested_position }}</p>
    <v-btn variant="text" style="width: 100%">带我去吧</v-btn>
    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">忽略</v-btn>
    </template>
  </v-snackbar>
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
