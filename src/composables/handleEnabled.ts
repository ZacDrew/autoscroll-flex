import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings';
import { getSiteKey } from '@/composables/getSiteKey.js';

const { state, update, stateReady } = useSettings('popup');

const siteKey = ref<string>('')
let initialized = false;

// Watch for when siteKey updates
async function initSiteKey() {
  if (initialized) return;
  initialized = true;

  const computedSiteKey = await getSiteKey();

  watchEffect(() => {
    siteKey.value = computedSiteKey.value;
  });

  console.log('siteKey:', siteKey.value)
}


export function handleEnabled() {

    initSiteKey();

    // computed value to keep track of disabled domains
    let siteEnabled = computed({
    get: () => {
        // if (!siteKey) return false;
        return !state.disabledSites?.includes(siteKey.value);
    },
    
    set: (enabled) => {
        // if (!siteKey) return;
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
