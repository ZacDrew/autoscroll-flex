
let scrollInterval = null, yPos = 0, distance = 10, delay = 1000;

// TODO:
// - grab distance and delay from storage to set initial values
// - update yPos after scrolling manually so that stop starting
//   doesnt jump around the page
// - stop scroll when not in tab (but still scroll when unfocused)

if (typeof window !== 'undefined') {
    yPos = window.scrollY;
}

function startScroll() {

    scrollInterval = setInterval(() => {
        yPos += distance;
        window.scroll(
            {
            top: yPos,
            behavior: 'smooth'
            }
        );
    }, delay);
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
    if (area == 'local') {
        if ('distance' in changes) {
            distance = changes.distance.newValue;
            console.log('distance updated');

        }
        if ('delay' in changes) {
            // Fetch and convert from sec to millisec
            delay = changes.delay.newValue * 1000;
            console.log('delay updated');
        }
    }
});