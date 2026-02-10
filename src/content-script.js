
class GlideScroller {
    constructor(parent) {
        this.parent = parent;
        this.rafId = null;
        this.yPos = window.scrollY;
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

            this.yPos += this.parent.speed * delta;
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
    }

    start() {
        if (!this.parent.enabled || !this.parent.delay) return;

        this.stop();

        this.intervalId = setInterval(() => {
            if (!this.parent.enabled) return;

            this.parent.scrollTarget.scrollBy({
                top: this.parent.distance,
                behavior: "smooth"
            });
        }, this.parent.delay * 1000);
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
        this.scrollType = null;

        this.glidePresets = null;
        this.stepPresets = null;

        this.glidePresetSelected = 0;
        this.stepPresetSelected = 0;

        this.speed = 0;
        this.distance = 0;
        this.delay = 0;

        this.spaceEnabled = false;
        this.enabled = true;

        this.glide = new GlideScroller(this);
        this.step = new StepScroller(this);

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
        this.stop();

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
        }
        this.setGlideSettings(settings.glidePresetSelected, settings.glidePresets)
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

    setGlideSettings(glidePresetSelected, glidePresets) {
        if (!glidePresetSelected && !glidePresets) return;
        
        this.glidePresetSelected = glidePresetSelected;
        this.glidePresets = glidePresets;
        this.speed = glidePresets[glidePresetSelected].speed;
    }

    setEnabled(disabledSites = []) {
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
        distance = DEFAULT.DISTANCE, 
        delay = DEFAULT.DELAY, 
        spaceEnabled = DEFAULT.SPACE_ENABLED, 
        disabledSites = DEFAULT.DISABLED_SITES
    } = await browser.storage.local.get();
    
    scroller.setSettings({ 
        scrollType, 
        glidePresets, 
        glidePresetSelected,
        distance, 
        delay, 
        spaceEnabled,
        disabledSites
    });
})();


// Listen for commands from popup
browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.command === 'start') scroller.start();
    if (msg.command === 'stop') scroller.stop();
    if (msg.command === 'status') {
        sendResponse({ running: scroller.running });
        return true;
    }
});


// Listen for changes to the settings and update them
browser.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;

    if (changes.scrollType) {
        scroller.setSettings({ scrollType: changes.scrollType.newValue })
        if (scroller.running) scroller.start();
    }

    if (changes.glidePresetSelected || changes.glidePresets) {
        scroller.setSettings({ 
            glidePresetSelected: changes.glidePresetSelected?.newValue ?? scroller.glidePresetSelected,
            glidePresets: changes.glidePresets?.newValue ?? scroller.glidePresets
        })
        if (scroller.running) scroller.start();
    }

    if (changes.distance || changes.delay) {
        scroller.setSettings({
            distance: changes.distance?.newValue ?? scroller.distance,
            delay: changes.delay?.newValue ?? scroller.delay
        });
        if (scroller.running) scroller.start();
    }

    if (changes.spaceEnabled) {
        scroller.setSettings({ spaceEnabled: changes.spaceEnabled.newValue });
        console.log('space enabled: ', scroller.spaceEnabled);
    }

    if (changes.disabledSites) {
        scroller.setEnabled(changes.disabledSites.newValue);
    }
});


// Listen for Override Hotkeys (i.e. spacebar)
document.addEventListener('keydown', e => {
    if (!scroller.enabled) return;

    if (
        ['INPUT', 'TEXTAREA'].includes(e.target.tagName) ||
        e.target.isContentEditable
    ) return;

    if (e.code === 'Space' && scroller.spaceEnabled) {
        e.preventDefault();
        scroller.toggle();
    }
});

// Record mouse target
document.addEventListener('mouseover', e => {
    scroller.mouseTarget = e.target;
}, { passive: true });


// Listen for for when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) scroller.stop();
});