import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from "axios";

import './styles/variables.css'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(vuetify)
app.provide('axios', axios)
app.mount('#app')
