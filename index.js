class Tabs {
    #rootEl;
    #navElements;
    #contentElements;
    #activeTabIndex = 0;

    static NAV_ITEM_CLASS = 'nav-item';
    static NAV_ITEM_ACTIVE_CLASS = 'nav-item-active';
    static CONTENT_ITEM_CLASS = 'content-item';
    static CONTENT_ITEM_ACTIVE_CLASS = 'content-item-active';

    constructor(rootEl, defaultTabIndex) {
        this.#rootEl = rootEl;

        const [navEl, contentEl] = this.#rootEl.children;

        this.#navElements = Array.from(navEl.children);
        this.#contentElements = Array.from(contentEl.children);

        if (defaultTabIndex) {
            this.#activeTabIndex = defaultTabIndex;
        }

        this.bindStyles();
        this.bindEvents();
        this.showActiveTabByIndex(this.#activeTabIndex);
    }

    bindStyles() {
        this.#navElements.forEach(navElement => {
            navElement.classList.add(Tabs.NAV_ITEM_CLASS);
        });
        this.#contentElements.forEach(contentElement => {
            contentElement.classList.add(Tabs.CONTENT_ITEM_CLASS);
        });
    }

    bindEvents() {
        const [navEl] = this.#rootEl.children;

        navEl.addEventListener('click', (e) => this.onNavElClick(e));
    }


    onNavElClick(e) {
        const navEl = e.target;

        if (navEl.classList.contains(Tabs.NAV_ITEM_CLASS)) {

            const newActiveTabIndex = this.getNavItemElIndex(navEl);
            
            this.hideActiveTab(this.#activeTabIndex);
            this.showActiveTabByIndex(newActiveTabIndex);
        }
    }

    getNavItemElIndex(currentButtonEl) {

        for (let i = 0; i < this.#navElements.length; i++) {
            const buttonEl = this.#navElements[i];

            if (buttonEl === currentButtonEl) {
                return i;
            }
        }
    }

    showActiveTabByIndex(index) {
        const navElement = this.#navElements[index];
        const contentElement = this.#contentElements[index];

        navElement.classList.add(Tabs.NAV_ITEM_ACTIVE_CLASS);
        contentElement.classList.add(Tabs.CONTENT_ITEM_ACTIVE_CLASS);

        this.#activeTabIndex = index;
    }

    hideActiveTab(index) {

        const navElement = this.#navElements[index];
        const contentElement = this.#contentElements[index];

        if (navElement && contentElement) {
            navElement.classList.remove(Tabs.NAV_ITEM_ACTIVE_CLASS);
            contentElement.classList.remove(Tabs.CONTENT_ITEM_ACTIVE_CLASS);
        }
    }
}

const tabsEl = document.querySelector('#tabs');
new Tabs(tabsEl);