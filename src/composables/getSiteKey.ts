import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings'
import { getPartnerTab } from '@/composables/getPartnerTab';

const { state, update, stateReady } = useSettings('popup');

export async function getSiteKey() {

    const partnerTab = await getPartnerTab();

    const siteKey = computed(() => {

        if (!partnerTab.value?.url) {
            return '';
            // throw new Error('Partner tab not found');
        }

        const url = new URL(partnerTab.value.url!)

        // local files
        if (url.protocol === 'file:') return 'file://';

        if (url.protocol === 'moz-extension:') return 'moz-extension://';

        if (url.protocol === 'about:') return 'about:';

        // standard URLs
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            return url.hostname;
        }

        return '';
    })

    return siteKey;
}