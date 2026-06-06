// src/entrypoints/detached/App.vue

<script lang="ts" setup>
import HelloWorld from '@/components/HelloWorld.vue';
import DisabledWarning from '@/components/popup/DisabledWarning.vue';
import HeaderBar from '@/components/popup/HeaderBar.vue';
import ScrollModes from '@/components/popup/ScrollModes.vue';
import SrcollControls from '@/components/popup/SrcollControls.vue';
import Button from '@/components/ui/button/Button.vue';
import { useSettings } from '@/composables/useSettings';


const { state, update } = useSettings('popup');


const scrollContainer = ref<HTMLElement | null>(null)

function onWheel(event: WheelEvent) {
  scrollContainer.value?.scrollBy({
    top: event.deltaY,
  })
}

</script>

<template>
  <div class="bg-background flex h-full flex-col overflow-hidden min-w-[296px] min-h-[600px]">

    <HeaderBar />
    <DisabledWarning />

    <div class="px-3 flex-1 overflow-y-auto"
      :class="state.controlsHidden ? 'pb-7' : 'pb-32'"
      ref="scrollContainer"
    >
      <ScrollModes />

    </div>

    <SrcollControls @wheel="onWheel"/>
    
  </div>
</template>

