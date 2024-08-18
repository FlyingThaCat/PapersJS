<script>
export default {
  name: 'AddImageModal',
  data() {
    return {
      searchQuery: '',
      source: 'Getty Images',
      type: 'Creative',
      hasError: false
    }
  },
  methods: {
    addImage() {
      if (this.searchQuery.trim() === '') {
        this.hasError = true
        return
      }
      this.hasError = false
      console.log('Add Image', this.searchQuery, this.source, this.type)
      // Clear form after adding
      this.searchQuery = ''
      this.type = 'Creative'
    }
  }
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
          <label
            class="mx-0 mt-2 input input-bordered flex items-center gap-2"
            :class="{ 'input-error': hasError }"
          >
            <input
              v-model="searchQuery"
              type="text"
              required
              class="grow"
              placeholder="The Chainsmokers"
            />
            <Vicon name="io-search" class="w-5 h-5" />
          </label>
          <span v-if="hasError" class="text-error text-sm">Search query is required</span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold">Source</span>
          <select class="select mt-2 select-bordered w-full" disabled v-model="source">
            <option>Getty Images</option>
          </select>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold">Type</span>
          <select class="select mt-2 select-bordered w-full" v-model="type">
            <option>Creative</option>
            <option>Editorial</option>
          </select>
        </div>
      </div>
      <div class="mt-5 flex w-full">
        <button
          type="button"
          class="btn btn-neutral w-full"
          @click="addImage"
          :disabled="searchQuery.trim() === ''"
        >
          Add Image
        </button>
      </div>
    </div>
  </dialog>
</template>
