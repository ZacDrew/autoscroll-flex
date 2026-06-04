import { reactive, watch, toRaw, ref } from 'vue'
import { onMessage, sendMessage } from '@/utils/messaging'
import { SettingTarget, type Settings } from '@/types/settings'
import { defaultSettings } from '@/utils/settings-creation';

const state = reactive<Settings>(structuredClone(defaultSettings));
let initialized = false;

function init(source: SettingTarget) {
    if (initialized) return;
    initialized = true;

    // Request settings from background
    sendMessage('getSettings', source).then((res) => {
        console.log('recieved settings:', res);

        Object.assign(state, res);
    })

    // Listen for setting change from background
    onMessage('settingUpdated', 
        async <K extends keyof Settings>(message: {
        data: { key: K; value: Settings[K]; originalSource: SettingTarget };
      }) => {
        // console.log(source, 'received settingUpdated', message.data);

        const { key, value, originalSource } = message.data;
        state[key] = value;
    })
}

export function useSettings(source: SettingTarget) {
    init(source);

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
    
