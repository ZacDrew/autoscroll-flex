<script lang="ts" setup>
import Card from '../ui/card/Card.vue';
import Switch from '../ui/switch/Switch.vue';
import CardContent from '../ui/card/CardContent.vue';
import Label from '../ui/label/Label.vue';
import CardDescription from '../ui/card/CardDescription.vue';
import { useSettings } from '@/composables/useSettings';


const { state, update } = useSettings('popup');


</script>

<template>
  <div class="mt-4">

    <Card>
      <!-- Enable static hotkeys master switch-->
      <div class="flex my-4 mx-3 items-center justify-between">
        <Label for="enableStaticHotkeys" class="flex-1 cursor-pointer font-semibold">
          Use built-in hotkeys
        </Label>
        <Switch id="enableStaticHotkeys" 
          :model-value="state.staticHotkeysEnabled"
          @update:model-value="(value) => {
            state.staticHotkeysEnabled = value;
            update('staticHotkeysEnabled', value);
          }"
        />
      </div>
    </Card>

  </div>
</template>

