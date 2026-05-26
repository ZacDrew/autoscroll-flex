<script lang="ts" setup>
import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';

defineProps({

});
const { state, update } = useSettings('popup');

</script>

<template>

</template>
