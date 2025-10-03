// TaxEasy ZA 2025 - Wizard Navigation System
// Handles multi-step form navigation with validation and progress tracking

window.WizardNavigation = {
    currentStep: 1,
    totalSteps: 5,
    formData: {},
    
    // Initialize the wizard
    init: function() {
        console.log('Initializing wizard navigation...');
        
        try {
            // Check if required elements exist
            const steps = document.querySelectorAll('.wizard-step');
            if (steps.length === 0) {
                console.error('No wizard steps found in the DOM');
                throw new Error('Wizard steps not found');
            }
            
            this.showStep(this.currentStep);
            this.updateNavigation();
            this.updateStepIndicator();
            this.updateProgress();
            this.setupEventListeners();
            
            console.log('Wizard navigation initialized successfully');
        } catch (error) {
            console.error('Error initializing wizard navigation:', error);
            throw error; // Re-throw to be caught by main app
        }
    },
    
    // Show specific step
    showStep: function(stepNum) {
        console.log(`Showing step ${stepNum}`);
        
        // Hide all steps
        const steps = document.querySelectorAll('.wizard-step');
        steps.forEach((step, index) => {
            if (index + 1 === stepNum) {
                step.classList.add('active');
                step.style.display = 'block';
            } else {
                step.classList.remove('active');
                step.style.display = 'none';
            }
        });
        
        // Update current step
        this.currentStep = stepNum;
        
        // Update UI elements
        this.updateStepIndicator();
        this.updateNavigation();
        this.updateProgress();
        
        // Scroll to top of page
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
        
        // Also scroll wizard container into view as fallback
        const wizardContainer = document.querySelector('.wizard-container');
        if (wizardContainer) {
            setTimeout(() => {
                wizardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
        
        // If we're on the summary step, calculate and display results
        if (stepNum === 5) {
            this.calculateAndDisplayResults();
        }
    },
    
    // Update navigation buttons
    updateNavigation: function() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-flex';
        }
        
        if (nextBtn) {
            if (this.currentStep === this.totalSteps) {
                nextBtn.textContent = 'Generate Report';
                nextBtn.classList.add('final-step');
            } else {
                nextBtn.textContent = 'Next →';
                nextBtn.classList.remove('final-step');
            }
        }
    },
    
    // Update step indicator
    updateStepIndicator: function() {
        const stepIndicators = document.querySelectorAll('.step-indicator .step');
        
        stepIndicators.forEach((indicator, index) => {
            const stepNumber = index + 1;
            
            // Remove all state classes
            indicator.classList.remove('active', 'completed');
            
            // Add appropriate state class
            if (stepNumber === this.currentStep) {
                indicator.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                indicator.classList.add('completed');
            }
        });
    },
    
    // Update progress tracking
    updateProgress: function() {
        const form = document.getElementById('taxCalculatorForm');
        if (!form) return;
        
        // Get all form inputs
        const inputs = form.querySelectorAll('input[type="number"], input[type="text"], input[type="email"], select');
        let completedFields = 0;
        let totalFields = inputs.length;
        
        // Count completed fields
        inputs.forEach(input => {
            if (input.type === 'number' && parseFloat(input.value) > 0) {
                completedFields++;
            } else if ((input.type === 'text' || input.type === 'email') && input.value.trim() !== '') {
                completedFields++;
            } else if (input.tagName === 'SELECT' && input.value !== '') {
                completedFields++;
            }
        });
        
        // Calculate completion percentage
        const completionPercentage = Math.round((completedFields / totalFields) * 100);
        
        // Estimate time remaining
        const baseTime = 5; // 5 minutes base time
        const timeRemaining = Math.max(1, Math.round(baseTime * (1 - completionPercentage / 100)));
        
        // Update display
        const completionElement = document.getElementById('completionPercentage');
        const timeElement = document.getElementById('estimatedTime');
        const fieldsElement = document.getElementById('fieldsCompleted');
        
        if (completionElement) {
            completionElement.textContent = `${completionPercentage}%`;
        }
        
        if (timeElement) {
            timeElement.textContent = `${timeRemaining} min`;
        }
        
        if (fieldsElement) {
            fieldsElement.textContent = `${completedFields}/${totalFields}`;
        }
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousStep());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }
        
        // Step indicator clicks
        const stepIndicators = document.querySelectorAll('.step-indicator .step');
        stepIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                const targetStep = index + 1;
                if (targetStep <= this.currentStep || (targetStep === this.currentStep + 1 && this.validateStep(this.currentStep))) {
                    this.showStep(targetStep);
                }
            });
        });
        
        // Form input changes
        const form = document.getElementById('taxCalculatorForm');
        if (form) {
            form.addEventListener('input', (e) => {
                this.updateProgress();
                this.saveFormData();
                
                // Clear error state from the field being edited
                if (e.target.classList.contains('field-error')) {
                    e.target.classList.remove('field-error');
                }
            });
            
            form.addEventListener('change', (e) => {
                this.updateProgress();
                this.saveFormData();
                
                // Clear error state from the field being changed
                if (e.target.classList.contains('field-error')) {
                    e.target.classList.remove('field-error');
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousStep();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextStep();
                }
            }
        });
    },
    
    // Move to next step
    nextStep: function() {
        if (this.currentStep === this.totalSteps) {
            // On final step, generate basic report
            this.generateBasicReport();
            return;
        }
        
        if (this.validateStep(this.currentStep)) {
            this.showStep(this.currentStep + 1);
        }
    },
    
    // Move to previous step
    previousStep: function() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    },
    
    // Validate current step
    validateStep: function(stepNum) {
        const errors = [];
        
        switch (stepNum) {
            case 1:
                errors.push(...this.validatePersonalInfo());
                break;
            case 2:
                errors.push(...this.validateIncomeInfo());
                break;
            case 3:
                errors.push(...this.validateDeductions());
                break;
            case 4:
                errors.push(...this.validateAdvancedDeductions());
                break;
        }
        
        if (errors.length > 0) {
            this.showValidationErrors(errors);
            return false;
        } else {
            // Clear any existing errors when validation passes
            this.clearValidationErrors();
            return true;
        }
    },
    
    // Validate personal information
    validatePersonalInfo: function() {
        const errors = [];
        const fullName = (document.getElementById('fullName') || {}).value.trim();
        const emailAddress = (document.getElementById('emailAddress') || {}).value.trim();
        
        if (!fullName) {
            errors.push('Full name is required');
        }
        
        if (!emailAddress) {
            errors.push('Email address is required');
        } else if (!this.isValidEmail(emailAddress)) {
            errors.push('Please enter a valid email address');
        }
        
        return errors;
    },
    
    // Validate income information
    validateIncomeInfo: function() {
        const errors = [];
        const basicSalary = parseFloat((document.getElementById('basicSalary') || {}).value) || 0;
        const travelAllowance = parseFloat((document.getElementById('travelAllowance') || {}).value) || 0;
        const travelMethod = (document.getElementById('travelMethod') || {}).value;
        const businessKm = parseFloat((document.getElementById('businessKm') || {}).value) || 0;

        if (basicSalary < 0) {
            errors.push('Basic salary cannot be negative');
        }
        if (travelAllowance < 0) {
            errors.push('Travel allowance cannot be negative');
        }

        if (travelMethod === 'deemed_rate' && travelAllowance > 0 && businessKm <= 0) {
            errors.push('Business Kilometers are required for Deemed Rate travel deduction if travel allowance is provided.');
        }
        if (businessKm < 0) {
            errors.push('Business Kilometers cannot be negative.');
        }
        
        return errors;
    },
    
    // Validate deductions
    validateDeductions: function() {
        const errors = [];
        // Basic validation - ensure no negative values
        const deductionFields = ['pensionFund', 'providentFund', 'retirementAnnuity', 'medicalAid', 'donations'];
        
        deductionFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            const value = parseFloat((element || {}).value) || 0;
            if (value < 0) {
                errors.push(`${fieldId.replace(/([A-Z])/g, ' $1').toLowerCase()} cannot be negative`);
            }
        });
        
        return errors;
    },
    
    // Validate advanced deductions
    validateAdvancedDeductions: function() {
        const errors = [];
        const travelMethod = (document.getElementById('travelMethod') || {}).value;
        const travelExpenses = parseFloat((document.getElementById('travelExpenses') || {}).value) || 0;

        // Validate travel expenses if actual cost method is selected
        if (travelMethod === 'actual_cost' && travelExpenses <= 0) {
            errors.push('Actual Travel Expenses are required for Actual Cost travel deduction.');
        }
        if (travelExpenses < 0) {
            errors.push('Actual Travel Expenses cannot be negative.');
        }

        // Validate solar PV limit
        const solarPV = parseFloat((document.getElementById('solarPV') || {}).value) || 0;
        if (solarPV > 1000000) {
            errors.push('Solar PV deduction cannot exceed R1,000,000');
        }
        
        // Validate home office limit
        const homeOffice = parseFloat((document.getElementById('homeOffice') || {}).value) || 0;
        if (homeOffice > 15000) {
            errors.push('Home office deduction cannot exceed R15,000');
        }
        
        return errors;
    },
    
    // Show validation errors
    showValidationErrors: function(errors) {
        // Clear any existing error state first
        this.clearValidationErrors();
        
        // Show new errors
        if (window.TaxEasyApp && window.TaxEasyApp.showNotification) {
            window.TaxEasyApp.showNotification("Please correct the following errors: " + errors.join(", "), "error");
        } else {
            alert("Please correct the following errors:\n\n" + errors.join("\n"));
        }
        
        // Mark fields with errors
        this.markErrorFields(errors);
    },

    // Clear validation errors
    clearValidationErrors: function() {
        // Remove error classes from all form fields
        const form = document.getElementById('taxCalculatorForm');
        if (form) {
            const errorFields = form.querySelectorAll('.error, .field-error');
            errorFields.forEach(field => {
                field.classList.remove('error', 'field-error');
            });
        }
        
        // Clear any error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    },

    // Mark fields with errors
    markErrorFields: function(errors) {
        // This is a basic implementation - can be enhanced to mark specific fields
        errors.forEach(error => {
            if (error.includes('Full name')) {
                const field = document.getElementById('fullName');
                if (field) field.classList.add('field-error');
            }
            if (error.includes('Email')) {
                const field = document.getElementById('emailAddress');
                if (field) field.classList.add('field-error');
            }
            if (error.includes('Basic salary')) {
                const field = document.getElementById('basicSalary');
                if (field) field.classList.add('field-error');
            }
            if (error.includes('Travel allowance')) {
                const field = document.getElementById('travelAllowance');
                if (field) field.classList.add('field-error');
            }
            if (error.includes('Business Kilometers')) {
                const field = document.getElementById('businessKm');
                if (field) field.classList.add('field-error');
            }
            if (error.includes('Home office')) {
                const field = document.getElementById('homeOffice');
                if (field) field.classList.add('field-error');
            }
        });
    },
    
    // Email validation
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Save form data
    saveFormData: function() {
        const form = document.getElementById('taxCalculatorForm');
        if (!form) return;
        
        const formData = new FormData(form);
        this.formData = {};
        
        for (let [key, value] of formData.entries()) {
            this.formData[key] = value;
        }
        
        // Save to localStorage for persistence
        localStorage.setItem('taxEasyFormData', JSON.stringify(this.formData));
    },
    
    // Load saved form data
    loadFormData: function() {
        const savedData = localStorage.getItem('taxEasyFormData');
        if (savedData) {
            try {
                this.formData = JSON.parse(savedData);
                this.populateForm(this.formData);
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    },
    
    // Populate form with data
    populateForm: function(data) {
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = data[key];
            }
        });
    },
    
    // Calculate and display results
    calculateAndDisplayResults: function() {
        try {
            this.saveFormData();
            const results = window.TaxCalculator.calculate(this.formData);
            this.displayResults(results);
        } catch (error) {
            console.error('Error calculating tax:', error);
            alert('Error calculating tax. Please check your inputs and try again.');
        }
    },
    
    // Display calculation results
    displayResults: function(results) {
        // Update summary sections
        document.getElementById('summaryGrossIncome').textContent = 
            window.TAX_HELPERS.formatCurrency(results.grossIncome);
        document.getElementById('summaryDeductions').textContent = 
            window.TAX_HELPERS.formatCurrency(results.deductions.total);
        document.getElementById('summaryTaxableIncome').textContent = 
            window.TAX_HELPERS.formatCurrency(results.taxableIncome);
        document.getElementById('summaryTaxBeforeRebates').textContent = 
            window.TAX_HELPERS.formatCurrency(results.taxBeforeRebates);
        document.getElementById('summaryRebates').textContent = 
            window.TAX_HELPERS.formatCurrency(results.rebates);
        document.getElementById('summaryTaxAfterRebates').textContent = 
            window.TAX_HELPERS.formatCurrency(results.taxAfterRebates);
        document.getElementById('summaryMedicalCredits').textContent = 
            window.TAX_HELPERS.formatCurrency(results.medicalCredits);
        document.getElementById('summaryNetTax').textContent = 
            window.TAX_HELPERS.formatCurrency(results.netTaxPayable);
        document.getElementById('summaryTaxesPaid').textContent = 
            window.TAX_HELPERS.formatCurrency(results.taxesPaid);
        
        // Update final result
        const resultLabel = document.getElementById('resultLabel');
        const finalResult = document.getElementById('finalResult');
        
        if (results.isRefund) {
            resultLabel.textContent = 'Estimated Refund:';
            finalResult.textContent = window.TAX_HELPERS.formatCurrency(Math.abs(results.finalResult));
            finalResult.className = 'result-amount refund';
        } else {
            resultLabel.textContent = 'Amount Due:';
            finalResult.textContent = window.TAX_HELPERS.formatCurrency(results.finalResult);
            finalResult.className = 'result-amount payable';
        }
        
        // Store results for report generation
        this.calculationResults = results;
    },
    
    // Generate basic report
    generateBasicReport: function() {
        if (!this.calculationResults) {
            alert('Please complete the calculation first.');
            return;
        }
        
        if (typeof window.PDFGenerator !== 'undefined') {
            window.PDFGenerator.generateBasicReport(this.formData, this.calculationResults);
        } else {
            alert('PDF generation is not available. Please try again later.');
        }
    }
};

// Global functions for button clicks
window.nextStep = function() {
    window.WizardNavigation.nextStep();
};

window.previousStep = function() {
    window.WizardNavigation.previousStep();
};

window.initializeWizard = function() {
    window.WizardNavigation.init();
    window.WizardNavigation.loadFormData();
};

console.log('Wizard navigation system loaded successfully');
