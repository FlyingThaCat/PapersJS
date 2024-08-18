<script setup lang="ts">
import Versions from './components/Versions.vue'
import Header from './components/Header.vue'

window.electron.ipcRenderer.send('spawn-gettyImages')
</script>

<template>
  <Header />
  <router-view></router-view>
</template>
