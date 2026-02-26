import { reactive, watch } from 'vue'
import { onMessage, sendMessage } from '@/utils/messaging'
import { type Settings } from '@/types/settings'
import { defaultSettings } from '@/utils/settings-creation';

const state = reactive<Settings>({} as Settings);
let initialized = false;


function init() {
    if (initialized) return;
    initialized = true;

    // Request settings from background
    sendMessage('getSettings').then((res) => {
        Object.assign(state, res);
    })

    // Listen for setting change from background
    onMessage('settingUpdated', 
        async <K extends keyof Settings>(message: {
        data: { key: K; value: Settings[K] };
      }) => {
        const { key, value } = message.data;
        state[key] = value;
    })
}

// Send an updated setting to background
async function update<K extends keyof Settings>(
    key: K,
    value: Settings[K]
) {
    state[key] = value;
    await sendMessage('updateSetting', { key, value });
}

export function useSettings() {
    init();
    return { state, update };
}
    
