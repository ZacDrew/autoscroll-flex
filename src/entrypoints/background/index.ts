import { storage } from '#imports';
import type { Settings, SettingTarget } from "@/types/settings";
import { defaultSettings, settingTargets } from '@/utils/settings-creation';
import { sendMessage, onMessage } from '@/utils/messaging';
import { filterSettings } from '@/utils/filter-settings';


export default defineBackground({
  type: 'module',
  main() {
    console.log('Hello background!', { id: browser.runtime.id });
    console.log('browser:', import.meta.env.BROWSER);

    const isFirefox = import.meta.env.BROWSER === 'firefox';

    let settings: Settings;

    // Set stored settings as defaults if not yet set
    (async () => {
      const stored = (await storage.getItem<Settings>('local:settings')) || {};
      settings = structuredClone({ ...defaultSettings, ...stored });
      await storage.setItem('local:settings', settings);
    })();

    onMessage('getSettings', (message) => {
      return filterSettings(settings, message.data);
    });

    // update individual setting change
    onMessage(
      'updateSetting',
      async <K extends keyof Settings>(message: {
        data: { key: K; value: Settings[K]; source: SettingTarget };
      }) => {
        const { key, value, source } = message.data;
        settings[key] = value;

        await storage.setItem('local:settings', settings);
        console.dir('update stored: ', await storage.getItem<Settings>(`local:settings`));

        // TODO fix: only send settings to contexts share it
        // Broadcast setting change to contexts that share the setting
        // for Popup and Options:
        sendMessage('settingUpdated', { key, value, originalSource: source });

        // for content scripts:
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

    })

    // Send currently active tab to a context
    onMessage('getActiveTab', async () => {
      let [activeTab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      return { activeTab };
    })



    // Popout Popup
    let popupWindowId: number | null = null;

    onMessage('openwindow', async () => {
      if (popupWindowId) {
        // Focus existing window
        await browser.windows.update(popupWindowId, { focused: true });
        return;
      }

      const win = await browser.windows.create({
        url: browser.runtime.getURL("/detached.html"),
        type: "popup",
        width: 310, // 14px wider than popup
        height: 638, // 38px longer than popup
        left: 1800,
        top: 470,
      });
      console.log("Created window:", win);

      if (win) {
        popupWindowId = win.id ?? null;
      } else {
        popupWindowId = null;
        console.error("Failed to create popup window");
      }

      browser.windows.onRemoved.addListener((id) => {
        if (id === popupWindowId) popupWindowId = null;
      });

      // TODO!!!: Remove this so it doesnt move the window off someones screen
      if (isFirefox) {
        await browser.windows.update(popupWindowId as number, {
          left: 2735,
          top: 800,
        });
      }
    });


  }

});