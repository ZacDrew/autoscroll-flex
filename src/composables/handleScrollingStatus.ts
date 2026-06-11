import { Context } from '@/types/settings';
import { onMessage, sendMessage } from '@/utils/messaging'
import { getPartnerTab } from '@/composables/getPartnerTab';

/*
handleScrollingStatus() is a shared function used by both contentscript and popup/detached
to set up a messaging line to keep track of and update the scrolling status.
*/

const isDetched = window.location.pathname.endsWith('detached.html');


let partnerTab: ComputedRef<globalThis.Browser.tabs.Tab | undefined>;
const scrollingStatus = reactive({ scrolling: false });
let initialized = false;

// let testRef = reactive({letter: 'a'});
// let test = 1;

function init(currentContext: Context) {
    if (initialized) return;
    initialized = true;

    // retrieve initial scrolling status from content script
    if (currentContext !== 'content') {
        (async () => {

            partnerTab = await getPartnerTab();

            if (!partnerTab.value?.id) return;
            // console.log('tabid:', partnerTab.id);

            // fetch scrolling status from contentscript
            sendMessage('getScrollingStatus', undefined, partnerTab.value.id)
                .then((res) => {
                    Object.assign(scrollingStatus, res);
                })
                .catch(() => {
                    console.log('No content script available to recieve message')
                })

        })();
    }

    // listen for new scrolling status from another context
    onMessage('sendScrollingStatus', async (message: {
        data: { scrolling: boolean }
    }) => {
        Object.assign(scrollingStatus, message.data);

        // if (window.location.pathname.endsWith('detached.html')) {
        //     console.log('detached got scrolling status update');
        // }
        // console.log('something got scrolling status update');
    })
}

export function handleScrollingStatus(currentContext: Context) {

    init(currentContext);

    // if (currentContext == 'popup' && !isDetched) {
    //     test = test + 1;
    //     console.log('in popup');
    //     testRef.letter = 'b'
        
    // }

    // console.log('test:', test)
    // console.log('testRef:', testRef.letter)

    async function updateScrollingStatus(scrolling: boolean) {

        scrollingStatus.scrolling = scrolling;

        // if sending to contentscript, include tabid of target
        if (currentContext !== 'content') {

            if (!partnerTab.value?.id) return;


            await sendMessage(
                'sendScrollingStatus',
                structuredClone(toRaw(scrollingStatus)),
                partnerTab.value.id
            )

        } 
        // else {

            try {
                await sendMessage(
                    'sendScrollingStatus',
                    structuredClone(toRaw(scrollingStatus))
                )
            } catch {
                // console.log('no popup available for message')
            }
        // }
    }

    return { scrollingStatus, updateScrollingStatus };
}
