import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import CurrentImage from '../pages/CurrentImage.vue'
import AddImages from '../pages/AddImages.vue'
import Settings from '../pages/Settings.vue'
const routes: Array<RouteRecordRaw> = [
  { path: '/', component: CurrentImage },
  { path: '/addImages', component: AddImages },
  { path: '/settings', component: Settings }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
