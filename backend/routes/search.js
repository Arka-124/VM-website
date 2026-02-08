const express = require('express');
const router = express.Router();
const submenuData = require('../data/menuData');

/**
 * Search endpoint
 * GET /api/search?q=query
 */
router.get('/', (req, res) => {
    try {
        const query = req.query.q?.toLowerCase().trim();
        
        if (!query) {
            return res.json([]);
        }
        
        const results = new Set(); // Use Set to avoid duplicates
        
        // Search through all menu categories
        Object.entries(submenuData).forEach(([category, categoryData]) => {
            // Add category if it matches
            if (category.toLowerCase().includes(query)) {
                results.add(category);
            }
            
            // Search through subcategories
            Object.entries(categoryData).forEach(([subCategory, items]) => {
                // Add subcategory if it matches
                if (subCategory.toLowerCase().includes(query)) {
                    results.add(subCategory);
                }
                
                // Search through items
                if (Array.isArray(items)) {
                    items.forEach(item => {
                        if (item.toLowerCase().includes(query)) {
                            results.add(item);
                        }
                    });
                } else if (typeof items === 'object') {
                    // Handle nested objects
                    Object.entries(items).forEach(([key, values]) => {
                        if (key.toLowerCase().includes(query)) {
                            results.add(key);
                        }
                        if (Array.isArray(values)) {
                            values.forEach(value => {
                                if (value.toLowerCase().includes(query)) {
                                    results.add(value);
                                }
                            });
                        }
                    });
                }
            });
        });
        
        // Convert Set to Array and limit results
        const resultArray = Array.from(results).slice(0, 10);
        
        res.json(resultArray);
        
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;
