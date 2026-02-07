export const SCROLL_TYPE = {
    GLIDE: 'glide',
    STEP: 'step'
}

export const UI_ID = {
    GLIDE_TAB: 'glide-tab',
    STEP_TAB: 'step-tab',
    PRESET_ROWS: 'preset-rows',
    SPEED: 'speed',
    DISTANCE: 'distance',
    DELAY: 'delay',
    ADD_PRESET_ROW: 'add-preset-row',
    SPACE_ENABLED: 'spaceEnabled',
    SCROLLING_ENABLED: 'scrollingEnabled',
    TOGGLE_SCROLL: 'toggleScroll',
    OPEN_SETTINGS: 'openSettings',
    DISABLED_SITES: 'disabledSites'
};

export const STORAGE_KEY = {
    SCROLL_TYPE: 'scrollType',
    GLIDE_PRESETS: 'glidePresets',
    STEP_PRESETS: 'stepPresets',

    SPEED: 'speed',
    DISTANCE: 'distance',
    DELAY: 'delay',

    SPACE_ENABLED: 'spaceEnabled',
    DISABLED_SITES: 'disabledSites'
};

// default setting values
export const DEFAULT = {
    SCROLL_TYPE: SCROLL_TYPE.GLIDE,
    GLIDE_PRESETS: [ { [STORAGE_KEY.SPEED]: 100 } ],
    STEP_PRESETS: [ { [STORAGE_KEY.DISTANCE]: 200, [STORAGE_KEY.DELAY]: 0.5 } ],

    SPEED: 100,
    DISTANCE: 300,
    DELAY: 2,

    SPACE_ENABLED: false,
    DISABLED_SITES: ['www.youtube.com', 'www.twitch.tv']
}