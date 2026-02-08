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

// IMPORTANT: Switch to your production URL when deploying
const BASE_URL = 'http://localhost:5000';
// const BASE_URL = 'https://vm-automobiles.onrender.com'; 

/* ================================ */
/* APP CLASS DEFINITION */
/* ================================ */

class VMAutomobileApp {
    constructor() {
        this.initDOM();
        this.init();
    }

    /* --- Initialization Helpers --- */
    initDOM() {
        this.dom = {
            // Main containers
            navMenu: document.querySelector('.nav-menu'), // Ensure your HTML ul has this class
            overlay: document.getElementById('overlay'),
            
            // Search Elements
            searchInput: document.getElementById('searchInput'), // Add ID="searchInput" to your input in HTML
            suggestionsBox: document.querySelector('.suggestions-box') || this.createSuggestionsBox(),
            
            // Toggles
            hamburger: document.querySelector('.hamburger-menu'),
            searchToggle: document.querySelector('.search-toggle')
        };
    }

    createSuggestionsBox() {
        // Fallback if not in HTML
        const box = document.createElement('ul');
        box.className = 'suggestions-box';
        // Append to a search container if you have one, otherwise body (needs styling)
        if (this.dom.searchInput && this.dom.searchInput.parentElement) {
            this.dom.searchInput.parentElement.appendChild(box);
        }
        return box;
    }

    init() {
        console.log('Initializing App...');
        this.loadMenuData();
        this.setupSearch();
        this.setupEventListeners();
    }

    /* --- Core Logic: Menu Rendering --- */
    async loadMenuData() {
        try {
            const response = await fetch(`${BASE_URL}/api/menu`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const menuData = await response.json();
            this.renderMenu(menuData);
        } catch (error) {
            console.error('Failed to load menu data:', error);
            // Optional: Render a fallback menu or error message here
        }
    }

    renderMenu(data) {
        if (!this.dom.navMenu) return;
        this.dom.navMenu.innerHTML = ''; // Clear static HTML

        // 1. Loop through Main Categories (Sports, Sedan, etc.)
        for (const [category, sections] of Object.entries(data)) {
            const categoryItem = document.createElement('li');
            categoryItem.className = 'nav-item';
            
            // Main Category Link
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = category;
            categoryItem.appendChild(link);

            // Dropdown Container
            const dropdown = document.createElement('div');
            dropdown.className = 'dropdown-menu';

            // 2. Loop through Sections (All Models, Your VM, etc.)
            for (const [sectionName, groups] of Object.entries(sections)) {
                const sectionCol = document.createElement('div');
                sectionCol.className = 'menu-column';
                
                const sectionTitle = document.createElement('h3');
                sectionTitle.textContent = sectionName;
                sectionCol.appendChild(sectionTitle);

                // 3. Loop through Groups (Range, Special Series, etc.)
                // We check if 'groups' is an object (nested) or array (flat) just in case
                if (Array.isArray(groups)) {
                    this.renderListItems(sectionCol, groups);
                } else if (typeof groups === 'object') {
                    for (const [groupName, items] of Object.entries(groups)) {
                        const groupTitle = document.createElement('h4');
                        groupTitle.textContent = groupName;
                        sectionCol.appendChild(groupTitle);

                        if (Array.isArray(items)) {
                            this.renderListItems(sectionCol, items);
                        }
                    }
                }
                dropdown.appendChild(sectionCol);
            }

            categoryItem.appendChild(dropdown);
            this.dom.navMenu.appendChild(categoryItem);
        }
    }

    renderListItems(container, items) {
        const ul = document.createElement('ul');
        items.forEach(carModel => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#'; // You can generate dynamic URLs here later (e.g., `/models/${carModel}`)
            a.textContent = carModel;
            li.appendChild(a);
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    /* --- Core Logic: Search --- */
    setupSearch() {
        if (!this.dom.searchInput || !this.dom.suggestionsBox) return;

        this.dom.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            this.dom.suggestionsBox.innerHTML = '';

            if (query.length < CONFIG.SEARCH_MIN_LENGTH) {
                this.dom.suggestionsBox.style.display = 'none';
                return;
            }

            // Using the backend for search functionality
            // Note: Ensure your server.js has an endpoint for /api/search or filter client-side
            // For now, we will assume you might want client-side filtering if no search API exists yet:
            this.fetchSearchResults(query); 
        });
    }

    async fetchSearchResults(query) {
        // If you haven't built /api/search in server.js yet, this will 404.
        // You can uncomment the logic below to filter the Menu Data directly if preferred.
        try {
            // Option A: Server-side search
            // const res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
            // const results = await res.json();
            
            // Option B: Client-side mock (since we only have /api/menu currently)
            // Ideally, you should fetch the full menu once and filter it here.
            // For valid implementation, add app.get('/api/search') to server.js
            console.log("Search query:", query); 
        } catch (error) {
            console.error("Search error", error);
        }
    }

    /* --- Event Listeners & UI Helpers --- */
    setupEventListeners() {
        // Hamburger Menu Toggle
        if (this.dom.hamburger) {
            this.dom.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
    }

    toggleMobileMenu() {
        // Logic to toggle mobile menu classes
        document.body.classList.toggle('menu-open');
    }
}

/* ================================ */
/* INITIALIZATION */
/* ================================ */

document.addEventListener('DOMContentLoaded', () => {
    try {
        new VMAutomobileApp();
        console.log('VM Automobile App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize VM Automobile App:', error);
    }
});
