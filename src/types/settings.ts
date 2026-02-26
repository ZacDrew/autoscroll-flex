export type ScrollMode = 'glide' | 'step'

export interface GlidePreset {
  speed: number;
}

export interface StepPreset {
  distance: number;
  delay: number;
}

// Settings stored by the background
export interface Settings {
  test: number;
  scrolling: boolean;
  disabledSites: string[];

  scrollMode: ScrollMode;

  glidePresets: GlidePreset[];
  stepPresets: StepPreset[];

  glidePresetSelected: number;
  stepPresetSelected: number;

  hijacksEnabled: boolean;
  spaceEnabled: boolean;
  lrEnabled: boolean;
  udEnabled: boolean;

  presetToastEnabled: boolean;
}

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
