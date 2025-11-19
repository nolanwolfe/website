// Configuration file for Portfolio Website
// Copy this file to config.js and fill in your actual credentials

const CONFIG = {
    // Site Information
    site: {
        title: 'Your Name - Photography Portfolio',
        author: 'Your Name',
        email: 'contact@yourportfolio.com',
        description: 'Professional photography portfolio'
    },

    // Adobe Lightroom API Credentials
    // Get your credentials from: https://developer.adobe.com/console
    lightroom: {
        apiKey: 'YOUR_API_KEY_HERE',
        clientId: 'YOUR_CLIENT_ID_HERE',
        clientSecret: 'YOUR_CLIENT_SECRET_HERE',
        catalogId: 'YOUR_CATALOG_ID_HERE',
        albumId: 'YOUR_ALBUM_ID_HERE'
    },

    // Social Media Links
    social: {
        instagram: 'https://instagram.com/yourusername',
        twitter: 'https://twitter.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        facebook: 'https://facebook.com/yourusername'
    },

    // Gallery Settings
    gallery: {
        defaultCategory: 'all',
        itemsPerPage: 50,
        enableLightbox: true,
        autoSync: false, // Automatically sync from Lightroom on page load
        syncInterval: 3600000 // Sync interval in milliseconds (1 hour)
    },

    // Photo Categories
    categories: [
        { id: 'all', name: 'All' },
        { id: 'portrait', name: 'Portrait' },
        { id: 'landscape', name: 'Landscape' },
        { id: 'street', name: 'Street' },
        { id: 'nature', name: 'Nature' }
    ]
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
