<script>
export default {
  name: 'CurrentImage',
  methods: {
    onClick() {
      window.electron.ipcRenderer.send('spawn-gettyImages')
    }
  }
}
</script>

<template>
  <div>
    <h1>CURRENT IMAGE</h1>
    <button class="btn" @click="onClick">NEXT</button>
  </div>
</template>
