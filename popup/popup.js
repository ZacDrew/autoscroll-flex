document.addEventListener("DOMContentLoaded", init);

async function init() {

    const [activeTab] = await browser.tabs.query({
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
    const scrollToggleBtn = document.getElementById('toggleScroll');

    // Button listener
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;


        // Enable/disable button logic
        if (btn.id === 'toggleEnable') {
            
            let scrollingEnabled = btn.dataset.enabled === 'true';

            if (!activeTab) return;

            if (!scrollingEnabled) {
                // enable scrolling
                scrollingEnabled = true;
                await browser.storage.local.set({ scrollingEnabled });

                btn.textContent = 'Disable';
                btn.dataset.enabled = 'true';
            }
            else {
                // disable scrolling
                scrollingEnabled = false;
                await browser.storage.local.set({ scrollingEnabled });

                btn.textContent = 'Enable';
                btn.dataset.enabled = 'false';
            }
        }


        // Scroll Toggle Button logic
        if (btn === scrollToggleBtn) {

            const isRunning = scrollToggleBtn.dataset.running === 'true';

            if (!activeTab) return;

            if (!isRunning) {
                // Start scrolling
                browser.tabs.sendMessage(
                    activeTab.id, 
                    {
                        from: 'popup',
                        command: 'start'
                    }
            );
                scrollToggleBtn.textContent = 'Stop';
                scrollToggleBtn.dataset.running = 'true';

                console.log('callback: start scroll')
            }
            else {
                // Stop scrolling
                browser.tabs.sendMessage(
                    activeTab.id, 
                    {
                        from: 'popup',
                        command: 'stop'
                    }
                );
                scrollToggleBtn.textContent = 'Start';
                scrollToggleBtn.dataset.running = 'false';

                console.log('callback: stop scroll')
            }
        }
    });

    syncPopupSettings();
    syncScrollState(activeTab, scrollToggleBtn);
}

// Set popup setting values to those in local storage
async function syncPopupSettings() {
    
    let { distance, 
        delay,
        scrollingEnabled    
    } = await browser.storage.local.get([
        'distance',
        'delay',
        'scrollingEnabled'
        ]);

    // set ""/undefined values to 0
    distance = !distance ? 0: distance;
    delay = !delay ? 0: delay;

    // Set UI values
    document.getElementById('distance').value = distance;
    document.getElementById('delay').value = delay;

    console.log('init: ', { distance, delay});
    

    if (scrollingEnabled === false) {
        document.getElementById('toggleEnable').textContent = 'Enable';
        document.getElementById('toggleEnable').dataset.enabled = 'false';
    }
}

// Sync popup scroll toggle button to autoscroll state
async function syncScrollState(tab, scrollToggleBtn) {

    if (!tab) return;

    try {
        const status = await browser.tabs.sendMessage(
            tab.id,
            {
                from: 'popup',
                command: 'status'
            }
        );

        scrollToggleBtn.textContent = status.running ? 'Stop' : 'Start';
        scrollToggleBtn.dataset.running = status.running ? 'true' : 'false';

        console.log('callback: request scroll status')

    } catch {
        scrollToggleBtn.textContent = 'Start';
        scrollToggleBtn.dataset.running = 'false';
    }
}

