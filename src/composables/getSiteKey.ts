import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings'
import { getPartnerTab } from '@/composables/getPartnerTab';

let siteKey = '';


export async function getSiteKey() {

    const partnerTab = await getPartnerTab();

    if (!partnerTab?.url) {
        throw new Error('Partner tab not found');
    }

    const url = new URL(partnerTab.url!)

    // local files
    if (url.protocol === 'file:') siteKey = 'file://';

    if (url.protocol === 'moz-extension:') siteKey = 'moz-extension://';

    if (url.protocol === 'about:') siteKey = 'about:';

    // standard URLs
    if (url.protocol === 'http:' || url.protocol === 'https:') {
        siteKey = url.hostname;
    }

    return siteKey;
}