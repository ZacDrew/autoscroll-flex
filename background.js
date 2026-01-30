import { SCROLL_TYPE, STORAGE_KEY, DEFAULT_VAL } from './constants/storage.js';

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.command === 'getConstants') {
        sendResponse({ SCROLL_TYPE, STORAGE_KEY, DEFAULT_VAL });
        return true;
    }
});