<script>
import { onMounted, ref } from 'vue'

export default {
  name: 'CurrentImage',
  setup() {
    const currentImage = ref(null)
    window.electron.ipcRenderer.on('update-current-wallpaper', (event, imageData) => {
      currentImage.value = imageData.url
    })
    return { currentImage }
  }
}
</script>

<template>
  <div>
    <h1 class="font-semibold text-white text-3xl py-5">Current Image</h1>
    <div v-if="currentImage" class="flex items-center justify-center w-full">
      <img :src="currentImage" alt="Current Wallpaper" class="w-[85%]" />
    </div>
    <div v-else>
      <p>No current wallpaper set.</p>
    </div>
  </div>
</template>
