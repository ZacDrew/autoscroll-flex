import { Settings } from "@/types/settings";

export async function updatePartnerTab(
    settings: Settings,
    windowId: number, 
    detachedWindowId: number | null
) {

    const [tab] = await browser.tabs.query({
        active: true,
        windowId,
    });

    console.log('Active tab changed:', tab.url, tab)
    console.log('Window changed:', windowId)

    if (windowId === detachedWindowId ||
        windowId === browser.windows.WINDOW_ID_NONE ||
        !tab
    ) {
        return
    }

    settings['partnerTab'] = tab;
    await storage.setItem('local:settings', settings);

    // send to popup/detachable
    sendMessage('settingUpdated',
        { key: 'partnerTab', value: tab, originalSource: 'background' }
    ).catch(() => { });

    // send partnertab to newly active tab
    sendMessage(
        'settingUpdated',
        { key: 'partnerTab', value: tab, originalSource: 'background' },
        tab.id
    ).catch(() => {
        console.log('partner tab update not getting through to tab');
    });
}