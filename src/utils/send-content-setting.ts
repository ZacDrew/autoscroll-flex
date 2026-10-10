import { Context, Settings } from "@/types/settings";
import { sendMessage, onMessage } from '@/utils/messaging';

export async function sendContentSetting<K extends keyof Settings>(
    key: K,
    value: Settings[K],
    source: Context
) {

    const tabs = await browser.tabs.query({});
    const tabsWithIds = tabs.filter((tab) => tab.id != null)
    
    for (const tab of tabsWithIds) {
        if (tab.id == null) continue;
        try {
            await sendMessage(
                'settingUpdated',
                { key, value, originalSource: source },
                tab.id
            );
        } catch (err) {
            // console.log(`Failed to send to tab ${tab.id}`)
        }
    }
}