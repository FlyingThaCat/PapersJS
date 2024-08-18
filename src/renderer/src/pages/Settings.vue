<script>
import { onMounted, ref } from 'vue'

export default {
  name: 'Settings',
  setup() {
    const updateInterval = ref('') // Store the update interval

    // Fetch settings from the database when the component is mounted
    const fetchSettings = async () => {
      try {
        const settings = await window.electron.ipcRenderer.invoke('db-get-settings')
        updateInterval.value = settings.updateInterval
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }

    // Save settings to the database
    const saveSettings = async () => {
      try {
        await window.electron.ipcRenderer.invoke('db-update-interval', updateInterval.value)
        alert('Settings saved successfully')
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    }

    // Fetch settings when the component is mounted
    onMounted(() => {
      fetchSettings()
    })

    return { updateInterval, saveSettings }
  }
}
</script>

<template>
  <div>
    <h1 class="font-semibold text-white text-3xl py-5">Settings</h1>
    <div class="flex flex-col gap-5">
      <div>
        <span class="text-sm font-bold">Update every (s,m,h)</span>
        <label class="input mt-2 input-bordered flex items-center gap-2 max-w-60">
          <input v-model="updateInterval" type="text" class="grow" placeholder="5m" />
          <Vicon name="hi-clock" class="w-5 h-5" />
        </label>
      </div>
      <button class="btn h-15 w-36 btn-square btn-neutral" @click="saveSettings">Save</button>
    </div>
  </div>
</template>
