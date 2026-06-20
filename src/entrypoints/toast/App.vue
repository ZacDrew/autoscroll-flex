<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import Sonner from '@/components/ui/sonner/Sonner.vue';
import { useSettings } from '@/composables/useSettings';
import { toast, Toaster } from 'vue-sonner';


const { state, update } = useSettings('content');
const { selectedPresetId, presets } = handleCurrentPreset('content');

function showToast() {

  const selectedPresetIndex = presets.value?.findIndex(
      preset => preset.id === selectedPresetId.value
    );
  const numSelectedPreset = selectedPresetIndex !== undefined ? selectedPresetIndex + 1 : 0;

  let title = `Preset ${numSelectedPreset}`;
  let description = 'empty';

  if (state.scrollMode === 'glide') {
    const speed = state.glidePresets.find(
        preset => preset.id === state.glidePresetSelected
      )?.speed ?? 0;

      description = [
      `${speed} px/s`,
      ].join('\n')
  }
  else if (state.scrollMode === 'step') {
    const stepValues = state.stepPresets.find(
        preset => preset.id === state.stepPresetSelected
      );
    
    description = [
    `${stepValues?.distance} px / ${stepValues?.delay} sec`,
    ].join('\n')
  }

  title = title + '\u00A0'.repeat(10) + description;
  console.log(title)

  toast(
    title,
    {
      // description: description,
      // duration: Infinity
    }
  )
}

watch(
  [ () => state.scrolling, () => selectedPresetId.value ],
  ([scrolling, selectedPresetId]) => {
    
    if (scrolling) {
      showToast();
    }
  }
)


</script>

<template>
  <div class="">
    <Toaster 
      theme="dark"
      position="top-center" 
      :visibleToasts="1" 
      :toastOptions="{
        style: { 
          background: 'var(--background)',
          width: '230px',
          textAlign: 'center',
          fontSize: '14px',
        },
      }"
    />
  </div>
</template>

<style>
html,
body,
#app {
  background: transparent;
  margin: 0;
}
</style>