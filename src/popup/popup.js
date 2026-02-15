import * as C from '../constants/storage.js';
import { TabController } from './TabController.js';
import "../css/tailwind.css";
import '../css/sakura-vader.css';


document.addEventListener("DOMContentLoaded", () => {
    new PopupController().init();
});


class PopupController {
    constructor() {

        this.store = new SettingsStore();
        this.tab = null;
        this.siteKey = null;

        this.scrollingEnable = new ScrollingEnable(this);

        this.scrollTypeTabs = new ScrollTypeTabs(this.store);
        this.glidePresets = new GlidePresets(this.store, document.querySelector(`#${C.UI_ID.GLIDE_TAB}`));
        this.stepPresets = new StepPresets(this.store, document.querySelector(`#${C.UI_ID.STEP_TAB}`));

        this.options = new Options(this.store);

        this.footerBar = new FooterBar();
    }

    async init() {
        await this.initTab();

        this.scrollingEnable.init();

        this.scrollTypeTabs.init();
        this.glidePresets.init();
        this.stepPresets.init();

        this.options.init();

        this.footerBar.init(this.tab);
    }

    async initTab() {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tab) return;

        this.tab = tab;
        this.siteKey = this.getSiteKey(tab.url);
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

class ScrollingEnable {
    constructor(popupController) {
        this.popupController = popupController

        this.scrollingEnableCard = document.querySelector(`#scrollingEnableCard`);
        this.scrollingEnableToggle = document.querySelector(`#scrollingEnableToggle`);
        this.disabledWarning = document.querySelector(`#disabledWarning`);
        this.urlText = document.querySelector(`#customUrlText`);
    }

    init() {
        this.scrollingEnableToggle.addEventListener('change', () => this.handleScrollingEnable());
        this.setEnableState();
    }

    async handleScrollingEnable() {

        const scrollingEnabled = this.scrollingEnableToggle.checked;
        let disabledSites =
            await this.popupController.store.toggleSite(this.popupController.siteKey, scrollingEnabled);

        this.popupController.footerBar.setScrollBtnsDisabled(!scrollingEnabled);

        // if site is disabled (via manual link in settings) start button is disabled
        this.checkMatchingCustomUrl(disabledSites);

        console.log('disabled sites: ', disabledSites);

        await this.popupController.store.set({ disabledSites });
        await this.popupController.footerBar.syncScrollState();
    }

    async setEnableState() {
        const {
            [C.STORAGE_KEY.DISABLED_SITES]: disabledSites
        } = await this.popupController.store.get();

        const url = this.popupController.tab.url;
        // disable both start button and domain toggle if matching domain in list
        if (disabledSites.includes(this.popupController.siteKey)) {
            this.scrollingEnableToggle.checked = false;
            this.popupController.footerBar.setScrollBtnsDisabled(true);
        }
        // if site is disabled (via manual link in settings) start button is disabled
        this.checkMatchingCustomUrl(disabledSites);
    }

    // if site is disabled (via manual link in settings) start button is disabled
    checkMatchingCustomUrl(disabledSites) {
        // Don't bother if there is already a matching domain
        if (disabledSites.includes(this.popupController.siteKey)) {
            this.disabledWarning.hidden = true;
            return;
        }

        const url = this.popupController.tab.url;
        const matchedSite = disabledSites.find(site => url.includes(site));  

        if (matchedSite) {
            this.popupController.footerBar.setScrollBtnsDisabled(true);
            this.disabledWarning.hidden = false;
            this.urlText.textContent = matchedSite;
        }
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

        this.numRows = 0;
    }

    async init() {
        this.scrollTab.addEventListener('change', e => this.onChange(e));
        this.addBtn.addEventListener('click', () => this.addRow());

        this.rows.addEventListener('click', e => this.handleSelection(e));

        // Grab the template and remove it from the DOM
        this.templateCard = this.rows.querySelector('.preset-card');
        this.rows.removeChild(this.templateCard);

        await this.loadPresets();
    }

    onChange(e) {
        throw new Error('onChange() must be implemented by child class');
    }

    handleSelection(e) {
        const card = e.target.closest('.preset-card');
        if (!card) return;

        // delete button
        if (e.target.closest('.delete-preset')) {

            this.numRows--;
            // grab position of card to be deleted if its selected
            let position = null;
            
            if (card.classList.contains('selected')) {
                position = Number(card.dataset.position);
                if (position === this.numRows) position--;
            }
            card.remove();
            // disables delete button for lone row (must be after the deletion)
            if (this.numRows === 1) {
                position = 0;
                this.rows.querySelector('.delete-preset').disabled = true;
            }

            // relabel card positions in DOM and select new card if needed
            this.rows.querySelectorAll('.preset-card')
                .forEach((c, index) => {
                    c.dataset.position = index
                    if (index === position) {
                        c.classList.add('selected');
                        this.saveSelection(c);
                    }
                });
            
            this.saveValues();
            return;
        }

        // card selection
        this.rows.querySelectorAll('.preset-card')
            .forEach(c => c.classList.remove('selected'));

        card.classList.add('selected');
        this.saveSelection(card);
    }

    saveSelection(card) {
        throw new Error('saveSelection() must be implemented by child class');
    }

    addRow() {
        this.renderRow();
        this.saveValues();
        this.rows.querySelector('.delete-preset').disabled = false;
    }

    async loadPresets() {
        throw new Error('loadPresets() must be implemented by child class');
    }

    // prevent clicks on text input from selecting Preset
    applyInputIndependence(card) {
        card.querySelectorAll('input').forEach(input => {
            input.addEventListener('click', e => e.stopPropagation());
        });
    }

    renderRow(preset = null) {
        // Clone the existing template card
        const card = this.templateCard.cloneNode(true); // deep clone

        // Note position in DOM
        card.dataset.position = String(this.numRows);

        this.setInputValue(card, preset);
        
        this.rows.appendChild(card);
        this.applyInputIndependence(card);
        this.numRows++;
    }

    setInputValue(card, preset) {
        throw new Error('setInputValue() must be implemented by child class');
    }

    saveValues() {
        throw new Error('saveValues() must be implemented by child class');
    }
}

class GlidePresets extends Presets {

    async onChange(e) {
        if (e.target.id !== C.UI_ID.SPEED) return
        this.saveValues();

        const { glidePresets } = await this.store.get('glidePresets');
        console.dir('from storage: ', glidePresets);
    }

    saveSelection(card) {
        const position = Number(card.dataset.position);
        this.store.set({ [C.STORAGE_KEY.GLIDE_PRESET_SELECTED]: position });
    }

    async loadPresets() {
        const { 
            [C.STORAGE_KEY.GLIDE_PRESETS]: presets,
            [C.STORAGE_KEY.GLIDE_PRESET_SELECTED]: position 
        } = await this.store.get();

        presets.forEach(p => this.renderRow(p));

        // Select card
        const cards = this.rows.querySelectorAll('.preset-card');
        cards[position].classList.add('selected');

        if (this.numRows === 1) {
            cards[0].querySelector('.delete-preset').disabled = true;
        }
    }

    setInputValue(card, preset) {
        const speed = preset ? preset[C.STORAGE_KEY.SPEED] : 0;
        card.querySelector(`#${C.UI_ID.SPEED}`).value = speed;
    }

    saveValues() {
        const cards = this.rows.querySelectorAll('.preset-card');
        const presets = [];

        for (const card of cards) {
            const speed = Number(card.querySelector(`#${C.UI_ID.SPEED}`).value);
            presets.push({
                [C.STORAGE_KEY.SPEED]: speed
            });
        }

        this.store.set( { [C.STORAGE_KEY.GLIDE_PRESETS]: presets } );
    }
}

class StepPresets extends Presets {

    async onChange(e) {
        if (e.target.id !== C.UI_ID.DISTANCE && e.target.id !== C.UI_ID.DELAY) {
            return;
        }
        this.saveValues();

        const { stepPresets } = await this.store.get('stepPresets');
        console.dir('from storage: ', stepPresets);
    }

    saveSelection(card) {
        const position = Number(card.dataset.position);
        this.store.set({ [C.STORAGE_KEY.STEP_PRESET_SELECTED]: position });
    }

    async loadPresets() {
        const { 
            [C.STORAGE_KEY.STEP_PRESETS]: presets,
            [C.STORAGE_KEY.STEP_PRESET_SELECTED]: position 
        } = await this.store.get(); //refactor this line to be part of store class and make loadPresets() a parent method?

        presets.forEach(p => this.renderRow(p));

        // Select card
        const cards = this.rows.querySelectorAll('.preset-card');
        cards[position].classList.add('selected');

        if (this.numRows === 1) {
            cards[0].querySelector('.delete-preset').disabled = true;
        }
    }

    setInputValue(card, preset) {
        const distance = preset ? preset[C.STORAGE_KEY.DISTANCE] : 0;
        const delay = preset ? preset[C.STORAGE_KEY.DELAY] : C.DEFAULT.DELAY;

        card.querySelector(`#${C.UI_ID.DISTANCE}`).value = distance;
        card.querySelector(`#${C.UI_ID.DELAY}`).value = delay;
    }

    saveValues() {
        const cards = this.rows.querySelectorAll('.preset-card');
        const presets = [];

        for (const card of cards) {
            const distance = Number(card.querySelector(`#${C.UI_ID.DISTANCE}`).value);
            const delay = Number(card.querySelector(`#${C.UI_ID.DELAY}`).value);
            presets.push({
                [C.STORAGE_KEY.DISTANCE]: distance,
                [C.STORAGE_KEY.DELAY]: delay,
            });
        }

        this.store.set( { [C.STORAGE_KEY.STEP_PRESETS]: presets } );
    }
}

class Options {
    constructor(store) {
        this.store = store;
        this.options = document.querySelector(`.${C.UI_ID.OPTIONS}`);
        this.hijacks = this.options.querySelector(`.${C.UI_ID.HIJACKS}`)
    }

    init() {
        this.options.addEventListener('change', e => this.onChange(e));
        this.loadOptions();
    }

    async onChange(e) {

        if (e.target.id === C.UI_ID.HIJACKS_ENABLED) {
            await this.store.set({ [C.STORAGE_KEY.HIJACKS_ENABLED]: e.target.checked });
            this.setHijackTogglesDisabled(!e.target.checked);
        }
        if (e.target.id === C.UI_ID.SPACE_ENABLED) {
            await this.store.set({ [C.STORAGE_KEY.SPACE_ENABLED]: e.target.checked });
        }
        if (e.target.id === C.UI_ID.LR_ENABLED) {
            await this.store.set({ [C.STORAGE_KEY.LR_ENABLED]: e.target.checked });
        }
        if (e.target.id === C.UI_ID.UD_ENABLED) {
            await this.store.set({ [C.STORAGE_KEY.UD_ENABLED]: e.target.checked });
        }
    }

    async loadOptions() {
        const {
            [C.STORAGE_KEY.HIJACKS_ENABLED]: hijacksEnabled,
            [C.STORAGE_KEY.SPACE_ENABLED]: spaceEnabled,
            [C.STORAGE_KEY.LR_ENABLED]: LREnabled,
            [C.STORAGE_KEY.UD_ENABLED]: UDEnabled
        } = await this.store.get();

        this.hijacks.querySelector(`#${C.UI_ID.SPACE_ENABLED}`).checked = spaceEnabled;
        this.hijacks.querySelector(`#${C.UI_ID.LR_ENABLED}`).checked = LREnabled;
        this.hijacks.querySelector(`#${C.UI_ID.UD_ENABLED}`).checked = UDEnabled;

        if (!hijacksEnabled) {
            this.options.querySelector(`#${C.UI_ID.HIJACKS_ENABLED}`).checked = false;
            this.setHijackTogglesDisabled(true);
        }
    }

    setHijackTogglesDisabled(disabled) {
        this.hijacks.querySelectorAll(`.toggle-row`).forEach(t => {
            t.querySelector('input').disabled = disabled;
        })
    }
}

class FooterBar {
    constructor() {
        this.tab = null;

        this.footer = document.querySelector('footer');
        this.scrollBtns = this.footer.querySelector(`.scroll-buttons`);
        this.scrollUpBtn = this.footer.querySelector(`#scrollUp`);
        this.scrollDownBtn = this.footer.querySelector(`#scrollDown`);
        this.settingsBtn = this.footer.querySelector(`#openSettings`);
    }

    init(tab) {
        this.tab = tab;
        this.scrollBtns.addEventListener('click', e => this.handleScroll(e));
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.syncScrollState();
    }

    async handleScroll(e) {
        const btn = e.target.closest('button');
        if (btn !== this.scrollUpBtn && btn !== this.scrollDownBtn) return;
        
        const scrolling = btn.dataset.active === 'true';
        const command = scrolling ? 'stop' : 'start';
        const direction = btn === this.scrollUpBtn ? 'up' : 'down';

        await browser.tabs.sendMessage(this.tab.id, 
            {
                from: 'popup',
                command,
                direction
            }
        );

        // Set clicked button to active exclusively
        this.scrollUpBtn.dataset.active = false;
        this.scrollDownBtn.dataset.active = false;
        btn.dataset.active = String(!scrolling);
    }

    async syncScrollState() {
        if (!this.tab) return;

        try {
            const { running, direction } = await browser.tabs.sendMessage(this.tab.id, {
                command: 'status'
            });

            if (!running) {
                this.scrollUpBtn.dataset.active = 'false';
                this.scrollDownBtn.dataset.active = 'false';
                return;
            }
            if (direction === 'up') this.scrollUpBtn.dataset.active = 'true';
            if (direction === 'down') this.scrollDownBtn.dataset.active = 'true';
        } catch {
        }
    }

    setScrollBtnsDisabled(disabled) {
        this.scrollUpBtn.disabled = disabled;
        this.scrollDownBtn.disabled = disabled;
    }

    openSettings() {
        browser.runtime.openOptionsPage();
    }
}


class SettingsStore {
    async get(settings) {
        return browser.storage.local.get(settings);
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
