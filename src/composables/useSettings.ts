import { reactive, watch } from 'vue'
import { onMessage, sendMessage } from '@/utils/messaging'
import { type Settings, defaultSettings } from '@/types/settings'

export function useSettings() {
    const state = reactive<Settings>({} as Settings);

    // request settings from background
    sendMessage('getPopupSettings').then((res) => {
        Object.assign(state, res);
    })

    async function update<K extends keyof Settings>(
        key: K,
        value: Settings[K]
    ) {
        state[key] = value;
        await sendMessage('updateSetting', { key, value });
    }

    return { state, update };
}