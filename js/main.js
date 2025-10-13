
window.TaxEasyApp = {
    init: function() {
        console.log("TaxEasyApp initializing...");

        // Initialize wizard navigation
        if (typeof window.WizardNavigation !== "undefined" && window.WizardNavigation) {
            console.log("Initializing wizard navigation...");
            window.WizardNavigation.init();
        } else {
            console.error("WizardNavigation not found - cannot initialize application");
            throw new Error("WizardNavigation module is not loaded");
        }

        // Initialize tooltip system
        if (typeof window.TooltipSystem !== "undefined" && window.TooltipSystem) {
            console.log("Initializing tooltip system...");
            window.TooltipSystem.init();
        } else {
            console.warn("TooltipSystem not found - tooltips will not work");
        }

        // Initialize payment integration
        if (typeof window.PaymentIntegration !== "undefined" && window.PaymentIntegration) {
            console.log("Initializing payment integration...");
            window.PaymentIntegration.init();
        }

        this.setupGlobalEventListeners();
        console.log("TaxEasyApp initialized successfully");
    },

    setupGlobalEventListeners: function() {
        // Add any global event listeners here
    },

    clearAllData: function() {
        if (confirm("Are you sure you want to clear all data and start over?")) {
            localStorage.removeItem("taxCalculatorData");
            localStorage.removeItem("currentStep");
            document.getElementById("taxCalculatorForm").reset();
            window.WizardNavigation.goToStep(1);
            console.log("All data cleared.");
        }
    }
};

window.TaxEasyApp.init();
