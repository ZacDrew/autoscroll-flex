import { ref } from 'vue'
import { useSettings } from '@/composables/useSettings';
import { useEventListener, useRafFn } from '@vueuse/core';


export default defineContentScript({
  matches: ['<all_urls>', 'file:///*'],
  main() {
    const { state, update } = useSettings('content');

    const speed = computed(() =>
      state.glidePresets.find(
        preset => preset.id === state.glidePresetSelected
      )?.speed ?? 0
    )

    console.log('Hello content. scrolling:', state.scrolling);

    let mouseTarget: EventTarget | null = null;
    let scrollTarget: Element | null = null;

    let yPos: number = window.scrollY;



    function findScrollableParent(el: Element | null):
      Element | Document['scrollingElement'] {

      while (el && el !== document.body) {
        const style = getComputedStyle(el);

        if (
          (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
          el.scrollHeight > el.clientHeight
        ) {
          return el;
        }

        el = el.parentElement;
      }
      return document.scrollingElement;
    }

    function findScrollTarget() {

      if (mouseTarget instanceof Element) {
        const target = findScrollableParent(mouseTarget);
        if (target) scrollTarget = target;
      }
      else {
        scrollTarget = document.scrollingElement;
      }
    }


    function glideScroller() {

      const { pause, resume, isActive } = useRafFn(({ delta }) => {

        if (!scrollTarget) {
          console.log('no scrollTarget');
          return;
        };

        yPos += speed.value * (delta / 1000);

        scrollTarget.scrollTo(0, yPos);
      },
      { immediate: false }
      )

      function start() {

        findScrollTarget();
        yPos = scrollTarget?.scrollTop ?? 0;

        resume();
      }

      return { pause, start, isActive }
    }

    const { pause, start, isActive } = glideScroller();


    watch(
      () => [state.scrolling, state.direction],

      ([scrolling, direction]) => {

        if (scrolling) {
          console.log('start scrolling')
          start();
        } 
        else {
          console.log('stop scrolling')
          pause();
        }
      }
    )



    useEventListener(document, 'mouseover',
      (event) => {
        mouseTarget = event.target;
        // console.log(mouseTarget);
        console.log('scrolling: ', state.scrolling);
      },
      {
        passive: true
      }
    )

    useEventListener(document, 'visibilitychange', () => {
      if (document.hidden) {
        pause();
        update('scrolling', false);
        update('direction', undefined)
      }
    })



  },
});
