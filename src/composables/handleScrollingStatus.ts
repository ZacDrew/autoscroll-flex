import { SettingTarget } from '@/types/settings';
import { onMessage, sendMessage } from '@/utils/messaging'
import { useSettings } from '@/composables/useSettings';
import { getPartnerTab } from '@/composables/getPartnerTab';

const { state, update, stateReady } = useSettings('popup');

let partnerTab: globalThis.Browser.tabs.Tab | undefined;
const scrollingStatus = reactive({ scrolling: false });
let initialized = false;


export function handleScrollingStatus(currentContext: SettingTarget) {
    if (!initialized) {
        initialized = true;

        if (currentContext !== 'content') {
            (async () => {

                partnerTab = await getPartnerTab();

                if (!partnerTab?.id) return;
                // console.log('tabid:', partnerTab.id);

                // fetch scrolling status from contentscript
                sendMessage('getScrollingStatus', undefined, partnerTab.id)
                    .then((res) => {
                        Object.assign(scrollingStatus, res);
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

            if (!partnerTab?.id) return;


            await sendMessage(
                'sendScrollingStatus',
                structuredClone(toRaw(scrollingStatus)),
                partnerTab.id
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
