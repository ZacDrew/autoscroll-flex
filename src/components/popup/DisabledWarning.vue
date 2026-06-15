<script lang="ts" setup>
import { handleEnabled } from '@/composables/handleEnabled.js';
import Card from '../ui/card/Card.vue';
import CardContent from '../ui/card/CardContent.vue';

const { partnerSite, siteEnabled, disabledCause } = handleEnabled();

const message = computed(() => {

  switch (disabledCause.value.reason) {
    case 'domain':
      return 'Autoscrolling is disabled on:'

    case 'custom':
      return 'Autoscrolling is disabled due to custom URL in settings:'

    case 'mozilla':
      return 'Firefox disables addons on:'
  }
})


</script>

<template>

  <div :hidden="siteEnabled">
    <Card class="flex flex-col bg-destructive mx-3 mt-2 mb-0 px-2 pb-1">
      <span class="text-secondary font-semibold font-roboto self-center">
        {{ message }}
      </span>
      <span class="text-secondary font-roboto self-center">
        {{ disabledCause.offendingLink }}
      </span>
    </Card>

  </div>

</template>
