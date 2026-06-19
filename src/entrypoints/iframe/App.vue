<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import { useSettings } from '@/composables/useSettings';

const { state, update } = useSettings('popup');


</script>

<template>
  <div>
    <Card class="">
      Hello from iframe! AAAAAAAAAAAAAAAAAAAAAGHH
    </Card>
    <Button>
      aaaa
    </Button>
  </div>
</template>

<style>
html,
body,
#app {
  background: transparent;
  margin: 0;
}
</style>