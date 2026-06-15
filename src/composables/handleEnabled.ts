import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';
import { getPartnerSite } from '@/composables/getPartnerSite.js';
import { DisabledReason } from '@/types/settings';

const { state, update, stateReady } = useSettings('popup');

// const siteKey = ref<string>('')
const partnerSite = reactive({ key: '', href: '' })
let initialized = false;

// Watch for when partnerSite updates
async function initPartnerSite() {
    if (initialized) return;
    initialized = true;

    const computedPartnerSite = await getPartnerSite();

    watchEffect(() => {
        // siteKey.value = computedPartnerSite.value.key;
        Object.assign(partnerSite, computedPartnerSite.value);
    });

    // console.log('siteKey:', siteKey.value)
    console.log('partnerSite key:', partnerSite.key)
}


export function handleEnabled() {

    initPartnerSite();

    const disabledCause = computed(() => {

        let reason: DisabledReason = 'none';
        let offendingLink = '';
        const customMatch = state.disabledSites.find(
            site => partnerSite.href.includes(site))
        const standardMatch = state.disabledSites?.includes(partnerSite.key);

        // check for disabled domain
        if (standardMatch) {
            offendingLink = partnerSite.key;
            reason = 'domain';
        }

        // check for disabled custom url
        else if (customMatch) {
            offendingLink = customMatch;
            reason = 'custom';
        }

        // check if mozilla blocks the extension
        else if (
            [
                'addons.mozilla.org',
                'moz-extension://',
                'about:'
            ]
                .includes(partnerSite.key)) {
            offendingLink = partnerSite.key;
            reason = 'mozilla';
        }

        return { reason, offendingLink}
    })

    // computed value to keep track of disabled domains
    let siteEnabled = computed({

        get: () => {
            return disabledCause.value.reason === 'none';
        },

        // set is used for exclusively by the toggle button
        set: (enabled) => {
            console.log('enabled', enabled);
            
            if (enabled) {
                update(
                    'disabledSites',
                    state.disabledSites.filter(storedDomain => storedDomain !== partnerSite.key)
                )
            } else {
                update('disabledSites', [...state.disabledSites, partnerSite.key])
            }
        }
    });


    return { partnerSite, siteEnabled, disabledCause };


}
