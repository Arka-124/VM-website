/* ================================ */
/* DOM ELEMENT REFERENCES */
/* ================================ */

// Navigation Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const sideMenu = document.getElementById('sideMenu');
const navItems = document.querySelectorAll('.nav-links a');

// Overlay Elements
const overlay = document.getElementById('overlay');
const closeBtn = document.querySelector('.close-btn');
const sections = document.querySelectorAll('.overlay-section');

// Menu System Elements
const menuTitles = document.querySelectorAll('.menu-title');
const submenuSection = document.querySelector('.sub-menu-section');
const imagePanel = document.querySelector('.image-display');

/* ================================ */
/* DATA STRUCTURE */
/* ================================ */

// Example placeholder submenu structure
const submenuData = {
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
    }
};


/* ================================ */
/* UTILITY FUNCTIONS */
/* ================================ */

/**
 * Clear submenu content and reset image panel
 */
function clearSubmenus() {
    submenuSection.innerHTML = '';
    imagePanel.innerHTML = '<p>Image Preview Here</p>';
}

/**
 * Remove selected class from all menu items
 */
function clearMenuSelections() {
    const menuTitles = document.querySelectorAll('.menu-title');
    menuTitles.forEach(title => title.classList.remove('selected'));
}


/**
 * Remove selected class from all submenu options
 */
function clearSubmenuSelections() {
    submenuSection.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
}

/* ================================ */
/* NAVIGATION CONTROLS */
/* ================================ */

/**
 * Hamburger menu toggle functionality
 */
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('show');
    sideMenu.classList.toggle('show');
});

/**
 * Open overlay when nav link with data-overlay is clicked
 */
navItems.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.classList.add('show');

    // 🔥 CLEAR selections and panes
    clearMenuSelections();
    clearSubmenus();

    buildMenuPane(category);
});

    const category = link.dataset.overlay?.trim();
        if (category && submenuData.hasOwnProperty(category)) {

        link.addEventListener('click', (e) => {
          clearMenuSelections();
          clearSubmenus();
            e.preventDefault();
            overlay.classList.add('show');
            buildMenuPane(category);
        });
    }
});

/**
 * Close overlay functionality
 */
closeBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
});

/* ================================ */
/* OVERLAY MENU SYSTEM */
/* ================================ */

function buildMenuPane(category) {
    const menuPane = document.getElementById('menuPane');
    const data = submenuData[category];

    // Clear menu pane and previous submenu highlights
    menuPane.innerHTML = '';
    clearMenuSelections();
    clearSubmenus();

    // Set heading
    const heading = document.createElement('div');
    heading.classList.add('menu-heading');
    heading.textContent = category;
    menuPane.appendChild(heading);

    // Build menu titles
    Object.keys(data).forEach(menuItem => {
        const title = document.createElement('div');
        title.classList.add('menu-title');
        title.textContent = menuItem;

        // Click logic for menu titles
        title.addEventListener('click', () => {
            clearMenuSelections();
            clearSubmenus();
            title.classList.add('selected');

            const menuData = data[menuItem];
            if (menuData) {
                buildSubmenuGroups({ [menuItem]: menuData });
            }
        });

        menuPane.appendChild(title);
    });
}

/**
 * Build submenu groups based on data structure
 * @param {Object} menuData - The submenu data for the selected menu
 */
function buildSubmenuGroups(menuData) {
    Object.keys(menuData).forEach((groupName, index) => {
        const groupDiv = createSubmenuGroup(groupName, menuData[groupName], index);
        submenuSection.appendChild(groupDiv);
    });
}

/**
 * Create a submenu group element
 * @param {string} groupName - Name of the submenu group
 * @param {Array} options - Array of options for this group
 * @param {number} index - Index for animation delay
 * @returns {HTMLElement} - The created submenu group element
 */
function createSubmenuGroup(groupName, options, index) {
    // Create group container
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('submenu-group');
    groupDiv.style.animationDelay = `${index * 100}ms`;

    // Create group title
    const groupTitle = document.createElement('div');
    groupTitle.classList.add('submenu-title');
    groupTitle.textContent = groupName;

    // Create options list
    const optionsList = document.createElement('ul');
    optionsList.classList.add('submenu-options');

    // Add click handler for group title (expand/collapse)
    groupTitle.addEventListener('click', () => {
        groupTitle.classList.toggle('expanded');
    });

    // Create individual option items
    options.forEach(option => {
        const listItem = createOptionItem(option);
        optionsList.appendChild(listItem);
    });

    // Assemble group
    groupDiv.appendChild(groupTitle);
    groupDiv.appendChild(optionsList);

    // Trigger fade-in animation
    setTimeout(() => {
        groupDiv.classList.add('show');
    }, 10);

    return groupDiv;
}

/**
 * Create an individual option item
 * @param {string} optionText - The text content for the option
 * @returns {HTMLElement} - The created list item element
 */
function createOptionItem(optionText) {
    const listItem = document.createElement('li');
    listItem.textContent = optionText;

    // Add click handler for option selection
    listItem.addEventListener('click', () => {
        clearSubmenuSelections();
        listItem.classList.add('selected');
        updateImagePanel(optionText);
    });

    return listItem;
}

/**
 * Update the image panel with selected option
 * @param {string} selectedOption - The selected option text
 */
function updateImagePanel(selectedOption) {
    imagePanel.innerHTML = `<p>Image for <strong>${selectedOption}</strong> will be displayed here</p>`;
}

/* ================================ */
/* OVERLAY ANIMATIONS */
/* ================================ */

/**
 * Set staggered animation delays for overlay sections
 */
sections.forEach((section, index) => {
    section.style.transitionDelay = `${index * 0.1}s`;
});

// ===============================
// EXPANDING SEARCH BAR
// ===============================
const searchContainer = document.querySelector('.search-container');
const searchIcon = document.getElementById('searchToggle');
const searchInput = document.getElementById('searchInput');

searchIcon.addEventListener('click', () => {
  searchContainer.classList.toggle('expanded');
  if (searchContainer.classList.contains('expanded')) {
    searchInput.focus();
  } else {
    searchInput.value = '';
  }
});

// Optional: collapse on blur
searchInput.addEventListener('blur', () => {
  setTimeout(() => {
    searchContainer.classList.remove('expanded');
    searchInput.value = '';
  }, 150); // Give it a moment so it doesn't disappear immediately
});

const suggestionsBox = document.getElementById('searchSuggestions');

// Sample suggestions — you can fetch dynamically or expand
const searchItems = [
  "Model A", "Model B", "Model C",
  "Lineup 1", "Lineup 2",
  "Classic 1", "Classic 2",
  "Sedan Premium", "VM Cortex", "Crossover Series",
  "Electric Dreams", "Carbon Edition", "Off-Road Master"
];

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  suggestionsBox.innerHTML = '';

  if (query.length === 0) {
    suggestionsBox.style.display = 'none';
    return;
  }

  const filtered = searchItems.filter(item =>
    item.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    suggestionsBox.innerHTML = '<li>No results found</li>';
  } else {
    filtered.forEach(suggestion => {
      const li = document.createElement('li');
      li.textContent = suggestion;
      li.addEventListener('click', () => {
        searchInput.value = suggestion;
        suggestionsBox.style.display = 'none';
        // Optional: Trigger overlay or navigate based on suggestion
        console.log('User selected:', suggestion);
      });
      suggestionsBox.appendChild(li);
    });
  }

  suggestionsBox.style.display = 'block';
});

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!searchContainer.contains(e.target)) {
    suggestionsBox.style.display = 'none';
  }
});
document.getElementById('searchToggle').addEventListener('click', () => {
  document.querySelector('.search-container').classList.toggle('expanded');
  document.getElementById('searchInput').focus();
});
const searchToggle = document.getElementById('searchToggle');
searchToggle.addEventListener('click', () => {
  searchContainer.classList.toggle('expanded');
  if (searchContainer.classList.contains('expanded')) {
    searchInput.focus();
  }
});
