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
import GlidePresetList from '@/components/popup/GlidePresetList.vue';
import StepPresetList from '@/components/popup/StepPresetList.vue';


const { state, update } = useSettings('popup');

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

        <GlidePresetList />

      </TabsContent>

      <!-- Step Presets -->
      <TabsContent value="step" class="flex flex-col gap-1" ref="stepList">

        <StepPresetList />

      </TabsContent>

      <!-- Smart Presets -->
      <TabsContent value="smart">
        Feeling smart now?
      </TabsContent>
    </Tabs>


  </Card>
</template>