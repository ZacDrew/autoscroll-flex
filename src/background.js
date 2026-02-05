import * as C from './constants/storage.js';

browser.runtime.onInstalled.addListener(async () => {

    const existing = await browser.storage.local.get(
        Object.values(C.STORAGE_KEY)
    );

    const defaultsToSet = {};

    for (const [keyName, storageKey] of Object.entries(C.STORAGE_KEY)) {
        if (existing[storageKey] === undefined) {
            defaultsToSet[storageKey] = C.DEFAULT[keyName];
        }
    }

    if (Object.keys(defaultsToSet).length) {
        await browser.storage.local.set(defaultsToSet);
    }
})