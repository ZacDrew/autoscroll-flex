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
      Display
    </div>

    <Card>
      <CardContent class="mt-6 ml- mr-">

        <!-- Enable static hotkeys master switch-->
        <div class="flex items-center justify-between">
          <Label for="enableStaticHotkeys" class="flex-1 cursor-pointer px-2 font-semibold">
            Preset info popup 
          </Label>
          <Switch id="enableStaticHotkeys" 
            :model-value="state.presetToastEnabled"
            @update:model-value="(value) => {
              state.presetToastEnabled = value;
              update('presetToastEnabled', value);
            }"
          />
        </div>
        <CardDescription class="mt-2 ml-2 mr-25">
          Show the current preset's details in the top right corner when 
          autoscroll is activated or the preset is changed.
        </CardDescription>

      </CardContent>
    </Card>

  </div>

</template>
