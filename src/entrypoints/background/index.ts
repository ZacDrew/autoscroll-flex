import { storage } from '#imports';
import type { Settings, SettingTarget } from "@/types/settings";
import { defaultSettings, settingTargets } from '@/utils/settings-creation';
import { sendMessage, onMessage } from '@/utils/messaging';
import { filterSettings } from '@/utils/filter-settings';

export default defineBackground({
  type: 'module', 
  main() {
    console.log('Hello background!', { id: browser.runtime.id });

    let settings: Settings;

    // Set stored settings as defaults if not yet set
    (async () => {
      const stored = (await storage.getItem<Settings>('local:settings')) || {};
      settings = structuredClone({ ...defaultSettings, ...stored});
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

      // Broadcast setting change to contexts that share the setting
      const targets = settingTargets[key];
      for (const target of targets) {
        sendMessage('settingUpdated', {key, value});
      }  
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
        url: browser.runtime.getURL("/popup.html"),
        type: "popup",
        width: 296,
        height: 600,
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
    });

  }
  
});