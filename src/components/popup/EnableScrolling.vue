<script lang="ts" setup>
import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';

defineProps({

});
const { state, update } = useSettings();

</script>

<template>
    <div class="flex rounded-lg p-2 pb-1 bg-surface-700">
        <label>some filler text</label>
    </div>
</template>
