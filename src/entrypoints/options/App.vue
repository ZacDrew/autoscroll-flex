<script lang="ts" setup>
import HelloWorld from '@/components/HelloWorld.vue';
import Blocklist from '@/components/options/Blocklist.vue';
import Display from '@/components/options/Display.vue';
import Header from '@/components/options/Header.vue';
import StaticHotkeys from '@/components/options/StaticHotkeys.vue';
import DisabledWarning from '@/components/popup/DisabledWarning.vue';
import HeaderBar from '@/components/popup/HeaderBar.vue';
import ScrollModes from '@/components/popup/ScrollModes.vue';
import SrcollControls from '@/components/popup/SrcollControls.vue';
import Button from '@/components/ui/button/Button.vue';
import { useSettings } from '@/composables/useSettings';


const { state, update } = useSettings('options');



</script>

<template>
  <div class="max-w-150 mx-auto pb-40">

    <Header/>

    <div class="flex flex-col gap-y-4">
      <Blocklist/>
      <StaticHotkeys/>
      <Display/>
    </div>

  </div>

</template>

