<script lang="ts" setup>

import { useSettings } from '@/composables/useSettings';
import Card from '../ui/card/Card.vue';
import Switch from '../ui/switch/Switch.vue';
import CardContent from '../ui/card/CardContent.vue';
import Label from '../ui/label/Label.vue';
import CardHeader from '../ui/card/CardHeader.vue';
import Separator from '../ui/separator/Separator.vue';
import CardDescription from '../ui/card/CardDescription.vue';
import Input from '../ui/input/Input.vue';


const { state, update } = useSettings('options');



</script>

<template>

  <div>

    <div class="scroll-m-18 text-xl font-semibold tracking-tight
      mb-1 ml-3 mt-2">
      Hotkeys
    </div>

    <Card>
      <CardContent class="mt-4 ml- mr-">

        <!-- Enable static hotkeys master switch-->
        <div class="flex items-center justify-between">
          <Label for="enableStaticHotkeys" class="flex-1 cursor-pointer px-2 font-semibold">
            Use built-in hotkeys
          </Label>
          <Switch id="enableStaticHotkeys" />
        </div>

        <Separator class="mt-3 mb-5" />


        <!-- individual hotkeys -->
        <div class="ml-4 mt-">

          <!-- Spacebar toggle -->
          <div class="flex items-center justify-between">
            <Label for="spaceEnabled" class="flex-1 cursor-pointer font-semibold">
              Toggle autoScroll with spacebar
            </Label>
            <Switch id="spaceEnabled" />
          </div>

          <Separator class="my-3" />

          <!-- Left/Right toggle -->
          <div class="flex items-center justify-between">
            <Label for="lrEnabled" class="flex-1 cursor-pointer font-semibold">
              Cycle presets using left/right arrows
            </Label>
            <Switch id="lrEnabled" />
          </div>

          <Separator class="my-3" />

          <!-- Up/Down toggle -->
          <div class="flex items-center justify-between">
            <Label for="udEnabled" class="flex-1 cursor-pointer font-semibold">
              Change direction using up/down arrows
            </Label>
            <Switch id="udEnabled" />
          </div>

          <Separator class="my-3" />

          <!-- Fast Forward Toggle -->
          <div class="flex items-center justify-between">
            <Label for="fastForward" class="flex-1 cursor-pointer font-semibold">
              Fast forward
            </Label>
            <Switch id="fastForward" />
          </div>

          <div class="flex justify-between">
            <CardDescription class="mt-2">
              Hold down a directional arrow to quickly scroll up or down.
            </CardDescription>
            <div title="Fast forward speed" 
              class="flex items-baseline gap-1 mt-3 ml-5">
              <Input  class="w-20" />
              <span class="text-muted-foreground text-sm whitespace-nowrap">
              px/sec
              </span>
            </div>
          </div>


        </div>

      </CardContent>
    </Card>

  </div>

</template>
