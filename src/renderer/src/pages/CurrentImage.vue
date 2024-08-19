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
  },
  methods: {
    onClick() {
      window.electron.ipcRenderer.invoke('getty-images-search', 'The Chainsmokers', 'editorial')
    }
  }
}
</script>

<template>
  <div>
    <h1 class="font-semibold text-white text-3xl py-5">Current Image</h1>
    <div v-if="currentImage">
      <img :src="currentImage" alt="Current Wallpaper" class="w-full h-auto" />
    </div>
    <div v-else>
      <p>No current wallpaper set.</p>
    </div>
    <button class="btn" @click="onClick">NEXT</button>
  </div>
</template>
