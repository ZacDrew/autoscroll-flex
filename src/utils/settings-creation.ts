import type { Settings, Context } from "@/types/settings";

export const defaultSettings: Settings = {
    test: 0,
    scrolling: false,
    direction: undefined,
    disabledSites: ['www.youtube.com', 'www.twitch.tv'],
    partnerTab: undefined,

    scrollMode: 'glide',

    glidePresets: [
        { id: '3391103b-086b-45b6-b5c3-4addf11246c9', speed: 100 }, 
        { id: 'eb6584ee-e07a-43fe-b625-5508191a0603', speed: 200 }, 
        { id: '867dbfe2-7dc8-4eb9-b858-c59ad3b2f9bf', speed: 500 }],
    stepPresets: [
        { id: '384caeab-f252-4990-917b-19fee4d5740b', distance: 500, delay: 2 },
        { id: '486dcc02-801d-43bd-ab22-22a367ba3f22', distance: 700, delay: 2 },
        { id: '78048f10-ccb7-4b5a-bbab-e433ed6455fb', distance: 700, delay: 1 }
    ],

    glidePresetSelected: "3391103b-086b-45b6-b5c3-4addf11246c9",
    stepPresetSelected: "384caeab-f252-4990-917b-19fee4d5740b",

    hijacksEnabled: false,
    spaceEnabled: true,
    lrEnabled: true,
    udEnabled: true,

    controlsHidden: false,

    presetToastEnabled: true,
};

// Determine what settings each context recieves
export const settingTargets: Record<keyof Settings, Context[]> = {
    test:                   [ 'popup',    'content',    'options'  ],
    scrolling:              [ 'popup',    'content'                ],
    direction:              [ 'popup',    'content'                ],
    disabledSites:          [ 'popup',    'content',    'options'  ],
    partnerTab:             [ 'popup',    'content'                ],

    scrollMode:             [ 'popup',    'content'                ],

    glidePresets:           [ 'popup',    'content'                ],
    stepPresets:            [ 'popup',    'content'                ],

    glidePresetSelected:    [ 'popup',    'content'                ],
    stepPresetSelected:     [ 'popup',    'content'                ],

    hijacksEnabled:         [ 'popup',    'content',    'options'  ],
    spaceEnabled:           [ 'popup',    'content',    'options'  ],
    lrEnabled:              [ 'popup',    'content',    'options'  ],
    udEnabled:              [ 'popup',    'content',    'options'  ],

    controlsHidden:         [ 'popup'                              ],

    presetToastEnabled:     [             'content',    'options'  ],
} as const