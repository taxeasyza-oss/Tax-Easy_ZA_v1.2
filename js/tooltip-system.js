// TaxEasy ZA 2025 - Tooltip System
// Provides contextual help and guidance throughout the application

window.TooltipSystem = {
    tooltipContainer: null,
    currentTooltip: null,
    
    // Initialize tooltip system
    init: function() {
        console.log('Initializing tooltip system...');
        
        this.createTooltipContainer();
        this.setupEventListeners();
        this.loadTooltipContent();
        
        console.log('Tooltip system initialized successfully');
    },
    
    // Create tooltip container
    createTooltipContainer: function() {
        this.tooltipContainer = document.createElement('div');
        this.tooltipContainer.className = 'tooltip-container';
        this.tooltipContainer.style.cssText = `
            position: absolute;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            background: #1f2937;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            line-height: 1.4;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            font-family: 'Inter', sans-serif;
        `;
        document.body.appendChild(this.tooltipContainer);
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Handle tooltip icons
        document.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('tooltip-icon') || e.target.hasAttribute('data-tooltip')) {
                this.showTooltip(e.target, e);
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target.classList.contains('tooltip-icon') || e.target.hasAttribute('data-tooltip')) {
                this.hideTooltip();
            }
        }, true);
        
        // Handle mouse movement for tooltip positioning
        document.addEventListener('mousemove', (e) => {
            if (this.currentTooltip) {
                this.positionTooltip(e);
            }
        });
        
        // Hide tooltip on scroll
        document.addEventListener('scroll', () => {
            this.hideTooltip();
        });
    },
    
    // Show tooltip
    showTooltip: function(element, event) {
        const tooltipText = this.getTooltipText(element);
        if (!tooltipText) return;
        
        this.tooltipContainer.textContent = tooltipText;
        this.tooltipContainer.style.opacity = '1';
        this.currentTooltip = element;
        
        this.positionTooltip(event);
    },
    
    // Hide tooltip
    hideTooltip: function() {
        this.tooltipContainer.style.opacity = '0';
        this.currentTooltip = null;
    },
    
    // Position tooltip
    positionTooltip: function(event) {
        if (!this.tooltipContainer || !this.currentTooltip) return;
        
        const tooltip = this.tooltipContainer;
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let left = mouseX + 10;
        let top = mouseY - tooltipRect.height - 10;
        
        // Adjust horizontal position if tooltip would go off-screen
        if (left + tooltipRect.width > viewportWidth) {
            left = mouseX - tooltipRect.width - 10;
        }
        
        // Adjust vertical position if tooltip would go off-screen
        if (top < 0) {
            top = mouseY + 10;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    },
    
    // Get tooltip text for element
    getTooltipText: function(element) {
        // Check for data-tooltip attribute
        if (element.hasAttribute('data-tooltip')) {
            const tooltipKey = element.getAttribute('data-tooltip');
            return this.tooltipContent[tooltipKey] || tooltipKey;
        }
        
        // Check for tooltip icon with predefined content
        if (element.classList.contains('tooltip-icon')) {
            const parentElement = element.closest('.form-group, .step-header');
            if (parentElement) {
                const label = parentElement.querySelector('label, h3');
                if (label) {
                    const fieldName = this.getFieldNameFromLabel(label.textContent);
                    return this.tooltipContent[fieldName] || 'Additional information about this field.';
                }
            }
        }
        
        return null;
    },
    
    // Extract field name from label text
    getFieldNameFromLabel: function(labelText) {
        return labelText.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    },
    
    // Load tooltip content
    loadTooltipContent: function() {
        this.tooltipContent = {
            // Personal Information - Enhanced for clarity and SARS compliance
            'full_name': 'Enter your full legal name exactly as it appears on your South African ID document. This ensures SARS compliance.',
            'id_number': 'Your 13-digit South African ID number or passport number. Required for SARS verification and tax compliance.',
            'age_group': 'CRITICAL: Your age determines tax rebates. Under 65: R17,235 rebate. 65-74: R26,679 rebate. 75+: R29,841 rebate.',
            'occupation': 'Select your primary occupation. This may qualify you for specific deductions (e.g., teachers, healthcare workers).',
            'email_address': 'Valid email required for tax reports. We\'ll send your calculation summary and professional reports here.',
            
            // Income Information
            'basic_salary': 'Your annual basic salary before any deductions. This should match the amount on your IRP5 certificate.',
            'bonus': 'Any bonus payments received during the tax year. Include 13th cheques, performance bonuses, and similar payments.',
            'overtime': 'Total overtime payments received during the tax year. This is typically shown separately on your IRP5.',
            'travel_allowance': 'Annual travel allowance received from your employer. This may be partially taxable depending on usage.',
            'cellphone_allowance': 'Annual cellphone allowance provided by your employer for business use.',
            'other_allowances': 'Any other allowances not listed above, such as housing, entertainment, or tool allowances.',
            'interest_income': 'Interest earned from bank accounts, investments, and loans. The first R23,800 (R34,500 for 65+) is tax-free.',
            'dividend_income': 'Dividends received from South African companies. Local dividends are generally exempt from income tax.',
            'rental_income': 'Gross rental income from properties you own. You can deduct related expenses separately.',
            'taxes_paid': 'Total PAYE tax and other taxes already deducted by your employer or paid during the year.',
            
            // Standard Deductions
            'pension_fund': 'Contributions to your employer\'s pension fund. These are tax-deductible up to 27.5% of your salary.',
            'provident_fund': 'Contributions to your employer\'s provident fund. Also deductible up to 27.5% of your salary.',
            'retirement_annuity': 'Contributions to private retirement annuities. Deductible up to 27.5% of taxable income, max R350,000.',
            'medical_aid': 'Annual contributions to registered medical aid schemes. These contributions are tax-deductible.',
            'medical_members': 'Number of main members covered by your medical aid. Each member qualifies for monthly tax credits.',
            'medical_dependants': 'Number of dependants on your medical aid. Each dependant qualifies for additional monthly tax credits.',
            'donations': 'Donations to registered charities with Section 18A certificates. Deductible up to 10% of taxable income.',
            
            // Advanced Deductions
            'home_office': 'Expenses for maintaining a home office used exclusively for work. Maximum deduction is R15,000 per year.',
            'travel_expenses': 'Business travel expenses not reimbursed by your employer. Keep detailed records and receipts.',
            'professional_fees': 'Fees paid to professional bodies, licenses, and subscriptions required for your work.',
            'solar_pv': 'Investment in solar photovoltaic systems. Deductible up to R1,000,000 over multiple years.',
            'solar_water_heating': 'Investment in solar water heating systems. 25% of the cost is deductible in the year of installation.',
            'other_renewable': 'Other qualifying renewable energy investments such as wind or biogas systems.',
            
            // General tooltips
            'personal_info_title': 'We need some basic information about you to calculate your tax correctly and apply the appropriate rebates.',
            'income_info_title': 'Enter all your income sources as shown on your IRP5 and other tax certificates. This ensures accurate tax calculation.',
            'deductions_title': 'These are the most common tax deductions. Enter the amounts you contributed or paid during the tax year.',
            'advanced_deductions_title': 'Additional deductions for specific circumstances, occupation-related expenses, and renewable energy investments.',
            'summary_title': 'Review your complete tax calculation. You can generate a basic report for free or purchase a comprehensive professional report.'
        };
    },
    
    // Add tooltip to element programmatically
    addTooltip: function(element, tooltipText) {
        element.setAttribute('data-tooltip', tooltipText);
    },
    
    // Remove tooltip from element
    removeTooltip: function(element) {
        element.removeAttribute('data-tooltip');
    },
    
    // Update tooltip content
    updateTooltipContent: function(key, content) {
        this.tooltipContent[key] = content;
    }
};

// Global function to initialize tooltips
window.initializeTooltips = function() {
    window.TooltipSystem.init();
};

// Global functions for programmatic tooltip management
window.addTooltip = function(element, text) {
    window.TooltipSystem.addTooltip(element, text);
};

window.removeTooltip = function(element) {
    window.TooltipSystem.removeTooltip(element);
};

console.log('Tooltip system loaded successfully');
