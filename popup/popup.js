const form = document.getElementById('popupForm');

form.addEventListener('change', async (e) => {
    e.preventDefault();

    let distance = document.getElementById('distance').value;
    let delay = document.getElementById('delay').value;

    // set empty/undefined values to 0
    distance = !distance ? 0: distance;
    delay = !delay ? 0: delay;

    await browser.storage.local.set({ distance, delay });

    console.log('change: ', { distance, delay});
});

const toggleScroll = document.getElementById('toggleScroll');

toggleScroll.addEventListener('click', async () => {
    
})

async function init() {
    let { distance, delay } = await browser.storage.local.get(['distance', 'delay']);

    // set ""/undefined values to 0
    distance = !distance ? 0: distance;
    delay = !delay ? 0: delay;

    // Set UI values
    document.getElementById('distance').value = distance;
    document.getElementById('delay').value = delay;

    console.log('init: ', { distance, delay});
}

init().catch(e => console.log(e));