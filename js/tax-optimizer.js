// TaxEasy ZA 2025 - Tax Optimization Engine
// Ensures users get the BEST possible tax result through maximum legal deductions

window.TaxOptimizer = {
    // Optimize tax calculation to minimize tax liability legally
    optimizeCalculation: function(formData, baseResults) {
        console.log('Starting tax optimization for maximum legal benefit...');
        
        const optimizations = {
            retirementOptimization: this.optimizeRetirementContributions(formData, baseResults),
            medicalOptimization: this.optimizeMedicalDeductions(formData, baseResults),
            renewableEnergyOptimization: this.optimizeRenewableEnergy(formData, baseResults),
            travelAllowanceOptimization: this.optimizeTravelAllowance(formData, baseResults),
            donationsOptimization: this.optimizeDonations(formData, baseResults)
        };
        
        // Apply all optimizations
        const optimizedFormData = this.applyOptimizations(formData, optimizations);
        
        // Recalculate with optimized data
        const optimizedResults = window.TaxCalculator.calculate(optimizedFormData);
        
        // Add optimization recommendations
        optimizedResults.optimizations = optimizations;
        optimizedResults.potentialSavings = baseResults.netTaxPayable - optimizedResults.netTaxPayable;
        
        console.log('Tax optimization completed. Potential savings:', optimizedResults.potentialSavings);
        
        return optimizedResults;
    },
    
    // Optimize retirement contributions for maximum tax benefit
    optimizeRetirementContributions: function(formData, baseResults) {
        const grossIncome = baseResults.grossIncome;
        const currentRA = window.TAX_HELPERS.cleanNumericInput(formData.retirementAnnuity);
        const currentPension = window.TAX_HELPERS.cleanNumericInput(formData.pensionFund);
        const currentProvident = window.TAX_HELPERS.cleanNumericInput(formData.providentFund);
        
        // Calculate maximum allowable RA contribution
        const maxRAByPercentage = grossIncome * 0.275; // 27.5%
        const maxRAByAmount = 350000; // R350,000 annual limit
        const maxRA = Math.min(maxRAByPercentage, maxRAByAmount);
        
        // Calculate current total retirement contributions
        const currentTotal = currentRA + currentPension + currentProvident;
        
        // Calculate optimization potential
        const additionalRACapacity = Math.max(0, maxRA - currentRA);
        const potentialTaxSaving = additionalRACapacity * this.getMarginalTaxRate(baseResults.taxableIncome, formData.ageGroup) / 100;
        
        return {
            type: 'retirement_annuity',
            current: currentRA,
            recommended: Math.min(currentRA + additionalRACapacity, maxRA),
            additionalCapacity: additionalRACapacity,
            potentialSaving: potentialTaxSaving,
            recommendation: additionalRACapacity > 1000 ? 
                `Consider contributing an additional R${Math.round(additionalRACapacity).toLocaleString()} to your retirement annuity to save approximately R${Math.round(potentialTaxSaving).toLocaleString()} in tax.` :
                'Your retirement contributions are well optimized.'
        };
    },
    
    // Optimize medical aid deductions
    optimizeMedicalDeductions: function(formData, baseResults) {
        const medicalAid = window.TAX_HELPERS.cleanNumericInput(formData.medicalAid);
        const members = window.TAX_HELPERS.cleanNumericInput(formData.medicalMembers) || 1;
        const dependants = window.TAX_HELPERS.cleanNumericInput(formData.medicalDependants) || 0;
        
        // Calculate maximum medical aid tax credits
        const maxCredits = (members * 364 * 12) + (dependants * 246 * 12);
        const currentCredits = window.TAX_HELPERS.calculateMedicalCredits(members, dependants);
        
        // Check if medical expenses threshold is met for additional deductions
        const taxableIncome = baseResults.taxableIncome;
        const medicalExpensesThreshold = taxableIncome * 0.075; // 7.5% threshold
        
        return {
            type: 'medical_aid',
            currentCredits: currentCredits,
            maxPossibleCredits: maxCredits,
            medicalExpensesThreshold: medicalExpensesThreshold,
            recommendation: currentCredits < maxCredits ? 
                `Ensure all medical aid members and dependants are correctly captured to maximize your R${Math.round(maxCredits - currentCredits).toLocaleString()} in additional tax credits.` :
                'Your medical aid tax credits are optimized. Consider claiming medical expenses above R' + Math.round(medicalExpensesThreshold).toLocaleString() + ' threshold.'
        };
    },
    
    // Optimize renewable energy deductions
    optimizeRenewableEnergy: function(formData, baseResults) {
        const solarPV = window.TAX_HELPERS.cleanNumericInput(formData.solarPV);
        const solarWater = window.TAX_HELPERS.cleanNumericInput(formData.solarWaterHeating);
        const otherRenewable = window.TAX_HELPERS.cleanNumericInput(formData.otherRenewable);
        
        const maxSolarPV = 1000000; // R1 million limit
        const remainingSolarPVCapacity = maxSolarPV - solarPV;
        
        const marginalRate = this.getMarginalTaxRate(baseResults.taxableIncome, formData.ageGroup);
        const potentialSaving = Math.min(remainingSolarPVCapacity, 100000) * marginalRate / 100; // Assume R100k investment
        
        return {
            type: 'renewable_energy',
            currentSolarPV: solarPV,
            maxSolarPV: maxSolarPV,
            remainingCapacity: remainingSolarPVCapacity,
            potentialSaving: potentialSaving,
            recommendation: remainingSolarPVCapacity > 50000 ? 
                `Consider investing in solar PV systems. You can still claim up to R${Math.round(remainingSolarPVCapacity).toLocaleString()} in deductions, potentially saving R${Math.round(potentialSaving).toLocaleString()} in tax on a R100,000 investment.` :
                'Your renewable energy deductions are well utilized.'
        };
    },
    
    // Optimize travel allowance deductions
    optimizeTravelAllowance: function(formData, baseResults) {
        const travelAllowance = window.TAX_HELPERS.cleanNumericInput(formData.travelAllowance);
        const travelExpenses = window.TAX_HELPERS.cleanNumericInput(formData.travelExpenses);
        
        if (travelAllowance === 0) {
            return {
                type: 'travel_allowance',
                recommendation: 'No travel allowance to optimize.'
            };
        }
        
        // Estimate potential travel expense claims
        const estimatedBusinessKm = 20000; // Average business travel
        const ratePerKm = 3.98; // 2025 SARS rate
        const potentialTravelExpenses = estimatedBusinessKm * ratePerKm;
        
        const additionalDeduction = Math.max(0, potentialTravelExpenses - travelExpenses);
        const marginalRate = this.getMarginalTaxRate(baseResults.taxableIncome, formData.ageGroup);
        const potentialSaving = additionalDeduction * marginalRate / 100;
        
        return {
            type: 'travel_allowance',
            currentExpenses: travelExpenses,
            potentialExpenses: potentialTravelExpenses,
            additionalDeduction: additionalDeduction,
            potentialSaving: potentialSaving,
            recommendation: additionalDeduction > 5000 ? 
                `Keep detailed records of business travel. You could potentially claim an additional R${Math.round(additionalDeduction).toLocaleString()} in travel expenses, saving approximately R${Math.round(potentialSaving).toLocaleString()} in tax.` :
                'Your travel expense deductions appear optimized.'
        };
    },
    
    // Optimize donations for maximum benefit
    optimizeDonations: function(formData, baseResults) {
        const currentDonations = window.TAX_HELPERS.cleanNumericInput(formData.donations);
        const taxableIncome = baseResults.taxableIncome;
        const maxDonations = taxableIncome * 0.10; // 10% limit
        
        const additionalCapacity = Math.max(0, maxDonations - currentDonations);
        const marginalRate = this.getMarginalTaxRate(baseResults.taxableIncome, formData.ageGroup);
        const potentialSaving = additionalCapacity * marginalRate / 100;
        
        return {
            type: 'donations',
            current: currentDonations,
            maxAllowable: maxDonations,
            additionalCapacity: additionalCapacity,
            potentialSaving: potentialSaving,
            recommendation: additionalCapacity > 1000 ? 
                `Consider donating to registered Section 18A charities. You can claim up to an additional R${Math.round(additionalCapacity).toLocaleString()} in donations, potentially saving R${Math.round(potentialSaving).toLocaleString()} in tax while supporting good causes.` :
                'Your donation deductions are well optimized.'
        };
    },
    
    // Apply optimizations to form data
    applyOptimizations: function(formData, optimizations) {
        const optimizedData = { ...formData };
        
        // Apply retirement optimization
        if (optimizations.retirementOptimization.additionalCapacity > 1000) {
            optimizedData.retirementAnnuity = optimizations.retirementOptimization.recommended;
        }
        
        return optimizedData;
    },
    
    // Get marginal tax rate for optimization calculations
    getMarginalTaxRate: function(taxableIncome, ageGroup) {
        const brackets = window.TAX_HELPERS.getTaxBrackets(ageGroup);
        
        for (let bracket of brackets) {
            if (taxableIncome >= bracket.min && taxableIncome <= bracket.max) {
                return bracket.rate * 100;
            }
        }
        
        return 45; // Top rate
    },
    
    // Generate optimization report
    generateOptimizationReport: function(optimizations) {
        const recommendations = [];
        
        Object.values(optimizations).forEach(opt => {
            if (opt.recommendation && opt.recommendation !== 'No optimization needed.') {
                recommendations.push({
                    type: opt.type,
                    recommendation: opt.recommendation,
                    potentialSaving: opt.potentialSaving || 0
                });
            }
        });
        
        // Sort by potential savings
        recommendations.sort((a, b) => (b.potentialSaving || 0) - (a.potentialSaving || 0));
        
        return recommendations;
    }
};

console.log('Tax optimization engine loaded successfully');
