<script lang="ts" setup>
import { useSettings } from '@/composables/useSettings';
import Input from '../ui/input/Input.vue';
import PresetCard from '@/components/popup/PresetCard.vue'
import Label from '../ui/label/Label.vue';
import { StepPreset } from '@/types/settings.js';
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from "@formkit/drag-and-drop";


const { state, update } = useSettings('popup');

function clickStepPreset(id: string) {
  // state.stepPresetSelected = index; // sets the local step preset before hearing back from bg
  update('stepPresetSelected', id)
}

/* Make the preset lists draggable */
// Initialize with empty array, not state.stepPresets (which may be undefined)
const [stepList, stepPresets] = useDragAndDrop<StepPreset>([], {
  plugins: [animations()],
  onDragend: () => update('stepPresets', JSON.parse(JSON.stringify(stepPresets.value)))
})

// keep stepPreset up to date with state.
watch(
  () => state.stepPresets,
  (val) => { if (val) stepPresets.value = val },
  { deep: true, immediate: true }
)

</script>


<template>

  <div class="flex flex-col gap-1" ref="stepList">

    <PresetCard v-for="(preset, index) in stepPresets" :key="preset.id"
      :selected="state.stepPresetSelected === preset.id" @select="clickStepPreset(preset.id)">

      <div class="flex gap-3">

        <!-- Scroll Distance -->
        <Label class="flex flex-col">
          <span class="font-semibold text-sm">
            Scroll Distance
          </span>

          <div class="flex items-center gap-1">

            <Input type="number" v-model="preset.distance" @change="update('stepPresets', state.stepPresets)"
              class="min-w-15 max-w-19 h-8 font-semibold [appearance:textfield]" />

            <span class="text-muted-foreground text-sm">
              px
            </span>

          </div>
        </Label>

        <!-- Scroll Interval -->
        <Label class="flex flex-col">
          <span class="font-semibold text-sm">
            Scroll Interval
          </span>

          <div class="flex items-center gap-1">

            <Input type="number" v-model="preset.delay" @change="update('stepPresets', state.stepPresets)"
              class="w-15 h-8 font-semibold [appearance:textfield]" />

            <span class="text-muted-foreground text-sm">
              sec
            </span>

          </div>
        </Label>

      </div>

    </PresetCard>
  </div>

</template>