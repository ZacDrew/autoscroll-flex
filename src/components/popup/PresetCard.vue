<!-- PresetCard.vue -->
<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PhX } from '@phosphor-icons/vue'

defineProps<{
  selected?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <Card
    @click="$emit('click')"
    class="rounded-lg"
    :class="selected
      ? 'border-primary bg-accent'
      : 'bg-muted'"
  >
    <CardContent class="p-0">
      <div class="flex items-stretch justify-between">

        <div class="px-2 pb-1.5 pt-0 flex-1">
          <slot />
        </div>

        <Button
          class="group [&_svg]:size-auto h-auto rounded-l-none
          rounded-r-lg border-l w-4.5 p-0 hover:bg-background"
        >
          <PhX
            :size="15"
            weight="bold"
            class="group-hover:text-red-400"
          />
        </Button>

      </div>
    </CardContent>
  </Card>
</template>