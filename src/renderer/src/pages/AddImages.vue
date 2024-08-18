<script>
import ImageItem from '../components/ImageItem.vue'
import AddImageModal from '../components/AddImageModal.vue'

export default {
  name: 'AddImages',
  components: {
    ImageItem,
    AddImageModal
  },
  methods: {
    showModal() {
      document.getElementById('AddImageModal').showModal()
    }
  }
}
</script>

<template>
  <div>
    <h1 class="font-semibold text-white text-3xl py-5">Add Images</h1>
    <div
      class="border-2 border-gray-700 px-10 py-4 flex flex-col items-center justify-center rounded-lg"
    >
      <button
        class="btn w-full bg-zinc-200 hover:bg-zinc-400 text-black rounded-1xl"
        @click="showModal()"
      >
        <span class="font-semibold">+ Add</span>
      </button>
      <div class="flex flex-col pt-5 gap-2 w-full max-h-80 overflow-auto">
        <div class="px-2 py-2">
          <ImageItem :items="'Martin Garrix'" :badges="['gettyImages', 'editorial']" />
          <ImageItem :items="'The Chainsmokers'" :badges="['gettyImages', 'editorial']" />
          <ImageItem :items="'Avicii'" :badges="['gettyImages', 'editorial']" />
          <ImageItem :items="'Kygo'" :badges="['gettyImages', 'editorial']" />
          <ImageItem :items="'Sandro Cavazza'" :badges="['gettyImages', 'editorial']" />
          <ImageItem :items="'Zedd'" :badges="['gettyImages', 'editorial']" />
          <ImageItem :items="'Clean Bandit'" :badges="['gettyImages', 'editorial']" />
        </div>
      </div>
    </div>
    <AddImageModal />
  </div>
</template>
