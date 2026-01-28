document.addEventListener("DOMContentLoaded", init);

async function init() {

    // get currently active tab
    const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true
    });

    const hostname = new URL(tab.url).hostname;

    const form = document.getElementById('popupForm');
    const scrollToggleBtn = document.getElementById('toggleScroll');

    // settings changes listener
    form.addEventListener('change', async (e) => {
        e.preventDefault();

        const updates = {};

        if (e.target.id === 'distance' || e.target.id === 'delay') {

            let distance = Number(document.getElementById('distance').value); 
            let delay = Number(document.getElementById('delay').value);

            updates.distance = distance;
            updates.delay = delay;
        }

        if (e.target.id === 'scrollingEnable') {

            let scrollingEnabled = e.target.checked === true;
            let { disabledSites = [] } = 
                await browser.storage.local.get('disabledSites');

            if (!tab) return;

            // enable scrolling
            if (scrollingEnabled) {
                
                // Remove current site from disabled list
                disabledSites = disabledSites.filter(site => site !== hostname);

                scrollToggleBtn.disabled = false;
            }
            // disable scrolling
            else {
                
                // Add current site to disabled list
                disabledSites.push(hostname);

                scrollToggleBtn.disabled = true;
            }
            updates.disabledSites = disabledSites;
        }

        await browser.storage.local.set(updates);
        syncScrollState();

        console.log('change:', updates);
    });

    

    // Button listener
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;


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

    syncPopupSettings();
    syncScrollState();





    // Set popup setting values to those in local storage
    async function syncPopupSettings() {
        
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
            
            document.getElementById('scrollingEnable').checked = false;
            scrollToggleBtn.disabled = true;
        }

        console.log('init: ', { distance, delay});
    }

    // Sync popup scroll toggle button to autoscroll state
    async function syncScrollState() {

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

            console.log('callback: request scroll status', status.running)

        } catch {
            scrollToggleBtn.textContent = 'Start';
            scrollToggleBtn.dataset.running = 'false';
        }
    }
}



