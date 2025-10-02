// TaxEasy ZA 2025 - Tax Helper Functions
// Utility functions for tax calculations and data formatting

window.TaxHelpers = {
    // Format currency for display
    formatCurrency: function(amount) {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return 'R 0.00';
        }
        return 'R ' + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    
    // Format number with thousand separators
    formatNumber: function(number) {
        if (number === null || number === undefined || isNaN(number)) {
            return '0';
        }
        return parseFloat(number).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    
    // Parse currency string to number
    parseCurrency: function(currencyString) {
        if (!currencyString) return 0;
        return parseFloat(currencyString.replace(/[^0-9.-]/g, '')) || 0;
    },
    
    // Validate South African ID number
    validateIDNumber: function(idNumber) {
        if (!idNumber || idNumber.length !== 13) {
            return false;
        }
        
        // Check if all characters are digits
        if (!/^\d+$/.test(idNumber)) {
            return false;
        }
        
        // Validate date part (YYMMDD)
        const year = parseInt(idNumber.substring(0, 2));
        const month = parseInt(idNumber.substring(2, 4));
        const day = parseInt(idNumber.substring(4, 6));
        
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return false;
        }
        
        // Validate using Luhn algorithm
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            let digit = parseInt(idNumber.charAt(i));
            if (i % 2 === 1) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
        }
        
        const checkDigit = (10 - (sum % 10)) % 10;
        return checkDigit === parseInt(idNumber.charAt(12));
    },
    
    // Validate email address
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Calculate age from ID number
    getAgeFromID: function(idNumber) {
        if (!idNumber || idNumber.length < 6) {
            return null;
        }
        
        const year = parseInt(idNumber.substring(0, 2));
        const month = parseInt(idNumber.substring(2, 4));
        const day = parseInt(idNumber.substring(4, 6));
        
        // Determine century (assume 00-30 is 2000s, 31-99 is 1900s)
        const fullYear = year <= 30 ? 2000 + year : 1900 + year;
        
        const birthDate = new Date(fullYear, month - 1, day);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    },
    
    // Get age group from age
    getAgeGroup: function(age) {
        if (age < 65) {
            return 'under_65';
        } else if (age >= 65 && age < 75) {
            return '65_to_74';
        } else {
            return '75_and_over';
        }
    },
    
    // Calculate percentage
    calculatePercentage: function(value, total) {
        if (!total || total === 0) return 0;
        return (value / total) * 100;
    },
    
    // Round to nearest cent
    roundToCent: function(amount) {
        return Math.round(amount * 100) / 100;
    },
    
    // Round to nearest rand
    roundToRand: function(amount) {
        return Math.round(amount);
    },
    
    // Clamp value between min and max
    clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    // Deep clone object
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Get tax year
    getTaxYear: function() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // JavaScript months are 0-indexed
        
        // Tax year runs from March to February
        if (month >= 3) {
            return year;
        } else {
            return year - 1;
        }
    },
    
    // Format date
    formatDate: function(date) {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    },
    
    // Calculate business days between two dates
    calculateBusinessDays: function(startDate, endDate) {
        let count = 0;
        const current = new Date(startDate);
        const end = new Date(endDate);
        
        while (current <= end) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        
        return count;
    },
    
    // Storage helpers
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                return false;
            }
        },
        
        get: function(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return null;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Error removing from localStorage:', e);
                return false;
            }
        },
        
        clear: function() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Error clearing localStorage:', e);
                return false;
            }
        }
    },
    
    // Validation helpers
    validation: {
        isPositiveNumber: function(value) {
            return !isNaN(value) && parseFloat(value) >= 0;
        },
        
        isInRange: function(value, min, max) {
            const num = parseFloat(value);
            return !isNaN(num) && num >= min && num <= max;
        },
        
        isEmpty: function(value) {
            return value === null || value === undefined || value === '';
        },
        
        isValidPercentage: function(value) {
            return this.isInRange(value, 0, 100);
        }
    }
};

// Global helper functions for backward compatibility
window.formatCurrency = window.TaxHelpers.formatCurrency;
window.formatNumber = window.TaxHelpers.formatNumber;
window.parseCurrency = window.TaxHelpers.parseCurrency;

console.log('Tax helpers loaded successfully');
