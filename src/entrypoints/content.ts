import { ref } from 'vue'
import { useSettings } from '@/composables/useSettings';
import { useEventListener, useIntervalFn, useRafFn } from '@vueuse/core';
import { handleScrollingStatus } from '@/composables/handleScrollingStatus';
import { onMessage, sendMessage } from '@/utils/messaging'
import { findScrollTarget } from '@/utils/content/find-scroll-target';
import { handleEnabled } from '@/composables/handleEnabled.js';
import { handleCurrentPreset } from '@/composables/handleCurrentPreset';


export default defineContentScript({
  matches: ['<all_urls>', 'file:///*'],

  main(ctx) {


    const { state, update } = useSettings('content');
    const { scrollingStatus, updateScrollingStatus } = handleScrollingStatus('content');
    const { siteEnabled } = handleEnabled();

    let sendToIframe: ((data: any) => void) | null = null;

    // Toast iframe
    const ui = createIframeUi(ctx, {
      page: '/toast.html',
      position: 'inline',
      anchor: 'body',

      onMount(wrapper, iframe) {
        iframe.style.pointerEvents = 'none'
        iframe.style.position = 'fixed'
        iframe.style.top = '0'
        iframe.style.right = '0'
        iframe.style.width = '250px'
        iframe.style.height = '100px'
        iframe.style.zIndex = '999999'
        iframe.style.background = 'transparent'
        iframe.style.backgroundColor = 'transparent'
        iframe.style.border = 'none'
      },
    })
    ui.mount();
    
    
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
        console.log('siteEnabled:', siteEnabled.value);

        console.dir('partnerTab url:', state.partnerTab?.url)
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

    const { selectedPresetId, presets } = handleCurrentPreset('content');


    let ffDirection = 'down';

    function fastForwardScroller(
      startScroll: () => void, 
      stopScroll: () => void) 
      {

      let direction = 1

      const { pause, resume, isActive } = useRafFn(({ delta }) => {

        if (!scrollTarget) {
          console.log('no scrollTarget');
          return;
        };

        ffDirection === 'down' ? direction = 1 : direction = -1;

        yPos += direction * state.ffSpeed * (delta / 1000);

        scrollTarget.scrollTop = yPos;
      },
        { immediate: false }
      )

      function startFastForward(direction: string,) {

        stopScroll();

        ffDirection = direction;
        scrollTarget = findScrollTarget(mouseTarget);
        yPos = scrollTarget?.scrollTop ?? 0;

        resume();
      }

      function stopFastForward() {
        pause();
        startScroll();
      }

      return { startFastForward, stopFastForward, fastForwardIsActive: isActive }
    }

    const { startFastForward, stopFastForward } = fastForwardScroller(
      startScroll,
      stopScroll
    )



    let directionHeld = false;
    let holdTimer: number | null = null

    // Listen for static hotkeys
    useEventListener(window, 'keydown', (e) => {
      if (!siteEnabled.value || !state.staticHotkeysEnabled) return;

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
      if (e.code === 'Space' && state.spaceEnabled && !directionHeld) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        toggleScroll();
      }

      // left/right arrows
      if (scrollingStatus.scrolling && state.lrEnabled) {

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (!presets.value) return;
        const selectedPresetIndex = presets.value.findIndex(
          preset => preset.id === selectedPresetId.value
        );
        const numOfPresests = presets.value.length;

        // left arrow key
        if (e.key === 'ArrowLeft') {

          if (selectedPresetIndex > 0) {
            selectedPresetId.value = presets.value[selectedPresetIndex - 1].id
          }
          else {
            selectedPresetId.value = presets.value[numOfPresests - 1].id
          }
        }
        // right arrow key
        if (e.key === 'ArrowRight') {

          if (selectedPresetIndex < numOfPresests -1) {
            selectedPresetId.value = presets.value[selectedPresetIndex + 1].id
          }
          else {
            selectedPresetId.value = presets.value[0].id
          }
        }
      }

      // up/down arrows (fastforward)
      if (scrollingStatus.scrolling && state.ffEnabled) {
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')
          return

        const direction = e.key === 'ArrowUp' ? 'up' : 'down'

        if (e.repeat) return;

        directionHeld = false;

        holdTimer = window.setTimeout(() => {
          directionHeld = true;
          console.log('held:', direction);
          startFastForward(direction);
        }, 200)
      }

    })

    
    useEventListener(window, 'keyup', (e) => {
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
      
      if (scrollingStatus.scrolling) {

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // up/down arrow keys (change direction)
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')
          return

        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }

        if (!directionHeld && state.udEnabled) {
          const direction = e.key === 'ArrowUp' ? 'up' : 'down';
          update('direction', direction);
        }

        if (directionHeld && state.ffEnabled) {
          stopFastForward();
        }

        directionHeld = false
      }
    })


    useEventListener(window, 'mousedown', (e) => {
      if (!siteEnabled.value || !state.staticHotkeysEnabled) return;

      // Ignore middle-clicks on links and buttons
      const target = e.target as Element | null;
      if (target?.closest('a, button')) return;

      // middle click
      if (e.button === 1 ) {
        if (state.middleClickHijack && !directionHeld) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          toggleScroll();
        }
      }
    })

    // manual scroll detection.
    let scrollTimeout: number | undefined
    useEventListener(window, 'wheel', () => {

      if (scrollingStatus.scrolling) {
        clearTimeout(scrollTimeout)
        stopScroll();
        
        scrollTimeout = window.setTimeout(() => {
          startScroll();
        }, 100)
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
          console.log('before startScroll()');
          startScroll();
          console.log('after startScroll()');
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
