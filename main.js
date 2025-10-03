// TaxEasy ZA 2025 - Main Application Controller
// Coordinates all application modules and handles global functionality

window.TaxEasyApp = {
    version: '2.1.0',
    initialized: false,
    
    // Initialize the application
    init: function() {
        console.log(`TaxEasy ZA ${this.version} - Initializing application...`);
        
        if (this.initialized) {
            console.log('Application already initialized');
            return;
        }
        
        try {
            // Initialize core modules
            this.initializeModules();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Initialize UI components
            this.initializeUI();
            
            // Load user preferences
            this.loadUserPreferences();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Mark as initialized
            this.initialized = true;
            
            console.log('TaxEasy ZA application initialized successfully');
            
            // Show welcome message for first-time users
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('Error initializing application:', error);
            this.handleInitializationError(error);
        }
    },
    
    // Initialize all modules
    initializeModules: function() {
        console.log('Initializing application modules...');
        
        // Initialize wizard navigation
        if (typeof window.WizardNavigation !== 'undefined' && window.WizardNavigation) {
            console.log('Initializing wizard navigation...');
            window.WizardNavigation.init();
        } else {
            console.error('WizardNavigation not found - cannot initialize application');
            throw new Error('WizardNavigation module is not loaded');
        }
        
        // Initialize tooltip system
        if (typeof window.TooltipSystem !== 'undefined' && window.TooltipSystem) {
            console.log('Initializing tooltip system...');
            window.TooltipSystem.init();
        } else {
            console.warn('TooltipSystem not found - tooltips will not work');
        }
        
        // Initialize payment integration
        if (typeof window.PaymentIntegration !== 'undefined' && window.PaymentIntegration) {
            console.log('Initializing payment integration...');
            window.PaymentIntegration.init();
        } else {
            console.warn('PaymentIntegration not found - payment features will not work');
        }
        
        console.log('All modules initialized successfully');
    },
    
    // Setup global event listeners
    setupGlobalEventListeners: function() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveApplicationState();
            } else {
                this.restoreApplicationState();
            }
        });
        
        // Handle before page unload
        window.addEventListener('beforeunload', (e) => {
            this.saveApplicationState();
            
            // Check if user has unsaved changes
            if (this.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.handleOnlineStatus(true);
        });
        
        window.addEventListener('offline', () => {
            this.handleOnlineStatus(false);
        });
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Handle form auto-save
        document.addEventListener("input", (e) => {
            if (e.target.closest("#taxCalculatorForm")) {
                this.scheduleAutoSave();
            }
        });
        
        // Handle dropdown changes (change event for select elements)
        document.addEventListener("change", (e) => {
            if (e.target.closest("#taxCalculatorForm")) {
                this.scheduleAutoSave();
                
                // Handle travel method change for dynamic field visibility and guidance
                if (e.target.id === 'travelMethod') {
                    this.handleTravelMethodChange(e.target.value);
                }
            }
        });
    },
    
    // Handle travel method change
    handleTravelMethodChange: function(travelMethod) {
        const businessKmGroup = document.getElementById('businessKmGroup');
        const travelMethodGuidance = document.getElementById('travelMethodGuidance');
        const actualTravelExpensesGroup = document.getElementById('actualTravelExpensesGroup');

        // Show/hide business kilometers field
        if (businessKmGroup) {
            businessKmGroup.style.display = (travelMethod === 'deemed_rate') ? 'block' : 'none';
        }

        // Show/hide actual travel expenses field
        if (actualTravelExpensesGroup) {
            actualTravelExpensesGroup.style.display = (travelMethod === 'actual_cost') ? 'block' : 'none';
        }

        // Update guidance text
        if (travelMethodGuidance) {
            const guidanceText = this.travelGuidanceMessages[travelMethod];
            if (guidanceText) {
                travelMethodGuidance.textContent = guidanceText;
                travelMethodGuidance.style.display = 'block';
            } else {
                travelMethodGuidance.style.display = 'none';
            }
        }
    },
    
    // Initialize UI components
    initializeUI: function() {
        // Initialize POPIA consent
        this.initializePopiaConsent();
        
        // Initialize tax tips rotation
        this.initializeTaxTips();
        
        // Initialize progress tracking
        this.initializeProgressTracking();
        
        // Initialize responsive behavior
        this.initializeResponsiveBehavior();
        
        // Initialize accessibility features
        this.initializeAccessibility();

        // Set initial state for travel allowance UI
        this.updateTravelAllowanceUI();
    },
    
    // Update travel allowance UI based on selected method
    updateTravelAllowanceUI: function() {
        const travelMethodSelect = document.getElementById("travelMethod");
        const businessKmGroup = document.getElementById("businessKmGroup");
        const actualCostGroup = document.getElementById("actualCostGroup");
        const travelMethodGuidance = document.getElementById("travelMethodGuidance");

        if (travelMethodSelect && businessKmGroup && travelMethodGuidance) {
            const travelMethod = travelMethodSelect.value;

            // Show/hide appropriate groups based on selected method
            businessKmGroup.style.display = (travelMethod === "deemed_rate") ? "block" : "none";
            
            if (actualCostGroup) {
                actualCostGroup.style.display = (travelMethod === "actual_cost") ? "grid" : "none"; // Use grid for form-grid-nested
            }

            const guidanceText = this.travelGuidanceMessages[travelMethod];
            if (guidanceText) {
                travelMethodGuidance.textContent = guidanceText;
                travelMethodGuidance.style.display = "block";
            } else {
                travelMethodGuidance.style.display = "none";
            }
        }
    },

    // Initialize POPIA consent management
    initializePopiaConsent: function() {
        const consent = localStorage.getItem('popiaConsent');
        const consentBanner = document.getElementById('popiaConsent');
        
        if (!consent && consentBanner) {
            consentBanner.style.display = 'block';
            
            // Adjust body padding to account for banner
            document.body.style.paddingTop = '80px';
        }
        
        // Setup consent buttons
        const acceptBtn = document.getElementById('acceptPopia');
        const declineBtn = document.getElementById('declinePopia');
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('popiaConsent', 'accepted');
                localStorage.setItem('popiaConsentDate', new Date().toISOString());
                consentBanner.style.display = 'none';
                document.body.style.paddingTop = '0';
                
                console.log('POPIA consent accepted');
            });
        }
        
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                alert('You must accept our privacy policy to use this service. Please review our privacy policy and try again.');
            });
        }
    },
    
    // Initialize tax tips rotation
    initializeTaxTips: function() {
        this.taxTips = [
            "Complete all sections for the most accurate tax calculation and maximize your refund potential.",
            "Keep all your tax documents organized - IRP5, medical aid certificates, and donation receipts.",
            "Consider contributing to a retirement annuity to reduce your taxable income.",
            "Medical aid contributions can provide significant tax credits - don't forget to include dependants.",
            "Home office expenses are deductible up to R15,000 per year for qualifying taxpayers.",
            "Solar panel installations can provide substantial tax deductions - up to R1 million.",
            "Professional fees and licenses are often tax deductible - include membership fees.",
            "Travel allowances may be partially taxable - ensure you claim legitimate travel expenses.",
            "Donations to registered charities are deductible up to 10% of your taxable income.",
            "Keep detailed records of all deductible expenses for SARS verification."
        ];
        
        this.currentTipIndex = 0;
        
        // Auto-rotate tips every 30 seconds
        setInterval(() => {
            this.rotateTip();
        }, 30000);
    },
    
    // Rotate tax tip
    rotateTip: function() {
        this.currentTipIndex = (this.currentTipIndex + 1) % this.taxTips.length;
        const tipElement = document.getElementById('currentTip');
        
        if (tipElement) {
            // Add fade effect
            tipElement.style.opacity = '0.5';
            
            setTimeout(() => {
                tipElement.textContent = this.taxTips[this.currentTipIndex];
                tipElement.style.opacity = '1';
            }, 300);
        }
    },
    
    // Initialize progress tracking
    initializeProgressTracking: function() {
        // Update progress every 2 seconds
        setInterval(() => {
            if (typeof window.WizardNavigation !== 'undefined') {
                window.WizardNavigation.updateProgress();
            }
        }, 2000);
    },
    
    // Initialize responsive behavior
    initializeResponsiveBehavior: function() {
        // Handle mobile menu if needed
        this.handleMobileLayout();
        
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleMobileLayout();
            }, 100);
        });
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleMobileLayout();
            }, 250);
        });
    },
    
    // Handle mobile layout adjustments
    handleMobileLayout: function() {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile-layout', isMobile);
        
        // Adjust wizard step indicator for mobile
        const stepIndicator = document.querySelector('.step-indicator');
        if (stepIndicator) {
            stepIndicator.classList.toggle('mobile-steps', isMobile);
        }
    },
    
    // Initialize accessibility features
    initializeAccessibility: function() {
        // Add skip navigation link
        this.addSkipNavigation();
        
        // Enhance keyboard navigation
        this.enhanceKeyboardNavigation();
        
        // Add ARIA labels where needed
        this.addAriaLabels();
        
        // Handle focus management
        this.setupFocusManagement();
    },
    
    // Add skip navigation for accessibility
    addSkipNavigation: function() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-navigation';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 10001;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content ID
        const mainContent = document.querySelector('.main');
        if (mainContent) {
            mainContent.id = 'main-content';
        }
    },
    
    // Enhance keyboard navigation
    enhanceKeyboardNavigation: function() {
        // Make step indicators keyboard accessible
        const steps = document.querySelectorAll('.step-indicator .step');
        steps.forEach((step, index) => {
            step.setAttribute('tabindex', '0');
            step.setAttribute('role', 'button');
            step.setAttribute('aria-label', `Go to step ${index + 1}`);
            
            step.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    step.click();
                }
            });
        });
    },
    
    // Add ARIA labels
    addAriaLabels: function() {
        // Add labels to form sections
        const formSections = document.querySelectorAll('.wizard-step');
        formSections.forEach((section, index) => {
            section.setAttribute('role', 'tabpanel');
            section.setAttribute('aria-labelledby', `step-${index + 1}-title`);
        });
        
        // Add labels to progress indicators
        const progressStats = document.querySelectorAll('.stat-item');
        progressStats.forEach(stat => {
            const label = stat.querySelector('.stat-label');
            const number = stat.querySelector('.stat-number');
            if (label && number) {
                number.setAttribute('aria-label', `${label.textContent}: ${number.textContent}`);
            }
        });
    },
    
    // Setup focus management
    setupFocusManagement: function() {
        // Focus first input when step changes
        document.addEventListener('stepChanged', (e) => {
            setTimeout(() => {
                const activeStep = document.querySelector('.wizard-step.active');
                if (activeStep) {
                    const firstInput = activeStep.querySelector('input, select, textarea');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }
            }, 100);
        });
    },
    
    // Handle keyboard shortcuts
    handleKeyboardShortcuts: function(e) {
        // Ctrl/Cmd + S to save progress
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveApplicationState();
            this.showNotification('Progress saved', 'success');
        }
        
        // Ctrl/Cmd + R to reset form (with confirmation)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
                this.resetApplication();
            }
        }
        
        // F1 for help
        if (e.key === 'F1') {
            e.preventDefault();
            this.showHelp();
        }
    },
    
    // Handle online/offline status
    handleOnlineStatus: function(isOnline) {
        const statusMessage = isOnline ? 'Connection restored' : 'You are offline';
        const statusType = isOnline ? 'success' : 'warning';
        
        this.showNotification(statusMessage, statusType);
        
        // Update UI to reflect connection status
        document.body.classList.toggle('offline', !isOnline);
    },
    
    // Schedule auto-save
    scheduleAutoSave: function() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveApplicationState();
        }, 5000); // Auto-save after 5 seconds of inactivity
    },
    
    // Save application state
    saveApplicationState: function() {
        try {
            const state = {
                timestamp: new Date().toISOString(),
                currentStep: window.WizardNavigation?.currentStep || 1,
                formData: window.WizardNavigation?.formData || {},
                version: this.version
            };
            
            localStorage.setItem('taxeasy_app_state', JSON.stringify(state));
            console.log('Application state saved');
        } catch (error) {
            console.error('Error saving application state:', error);
        }
    },
    
    // Restore application state
    restoreApplicationState: function() {
        try {
            const savedState = localStorage.getItem('taxeasy_app_state');
            if (savedState) {
                const state = JSON.parse(savedState);
                
                // Check version compatibility
                if (state.version === this.version) {
                    // Restore wizard state
                    if (window.WizardNavigation && state.currentStep) {
                        window.WizardNavigation.showStep(state.currentStep);
                    }
                    
                    console.log('Application state restored');
                }
            }
        } catch (error) {
            console.error('Error restoring application state:', error);
        }
    },
    
    // Check for unsaved changes
    hasUnsavedChanges: function() {
        const form = document.getElementById('taxCalculatorForm');
        if (!form) return false;
        
        const inputs = form.querySelectorAll('input, select, textarea');
        for (let input of inputs) {
            if (input.value && input.value.trim() !== '') {
                return true;
            }
        }
        
        return false;
    },
    
    // Load user preferences
    loadUserPreferences: function() {
        const preferences = localStorage.getItem('taxeasy_preferences');
        if (preferences) {
            try {
                this.userPreferences = JSON.parse(preferences);
                this.applyUserPreferences();
            } catch (error) {
                console.error('Error loading user preferences:', error);
            }
        } else {
            this.userPreferences = this.getDefaultPreferences();
        }
    },
    
    // Get default preferences
    getDefaultPreferences: function() {
        return {
            theme: 'light',
            autoSave: true,
            notifications: true,
            accessibility: false
        };
    },
    
    // Show a notification message
    showNotification: function(message, type = 'info', duration = 5000) {
        const notificationContainer = document.getElementById('notificationContainer');
        if (!notificationContainer) {
            console.warn('Notification container not found.');
            return;
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        notificationContainer.appendChild(notification);

        // Automatically remove the notification after a duration
        setTimeout(() => {
            notification.classList.add('hide');
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
        }, duration);
    },

    // Apply user preferences
    applyUserPreferences: function() {
        // Apply theme
        if (this.userPreferences.theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        // Apply accessibility settings
        if (this.userPreferences.accessibility) {
            document.body.classList.add('high-contrast');
        }
    },
    
    // Travel allowance guidance messages
    travelGuidanceMessages: {
        fully_taxable: "If you receive a travel allowance but do not use your private vehicle for business purposes, or do not keep a logbook, the full allowance will be taxed. No deduction can be claimed.",
        deemed_rate: "This method uses SARS-prescribed rates per kilometer for business travel. You MUST keep a detailed logbook to claim this deduction. The non-taxable portion is calculated based on your business kilometers.",
        actual_cost: "This method allows you to claim actual costs incurred for business travel. You MUST keep a detailed logbook and all receipts for fuel, maintenance, insurance, and depreciation. This method is more complex but can result in higher deductions if your actual costs exceed the deemed rate."
    },

    // Setup error handling
    setupErrorHandling: function() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.handleError(e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.handleError(e.reason);
        });
    },
    
    // Handle errors
    handleError: function(error) {
        console.error('Application error:', error);
        
        // Show user-friendly error message
        this.showNotification('An error occurred. Please try again.', 'error');
        
        // Log error for debugging (in production, send to error tracking service)
        this.logError(error);
    },
    
    // Handle initialization errors
    handleInitializationError: function(error) {
        console.error('Initialization error:', error);
        console.error('Error stack:', error.stack);
        console.error('Error message:', error.message);
        
        // Log the error for debugging
        this.logError(error);
        
        // Try to show error in a less destructive way
        const mainElement = document.querySelector('.main');
        if (mainElement) {
            // Insert error message at the top of main content
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'background: #fee; border: 2px solid #c00; padding: 20px; margin: 20px; border-radius: 8px; text-align: center;';
            errorDiv.innerHTML = `
                <h2 style="color: #c00; margin: 0 0 10px 0;">Initialization Error</h2>
                <p>There was an error loading the application: ${error.message}</p>
                <p style="font-size: 0.9em; color: #666;">Check the browser console for more details.</p>
                <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                    Refresh Page
                </button>
            `;
            mainElement.insertBefore(errorDiv, mainElement.firstChild);
        } else {
            // Fallback: replace entire body only if we can't find main element
            document.body.innerHTML = `
                <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                    <h1>TaxEasy ZA</h1>
                    <p>Sorry, there was an error loading the application.</p>
                    <p style="color: #c00;">${error.message}</p>
                    <p>Please refresh the page and try again.</p>
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Refresh Page
                    </button>
                </div>
            `;
        }
    },
    
    // Log error for debugging
    logError: function(error) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            error: error.toString(),
            stack: error.stack,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Store locally for debugging
        const errors = JSON.parse(localStorage.getItem('taxeasy_errors') || '[]');
        errors.push(errorLog);
        
        // Keep only last 10 errors
        if (errors.length > 10) {
            errors.splice(0, errors.length - 10);
        }
        
        localStorage.setItem('taxeasy_errors', JSON.stringify(errors));
    },
    
    // Show notification
    notificationTimeout: null,
    showNotification: function(message, type = 'info', duration = 3000) {
        // Check if notifications are enabled in user preferences
        if (this.userPreferences && !this.userPreferences.notifications) return;

        // Create a container for notifications if it doesn't exist
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Append to container
        notificationContainer.appendChild(notification);

        // Automatically remove the notification after a duration
        setTimeout(() => {
            notification.classList.add('hide');
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
        }, duration);
    },
    
    // Show welcome message for first-time users
    showWelcomeMessage: function() {
        const hasVisited = localStorage.getItem('taxeasy_visited');
        if (!hasVisited) {
            setTimeout(() => {
                this.showNotification('Welcome to TaxEasy ZA 2025! Complete all steps for accurate tax calculation.', 'info');
                localStorage.setItem('taxeasy_visited', 'true');
            }, 2000);
        }
    },
    
    // Show help
    showHelp: function() {
        window.open('faq.html', '_blank');
    },
    
    // Reset application
    resetApplication: function() {
        localStorage.removeItem('taxeasy_app_state');
        localStorage.removeItem('taxEasyFormData');
        location.reload();
    }
};

// Global functions
window.rotateTip = function() {
    window.TaxEasyApp.rotateTip();
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.TaxEasyApp.init();
});

console.log('TaxEasy ZA main application controller loaded successfully');



// Add travel guidance messages to the TaxEasyApp object
window.TaxEasyApp.travelGuidanceMessages = {
    fully_taxable: "The full travel allowance will be added to your taxable income. No deductions are claimed.",
    deemed_rate: "You will claim business travel deductions based on SARS prescribed rates per kilometer. A detailed logbook is required.",
    actual_cost: "You will claim actual vehicle expenses (fuel, maintenance, insurance, etc.) as a deduction. A detailed logbook and all receipts are required. Only the business-use portion is deductible. Please provide detailed costs below."
};

// Add clear all data functionality
window.TaxEasyApp.clearAllData = function() {
    if (confirm('Are you sure you want to clear all entered data? This action cannot be undone.')) {
        // Reset the form
        const form = document.getElementById('taxCalculatorForm');
        if (form) {
            form.reset();
        }
        
        // Clear all summary displays
        const summaryElements = [
            'summaryGrossIncome', 'summaryDeductions', 'summaryTaxableIncome',
            'summaryTaxBeforeRebates', 'summaryRebates', 'summaryTaxAfterRebates',
            'summaryMedicalCredits', 'summaryNetTax', 'summaryTaxesPaid', 'finalResult'
        ];
        
        summaryElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'R0';
            }
        });
        
        // Reset result styling
        const finalResult = document.getElementById('finalResult');
        const resultLabel = document.getElementById('resultLabel');
        if (finalResult) {
            finalResult.className = 'result-amount';
        }
        if (resultLabel) {
            resultLabel.textContent = 'Estimated Result:';
        }
        
        // Hide the clear data button
        const clearBtn = document.getElementById('clearDataBtn');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
        
        // Go back to step 1
        if (typeof window.WizardNavigation !== 'undefined') {
            window.WizardNavigation.goToStep(1);
        }
        
        // Clear local storage
        localStorage.removeItem('taxCalculatorData');
        
        // Show notification
        this.showNotification('All data has been cleared successfully', 'success');
        
        console.log('All tax calculator data cleared');
    }
};
