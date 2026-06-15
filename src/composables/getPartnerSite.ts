import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings'
import { getPartnerTab } from '@/composables/getPartnerTab';

const { state, update, stateReady } = useSettings('popup');

export async function getPartnerSite() {

    const partnerTab = await getPartnerTab();

    const partnerSite = computed(() => {

        if (!partnerTab.value?.url) {
            return { key: '', href: '' };
            // throw new Error('Partner tab not found');
        }

        const url = new URL(partnerTab.value.url!)
        const href = url.href
        let key = '';

        // local files
        if (url.protocol === 'file:') key = 'file://';

        if (url.protocol === 'moz-extension:') key = 'moz-extension://';

        if (url.protocol === 'about:') key = 'about:';

        // standard URLs
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            key = url.hostname;
        }

        return { key, href }
    })

    return partnerSite;
}