<script lang="ts" setup>
import { ref } from 'vue';

defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="bg-red-400">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p class="text-red-100">
      Edit
      <code>components/HelloWorld.vue</code> to test HMR aaaaaaaaaaaaaaa
    </p>
  </div>

  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the WXT and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #8F8;
}
</style>
