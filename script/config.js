/* ================================ */
/* CONFIGURATION */
/* ================================ */

const CONFIG = {
    // API Configuration
    API: {
        // Change this based on environment
        BASE_URL: window.location.hostname === 'localhost' 
            ? 'http://localhost:5000' 
            : 'https://vm-automobiles.onrender.com',
        
        ENDPOINTS: {
            MENU: '/api/menu',
            SEARCH: '/api/search'
        }
    },
    
    // UI Configuration
    SCROLL_THRESHOLD: 100,
    ANIMATION_DELAY: 100,
    SEARCH_MIN_LENGTH: 1,
    
    TRANSITION_DELAYS: {
        SECTION: 0.1,
        FADE_IN: 10
    }
};

// Make available globally
window.APP_CONFIG = CONFIG;
