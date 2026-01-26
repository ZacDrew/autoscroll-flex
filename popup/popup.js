const form = document.getElementById('popupForm');

form.addEventListener('change', async (e) => {
    e.preventDefault();

    let distance = document.getElementById('distance').value;
    let delay = document.getElementById('delay').value;

    // set empty/undefined values to 0
    distance = !distance ? 0: distance;
    delay = !delay ? 0: delay;

    await browser.storage.local.set({ distance, delay });

    console.log('change: ', { distance, delay});
});

const toggleBtn = document.getElementById('toggleScroll');

toggleBtn.addEventListener('click', async () => {

    const isRunning = toggleBtn.dataset.running === 'true';

    const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true
    });

    if (!tab) return;

    if (!isRunning) {
        // Start scrolling
        await browser.tabs.sendMessage(
            tab.id, 
            {
            from: 'popup',
            command: 'start'
            },
            () => console.log('callback: start scroll')
    );
        toggleBtn.textContent = 'Stop';
        toggleBtn.dataset.running = 'true';
    }
    else {
        // Stop scrolling
        await browser.tabs.sendMessage(
            tab.id, 
            {
            from: 'popup',
            command: 'stop'
            },
            () => console.log('callback: stop scroll')
        );
        toggleBtn.textContent = 'Start';
        toggleBtn.dataset.running = 'false';
    }
});

async function init() {
    let { distance, delay } = await browser.storage.local.get(['distance', 'delay']);

    // set ""/undefined values to 0
    distance = !distance ? 0: distance;
    delay = !delay ? 0: delay;

    // Set UI values
    document.getElementById('distance').value = distance;
    document.getElementById('delay').value = delay;

    console.log('init: ', { distance, delay});
}

init().catch(e => console.log(e));