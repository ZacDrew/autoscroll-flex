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

      const scrollingActive = computed(() => {
        return glideIsActive.value || stepIsActive.value;
      })

      function toggleScroll() {
        if (scrollingStatus.scrolling) {
          stopScroll();
          updateScrollingStatus(false);
        }
        else {
          startScroll();
          updateScrollingStatus(true);
        }
      }

      return { startScroll, stopScroll, toggleScroll, scrollingActive }

    }

    const { startScroll, stopScroll, toggleScroll, scrollingActive } = AutoScroller();



    // Listen for static hotkeys
    useEventListener(window, 'keydown', (e) => {
      if (!siteEnabled || !state.staticHotkeysEnabled) return;

      // prevent use of hotkeys if typing
      const target = e.target
      if (
        target instanceof HTMLElement &&
        (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
        target.isContentEditable
        )
      ) {
        return;
      }

      // spacebar
      if (e.code === 'Space' && state.spaceEnabled) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        toggleScroll();
      }

      if (scrollingStatus.scrolling && state.lrEnabled) {

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const selectedPresetId = computed({
          get: () => {
            if (state.scrollMode === 'glide') return state.glidePresetSelected;
            if (state.scrollMode === 'step') return state.stepPresetSelected;
          },
          set: (id: string) => {
            if (state.scrollMode === 'glide') {
              state.glidePresetSelected = id;
              update('glidePresetSelected', id)
            }
            if (state.scrollMode === 'step') {
              state.stepPresetSelected = id;
              update('stepPresetSelected', id)

            };
          }
        })

        const selectedPresets = computed(() => {
          if (state.scrollMode === 'glide') return state.glidePresets;
          if (state.scrollMode === 'step') return state.stepPresets;
        })

        // TODO: give these computed refs their own composable

        if (e.key === 'ArrowLeft') {
          
          
        }
      }
    })




    // Send current scrolling status when popup opens
    onMessage('getScrollingStatus', () => {
      console.dir('request recieved. scrollingStatus:', scrollingStatus);
      return structuredClone(toRaw(scrollingStatus));;
    })

    // watch for when scrolling is activated/de-activated
    watch(
      () => scrollingStatus.scrolling,
      (scrolling) => {
        console.log('messaged scrolling status:', scrollingStatus.scrolling)
        console.log('scrolling active:', scrollingActive.value)
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

    // Record mouse target
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

    // Listen for when page is hidden
    useEventListener(document, 'visibilitychange', () => {
      if (document.hidden) {
        stopScroll();
        updateScrollingStatus(false);
      }
    })



  },
});
