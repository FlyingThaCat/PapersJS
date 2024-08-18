<script>
import { ref, onMounted } from 'vue'
import ImageItem from '../components/ImageItem.vue'
import AddImageModal from '../components/AddImageModal.vue'

export default {
  name: 'AddImages',
  components: {
    ImageItem,
    AddImageModal
  },
  setup() {
    const images = ref([])

    const fetchImages = async () => {
      try {
        const fetchedImages = await window.electron.ipcRenderer.invoke('db-get-images')
        images.value = fetchedImages
      } catch (error) {
        console.error('Failed to fetch images:', error)
      }
    }

    const showModal = () => {
      document.getElementById('AddImageModal')?.showModal()
    }

    const handleImageDeleted = (id) => {
      images.value = images.value.filter((image) => image.id !== id)
    }

    const handleImageAdded = () => {
      fetchImages()
    }

    onMounted(() => {
      fetchImages()
    })

    return { images, showModal, handleImageDeleted, handleImageAdded }
  }
}
</script>

<template>
  <div class="flex flex-col h-[89vh]">
    <h1 class="font-semibold text-white text-3xl py-5">Add Images</h1>
    <div class="flex-1 flex flex-col border-2 border-gray-700 px-4 py-4 rounded-lg box-border max-h-[80%]">
      <button
        class="btn w-full bg-zinc-200 hover:bg-zinc-400 text-black rounded-xl mb-4"
        @click="showModal()"
      >
        <span class="font-semibold">+ Add</span>
      </button>
      <div class="flex-1 flex flex-col gap-2 overflow-auto">
        <ImageItem
          v-for="image in images"
          :id="image.id"
          :key="image.id"
          :items="image.query"
          :badges="[image.provider, image.type.toLowerCase()]"
          @image-deleted="handleImageDeleted"
        />
      </div>
    </div>
    <AddImageModal @image-added="handleImageAdded" />
  </div>
</template>
