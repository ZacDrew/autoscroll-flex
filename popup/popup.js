document.addEventListener("DOMContentLoaded", () => {
    new PopupController().init();
});

class PopupController {
    constructor() {
        this.form = document.getElementById('popupForm');
        this.scrollToggleBtn = document.getElementById('toggleScroll');
        this.store = new SettingsStore();
        this.tab = null;
        this.hostname = null;
    }

    async init() {
        await this.initTab();
        this.bindEvents();
        await this.syncPopupSettings();
        await this.syncScrollState();
    }

    async initTab() {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tab) return;

        this.tab = tab;
        this.hostname = new URL(tab.url).hostname;
    }

    bindEvents() {
        this.form.addEventListener('change', e => this.handleFormChange(e));
        document.addEventListener('click', e => this.handleButtonClick(e));
    }

    // Handles changes to settings in popup
    async handleFormChange(e) {
        const updates = {};

        // grab values from UI
        if (['distance', 'delay'].includes(e.target.id)) {
            updates.distance = Number(distance.value);
            updates.delay = Number(delay.value);
        }

        if (e.target.id === 'scrollingEnable') {
            const scrollingEnabled = e.target.checked;
            updates.disabledSites =
                await this.store.toggleSite(this.hostname, scrollingEnabled);

            this.scrollToggleBtn.disabled = !scrollingEnabled;
        }

        await this.store.set(updates);
        await this.syncScrollState();

        console.log('change:', updates);
    }

    async handleButtonClick(e) {
        const btn = e.target.closest('button');
        if (!btn) return;

        // scroll start/stop button
        if (btn === this.scrollToggleBtn) {
            const running = btn.dataset.running === 'true';
            const command = running ? 'stop' : 'start';

            await browser.tabs.sendMessage(
                this.tab.id,
                { 
                    from: 'popup',
                    command
                }
            );
            btn.textContent = running ? 'Start' : 'Stop';
            btn.dataset.running = String(!running);
        }
    }

    async syncPopupSettings() {
        const { distance = 0, delay = 0, disabledSites = [] } =
            await this.store.get();

        // Set UI values
        document.getElementById('distance').value = distance;
        document.getElementById('delay').value = delay;

        if (disabledSites.includes(this.hostname)) {
            scrollingEnable.checked = false;
            this.scrollToggleBtn.disabled = true;
        }
        console.log('init: ', { distance, delay});
    }

    async syncScrollState() {
        if (!this.tab) return;

        try {
            const { running } = await browser.tabs.sendMessage(this.tab.id, {
                command: 'status'
            });

            this.scrollToggleBtn.textContent = running ? 'Stop' : 'Start';
            this.scrollToggleBtn.dataset.running = String(running);
        } catch {
            this.scrollToggleBtn.textContent = 'Start';
            this.scrollToggleBtn.dataset.running = 'false';
        }
    }
}

class SettingsStore {
    async get() {
        return browser.storage.local.get(['distance', 'delay', 'disabledSites']);
    }

    async set(values) {
        return browser.storage.local.set(values);
    }

    async toggleSite(hostname, scrollingEnabled) {
        let { disabledSites = [] } = await this.get();

        // enable scrolling
        if (scrollingEnabled) {
            // Remove current site from disabled list
            return disabledSites.filter(site => site !== hostname)
        }
        // disable scrolling
        else {
            return [...new Set([...disabledSites, hostname])]
        }
    }
}
