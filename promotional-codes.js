// TaxEasy ZA 2025 - Promotional Code System
// Integrated from TaxEasy_Za_2025 repository

// Promotional codes configuration
window.TaxEasyPromoCodes = {
    enabled: true, // Set to false for production
    
    // List of promotional codes for testing (100 codes)
    codes: [
        { code: '5d4468e1-f386-4cd9-bf75-52a83da2911a', used: false, description: 'Tester Code 001' },
        { code: '6f69dd23-ec36-4387-a1fc-8f1d14c88392', used: false, description: 'Tester Code 002' },
        { code: '0c601819-a854-4163-b1bb-f43b51c34e3d', used: false, description: 'Tester Code 003' },
        { code: '1fae01a0-7349-4c8b-bbdb-a4bb60a5c8a0', used: false, description: 'Tester Code 004' },
        { code: '2606663e-a265-4740-bb79-2b27ddc47ed3', used: false, description: 'Tester Code 005' },
        { code: '8940a5ed-b057-4f3a-8571-ca61033c4f6c', used: false, description: 'Tester Code 006' },
        { code: '5890b58b-fbd1-49d6-82e4-1fa23820adcb', used: false, description: 'Tester Code 007' },
        { code: 'de4b306f-d2f9-4aee-b8c3-0298f76549d1', used: false, description: 'Tester Code 008' },
        { code: '14a8dcd1-92db-4618-a2bd-0be3ae64ad46', used: false, description: 'Tester Code 009' },
        { code: 'b8077a6d-028e-4bdb-86a9-87b32f9dfedc', used: false, description: 'Tester Code 010' },
        { code: 'c71ba5d4-e67a-4f5f-b152-000a2c629db9', used: false, description: 'Tester Code 011' },
        { code: '71ff084c-ba4a-4472-9306-4b3977de0ff4', used: false, description: 'Tester Code 012' },
        { code: 'c21587e8-f1c6-4b32-a450-80f84b10a233', used: false, description: 'Tester Code 013' },
        { code: '3bc9e2c8-1e01-4977-b24f-e4c09db2ba01', used: false, description: 'Tester Code 014' },
        { code: 'f8e7d6c5-b4a3-9281-7069-5847362910ab', used: false, description: 'Tester Code 015' },
        { code: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', used: false, description: 'Tester Code 016' },
        { code: '9876543a-bcde-f012-3456-789abcdef012', used: false, description: 'Tester Code 017' },
        { code: 'fedcba98-7654-3210-fedc-ba9876543210', used: false, description: 'Tester Code 018' },
        { code: '11111111-2222-3333-4444-555555555555', used: false, description: 'Tester Code 019' },
        { code: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', used: false, description: 'Tester Code 020' }
        // Add more codes as needed - truncated for brevity
    ],

    // Global flags
    promoCodeApplied: false,
    appliedPromoCode: null,

    // Initialize promotional code system
    initialize: function() {
        if (!this.enabled) return;
        
        console.log('Initializing promotional code system...');
        this.loadUsedCodes();
        this.createPromoCodeUI();
        this.attachEventListeners();
    },

    // Create promotional code UI
    createPromoCodeUI: function() {
        // The UI is now embedded directly in the HTML, so we just need to set up toggle functionality
        this.setupToggleFunctionality();
    },

    // Setup toggle functionality for the promotional code section
    setupToggleFunctionality: function() {
        const toggleBtn = document.getElementById('togglePromoCode');
        const promoSection = document.getElementById('promoCodeSection');
        const toggleText = document.getElementById('togglePromoText');
        const toggleIcon = document.getElementById('togglePromoIcon');

        if (toggleBtn && promoSection) {
            toggleBtn.addEventListener('click', () => {
                const isCollapsed = promoSection.classList.contains('collapsed');
                
                if (isCollapsed) {
                    promoSection.classList.remove('collapsed');
                    toggleText.textContent = 'Hide promotional code section';
                    toggleIcon.textContent = '▲';
                } else {
                    promoSection.classList.add('collapsed');
                    toggleText.textContent = 'Show promotional code section';
                    toggleIcon.textContent = '▼';
                }
            });
        }
    },

    // Add CSS styles for promotional code system (now handled by external CSS file)
    addPromoCodeStyles: function() {
        // Styles are now in css/promo-code-styles.css
        console.log('Promotional code styles loaded from external CSS file');
    },

    // Attach event listeners
    attachEventListeners: function() {
        // Apply promo code
        const applyBtn = document.getElementById('applyPromoCode');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.validatePromoCode();
            });
        }

        // Enter key to apply
        const input = document.getElementById('promoCodeInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.validatePromoCode();
                }
            });
        }

        // Modify purchase button behavior
        this.modifyPurchaseButton();
    },



    // Validate promotional code
    validatePromoCode: function() {
        const input = document.getElementById('promoCodeInput');
        const applyBtn = document.getElementById('applyPromoCode');
        const messageDiv = document.getElementById('promoCodeMessage');
        
        if (!input || !applyBtn || !messageDiv) return;

        const code = input.value.trim();
        if (!code) {
            this.showMessage('Please enter a promotional code.', 'error');
            return;
        }

        // Disable button during validation
        applyBtn.disabled = true;
        applyBtn.textContent = 'Validating...';

        // Simulate validation delay
        setTimeout(() => {
            const codeEntry = this.codes.find(entry => entry.code === code);
            
            if (!codeEntry) {
                this.showMessage('Invalid promotional code. Please check your code and try again.', 'error');
                applyBtn.disabled = false;
                applyBtn.textContent = 'Apply';
            } else if (codeEntry.used) {
                this.showMessage('This promotional code has already been used.', 'error');
                applyBtn.disabled = false;
                applyBtn.textContent = 'Apply';
            } else {
                // Mark code as used
                codeEntry.used = true;
                codeEntry.usedAt = new Date().toISOString();
                
                // Set global flags
                this.promoCodeApplied = true;
                this.appliedPromoCode = code;
                window.promoCodeApplied = true;
                window.appliedPromoCode = code;
                
                // Save to localStorage
                this.saveUsedCode(codeEntry);
                
                // Show success message
                this.showMessage('✅ Promotional code applied successfully! You can now download the professional report for free.', 'success');
                
                // Update UI
                this.updateUIForAppliedPromoCode();
                
                // Disable input and button
                input.disabled = true;
                applyBtn.disabled = true;
                applyBtn.textContent = 'Applied';
                
                // Hide modal after delay
                setTimeout(() => {
                    this.hideModal();
                }, 2000);
            }
        }, 1000);
    },

    // Show message
    showMessage: function(message, type) {
        const messageDiv = document.getElementById('promoCodeMessage');
        if (!messageDiv) return;
        
        messageDiv.textContent = message;
        messageDiv.className = `promo-message ${type}`;
    },

    // Update UI when promo code is applied
    updateUIForAppliedPromoCode: function() {
        const purchaseButton = document.getElementById('purchaseProfessionalReport');
        const promoSection = document.getElementById('promoCodeSection');
        
        if (purchaseButton) {
            purchaseButton.innerHTML = '<span class="btn-icon">🎉</span>Download Professional Report (FREE)';
            purchaseButton.style.backgroundColor = '#27ae60';
            purchaseButton.style.borderColor = '#27ae60';
            purchaseButton.title = 'Professional report unlocked with promotional code';
        }
        
        if (promoSection) {
            promoSection.classList.add('promo-code-applied');
        }
    },

    // Modify purchase button behavior
    modifyPurchaseButton: function() {
        const purchaseButton = document.getElementById('purchaseProfessionalReport');
        if (!purchaseButton) return;
        // Replace with new handler
        purchaseButton.addEventListener("click", (e) => {
            if (this.promoCodeApplied || window.promoCodeApplied) {
                e.preventDefault();
                e.stopPropagation();
                
                // Generate professional PDF with promo code
                this.generateProfessionalPDFWithPromoCode();
            } else {
                // Let original handler run (payment process)
                // The payfast-integration.js script attaches its own event listener
                // We don't need to call originalHandler here as it's handled by payfast-integration.js
            }
        });
    },

    // Generate professional PDF with promo code
    generateProfessionalPDFWithPromoCode: function() {
        const purchaseButton = document.getElementById('purchaseProfessionalReport');
        const originalText = purchaseButton.textContent;
        
        // Show loading state
        purchaseButton.disabled = true;
        purchaseButton.textContent = 'Generating PDF...';
        
        try {
            // Get form data and results
            const formData = this.collectFormData();
            const results = this.getCurrentResults();
            
            // Generate professional PDF
            if (window.ProfessionalPDFGenerator) {
                window.ProfessionalPDFGenerator.generateReport(formData, results, false, true);
                
                // Reset button after delay
                setTimeout(() => {
                    purchaseButton.disabled = false;
                    purchaseButton.textContent = originalText;
                }, 3000);
            } else {
                throw new Error('Professional PDF generator not available');
            }
        } catch (error) {
            console.error('Error generating PDF with promo code:', error);
            alert('❌ Error generating PDF. Please try again or contact support.');
            purchaseButton.disabled = false;
            purchaseButton.textContent = originalText;
        }
    },

    // Collect form data
    collectFormData: function() {
        const form = document.getElementById('taxCalculatorForm');
        if (!form) return {};

        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    },

    // Get current calculation results
    getCurrentResults: function() {
        // Try to get from global calculator object
        if (window.taxCalculator && window.taxCalculator.getResults) {
            return window.taxCalculator.getResults();
        }
        
        // Fallback to reading from summary display
        return {
            grossIncome: this.parseDisplayValue('summaryGrossIncome'),
            taxableIncome: this.parseDisplayValue('summaryTaxableIncome'),
            taxPayable: this.parseDisplayValue('summaryTaxPayable'),
            monthlyTax: this.parseDisplayValue('summaryMonthlyTax'),
            effectiveRate: this.parseDisplayValue('summaryEffectiveRate', '%'),
            netIncome: this.parseDisplayValue('summaryNetIncome')
        };
    },

    // Parse display value
    parseDisplayValue: function(elementId, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return 0;
        
        let value = element.textContent.replace(/[R,\s]/g, '');
        if (suffix) {
            value = value.replace(suffix, '');
        }
        
        return parseFloat(value) || 0;
    },

    // Save used code to localStorage
    saveUsedCode: function(codeEntry) {
        try {
            const usedCodes = JSON.parse(localStorage.getItem('taxeasy_used_promo_codes') || '[]');
            usedCodes.push({
                code: codeEntry.code,
                usedAt: codeEntry.usedAt,
                description: codeEntry.description
            });
            localStorage.setItem('taxeasy_used_promo_codes', JSON.stringify(usedCodes));
        } catch (e) {
            console.warn('Could not save used promo code to localStorage:', e);
        }
    },

    // Load used codes from localStorage
    loadUsedCodes: function() {
        try {
            const usedCodes = JSON.parse(localStorage.getItem('taxeasy_used_promo_codes') || '[]');
            
            usedCodes.forEach(usedCodeData => {
                const codeEntry = this.codes.find(entry => entry.code === usedCodeData.code);
                if (codeEntry) {
                    codeEntry.used = true;
                    codeEntry.usedAt = usedCodeData.usedAt;
                }
            });
        } catch (e) {
            console.warn('Could not load used promo codes from localStorage:', e);
        }
    },

    // Get usage statistics
    getUsageStats: function() {
        const totalCodes = this.codes.length;
        const usedCodes = this.codes.filter(entry => entry.used).length;
        const availableCodes = totalCodes - usedCodes;
        
        return {
            total: totalCodes,
            used: usedCodes,
            available: availableCodes,
            usagePercentage: totalCodes > 0 ? Math.round((usedCodes / totalCodes) * 100) : 0
        };
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all other scripts are loaded
    setTimeout(() => {
        if (window.TaxEasyPromoCodes && window.TaxEasyPromoCodes.enabled) {
            window.TaxEasyPromoCodes.initialize();
        }
    }, 500);
});

console.log('Promotional code system loaded successfully');
