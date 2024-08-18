<script>
import PapersJS from '../../../../resources/PapersJS.svg?asset'
export default {
  name: 'Header',
  data() {
    return {
      PapersJS
    }
  }
}
</script>

<template>
  <nav class="flex justify-between">
    <img :src="PapersJS" alt="PapersJS Logo" class="h-8 w-auto mr-4" />
    <div class="flex gap-5">
      <div class="tooltip tooltip-bottom" data-tip="Current Images">
        <router-link
          to="/"
          class="flex px-1 py-1 bg-slate-500 rounded-full hover:bg-slate-600 hover:rounded-full"
        >
          <Vicon class="w-8 h-8 p-1 text-white" name="io-image" />
        </router-link>
      </div>
      <div class="tooltip tooltip-bottom" data-tip="Add Images">
        <router-link
          to="/addImages"
          class="flex px-1 py-1 bg-slate-500 rounded-full hover:bg-slate-600 hover:rounded-full"
        >
          <Vicon class="w-8 h-8 p-1 text-white" name="md-addphotoalternate-round" />
        </router-link>
      </div>
      <div class="tooltip tooltip-bottom" data-tip="Settings">
        <router-link
          to="/settings"
          class="flex px-1 py-1 bg-slate-500 rounded-full hover:bg-slate-600 hover:rounded-full"
        >
          <Vicon class="w-8 h-8 p-1 text-white" name="md-settings-round" />
        </router-link>
      </div>
    </div>
  </nav>
</template>
