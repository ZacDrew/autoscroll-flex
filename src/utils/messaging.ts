import { defineExtensionMessaging } from '@webext-core/messaging'
import type { Settings } from '@/types/settings'

export interface Protocol {
    getSettings(): Settings;
    updateSetting<K extends keyof Settings>(data: {
        key: K
        value: Settings[K]
    }): void;
    settingUpdated<K extends keyof Settings>(data: {
        key: K
        value: Settings[K]
    }): void;

    openwindow(): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<Protocol>();