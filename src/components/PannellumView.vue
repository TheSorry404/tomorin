<template>
  <div ref="panoramaContainer" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPosition } from '@/utils/Global.ts'
// 定义 ref，类型为 HTMLDivElement 或 null
const panoramaContainer = ref<HTMLDivElement | null>(null)
// 定义全景图实例 ref，用于保存 Pannellum viewer 实例
const panoramaViewer = ref<any>(null)
let viewer: Pannellum
// 在组件挂载后初始化 Pannellum
onMounted(async () => {
  const positions: Position[] = await getPosition()
  // 将位置数据转换为 Pannellum 配置
  const config = {
    default: {
      firstScene: 'test',
      sceneFadeDuration: 1000, // 场景切换过渡时间（毫秒）
    },
    scenes: {
      test: {
        type: 'equirectangular',
        panorama: '/img/scene/售票处.jpg', // 替换为第一张全景图路径
        yaw: 0, // 初始水平视角
        pitch: 0, // 初始垂直视角
      },
    },
  }
  for (const position of positions) {
    config['scenes'][position.id] = {
      type: 'equirectangular',
      panorama: position.img,
      yaw: 0, // 初始水平视角
      pitch: 0, // 初始垂直视角
    }
  }
  console.log(config)
  if (panoramaContainer.value && window.pannellum) {
    viewer = window.pannellum.viewer(panoramaContainer.value, config)
  }
})

interface Window {
  pannellum: Pannellum
}

interface Position {
  id: string
  name: string
  latitude: number
  longitude: number
  action: string
  img: string
}

defineExpose({
  viewer,
})
</script>
