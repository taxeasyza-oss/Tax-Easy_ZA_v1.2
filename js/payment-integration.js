// TaxEasy ZA 2025 - Payment Integration System
// Handles PayFast integration and discount code management

window.PaymentIntegration = {
    discountCodes: {},
    originalPrice: 129,
    currentPrice: 129,
    
    // Initialize payment system
    init: function() {
        console.log('Initializing payment integration...');
        
        this.loadDiscountCodes();
        this.setupEventListeners();
        
        console.log('Payment integration initialized successfully');
    },
    
    // Load discount codes
    loadDiscountCodes: function() {
        // Predefined discount codes
        this.discountCodes = {
            'TAXFREE2025': { type: 'percentage', value: 100, description: 'Complete discount - Free report' },
            'EARLYBIRD': { type: 'percentage', value: 50, description: '50% Early bird discount' },
            'STUDENT25': { type: 'percentage', value: 25, description: '25% Student discount' },
            'HEALTHCARE': { type: 'percentage', value: 30, description: '30% Healthcare worker discount' },
            'TEACHER20': { type: 'percentage', value: 20, description: '20% Teacher discount' },
            'SENIOR15': { type: 'percentage', value: 15, description: '15% Senior citizen discount' },
            'WELCOME10': { type: 'percentage', value: 10, description: '10% Welcome discount' },
            'FIXED50': { type: 'fixed', value: 50, description: 'R50 off your report' },
            'FIXED25': { type: 'fixed', value: 25, description: 'R25 off your report' }
        };
        
        // Try to load additional codes from server (for production)
        this.loadServerDiscountCodes();
    },
    
    // Load discount codes from server
    loadServerDiscountCodes: function() {
        // This would typically fetch from your backend API
        // For now, we'll use localStorage to simulate server codes
        const serverCodes = localStorage.getItem('taxeasy_server_discount_codes');
        if (serverCodes) {
            try {
                const codes = JSON.parse(serverCodes);
                this.discountCodes = { ...this.discountCodes, ...codes };
            } catch (error) {
                console.error('Error loading server discount codes:', error);
            }
        }
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Apply discount button
        const applyButton = document.querySelector('button[onclick="applyDiscount()"]');
        if (applyButton) {
            applyButton.addEventListener('click', () => this.applyDiscount());
        }
        
        // Purchase button
        const purchaseButton = document.querySelector('button[onclick="purchaseProfessionalReport()"]');
        if (purchaseButton) {
            purchaseButton.addEventListener('click', () => this.purchaseProfessionalReport());
        }
        
        // Discount code input - apply on Enter key
        const discountInput = document.getElementById('discountCode');
        if (discountInput) {
            discountInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyDiscount();
                }
            });
        }
    },
    
    // Apply discount code
    applyDiscount: function() {
        const discountInput = document.getElementById('discountCode');
        const originalPriceElement = document.getElementById('originalPrice');
        const finalPriceElement = document.getElementById('finalPrice');
        
        if (!discountInput || !originalPriceElement || !finalPriceElement) {
            console.error('Discount elements not found');
            return;
        }
        
        const code = discountInput.value.trim().toUpperCase();
        
        if (!code) {
            alert('Please enter a discount code.');
            return;
        }
        
        const discount = this.discountCodes[code];
        
        if (!discount) {
            alert('Invalid discount code. Please check and try again.');
            discountInput.value = '';
            return;
        }
        
        // Calculate discounted price
        let discountedPrice = this.originalPrice;
        
        if (discount.type === 'percentage') {
            discountedPrice = this.originalPrice * (1 - discount.value / 100);
        } else if (discount.type === 'fixed') {
            discountedPrice = this.originalPrice - discount.value;
        }
        
        // Ensure price doesn't go below 0
        discountedPrice = Math.max(0, discountedPrice);
        
        // Update display
        this.currentPrice = discountedPrice;
        originalPriceElement.style.display = discountedPrice < this.originalPrice ? 'inline' : 'none';
        finalPriceElement.textContent = `R${Math.round(discountedPrice)}`;
        
        // Show success message
        const message = discountedPrice === 0 
            ? `Congratulations! Your report is now FREE with code "${code}".`
            : `Discount applied! You saved R${Math.round(this.originalPrice - discountedPrice)} with code "${code}".`;
        
        alert(message);
        
        // Update purchase button text
        const purchaseButton = document.querySelector('button[onclick="purchaseProfessionalReport()"]');
        if (purchaseButton) {
            if (discountedPrice === 0) {
                purchaseButton.textContent = 'Download Professional Report - FREE';
                purchaseButton.classList.remove('btn-success');
                purchaseButton.classList.add('btn-primary');
            } else {
                purchaseButton.textContent = `Purchase Professional Report - R${Math.round(discountedPrice)}`;
            }
        }
        
        console.log(`Discount applied: ${code}, New price: R${discountedPrice}`);
    },
    
    // Purchase professional report
    purchaseProfessionalReport: function() {
        console.log('Initiating professional report purchase...');
        
        // Check if report is free due to discount
        if (this.currentPrice === 0) {
            this.processFreeReport();
            return;
        }
        
        // Validate form data
        const formData = window.WizardNavigation?.formData;
        const results = window.WizardNavigation?.calculationResults;
        
        if (!formData || !results) {
            alert('Please complete the tax calculation first.');
            return;
        }
        
        if (!formData.emailAddress || !this.isValidEmail(formData.emailAddress)) {
            alert('Please provide a valid email address to receive your report.');
            return;
        }
        
        // Prepare payment data
        const paymentData = {
            amount: this.currentPrice,
            item_name: 'TaxEasy ZA 2025 - Professional Tax Report',
            item_description: 'Comprehensive tax analysis and eFiling guide',
            buyer_email: formData.emailAddress,
            buyer_name: formData.fullName || 'Tax Calculator User',
            merchant_id: '10000100', // Replace with actual PayFast merchant ID
            merchant_key: 'merchant_key_here', // Replace with actual merchant key
            return_url: window.location.origin + '/payment-success.html',
            cancel_url: window.location.origin + '/payment-cancel.html',
            notify_url: window.location.origin + '/payment-notify' // Backend endpoint
        };
        
        // For demo purposes, simulate payment process
        this.simulatePayment(paymentData);
    },
    
    // Process free report (when discount makes it free)
    processFreeReport: function() {
        console.log('Processing free professional report...');
        
        const formData = window.WizardNavigation?.formData;
        const results = window.WizardNavigation?.calculationResults;
        
        if (!formData || !results) {
            alert('Please complete the tax calculation first.');
            return;
        }
        
        // Generate professional report immediately
        const paymentData = {
            amount: 0,
            status: 'COMPLETE',
            payment_method: 'DISCOUNT_CODE',
            transaction_id: 'FREE_' + Date.now()
        };
        
        window.PDFGenerator.generateProfessionalReport(formData, results, paymentData);
        
        // Show success message
        alert('Your professional report is being generated and will download shortly. Thank you for using TaxEasy ZA!');
        
        // Track the free download
        this.trackConversion('free_professional_report', paymentData);
    },
    
    // Simulate payment process (for demo)
    simulatePayment: function(paymentData) {
        console.log('Simulating payment process...', paymentData);
        
        // In production, this would redirect to PayFast
        const confirmPayment = confirm(
            `You are about to purchase a Professional Tax Report for R${this.currentPrice}.\n\n` +
            `This will include:\n` +
            `• Comprehensive tax analysis\n` +
            `• Detailed deductions breakdown\n` +
            `• Tax planning recommendations\n` +
            `• eFiling instructions\n` +
            `• Professional formatting\n\n` +
            `Click OK to proceed with payment simulation.`
        );
        
        if (confirmPayment) {
            // Simulate payment success
            setTimeout(() => {
                this.handlePaymentSuccess({
                    ...paymentData,
                    status: 'COMPLETE',
                    transaction_id: 'DEMO_' + Date.now(),
                    payment_method: 'DEMO'
                });
            }, 2000);
            
            // Show processing message
            alert('Processing payment... This is a demo - your report will be generated shortly.');
        }
    },
    
    // Handle successful payment
    handlePaymentSuccess: function(paymentData) {
        console.log('Payment successful:', paymentData);
        
        const formData = window.WizardNavigation?.formData;
        const results = window.WizardNavigation?.calculationResults;
        
        if (formData && results) {
            // Generate professional report
            window.PDFGenerator.generateProfessionalReport(formData, results, paymentData);
            
            // Show success message
            alert('Payment successful! Your professional report is being generated and will download shortly.');
            
            // Track the conversion
            this.trackConversion('professional_report_purchase', paymentData);
            
            // Send confirmation email (would be handled by backend)
            this.sendConfirmationEmail(formData, paymentData);
        }
    },
    
    // Handle payment failure
    handlePaymentFailure: function(error) {
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again or contact support if the problem persists.');
    },
    
    // Track conversion for analytics
    trackConversion: function(eventType, data) {
        console.log('Tracking conversion:', eventType, data);
        
        // In production, this would send data to analytics service
        const conversionData = {
            event: eventType,
            amount: data.amount,
            timestamp: new Date().toISOString(),
            transaction_id: data.transaction_id
        };
        
        // Store locally for demo
        const conversions = JSON.parse(localStorage.getItem('taxeasy_conversions') || '[]');
        conversions.push(conversionData);
        localStorage.setItem('taxeasy_conversions', JSON.stringify(conversions));
    },
    
    // Send confirmation email (backend would handle this)
    sendConfirmationEmail: function(formData, paymentData) {
        console.log('Sending confirmation email to:', formData.emailAddress);
        
        // In production, this would make an API call to your backend
        const emailData = {
            to: formData.emailAddress,
            subject: 'TaxEasy ZA - Professional Report Purchase Confirmation',
            template: 'purchase_confirmation',
            data: {
                name: formData.fullName,
                amount: paymentData.amount,
                transaction_id: paymentData.transaction_id,
                download_link: 'Generated report will be attached'
            }
        };
        
        // Simulate email sending
        console.log('Email data prepared:', emailData);
    },
    
    // Email validation
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Add new discount code (admin function)
    addDiscountCode: function(code, discount) {
        this.discountCodes[code.toUpperCase()] = discount;
        
        // Save to localStorage (in production, save to backend)
        const serverCodes = JSON.parse(localStorage.getItem('taxeasy_server_discount_codes') || '{}');
        serverCodes[code.toUpperCase()] = discount;
        localStorage.setItem('taxeasy_server_discount_codes', JSON.stringify(serverCodes));
        
        console.log('Discount code added:', code, discount);
    },
    
    // Remove discount code (admin function)
    removeDiscountCode: function(code) {
        delete this.discountCodes[code.toUpperCase()];
        
        // Remove from localStorage
        const serverCodes = JSON.parse(localStorage.getItem('taxeasy_server_discount_codes') || '{}');
        delete serverCodes[code.toUpperCase()];
        localStorage.setItem('taxeasy_server_discount_codes', JSON.stringify(serverCodes));
        
        console.log('Discount code removed:', code);
    }
};

// Global functions for payment operations
window.applyDiscount = function() {
    window.PaymentIntegration.applyDiscount();
};

window.purchaseProfessionalReport = function() {
    window.PaymentIntegration.purchaseProfessionalReport();
};

// Initialize payment integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.PaymentIntegration.init();
});

console.log('Payment integration system loaded successfully');
