// Medicine Inventory System - Main JavaScript File

class MedicineInventoryApp {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
        console.log('Medicine Inventory App Initialized');
    }

    bindEvents() {
        // Bind search functionality
        this.bindSearch();
        
        // Bind form validations
        this.bindFormValidations();
        
        // Bind auto-refresh
        this.bindAutoRefresh();
    }

    bindSearch() {
        // Medicine search functionality
        const medicineSearch = document.getElementById('medicineSearch');
        if (medicineSearch) {
            medicineSearch.addEventListener('input', this.debounce(this.searchMedicines.bind(this), 300));
        }
    }

    bindFormValidations() {
        // Add Bootstrap validation to all forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });

        // Custom validation for email
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateEmail(input);
            });
        });

        // Custom validation for phone numbers
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validatePhone(input);
            });
        });
    }

    bindAutoRefresh() {
        // Auto-refresh data every 30 seconds
        if (window.location.pathname === '/medicines' || 
            window.location.pathname === '/users' || 
            window.location.pathname === '/orders') {
            setInterval(() => {
                this.refreshData();
            }, 30000);
        }
    }

    async searchMedicines(event) {
        const query = event.target.value;
        if (query.length < 2) return;

        try {
            const response = await fetch(`/api/medicines/search?query=${encodeURIComponent(query)}`);
            const medicines = await response.json();
            this.displaySearchResults(medicines);
        } catch (error) {
            console.error('Error searching medicines:', error);
        }
    }

    displaySearchResults(medicines) {
        // Implementation for displaying search results
        console.log('Search results:', medicines);
        // You can update this to display results in a specific container
    }

    async refreshData() {
        try {
            // Refresh data based on current page
            const path = window.location.pathname;
            
            if (path === '/medicines') {
                await this.refreshMedicines();
            } else if (path === '/users') {
                await this.refreshUsers();
            } else if (path === '/orders') {
                // Orders are refreshed automatically via their own functions
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    }

    async refreshMedicines() {
        const response = await fetch('/api/medicines');
        const medicines = await response.json();
        this.updateMedicineTable(medicines);
    }

    async refreshUsers() {
        const response = await fetch('/api/users');
        const users = await response.json();
        this.updateUserTable(users);
    }

    updateMedicineTable(medicines) {
        const tbody = document.querySelector('#medicines-table tbody');
        if (tbody) {
            tbody.innerHTML = medicines.map(medicine => `
                <tr>
                    <td>${medicine.medicineId}</td>
                    <td>${medicine.name}</td>
                    <td>${medicine.brand}</td>
                    <td>${medicine.category}</td>
                    <td>₹${medicine.price}</td>
                    <td>
                        <span class="badge ${medicine.quantityInStock < medicine.reorderLevel ? 'bg-warning' : 'bg-success'}">
                            ${medicine.quantityInStock}
                        </span>
                    </td>
                    <td>${new Date(medicine.expiryDate).toLocaleDateString()}</td>
                </tr>
            `).join('');
        }
    }

    updateUserTable(users) {
        const tbody = document.querySelector('#users-table tbody');
        if (tbody) {
            tbody.innerHTML = users.map(user => `
                <tr>
                    <td>${user.userId}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <span class="badge ${this.getRoleBadgeClass(user.role)}">${user.role}</span>
                    </td>
                    <td>${user.phone || 'N/A'}</td>
                    <td>${new Date(user.joinDate).toLocaleDateString()}</td>
                </tr>
            `).join('');
        }
    }

    getRoleBadgeClass(role) {
        switch(role) {
            case 'ADMIN': return 'bg-danger';
            case 'PHARMACIST': return 'bg-primary';
            case 'CUSTOMER': return 'bg-success';
            default: return 'bg-secondary';
        }
    }

    validateEmail(input) {
        const email = input.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            input.setCustomValidity('Please enter a valid email address');
        } else {
            input.setCustomValidity('');
        }
    }

    validatePhone(input) {
        const phone = input.value;
        const phoneRegex = /^[0-9]{10}$/;
        
        if (phone && !phoneRegex.test(phone)) {
            input.setCustomValidity('Please enter a valid 10-digit phone number');
        } else {
            input.setCustomValidity('');
        }
    }

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Show notification
    showNotification(message, type = 'info') {
        const alertClass = {
            'success': 'alert-success',
            'error': 'alert-danger',
            'warning': 'alert-warning',
            'info': 'alert-info'
        }[type] || 'alert-info';

        const notification = document.createElement('div');
        notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        notification.innerHTML = `
            <strong>${type === 'success' ? '✅' : '⚠️'} </strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // API helper function
    async apiCall(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            this.showNotification('Operation failed. Please try again.', 'error');
            throw error;
        }
    }

    loadInitialData() {
        // Load any initial data needed
        console.log('Loading initial data...');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.medicineInventoryApp = new MedicineInventoryApp();
    
    // Add fade-in animation to all cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
});

// Utility function for formatting currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Utility function for formatting dates
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MedicineInventoryApp, formatCurrency, formatDate };
}