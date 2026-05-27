<script lang="ts" setup>
import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';
import Button from '../ui/button/Button.vue';

import { PhGear, PhArrowSquareOut, PhSun } from "@phosphor-icons/vue";
import Toggle from '../ui/toggle/Toggle.vue';

const { state, update } = useSettings('popup');

</script>

<template>
    <header class="bg-card border-b shrink-0 px-2 py-2" >

    <div class="flex items-center justify-between">

        <Toggle variant="outline" class="group flex flex-col items-start
                justify-between gap-y-0 gap-x-1 px-1 py-0.5 h-auto max-w-35 truncate
                ">

            <div class="flex items-center gap-1.5">
                <span
                    class="h-2.5 w-2.5 rounded-full bg-muted-foreground
                        group-data-[state=on]:bg-primary" 
                />
                <span class="text-sm font-medium">Enable</span>
            </div>
            <span class="text-xs text-muted-foreground">
                www.youtube.com
            </span>

        </Toggle>

        <div class="flex items-center gap-1">
            <Button variant="ghost" size="icon" class="[&_svg]:size-auto">
                <PhSun :size="20" />
            </Button>

            <Button variant="ghost" size="icon" class="[&_svg]:size-auto">
                <PhArrowSquareOut :size="20" />
            </Button>

            <Button variant="ghost" size="icon" class="[&_svg]:size-auto">
                <PhGear :size="26" />
            </Button>
        </div>

    </div>
    </header>
</template>
