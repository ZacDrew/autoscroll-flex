<script lang="ts" setup>
import { useSettings } from '@/composables/useSettings';
import Input from '../ui/input/Input.vue';
import PresetCard from '@/components/popup/PresetCard.vue'
import Label from '../ui/label/Label.vue';
import { StepPreset } from '@/types/settings.js';
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from "@formkit/drag-and-drop";
import Button from '../ui/button/Button.vue';
import { PhPlus } from '@phosphor-icons/vue';


const { state, update } = useSettings('popup');


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


function clickStepPreset(id: string) {
  // state.stepPresetSelected = index; // sets the local step preset before hearing back from bg
  update('stepPresetSelected', id)
}

function deletePreset(pos: number, preset: StepPreset, presets: StepPreset[]) {
  const isSelected = preset.id === state.stepPresetSelected;

  // check if the target preset is selected and also the final in the array
  if (isSelected && (presets.length === pos + 1)) {
    state.stepPresetSelected = presets[pos - 1].id;
    update('stepPresetSelected', state.stepPresetSelected);
  } 
  else if (isSelected) {
    state.stepPresetSelected = presets[pos + 1].id;
    update('stepPresetSelected', state.stepPresetSelected);
  } 
  
  presets.splice(pos, 1);
  update('stepPresets', presets);
  
}

function addPreset(presets: StepPreset[]) {
  presets.push({id: crypto.randomUUID(), distance: 0, delay: 2})
  update('stepPresets', presets);
}

</script>


<template>

  <div class="flex flex-col gap-1" ref="stepList">

    <PresetCard v-for="(preset, index) in stepPresets" :key="preset.id"
      :selected="state.stepPresetSelected === preset.id"
      :lastPreset="stepPresets.length < 2"
      @select="clickStepPreset(preset.id)"
      @delete="deletePreset(stepPresets.indexOf(preset), preset, stepPresets)">

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
  
  <Button variant="outline" size="default" class="px-3 mt-2 [&_svg]:size-auto"
    @click="addPreset(stepPresets)"
  >
    <PhPlus :size="18" weight="bold" class="text-secondary-foreground"/>
    Add Preset
  </Button>

</template>