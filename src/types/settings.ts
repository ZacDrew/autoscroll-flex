export type ScrollMode = 'glide' | 'step' | 'smart'

export interface GlidePreset {
  id: string;
  speed: number;
}

export interface StepPreset {
  id: string;
  distance: number;
  delay: number;
}

// Settings stored by the background
export interface Settings {
  test: number;
  scrolling: boolean;                     // To be removed
  direction: 'up' | 'down' | undefined;
  disabledSites: string[];
  activeTab: globalThis.Browser.tabs.Tab | undefined;

  scrollMode: ScrollMode;

  glidePresets: GlidePreset[];
  stepPresets: StepPreset[];

  glidePresetSelected: string;
  stepPresetSelected: string;

  hijacksEnabled: boolean;
  spaceEnabled: boolean;
  lrEnabled: boolean;
  udEnabled: boolean;

  controlsHidden: boolean;

  presetToastEnabled: boolean;
}

// export type PartnerTab = globalThis.Browser.tabs.Tab | undefined;

export type SettingTarget = 'popup' | 'content' | 'options';

// // Settings sent to the popup
// export interface PopupSettings {
//   test: number;

//   scrollingEnabled: boolean; // derived
//   scrolling: boolean;

//   scrollMode: ScrollMode;

//   glidePresets: GlidePreset[];
//   stepPresets: StepPreset[];

//   glidePresetSelected: number;
//   stepPresetSelected: number;

//   hijacksEnabled: boolean;
//   spaceEnabled: boolean;
//   lrEnabled: boolean;
//   udEnabled: boolean;
// }

// // Settings sent to the content script
// export interface ContentSettings {
//   scrollingEnabled: boolean; // derived
//   scrolling: boolean;

//   scrollMode: ScrollMode;

//   speed: number; // derived
//   distance: number; // derived
//   delay: number; // derived

//   presetToastEnabled: boolean;
// }
