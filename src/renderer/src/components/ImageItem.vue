<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  items: string
  badges: string[]
}>()
</script>

<template>
  <div class="flex items-center h-12 hover:bg-zinc-600/20 rounded-md w-full p-1">
    <Vicon name="md-imagesearch-round" class="h-8 w-8 text-white" />
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
    <button class="hover:bg-red-600 hover:rounded-md mx-2">
      <Vicon name="io-close" class="h-8 w-8 text-white" />
    </button>
  </div>
</template>
