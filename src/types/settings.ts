export type ScrollMode = 'glide' | 'step'

export interface GlidePreset {
  speed: number;
}

export interface StepPreset {
  distance: number;
  delay: number;
}

export interface Settings {
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

export const defaultSettings: Settings = {
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

export type PopupSettings = Pick<
    Settings, 
    'disabledSites'
    | 'scrollMode'
    | 'glidePresets'
    | 'stepPresets'
    | 'glidePresetSelected'
    | 'stepPresetSelected'
    | 'hijacksEnabled'
    | 'spaceEnabled'
    | 'lrEnabled'
    | 'udEnabled'
>

export type ContentSettings = 
    Pick<Settings, 'scrollMode'> & 
    {
    speed: number
    distance: number
    delay: number
    }
