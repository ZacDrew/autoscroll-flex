import { SettingTarget } from '@/types/settings';
import { onMessage, sendMessage } from '@/utils/messaging'
import { useSettings } from '@/composables/useSettings';


const { state, update, stateReady } = useSettings('popup');

const scrollingStatus = reactive({ scrolling: false });
let initialized = false;

let activeTab: globalThis.Browser.tabs.Tab | undefined;
const isDetched = window.location.pathname.endsWith('detached.html');


export function handleScrollingStatus(currentContext: SettingTarget) {
    if (!initialized) {
        initialized = true;

        console.log('pathname:', window.location.pathname);
        console.log('href:', window.location.href);

        if (currentContext !== 'content') {
            (async () => {
                // let [activeTab] = await browser.tabs.query({
                //     active: true,
                //     currentWindow: true,
                // });

                // if running in deteched window, get active tab from local storage
                if (isDetched) {
                    await stateReady;
                    activeTab = state.activeTab;
                } else {
                    ({ activeTab } = await sendMessage('getActiveTab'));

                    update('activeTab', activeTab);
                }

                if (!activeTab?.id) return;
                console.log('tabid:', activeTab.id);

                // fetch scrolling status from contentscript
                sendMessage('getScrollingStatus', undefined, activeTab.id)
                    .then((res) => {
                        Object.assign(scrollingStatus, res);
                        console.log('response:', res)
                        console.log('scrollingstatus ob', scrollingStatus.scrolling)
                    })

            })();
        }

        // listen for new scrolling status from other context
        onMessage('sendScrollingStatus', async (message: {
            data: { scrolling: boolean }
        }) => {
            Object.assign(scrollingStatus, message.data);
        })
    }

    async function updateScrollingStatus(scrolling: boolean) {

        scrollingStatus.scrolling = scrolling;

        // if sending to contentscript, include tabid of target
        if (currentContext !== 'content') {

            // const [activeTab] = await browser.tabs.query({
            //     active: true,
            //     currentWindow: true,
            // });
            // const { activeTab } = await sendMessage('getActiveTab')

            if (!activeTab?.id) return;


            await sendMessage(
                'sendScrollingStatus',
                structuredClone(toRaw(scrollingStatus)),
                activeTab.id
            )

        } else {
            try {
                await sendMessage(
                    'sendScrollingStatus',
                    structuredClone(toRaw(scrollingStatus))
                )
            } catch {
                // console.log('no popup available fo message')
            }
        }
    }

    return { scrollingStatus, updateScrollingStatus };
}
