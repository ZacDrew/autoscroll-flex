<script lang="ts" setup>
import { useSettings } from '@/composables/useSettings';
import Input from '../ui/input/Input.vue';
import PresetCard from '@/components/popup/PresetCard.vue'
import Label from '../ui/label/Label.vue';
import { GlidePreset } from '@/types/settings.js';
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from "@formkit/drag-and-drop";


const { state, update } = useSettings('popup');

function clickGlidePreset(id: string) {
  // state.glidePresetSelected = index; // sets the local glide preset before hearing back from bg
  update('glidePresetSelected', id)
}

/* Make the preset lists draggable */
// Initialize with empty array, not state.glidePresets (which may be undefined)
const [glideList, glidePresets] = useDragAndDrop<GlidePreset>([], {
  plugins: [animations()],
  onDragend: () => update('glidePresets', JSON.parse(JSON.stringify(glidePresets.value)))
})

// keep glidePreset up to date with state.
watch(
  () => state.glidePresets,
  (val) => { if (val) glidePresets.value = val },
  { deep: true, immediate: true }  // immediate catches the first load
)

</script>


<template>

  <div class="flex flex-col gap-1" ref="glideList">

    <PresetCard v-for="(preset, index) in glidePresets" :key="preset.id"
      :selected="state.glidePresetSelected === preset.id" @select="clickGlidePreset(preset.id)">

      <!-- Scroll Speed -->
      <Label class="flex flex-col">
        <span class="font-semibold text-sm">
          Scroll Speed {{ glidePresets.indexOf(preset) }}
        </span>

        <div class="flex items-center gap-1">

          <Input type="number" v-model="preset.speed" @change="update('glidePresets', state.glidePresets)"
            class="w-30 h-8 font-semibold [appearance:textfield]" />

          <span class="text-muted-foreground text-sm">
            px/sec
          </span>

        </div>
      </Label>

    </PresetCard>
  </div>

</template>