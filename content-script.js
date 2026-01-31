/* 
TODO:
- add feature to detect a scroll target so it works on more sites
     - detect section mouse is over
     - auto-detect largest section
- add a disable switch in popup/hot key and/or add a website blacklist 
  (for sites with conflicts ie youtube). maybe the blacklist is just for 
  the override hotkeys like spacebar
*/

async function getConstants() {
    return browser.runtime.sendMessage({ command: 'getConstants' });
}

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
        this.yPos = window.scrollY;

        const step = (now) => {
            if (!this.parent.enabled) return;

            const delta = (now - lastTime) / 1000;
            lastTime = now;

            this.yPos += this.parent.speed * delta;
            window.scrollTo(0, this.yPos);

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

            window.scrollBy({
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
        this.speed = 0;
        this.distance = 0;
        this.delay = 0;
        this.spaceEnabled = false;
        this.enabled = true;

        this.glide = new GlideScroller(this);
        this.step = new StepScroller(this);
    }

    get currentScroller() {
        return this.scrollType === 'glide'
            ? this.glide
            : this.step;
    }

    start() {
        if (!this.enabled) return;
        this.stop();
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

        const scrolling = this.running;

        if (
            'scrollType' in settings &&
            settings.scrollType !== this.scrollType
        ) {
            this.stop();
            this.scrollType = settings.scrollType;
        }

        Object.assign(this, settings);
        if (scrolling) this.start();
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) this.stop();
    }

    get running() {
        return this.currentScroller.running;
    }
}

const scroller = new AutoScroller();

(async function init() {

    const C = await getConstants(); // Import Constants

    const { 
        scrollType = C.DEFAULT_VAL.SCROLL_TYPE,
        speed = C.DEFAULT_VAL.SPEED, 
        distance = C.DEFAULT_VAL.DISTANCE, 
        delay = C.DEFAULT_VAL.DELAY, 
        spaceEnabled = C.DEFAULT_VAL.SPACE_ENABLED, 
        disabledSites = C.DEFAULT_VAL.DISABLED_SITES
    } = await browser.storage.local.get([
            'scrollType',
            'speed', 
            'distance', 
            'delay', 
            'spaceEnabled', 
            'disabledSites'
        ]);
    
    scroller.setSettings({ scrollType, speed, distance, delay, spaceEnabled });
    scroller.setEnabled(!disabledSites.includes(location.hostname));
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

    if (changes.speed) {
        scroller.setSettings({ speed: changes.speed?.newValue ?? scroller.speed })
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
        scroller.setEnabled(
            !changes.disabledSites.newValue.includes(location.hostname)
        );
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


// Listen for for when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) scroller.stop();
})