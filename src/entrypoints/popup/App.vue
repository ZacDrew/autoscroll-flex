// src/entrypoints/popup/App.vue

<script lang="ts" setup>
import HelloWorld from '@/components/HelloWorld.vue';
import EnableScrolling from '@/components/popup/EnableScrolling.vue';

</script>

<template>
  <div class="bg-surface text-text font-sans">
    <EnableScrolling />
    <p class="text-sakura">aaaa</p>

    <HelloWorld msg="WXT + Vue" />
    
  </div>
</template>

