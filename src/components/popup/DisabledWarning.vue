<script lang="ts" setup>
import { handleEnabled } from '@/composables/handleEnabled.js';
import Card from '../ui/card/Card.vue';
import CardContent from '../ui/card/CardContent.vue';

const { siteKey, siteEnabled } = handleEnabled();

</script>

<template>

  <div :hidden="siteEnabled">
    <Card class="flex flex-col bg-destructive mx-3 mt-2 mb-0 px-2 pb-1">
      <span class="text-secondary font-semibold font-roboto self-center">
        Autoscrolling is disabled on domain
      </span>
      <span class="text-secondary font-roboto self-center">
        {{ siteKey }}
      </span>
    </Card>

  </div>

</template>
