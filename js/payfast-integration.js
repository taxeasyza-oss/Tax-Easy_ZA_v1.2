// TaxEasy ZA 2025 - PayFast Payment Integration
// Professional Report Payment Processing (R149)

class TaxEasyPayFastIntegration {
    constructor() {
        // Test credentials - replace with live credentials for production
        this.merchantId = '10000100'; // Test merchant ID
        this.merchantKey = '46f0cd694581a'; // Test merchant key
        this.passPhrase = 'jt7NOE43FZPn'; // Test passphrase
        this.testMode = true; // Set to false for production
        this.baseUrl = this.testMode ? 
            'https://sandbox.payfast.co.za/eng/process' : 
            'https://www.payfast.co.za/eng/process';
        
        // Professional report pricing
        this.reportPrice = 14900; // R149.00 in cents
        this.currency = 'ZAR';
    }

    // Initialize PayFast integration
    initialize() {
        console.log('Initializing PayFast integration for professional reports...');
        this.attachEventListeners();
        this.createPaymentPages();
    }

    // Attach event listeners to payment buttons
    attachEventListeners() {
        // Professional Report payment button
        const professionalBtn = document.getElementById('purchaseProfessionalReport');
        if (professionalBtn) {
            professionalBtn.addEventListener('click', (e) => {
                // Check if promo code is applied
                if (window.promoCodeApplied || (window.TaxEasyPromoCodes && window.TaxEasyPromoCodes.promoCodeApplied)) {
                    // Let promo code system handle this
                    return;
                }
                
                e.preventDefault();
                this.processProfessionalReportPayment();
            });
        }
    }

    // Process professional report payment
    processProfessionalReportPayment() {
        try {
            // Collect user details
            const userDetails = this.collectUserDetails();
            if (!userDetails) {
                return; // Error already shown
            }

            // Validate required fields
            if (!this.validateUserDetails(userDetails)) {
                return; // Error already shown
            }

            // Show payment confirmation
            this.showPaymentConfirmation(userDetails);
            
        } catch (error) {
            console.error('Payment processing error:', error);
            this.showError('Payment Error: ' + error.message);
        }
    }

    // Show payment confirmation modal
    showPaymentConfirmation(userDetails) {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center;">
                <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #e9ecef;">
                        <h3 style="color: #2c3e50; margin: 0; font-size: 1.5rem;">Confirm Payment</h3>
                        <button onclick="this.closest('div').parentElement.remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6c757d; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">&times;</button>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="color: #3498db; margin-bottom: 1rem;">Professional Tax Report</h4>
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Professional Tax Report 2025</span>
                                <strong>R149.00</strong>
                            </div>
                            <div style="font-size: 0.9rem; color: #6c757d;">
                                Includes SARS eFiling codes, tax optimization advice, and professional formatting
                            </div>
                        </div>
                        
                        <div style="background: #e8f5e8; padding: 1rem; border-radius: 8px; border-left: 4px solid #28a745;">
                            <h5 style="color: #155724; margin-bottom: 0.5rem;">What's Included:</h5>
                            <ul style="margin: 0; padding-left: 1.2rem; color: #155724; font-size: 0.9rem;">
                                <li>Detailed tax breakdown with SARS eFiling codes</li>
                                <li>Personalized tax optimization recommendations</li>
                                <li>SARS compliance guidance and next steps</li>
                                <li>Professional PDF formatting and branding</li>
                                <li>All deduction categories with proper codes</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="color: #2c3e50; margin-bottom: 0.5rem;">Payment Details</h4>
                        <div style="font-size: 0.9rem; color: #6c757d;">
                            <div><strong>Name:</strong> ${userDetails.fullName}</div>
                            <div><strong>Email:</strong> ${userDetails.email}</div>
                            <div><strong>Amount:</strong> R149.00 (VAT Included)</div>
                            <div><strong>Payment Method:</strong> PayFast (Secure Payment Gateway)</div>
                        </div>
                    </div>
                    
                    <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #ffc107;">
                        <div style="color: #856404; font-size: 0.9rem;">
                            <strong>Secure Payment:</strong> You will be redirected to PayFast's secure payment gateway. 
                            Your payment information is encrypted and secure. After successful payment, 
                            you will be redirected back to download your professional report.
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: center;">
                        <button onclick="this.closest('div').parentElement.remove()" style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Cancel</button>
                        <button onclick="window.taxEasyPayFast.proceedToPayment('${btoa(JSON.stringify(userDetails))}')" style="padding: 0.75rem 2rem; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                            <span>Proceed to Payment</span>
                            <span style="font-size: 1.2rem;">🔒</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Proceed to PayFast payment
    proceedToPayment(encodedUserDetails) {
        try {
            const userDetails = JSON.parse(atob(encodedUserDetails));
            
            // Close confirmation modal
            const modal = document.querySelector('div[style*="position: fixed"]');
            if (modal) modal.remove();
            
            // Show loading state
            this.showPaymentLoading();
            
            // Generate and submit payment form
            const paymentForm = this.generatePaymentForm(userDetails);
            document.body.appendChild(paymentForm);
            
            // Store payment details for success page
            this.storePaymentDetails(userDetails);
            
            // Submit form to PayFast
            setTimeout(() => {
                paymentForm.submit();
            }, 1000);
            
        } catch (error) {
            console.error('Payment submission error:', error);
            this.hidePaymentLoading();
            this.showError('Error processing payment: ' + error.message);
        }
    }

    // Generate PayFast payment form
    generatePaymentForm(userDetails) {
        const paymentId = this.generatePaymentId();
        
        const paymentData = {
            merchant_id: this.merchantId,
            merchant_key: this.merchantKey,
            return_url: window.location.origin + '/payment-success.html',
            cancel_url: window.location.origin + '/payment-cancelled.html',
            notify_url: window.location.origin + '/api/payfast-itn',
            name_first: userDetails.firstName || userDetails.fullName.split(' ')[0] || '',
            name_last: userDetails.lastName || userDetails.fullName.split(' ').slice(1).join(' ') || '',
            email_address: userDetails.email,
            m_payment_id: paymentId,
            amount: '149.00',
            item_name: 'Professional Tax Report 2025',
            item_description: 'TaxEasy ZA Professional Tax Report with SARS eFiling codes and optimization advice',
            custom_str1: 'professional_report',
            custom_str2: JSON.stringify(userDetails.taxData || {}),
            custom_str3: userDetails.language || 'en',
            custom_str4: new Date().toISOString()
        };

        // Generate signature
        paymentData.signature = this.generateSignature(paymentData);

        // Create form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = this.baseUrl;
        form.style.display = 'none';
        form.id = 'payfastPaymentForm';

        // Add form fields
        for (let key in paymentData) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentData[key];
            form.appendChild(input);
        }

        return form;
    }

    // Generate unique payment ID
    generatePaymentId() {
        return 'TAXEASY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Generate PayFast signature
    generateSignature(data) {
        // Create parameter string
        let paramString = '';
        const sortedKeys = Object.keys(data).sort();
        
        for (let key of sortedKeys) {
            if (key !== 'signature' && data[key] !== '') {
                paramString += key + '=' + encodeURIComponent(data[key]).replace(/%20/g, '+') + '&';
            }
        }
        
        // Remove trailing &
        paramString = paramString.slice(0, -1);
        
        // Add passphrase if set
        if (this.passPhrase) {
            paramString += '&passphrase=' + encodeURIComponent(this.passPhrase);
        }

        // Simple hash for demo (use proper server-side implementation in production)
        return this.simpleHash(paramString);
    }

    // Simple hash function for demo purposes
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }

    // Collect user details from form
    collectUserDetails() {
        const form = document.getElementById('taxCalculatorForm');
        if (!form) {
            this.showError('Please complete the tax calculation form before proceeding with payment.');
            return null;
        }

        const formData = new FormData(form);
        const userDetails = {};
        
        // Basic details
        userDetails.fullName = formData.get('fullName') || '';
        userDetails.email = formData.get('emailAddress') || '';
        userDetails.idNumber = formData.get('idNumber') || '';
        
        // Split name for PayFast
        const nameParts = userDetails.fullName.split(' ');
        userDetails.firstName = nameParts[0] || '';
        userDetails.lastName = nameParts.slice(1).join(' ') || '';
        
        // Tax calculation data
        userDetails.taxData = {
            basicSalary: parseFloat(formData.get('basicSalary')) || 0,
            bonus: parseFloat(formData.get('bonus')) || 0,
            overtime: parseFloat(formData.get('overtime')) || 0,
            pensionFund: parseFloat(formData.get('pensionFund')) || 0,
            medicalAid: parseFloat(formData.get('medicalAid')) || 0,
            // Add current calculation results if available
            grossIncome: this.getDisplayValue('summaryGrossIncome'),
            taxableIncome: this.getDisplayValue('summaryTaxableIncome'),
            taxPayable: this.getDisplayValue('summaryTaxPayable'),
            monthlyTax: this.getDisplayValue('summaryMonthlyTax'),
            effectiveRate: this.getDisplayValue('summaryEffectiveRate', '%'),
            netIncome: this.getDisplayValue('summaryNetIncome')
        };
        
        // Language preference
        userDetails.language = localStorage.getItem('selectedLanguage') || 'en';
        
        return userDetails;
    }

    // Get display value from summary
    getDisplayValue(elementId, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return 0;
        
        let value = element.textContent.replace(/[R,\s]/g, '');
        if (suffix) {
            value = value.replace(suffix, '');
        }
        
        return parseFloat(value) || 0;
    }

    // Validate user details
    validateUserDetails(userDetails) {
        if (!userDetails.fullName.trim()) {
            this.showError('Please enter your full name in the Personal Information section.');
            return false;
        }
        
        if (!userDetails.email.trim()) {
            this.showError('Please enter your email address in the Personal Information section.');
            return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userDetails.email)) {
            this.showError('Please enter a valid email address.');
            return false;
        }
        
        return true;
    }

    // Store payment details for success page
    storePaymentDetails(userDetails) {
        const paymentDetails = {
            reportType: 'professional',
            amount: '149.00',
            currency: 'ZAR',
            userDetails: userDetails,
            timestamp: new Date().toISOString(),
            paymentId: this.generatePaymentId()
        };
        
        localStorage.setItem('taxeasy_payment_details', JSON.stringify(paymentDetails));
    }

    // Create payment success/cancel pages
    createPaymentPages() {
        // This would typically be done server-side
        // For now, we'll create simple redirect handlers
        
        // Check if we're on a payment result page
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment_status');
        
        if (paymentStatus === 'success') {
            this.handlePaymentSuccess();
        } else if (paymentStatus === 'cancelled') {
            this.handlePaymentCancelled();
        }
    }

    // Handle payment success
    handlePaymentSuccess() {
        // Get stored payment details
        const paymentDetails = JSON.parse(localStorage.getItem('taxeasy_payment_details') || '{}');
        
        // Generate professional PDF
        if (paymentDetails.userDetails && window.ProfessionalPDFGenerator) {
            window.ProfessionalPDFGenerator.generateReport(
                paymentDetails.userDetails, 
                paymentDetails.userDetails.taxData, 
                true, // payment verified
                false // not promo code
            );
        }
        
        // Show success message
        this.showSuccess('Payment successful! Your professional report has been generated.');
        
        // Clear stored details
        localStorage.removeItem('taxeasy_payment_details');
    }

    // Handle payment cancelled
    handlePaymentCancelled() {
        this.showError('Payment was cancelled. You can try again or use a promotional code if you have one.');
        
        // Clear stored details
        localStorage.removeItem('taxeasy_payment_details');
    }

    // Show payment loading state
    showPaymentLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'paymentLoading';
        loadingDiv.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10001; display: flex; justify-content: center; align-items: center;">
                <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <div style="margin-bottom: 1rem; font-size: 1.2rem; color: #2c3e50;">Processing Payment...</div>
                    <div style="margin-bottom: 1rem; color: #6c757d;">You will be redirected to PayFast's secure payment gateway</div>
                    <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loadingDiv);
    }

    // Hide payment loading state
    hidePaymentLoading() {
        const loadingDiv = document.getElementById('paymentLoading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    // Show error message
    showError(message) {
        alert('❌ ' + message);
    }

    // Show success message
    showSuccess(message) {
        alert('✅ ' + message);
    }
}

// Initialize PayFast integration
window.taxEasyPayFast = new TaxEasyPayFastIntegration();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.taxEasyPayFast.initialize();
    }, 500);
});

console.log('PayFast integration loaded successfully');
