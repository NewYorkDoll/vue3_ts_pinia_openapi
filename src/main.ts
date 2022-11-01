import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import pinia from './store'
import { setupHttp } from './lib/http'

setupHttp()

createApp(App).use(pinia).mount('#app')
