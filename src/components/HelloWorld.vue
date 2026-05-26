<script lang="ts" setup>
import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';
import { sendMessage } from '@/utils/messaging'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

defineProps({
  msg: String,
});

const count = ref(0);
const { state, update } = useSettings('popup');
function btnClicked() {
  update('test', ++state.test)
  console.dir('state from popup: ', state);
  
  sendMessage('openwindow');
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <Card class="p-3">
    <p>what this look like?</p>
    <Button>
      Button
    </Button>
  </Card>

  <div class="bg-blue-400">
    <button type="button" @click="btnClicked()">count is {{ state.test }}</button>
  </div>


</template>