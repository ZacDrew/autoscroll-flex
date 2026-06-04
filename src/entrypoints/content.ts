import { ref } from 'vue'
import { useSettings } from '@/composables/useSettings';


export default defineContentScript({
  matches: ['<all_urls>', 'file:///*'],
  main() {
    const { state, update } = useSettings('content');

    console.log('Hello content. scrolling:', state.scrolling);

    
    




  },
});
