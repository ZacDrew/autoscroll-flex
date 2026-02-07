import * as C from '../constants/storage.js';
import { TabController } from './TabController.js';
import "../tailwind.css";


document.addEventListener("DOMContentLoaded", () => {
    new PopupController().init();
});





class PopupController {
    constructor() {

        this.store = new SettingsStore();
        this.tab = null;
        this.siteKey = null;

        this.scrollTypeTabs = new ScrollTypeTabs(this.store);
        this.glidePresets = new GlidePresets(this.store, document.querySelector(`#${C.UI_ID.GLIDE_TAB}`));
        this.stepPresets = new StepPresets(this.store, document.querySelector(`#${C.UI_ID.STEP_TAB}`));

        this.form = document.getElementById('popupForm');
        this.scrollToggleBtn = document.getElementById('toggleScroll');

    }

    async init() {
        await this.initTab();

        this.scrollTypeTabs.init();
        this.glidePresets.init();
        this.stepPresets.init();

        this.bindEvents();
        await this.setInitialUIValues();
        await this.syncScrollState();
    }

    async initTab() {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tab) return;

        this.tab = tab;
        // this.hostname = new URL(tab.url).hostname;
        this.siteKey = this.getSiteKey(tab.url);
    }

    bindEvents() {
        this.form.addEventListener('change', e => this.handleFormChange(e));
        document.addEventListener('click', e => this.handleButtonClick(e));
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
                await this.store.toggleSite(this.siteKey, scrollingEnabled);

            this.scrollToggleBtn.disabled = !scrollingEnabled;

            // if site is disabled (via manual link in settings) start button stays disabled
            if (updates.disabledSites.some(site => this.tab.url.includes(site))) {
                this.scrollToggleBtn.disabled = true;
            }

            console.log('disabled sites: ', updates.disabledSites);

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

        // open settings menu
        if (btn === document.getElementById(C.UI_ID.OPEN_SETTINGS)) {
            browser.runtime.openOptionsPage();
        }
    }

    async setInitialUIValues() {
        const {
            scrollType = C.DEFAULT.SCROLL_TYPE,
            speed = C.DEFAULT.SPEED,
            distance = C.DEFAULT.DISTANCE,
            delay = C.DEFAULT.DELAY,
            spaceEnabled = C.DEFAULT.SPACE_ENABLED,
            disabledSites = C.DEFAULT.DISABLED_SITES
        } = await this.store.get();

        // Set UI setting values
        document.getElementById('speed').value = speed;
        document.getElementById('distance').value = distance;
        document.getElementById('delay').value = delay;
        document.getElementById('spaceEnabled').checked = spaceEnabled;

        const url = this.tab.url;
        // disable both start button and domain toggle if matching domain in list
        if (disabledSites.includes(this.siteKey)) {
            document.getElementById('scrollingEnabled').checked = false;
            this.scrollToggleBtn.disabled = true;
        }
        // disable only start button if matching longer link is in list.
        else if (disabledSites.some(site => url.includes(site))) {
            this.scrollToggleBtn.disabled = true;
        }
        console.log('init: ', { speed, distance, delay });
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

    getSiteKey(url) {
        const u = new URL(url);

        // local files
        if (u.protocol === 'file:') return 'file://';

        // standard URLs
        if (u.protocol === 'http:' || u.protocol === 'https:') {
            return u.hostname;
        }

        return null;
    }
}


class ScrollTypeTabs extends TabController {

    async init() {
        this.buttons.forEach(btn =>
            btn.addEventListener('click', () => this.handleTabs(btn))
        );
        await this.loadTab();
    }

    async loadTab() {
        const { scrollType } = await this.store.get();

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
    }

    async handleTabs(btn) {

        // store selected scroll type
        if (btn.dataset.tab === C.UI_ID.GLIDE_TAB) {
            await this.store.set({ [C.STORAGE_KEY.SCROLL_TYPE]: C.SCROLL_TYPE.GLIDE });
        }
        if (btn.dataset.tab === C.UI_ID.STEP_TAB) {
            await this.store.set({ [C.STORAGE_KEY.SCROLL_TYPE]: C.SCROLL_TYPE.STEP });
        }

        this.setActiveTab(btn);
    }
}


class Presets {
    // scrollTab is a div element
    constructor(store, scrollTab) {
        this.store = store;
        this.scrollTab = scrollTab;
        this.rows = this.scrollTab.querySelector(`#${C.UI_ID.PRESET_ROWS}`);
        this.addBtn = this.scrollTab.querySelector(`#${C.UI_ID.ADD_PRESET_ROW}`);
    }

    async init() {
        this.scrollTab.addEventListener('change', e => this.onChange(e));
        this.addBtn.addEventListener('click', () => this.addRow());

        this.rows.addEventListener('click', e => this.handleSelection(e));
        // prevent clicks on text input from selecting Preset
        this.rows.querySelectorAll('.preset-card input').forEach(input => {
            input.addEventListener('click', e => e.stopPropagation());
        });

        await this.loadPresets();
    }

    onChange() {
        throw new Error('onChange() must be implemented by child class');
    }

    handleSelection(e) {
        const card = e.target.closest('.preset-card');
        if (!card) return;

        // delete button
        if (e.target.closest('.delete-preset')) {
            card.remove();
            this.save();
            return;
        }

        // card selection
        document.querySelectorAll('.preset-card')
            .forEach(c => c.classList.remove('selected'));

        card.classList.add('selected');
    }

    addRow() {
        throw new Error('addRow() must be implemented by child class');
    }

    async loadPresets() {
        throw new Error('loadPresets() must be implemented by child class');

    }

    renderRow() {
        throw new Error('renderRow() must be implemented by child class');
    }

    save() {
        throw new Error('save() must be implemented by child class');
    }
}

class GlidePresets extends Presets {

    onChange() {
        
    }

    addRow() {

    }

    async loadPresets() {
        const { [C.STORAGE_KEY.GLIDE_PRESETS]: presets } = await this.store.get();
        presets.forEach(p => this.renderRow(p));
    }

    renderRow() {
    
    }

    save() {
    
    }
}

class StepPresets extends Presets {

    onChange() {
        
    }

    addRow() {

    }

    async loadPresets() {
        const { [C.STORAGE_KEY.STEP_PRESETS]: presets } = await this.store.get();
        presets.forEach(p => this.renderRow(p));
    }

    renderRow() {
    
    }

    save() {
    
    }
}



class SettingsStore {
    async get() {
        return browser.storage.local.get();
    }

    async set(values) {
        return browser.storage.local.set(values);
    }

    async toggleSite(siteKey, scrollingEnabled) {
        let { disabledSites = [] } = await this.get();

        // enable scrolling
        if (scrollingEnabled) {
            // Remove current site from disabled list
            return disabledSites.filter(site => site !== siteKey)
        }
        // disable scrolling
        else {
            return [...new Set([...disabledSites, siteKey])]
        }

    }
}
