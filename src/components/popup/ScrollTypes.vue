<script lang="ts" setup>
import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';
import { sendMessage } from '@/utils/messaging'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CardContent from '../ui/card/CardContent.vue';
import Input from '../ui/input/Input.vue';
import { PhX } from '@phosphor-icons/vue';
import PresetCard from '@/components/popup/PresetCard.vue'


const { state, update } = useSettings('popup');

function clickGlidePreset(index: number) {
  // state.glidePresetSelected = index; // sets the local glide preset before hearing back from bg
  update('glidePresetSelected', index)
}

function clickStepPreset(index: number) {
  // state.stepPresetSelected = index; // sets the local step preset before hearing back from bg
  update('stepPresetSelected', index)
}

</script>

<template>

  <Card class="p-2">

    <h4 class="scroll-m-18 text-center text-lg font-semibold tracking-tight mb-2">
      Scroll Mode
    </h4>

    <Tabs default-value="glide" class="flex flex-col">
      <TabsList class="self-center">
        <TabsTrigger value="glide" class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Glide
        </TabsTrigger>
        <TabsTrigger value="step" class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Step
        </TabsTrigger>
        <TabsTrigger value="smart" class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Smart
        </TabsTrigger>
      </TabsList>

      <!-- Glide Presets -->
      <TabsContent value="glide" class="flex flex-col gap-1">

        <PresetCard v-for="(preset, index) in state.glidePresets" :key="index"
          :selected="state.glidePresetSelected === index" @click="clickGlidePreset(index)">

          <div class="flex flex-col">
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
          </div>

        </PresetCard>
      </TabsContent>

      <!-- Step Presets -->
      <TabsContent value="step" class="flex flex-col gap-1">

        <PresetCard v-for="(preset, index) in state.stepPresets" :key="index"
          :selected="state.stepPresetSelected === index" @click="clickStepPreset(index)">

          <div class="flex gap-3">

            <!-- Scroll Distance -->
            <div class="flex flex-col">
              <span class="font-semibold text-sm">
                Scroll Distance
              </span>

              <div class="flex items-center gap-1">

                <Input type="number" v-model="preset.distance" 
                  @change="update('stepPresets', state.stepPresets)"
                  class="w-20 h-8 font-semibold [appearance:textfield]" />

                <span class="text-muted-foreground text-sm">
                  px
                </span>

              </div>
            </div>

            <!-- Scroll Interval -->
             <div class="flex flex-col">
              <span class="font-semibold text-sm">
                Scroll Interval
              </span>

              <div class="flex items-center gap-1">

                <Input type="number" v-model="preset.delay" 
                  @change="update('stepPresets', state.stepPresets)"
                  class="w-20 h-8 font-semibold [appearance:textfield]" />

                <span class="text-muted-foreground text-sm">
                sec
                </span>

              </div>
            </div>

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