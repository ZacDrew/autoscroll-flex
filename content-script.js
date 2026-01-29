/* 
TODO:
- add feature to detect a scroll target so it works on more sites
     - detect section mouse is over
     - auto-detect largest section
- add a disable switch in popup/hot key and/or add a website blacklist 
  (for sites with conflicts ie youtube). maybe the blacklist is just for 
  the override hotkeys like spacebar
*/

class AutoScroller {
    constructor() {
        this.interval = null;
        this.yPos = window.scrollY;
        this.speed = 0;
        this.distance = 0;
        this.delay = 0;
        this.enabled = true;
        this.rafId = null;
    }

    start() {
        if (!this.enabled) return;
        // cancel current scroll if already active
        this.stop()

        let lastTime = performance.now();
        this.yPos = window.scrollY;

        const step = (now) => {
            if (!this.enabled) return;

            const deltaTime = (now - lastTime) / 1000;
            lastTime = now;

            this.yPos += this.speed * deltaTime;
            window.scrollTo(0, this.yPos);

            this.rafId = requestAnimationFrame(step);
        };

        this.enabled = true;
        this.rafId = requestAnimationFrame(step);
    }

    stop() {
        if (this.running) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    toggle() {
        this.running ? this.stop() : this.start();
    }

    setSettings({ speed, distance, delay }) {
        this.speed = speed;
        this.distance = distance;
        this.delay = delay;

        if (this.interval) this.start();
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) this.stop();
    }

    get running() {
        return !!this.rafId;
    }
}

const scroller = new AutoScroller();

(async function init() {
    const { speed, distance, delay, disabledSites = [] } =
        await browser.storage.local.get(['speed', 'distance', 'delay', 'disabledSites']);

    scroller.setSettings({ speed, distance, delay });
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

    if (changes.speed) {
        scroller.setSettings({ speed: changes.speed?.newValue ?? scroller.speed })
    }

    if (changes.distance || changes.delay) {
        scroller.setSettings({
            distance: changes.distance?.newValue ?? scroller.distance,
            delay: changes.delay?.newValue ?? scroller.delay
        });
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

    if (e.code === 'Space') {
        e.preventDefault();
        scroller.toggle();
    }
});


// Listen for for when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) scroller.stop();
})