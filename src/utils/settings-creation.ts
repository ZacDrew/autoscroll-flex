import type { Settings, SettingTarget } from "@/types/settings";

export const defaultSettings: Settings = {
    test: 0,
    scrolling: false,
    direction: undefined,
    disabledSites: ['www.youtube.com', 'www.twitch.tv'],

    scrollMode: 'glide',

    glidePresets: [
        { id: crypto.randomUUID(), speed: 100 }, 
        { id: crypto.randomUUID(), speed: 200 }, 
        { id: crypto.randomUUID(), speed: 500 }],
    stepPresets: [
        { id: crypto.randomUUID(), distance: 500, delay: 2 },
        { id: crypto.randomUUID(), distance: 700, delay: 2 },
        { id: crypto.randomUUID(), distance: 700, delay: 1 }
    ],

    glidePresetSelected: "",
    stepPresetSelected: "",

    hijacksEnabled: false,
    spaceEnabled: true,
    lrEnabled: true,
    udEnabled: true,

    controlsHidden: false,

    presetToastEnabled: true,
};

// Determine what settings each context recieves
export const settingTargets: Record<keyof Settings, SettingTarget[]> = {
    test:                   [   'popup',    'content',  'options'   ],
    scrolling:              [   'popup',    'content'               ],
    direction:              [   'popup',    'content'               ],
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

    controlsHidden:         [   'popup'                             ],

    presetToastEnabled:     [               'content',  'options'   ],
} as const