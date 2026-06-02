<script lang="ts" setup>
import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';
import Button from '../ui/button/Button.vue';
import { PhCaretDown, PhCaretUp } from '@phosphor-icons/vue';
import Toggle from '../ui/toggle/Toggle.vue';

</script>

<template>

<div class="absolute bottom-0 left-1/2 -translate-x-1/2 z-9999">

  <div class="flex justify-center p-0 rounded-t-full bg-card outline">

    <div class="w-24 h-24 mx-4 mt-2 mb-2 p-0 rounded-full flex flex-col 
      items-start justify-center bg-card outline-2">

      <Toggle variant="default"
        class="group relative w-24 h-12 rounded-t-full [&_svg]:size-auto p-0
          data-[state=on]:bg-background hover:bg-background"
      >
        <PhCaretUp :size="45" weight="bold"
          class="self-center bg-accen/5 absolute top-1.5 group-data-[state=on]:text-primary"
        />
      </Toggle>
      <Toggle variant="default"
        class="group relative w-24 h-12 rounded-b-full [&_svg]:size-auto p-0
          data-[state=on]:bg-background hover:bg-background"
      >
        <PhCaretDown :size="45" weight="bold"
          class="self-center bg-accen/5 absolute bottom-1.5 group-data-[state=on]:text-primary"
        />
      </Toggle>
    
    </div>
  </div>
</div>

</template>
