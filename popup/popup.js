document.addEventListener("DOMContentLoaded", init);

async function init() {

    const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true
    });

    // settings changes listener
    const form = document.getElementById('popupForm');
    form.addEventListener('change', async (e) => {
        e.preventDefault();

        let distance = Number(document.getElementById('distance').value);
        let delay = Number(document.getElementById('delay').value);

        // set empty/undefined values to 0
        // distance = !distance ? 0: distance;
        // delay = !delay ? 0: delay;

        await browser.storage.local.set({ distance, delay });

        console.log('change: ', { distance, delay});
    });

    // Scroll toggle button listener
    const toggleBtn = document.getElementById('toggleScroll');
    toggleBtn.addEventListener('click', async () => {

        const isRunning = toggleBtn.dataset.running === 'true';

        if (!tab) return;

        if (!isRunning) {
            // Start scrolling
            browser.tabs.sendMessage(
                tab.id, 
                {
                    from: 'popup',
                    command: 'start'
                }
        );
            toggleBtn.textContent = 'Stop';
            toggleBtn.dataset.running = 'true';

            console.log('callback: start scroll')
        }
        else {
            // Stop scrolling
            browser.tabs.sendMessage(
                tab.id, 
                {
                    from: 'popup',
                    command: 'stop'
                }
            );
            toggleBtn.textContent = 'Start';
            toggleBtn.dataset.running = 'false';

            console.log('callback: stop scroll')
        }
    });

    syncPopupSettings();
    syncScrollState(tab, toggleBtn);
}

// Set popup setting values to those in local storage
async function syncPopupSettings() {
    
    let { distance, delay } = await browser.storage.local.get(['distance', 'delay']);

    // set ""/undefined values to 0
    distance = !distance ? 0: distance;
    delay = !delay ? 0: delay;

    // Set UI values
    document.getElementById('distance').value = distance;
    document.getElementById('delay').value = delay;

    console.log('init: ', { distance, delay});
}

// Sync popup scroll toggle button to autoscroll state
async function syncScrollState(tab, toggleBtn) {

    if (!tab) return;

    try {
        const status = await browser.tabs.sendMessage(
            tab.id,
            {
                from: 'popup',
                command: 'status'
            }
        );

        toggleBtn.textContent = status.running ? 'Stop' : 'Start';
        toggleBtn.dataset.running = status.running ? 'true' : 'false';

        console.log('callback: request scroll status')

    } catch {
        toggleBtn.textContent = 'Start';
        toggleBtn.dataset.running = 'false';
    }
}

