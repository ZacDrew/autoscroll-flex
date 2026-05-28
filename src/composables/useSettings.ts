import { reactive, watch, toRaw, ref } from 'vue'
import { onMessage, sendMessage } from '@/utils/messaging'
import { SettingTarget, type Settings } from '@/types/settings'
import { defaultSettings } from '@/utils/settings-creation';

const state = reactive<Settings>({} as Settings);
let initialized = false;

// TODO: make init work for background and contentscript, not just popup
// see 'popup' in lines 16 and 26
function init() {
    if (initialized) return;
    initialized = true;

    // Request settings from background
    sendMessage('getSettings', 'popup').then((res) => {
        Object.assign(state, res);
    })

    // Listen for setting change from background
    onMessage('settingUpdated', 
        async <K extends keyof Settings>(message: {
        data: { key: K; value: Settings[K]; source: SettingTarget };
      }) => {
        const { key, value, source } = message.data;
        // if (source !== 'popup') return
        state[key] = value;
    })
}

export function useSettings(source: SettingTarget) {
    init();

    // Send an updated setting to background
    async function update<K extends keyof Settings>(
        key: K,
        value: Settings[K]
    ) {
        state[key] = value;
        await sendMessage('updateSetting', { 
            key, 
            value: structuredClone(toRaw(value)), 
            source 
        });
    }

    return { state, update };
}
    
