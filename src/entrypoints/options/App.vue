<script lang="ts" setup>
import HelloWorld from '@/components/HelloWorld.vue';
import Blocklist from '@/components/options/Blocklist.vue';
import Header from '@/components/options/Header.vue';
import DisabledWarning from '@/components/popup/DisabledWarning.vue';
import HeaderBar from '@/components/popup/HeaderBar.vue';
import ScrollModes from '@/components/popup/ScrollModes.vue';
import SrcollControls from '@/components/popup/SrcollControls.vue';
import Button from '@/components/ui/button/Button.vue';
import { useSettings } from '@/composables/useSettings';


const { state, update } = useSettings('options');



</script>

<template>
  <div class="max-w-150 mx-auto">

    <Header/>
    <Blocklist/>
    
    
  </div>
</template>

