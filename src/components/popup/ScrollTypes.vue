<script lang="ts" setup>
import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';
import { sendMessage } from '@/utils/messaging'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'


const { state, update } = useSettings('popup');

</script>

<template>

  <Card class="p-3">
    <p>what this look like?</p>
    <Button>
      Button
    </Button>
  </Card>
</template>