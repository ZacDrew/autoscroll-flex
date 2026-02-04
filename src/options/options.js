import * as C from '../constants/storage.js';
import "../tailwind.css";


document.addEventListener("DOMContentLoaded", () => {
    new SettingsController().init();
});

class SettingsController {
    constructor() {
        this.store = new SettingsStore;

        // this.disabledSitesText = null;
    }

    async init() {
        this.bindEvents();
        this.setInitialUIValues();
    }

    bindEvents() {
        document.addEventListener('change', e => this.handleSettingChange(e));
        browser.storage.onChanged.addListener(
            (changes, area) => this.handleStorageChange(changes, area));
    }

    async handleSettingChange(e) {
        const updates = {};

        if (e.target.id === C.UI_ID.DISABLED_SITES) {
            const disabledSites = e.target.value.split('\n');
            updates[C.UI_ID.DISABLED_SITES] = disabledSites;
        }

        await this.store.set(updates);
        console.log('change: ', updates);
    } 

    handleStorageChange(changes, area) {
        if (area !== 'local') return;

        let values = {};

        if (changes[C.STORAGE_KEY.DISABLED_SITES]) {
            values[C.STORAGE_KEY.DISABLED_SITES] = changes[C.STORAGE_KEY.DISABLED_SITES].newValue;
        }

        this.setUIValues(values);
    }

    async setInitialUIValues() {
        const {
            [C.STORAGE_KEY.DISABLED_SITES]: disabledSites
        } = await this.store.get();

        let values = {};

        // convert site list to string and set textarea
        if (disabledSites) {
            values[C.STORAGE_KEY.DISABLED_SITES] = disabledSites;
        }

        this.setUIValues(values);
    }

    async setUIValues(values = {}) {

        if (C.STORAGE_KEY.DISABLED_SITES in values) {
            const disabledSites = values[C.STORAGE_KEY.DISABLED_SITES];
            const disabledSitesText = disabledSites.join('\n');

            document.getElementById(C.UI_ID.DISABLED_SITES).value = disabledSitesText;
        }
    }
}


class SettingsStore {
    async get() {
        return browser.storage.local.get([
            C.STORAGE_KEY.DISABLED_SITES
        ]);
    }

    async set(values) {
        return browser.storage.local.set(values);
    }

}