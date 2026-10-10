import { storage } from '#imports';
import type { Settings, Context } from "@/types/settings";
import { defaultSettings, settingTargets } from '@/utils/settings-creation';
import { sendMessage, onMessage } from '@/utils/messaging';
import { filterSettings } from '@/utils/filter-settings';
import { sendContentSetting } from '@/utils/send-content-setting';


export default defineBackground({
  type: 'module',
  main() {
    console.log('Hello background!', { id: browser.runtime.id });
    console.log('browser:', import.meta.env.BROWSER);

    const isFirefox = import.meta.env.BROWSER === 'firefox';

    let settings: Settings;

    (async () => {
      // Set stored settings as defaults if not yet set
      const stored = (await storage.getItem<Settings>('local:settings')) || {};
      settings = structuredClone({ ...defaultSettings, ...stored });
      await storage.setItem('local:settings', settings);
    })();
    
    // If just updated, migrate disabled sites list to new location in storage
    browser.runtime.onInstalled.addListener(async (details) => {
      if (details.reason === 'update' && details.previousVersion === '0.1.1') {

        console.log(`updating from version: ${details.previousVersion}`)
        
        const previousDisabledSites = await storage.getItem<Array<string>>('local:disabledSites');

        if (previousDisabledSites) {
          settings.disabledSites = previousDisabledSites;
          await storage.setItem('local:settings', settings);
          sendContentSetting('disabledSites', previousDisabledSites, 'content');
        }
      }
    })

    onMessage('getSettings', (message) => {
      return filterSettings(settings, message.data);
    });

    // update individual setting change
    onMessage(
      'updateSetting',
      async <K extends keyof Settings>(message: {
        data: { key: K; value: Settings[K]; source: Context };
      }) => {
        const { key, value, source } = message.data;
        settings[key] = value;

        await storage.setItem('local:settings', settings);
        console.dir('update stored: ', await storage.getItem<Settings>(`local:settings`));

        // TODO fix: only send settings to contexts share the setting
        // Broadcast setting change to contexts that share the setting
        
        // for Popup and Options:
        sendMessage('settingUpdated', { key, value, originalSource: source })
        .catch(() => {});

        // for content scripts:
        sendContentSetting(key, value, source);

      })

    // Send currently active tab to a context
    onMessage('getActiveTab', async () => {
      let [activeTab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      return { activeTab };
    })

    // update partnerTab everytime tab changes
    browser.tabs.onActivated.addListener(async ({ tabId, windowId }) => {
      const tab = await browser.tabs.get(tabId)

      console.log('Active tab changed:', tab.url, tab)
      console.log('Window changed:', windowId)

      if (windowId !== detachedWindowId) {
        // console.log('okay, yay!', windowId, detachedWindowId);

        settings['partnerTab'] = tab;
        await storage.setItem('local:settings', settings);

        // send to popup/detachable
        sendMessage('settingUpdated', 
          { key: 'partnerTab', value: tab, originalSource: 'background' }
        ).catch( () => {});

        // send partnertab to newly active tab
        sendMessage(
          'settingUpdated', 
          { key: 'partnerTab', value: tab, originalSource: 'background' },
          tab.id
        ).catch( () => {
          console.log('partner tab update not getting through to tab');
        });
      }
    })

    // update partner tab object when active tab url changes
    browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (
        // changeInfo.status === 'complete' &&
        changeInfo.url &&
        tab.active &&
        tab.windowId !== detachedWindowId
      ) {
        console.log('Visible tab updated:', tab.url)

        settings['partnerTab'] = tab;
        await storage.setItem('local:settings', settings);

        // send to popup/detachable
        sendMessage('settingUpdated', 
          { key: 'partnerTab', value: tab, originalSource: 'background' }
        ).catch( () => {} );

      }
    })



    // detached Popup
    let detachedWindowId: number | null = null;

    onMessage('openwindow', async () => {
      if (detachedWindowId) {
        // Focus existing window
        await browser.windows.update(detachedWindowId, { focused: true });
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
        detachedWindowId = win.id ?? null;
      } else {
        detachedWindowId = null;
        console.error("Failed to create popup window");
      }

      browser.windows.onRemoved.addListener((id) => {
        if (id === detachedWindowId) detachedWindowId = null;
      });

      // TODO!!!: Remove this so it doesnt move the window off someones screen
      if (isFirefox) {
        await browser.windows.update(detachedWindowId as number, {
          left: 2735,
          top: 800,
        });
      }
    });


  }

});