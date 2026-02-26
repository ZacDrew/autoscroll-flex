import { storage } from '#imports';
import type { Settings} from "@/types/settings";
import { defaultSettings } from '@/utils/settings-creation';
import { sendMessage, onMessage } from '@/utils/messaging';

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

    onMessage('getSettings', () => {
      return settings;
    });

    // update individual setting change
    onMessage(
      'updateSetting',
      async <K extends keyof Settings>(message: {
        data: { key: K; value: Settings[K] };
      }) => {
      const { key, value } = message.data;
      settings[key] = value;

      await storage.setItem('local:settings', settings);
      console.log('update stored: ', await storage.getItem<Settings>(`local:settings`));

      // Broadcast setting change
      sendMessage('settingUpdated', {key, value});
    })



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
        width: 400,
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