import { SettingTarget } from '@/types/settings';
import { onMessage, sendMessage } from '@/utils/messaging'

const scrollingStatus = reactive({ scrolling: false });
let initialized = false;

export function handleScrollingStatus(currentContext: SettingTarget) {
    if (!initialized) {
        initialized = true;

        if (currentContext !== 'content') {
            (async () => {
                // let [activeTab] = await browser.tabs.query({
                //     active: true,
                //     currentWindow: true,
                // });

                const { activeTab } = await sendMessage('getActiveTab')

                console.log('tabid:', activeTab.id);

                if (!activeTab?.id) return;

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
            const { activeTab } = await sendMessage('getActiveTab')


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
