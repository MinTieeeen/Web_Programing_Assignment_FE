/**
 * Environment Configuration
 * Centralized configuration for all API URLs and paths
 * 
 * IMPORTANT: This file must be loaded BEFORE any other JS files that use API calls
 */
(function() {
    'use strict';

    // ===========================================
    // ENVIRONMENT CONFIGURATION
    // Change these values based on your environment
    // ===========================================

    const ENV = {
        // Backend API URL - CHANGE THIS TO MATCH YOUR BACKEND
        API_URL: 'http://localhost/BTL_LTW/BTL_LTW_BE',
        
        // Alternative API URL (for older endpoints)
        API_URL_ALT: 'http://localhost',
        
        // Frontend base URL
        FRONTEND_URL: 'http://localhost:3000',
        
        // Asset paths
        ASSETS_PATH: '/assets',
        UPLOADS_PATH: '/assets/uploads',
        IMAGES_PATH: '/assets/images',
        
        // Default images
        DEFAULT_AVATAR: '/assets/images/default-avatar.svg',
        DEFAULT_GAME_THUMBNAIL: '/assets/images/default-game.png',
        
        // API Endpoints
        ENDPOINTS: {
            // Auth
            LOGIN: '/users/signin',
            REGISTER: '/users/register',
            
            // Users
            USERS: '/users',
            USER_PROFILE: '/users/me',
            USER_PASSWORD: '/users/password',
            USER_AVATAR: '/users/avatar',
            
            // Games
            GAMES: '/games',
            GAMES_ME: '/games/me',
            
            // Categories
            CATEGORIES: '/categories',
            
            // Publishers
            PUBLISHERS: '/publishers',
            
            // Reviews
            REVIEWS: '/reviews',
            REVIEW_STATS: '/reviews/stats',
            
            // Cart
            CARTS: '/carts',
            CART_STATS: '/carts/stats',
            CART_ORDERS: '/carts/orders',
            
            // Wishlist
            WISHLIST: '/wishlist',
            
            // Library
            LIBRARY: '/library',
            
            // Admin
            ADMIN_CHECK: '/admin/check',
            ADMIN_LIST: '/admin/list',
            ADMIN_USERS: '/admin/users',
            ADMIN_USERS_ALL: '/admin/users/all',
            ADMIN_PUBLISHERS: '/admin/publishers'
        }
    };

    // ===========================================
    // HELPER FUNCTIONS
    // ===========================================

    /**
     * Get full API URL for an endpoint
     * @param {string} endpoint - The endpoint path or key from ENDPOINTS
     * @returns {string} Full API URL
     */
    ENV.getApiUrl = function(endpoint) {
        // Check if it's a key in ENDPOINTS
        if (ENV.ENDPOINTS[endpoint]) {
            return ENV.API_URL + ENV.ENDPOINTS[endpoint];
        }
        // Otherwise, append the endpoint directly
        return ENV.API_URL + endpoint;
    };

    /**
     * Get avatar URL with fallback
     * @param {string} avatar - Avatar filename or path
     * @returns {string} Full avatar URL
     */
    ENV.getAvatarUrl = function(avatar) {
        if (!avatar) {
            return (window.APP_ROOT || '') + ENV.DEFAULT_AVATAR;
        }
        // If it's already a full URL, return as-is
        if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
            return avatar;
        }
        // Otherwise, construct the path
        return (window.APP_ROOT || '') + ENV.UPLOADS_PATH + '/' + avatar;
    };

    /**
     * Get game thumbnail URL with fallback
     * @param {string} thumbnail - Thumbnail filename or path
     * @returns {string} Full thumbnail URL
     */
    ENV.getThumbnailUrl = function(thumbnail) {
        if (!thumbnail) {
            return (window.APP_ROOT || '') + ENV.DEFAULT_GAME_THUMBNAIL;
        }
        if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
            return thumbnail;
        }
        return thumbnail;
    };

    /**
     * Check if ENV is properly loaded - call this before making API calls
     * @throws Error if ENV is not configured
     */
    ENV.checkLoaded = function() {
        if (!ENV.API_URL) {
            throw new Error('[ENV] API_URL is not configured! Check assets/js/env.js');
        }
        return true;
    };

    // ===========================================
    // EXPOSE GLOBALLY
    // ===========================================
    
    window.ENV = ENV;
    
    // Backward compatibility
    window.API_URL = ENV.API_URL;
    window.API_BASE_URL = ENV.API_URL;

    console.log('[ENV] Configuration loaded:', {
        API_URL: ENV.API_URL,
        FRONTEND_URL: ENV.FRONTEND_URL
    });

})();
