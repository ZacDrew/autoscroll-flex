// TODO:
// - update yPos after scrolling manually so that stop starting
//   doesnt jump around the page
// - stop scroll when not in tab (but still scroll when unfocused)

let scrollInterval = null, yPos = 0, distance = 0, delay = 0;

(async function init() {
    // Set initial y Position
    if (typeof window !== 'undefined') {
        yPos = window.scrollY;
    }

    // get setttings stored values
    const stored = await browser.storage.local.get(['distance', 'delay']);
    // set ""/undefined values to 0
    // distance = !stored.distance ? 0: stored.distance;
    // delay = !stored.delay ? 0: stored.delay;
    distance = stored.distance;
    delay = stored.delay;
})();

function startScroll() {
    if (scrollInterval) clearInterval(scrollInterval);

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
}

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.command === 'start') {
        if (scrollInterval) return;
        startScroll();
        return;
    }
    if (msg.command === 'stop') {
        clearInterval(scrollInterval);
        scrollInterval = null;
        return;
    }
    if (msg.command === 'status') {
        sendResponse({ running: !!scrollInterval });
        return true;
    }

});


browser.storage.onChanged.addListener((changes, area) => {
    if (area == 'local' && 
        ('distance' in changes || 'delay' in changes)
    ) {
        distance = changes.distance.newValue;
        delay = changes.delay.newValue;
        console.log('autoscroll settings updated');

        if (scrollInterval) {
            startScroll();
        }
    }
});