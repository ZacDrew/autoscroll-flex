import type { Settings, SettingTarget } from "@/types/settings";

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

// Determine what settings each context recieves
export const settingTargets: Record<keyof Settings, SettingTarget[]> = {
    test:                   [   'popup',    'content',  'options'   ],
    scrolling:              [   'popup',    'content'               ],
    disabledSites:          [   'popup',    'content',  'options'   ],

    scrollMode:             [   'popup',    'content'               ],

    glidePresets:           [   'popup',    'content'               ],
    stepPresets:            [   'popup',    'content'               ],

    glidePresetSelected:    [   'popup',    'content'               ],
    stepPresetSelected:     [   'popup',    'content'               ],

    hijacksEnabled:         [   'popup',                'options'   ],
    spaceEnabled:           [   'popup',                'options'   ],
    lrEnabled:              [   'popup',                'options'   ],
    udEnabled:              [   'popup',                'options'   ],

    presetToastEnabled:     [               'content',  'options'   ],
} as const