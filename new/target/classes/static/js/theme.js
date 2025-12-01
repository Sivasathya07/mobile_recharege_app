/**
 * Theme Toggle Functionality
 * Handles theme switching between light and dark modes
 * Saves user preference to localStorage
 * Respects system color scheme preference
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    let currentTheme = localStorage.getItem('theme');
    
    // If no saved preference, use system preference
    if (!currentTheme) {
        currentTheme = prefersDarkScheme.matches ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    }
    
    // Apply the theme
    applyTheme(currentTheme);
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes (only if no explicit user preference)
    prefersDarkScheme.addEventListener('change', handleSystemThemeChange);
    
    /**
     * Toggle between light and dark theme
     */
    function toggleTheme() {
        const newTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Dispatch custom event for other components to react to theme change
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { 
                theme: newTheme,
                timestamp: new Date().toISOString()
            } 
        }));
        
        // Optional: Send analytics event
        if (window.gtag) {
            gtag('event', 'theme_toggle', {
                'event_category': 'ui_interaction',
                'event_label': newTheme
            });
        }
    }
    
    /**
     * Apply theme to the document
     * @param {string} theme - The theme to apply ('light' or 'dark')
     */
    function applyTheme(theme) {
        // Prevent transitions during initial load
        document.documentElement.classList.add('no-transition');
        
        // Apply theme
        document.documentElement.setAttribute('data-bs-theme', theme);
        updateThemeIcon(theme);
        updateThemeColor(theme);
        
        // Re-enable transitions after a short delay
        setTimeout(() => {
            document.documentElement.classList.remove('no-transition');
        }, 10);
    }
    
    /**
     * Update theme icon based on current theme
     * @param {string} theme - The current theme ('light' or 'dark')
     */
    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        
        const isDark = theme === 'dark';
        const newIcon = isDark ? 'sun' : 'moon';
        const newTitle = `Switch to ${isDark ? 'light' : 'dark'} mode`;
        
        // Update icon and title
        themeIcon.className = `fas fa-${newIcon} transition-colors duration-300`;
        themeIcon.setAttribute('title', newTitle);
        themeToggle.setAttribute('aria-label', newTitle);
        
        // Add animation class
        themeIcon.classList.add('animate-pulse');
        setTimeout(() => {
            themeIcon.classList.remove('animate-pulse');
        }, 300);
    }
    
    /**
     * Update theme color meta tag for mobile browsers
     * @param {string} theme - The current theme ('light' or 'dark')
     */
    function updateThemeColor(theme) {
        const themeColor = theme === 'dark' ? '#1a1a2e' : '#4361ee';
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = themeColor;
    }
    
    /**
     * Handle system theme changes
     * @param {MediaQueryListEvent} e - The media query event
     */
    function handleSystemThemeChange(e) {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
        }
    }
    
    // Add transition class after initial load to prevent flash of unstyled content
    setTimeout(() => {
        document.documentElement.classList.add('theme-transition');
    }, 100);
});

// Export functions for use in other modules (if using modules)
// export { toggleTheme, applyTheme, updateThemeIcon };
