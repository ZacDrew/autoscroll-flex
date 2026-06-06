import { SettingTarget } from '@/types/settings';
import { onMessage, sendMessage } from '@/utils/messaging'
import { useSettings } from '@/composables/useSettings';

/* TODO:
save in settings an object { detatchedID, partnerTab }
detachedID: the window id made when detached is created.

this is so that when the detached window is forced to reload from inactivity
partnerTab doesn't accidently get updated to the last tab popup was opened on.

!!
OR RATHER,
just have bg be the one to save and send partnerTab when the detached window
is initially loaded, rather than updating it EVERYTIME a popup
instance is loaded. no window id required dumbass. 

may as well implement a dynamic partner tab option while im at it. 
see below comment

settings:
locked: bool
partnerTab: when locked, bg doesn't update it.
*/

const { state, update, stateReady } = useSettings('popup');

let partnerTab: globalThis.Browser.tabs.Tab | undefined;
const isDetched = window.location.pathname.endsWith('detached.html');

export async function getPartnerTab() {
    // if running in deteched window, get active tab from local storage
    if (isDetched) {
        await stateReady;
        partnerTab = state.activeTab;
    
    // if running in popup
    } else {
        const response = await sendMessage('getActiveTab'); // from background
        partnerTab = response.activeTab;

        update('activeTab', partnerTab);
    }

    return partnerTab;
}

/*
alternatively, for a dynamic domain detached window:
have bg watch the current tab and update state.activeTab everytime it changes
unless it is the detached window (see isDetached for detection).
 */