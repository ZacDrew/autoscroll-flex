<script lang="ts" setup>
import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';
import Button from '../ui/button/Button.vue';
import { PhCaretDown, PhCaretLineDown, PhCaretLineUp, PhCaretUp } from '@phosphor-icons/vue';
import Toggle from '../ui/toggle/Toggle.vue';
import ToggleGroup from '../ui/toggle-group/ToggleGroup.vue';
import ToggleGroupItem from '../ui/toggle-group/ToggleGroupItem.vue';

const { state, update } = useSettings('popup');


</script>

<template>

<div class="absolute bottom-0 left-1/2 -translate-x-1/2 z-9999">

  <!-- tag -->
  <div class="flex justify-center p-0 rounded-t-full bg-card outline"
    :hidden="state.controlsHidden">

    <!-- circle -->
    <div class="relative w-24 h-24 mx-4 mt-2 mb-2 p-0 rounded-full flex flex-col
      items-start justify-center bg-card outline-2 z-50">

      <ToggleGroup
        type="single" orientation="vertical"
        class="flex flex-col w-full h-wull gap-0"
      >
        <!-- up button -->
        <ToggleGroupItem 
          value="up"
          title="Scroll Up" variant="default"
          class="group relative w-24 h-12 rounded-t-full [&_svg]:size-auto! p-0
            hover:bg-accent"
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
            hover:bg-accent"
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
