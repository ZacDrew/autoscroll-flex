<script lang="ts" setup>
import Button from '../ui/button/Button.vue';
import { PhGear, PhArrowSquareOut, PhSun } from "@phosphor-icons/vue";
import Toggle from '../ui/toggle/Toggle.vue';
import { handleEnabled } from '@/composables/handleEnabled.js';

const { siteKey, siteEnabled } = handleEnabled();

function popoutWindow() {
  sendMessage('openwindow');
}

</script>

<template>
  <header class="bg-card border-b shrink-0 px-2 py-2">

    <div class="flex items-center justify-between">

      <!-- enable/disable extension toggle -->
      <Toggle variant="outline" class="group flex flex-col items-start
                justify-between gap-y-0 gap-x-1 px-1 py-0.5 h-auto max-w-35 truncate
                hover:bg-background data-[state=on]:bg-background"
                v-model="siteEnabled"
                :disabled="false"
      >

        <div class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-muted-foreground ml-1
                        group-data-[state=on]:bg-primary
                        group-data-[disabled]:bg-muted-foreground"
          />
          <span class="text-sm font-medium">Enable</span>
        </div>
        <span class="text-xs text-muted-foreground self-center">
          {{ siteKey }}
        </span>

      </Toggle>

      <div class="flex items-center gap-1">
        <!-- light/dark mode button -->
        <Button title="Toggle light/dark theme" variant="ghost" size="icon" class="[&_svg]:size-auto">
          <PhSun :size="20" />
        </Button>

        <!-- popout button -->
        <Button title="Popout window" @click="popoutWindow()" variant="ghost" size="icon" class="[&_svg]:size-auto">
          <PhArrowSquareOut :size="20" />
        </Button>

        <!-- settings button -->
        <Button title="Settings" variant="outline" size="icon" class="[&_svg]:size-auto">
          <PhGear :size="26" />
        </Button>
      </div>

    </div>
  </header>
</template>
