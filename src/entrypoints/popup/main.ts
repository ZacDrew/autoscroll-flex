// src/entrypoints/popup/main.ts

import { createApp } from 'vue';
// import './style.css';
import "@/assets/tailwind.css";
import App from './App.vue';

document.documentElement.classList.add("dark");

createApp(App).mount('#app');
