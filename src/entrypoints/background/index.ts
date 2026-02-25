import { storage } from '#imports';
import { type Settings, type PopupSettings, defaultSettings, popupKeys } from "@/types/settings";
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

    onMessage('getPopupSettings', () => {
      const popupSettings = Object.fromEntries(
        popupKeys.map((key) => [key, settings[key]])
      ) as PopupSettings;

      return popupSettings;
    });

    // onMessage('getContentSettings', () => {
    //     return settings;
    // });

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
    })

  }
  
});