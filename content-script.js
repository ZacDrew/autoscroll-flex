/* 
TODO:
- stop scroll when not in tab (but still scroll when unfocused)
- add feature to detect a scroll target so it works on more sites
     - detect section mouse is over
     - auto-detect largest section
- add a disable switch in popup/hot key and/or add a website blacklist 
  (for sites with conflicts ie youtube). maybe the blacklist is just for 
  the override hotkeys like spacebar
*/

let scrollingEnabled = true; scrollInterval = null, yPos = 0, distance = 0, delay = 0;

(async function init() {
    // Set initial y Position
    if (typeof window !== 'undefined') {
        yPos = window.scrollY;
    }

    // get setttings stored values
    const stored = await browser.storage.local.get(['distance', 'delay', 'disabledSites']);
    distance = stored.distance;
    delay = stored.delay;
    updateScrollingEnabled(stored.disabledSites)
})();

function toggleScroll() {

    if (!scrollInterval) {
        startScroll();
    }
    else {
        stopScroll();
    }
}

function startScroll() {
    if (!scrollingEnabled) return;

    if (scrollInterval) clearInterval(scrollInterval);
    yPos = window.scrollY;

    scrollInterval = setInterval(() => {
        yPos += distance;
        window.scroll(
            {
            top: yPos,
            behavior: 'smooth'
            }
        );
        }, delay * 1000 // convert to millisec
    );
    console.log('Started Autoscroll');

}

function stopScroll() {
    clearInterval(scrollInterval);
    scrollInterval = null;
    console.log('Stopped Autoscroll');
}

function updateScrollingEnabled(disabledSites) {

    hostname = window.location.hostname;
    scrollingEnabled = disabledSites.includes(hostname) ?  false : true;
}

// Listen for commands from popup
browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.command === 'start') {
        if (scrollInterval) return;
        startScroll();
        return;
    }
    if (msg.command === 'stop') {
        stopScroll();
        return;
    }
    if (msg.command === 'status') {
        sendResponse({ running: !!scrollInterval });
        return true;
    }

});

// Listen for changes to the settings and update them
browser.storage.onChanged.addListener((changes, area) => {
    if (area == 'local') {

        if ('distance' in changes || 'delay' in changes) {
            distance = changes.distance.newValue;
            delay = changes.delay.newValue;
            console.log('autoscroll settings updated');

            // if scrolling, update the scroll values
            if (scrollInterval) {
                startScroll();
            }
        }

        if ('disabledSites' in changes) {
            disabledSites = changes.disabledSites.newValue;

            updateScrollingEnabled(disabledSites)

            if (!scrollingEnabled && scrollInterval) {
                stopScroll();
            }
        }
    }
});

// Listen for Override Hotkeys (i.e. spacebar)
document.addEventListener('keydown', (e) => {

    if (!scrollingEnabled) return;

    // ignore inputs related to typing
    const tag = e.target.tagName;
    if (tag === 'INPUT' || 
        tag === 'TEXTAREA' || 
        e.target.isContentEditable
        ) {
        return;
    }

    if (e.code === 'Space') {
        e.preventDefault();
        toggleScroll();
    }
})