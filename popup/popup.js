import * as C from '../constants/storage.js';

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

        // tabs
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
    }

    async init() {
        await this.initTab();
        this.bindEvents();
        await this.syncPopupSettings();
        await this.syncScrollState();
        // this.bindTabs();
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
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', e => this.handleTabs(e))
        });
    }



    // Handles changes to settings in popup
    async handleFormChange(e) {
        const updates = {};

        // grab values from UI
        if (e.target.id === 'speed') {
            updates.speed = Number(e.target.value);
        }

        if (['distance', 'delay'].includes(e.target.id)) {
            updates.distance = Number(distance.value);
            updates.delay = Number(delay.value);
        }

        if (e.target.id === 'spaceEnabled') {
            updates.spaceEnabled = e.target.checked;
        }

        if (e.target.id === 'scrollingEnabled') {
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

    async handleTabs(e) {
        const btn = e.currentTarget;

        // store selected scroll type
        if (btn.dataset.tab === C.UI_ID.GLIDE_TAB) {
            await this.store.set({ [C.STORAGE_KEY.SCROLL_TYPE] : C.SCROLL_TYPE.GLIDE });
        }
        if (btn.dataset.tab === C.UI_ID.STEP_TAB) {
            await this.store.set({ [C.STORAGE_KEY.SCROLL_TYPE] : C.SCROLL_TYPE.STEP });
        }
        
        this.setActiveTab(btn);
    }

    setActiveTab(btn) {
        // Remove active class from all buttons
        this.tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Hide all tab content
        this.tabContents.forEach(tc => (tc.style.display = 'none'));

        // Show content for selected tab
        const tabId = btn.dataset.tab;
        document.getElementById(tabId).style.display = 'block';
    }

    async syncPopupSettings() {
        const {
            scrollType = C.DEFAULT_VAL.SCROLL_TYPE,
            speed = C.DEFAULT_VAL.SPEED, 
            distance = C.DEFAULT_VAL.DISTANCE, 
            delay = C.DEFAULT_VAL.DELAY, 
            spaceEnabled = C.DEFAULT_VAL.SPACE_ENABLED, 
            disabledSites = C.DEFAULT_VAL.DISABLED_SITES 
        } = await this.store.get();

        // Set active scroll tab
        if (scrollType === C.SCROLL_TYPE.GLIDE) {
            this.setActiveTab(document.querySelector(
                '.tab-btn[data-tab="glide-tab"]'
            ));
        }
        else if (scrollType === C.SCROLL_TYPE.STEP) {
            this.setActiveTab(document.querySelector(
                '.tab-btn[data-tab="step-tab"]'
            ));
        }

        // Set UI setting values
        document.getElementById('speed').value = speed;
        document.getElementById('distance').value = distance;
        document.getElementById('delay').value = delay;
        document.getElementById('spaceEnabled').checked = spaceEnabled;

        if (disabledSites.includes(this.hostname)) {
            document.getElementById('scrollingEnabled').checked = false;
            this.scrollToggleBtn.disabled = true;
        }
        console.log('init: ', { speed, distance, delay});
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
        return browser.storage.local.get([
            'scrollType',
            'speed', 
            'distance', 
            'delay',
            'spaceEnabled', 
            'disabledSites'
        ]);
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
