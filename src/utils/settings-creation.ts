import type { Settings } from "@/types/settings";

export const defaultSettings: Settings = {
    test: 0,
    scrolling: false,
    disabledSites: ['www.youtube.com', 'www.twitch.tv'],

    scrollMode: 'glide',

    glidePresets: [{ speed: 100 }, { speed: 200 }, { speed: 500 }],
    stepPresets: [
        { distance: 500, delay: 2 },
        { distance: 700, delay: 2 },
        { distance: 700, delay: 1 }
    ],

    glidePresetSelected: 0,
    stepPresetSelected: 0,

    hijacksEnabled: false,
    spaceEnabled: true,
    lrEnabled: true,
    udEnabled: true,

    presetToastEnabled: true,
};

// export function toPopupSettings(
//   settings: Settings,
//   currentHost: string
// ): PopupSettings {
//   const scrollingEnabled = !settings.disabledSites.includes(currentHost);

//   return {
//     test: settings.test,
//     scrollingEnabled,
//     scrolling: settings.scrolling,

//     scrollMode: settings.scrollMode,

//     glidePresets: settings.glidePresets,
//     stepPresets: settings.stepPresets,

//     glidePresetSelected: settings.glidePresetSelected,
//     stepPresetSelected: settings.stepPresetSelected,

//     hijacksEnabled: settings.hijacksEnabled,
//     spaceEnabled: settings.spaceEnabled,
//     lrEnabled: settings.lrEnabled,
//     udEnabled: settings.udEnabled,
//   };
// }

// export function toContentSettings(
//   settings: Settings,
//   currentHost: string
// ): ContentSettings {
//   const scrollingEnabled = !settings.disabledSites.includes(currentHost);

//   const glide = settings.glidePresets[settings.glidePresetSelected];
//   const step = settings.stepPresets[settings.stepPresetSelected];

//   return {
//     scrollingEnabled,
//     scrolling: settings.scrolling,

//     scrollMode: settings.scrollMode,

//     speed: glide?.speed ?? 0,
//     distance: step?.distance ?? 0,
//     delay: step?.delay ?? 0,

//     presetToastEnabled: settings.presetToastEnabled,
//   };
// }