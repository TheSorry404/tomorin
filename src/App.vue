<!-- <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" /> -->
<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"></link> -->
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import UnityWebgl from 'unity-webgl'
import UnityVue from 'unity-webgl/vue'
import { FabComponent as EjsFab } from '@syncfusion/ej2-vue-buttons'

const iframeSrc = ref('/MiniLive.html')

const unityContext = new UnityWebgl({
  loaderUrl: 'https://academy-1258888325.cos.ap-chongqing.myqcloud.com/WebGL.loader.js',
  dataUrl: 'https://academy-1258888325.cos.ap-chongqing.myqcloud.com/WebGL.data',
  frameworkUrl: 'https://academy-1258888325.cos.ap-chongqing.myqcloud.com/WebGL.framework.js',
  codeUrl: 'https://academy-1258888325.cos.ap-chongqing.myqcloud.com/WebGL.wasm',
}) // Check before release, if in need it could be a OSS/COS address

// unityContext
//   .on('progress', (p) => console.log('loading :', p))
//   .on('mounted', () => console.log('unity mounted ...'))
//   .on('debug', (msg) => console.log('unity debug', msg));

// unityContext.addUnityListener('gameStart', (msg) => {
//   alert(msg);
//   console.log('gameStart : ', msg);
// });

// function sendMessage() {
//   unityContext.sendMessage('GameUI', 'ReceiveRole', 'Tanya');
// }
</script>

<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../node_modules/@material-design-icons/font';
</style>

<template>

  <div style="height: 100%; width: 100%; position: absolute; top: 0; left: 0">
    <UnityVue :unity="unityContext" tabindex="0" />
  </div>

  <iframe
    frameborder="0"
    style="z-index: 666; position: fixed; bottom: 0; left: 0; width: 33%; height: 33%; float: left"
    :src="iframeSrc"
  ></iframe>

  <v-fab
    :key="'absolute'"
    :absolute="true"
    :color="'primary'"
    :location="'right bottom'"
    size="large"
    id="fab"
    name="fab"
    icon
    style="z-index: 9999; margin-right: 12px; margin-top: -15px"
  >
    <v-icon>{{ 'mdi-crown' }}</v-icon>
    <v-speed-dial :location="'top center'" :transition="'scale-transition'" activator="parent">
      <v-btn key="1" color="success" icon>
        <v-icon size="24">$success</v-icon>
      </v-btn>

      <v-btn key="2" color="info" icon>
        <v-icon size="24">$info</v-icon>
      </v-btn>

      <v-btn key="3" color="warning" icon>
        <v-icon size="24">$warning</v-icon>
      </v-btn>

      <v-btn key="4" color="error" icon>
        <v-icon size="24">$error</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-fab>
</template>
<style>
</style>
