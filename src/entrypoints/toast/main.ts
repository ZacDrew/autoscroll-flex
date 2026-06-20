import { createApp } from 'vue'
import App from './App.vue'
import 'vue-sonner/style.css'
import "@/assets/tailwind.css";

document.documentElement.classList.add("dark");

createApp(App).mount('#app')