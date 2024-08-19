<script setup lang="ts">
import { defineEmits, ref } from 'vue'

const emit = defineEmits(['image-added'])
const searchQuery = ref('')
const source = ref('Getty Images')
const type = ref('Creative')

const addImage = async () => {
  try {
    await window.electron.ipcRenderer.invoke(
      'db-add-search',
      searchQuery.value,
      source.value,
      type.value
    )
    emit('image-added', searchQuery.value)
    const dialog = document.getElementById('AddImageModal') as HTMLDialogElement
    dialog?.close()
  } catch (error) {
    console.error('Failed to add image:', error)
  }
  // Clear form after adding
  searchQuery.value = ''
  type.value = 'Creative'
}
</script>

<template>
  <dialog id="AddImageModal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-square btn-ghost absolute right-5 top-5">✕</button>
      </form>
      <h3 class="text-lg font-bold">Add Image</h3>
      <div class="mt-2 gap-4 flex flex-col">
        <div>
          <span class="text-sm font-bold">Search Query</span>
          <label class="mx-0 mt-2 input input-bordered flex items-center gap-2">
            <input
              v-model="searchQuery"
              type="text"
              required
              class="grow"
              placeholder="The Chainsmokers"
            />
            <Vicon name="io-search" class="w-5 h-5" />
          </label>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold">Source</span>
          <select v-model="source" class="select mt-2 select-bordered w-full" disabled>
            <option>Getty Images</option>
            <option>Unsplash</option>
          </select>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold">Type</span>
          <select v-model="type" class="select mt-2 select-bordered w-full">
            <option>Creative</option>
            <option>Editorial</option>
          </select>
        </div>
      </div>
      <div class="mt-5 flex w-full">
        <button
          type="button"
          class="btn btn-neutral w-full"
          :disabled="searchQuery.trim() === ''"
          @click="addImage"
        >
          Add Image
        </button>
      </div>
    </div>
  </dialog>
</template>
