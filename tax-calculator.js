// TaxEasy ZA 2025 - Main Tax Calculator Engine
// Comprehensive SARS-compliant tax calculation system

window.TaxCalculator = {
    // Main calculation function
    calculate: function(formData) {
        console.log('Starting tax calculation with data:', formData);
        
        try {
            // Step 1: Calculate gross income
            const grossIncome = this.calculateGrossIncome(formData);
            
            // Step 2: Calculate allowable deductions
            const deductions = this.calculateDeductions(formData, grossIncome);
            
            // Step 3: Calculate taxable income
            const taxableIncome = Math.max(0, grossIncome - deductions.total);
            
            // Step 4: Calculate tax before rebates
            const taxBeforeRebates = window.TAX_HELPERS.calculateTax(taxableIncome, formData.ageGroup);
            
            // Step 5: Apply rebates
            const rebates = window.TAX_HELPERS.getTotalRebates(formData.ageGroup);
            
            // Step 6: Calculate medical aid tax credits
            const medicalCredits = window.TAX_HELPERS.calculateMedicalCredits(
                formData.medicalMembers || 0, 
                formData.medicalDependants || 0
            );
            
            // Step 7: Calculate net tax payable
            const taxAfterRebates = Math.max(0, taxBeforeRebates - rebates);
            const netTaxPayable = Math.max(0, taxAfterRebates - medicalCredits);
            
            // Step 8: Calculate final result (refund or amount due)
            const taxesPaid = window.TAX_HELPERS.cleanNumericInput(formData.taxesPaid);
            const finalResult = netTaxPayable - taxesPaid;
            
            // Compile results
            const results = {
                grossIncome: grossIncome,
                deductions: deductions,
                taxableIncome: taxableIncome,
                taxBeforeRebates: taxBeforeRebates,
                rebates: rebates,
                taxAfterRebates: taxAfterRebates,
                medicalCredits: medicalCredits,
                netTaxPayable: netTaxPayable,
                taxesPaid: taxesPaid,
                finalResult: finalResult,
                isRefund: finalResult < 0,
                effectiveRate: grossIncome > 0 ? (netTaxPayable / grossIncome) * 100 : 0,
                marginalRate: this.getMarginalRate(taxableIncome, formData.ageGroup)
            };
            
            console.log('Tax calculation completed:', results);
            
            // Show the clear data button after calculation
            const clearBtn = document.getElementById('clearDataBtn');
            if (clearBtn) {
                clearBtn.style.display = 'inline-block';
            }
            
            return results;
            
        } catch (error) {
            console.error('Error in tax calculation:', error);
            throw new Error('Tax calculation failed: ' + error.message);
        }
    },
    
    // Calculate total gross income
    calculateGrossIncome: function(formData) {
        const income = {
            basicSalary: window.TAX_HELPERS.cleanNumericInput(formData.basicSalary),
            bonus: window.TAX_HELPERS.cleanNumericInput(formData.bonus),
            overtime: window.TAX_HELPERS.cleanNumericInput(formData.overtime),
            travelAllowance: this.calculateTravelAllowance(formData),
            cellphoneAllowance: window.TAX_HELPERS.cleanNumericInput(formData.cellphoneAllowance),
            otherAllowances: window.TAX_HELPERS.cleanNumericInput(formData.otherAllowances),
            interestIncome: this.calculateTaxableInterest(formData),
            dividendIncome: window.TAX_HELPERS.cleanNumericInput(formData.dividendIncome),
            rentalIncome: window.TAX_HELPERS.cleanNumericInput(formData.rentalIncome)
        };
        
        return Object.values(income).reduce((total, amount) => total + amount, 0);
    },
    
    // Calculate taxable interest (after exemption)
    calculateTaxableInterest: function(formData) {
        const totalInterest = window.TAX_HELPERS.cleanNumericInput(formData.interestIncome);
        const exemption = window.TAX_HELPERS.getInterestExemption(formData.ageGroup);
        return Math.max(0, totalInterest - exemption);
    },
    
    // Calculate all allowable deductions
    calculateDeductions: function(formData, grossIncome) {
        const deductions = {
            // Retirement funding
            pensionFund: this.calculatePensionDeduction(formData),
            providentFund: this.calculateProvidentDeduction(formData),
            retirementAnnuity: this.calculateRADeduction(formData, grossIncome),
            
            // Medical aid contributions
            medicalAid: window.TAX_HELPERS.cleanNumericInput(formData.medicalAid),
            
            // Other deductions
            donations: this.calculateDonationsDeduction(formData, grossIncome),
            homeOffice: this.calculateHomeOfficeDeduction(formData),
            travelExpenses: this.calculateTravelExpensesDeduction(formData) + this.calculateDeemedTravelExpensesDeduction(formData),
            professionalFees: window.TAX_HELPERS.cleanNumericInput(formData.professionalFees),
            rentalDeductions: window.TAX_HELPERS.cleanNumericInput(formData.rentalDeductions),
            occupationSpecific: this.calculateOccupationSpecificDeductions(formData),
            
            // Renewable energy deductions
            solarPV: this.calculateSolarPVDeduction(formData),
            solarWaterHeating: this.calculateSolarWaterHeatingDeduction(formData),
            otherRenewable: window.TAX_HELPERS.cleanNumericInput(formData.otherRenewable)
        };
        
        // Calculate total deductions
        deductions.total = Object.values(deductions).reduce((total, amount) => total + amount, 0);
        
        return deductions;
    },
    
    // Calculate pension fund deduction
    calculatePensionDeduction: function(formData) {
        const contribution = window.TAX_HELPERS.cleanNumericInput(formData.pensionFund);
        const limit = window.TAX_CONSTANTS_2025.LIMITS.pension_provident_percentage;
        const basicSalary = window.TAX_HELPERS.cleanNumericInput(formData.basicSalary);
        const maxDeduction = basicSalary * limit;
        
        return Math.min(contribution, maxDeduction);
    },
    
    // Calculate provident fund deduction
    calculateProvidentDeduction: function(formData) {
        const contribution = window.TAX_HELPERS.cleanNumericInput(formData.providentFund);
        const limit = window.TAX_CONSTANTS_2025.LIMITS.pension_provident_percentage;
        const basicSalary = window.TAX_HELPERS.cleanNumericInput(formData.basicSalary);
        const maxDeduction = basicSalary * limit;
        
        return Math.min(contribution, maxDeduction);
    },
    
    // Calculate retirement annuity deduction
    calculateRADeduction: function(formData, grossIncome) {
        const contribution = window.TAX_HELPERS.cleanNumericInput(formData.retirementAnnuity);
        const limits = window.TAX_CONSTANTS_2025.LIMITS;
        const maxByPercentage = grossIncome * limits.retirement_annuity_percentage;
        const maxByAmount = limits.retirement_annuity_max;
        const maxDeduction = Math.min(maxByPercentage, maxByAmount);
        
        return Math.min(contribution, maxDeduction);
    },
    
    // Calculate donations deduction
    calculateDonationsDeduction: function(formData, grossIncome) {
        const donations = window.TAX_HELPERS.cleanNumericInput(formData.donations);
        const limit = grossIncome * window.TAX_CONSTANTS_2025.LIMITS.donations_percentage;
        
        return Math.min(donations, limit);
    },
    
    // Calculate home office deduction
    calculateHomeOfficeDeduction: function(formData) {
        const homeOffice = window.TAX_HELPERS.cleanNumericInput(formData.homeOffice);
        const limit = window.TAX_CONSTANTS_2025.LIMITS.home_office_max;
        
        return Math.min(homeOffice, limit);
    },
    
    // Calculate solar PV deduction
    calculateSolarPVDeduction: function(formData) {
        const solarPV = window.TAX_HELPERS.cleanNumericInput(formData.solarPV);
        const limit = window.TAX_CONSTANTS_2025.LIMITS.solar_pv_max;
        
        return Math.min(solarPV, limit);
    },
    
    // Calculate travel allowance deduction
    calculateTravelAllowance: function(formData) {
        const allowance = window.TAX_HELPERS.cleanNumericInput(formData.travelAllowance);
        const travelMethod = formData.travelMethod;

        // If 'fully_taxable', the entire allowance is taxable.
        if (travelMethod === 'fully_taxable') {
            return allowance;
        }

        // For 'deemed_rate' and 'actual_cost', the allowance is initially fully taxable.
        // Deductions will be applied separately in calculateDeductions.
        // SARS requires at least 20% of the allowance to remain taxable if business travel is claimed.
        // The full allowance is added to gross income, and then the deductible portion is removed.
        return allowance;
    },

    // Calculate travel expenses deduction (for actual cost method)
    calculateTravelExpensesDeduction: function(formData) {
        if (formData.travelMethod !== 'actual_cost') {
            return 0;
        }

        const businessUsePercentage = window.TAX_HELPERS.cleanNumericInput(formData.businessUsePercentage) / 100;
        if (businessUsePercentage === 0) return 0;

        const fuelCosts = window.TAX_HELPERS.cleanNumericInput(formData.travelFuelCosts);
        const maintenanceCosts = window.TAX_HELPERS.cleanNumericInput(formData.travelMaintenanceCosts);
        const insuranceCosts = window.TAX_HELPERS.cleanNumericInput(formData.travelInsuranceCosts);
        const licenseFees = window.TAX_HELPERS.cleanNumericInput(formData.travelLicenseFees);
        const depreciation = window.TAX_HELPERS.cleanNumericInput(formData.travelDepreciation);
        const financeCharges = window.TAX_HELPERS.cleanNumericInput(formData.travelFinanceCharges);
        const otherCosts = window.TAX_HELPERS.cleanNumericInput(formData.travelOtherCosts);

        const totalActualCosts = fuelCosts + maintenanceCosts + insuranceCosts + licenseFees + depreciation + financeCharges + otherCosts;
        const deductibleActualCosts = totalActualCosts * businessUsePercentage;

        // SARS requires at least 20% of the travel allowance to remain taxable.
        // The deduction cannot reduce the taxable portion below 20% of the allowance.
        const allowance = window.TAX_HELPERS.cleanNumericInput(formData.travelAllowance);
        const maxDeductible = allowance * 0.80; // Max 80% of allowance can be deducted

        return Math.min(deductibleActualCosts, maxDeductible);
    },

    // Calculate deemed travel expenses deduction (for deemed rate method)
    calculateDeemedTravelExpensesDeduction: function(formData) {
        if (formData.travelMethod !== 'deemed_rate') {
            return 0;
        }

        const businessKm = window.TAX_HELPERS.cleanNumericInput(formData.businessKm);
        if (businessKm === 0) return 0;

        const deemedRatePerKm = window.TAX_CONSTANTS_2025.LIMITS.TRAVEL_RATES.deemed_rate_per_km;
        const deemedDeduction = businessKm * deemedRatePerKm;

        // SARS requires at least 20% of the travel allowance to remain taxable.
        const allowance = window.TAX_HELPERS.cleanNumericInput(formData.travelAllowance);
        const maxDeductible = allowance * 0.80; // Max 80% of allowance can be deducted

        return Math.min(deemedDeduction, maxDeductible);
    },

    // Calculate occupation-specific deductions
    calculateOccupationSpecificDeductions: function(formData) {
        const occupation = formData.occupation;
        const occupationDeductions = window.TAX_CONSTANTS_2025.OCCUPATION_SPECIFIC_DEDUCTIONS[occupation];
        let totalOccupationDeductions = 0;

        if (occupationDeductions) {
            for (const deductionType in occupationDeductions) {
                totalOccupationDeductions += occupationDeductions[deductionType];
            }
        }
        return totalOccupationDeductions;
    },

    // Calculate solar water heating deduction
    calculateSolarWaterHeatingDeduction: function(formData) {
        const cost = window.TAX_HELPERS.cleanNumericInput(formData.solarWaterHeating);
        const percentage = window.TAX_CONSTANTS_2025.LIMITS.solar_water_heating_percentage;
        
        return cost * percentage;
    },
    
    // Get marginal tax rate
    getMarginalRate: function(taxableIncome, ageGroup) {
        const brackets = window.TAX_HELPERS.getTaxBrackets(ageGroup);
        
        for (let bracket of brackets) {
            if (taxableIncome >= bracket.min && taxableIncome <= bracket.max) {
                return bracket.rate * 100;
            }
        }
        
        return 0;
    },
    
    // Validate form data
    validateFormData: function(formData) {
        const errors = [];
        
        // Check required fields
        if (!formData.fullName || formData.fullName.trim() === '') {
            errors.push('Full name is required');
        }
        
        if (!formData.emailAddress || !this.isValidEmail(formData.emailAddress)) {
            errors.push('Valid email address is required');
        }
        
        if (!formData.ageGroup) {
            errors.push('Age group is required');
        }
        
        // Check for negative values
        const numericFields = [
            'basicSalary', 'bonus', 'overtime', 'travelAllowance', 'cellphoneAllowance',
            'otherAllowances', 'interestIncome', 'dividendIncome', 'rentalIncome', 'rentalDeductions',
            'travelFuelCosts', 'travelMaintenanceCosts', 'travelInsuranceCosts', 'travelLicenseFees',
            'travelDepreciation', 'travelFinanceCharges', 'travelOtherCosts', 'businessUsePercentage',
            'pensionFund', 'providentFund', 'retirementAnnuity', 'medicalAid',
            'donations', 'homeOffice', 'travelExpenses', 'professionalFees',
            'solarPV', 'solarWaterHeating', 'otherRenewable', 'taxesPaid'
        ];
        
        numericFields.forEach(field => {
            const value = parseFloat(formData[field]);
            if (value < 0) {
                errors.push(`${field} cannot be negative`);
            }
        });
        
        return errors;
    },
    
    // Email validation
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Generate tax summary for display
    generateSummary: function(results) {
        return {
            income: {
                gross: window.TAX_HELPERS.formatCurrency(results.grossIncome),
                taxable: window.TAX_HELPERS.formatCurrency(results.taxableIncome)
            },
            deductions: {
                total: window.TAX_HELPERS.formatCurrency(results.deductions.total)
            },
            tax: {
                beforeRebates: window.TAX_HELPERS.formatCurrency(results.taxBeforeRebates),
                rebates: window.TAX_HELPERS.formatCurrency(results.rebates),
                afterRebates: window.TAX_HELPERS.formatCurrency(results.taxAfterRebates),
                medicalCredits: window.TAX_HELPERS.formatCurrency(results.medicalCredits),
                netPayable: window.TAX_HELPERS.formatCurrency(results.netTaxPayable)
            },
            result: {
                amount: window.TAX_HELPERS.formatCurrency(Math.abs(results.finalResult)),
                type: results.isRefund ? 'refund' : 'payable',
                effectiveRate: results.effectiveRate.toFixed(2) + '%',
                marginalRate: results.marginalRate.toFixed(2) + '%'
            }
        };
    }
};

// Export for use in other modules
window.calculateTax = function(formData) {
    return window.TaxCalculator.calculate(formData);
};

console.log('Tax calculator engine loaded successfully');
