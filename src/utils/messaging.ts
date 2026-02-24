import { defineExtensionMessaging } from '@webext-core/messaging'
import type { Settings, PopupSettings, ContentSettings } from '@/types/settings'

export interface Protocol {
    getPopupSettings(): PopupSettings;
    getContentSettings(): ContentSettings;
    updateSetting(data: {
        key: keyof Settings
        value: any
    }): void;
    settingUpdated(data: {
        target: 'popup' | 'content'
        setting: object
    }): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<Protocol>();