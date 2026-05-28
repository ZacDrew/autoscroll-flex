<script lang="ts" setup>
import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';
import { sendMessage } from '@/utils/messaging'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CardTitle from '../ui/card/CardTitle.vue';
import CardContent from '../ui/card/CardContent.vue';
import Input from '../ui/input/Input.vue';
import { PhX } from '@phosphor-icons/vue';
import { useDebounceFn } from '@vueuse/core'


const { state, update } = useSettings('popup');

function clickPreset(index: number) {
  // state.glidePresetSelected = index; // sets the local glide preset before hearing back from bg
  update('glidePresetSelected', index)
}

</script>

<template>

  <Card class="p-2">

    <h4 class="scroll-m-18 text-center text-lg font-semibold tracking-tight mb-2">
      Scroll Mode
    </h4>

    <Tabs default-value="glide" class="flex flex-col">
      <TabsList class="self-center">
        <TabsTrigger value="glide" 
          class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Glide
        </TabsTrigger>
        <TabsTrigger value="step"
          class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Step
        </TabsTrigger>
        <TabsTrigger value="smart"
          class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          Smart
        </TabsTrigger>
      </TabsList>

      <TabsContent value="glide" class="flex flex-col gap-1">

        <Card 
          v-for="(preset, index) in state.glidePresets" :key="index"
          @click="clickPreset(index)"
          class="bg-muted rounded-lg"

          :class="state.glidePresetSelected === index 
            ? 'border-primary bg-accent' 
            : 'bg-muted'"
          >
          <CardContent class="p-0">

            <div class="flex items-stetch justify-between">
              <div class="px-2 pb-1.5 pt-0">

                <div class="flex flex-col">
                  <span class="font-semibold text-sm">Scroll Speed</span>

                  <div class="flex items-center gap-1">

                    <Input type="number" 
                      v-model="preset.speed"
                      @change="update('glidePresets', state.glidePresets)"
                      class="w-30 h-8 font-semibold [appearance:textfield]">
                    </Input>

                    <span class="text-muted-foreground text-sm">
                      px/sec
                    </span>

                  </div>
                </div>

              </div>
              <Button class="group [&_svg]:size-auto h-auto rounded-l-none
                rounded-r-lg border-l w-4.5 p-0 hover:bg-background">
                <PhX :size="15" weight="bold" class="group-hover:text-red-400"/>
              </Button>
            </div>

          </CardContent>
        </Card>


      </TabsContent>

      <TabsContent value="step">
        pop pop
      </TabsContent>

      <TabsContent value="smart">
        Feeling smart now?
      </TabsContent>
    </Tabs>


  </Card>
</template>