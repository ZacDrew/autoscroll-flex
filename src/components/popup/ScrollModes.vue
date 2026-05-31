<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import { useSettings } from '@/composables/useSettings';
import { sendMessage } from '@/utils/messaging'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CardContent from '../ui/card/CardContent.vue';
import Input from '../ui/input/Input.vue';
import { PhX } from '@phosphor-icons/vue';
import PresetCard from '@/components/popup/PresetCard.vue'
import Label from '../ui/label/Label.vue';
import { GlidePreset, ScrollMode, StepPreset } from '@/types/settings.js';
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { animations } from "@formkit/drag-and-drop";

const { state, update } = useSettings('popup');

function clickGlidePreset(id: string) {
  // state.glidePresetSelected = index; // sets the local glide preset before hearing back from bg
  update('glidePresetSelected', id)
}

function clickStepPreset(id: string) {
  // state.stepPresetSelected = index; // sets the local step preset before hearing back from bg
  update('stepPresetSelected', id)
}

/* Make the preset lists draggable */
// Initialize with empty array, not state.glidePresets (which may be undefined)
const [glideList, glidePresets] = useDragAndDrop<GlidePreset>([], {
  plugins: [animations()],
  onDragend: () => update('glidePresets', JSON.parse(JSON.stringify(glidePresets.value)))
})
const [stepList, stepPresets] = useDragAndDrop<StepPreset>([], {
  plugins: [animations()],
  onDragend: () => update('stepPresets', JSON.parse(JSON.stringify(stepPresets.value)))
})

// keep glidePreset and stepPreset up to date with state.
watch(
  () => state.glidePresets,
  (val) => { if (val) glidePresets.value = val },
  { deep: true, immediate: true }  // immediate catches the first load
)
watch(
  () => state.stepPresets,
  (val) => { if (val) stepPresets.value = val },
  { deep: true, immediate: true }
)

</script>

<template>
  
  
  <h4 class="scroll-m-18 text-center text-[17px] font-semibold tracking-tight mb-1 ml-3">
    Scroll Mode
  </h4>
  
  <Card class="p-2">

    <Tabs class="flex flex-col" v-model="state.scrollMode" @update:model-value="update('scrollMode', state.scrollMode)">
      <TabsList class="self-center
        [&>button:hover]:bg-accent
        [&>button[data-state=active]]:bg-primary 
        [&>button[data-state=active]]:text-primary-foreground">

        <TabsTrigger title="Select Glide Scroll" value="glide">
          Glide
        </TabsTrigger>
        <TabsTrigger title="Select Step Scroll" value="step">
          Step
        </TabsTrigger>
        <TabsTrigger title="Select Smart Scroll" value="smart">
          Smart
        </TabsTrigger>
      </TabsList>

      <!-- Glide Presets -->
      <TabsContent value="glide" class="flex flex-col gap-1" ref="glideList">

        <PresetCard v-for="(preset, index) in glidePresets" :key="preset.id"
          :selected="state.glidePresetSelected === preset.id" @click="clickGlidePreset(preset.id)">

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
      </TabsContent>

      <!-- Step Presets -->
      <TabsContent value="step" class="flex flex-col gap-1" ref="stepList">

        <PresetCard v-for="(preset, index) in stepPresets" :key="preset.id"
          :selected="state.stepPresetSelected === preset.id" @click="clickStepPreset(preset.id)">

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

      </TabsContent>

      <!-- Smart Presets -->
      <TabsContent value="smart">
        Feeling smart now?
      </TabsContent>
    </Tabs>


  </Card>
</template>