<script lang="ts" setup>
import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';
import { handleScrollingStatus } from '@/composables/handleScrollingStatus';
import Button from '../ui/button/Button.vue';
import { PhCaretDown, PhCaretLineDown, PhCaretLineUp, PhCaretUp } from '@phosphor-icons/vue';
import Toggle from '../ui/toggle/Toggle.vue';
import ToggleGroup from '../ui/toggle-group/ToggleGroup.vue';
import ToggleGroupItem from '../ui/toggle-group/ToggleGroupItem.vue';
import { onMessage, sendMessage } from '@/utils/messaging'
import { handleEnabled } from '@/composables/handleEnabled.js';

const { state, update } = useSettings('popup');

const { scrollingStatus, updateScrollingStatus } = handleScrollingStatus('popup');

const { siteEnabled } = handleEnabled();


let scrollingAndDirection = computed({
  get: () => {
    if (state.direction && scrollingStatus.scrolling) return state.direction;

    return undefined;
  },
  
  set: (dir) => {
    // dir ? update('scrolling', true) : update('scrolling', false);
    if(dir) {
      updateScrollingStatus(true);
      update('direction', dir);
    } else {
      updateScrollingStatus(false);
    }
    console.log('scrollingStatus:', scrollingStatus.scrolling);

  }
});

</script>

<template>

<div class="absolute bottom-0 left-1/2 -translate-x-1/2 z-9999">

  <!-- tag -->
  <div class="flex justify-center h-28 w-32 p-0 rounded-t-full bg-card outline"
    :hidden="state.controlsHidden">

    <!-- circle -->
    <div class="relative w-24 h-24 mt-2 mb-0 mx-0 p-0 rounded-full flex flex-col
      items-start justify-center bg-card outline-2 z-50 pointer-events-none">

      <ToggleGroup
        type="single" orientation="vertical"
        v-model="scrollingAndDirection"
        class="flex flex-col w-full h-wull gap-0"
        :disabled="!siteEnabled"
      >
        <!-- up button -->
        <ToggleGroupItem 
          value="up"
          title="Scroll Up" variant="default"
          class="group relative w-24 h-12 rounded-t-full [&_svg]:size-auto! p-0
            bg-secondary hover:bg-accent pointer-events-auto"
        >
          <PhCaretUp :size="45" weight="bold"
            class="self-center absolute top-1.5 group-data-[state=on]:text-primary"
          />
        </ToggleGroupItem>
        <!-- down button -->
        <ToggleGroupItem 
          value="down"
          title="Scroll Down" variant="default"
          class="group relative w-24 h-12 rounded-b-full [&_svg]:size-auto! p-0
            bg-secondary hover:bg-accent pointer-events-auto"
        >
          <PhCaretDown :size="45" weight="bold"
            class="self-center absolute bottom-1.5 group-data-[state=on]:text-primary"
          />
        </ToggleGroupItem>
      </ToggleGroup>
      
    </div>

    <div class="absolute w-27 h-27 rounded-full bg-card z-20
    top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"></div>

    <!-- Hide Button -->
    <Button title="Hide Controls" variant="secondary" class="absolute bottom-1 right-1 z-10 
      border-0 p-0.5 pt-4 pl-4 [&_svg]:size-auto h-auto hover:bg-accent" 
      @click="update('controlsHidden', true)">

      <PhCaretLineDown :size="18" weight="bold" class="bg-accnt m-0"/>
    </Button>
  </div>

  <!-- Show Button -->
  <div :hidden="!state.controlsHidden" class="flex">
    <Button title="Show Controls" variant="outline" 
      class="w-12 h-5 rounded-b-none rounded-t-lg border-b-0"
      @click="update('controlsHidden', false)"
      >

      <PhCaretLineUp :size="10" weight="bold" />
    </Button>
  </div>

</div>

</template>
