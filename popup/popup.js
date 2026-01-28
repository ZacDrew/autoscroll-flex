document.addEventListener("DOMContentLoaded", init);

async function init() {

    // get currently active tab
    const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true
    });

    const hostname = new URL(tab.url).hostname;

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


        // Master enable/disable button logic
        if (btn.id === 'toggleEnable') {
            
            let scrollingEnabled = btn.dataset.enabled === 'true';
            let { disabledSites = [] } = 
                await browser.storage.local.get('disabledSites');

            if (!tab) return;

            // enable scrolling
            if (!scrollingEnabled) {
                
                // Remove current site from disabled list
                disabledSites = disabledSites.filter(site => site !== hostname);
                await browser.storage.local.set({ disabledSites });

                btn.textContent = 'Disable';
                btn.dataset.enabled = 'true';
            }
            // disable scrolling
            else {
                
                // Add current site to disabled list
                disabledSites.push(hostname);
                await browser.storage.local.set({ disabledSites });

                btn.textContent = 'Enable';
                btn.dataset.enabled = 'false';
            }
        }


        // Scroll Toggle Button logic
        if (btn === scrollToggleBtn) {

            const isRunning = scrollToggleBtn.dataset.running === 'true';

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
                scrollToggleBtn.textContent = 'Stop';
                scrollToggleBtn.dataset.running = 'true';

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
                scrollToggleBtn.textContent = 'Start';
                scrollToggleBtn.dataset.running = 'false';

                console.log('callback: stop scroll')
            }
        }
    });

    syncPopupSettings(hostname);
    syncScrollState(tab, scrollToggleBtn);
}

// Set popup setting values to those in local storage
async function syncPopupSettings(hostname) {
    
    let { distance, 
        delay,
        disabledSites = []   
    } = await browser.storage.local.get([
        'distance',
        'delay',
        'disabledSites'
        ]);

    // set ""/undefined values to 0
    distance = !distance ? 0: distance;
    delay = !delay ? 0: delay;

    // Set UI values
    document.getElementById('distance').value = distance;
    document.getElementById('delay').value = delay;

    if (disabledSites.includes(hostname)) {
        document.getElementById('toggleEnable').textContent = 'Enable';
        document.getElementById('toggleEnable').dataset.enabled = 'false';
    }

    console.log('init: ', { distance, delay});
    
    // if (scrollingEnabled === false) {
    //     document.getElementById('toggleEnable').textContent = 'Enable';
    //     document.getElementById('toggleEnable').dataset.enabled = 'false';
    // }
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

