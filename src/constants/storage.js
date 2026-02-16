export const SCROLL_TYPE = {
    GLIDE: 'glide',
    STEP: 'step'
}

export const UI_ID = {
    DISABLED_SITES: 'disabledSites',
    SCROLLING_ENABLED: 'scrollingEnabled',

    GLIDE_TAB: 'glide-tab',
    STEP_TAB: 'step-tab',
    PRESET_ROWS: 'preset-rows',
    SPEED: 'speed',
    DISTANCE: 'distance',
    DELAY: 'delay',
    ADD_PRESET_ROW: 'add-preset-row',

    OPTIONS: 'options',
    HIJACKS_ENABLED: 'hijacksEnabled',
    HIJACKS: 'hijacks',
    SPACE_ENABLED: 'spaceEnabled',
    LR_ENABLED: 'LREnabled',
    UD_ENABLED: 'UDEnabled',

    TOGGLE_SCROLL: 'toggleScroll',
    OPEN_SETTINGS: 'openSettings'
};

export const STORAGE_KEY = {
    DISABLED_SITES: 'disabledSites',

    SCROLL_TYPE: 'scrollType',
    GLIDE_PRESETS: 'glidePresets',
    STEP_PRESETS: 'stepPresets',

    GLIDE_PRESET_SELECTED: 'glidePresetSelected',
    STEP_PRESET_SELECTED: 'stepPresetSelected',

    SPEED: 'speed',
    DISTANCE: 'distance',
    DELAY: 'delay',

    HIJACKS_ENABLED: 'hijacksEnabled',
    SPACE_ENABLED: 'spaceEnabled',
    LR_ENABLED: 'LREnabled',
    UD_ENABLED: 'UDEnabled',

    PRESET_TOAST_ENABLED: 'presetToastEnabled',
};

// default setting values
export const DEFAULT = {
    DISABLED_SITES: ['www.youtube.com', 'www.twitch.tv'],

    SCROLL_TYPE: SCROLL_TYPE.GLIDE,
    GLIDE_PRESETS: [{ [STORAGE_KEY.SPEED]: 100 }, { [STORAGE_KEY.SPEED]: 200 }, { [STORAGE_KEY.SPEED]: 500 }],
    STEP_PRESETS: [{ [STORAGE_KEY.DISTANCE]: 500, [STORAGE_KEY.DELAY]: 2 }, { [STORAGE_KEY.DISTANCE]: 700, [STORAGE_KEY.DELAY]: 2 }, { [STORAGE_KEY.DISTANCE]: 700, [STORAGE_KEY.DELAY]: 1 }],

    GLIDE_PRESET_SELECTED: 0,
    STEP_PRESET_SELECTED: 0,

    SPEED: 100,
    DISTANCE: 300,
    DELAY: 2,

    HIJACKS_ENABLED: false,
    SPACE_ENABLED: true,
    LR_ENABLED: true,
    UD_ENABLED: true,

    PRESET_TOAST_ENABLED: true,
}