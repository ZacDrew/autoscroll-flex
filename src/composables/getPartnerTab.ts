import { Context } from '@/types/settings';
import { onMessage, sendMessage } from '@/utils/messaging'
import { useSettings } from '@/composables/useSettings';

export async function getPartnerTab(context: Context) {

const { state, update, stateReady } = useSettings(context);

    await stateReady;

    const partnerTab = computed(() => {
        return state.partnerTab
    });

    return partnerTab;
}