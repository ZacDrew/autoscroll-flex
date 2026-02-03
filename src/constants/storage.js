export const SCROLL_TYPE = {
    GLIDE: 'glide',
    STEP: 'step'
}

export const UI_ID = {
    GLIDE_TAB: 'glide-tab',
    STEP_TAB: 'step-tab',
    SPEED: 'speed',
    DISTANCE: 'distance',
    DELAY: 'delay',
    SPACE_ENABLED: 'spaceEnabled',
    SCROLLING_ENABLED: 'scrollingEnabled',
    TOGGLE_SCROLL: 'toggleScroll',
    OPEN_SETTINGS: 'openSettings',
    DISABLED_SITES: 'disabledSites'
};

export const STORAGE_KEY = {
    SCROLL_TYPE: 'scrollType',
    SPEED: 'speed',
    DISTANCE: 'distance',
    DELAY: 'delay',
    SPACE_ENABLED: 'spaceEnabled',
    DISABLED_SITES: 'disabledSites'
};

// default setting values
export const DEFAULT = {
    SCROLL_TYPE: SCROLL_TYPE.GLIDE,
    SPEED: 100,
    DISTANCE: 300,
    DELAY: 2,
    SPACE_ENABLED: false,
    DISABLED_SITES: ['www.youtube.com', 'www.twitch.tv']
}