export class TabController {
    constructor(store) {
        this.store = store;
        this.buttons = document.querySelectorAll('.tab-btn');
        this.contents = document.querySelectorAll('.tab-content')
    }

    async init() {
        this.buttons.forEach(btn =>
            btn.addEventListener('click', () => this.setActiveTab(btn))
        );
    }

    setActiveTab(btn) {
        // Remove active class from all buttons
        this.buttons.forEach(b => {
            b.dataset.active = "false";   // remove active
        });
        btn.dataset.active = "true";    // mark clicked

        // Hide all tab content
        this.contents.forEach(tc => (tc.style.display = 'none'));

        // Show content for selected tab
        const tabId = btn.dataset.tab;
        document.getElementById(tabId).style.display = 'block';
    }

}