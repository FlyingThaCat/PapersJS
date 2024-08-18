<script setup lang="ts">
import HeaderComponent from './components/HeaderComponent.vue'

window.electron.ipcRenderer.send('spawn-gettyImages')
</script>

<template>
  <HeaderComponent />
  <router-view></router-view>
</template>
