<script lang="ts" setup>
import { useSettings } from '@/composables/useSettings';
import Input from '../ui/input/Input.vue';
import PresetCard from '@/components/popup/PresetCard.vue'
import Label from '../ui/label/Label.vue';
import { GlidePreset } from '@/types/settings.js';
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from "@formkit/drag-and-drop";
import Button from '../ui/button/Button.vue';
import { PhPlus } from '@phosphor-icons/vue';


const { state, update } = useSettings('popup');


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


function clickGlidePreset(id: string) {
  // state.glidePresetSelected = index; // sets the local glide preset before hearing back from bg
  update('glidePresetSelected', id)
}

function deletePreset(pos: number, preset: GlidePreset, presets: GlidePreset[]) {
  const isSelected = preset.id === state.glidePresetSelected;

  // check if the target preset is selected and also the final in the array
  if (isSelected && (presets.length === pos + 1)) {
    state.glidePresetSelected = presets[pos - 1].id;
    update('glidePresetSelected', state.glidePresetSelected);
  } 
  else if (isSelected) {
    state.glidePresetSelected = presets[pos + 1].id;
    update('glidePresetSelected', state.glidePresetSelected);
  } 
  
  presets.splice(pos, 1);
  update('glidePresets', presets);
  
}

function addPreset(presets: GlidePreset[]) {
  presets.push({id: crypto.randomUUID(), speed: 0})
  update('glidePresets', presets);
}

</script>


<template>

  <div class="flex flex-col gap-1" ref="glideList">

    <PresetCard v-for="(preset, index) in glidePresets" :key="preset.id"
      :selected="state.glidePresetSelected === preset.id" 
      :lastPreset="glidePresets.length < 2"
      @select="clickGlidePreset(preset.id)"
      @delete="deletePreset(glidePresets.indexOf(preset), preset, glidePresets)">

      <!-- Scroll Speed -->
      <Label class="flex flex-col">
        <span class="font-semibold text-sm">
          Scroll Speed
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

  <Button variant="outline" size="default" class="px-3 mt-2 [&_svg]:size-auto"
    @click="addPreset(glidePresets)"
  >
    <PhPlus :size="18" weight="bold" class="text-secondary-foreground"/>
    Add Preset
  </Button>

</template>