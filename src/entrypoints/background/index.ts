import { storage } from '#imports';
import { type Settings, defaultSettings } from "@/types/settings";

export default defineBackground({
  type: 'module', 
  main() {
    console.log('Hello background!', { id: browser.runtime.id });

    // Set stored settings as defaults if not yet set

    (async () => {
      const stored = (await storage.getItem<Settings>('local:settings')) || {};
      const merged: Settings = structuredClone({ ...defaultSettings, ...stored});
      await storage.setItem('local:settings', merged);
    })();

    

  }
  
});
