import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';
import { getSiteKey } from '@/composables/getSiteKey.js';

const { state, update } = useSettings('popup');
let siteKey = ref<string>('')

// TODO: set up an initialized gate?

export function handleEnabled() {

    // get domain name of partner tab
    onMounted(async () => {
    siteKey.value = await getSiteKey();
    console.log('siteKey:', siteKey.value)
    })

    // computed value to keep track of disabled domains
    let siteEnabled = computed({
    get: () => {
        return !state.disabledSites?.includes(siteKey.value);
    },
    
    set: (enabled) => {
        if (enabled) {
        update(
            'disabledSites', 
            state.disabledSites.filter( storedDomain => storedDomain !== siteKey.value)
        )
        } else {
        update('disabledSites', [...state.disabledSites, siteKey.value])
        }
    }
    });

    return { siteKey, siteEnabled };
}
