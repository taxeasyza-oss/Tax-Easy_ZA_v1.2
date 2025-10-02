// SARS Compliance Data - Source Codes and Legislation References
// Updated for 2025 Tax Year

window.SARSComplianceData = {
    // Income Source Codes
    incomeCodes: {
        "3601": {
            description: "Income - Taxable (Basic Salary)",
            legislation: "Section 1 of the Income Tax Act 58 of 1962",
            efilingCode: "3601",
            category: "Employment Income"
        },
        "3602": {
            description: "Income - Non-taxable",
            legislation: "Section 10 of the Income Tax Act 58 of 1962",
            efilingCode: "3602",
            category: "Non-taxable Income"
        },
        "3603": {
            description: "Pension - PAYE",
            legislation: "Section 1 and Fourth Schedule of the Income Tax Act",
            efilingCode: "3603",
            category: "Pension Income"
        },
        "3605": {
            description: "Annual Payment",
            legislation: "Section 1 of the Income Tax Act 58 of 1962",
            efilingCode: "3605",
            category: "Other Income"
        },
        "3610": {
            description: "Bonus",
            legislation: "Section 1 of the Income Tax Act 58 of 1962",
            efilingCode: "3610",
            category: "Employment Income"
        },
        "3615": {
            description: "Overtime",
            legislation: "Section 1 of the Income Tax Act 58 of 1962",
            efilingCode: "3615",
            category: "Employment Income"
        },
        "3701": {
            description: "Travel Allowance",
            legislation: "Section 8(1)(b)(ii) of the Income Tax Act",
            efilingCode: "3701",
            category: "Allowances"
        },
        "3702": {
            description: "Subsistence Allowance",
            legislation: "Section 8(1)(a) of the Income Tax Act",
            efilingCode: "3702",
            category: "Allowances"
        },
        "3703": {
            description: "Entertainment Allowance",
            legislation: "Section 8(1)(a) of the Income Tax Act",
            efilingCode: "3703",
            category: "Allowances"
        },
        "3704": {
            description: "Other Allowances",
            legislation: "Section 8(1) of the Income Tax Act",
            efilingCode: "3704",
            category: "Allowances"
        },
        "3706": {
            description: "Cellphone Allowance",
            legislation: "Section 8(1)(a) of the Income Tax Act",
            efilingCode: "3706",
            category: "Allowances"
        }
    },

    // Deduction Source Codes
    deductionCodes: {
        "4001": {
            description: "Pension Fund Contributions",
            legislation: "Section 11F of the Income Tax Act",
            efilingCode: "4001",
            category: "Retirement Contributions",
            limit: "27.5% of remuneration or taxable income, max R350,000"
        },
        "4002": {
            description: "Provident Fund Contributions",
            legislation: "Section 11F of the Income Tax Act",
            efilingCode: "4002",
            category: "Retirement Contributions",
            limit: "27.5% of remuneration or taxable income, max R350,000"
        },
        "4003": {
            description: "Retirement Annuity Contributions",
            legislation: "Section 11F of the Income Tax Act",
            efilingCode: "4003",
            category: "Retirement Contributions",
            limit: "27.5% of non-retirement funding income, max R350,000"
        },
        "4004": {
            description: "Medical Aid Contributions",
            legislation: "Section 6A of the Income Tax Act",
            efilingCode: "4004",
            category: "Medical Expenses"
        },
        "4005": {
            description: "Additional Medical Expenses",
            legislation: "Section 6B of the Income Tax Act",
            efilingCode: "4005",
            category: "Medical Expenses",
            limit: "Qualifying medical expenses exceeding 3x medical aid credits"
        },
        "4006": {
            description: "Donations to Registered Charities",
            legislation: "Section 18A of the Income Tax Act",
            efilingCode: "4006",
            category: "Donations",
            limit: "10% of taxable income"
        },
        "4007": {
            description: "Home Office Expenses",
            legislation: "Section 11(2)(a) of the Income Tax Act",
            efilingCode: "4007",
            category: "Business Expenses",
            limit: "R15,000 per annum for qualifying taxpayers"
        },
        "4008": {
            description: "Professional Fees and Subscriptions",
            legislation: "Section 11(a) of the Income Tax Act",
            efilingCode: "4008",
            category: "Business Expenses"
        },
        "4009": {
            description: "Travel Expenses (Business)",
            legislation: "Section 8(1)(b)(ii) and Section 11(a) of the Income Tax Act",
            efilingCode: "4009",
            category: "Business Expenses"
        }
    },

    // Tax Credits
    taxCredits: {
        "medical_aid_credits": {
            description: "Medical Aid Tax Credits",
            legislation: "Section 6A of the Income Tax Act",
            rates: {
                "main_member": "R347 per month",
                "first_dependant": "R347 per month", 
                "additional_dependants": "R234 per month each"
            }
        },
        "primary_rebate": {
            description: "Primary Rebate",
            legislation: "Section 6 of the Income Tax Act",
            amount: "R17,235 per annum (under 65)"
        },
        "secondary_rebate": {
            description: "Secondary Rebate (65-74)",
            legislation: "Section 6 of the Income Tax Act",
            amount: "R9,444 per annum (65-74 years)"
        },
        "tertiary_rebate": {
            description: "Tertiary Rebate (75+)",
            legislation: "Section 6 of the Income Tax Act",
            amount: "R3,145 per annum (75+ years)"
        }
    },

    // Solar and Renewable Energy Incentives
    renewableEnergy: {
        "solar_pv": {
            description: "Solar PV Installation Deduction",
            legislation: "Section 12B of the Income Tax Act",
            efilingCode: "4010",
            limit: "25% of cost per year over 4 years, max R1,000,000 total",
            category: "Renewable Energy"
        },
        "solar_water_heating": {
            description: "Solar Water Heating Deduction",
            legislation: "Section 12B of the Income Tax Act",
            efilingCode: "4011",
            limit: "25% of cost per year over 4 years",
            category: "Renewable Energy"
        }
    },

    // Rental Income and Deductions
    rentalIncome: {
        "rental_income": {
            description: "Rental Income",
            legislation: "Section 1 of the Income Tax Act",
            efilingCode: "1901",
            category: "Rental Income"
        },
        "rental_expenses": {
            description: "Rental Property Expenses",
            legislation: "Section 11(a) of the Income Tax Act",
            efilingCode: "4020",
            category: "Rental Deductions",
            allowableExpenses: [
                "Property management fees",
                "Repairs and maintenance",
                "Insurance premiums",
                "Municipal rates and taxes",
                "Interest on mortgage bonds",
                "Advertising costs",
                "Legal fees for lease agreements"
            ]
        },
        "rental_depreciation": {
            description: "Rental Property Depreciation",
            legislation: "Section 11(e) of the Income Tax Act",
            efilingCode: "4021",
            category: "Rental Deductions",
            rate: "5% per annum on cost of improvements"
        }
    },

    // Travel Allowance Specific Codes
    travelAllowance: {
        "deemed_rate_2025": {
            description: "Deemed Rate per Kilometer (2025)",
            legislation: "Section 8(1)(b)(ii) of the Income Tax Act",
            rates: {
                "up_to_20000km": "R4.28 per km",
                "20001_to_40000km": "R2.84 per km", 
                "above_40000km": "R2.04 per km"
            },
            requirements: "Detailed logbook mandatory"
        },
        "actual_cost_method": {
            description: "Actual Cost Method",
            legislation: "Section 8(1)(b)(ii) of the Income Tax Act",
            requirements: "Detailed logbook and all receipts mandatory",
            allowableExpenses: [
                "Fuel costs",
                "Maintenance and repairs",
                "Insurance premiums",
                "License fees",
                "Depreciation",
                "Finance charges"
            ]
        }
    },

    // Tax Thresholds for 2025
    taxThresholds: {
        "under_65": {
            threshold: "R95,750",
            legislation: "Government Gazette - Tax Tables 2025"
        },
        "65_to_74": {
            threshold: "R148,217", 
            legislation: "Government Gazette - Tax Tables 2025"
        },
        "75_and_over": {
            threshold: "R165,689",
            legislation: "Government Gazette - Tax Tables 2025"
        }
    },

    // Get compliance info for a specific field
    getComplianceInfo: function(fieldType, subType = null) {
        switch(fieldType) {
            case 'income':
                return this.incomeCodes[subType] || null;
            case 'deduction':
                return this.deductionCodes[subType] || null;
            case 'credit':
                return this.taxCredits[subType] || null;
            case 'renewable':
                return this.renewableEnergy[subType] || null;
            case 'rental':
                return this.rentalIncome[subType] || null;
            case 'travel':
                return this.travelAllowance[subType] || null;
            default:
                return null;
        }
    },

    // Get formatted tooltip text
    getTooltipText: function(fieldType, subType = null) {
        const info = this.getComplianceInfo(fieldType, subType);
        if (!info) return null;

        let tooltip = `<strong>${info.description}</strong><br/>`;
        tooltip += `<em>SARS Code:</em> ${info.efilingCode}<br/>`;
        tooltip += `<em>Legislation:</em> ${info.legislation}`;
        
        if (info.limit) {
            tooltip += `<br/><em>Limit:</em> ${info.limit}`;
        }
        
        if (info.rates) {
            tooltip += `<br/><em>Rates:</em><br/>`;
            for (const [key, value] of Object.entries(info.rates)) {
                tooltip += `• ${key.replace(/_/g, ' ')}: ${value}<br/>`;
            }
        }

        return tooltip;
    }
};

console.log('SARS Compliance Data loaded successfully');
