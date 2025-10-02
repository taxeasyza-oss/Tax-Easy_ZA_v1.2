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
        // Check if UI already exists
        if (document.getElementById('promoCodeModal')) return;

        // Create modal HTML
        const modalHTML = `
            <div id="promoCodeModal" class="promo-modal" style="display: none;">
                <div class="promo-modal-overlay"></div>
                <div class="promo-modal-content">
                    <div class="promo-modal-header">
                        <h3>Enter Promotional Code</h3>
                        <button class="promo-modal-close" id="closePromoModal">&times;</button>
                    </div>
                    <div class="promo-modal-body">
                        <p>Have a promotional code? Enter it below to access the Professional Report for free.</p>
                        <div class="promo-input-group">
                            <input type="text" id="promoCodeInput" placeholder="Enter promotional code" maxlength="36">
                            <button id="applyPromoCode">Apply</button>
                        </div>
                        <div id="promoCodeMessage" class="promo-message"></div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Create promotional code link
        const promoLink = document.createElement('div');
        promoLink.innerHTML = `
            <div class="promo-code-link-container">
                <a href="#" id="showPromoCodeLink" class="promo-code-link">
                    Have a promotional code? Click here
                </a>
            </div>
        `;

        // Add link to the summary section
        const summarySection = document.querySelector('.wizard-step[data-step="5"]');
        if (summarySection) {
            summarySection.appendChild(promoLink);
        }

        // Add CSS styles
        this.addPromoCodeStyles();
    },

    // Add CSS styles for promotional code system
    addPromoCodeStyles: function() {
        const styles = `
            <style id="promoCodeStyles">
                .promo-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                }
                
                .promo-modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                }
                
                .promo-modal-content {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                .promo-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .promo-modal-header h3 {
                    margin: 0;
                    color: #2c3e50;
                    font-size: 1.25rem;
                }
                
                .promo-modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #6c757d;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }
                
                .promo-modal-close:hover {
                    background: #f8f9fa;
                    color: #495057;
                }
                
                .promo-modal-body {
                    padding: 1.5rem;
                }
                
                .promo-modal-body p {
                    margin-bottom: 1rem;
                    color: #6c757d;
                    line-height: 1.5;
                }
                
                .promo-input-group {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }
                
                .promo-input-group input {
                    flex: 1;
                    padding: 0.75rem;
                    border: 2px solid #e9ecef;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    transition: border-color 0.2s ease;
                }
                
                .promo-input-group input:focus {
                    outline: none;
                    border-color: #3498db;
                }
                
                .promo-input-group button {
                    padding: 0.75rem 1.5rem;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s ease;
                }
                
                .promo-input-group button:hover:not(:disabled) {
                    background: #2980b9;
                }
                
                .promo-input-group button:disabled {
                    background: #bdc3c7;
                    cursor: not-allowed;
                }
                
                .promo-message {
                    padding: 0.75rem;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    line-height: 1.4;
                    display: none;
                }
                
                .promo-message.success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                    display: block;
                }
                
                .promo-message.error {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                    display: block;
                }
                
                .promo-code-link-container {
                    text-align: center;
                    margin: 1rem 0;
                    padding: 1rem;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border: 1px dashed #dee2e6;
                }
                
                .promo-code-link {
                    color: #3498db;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.9rem;
                    transition: color 0.2s ease;
                }
                
                .promo-code-link:hover {
                    color: #2980b9;
                    text-decoration: underline;
                }
                
                @media (max-width: 768px) {
                    .promo-modal-content {
                        width: 95%;
                        margin: 1rem;
                    }
                    
                    .promo-input-group {
                        flex-direction: column;
                    }
                    
                    .promo-input-group button {
                        width: 100%;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    },

    // Attach event listeners
    attachEventListeners: function() {
        // Show modal link
        const showLink = document.getElementById('showPromoCodeLink');
        if (showLink) {
            showLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal();
            });
        }

        // Close modal
        const closeBtn = document.getElementById('closePromoModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideModal();
            });
        }

        // Close modal on overlay click
        const overlay = document.querySelector('.promo-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.hideModal();
            });
        }

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
                    this.validatePromoCode();
                }
            });
        }

        // Modify purchase button behavior
        this.modifyPurchaseButton();
    },

    // Show modal
    showModal: function() {
        const modal = document.getElementById('promoCodeModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Focus on input
            setTimeout(() => {
                const input = document.getElementById('promoCodeInput');
                if (input) input.focus();
            }, 100);
        }
    },

    // Hide modal
    hideModal: function() {
        const modal = document.getElementById('promoCodeModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
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
        const showPromoLink = document.getElementById('showPromoCodeLink');
        
        if (purchaseButton) {
            purchaseButton.textContent = 'Download Professional Report (FREE)';
            purchaseButton.style.backgroundColor = '#27ae60';
            purchaseButton.style.borderColor = '#27ae60';
            purchaseButton.title = 'Professional report unlocked with promotional code';
        }
        
        if (showPromoLink) {
            showPromoLink.style.display = 'none';
        }

        // Add success indicator
        const linkContainer = document.querySelector('.promo-code-link-container');
        if (linkContainer) {
            linkContainer.innerHTML = `
                <div style="color: #27ae60; font-weight: 600;">
                    ✅ Promotional code applied successfully!
                </div>
            `;
        }
    },

    // Modify purchase button behavior
    modifyPurchaseButton: function() {
        const purchaseButton = document.getElementById('purchaseProfessionalReport');
        if (!purchaseButton) return;

        // Store original click handler
        const originalHandler = purchaseButton.onclick;
        
        // Replace with new handler
        purchaseButton.onclick = (e) => {
            if (this.promoCodeApplied || window.promoCodeApplied) {
                e.preventDefault();
                e.stopPropagation();
                
                // Generate professional PDF with promo code
                this.generateProfessionalPDFWithPromoCode();
            } else {
                // Let original handler run (payment process)
                if (originalHandler) {
                    originalHandler.call(purchaseButton, e);
                }
            }
        };
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
