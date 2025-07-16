/* ================================ */
/* VM AUTOMOBILE - MAIN SCRIPT */
/* ================================ */

'use strict';

/* ================================ */
/* CONSTANTS & CONFIGURATION */
/* ================================ */

const CONFIG = {
    SCROLL_THRESHOLD: 100,
    ANIMATION_DELAY: 100,
    SEARCH_MIN_LENGTH: 1,
    TRANSITION_DELAYS: {
        SECTION: 0.1,
        FADE_IN: 10
    }
};

const SEARCH_ITEMS = [
    "Model A", "Model B", "Model C",
    "Lineup 1", "Lineup 2",
    "Classic 1", "Classic 2",
    "Sedan Premium", "VM Cortex", "Crossover Series",
    "Electric Dreams", "Carbon Edition", "Off-Road Master"
];

const SUBMENU_DATA = {
    'Sports': {
        'Your VM': ['Model A', 'Model B', 'Model C'],
        'Your VM Lineups': ['Lineup 1', 'Lineup 2'],
        'All Models': ['Model A', 'Model B'],
        'Vintage Series': ['Classic 1', 'Classic 2']
    },
    'Sedan': {
        'Luxury Collection': [
            'VM Royale LX', 
            'VM Majesty S', 
            'VM Emperor GT', 
            'VM Monarch Platinum'
        ],
        'Performance Series': [
            'VM Apex R', 
            'VM Tempest 500', 
            'VM Veloce S', 
            'VM Blitz T'
        ],
        'Eco Hybrid': [
            'VM EcoZen', 
            'VM ElectraDrive', 
            'VM Leafon', 
            'VM Greenstride'
        ],
        'Urban Comfort': [
            'VM MetroX', 
            'VM ComfyCruise', 
            'VM SwiftLine', 
            'VM Glide Eco'
        ],
        'Executive Business Class': [
            'VM Stratagem', 
            'VM Titan E', 
            'VM Blackline X', 
            'VM Prestige V'
        ],
        'Concept & Future Tech': [
            'VM Aurora Prototype', 
            'VM Quantum Drive', 
            'VM AlphaZero'
        ]
    },
    'Collections': {
        'Heritage Collection': ['VM Classic 1960', 'VM Vintage 1975'],
        'Limited Editions': ['VM Anniversary', 'VM Signature']
    },
    'Company': {
        'About Us': ['History', 'Vision', 'Team'],
        'Careers': ['Current Openings', 'Internships']
    }
};

/* ================================ */
/* DOM ELEMENT CACHE */
/* ================================ */

class DOMCache {
    constructor() {
        this.elements = new Map();
        this.init();
    }

    init() {
        // Navigation Elements
        this.set('hamburger', '.hamburger');
        this.set('navLinks', '.nav-links');
        this.set('sideMenu', '#sideMenu');
        this.set('navItems', '.nav-links a');
        this.set('topBar', '#topBar');

        // Overlay Elements
        this.set('overlay', '#overlay');
        this.set('closeBtn', '.close-btn');
        this.set('sections', '.overlay-section');
        this.set('menuPane', '#menuPane');
        this.set('submenuSection', '.sub-menu-section');
        this.set('imagePanel', '.image-display');

        // Search Elements
        this.set('searchContainer', '.search-container');
        this.set('searchToggle', '#searchToggle');
        this.set('searchInput', '#searchInput');
        this.set('suggestionsList', '#suggestionsList');
    }

    set(key, selector) {
        const element = selector.startsWith('#') || selector.startsWith('.') 
            ? document.querySelector(selector)
            : document.getElementById(selector);
        
        if (element) {
            this.elements.set(key, element);
        } else {
            console.warn(`Element not found: ${selector}`);
        }
    }

    get(key) {
        return this.elements.get(key);
    }

    getAll(selector) {
        return document.querySelectorAll(selector);
    }
}

/* ================================ */
/* MAIN APPLICATION CLASS */
/* ================================ */

class VMAutomobileApp {
    constructor() {
        this.dom = new DOMCache();
        this.state = {
            isSearchExpanded: false,
            lastScrollY: window.scrollY,
            currentCategory: null
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAnimations();
        this.initializeAccessibility();
    }

    bindEvents() {
        this.bindNavigationEvents();
        this.bindOverlayEvents();
        this.bindSearchEvents();
        this.bindScrollEvents();
        this.bindKeyboardEvents();
    }

    /* ================================ */
    /* NAVIGATION FUNCTIONALITY */
    /* ================================ */

    bindNavigationEvents() {
        // Hamburger menu toggle
        const hamburger = this.dom.get('hamburger');
        if (hamburger) {
            hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Main navigation links
        const navItems = this.dom.getAll('.nav-links a');
        navItems.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
        });
    }

    toggleMobileMenu() {
        const hamburger = this.dom.get('hamburger');
        const navLinks = this.dom.get('navLinks');
        const sideMenu = this.dom.get('sideMenu');

        hamburger?.classList.toggle('active');
        navLinks?.classList.toggle('show');
        sideMenu?.classList.toggle('show');

        // Update ARIA attributes
        const isExpanded = hamburger?.classList.contains('active');
        hamburger?.setAttribute('aria-expanded', isExpanded);
    }

    handleNavClick(e, link) {
        e.preventDefault();
        
        const category = link.dataset.overlay?.trim();
        if (!category || !SUBMENU_DATA.hasOwnProperty(category)) {
            console.warn(`Invalid category: ${category}`);
            return;
        }

        this.state.currentCategory = category;
        this.openOverlay(category);
    }

    /* ================================ */
    /* OVERLAY SYSTEM */
    /* ================================ */

    bindOverlayEvents() {
        const closeBtn = this.dom.get('closeBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeOverlay());
        }

        // Close overlay on escape key or outside click
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeOverlay();
        });
    }

    openOverlay(category) {
        const overlay = this.dom.get('overlay');
        if (!overlay) return;

        overlay.classList.add('show');
        overlay.setAttribute('aria-hidden', 'false');
        
        this.clearSelections();
        this.buildMenuPane(category);
        
        // Focus management
        const firstMenuItem = overlay.querySelector('.menu-title');
        firstMenuItem?.focus();
    }

    closeOverlay() {
        const overlay = this.dom.get('overlay');
        if (!overlay) return;

        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
        
        // Return focus to triggering element
        const triggerElement = document.querySelector(`[data-overlay="${this.state.currentCategory}"]`);
        triggerElement?.focus();
    }

    buildMenuPane(category) {
        const menuPane = this.dom.get('menuPane');
        const data = SUBMENU_DATA[category];
        
        if (!menuPane || !data) return;

        // Clear and rebuild menu pane
        menuPane.innerHTML = '';
        this.clearSelections();

        // Create heading
        const heading = this.createElement('h2', 'menu-heading', category);
        menuPane.appendChild(heading);

        // Create menu items
        Object.keys(data).forEach(menuItem => {
            const button = this.createElement('button', 'menu-title', menuItem);
            button.setAttribute('aria-expanded', 'false');
            button.addEventListener('click', () => this.handleMenuItemClick(button, menuItem, data[menuItem]));
            menuPane.appendChild(button);
        });
    }

    handleMenuItemClick(button, menuItem, menuData) {
        this.clearSelections();
        
        button.classList.add('selected');
        button.setAttribute('aria-expanded', 'true');

        if (menuData) {
            this.buildSubmenuGroups({ [menuItem]: menuData });
        }
    }

    buildSubmenuGroups(menuData) {
        const submenuSection = this.dom.get('submenuSection');
        if (!submenuSection) return;

        submenuSection.innerHTML = '';

        Object.keys(menuData).forEach((groupName, index) => {
            const groupDiv = this.createSubmenuGroup(groupName, menuData[groupName], index);
            submenuSection.appendChild(groupDiv);
        });
    }

    createSubmenuGroup(groupName, options, index) {
        const groupDiv = this.createElement('div', 'submenu-group');
        groupDiv.style.animationDelay = `${index * CONFIG.ANIMATION_DELAY}ms`;

        const groupTitle = this.createElement('div', 'submenu-title', groupName);
        const optionsList = this.createElement('ul', 'submenu-options');

        // Expand/collapse functionality
        groupTitle.addEventListener('click', () => {
            groupTitle.classList.toggle('expanded');
            const isExpanded = groupTitle.classList.contains('expanded');
            groupTitle.setAttribute('aria-expanded', isExpanded);
        });

        // Create option items
        options.forEach(option => {
            const listItem = this.createOptionItem(option);
            optionsList.appendChild(listItem);
        });

        groupDiv.appendChild(groupTitle);
        groupDiv.appendChild(optionsList);

        // Trigger animation
        setTimeout(() => groupDiv.classList.add('show'), CONFIG.TRANSITION_DELAYS.FADE_IN);

        return groupDiv;
    }

    createOptionItem(optionText) {
        const listItem = this.createElement('li', '', optionText);
        listItem.setAttribute('role', 'option');
        listItem.setAttribute('tabindex', '0');

        const clickHandler = () => {
            this.clearSubmenuSelections();
            listItem.classList.add('selected');
            listItem.setAttribute('aria-selected', 'true');
            this.updateImagePanel(optionText);
        };

        listItem.addEventListener('click', clickHandler);
        listItem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                clickHandler();
            }
        });

        return listItem;
    }

    updateImagePanel(selectedOption) {
        const imagePanel = this.dom.get('imagePanel');
        if (imagePanel) {
            imagePanel.innerHTML = `<p>Image for <strong>${selectedOption}</strong> will be displayed here</p>`;
        }
    }

    /* ================================ */
    /* SEARCH FUNCTIONALITY */
    /* ================================ */

    bindSearchEvents() {
        const searchToggle = this.dom.get('searchToggle');
        const searchInput = this.dom.get('searchInput');

        if (searchToggle) {
            searchToggle.addEventListener('click', (e) => this.toggleSearch(e));
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
        }

        // Global click handler for search
        document.addEventListener('click', (e) => this.handleDocumentClick(e));
    }

    toggleSearch(e) {
        e.stopPropagation();
        
        const searchContainer = this.dom.get('searchContainer');
        const searchInput = this.dom.get('searchInput');
        const searchToggle = this.dom.get('searchToggle');
        
        if (!searchContainer || !searchInput || !searchToggle) return;

        this.state.isSearchExpanded = !this.state.isSearchExpanded;
        searchContainer.classList.toggle('expanded', this.state.isSearchExpanded);
        searchToggle.setAttribute('aria-expanded', this.state.isSearchExpanded);

        if (this.state.isSearchExpanded) {
            searchInput.focus();
        } else {
            this.clearSearch();
        }
    }

    handleSearchInput(e) {
        const query = e.target.value.trim().toLowerCase();
        const suggestionsList = this.dom.get('suggestionsList');
        
        if (!suggestionsList) return;

        suggestionsList.innerHTML = '';

        if (query.length < CONFIG.SEARCH_MIN_LENGTH) {
            suggestionsList.style.display = 'none';
            return;
        }

        const filtered = SEARCH_ITEMS.filter(item =>
            item.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            const noResults = this.createElement('li', 'no-results', 'No results found');
            suggestionsList.appendChild(noResults);
        } else {
            filtered.forEach(suggestion => {
                const li = this.createElement('li', 'suggestion-item', suggestion);
                li.setAttribute('role', 'option');
                li.addEventListener('click', () => this.selectSearchSuggestion(suggestion));
                suggestionsList.appendChild(li);
            });
        }

        suggestionsList.style.display = 'block';
    }

    selectSearchSuggestion(suggestion) {
        const searchInput = this.dom.get('searchInput');
        const suggestionsList = this.dom.get('suggestionsList');
        
        if (searchInput) searchInput.value = suggestion;
        if (suggestionsList) suggestionsList.style.display = 'none';
        
        console.log('User selected:', suggestion);
        // Add your search result handling logic here
    }

    clearSearch() {
        const searchInput = this.dom.get('searchInput');
        const suggestionsList = this.dom.get('suggestionsList');
        
        if (searchInput) searchInput.value = '';
        if (suggestionsList) suggestionsList.style.display = 'none';
    }

    handleDocumentClick(e) {
        const searchContainer = this.dom.get('searchContainer');
        
        if (searchContainer && !searchContainer.contains(e.target)) {
            this.state.isSearchExpanded = false;
            searchContainer.classList.remove('expanded');
            this.clearSearch();
        }
    }

    /* ================================ */
    /* SCROLL FUNCTIONALITY */
    /* ================================ */

    bindScrollEvents() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        const topBar = this.dom.get('topBar');
        
        if (!topBar) return;

        if (currentScrollY > this.state.lastScrollY && currentScrollY > CONFIG.SCROLL_THRESHOLD) {
            // Scrolling down & passed threshold
            topBar.classList.add('hidden');
        } else {
            // Scrolling up
            topBar.classList.remove('hidden');
        }

        this.state.lastScrollY = currentScrollY;
    }

    /* ================================ */
    /* KEYBOARD NAVIGATION */
    /* ================================ */

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.state.isSearchExpanded) {
                    this.toggleSearch(e);
                } else {
                    this.closeOverlay();
                }
            }
        });
    }

    /* ================================ */
    /* UTILITY FUNCTIONS */
    /* ================================ */

    createElement(tag, className = '', textContent = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }

    clearSelections() {
        this.clearMenuSelections();
        this.clearSubmenus();
    }

    clearMenuSelections() {
        const menuTitles = this.dom.getAll('.menu-title');
        menuTitles.forEach(title => {
            title.classList.remove('selected');
            title.setAttribute('aria-expanded', 'false');
        });
    }

    clearSubmenus() {
        const submenuSection = this.dom.get('submenuSection');
        const imagePanel = this.dom.get('imagePanel');
        
        if (submenuSection) submenuSection.innerHTML = '';
        if (imagePanel) imagePanel.innerHTML = '<p>Select a model to preview image</p>';
    }

    clearSubmenuSelections() {
        const submenuSection = this.dom.get('submenuSection');
        if (submenuSection) {
            submenuSection.querySelectorAll('li').forEach(li => {
                li.classList.remove('selected');
                li.setAttribute('aria-selected', 'false');
            });
        }
    }

    setupAnimations() {
        const sections = this.dom.getAll('.overlay-section');
        sections.forEach((section, index) => {
            section.style.transitionDelay = `${index * CONFIG.TRANSITION_DELAYS.SECTION}s`;
        });
    }

    initializeAccessibility() {
        // Set initial ARIA attributes
        const overlay = this.dom.get('overlay');
        if (overlay) overlay.setAttribute('aria-hidden', 'true');

        const hamburger = this.dom.get('hamburger');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');

        const searchToggle = this.dom.get('searchToggle');
        if (searchToggle) searchToggle.setAttribute('aria-expanded', 'false');
    }
}

/* ================================ */
/* INITIALIZATION */
/* ================================ */

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        new VMAutomobileApp();
        console.log('VM Automobile App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize VM Automobile App:', error);
    }
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VMAutomobileApp;
}