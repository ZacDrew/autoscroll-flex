<script lang="ts" setup>
import { useSettings } from '@/composables/useSettings';
import Card from '../ui/card/Card.vue';
import CardHeader from '../ui/card/CardHeader.vue';
import CardTitle from '../ui/card/CardTitle.vue';
import CardDescription from '../ui/card/CardDescription.vue';
import CardContent from '../ui/card/CardContent.vue';
import Textarea from '../ui/textarea/Textarea.vue';


const { state, update } = useSettings('options');



</script>

<template>

  <div class="scroll-m-18 text-xl font-semibold tracking-tight 
    mb-1 ml-3 mt-2">
    BlockList
  </div>

  <Card>
    <CardHeader>
      <CardTitle class="text-base">
        Sites on which this extension is disabled
      </CardTitle>
      <CardDescription>
        <p>One domain name per line.</p>
        <p>
          You can include more URL info after the
          domain suffix (i.e. ".com" or ".org") to narrow down what you want disabled.
        </p>
        <div class="ml-4">
          <p>simple domain link: www.youtube.com</p>
          <p>specific site link: www.youtube.com/watch (disables only video pages)</p>
        </div>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Textarea placeholder="Type a domain here (e.g. www.youtube.com)" 
        
      >
      </Textarea>
    </CardContent>
  </Card>
  <div class="">

  </div>
</template>
