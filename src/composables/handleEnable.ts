import { ref } from 'vue';
import { useSettings } from '@/composables/useSettings'

export function handleEnable() {

    const { state, update } = useSettings('popup');
    let domain = ref('')

    // computed value to keep track of disabled domains
    let domainEnabled = computed({
    get: () => {
        return !state.disabledSites?.includes(domain.value);
    },
    
    set: (enabled) => {
        if (enabled) {
        update(
            'disabledSites', 
            state.disabledSites.filter( storedDomain => storedDomain !== domain.value)
        )
        } else {
        update('disabledSites', [...state.disabledSites, domain.value])
        }
    }
    });

    onMounted(async () => {
    const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
    })

    domain.value = new URL(tab.url!).hostname
    })

}