import { defineExtensionMessaging } from '@webext-core/messaging'
import type { Settings, SettingTarget } from '@/types/settings'

export interface Protocol {
    getSettings(data: SettingTarget): Partial<Settings>;

    updateSetting<K extends keyof Settings>(data: {
        key: K
        value: Settings[K]
        source: SettingTarget
    }): void;

    settingUpdated<K extends keyof Settings>(data: {
        key: K
        value: Settings[K]
        originalSource: SettingTarget
    }): void;
    
    getScrollingStatus(): { scrolling: boolean };

    sendScrollingStatus(data: {
        scrolling: boolean
    }): void;

    getActiveTab(): { activeTab: globalThis.Browser.tabs.Tab };

    openwindow(): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<Protocol>();