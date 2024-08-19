<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  id: string
  items: string
  badges: string[]
}>()

const emit = defineEmits(['image-deleted'])

const deleteSearch = async () => {
  try {
    await window.electron.ipcRenderer.invoke('db-delete-search', props.id)
    emit('image-deleted', props.id)
  } catch (error) {
    console.error('Failed to delete image:', error)
  }
}
</script>

<template>
  <div :id="props.id" class="flex items-center h-12 hover:bg-zinc-600/20 rounded-md w-full p-1">
    <Vicon name="md-imagesearch-round" class="h-8 w-8 text-white mx-2" />
    <h1 class="text-white flex-grow ml-2">{{ props.items }}</h1>
    <div class="flex space-x-2 ml-2">
      <div
        v-for="(badge, index) in props.badges"
        :key="index"
        class="bg-neutral-700 text-white text-xs px-2 py-1 rounded-full"
      >
        {{ badge }}
      </div>
    </div>
    <button class="hover:bg-red-600 hover:rounded-md mx-2" @click="deleteSearch">
      <Vicon name="io-close" class="h-8 w-8 text-white" />
    </button>
  </div>
</template>
