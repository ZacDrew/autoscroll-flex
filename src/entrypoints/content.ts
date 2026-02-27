import { ref } from 'vue'

export default defineContentScript({
  matches: ['<all_urls>', 'file:///*'],
  main() {
    const a = ref(0);
    console.log('Hello content.', a);
  },
});
