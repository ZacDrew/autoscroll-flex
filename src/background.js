import * as C from './constants/storage.js';

browser.runtime.onInstalled.addListener(async () => {

    // Set default disabled sites if not already set
    const result = await browser.storage.local.get(
        C.STORAGE_KEY.DISABLED_SITES
    );
    if (!result[C.STORAGE_KEY.DISABLED_SITES]) {
        await browser.storage.local.set({ 
            [C.STORAGE_KEY.DISABLED_SITES]: C.DEFAULT.DISABLED_SITES
        });
    }
})