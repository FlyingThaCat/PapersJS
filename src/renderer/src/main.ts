import './assets/main.css'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  IoImage,
  MdAddphotoalternateRound,
  MdSettingsRound,
  MdImagesearchRound,
  IoClose
} from 'oh-vue-icons/icons'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

addIcons(IoImage, MdAddphotoalternateRound, MdSettingsRound, MdImagesearchRound, IoClose)

const app = createApp(App)
app.component('Vicon', OhVueIcon)
app.use(router)
app.mount('#app')
