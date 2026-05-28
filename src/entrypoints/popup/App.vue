// src/entrypoints/popup/App.vue

<script lang="ts" setup>
import HelloWorld from '@/components/HelloWorld.vue';
import HeaderBar from '@/components/popup/HeaderBar.vue';
import ScrollTypes from '@/components/popup/ScrollTypes.vue';

</script>

<template>
  <div class="bg-background flex h-full flex-col overflow-hidden min-w-[296px]">
    <HeaderBar />
    <div class="px-3 py-4 flex-1 overflow-y-auto">
      <ScrollTypes />
    </div>
    
  </div>
</template>

