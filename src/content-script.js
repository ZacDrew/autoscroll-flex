class GlideScroller {
    constructor(parent) {
        this.parent = parent;
        this.rafId = null;
        this.yPos = window.scrollY;

        this.presets = null;
        this.presetSelected = 0;
        this.speed = 0;
    }

    setPreset(presetSelected, presets) {
        if (!presetSelected && !presets) return;

        this.presetSelected = presetSelected;
        this.presets = presets;
        this.speed = presets[presetSelected].speed;
    }

    start() {
        if (!this.parent.enabled) return;

        this.stop();

        let lastTime = performance.now();
        const target = this.parent.scrollTarget;
        this.yPos = target.scrollTop;

        const step = (now) => {
            if (!this.parent.enabled) return;

            const delta = (now - lastTime) / 1000;
            lastTime = now;

            if (this.parent.direction === 'down') {
                this.yPos += this.speed * delta;
            }
            else if (this.parent.direction === 'up') {
                this.yPos -= this.speed * delta;
            }
            target.scrollTo(0, this.yPos);

            this.rafId = requestAnimationFrame(step);
        };

        this.rafId = requestAnimationFrame(step);
    }

    stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    get running() {
        return !!this.rafId;
    }
}

class StepScroller {
    constructor(parent) {
        this.parent = parent;
        this.intervalId = null;

        this.presets = null;
        this.presetSelected = 0;
        this.distance = 0;
        this.delay = 0;
    }

    setPreset(presetSelected, presets) {
        if (!presetSelected && !presets) return;

        this.presetSelected = presetSelected;
        this.presets = presets;
        this.distance = presets[presetSelected].distance;
        this.delay = presets[presetSelected].delay;
    }

    start() {
        if (!this.parent.enabled) return;
        this.stop();

        // console.log(this.distance, this.delay);

        this.intervalId = setInterval(() => {
            if (!this.parent.enabled) return;
            let signedDistance = this.distance;

            if (this.parent.direction === 'up') {
                signedDistance *= -1;
            }

            this.parent.scrollTarget.scrollBy({
                top: signedDistance,
                behavior: "smooth"
            });
        }, this.delay * 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    get running() {
        return !!this.intervalId;
    }
}



class AutoScroller {
    constructor() {
        this.enabled = true;
        this.scrollType = null;

        this.hijacksEnabled = false;
        this.spaceEnabled = true;
        this.LREnabled = true;
        this.UDEnabled = true;        

        this.glide = new GlideScroller(this);
        this.step = new StepScroller(this);

        this.direction = 'down';

        this.mouseTarget = null;
        this.scrollTarget = null;
    }

    get currentScroller() {
        return this.scrollType === 'glide'
            ? this.glide
            : this.step;
    }

    start() {
        if (!this.enabled) return;

        this.findScrollTarget();
        this.currentScroller.start();
    }

    stop() {
        this.glide.stop();
        this.step.stop();
    }

    toggle() {
        this.running ? this.stop() : this.start();
    }

    setSettings(settings = {}) {

        this.setEnabled(settings.disabledSites);
        const scrolling = this.running;

        for (const [key, value] of Object.entries(settings)) {
            if (key in this) {
                this[key] = value;
            }
            // if (key in this.glide) {
            //     this.glide[key] = value;
            // }
            // if (key in this.step) {
            //     this.step[key] = value;
            // }
        }
        this.glide.setPreset(settings.glidePresetSelected, settings.glidePresets)
        this.step.setPreset(settings.stepPresetSelected, settings.stepPresets)
        if (scrolling) this.start();
    }

    findScrollableParent(el) {
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

    findScrollTarget() {

        if (this.mouseTarget) {
            const target = this.findScrollableParent(this.mouseTarget);
            if (target) this.scrollTarget = target; 
        }
        else {
            this.scrollTarget = document.scrollingElement;
        }
    }

    setEnabled(disabledSites) {
        if (!disabledSites) return;
        const url = location.href;
        this.enabled = true;

        // check if url of current tab is in the list of disabled sites
        for (const site of disabledSites) {
            if (url === site ||
                url.includes(site) ||
                location.hostname === site
            ) {
                this.enabled = false;
                break;
            }
        }
        if (!this.enabled) this.stop();
    }

    get running() {
        return this.currentScroller.running;
    }
}

const scroller = new AutoScroller();

(async function init() {

    const { 
        scrollType = DEFAULT.SCROLL_TYPE,
        glidePresets,
        glidePresetSelected,
        stepPresets,
        stepPresetSelected,  
        distance = DEFAULT.DISTANCE, 
        delay = DEFAULT.DELAY, 
        hijacksEnabled,
        spaceEnabled,
        LREnabled,
        UDEnabled, 
        disabledSites = DEFAULT.DISABLED_SITES
    } = await browser.storage.local.get();
    
    scroller.setSettings({ 
        scrollType, 
        glidePresets, 
        glidePresetSelected,
        stepPresets,
        stepPresetSelected, 
        distance, 
        delay, 
        hijacksEnabled,
        spaceEnabled,
        LREnabled,
        UDEnabled, 
        disabledSites
    });
})();


// Listen for commands from popup
browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (['up', 'down'].includes(msg.direction)) {
        scroller.direction = msg.direction;
    }
    if (msg.command === 'start') scroller.start();
    if (msg.command === 'stop') scroller.stop();
    if (msg.command === 'status') {
        sendResponse({ 
            running: scroller.running, 
            direction: scroller.direction 
        });
        return true;
    }
});


// Listen for changes to the settings and update them
browser.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;

    if (changes.scrollType) {
        scroller.setSettings({ scrollType: changes.scrollType.newValue })
        if (scroller.running) {
            scroller.stop();
            scroller.start();
        }
    }

    if (changes.glidePresetSelected || changes.glidePresets) {
        scroller.setSettings({ 
            glidePresetSelected: changes.glidePresetSelected?.newValue ?? scroller.glide.presetSelected,
            glidePresets: changes.glidePresets?.newValue ?? scroller.glide.presets
        })
        if (scroller.running) scroller.start();
    }

    if (changes.stepPresetSelected || changes.stepPresets) {
        scroller.setSettings({ 
            stepPresetSelected: changes.stepPresetSelected?.newValue ?? scroller.step.presetSelected,
            stepPresets: changes.stepPresets?.newValue ?? scroller.step.presets
        })
        if (scroller.running) scroller.start();
    }

    if (changes[STORAGE_KEY.HIJACKS_ENABLED]) {
        scroller.setSettings({ [STORAGE_KEY.HIJACKS_ENABLED]: changes[STORAGE_KEY.HIJACKS_ENABLED].newValue })
    }

    if (changes.spaceEnabled) {
        scroller.setSettings({ spaceEnabled: changes.spaceEnabled.newValue });
    }

    if (changes[STORAGE_KEY.LR_ENABLED]) {
        scroller.setSettings({ [STORAGE_KEY.LR_ENABLED]: changes[STORAGE_KEY.LR_ENABLED].newValue })
    }

    if (changes[STORAGE_KEY.UD_ENABLED]) {
        scroller.setSettings({ [STORAGE_KEY.UD_ENABLED]: changes[STORAGE_KEY.UD_ENABLED].newValue })
    }

    if (changes.disabledSites) {
        scroller.setEnabled(changes.disabledSites.newValue);
    }
});


// Listen for Override Hotkeys (i.e. spacebar)
document.addEventListener('keydown', e => {
    if (!scroller.enabled || !scroller.hijacksEnabled) return;

    if (
        ['INPUT', 'TEXTAREA'].includes(e.target.tagName) ||
        e.target.isContentEditable
    ) return;

    if (e.code === 'Space' && scroller.spaceEnabled) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        scroller.toggle();
    }

    if (scroller.running && scroller.LREnabled) {
        
        if (e.code === 'ArrowRight') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const currentScroller = scroller.currentScroller;
            const numPresets = currentScroller.presets.length;

            if (currentScroller.presetSelected < numPresets - 1) {
                // currentScroller.presetSelected++;
                currentScroller.setPreset(++currentScroller.presetSelected, currentScroller.presets);
            }
            else {
                currentScroller.presetSelected = 0;
                currentScroller.setPreset(currentScroller.presetSelected, currentScroller.presets);
            }
            savePreset();
        }
        if (e.code === 'ArrowLeft') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const currentScroller = scroller.currentScroller;
            const numPresets = currentScroller.presets.length;

            if (currentScroller.presetSelected > 0) {
                // currentScroller.presetSelected--;
                currentScroller.setPreset(--currentScroller.presetSelected, currentScroller.presets);
            }
            else {
                currentScroller.presetSelected = numPresets - 1;
                currentScroller.setPreset(currentScroller.presetSelected, currentScroller.presets);
            }
            savePreset();
        }
    }

    if (scroller.running && scroller.UDEnabled) {

        if (e.code === 'ArrowUp') {
            scroller.direction = 'up';
            scroller.start();
        }
        if (e.code === 'ArrowDown') {
            scroller.direction = 'down';
            scroller.start();
        }
    }
}, true);

function savePreset() {
    if (scroller.scrollType == SCROLL_TYPE.GLIDE) {
        browser.storage.local.set({ 
            [STORAGE_KEY.GLIDE_PRESET_SELECTED]: 
            scroller.currentScroller.presetSelected 
        });
    }
    else if (scroller.scrollType == SCROLL_TYPE.STEP) {
        browser.storage.local.set({ 
            [STORAGE_KEY.STEP_PRESET_SELECTED]: 
            scroller.currentScroller.presetSelected 
        });
    }
}

// Record mouse target
document.addEventListener('mouseover', e => {
    scroller.mouseTarget = e.target;
}, { passive: true });


// Listen for for when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) scroller.stop();
});