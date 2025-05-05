import Wheel from './components/wheel/Index.vue'
export { Wheel }

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')