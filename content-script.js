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
        this.distance = 0;
        this.delay = 0;
        this.enabled = true;
    }

    start() {
        if (!this.enabled) return;

        this.stop();
        this.yPos = window.scrollY;

        this.interval = setInterval(() => {
            this.yPos += this.distance;
            window.scroll({ top: this.yPos, behavior: 'smooth' });
        }, this.delay * 1000); // convert to millisec
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    toggle() {
        this.interval ? this.stop() : this.start();
    }

    setSettings({ distance, delay }) {
        this.distance = distance;
        this.delay = delay;

        if (this.interval) this.start();
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) this.stop();
    }

    get running() {
        return !!this.interval;
    }
}

const scroller = new AutoScroller();

(async function init() {
    const { distance, delay, disabledSites = [] } =
        await browser.storage.local.get(['distance', 'delay', 'disabledSites']);

    scroller.setSettings({ distance, delay });
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