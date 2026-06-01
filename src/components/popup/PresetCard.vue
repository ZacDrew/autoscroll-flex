<!-- PresetCard.vue -->
<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PhDotsSixVertical, PhX } from '@phosphor-icons/vue'
import { MouseLeft } from 'lucide-vue-next';

defineProps<{
  selected?: boolean
  lastPreset?: boolean
}>()

defineEmits<{
  (e: 'select'): void
  (e: 'delete'): void
}>()

const contentHovered = ref<boolean>(false)

function handleHighlights(selected: boolean, contentHovered: boolean) {
  if (selected) {
    return 'border border-primary';
  } else if (contentHovered) {
    return 'bg-accent';
  } else {
    return 'bg-muted';
  }
    

}
</script>

<template>
  <div class="flex items-stretch border rounded-lg" 
    :class="handleHighlights(selected, contentHovered)">

    <div class="flex items-stretch flex-1 rounded-l-lg">

      <!-- Handle Section -->
      <div class="drag-handle pr-0.5 flex items-center justify-center
        rounded-l-lg " :class="selected
        ? 'bg-accent'
        : 'bg-transparent'" 
        @click="" >
        <PhDotsSixVertical :size="20" weight="bold" class="" />
      </div>

      <!-- Content Section -->
      <Card @click="$emit('select')" class="rounded-none bg-muted hover:bg-accent
        flex-1 border-0 border-r" :class="selected
          ? 'bg-accent'
          : 'bg-transparent'"
          @mouseenter="contentHovered=true" @mouseleave="contentHovered=false">

        <CardContent class="p-0">
          <div class="pr-2 pb-1.5 pt-0 flex-1">
            <slot />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Delete Button -->
    <Button title="Delete Preset" @click="$emit('delete')" 
            class="group [&_svg]:size-auto h-auto rounded-l-none
            rounded-r-lg w-4.5 p-0 hover:bg-background"
            :disabled="lastPreset"  
          >
      <PhX :size="15" weight="bold" class="group-hover:text-red-400" />
    </Button>

  </div>
</template>