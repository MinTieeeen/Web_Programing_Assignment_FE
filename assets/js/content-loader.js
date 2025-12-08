/**
 * Content Loader
 * Fetches dynamic site content from API and binds it to DOM elements.
 * 
 * Usage:
 * Add data-content-key="page.section.key" to your HTML elements.
 * Example: <span data-content-key="system.info.company_name">Default Name</span>
 * 
 * Supported Attributes:
 * - data-content-type="text" (default): Sets textContent
 * - data-content-type="html": Sets innerHTML
 * - data-content-type="image": Sets src attribute
 * - data-content-type="link": Sets href attribute
 */

class ContentLoader {
    static async init() {
        if (!window.ENV || !window.ENV.API_URL) {
            console.error('[ContentLoader] ENV not loaded');
            return;
        }

        try {
            // Fetch content from new settings endpoint
            const response = await fetch(`${window.ENV.API_URL}/settings`);
            const result = await response.json();

            if (result.status === 'success') {
                this.content = result.data;
                this.bindContent();
                
                // Expose for other scripts
                window.SITE_CONTENT = this.content;
                
                // Dispatch event so other components know content is ready
                window.dispatchEvent(new Event('site-content-loaded'));
            } else {
                console.error('[ContentLoader] Failed to load content', result);
            }
        } catch (error) {
            console.error('[ContentLoader] Error fetching content', error);
        }
    }

    static bindContent() {
        if (!this.content) return;

        const elements = document.querySelectorAll('[data-content-key]');
        
        elements.forEach(el => {
            const keyPath = el.getAttribute('data-content-key');
            const type = el.getAttribute('data-content-type') || 'text';
            
            const value = this.getValueByPath(keyPath);
            
            if (value !== undefined && value !== null && value !== '') {
                this.applyValue(el, type, value);
            }
        });
    }

    static getValueByPath(path) {
        if (!path) return undefined;
        
        const parts = path.split('.');
        let current = this.content;
        
        for (const part of parts) {
            if (current === undefined || current === null) return undefined;
            current = current[part];
        }
        
        return current;
    }

    static applyValue(el, type, value) {
        switch (type) {
            case 'image':
                if (el.tagName === 'IMG') {
                    // Start: Fix relative paths if needed, but value from DB should be full or relative root
                    // If value starts with /, assume it's asset path
                    el.src = value;
                } else {
                    el.style.backgroundImage = `url('${value}')`;
                }
                break;
            case 'link':
                if (el.tagName === 'A') {
                    el.href = value === '#' ? 'javascript:void(0)' : value;
                } else if (el.tagName === 'LINK') {
                    el.href = value;
                }
                break;
            case 'html':
                el.innerHTML = value;
                break;
            case 'text':
            default:
                el.textContent = value;
                break;
        }
    }
}

// Auto-init on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    ContentLoader.init();
});

// Re-bind when new components are loaded (e.g. Header/Footer)
window.addEventListener('component-loaded', () => {
    // Wait a brief moment for DOM to settle if needed, or call immediately
    // Using simple debounce/delay just in case multiple components load at once
    setTimeout(() => {
        ContentLoader.bindContent();
    }, 50);
});
