import { ref } from 'vue'
import { useSettings } from '@/composables/useSettings';
import { useEventListener, useIntervalFn, useRafFn } from '@vueuse/core';
import { handleScrollingStatus } from '@/composables/handleScrollingStatus';
import { onMessage, sendMessage } from '@/utils/messaging'
import { findScrollTarget } from '@/utils/content/find-scroll-target';
import { handleEnabled } from '@/composables/handleEnabled.js';



export default defineContentScript({
  matches: ['<all_urls>', 'file:///*'],
  main() {


    const { state, update } = useSettings('content');
    const { scrollingStatus, updateScrollingStatus } = handleScrollingStatus('content');
    const { siteEnabled } = handleEnabled();


    const speed = computed(() => {
      return state.glidePresets.find(
        preset => preset.id === state.glidePresetSelected
      )?.speed ?? 0;
    })

    const distance = computed(() => {
      return state.stepPresets.find(
        preset => preset.id == state.stepPresetSelected
      )?.distance ?? 0;
    })

    const delay = computed(() => {
      let delay = state.stepPresets.find(
        preset => preset.id == state.stepPresetSelected
      )?.delay ?? 1;

      return delay * 1000;
    })

    console.log('Hello content. scrolling:', state.scrolling);

    let mouseTarget: EventTarget | null = null;
    let scrollTarget: Element | null = null;

    let yPos: number = window.scrollY;


    function glideScroller() {

      let direction = 1;

      const { pause, resume, isActive } = useRafFn(({ delta }) => {

        if (!scrollTarget) {
          console.log('no scrollTarget');
          return;
        };

        state.direction === 'down' ? direction = 1 : direction = -1;

        yPos += direction * speed.value * (delta / 1000);

        scrollTarget.scrollTop = yPos;
      },
        { immediate: false }
      )

      function startGlide() {

        scrollTarget = findScrollTarget(mouseTarget);
        yPos = scrollTarget?.scrollTop ?? 0;

        resume();
      }

      function stopGlide() {
        pause();
      }

      return { startGlide, stopGlide, glideIsActive: isActive }
    }


    function stepScroller() {

      let direction = 1;

      const { pause, resume, isActive } = useIntervalFn(() => {

        state.direction === 'down' ? direction = 1 : direction = -1;

        scrollTarget?.scrollBy({
          top: direction * distance.value,
          behavior: "smooth"
        })
      },
        delay
      )

      function startStep() {

        scrollTarget = findScrollTarget(mouseTarget);
        yPos = scrollTarget?.scrollTop ?? 0;

        resume();
      }

      function stopStep() {
        pause();
      }

      return { startStep, stopStep, stepIsActive: isActive }
    }


    function AutoScroller() {

      const { startGlide, stopGlide, glideIsActive } = glideScroller();
      const { startStep, stopStep, stepIsActive } = stepScroller();

      function startScroll() {
        if (!siteEnabled.value) return;       

        stopScroll();

        if (state.scrollMode === 'glide') {
          startGlide();
        }
        else if (state.scrollMode === 'step') {
          startStep();
        }
        else if (state.scrollMode === 'smart') {
          // do something
        }
      }

      function stopScroll() {
        stopGlide();
        stopStep();
      }

      return { startScroll, stopScroll }

    }

    const { startScroll, stopScroll } = AutoScroller();



    onMessage('getScrollingStatus', () => {
      console.dir('request recieved. scrollingStatus:', scrollingStatus);
      return structuredClone(toRaw(scrollingStatus));;
    })


    watch(
      () => scrollingStatus.scrolling,

      (scrolling) => {
        // console.log('messaged scrolling:', scrollingStatus.scrolling)

        if (scrolling) {
          startScroll();
        }
        else {
          stopScroll();
        }
      }
    )

    // restart scrolling if mode changes
    watch(
      () => state.scrollMode,
      () => {
        if (!scrollingStatus.scrolling) return;
        startScroll();
      }
    )

    // stop scrolling if website disabled
    watch(
      () => siteEnabled.value,
      () => {
        if (!siteEnabled.value) {
          stopScroll();
          updateScrollingStatus(false);
        }
      }
    )



    useEventListener(document, 'mouseover',
      (event) => {
        mouseTarget = event.target;
        // console.log(mouseTarget);
        // console.log('scrolling: ', state.scrolling);
      },
      {
        passive: true
      }
    )

    useEventListener(document, 'visibilitychange', () => {
      if (document.hidden) {
        stopScroll();
        updateScrollingStatus(false);
      }
    })



  },
});
