

window.TAX_CONSTANTS_2025 = {
    TAX_BRACKETS: {
        under65: [
            { min: 0, max: 237100, rate: 0.18, cumulative: 0 },
            { min: 237101, max: 370500, rate: 0.26, cumulative: 42678 },
            { min: 370501, max: 512800, rate: 0.31, cumulative: 77362 },
            { min: 512801, max: 673000, rate: 0.36, cumulative: 121475 },
            { min: 673001, max: 857900, rate: 0.39, cumulative: 179147 },
            { min: 857901, max: 1817000, rate: 0.41, cumulative: 251258 },
            { min: 1817001, max: Infinity, rate: 0.45, cumulative: 644489 }
        ],
        age65to74: [
            { min: 0, max: 237100, rate: 0.18, cumulative: 0 },
            { min: 237101, max: 370500, rate: 0.26, cumulative: 42678 },
            { min: 370501, max: 512800, rate: 0.31, cumulative: 77362 },
            { min: 512801, max: 673000, rate: 0.36, cumulative: 121475 },
            { min: 673001, max: 857900, rate: 0.39, cumulative: 179147 },
            { min: 857901, max: 1817000, rate: 0.41, cumulative: 251258 },
            { min: 1817001, max: Infinity, rate: 0.45, cumulative: 644489 }
        ],
        age75plus: [
            { min: 0, max: 237100, rate: 0.18, cumulative: 0 },
            { min: 237101, max: 370500, rate: 0.26, cumulative: 42678 },
            { min: 370501, max: 512800, rate: 0.31, cumulative: 77362 },
            { min: 512801, max: 673000, rate: 0.36, cumulative: 121475 },
            { min: 673001, max: 857900, rate: 0.39, cumulative: 179147 },
            { min: 857901, max: 1817000, rate: 0.41, cumulative: 251258 },
            { min: 1817001, max: Infinity, rate: 0.45, cumulative: 644489 }
        ]
    },
    REBATES: {
        primary: 17235,
        secondary: 9444,
        tertiary: 3145
    },
    TAX_THRESHOLDS: {
        under65: 95750,
        age65to74: 148217,
        age75plus: 165689
    },
    MEDICAL_CREDITS: {
        main_member: 364,
        dependant: 246
    },
    INTEREST_EXEMPTION: {
        under65: 23800,
        age65plus: 34500
    },
    LIMITS: {
        retirement_annuity_percentage: 0.275,
        retirement_annuity_max: 350000,
        pension_provident_percentage: 0.275,
        home_office_max: 15000,
        solar_pv_max: 1000000,
        solar_water_heating_percentage: 0.25,
        donations_percentage: 0.10,
        TRAVEL_RATES: {
            deemed_rate_per_km: 4.76,
        },
        OCCUPATION_DEDUCTIONS: {
            teacher: {
                description: "Educator-specific deductions (e.g., educational materials, professional development fees)",
                max_deduction: 5000,
                percentage_of_income: 0.02
            },
            doctor: {
                description: "Medical professional deductions (e.g., medical journals, professional body fees, specialized equipment)",
                max_deduction: 15000,
                percentage_of_income: 0.03
            },
            engineer: {
                description: "Engineer-specific deductions (e.g., professional body fees, specialized software, tools)",
                max_deduction: 10000,
                percentage_of_income: 0.025
            },
            none: {
                description: "No specific occupation deductions apply.",
                max_deduction: 0,
                percentage_of_income: 0
            }
        },
        medical_expenses_threshold_percentage: 0.075,
        medical_expenses_qualifying_percentage: 0.25
    },
    UIF: {
        employee_rate: 0.01,
        employer_rate: 0.01,
        max_monthly: 177.12
    },
    SDL: {
        rate: 0.01,
        threshold: 500000
    },
    PROVISIONAL_TAX: {
        threshold: 1000,
        penalty_rate: 0.20
    },
    CAPITAL_GAINS: {
        inclusion_rate_individuals: 0.40,
        inclusion_rate_companies: 0.80,
        annual_exclusion: 40000
    },
    FRINGE_BENEFITS: {
        motor_vehicle_private_use: 0.035,
        low_interest_loan_rate: 0.075,
        accommodation_benefit_rate: 0.17
    }
};

window.TAX_HELPERS = {
    getTaxBrackets: function(ageGroup) {
        switch(ageGroup) {
            case '65-74':
                return window.TAX_CONSTANTS_2025.TAX_BRACKETS.age65to74;
            case '75plus':
                return window.TAX_CONSTANTS_2025.TAX_BRACKETS.age75plus;
            default:
                return window.TAX_CONSTANTS_2025.TAX_BRACKETS.under65;
        }
    },
    getTotalRebates: function(ageGroup) {
        const rebates = window.TAX_CONSTANTS_2025.REBATES;
        switch(ageGroup) {
            case '65-74':
                return rebates.primary + rebates.secondary;
            case '75plus':
                return rebates.primary + rebates.secondary + rebates.tertiary;
            default:
                return rebates.primary;
        }
    },
    getTaxThreshold: function(ageGroup) {
        const thresholds = window.TAX_CONSTANTS_2025.TAX_THRESHOLDS;
        switch(ageGroup) {
            case '65-74':
                return thresholds.age65to74;
            case '75plus':
                return thresholds.age75plus;
            default:
                return thresholds.under65;
        }
    },
    getInterestExemption: function(ageGroup) {
        const exemptions = window.TAX_CONSTANTS_2025.INTEREST_EXEMPTION;
        return (ageGroup === '65-74' || ageGroup === '75plus') ? 
               exemptions.age65plus : exemptions.under65;
    },
    calculateTax: function(taxableIncome, ageGroup) {
        const brackets = this.getTaxBrackets(ageGroup);
        let tax = 0;
        
        for (let bracket of brackets) {
            if (taxableIncome > bracket.min) {
                const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min + 1;
                tax = bracket.cumulative + (taxableInBracket * bracket.rate);
            } else {
                break;
            }
        }
        
        return Math.max(0, tax);
    },
    calculateMedicalCredits: function(members, dependants) {
        const credits = window.TAX_CONSTANTS_2025.MEDICAL_CREDITS;
        return (members * credits.main_member * 12) + (dependants * credits.dependant * 12);
    },
    formatCurrency: function(amount) {
        return 'R' + Math.round(amount).toLocaleString('en-ZA');
    },
    cleanNumericInput: function(value) {
        const cleaned = parseFloat(value) || 0;
        return Math.max(0, cleaned);
    }
};


window.TAX_HELPERS = {
    getTaxBrackets: function(ageGroup) {
        switch(ageGroup) {
            case '65-74':
                return window.TAX_CONSTANTS_2025.TAX_BRACKETS.age65to74;
            case '75plus':
                return window.TAX_CONSTANTS_2025.TAX_BRACKETS.age75plus;
            default:
                return window.TAX_CONSTANTS_2025.TAX_BRACKETS.under65;
        }
    },
    getTotalRebates: function(ageGroup) {
        const rebates = window.TAX_CONSTANTS_2025.REBATES;
        switch(ageGroup) {
            case '65-74':
                return rebates.primary + rebates.secondary;
            case '75plus':
                return rebates.primary + rebates.secondary + rebates.tertiary;
            default:
                return rebates.primary;
        }
    },
    getTaxThreshold: function(ageGroup) {
        const thresholds = window.TAX_CONSTANTS_2025.TAX_THRESHOLDS;
        switch(ageGroup) {
            case '65-74':
                return thresholds.age65to74;
            case '75plus':
                return thresholds.age75plus;
            default:
                return thresholds.under65;
        }
    },
    getInterestExemption: function(ageGroup) {
        const exemptions = window.TAX_CONSTANTS_2025.INTEREST_EXEMPTION;
        return (ageGroup === '65-74' || ageGroup === '75plus') ? 
               exemptions.age65plus : exemptions.under65;
    },
    calculateTax: function(taxableIncome, ageGroup) {
        const brackets = this.getTaxBrackets(ageGroup);
        let tax = 0;
        
        for (let bracket of brackets) {
            if (taxableIncome > bracket.min) {
                const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min + 1;
                tax = bracket.cumulative + (taxableInBracket * bracket.rate);
            } else {
                break;
            }
        }
        
        return Math.max(0, tax);
    },
    calculateMedicalCredits: function(members, dependants) {
        const credits = window.TAX_CONSTANTS_2025.MEDICAL_CREDITS;
        return (members * credits.main_member * 12) + (dependants * credits.dependant * 12);
    },
    formatCurrency: function(amount) {
        return 'R' + Math.round(amount).toLocaleString('en-ZA');
    },
    cleanNumericInput: function(value) {
        const cleaned = parseFloat(value) || 0;
        return Math.max(0, cleaned);
    }
};


window.SARSComplianceData = {
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
        },        "3701": {
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


window.TaxEasyPromoCodes = {
    enabled: true,
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
    ],
    promoCodeApplied: false,
    appliedPromoCode: null,
    initialize: function() {
        if (!this.enabled) return;
        console.log('Initializing promotional code system...');
        this.loadUsedCodes();
        this.createPromoCodeUI();
        this.attachEventListeners();
    },
    createPromoCodeUI: function() {
        if (document.getElementById('promoCodeModal')) return;
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
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const promoLink = document.createElement('div');
        promoLink.innerHTML = `
            <div class="promo-code-link-container">
                <a href="#" id="showPromoCodeLink" class="promo-code-link">
                    Have a promotional code? Click here
                </a>
            </div>
        `;
        const summarySection = document.querySelector('.wizard-step[data-step="5"]');
        if (summarySection) {
            summarySection.appendChild(promoLink);
        }
        this.addPromoCodeStyles();
    },
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
    attachEventListeners: function() {
        const showLink = document.getElementById('showPromoCodeLink');
        if (showLink) {
            showLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal();
            });
        }
        const closeBtn = document.getElementById('closePromoModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideModal();
            });
        }
        const overlay = document.querySelector('.promo-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.hideModal();
            });
        }
        const applyBtn = document.getElementById('applyPromoCode');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.validatePromoCode();
            });
        }
        const input = document.getElementById('promoCodeInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.validatePromoCode();
                }
            });
        }
        this.modifyPurchaseButton();
    },
    showModal: function() {
        const modal = document.getElementById('promoCodeModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const input = document.getElementById('promoCodeInput');
                if (input) input.focus();
            }, 100);
        }
    },
    hideModal: function() {
        const modal = document.getElementById('promoCodeModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    },
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
        applyBtn.disabled = true;
        applyBtn.textContent = 'Validating...';
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
                codeEntry.used = true;
                codeEntry.usedAt = new Date().toISOString();
                this.promoCodeApplied = true;
                this.appliedPromoCode = code;
                window.promoCodeApplied = true;
                window.appliedPromoCode = code;
                this.saveUsedCode(codeEntry);
                this.showMessage('✅ Promotional code applied successfully! You can now download the professional report for free.', 'success');
                this.updateUIForAppliedPromoCode();
                input.disabled = true;
                applyBtn.disabled = true;
                applyBtn.textContent = 'Applied';
                setTimeout(() => {
                    this.hideModal();
                }, 2000);
            }
        }, 1000);
    },
    showMessage: function(message, type) {
        const messageDiv = document.getElementById('promoCodeMessage');
        if (!messageDiv) return;
        messageDiv.textContent = message;
        messageDiv.className = `promo-message ${type}`;
    },
    updateUIForAppliedPromoCode: function() {
        const purchaseButton = document.getElementById('purchaseProfessionalReport');
        const showPromoLink = document.getElementById('showPromoCodeLink');
        if (purchaseButton) {
            purchaseButton.textContent = 'Download Professional Report (FREE)';
            purchaseButton.style.backgroundColor = '#27ae60';
            purchaseButton.style.borderColor = '#27ae60';
            purchaseButton.title = 'Professional report unlocked with promotional code';
            purchaseButton.removeEventListener('click', window.taxEasyPayFast.processProfessionalReportPayment);
            purchaseButton.addEventListener('click', () => {
                window.PDFGenerator.generateProfessionalReport(window.WizardNavigation.formData, window.WizardNavigation.calculationResults, true, true);
            });
        }
        if (showPromoLink) {
            showPromoLink.style.display = 'none';
        }
    },
    modifyPurchaseButton: function() {
        const purchaseButton = document.getElementById('purchaseProfessionalReport');
        if (purchaseButton) {
            // Ensure the button is initially set up to use PayFast
            // The promo code logic will override this if a code is applied
            purchaseButton.removeEventListener('click', window.taxEasyPayFast.processProfessionalReportPayment);
            purchaseButton.addEventListener('click', (e) => {
                if (window.promoCodeApplied) {
                    e.preventDefault();
                    window.PDFGenerator.generateProfessionalReport(window.WizardNavigation.formData, window.WizardNavigation.calculationResults, true, true);
                } else {
                    // If no promo code, proceed with PayFast payment
                    window.taxEasyPayFast.processProfessionalReportPayment();
                }
            });
        }
    },
    loadUsedCodes: function() {
        const usedCodes = JSON.parse(localStorage.getItem('taxeasy_used_promo_codes') || '[]');
        usedCodes.forEach(usedCode => {
            const codeEntry = this.codes.find(entry => entry.code === usedCode.code);
            if (codeEntry) {
                codeEntry.used = true;
                codeEntry.usedAt = usedCode.usedAt;
            }
        });
    },
    saveUsedCode: function(codeEntry) {
        const usedCodes = JSON.parse(localStorage.getItem('taxeasy_used_promo_codes') || '[]');
        usedCodes.push({ code: codeEntry.code, usedAt: codeEntry.usedAt });
        localStorage.setItem('taxeasy_used_promo_codes', JSON.stringify(usedCodes));
    }
};


class TaxEasyPayFastIntegration {
    constructor() {
        this.merchantId = '10000100';
        this.merchantKey = '46f0cd694581a';
        this.passPhrase = 'jt7NOE43FZPn';
        this.testMode = true;
        this.baseUrl = this.testMode ? 
            'https://sandbox.payfast.co.za/eng/process' : 
            'https://www.payfast.co.za/eng/process';
        this.reportPrice = 14900;
        this.currency = 'ZAR';
    }

    initialize() {
        console.log('Initializing PayFast integration for professional reports...');
        this.attachEventListeners();
        this.createPaymentPages();
    }

    attachEventListeners() {
        const professionalBtn = document.getElementById('purchaseProfessionalReport');
        if (professionalBtn) {
            professionalBtn.addEventListener('click', (e) => {
                if (window.promoCodeApplied || (window.TaxEasyPromoCodes && window.TaxEasyPromoCodes.promoCodeApplied)) {
                    return;
                }
                e.preventDefault();
                this.processProfessionalReportPayment();
            });
        }
    }

    processProfessionalReportPayment() {
        try {
            const userDetails = this.collectUserDetails();
            if (!userDetails) {
                return;
            }
            if (!this.validateUserDetails(userDetails)) {
                return;
            }
            this.showPaymentConfirmation(userDetails);
        } catch (error) {
            console.error('Payment processing error:', error);
            this.showError('Payment Error: ' + error.message);
        }
    }

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

    proceedToPayment(encodedUserDetails) {
        try {
            const userDetails = JSON.parse(atob(encodedUserDetails));
            const modal = document.querySelector('div[style*="position: fixed"]');
            if (modal) modal.remove();
            this.showPaymentLoading();
            const paymentForm = this.generatePaymentForm(userDetails);
            document.body.appendChild(paymentForm);
            this.storePaymentDetails(userDetails);
            setTimeout(() => {
                paymentForm.submit();
            }, 1000);
        } catch (error) {
            console.error('Payment submission error:', error);
            this.hidePaymentLoading();
            this.showError('Error processing payment: ' + error.message);
        }
    }

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
        paymentData.signature = this.generateSignature(paymentData);
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = this.baseUrl;
        form.style.display = 'none';
        form.id = 'payfastPaymentForm';
        for (let key in paymentData) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentData[key];
            form.appendChild(input);
        }
        return form;
    }

    generatePaymentId() {
        return 'TAXEASY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateSignature(data) {
        let paramString = '';
        const sortedKeys = Object.keys(data).sort();
        for (let key of sortedKeys) {
            if (key !== 'signature' && data[key] !== '') {
                paramString += key + '=' + encodeURIComponent(data[key]).replace(/%20/g, '+') + '&';
            }
        }
        paramString = paramString.slice(0, -1);
        if (this.passPhrase) {
            paramString += '&passphrase=' + encodeURIComponent(this.passPhrase);
        }
        return this.simpleHash(paramString);
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    collectUserDetails() {
        const form = document.getElementById('taxCalculatorForm');
        if (!form) {
            this.showError('Please complete the tax calculation form before proceeding with payment.');
            return null;
        }
        const formData = new FormData(form);
        const userDetails = {};
        userDetails.fullName = formData.get('fullName') || '';
        userDetails.email = formData.get('emailAddress') || '';
        userDetails.idNumber = formData.get('idNumber') || '';
        const nameParts = userDetails.fullName.split(' ');
        userDetails.firstName = nameParts[0] || '';
        userDetails.lastName = nameParts.slice(1).join(' ') || '';
        userDetails.taxData = {
            basicSalary: parseFloat(formData.get('basicSalary')) || 0,
            bonus: parseFloat(formData.get('bonus')) || 0,
            overtime: parseFloat(formData.get('overtime')) || 0,
            pensionFund: parseFloat(formData.get('pensionFund')) || 0,
            medicalAid: parseFloat(formData.get('medicalAid')) || 0,
            grossIncome: this.getDisplayValue('summaryGrossIncome'),
            taxableIncome: this.getDisplayValue('summaryTaxableIncome'),
            taxPayable: this.getDisplayValue('summaryTaxPayable'),
            monthlyTax: this.getDisplayValue('summaryMonthlyTax'),
            effectiveRate: this.getDisplayValue('summaryEffectiveRate', '%'),
            netIncome: this.getDisplayValue('summaryNetIncome')
        };
        userDetails.language = localStorage.getItem('selectedLanguage') || 'en';
        return userDetails;
    }

    getDisplayValue(elementId, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return 0;
        let value = element.textContent.replace(/[R,\s]/g, '');
        if (suffix) {
            value = value.replace(suffix, '');
        }
        return parseFloat(value) || 0;
    }

    validateUserDetails(userDetails) {
        if (!userDetails.fullName.trim()) {
            this.showError('Please enter your full name in the Personal Information section.');
            return false;
        }
        if (!userDetails.email.trim()) {
            this.showError('Please enter your email address in the Personal Information section.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userDetails.email)) {
            this.showError('Please enter a valid email address.');
            return false;
        }
        return true;
    }

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

    createPaymentPages() {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment_status');
        if (paymentStatus === 'success') {
            this.handlePaymentSuccess();
        } else if (paymentStatus === 'cancelled') {
            this.handlePaymentCancelled();
        }
    }

    handlePaymentSuccess() {
        const paymentDetails = JSON.parse(localStorage.getItem('taxeasy_payment_details') || '{}');
        if (paymentDetails.userDetails && window.ProfessionalPDFGenerator) {
            window.ProfessionalPDFGenerator.generateReport(
                paymentDetails.userDetails, 
                paymentDetails.userDetails.taxData, 
                true, 
                false 
            );
        }
    }

    handlePaymentCancelled() {
        alert('Payment was cancelled. You can try again or contact support.');
    }

    showError(message) {
        alert(message);
    }

    showPaymentLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'paymentLoadingOverlay';
        loadingDiv.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); z-index: 10001; display: flex; justify-content: center; align-items: center; flex-direction: column;';
        loadingDiv.innerHTML = `
            <div style="border: 8px solid #f3f3f3; border-top: 8px solid #3498db; border-radius: 50%; width: 60px; height: 60px; animation: spin 2s linear infinite;"></div>
            <p style="margin-top: 1rem; font-size: 1.2rem; color: #333;">Redirecting to PayFast...</p>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loadingDiv);
    }

    hidePaymentLoading() {
        const loadingDiv = document.getElementById('paymentLoadingOverlay');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
}

window.taxEasyPayFast = new TaxEasyPayFastIntegration();
window.taxEasyPayFast.initialize();


window.TaxCalculator = {
    calculate: function(formData) {
        try {
            // Input validation and sanitization
            const errors = this.validateFormData(formData);
            if (errors.length > 0) {
                throw new Error(JSON.stringify(errors));
            }

            // Clean and parse input values
            const basicSalary = window.TAX_HELPERS.cleanNumericInput(formData.get("basicSalary"));
            const bonus = window.TAX_HELPERS.cleanNumericInput(formData.get("bonus"));
            const overtime = window.TAX_HELPERS.cleanNumericInput(formData.get("overtime"));
            const pensionFund = window.TAX_HELPERS.cleanNumericInput(formData.get("pensionFund"));
            const medicalAid = window.TAX_HELPERS.cleanNumericInput(formData.get("medicalAid"));
            const travelAllowance = window.TAX_HELPERS.cleanNumericInput(formData.get("travelAllowance"));
            const cellphoneAllowance = window.TAX_HELPERS.cleanNumericInput(formData.get("cellphoneAllowance"));
            const otherAllowances = window.TAX_HELPERS.cleanNumericInput(formData.get("otherAllowances"));
            const interestIncome = window.TAX_HELPERS.cleanNumericInput(formData.get("interestIncome"));
            const dividendIncome = window.TAX_HELPERS.cleanNumericInput(formData.get("dividendIncome"));
            const rentalIncome = window.TAX_HELPERS.cleanNumericInput(formData.get("rentalIncome"));
            const rentalExpenses = window.TAX_HELPERS.cleanNumericInput(formData.get("rentalExpenses"));
            const homeOfficeExpenses = window.TAX_HELPERS.cleanNumericInput(formData.get("homeOfficeExpenses"));
            const donations = window.TAX_HELPERS.cleanNumericInput(formData.get("donations"));
            const medicalExpenses = window.TAX_HELPERS.cleanNumericInput(formData.get("medicalExpenses"));
            const sarsTaxesPaid = window.TAX_HELPERS.cleanNumericInput(formData.get("sarsTaxesPaid"));
            const membersMedicalAid = window.TAX_HELPERS.cleanNumericInput(formData.get("membersMedicalAid"));
            const dependantsMedicalAid = window.TAX_HELPERS.cleanNumericInput(formData.get("dependantsMedicalAid"));
            const ageGroup = formData.get("ageGroup");
            const occupation = formData.get("occupation");

            // Calculate Gross Income
            let grossIncome = basicSalary + bonus + overtime + travelAllowance + cellphoneAllowance + otherAllowances + interestIncome + dividendIncome + this.calculateNetRentalIncome(rentalIncome, rentalExpenses);

            // Calculate Deductions
            let totalDeductions = this.calculateDeductions({
                pensionFund,
                medicalAid,
                travelAllowance,
                homeOfficeExpenses,
                donations,
                medicalExpenses,
                grossIncome,
                taxableIncomeBeforeDeductions: grossIncome, // For percentage-based deductions
                occupation
            });

            let taxableIncome = grossIncome - totalDeductions;
            taxableIncome = Math.max(0, taxableIncome); // Taxable income cannot be negative

            // Calculate Tax Before Rebates
            const taxBeforeRebates = window.TAX_HELPERS.calculateTax(taxableIncome, ageGroup);

            // Calculate Rebates
            const rebates = window.TAX_HELPERS.getTotalRebates(ageGroup);

            // Calculate Tax After Rebates
            let taxAfterRebates = taxBeforeRebates - rebates;
            taxAfterRebates = Math.max(0, taxAfterRebates); // Tax after rebates cannot be negative

            // Calculate Medical Aid Credits
            const medicalCredits = window.TAX_HELPERS.calculateMedicalCredits(membersMedicalAid, dependantsMedicalAid);

            // Calculate Net Tax Payable
            let netTaxPayable = taxAfterRebates - medicalCredits;
            netTaxPayable = Math.max(0, netTaxPayable); // Net tax payable cannot be negative

            // Calculate Final Result (Refund or Amount Due)
            const finalResult = netTaxPayable - sarsTaxesPaid;

            // Determine if it's a refund or amount due
            const isRefund = finalResult < 0;

            // Calculate Effective Tax Rate
            const effectiveRate = grossIncome > 0 ? (netTaxPayable / grossIncome) * 100 : 0;

            // Calculate Marginal Tax Rate (simplified for demo - actual marginal rate depends on bracket)
            const marginalRate = window.TAX_HELPERS.getTaxBrackets(ageGroup).find(bracket => taxableIncome <= bracket.max)?.rate * 100 || 0;

            return {
                grossIncome,
                totalDeductions,
                taxableIncome,
                taxBeforeRebates,
                rebates,
                taxAfterRebates,
                medicalCredits,
                netTaxPayable,
                finalResult,
                isRefund,
                effectiveRate,
                marginalRate,
                taxesPaid: sarsTaxesPaid,
                deductions: {
                    pensionFund,
                    medicalAid,
                    travelAllowance,
                    homeOfficeExpenses,
                    donations,
                    medicalExpenses,
                    occupationSpecific: this.calculateOccupationDeduction(occupation, grossIncome)
                }
            };
        } catch (error) {
            console.error("Tax calculation error:", error);
            throw error; // Re-throw to be caught by caller
        }
    },

    calculateNetRentalIncome: function(rentalIncome, rentalExpenses) {
        const netRentalIncome = rentalIncome - rentalExpenses;
        return Math.max(0, netRentalIncome); // Rental deductions cannot create a loss
    },

    calculateDeductions: function(deductionData) {
        let totalDeductions = 0;

        // Pension Fund Contributions (Section 11F)
        const pensionLimit = Math.min(
            deductionData.pensionFund,
            deductionData.taxableIncomeBeforeDeductions * window.TAX_CONSTANTS_2025.LIMITS.retirement_annuity_percentage,
            window.TAX_CONSTANTS_2025.LIMITS.retirement_annuity_max
        );
        totalDeductions += pensionLimit;

        // Medical Aid Contributions (already handled by credits, but if there were a deduction component)
        // For now, assuming medical aid is handled by credits, not a direct deduction here.

        // Travel Allowance (assuming a portion is deductible based on logbook/business use)
        // This is a simplified example; actual travel allowance deductions are complex.
        totalDeductions += deductionData.travelAllowance * 0.5; // Example: 50% deductible

        // Home Office Expenses (Section 11(a))
        const homeOfficeLimit = Math.min(
            deductionData.homeOfficeExpenses,
            window.TAX_CONSTANTS_2025.LIMITS.home_office_max
        );
        totalDeductions += homeOfficeLimit;

        // Donations (Section 18A)
        const donationsLimit = Math.min(
            deductionData.donations,
            deductionData.taxableIncomeBeforeDeductions * window.TAX_CONSTANTS_2025.LIMITS.donations_percentage
        );
        totalDeductions += donationsLimit;

        // Medical Expenses (Section 6B - additional medical expenses)
        // This is typically a credit, but if treated as a deduction for calculation purposes:
        const medicalExpensesThreshold = deductionData.taxableIncomeBeforeDeductions * window.TAX_CONSTANTS_2025.LIMITS.medical_expenses_threshold_percentage;
        const qualifyingMedicalExpenses = Math.max(0, deductionData.medicalExpenses - medicalExpensesThreshold);
        totalDeductions += qualifyingMedicalExpenses * window.TAX_CONSTANTS_2025.LIMITS.medical_expenses_qualifying_percentage;

        // Occupation-specific deductions
        totalDeductions += this.calculateOccupationDeduction(deductionData.occupation, deductionData.grossIncome);

        return totalDeductions;
    },

    calculateOccupationDeduction: function(occupation, grossIncome) {
        const occupationData = window.TAX_CONSTANTS_2025.LIMITS.OCCUPATION_DEDUCTIONS[occupation];
        if (!occupationData) return 0;

        const percentageDeduction = grossIncome * occupationData.percentage_of_income;
        return Math.min(percentageDeduction, occupationData.max_deduction);
    },

    validateFormData: function(formData) {
        const errors = [];

        // Example validation for basicSalary
        const basicSalary = parseFloat(formData.get("basicSalary"));
        if (isNaN(basicSalary) || basicSalary < 0) {
            errors.push({ field: "basicSalary", message: "Basic Salary must be a positive number." });
        }

        // Example validation for ageGroup
        const ageGroup = formData.get("ageGroup");
        if (!ageGroup || ageGroup === "") {
            errors.push({ field: "ageGroup", message: "Please select an age group." });
        }

        // Add more validations for other fields as needed
        const rentalIncome = parseFloat(formData.get("rentalIncome"));
        if (isNaN(rentalIncome) || rentalIncome < 0) {
            errors.push({ field: "rentalIncome", message: "Rental Income must be a positive number." });
        }

        const rentalExpenses = parseFloat(formData.get("rentalExpenses"));
        if (isNaN(rentalExpenses) || rentalExpenses < 0) {
            errors.push({ field: "rentalExpenses", message: "Rental Expenses must be a positive number." });
        }

        // Ensure rental expenses do not exceed rental income if both are provided and positive
        if (!isNaN(rentalIncome) && rentalIncome > 0 && !isNaN(rentalExpenses) && rentalExpenses > rentalIncome) {
            errors.push({ field: "rentalExpenses", message: "Rental Expenses cannot exceed Rental Income." });
        }

        return errors;
    }
};


window.WizardNavigation = {
    currentStep: 1,
    totalSteps: 5,
    formData: {},
    calculationResults: null,

    init: function() {
        console.log("Initializing wizard navigation...");
        this.loadState();
        this.renderStep();
        this.attachEventListeners();
        console.log("Wizard navigation initialized.");
    },

    loadState: function() {
        const savedStep = localStorage.getItem("wizardCurrentStep");
        if (savedStep) {
            this.currentStep = parseInt(savedStep);
        }
        const savedFormData = localStorage.getItem("wizardFormData");
        if (savedFormData) {
            this.formData = JSON.parse(savedFormData);
        }
        const savedResults = localStorage.getItem("wizardCalculationResults");
        if (savedResults) {
            this.calculationResults = JSON.parse(savedResults);
        }
    },

    saveState: function() {
        localStorage.setItem("wizardCurrentStep", this.currentStep);
        localStorage.setItem("wizardFormData", JSON.stringify(this.formData));
        localStorage.setItem("wizardCalculationResults", JSON.stringify(this.calculationResults));
    },

    attachEventListeners: function() {
        document.getElementById("prevStep").addEventListener("click", () => this.prevStep());
        document.getElementById("nextStep").addEventListener("click", () => this.nextStep());
        document.getElementById("calculateTax").addEventListener("click", () => this.calculateTax());
        document.getElementById("clearAllData").addEventListener("click", () => window.TaxEasyApp.clearAllData());

        // Attach input event listeners for real-time validation feedback
        document.querySelectorAll(".form-group input, .form-group select").forEach(input => {
            input.addEventListener("input", (e) => {
                const fieldName = e.target.name;
                if (fieldName) {
                    window.TaxEasyApp.clearError(fieldName);
                }
            });
            input.addEventListener("change", (e) => {
                const fieldName = e.target.name;
                if (fieldName) {
                    window.TaxEasyApp.clearError(fieldName);
                }
            });
        });
    },

    renderStep: function() {
        document.querySelectorAll(".wizard-step").forEach(step => {
            step.style.display = "none";
        });
        document.querySelector(`.wizard-step[data-step="${this.currentStep}"]`).style.display = "block";

        // Update progress bar
        const progress = (this.currentStep / this.totalSteps) * 100;
        document.getElementById("progressBar").style.width = `${progress}%`;

        // Update step indicator
        document.getElementById("stepIndicator").textContent = `Step ${this.currentStep} of ${this.totalSteps}`;

        // Update button visibility
        document.getElementById("prevStep").style.display = this.currentStep === 1 ? "none" : "inline-block";
        document.getElementById("nextStep").style.display = this.currentStep === this.totalSteps ? "none" : "inline-block";
        document.getElementById("calculateTax").style.display = this.currentStep === this.totalSteps ? "inline-block" : "none";

        // Load form data for current step
        this.loadFormDataForCurrentStep();

        // Clear all error messages when rendering a new step
        window.TaxEasyApp.hideAllErrorMessages();
    },

    loadFormDataForCurrentStep: function() {
        const currentStepElement = document.querySelector(`.wizard-step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.querySelectorAll("input, select").forEach(input => {
                if (this.formData[input.name] !== undefined) {
                    input.value = this.formData[input.name];
                }
            });
        }
    },

    saveFormDataForCurrentStep: function() {
        const currentStepElement = document.querySelector(`.wizard-step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.querySelectorAll("input, select").forEach(input => {
                this.formData[input.name] = input.value;
            });
        }
    },

    prevStep: function() {
        if (this.currentStep > 1) {
            this.saveFormDataForCurrentStep();
            this.currentStep--;
            this.renderStep();
            this.saveState();
        }
    },

    nextStep: function() {
        if (this.validateStep()) {
            this.saveFormDataForCurrentStep();
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.renderStep();
                this.saveState();
            }
        }
    },

    validateStep: function() {
        window.TaxEasyApp.hideAllErrorMessages(); // Clear all errors before re-validating
        const errors = [];
        const currentStepElement = document.querySelector(`.wizard-step[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return false;

        // Collect form data for validation
        const stepFormData = new FormData(document.getElementById("taxCalculatorForm"));

        // Perform general validation using TaxCalculator.validateFormData
        try {
            window.TaxCalculator.validateFormData(stepFormData);
        } catch (validationErrors) {
            const parsedErrors = JSON.parse(validationErrors.message);
            parsedErrors.forEach(err => errors.push(err));
        }

        // Step-specific validations (if any)
        switch (this.currentStep) {
            case 1:
                // Personal Information
                if (!stepFormData.get("fullName").trim()) {
                    errors.push({ field: "fullName", message: "Full Name is required." });
                }
                if (!stepFormData.get("emailAddress").trim()) {
                    errors.push({ field: "emailAddress", message: "Email Address is required." });
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stepFormData.get("emailAddress"))) {
                    errors.push({ field: "emailAddress", message: "Invalid Email Address." });
                }
                if (!stepFormData.get("ageGroup")) {
                    errors.push({ field: "ageGroup", message: "Age Group is required." });
                }
                if (!stepFormData.get("occupation")) {
                    errors.push({ field: "occupation", message: "Occupation is required." });
                }
                break;
            case 2:
                // Income Information
                // No specific step-level validation beyond general form data validation for now
                break;
            case 3:
                // Deduction Information
                // No specific step-level validation beyond general form data validation for now
                break;
            case 4:
                // Other Information
                // No specific step-level validation beyond general form data validation for now
                break;
            case 5:
                // Summary & Results
                // Validation for summary step is usually handled by the calculation itself
                break;
        }

        if (errors.length > 0) {
            window.TaxEasyApp.displayErrors(errors);
            return false;
        }
        return true;
    },

    calculateTax: function() {
        if (this.validateStep()) {
            this.saveFormDataForCurrentStep();
            const formElement = document.getElementById("taxCalculatorForm");
            const formData = new FormData(formElement);

            try {
                this.calculationResults = window.TaxCalculator.calculate(formData);
                this.displayResults();
                this.saveState();
            } catch (error) {
                console.error("Calculation error:", error);
                try {
                    const parsedErrors = JSON.parse(error.message);
                    window.TaxEasyApp.displayErrors(parsedErrors);
                } catch (e) {
                    window.TaxEasyApp.displayErrors([{ field: "general", message: "An unexpected calculation error occurred." }]);
                }
            }
        }
    },

    displayResults: function() {
        if (!this.calculationResults) return;

        const results = this.calculationResults;
        const format = window.TAX_HELPERS.formatCurrency;

        document.getElementById("summaryGrossIncome").textContent = format(results.grossIncome);
        document.getElementById("summaryTotalDeductions").textContent = format(results.totalDeductions);
        document.getElementById("summaryTaxableIncome").textContent = format(results.taxableIncome);
        document.getElementById("summaryTaxBeforeRebates").textContent = format(results.taxBeforeRebates);
        document.getElementById("summaryRebates").textContent = format(results.rebates);
        document.getElementById("summaryTaxAfterRebates").textContent = format(results.taxAfterRebates);
        document.getElementById("summaryMedicalCredits").textContent = format(results.medicalCredits);
        document.getElementById("summaryNetTaxPayable").textContent = format(results.netTaxPayable);
        document.getElementById("summaryTaxesPaid").textContent = format(results.taxesPaid);

        const finalResultElement = document.getElementById("summaryFinalResult");
        if (results.isRefund) {
            finalResultElement.textContent = `Refund: ${format(Math.abs(results.finalResult))}`;
            finalResultElement.className = "text-success";
        } else {
            finalResultElement.textContent = `Amount Due: ${format(results.finalResult)}`;
            finalResultElement.className = "text-danger";
        }

        document.getElementById("summaryEffectiveRate").textContent = `${results.effectiveRate.toFixed(2)}%`;
        document.getElementById("summaryMarginalRate").textContent = `${results.marginalRate.toFixed(2)}%`;

        // Show the results section
        document.getElementById("resultsSection").style.display = "block";
    }
};


window.PDFGenerator = {
    generateProfessionalReport: function(formData, results, paymentVerified = false, promoCodeUsed = false) {
        console.log("Generating professional tax report...");
        if (!paymentVerified && !promoCodeUsed) {
            alert("Payment verification required. Please complete payment or use a valid promotional code.");
            return;
        }
        try {
            if (typeof window.jsPDF === "undefined") {
                this.loadJsPDF().then(() => {
                    this.createProfessionalReport(formData, results, promoCodeUsed);
                });
            } else {
                this.createProfessionalReport(formData, results, promoCodeUsed);
            }
        } catch (error) {
            console.error("Error generating professional report:", error);
            alert("Error generating report. Please try again.");
        }
    },
    loadJsPDF: function() {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
            script.onload = () => {
                console.log("jsPDF loaded successfully");
                resolve();
            };
            script.onerror = () => {
                console.error("Failed to load jsPDF");
                reject(new Error("Failed to load PDF library"));
            };
            document.head.appendChild(script);
        });
    },
    createProfessionalReport: function(formData, results, promoCodeUsed = false) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setProperties({
            title: "TaxEasy ZA 2025 - Tax Calculation Report",
            subject: "South African Tax Calculation",
            author: "TaxEasy ZA",
            creator: "TaxEasy ZA Tax Calculator"
        });
        let yPosition = 20;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("TaxEasy ZA 2025", margin, yPosition);
        yPosition += 10;
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("Tax Calculation Report", margin, yPosition);
        yPosition += 5;
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString("en-ZA")}`, margin, yPosition);
        yPosition += 15;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Personal Information", margin, yPosition);
        yPosition += 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${formData.fullName || "Not provided"}`, margin, yPosition);
        yPosition += 5;
        doc.text(`Age Group: ${this.formatAgeGroup(formData.ageGroup)}`, margin, yPosition);
        yPosition += 5;
        doc.text(`Occupation: ${this.formatOccupation(formData.occupation)}`, margin, yPosition);
        yPosition += 15;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Income Summary", margin, yPosition);
        yPosition += 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const incomeItems = [
            ["Gross Income:", this.formatCurrency(results.grossIncome)],
            ["Total Deductions:", this.formatCurrency(results.deductions.total)],
            ["Taxable Income:", this.formatCurrency(results.taxableIncome)]
        ];
        incomeItems.forEach(([label, value]) => {
            doc.text(label, margin, yPosition);
            doc.text(value, margin + 80, yPosition);
            yPosition += 5;
        });
        yPosition += 10;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Tax Calculation", margin, yPosition);
        yPosition += 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const taxItems = [
            ["Tax Before Rebates:", this.formatCurrency(results.taxBeforeRebates)],
            ["Tax Rebates:", this.formatCurrency(results.rebates)],
            ["Tax After Rebates:", this.formatCurrency(results.taxAfterRebates)],
            ["Medical Aid Credits:", this.formatCurrency(results.medicalCredits)],
            ["Net Tax Payable:", this.formatCurrency(results.netTaxPayable)],
            ["Taxes Already Paid:", this.formatCurrency(results.taxesPaid)]
        ];
        taxItems.forEach(([label, value]) => {
            doc.text(label, margin, yPosition);
            doc.text(value, margin + 80, yPosition);
            yPosition += 5;
        });
        yPosition += 10;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Final Result", margin, yPosition);
        yPosition += 10;
        doc.setFontSize(12);
        if (results.isRefund) {
            doc.setTextColor(0, 128, 0);
            doc.text(`Estimated Refund: ${this.formatCurrency(Math.abs(results.finalResult))}`, margin, yPosition);
        } else {
            doc.setTextColor(255, 0, 0);
            doc.text(`Amount Due: ${this.formatCurrency(results.finalResult)}`, margin, yPosition);
        }
        doc.setTextColor(0, 0, 0);
        yPosition += 15;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Tax Rate Information", margin, yPosition);
        yPosition += 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Effective Tax Rate: ${results.effectiveRate.toFixed(2)}%`, margin, yPosition);
        yPosition += 5;
        doc.text(`Marginal Tax Rate: ${results.marginalRate.toFixed(2)}%`, margin, yPosition);
        yPosition += 15;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Important Notes", margin, yPosition);
        yPosition += 10;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const notes = [
            "• This is an estimate based on the information provided.",
            "• Actual tax liability may differ based on additional factors.",
            "• Consult a tax professional for complex tax situations.",
            "• Keep all supporting documents for SARS verification.",
            "• This report is SARS compliant for the 2025 tax year."
        ];
        notes.forEach(note => {
            doc.text(note, margin, yPosition);
            yPosition += 5;
        });
        yPosition += 10;
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text("Generated by TaxEasy ZA - Professional South African Tax Calculator", margin, yPosition);
        doc.text("Visit us at: https://taxeasy-za.com", margin, yPosition + 5);
        const fileName = `TaxEasy_ZA_2025_Basic_Report_${new Date().toISOString().split("T")[0]}.pdf`;
        doc.save(fileName);
        console.log("Basic report generated successfully");
    },
    generateProfessionalReport: function(formData, results, paymentData) {
        console.log("Generating professional tax report...");
        try {
            if (typeof window.jsPDF === "undefined") {
                this.loadJsPDF().then(() => {
                    this.createProfessionalReport(formData, results, paymentData);
                });
            } else {
                this.createProfessionalReport(formData, results, paymentData);
            }
        } catch (error) {
            console.error("Error generating professional report:", error);
            alert("Error generating professional report. Please try again.");
        }
    },
    createProfessionalReport: function(formData, results, paymentData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setProperties({
            title: "TaxEasy ZA 2025 - Professional Tax Report",
            subject: "Comprehensive South African Tax Analysis",
            author: "TaxEasy ZA",
            creator: "TaxEasy ZA Professional Tax Calculator"
        });
        let yPosition = 20;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, pageWidth, 30, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("TaxEasy ZA 2025", margin, 20);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Professional Tax Analysis Report", margin, 27);
        yPosition = 45;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Report Generated: ${new Date().toLocaleDateString("en-ZA")} at ${new Date().toLocaleTimeString("en-ZA")}`, margin, yPosition);
        yPosition += 5;
        doc.text(`Report Type: Professional Analysis`, margin, yPosition);
        yPosition += 5;
        doc.text(`Tax Year: 2025 (March 2024 - February 2025)`, margin, yPosition);
        yPosition += 15;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Executive Summary", margin, yPosition);
        yPosition += 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const summaryText = results.isRefund 
            ? `Based on your tax calculation, you are entitled to an estimated refund of ${this.formatCurrency(Math.abs(results.finalResult))}. This represents an effective tax rate of ${results.effectiveRate.toFixed(2)}% on your gross income of ${this.formatCurrency(results.grossIncome)}.`
            : `Based on your tax calculation, you have an estimated tax liability of ${this.formatCurrency(results.finalResult)}. This represents an effective tax rate of ${results.effectiveRate.toFixed(2)}% on your gross income of ${this.formatCurrency(results.grossIncome)}.`;
        const summaryLines = doc.splitTextToSize(summaryText, pageWidth - (margin * 2));
        doc.text(summaryLines, margin, yPosition);
        yPosition += summaryLines.length * 5 + 10;
        doc.addPage();
        yPosition = 20;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Detailed Income Analysis", margin, yPosition);
        yPosition += 15;
        this.addIncomeTable(doc, formData, results, margin, yPosition);
        const fileName = `TaxEasy_ZA_2025_Professional_Report_${new Date().toISOString().split("T")[0]}.pdf`;
        doc.save(fileName);
        console.log("Professional report generated successfully");
    },
    addIncomeTable: function(doc, formData, results, margin, startY) {
        const incomeData = [
            ["Income Source", "Amount"],
            ["Basic Salary", this.formatCurrency(formData.basicSalary || 0)],
            ["Bonus", this.formatCurrency(formData.bonus || 0)],
            ["Overtime", this.formatCurrency(formData.overtime || 0)],
            ["Travel Allowance", this.formatCurrency(formData.travelAllowance || 0)],
            ["Cellphone Allowance", this.formatCurrency(formData.cellphoneAllowance || 0)],
            ["Other Allowances", this.formatCurrency(formData.otherAllowances || 0)],
            ["Interest Income", this.formatCurrency(formData.interestIncome || 0)],
            ["Dividend Income", this.formatCurrency(formData.dividendIncome || 0)],
            ["Rental Income", this.formatCurrency(formData.rentalIncome || 0)],
            ["TOTAL GROSS INCOME", this.formatCurrency(results.grossIncome)]
        ];
        let yPos = startY;
        const colWidth = 80;
        incomeData.forEach((row, index) => {
            if (index === 0) {
                doc.setFont("helvetica", "bold");
                doc.setFillColor(240, 240, 240);
                doc.rect(margin, yPos - 3, colWidth * 2, 8, "F");
            } else if (index === incomeData.length - 1) {
                doc.setFont("helvetica", "bold");
                doc.setFillColor(37, 99, 235);
                doc.setTextColor(255, 255, 255);
                doc.rect(margin, yPos - 3, colWidth * 2, 8, "F");
            } else {
                doc.setFont("helvetica", "normal");
                doc.setTextColor(0, 0, 0);
            }
            doc.text(row[0], margin + 2, yPos);
            doc.text(row[1], margin + colWidth + 2, yPos);
            yPos += 8;
            if (index === incomeData.length - 1) {
                doc.setTextColor(0, 0, 0);
            }
        });
    },
    formatCurrency: function(amount) {
        return "R" + Math.round(amount).toLocaleString("en-ZA");
    },
    formatAgeGroup: function(ageGroup) {
        switch (ageGroup) {
            case "under65": return "Under 65";
            case "65-74": return "65-74 years";
            case "75plus": return "75+ years";
            default: return "Not specified";
        }
    },
    formatOccupation: function(occupation) {
        const occupations = {
            "doctor": "Medical Doctor",
            "teacher": "Teacher/Educator",
            "it_professional": "IT Professional",
            "engineer": "Engineer",
            "healthcare_worker": "Healthcare Worker",
            "other": "Other"
        };
        return occupations[occupation] || "Not specified";
    }
};

window.generateBasicReport = function() {
    const formData = window.WizardNavigation?.formData || {};
    const results = window.WizardNavigation?.calculationResults;
    if (!results) {
        alert("Please complete the tax calculation first.");
        return;
    }
    window.PDFGenerator.generateBasicReport(formData, results);
};

window.generateProfessionalReport = function(paymentData) {
    const formData = window.WizardNavigation?.formData || {};
    const results = window.WizardNavigation?.calculationResults;
    if (!results) {
        alert("Please complete the tax calculation first.");
        return;
    }
    window.PDFGenerator.generateProfessionalReport(formData, results, paymentData);
};


window.TaxEasyApp = {
    // Global error display and management
    displayErrors: function(errors) {
        this.hideAllErrorMessages(); // Clear previous errors
        errors.forEach(error => {
            const fieldElement = document.querySelector(`[name="${error.field}"]`);
            if (fieldElement) {
                const formGroup = fieldElement.closest(".form-group");
                if (formGroup) {
                    let errorDiv = formGroup.querySelector(".error-message");
                    if (!errorDiv) {
                        errorDiv = document.createElement("div");
                        errorDiv.className = "error-message";
                        formGroup.appendChild(errorDiv);
                    }
                    errorDiv.textContent = error.message;
                    errorDiv.style.display = "block";
                    fieldElement.classList.add("input-error");
                }
            } else if (error.field === "general") {
                // Handle general errors not tied to a specific field
                alert(error.message);
            }
        });
    },

    hideAllErrorMessages: function() {
        document.querySelectorAll(".error-message").forEach(el => {
            el.textContent = "";
            el.style.display = "none";
        });
        document.querySelectorAll(".input-error").forEach(el => {
            el.classList.remove("input-error");
        });
    },

    clearError: function(fieldName) {
        const fieldElement = document.querySelector(`[name="${fieldName}"]`);
        if (fieldElement) {
            const formGroup = fieldElement.closest(".form-group");
            if (formGroup) {
                const errorDiv = formGroup.querySelector(".error-message");
                if (errorDiv) {
                    errorDiv.textContent = "";
                    errorDiv.style.display = "none";
                }
                fieldElement.classList.remove("input-error");
            }
        }
    },

    // Clear all input data
    clearAllData: function() {
        // Clear form inputs
        document.getElementById("taxCalculatorForm").reset();

        // Clear local storage
        localStorage.removeItem("wizardCurrentStep");
        localStorage.removeItem("wizardFormData");
        localStorage.removeItem("wizardCalculationResults");
        localStorage.removeItem("taxeasy_used_promo_codes");
        localStorage.removeItem("taxeasy_payment_details");
        localStorage.removeItem("taxeasy_conversions");

        // Reset wizard state
        window.WizardNavigation.currentStep = 1;
        window.WizardNavigation.formData = {};
        window.WizardNavigation.calculationResults = null;
        window.WizardNavigation.renderStep();

        // Reset promo code state
        if (window.TaxEasyPromoCodes) {
            window.TaxEasyPromoCodes.promoCodeApplied = false;
            window.TaxEasyPromoCodes.appliedPromoCode = null;
            window.TaxEasyPromoCodes.codes.forEach(code => code.used = false);
            window.TaxEasyPromoCodes.initialize(); // Re-initialize to reset UI
        }

        // Hide results section
        document.getElementById("resultsSection").style.display = "none";

        // Clear all error messages
        this.hideAllErrorMessages();

        alert("All input data and stored information have been cleared.");
    },

    init: function() {
        console.log("TaxEasyApp initializing...");
        window.WizardNavigation.init();
        window.taxEasyPayFast.initialize();
        window.TaxEasyPromoCodes.initialize();
        window.TooltipSystem.init();
        console.log("TaxEasyApp initialized.");
    }
};

// Initialize the application when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    window.TaxEasyApp.init();
});


window.TooltipSystem = {
    init: function() {
        console.log("Initializing tooltip system...");
        this.attachEventListeners();
    },

    attachEventListeners: function() {
        document.querySelectorAll(".tooltip-icon").forEach(icon => {
            icon.addEventListener("mouseenter", this.showTooltip.bind(this));
            icon.addEventListener("mouseleave", this.hideTooltip.bind(this));
        });
    },

    showTooltip: function(event) {
        const tooltipKey = event.target.dataset.tooltip;
        if (!tooltipKey) return;

        let tooltipContent = "";
        // Attempt to get tooltip content from SARSComplianceData first
        if (window.SARSComplianceData) {
            const parts = tooltipKey.split("_");
            if (parts.length >= 2) {
                const fieldType = parts[0];
                const subType = parts.slice(1).join("_");
                tooltipContent = window.SARSComplianceData.getTooltipText(fieldType, subType);
            }
        }

        // Fallback to generic tooltips if not found in SARSComplianceData
        if (!tooltipContent) {
            switch (tooltipKey) {
                case "personal_info_title":
                    tooltipContent = "This section collects your basic personal details for tax calculation purposes.";
                    break;
                case "full_name":
                    tooltipContent = "Your full legal name as it appears on your ID document.";
                    break;
                case "id_number":
                    tooltipContent = "Your South African ID number or passport number for identification.";
                    break;
                case "age_group":
                    tooltipContent = "Your age group determines the tax rebates you qualify for.";
                    break;
                case "email_address":
                    tooltipContent = "Your email address for report delivery and communication.";
                    break;
                case "income_info_title":
                    tooltipContent = "Enter all your income details from your IRP5 and other sources.";
                    break;
                case "basic_salary":
                    tooltipContent = "Your annual basic salary before any deductions.";
                    break;
                case "bonus":
                    tooltipContent = "Any annual bonuses received.";
                    break;
                case "overtime":
                    tooltipContent = "Total annual income from overtime work.";
                    break;
                case "travel_allowance":
                    tooltipContent = "Annual travel allowance received from your employer.";
                    break;
                case "travel_deduction_method":
                    tooltipContent = "Choose how you want to claim travel deductions. A logbook is required for deemed rate and actual cost methods.";
                    break;
                case "business_km":
                    tooltipContent = "Total business kilometers traveled during the tax year. Requires a detailed logbook.";
                    break;
                case "actual_travel_costs":
                    tooltipContent = "Enter your actual vehicle expenses. Requires a detailed logbook and all receipts.";
                    break;
                case "cellphone_allowance":
                    tooltipContent = "Annual cellphone allowance received from your employer.";
                    break;
                case "other_allowances":
                    tooltipContent = "Any other allowances received from your employer not listed above.";
                    break;
                case "interest_income":
                    tooltipContent = "Total annual interest income received from investments or bank accounts.";
                    break;
                case "dividend_income":
                    tooltipContent = "Total annual dividend income received.";
                    break;
                case "rental_income":
                    tooltipContent = "Gross annual rental income received from properties.";
                    break;
                case "deduction_info_title":
                    tooltipContent = "Enter all eligible deductions to reduce your taxable income.";
                    break;
                case "pension_fund":
                    tooltipContent = "Your annual contributions to a pension, provident, or retirement annuity fund.";
                    break;
                case "medical_aid":
                    tooltipContent = "Your annual contributions to a registered medical aid scheme.";
                    break;
                case "home_office_expenses":
                    tooltipContent = "Qualifying home office expenses. Strict requirements apply, consult SARS guidelines.";
                    break;
                case "donations":
                    tooltipContent = "Donations made to approved Public Benefit Organisations (PBOs). Requires a Section 18A certificate.";
                    break;
                case "medical_expenses":
                    tooltipContent = "Qualifying out-of-pocket medical expenses not covered by medical aid.";
                    break;
                case "sars_taxes_paid":
                    tooltipContent = "Total PAYE (Pay As You Earn) or provisional tax paid to SARS during the tax year.";
                    break;
                case "other_deductions":
                    tooltipContent = "Any other eligible deductions not listed above.";
                    break;
                case "advanced_info_title":
                    tooltipContent = "Additional information that may impact your tax calculation.";
                    break;
                case "disability_status":
                    tooltipContent = "Indicate if you or your dependants have a disability as defined by SARS.";
                    break;
                case "dependants":
                    tooltipContent = "Number of financial dependants you support.";
                    break;
                case "tax_credits":
                    tooltipContent = "Tax credits reduce the amount of tax you pay.";
                    break;
                case "summary_info_title":
                    tooltipContent = "A summary of your tax calculation.";
                    break;
                default:
                    tooltipContent = "No information available for this item.";
                    break;
            }
        }

        const tooltipDiv = document.createElement("div");
        tooltipDiv.className = "custom-tooltip";
        tooltipDiv.innerHTML = tooltipContent;
        document.body.appendChild(tooltipDiv);

        const iconRect = event.target.getBoundingClientRect();
        tooltipDiv.style.left = `${iconRect.left + window.scrollX}px`;
        tooltipDiv.style.top = `${iconRect.bottom + window.scrollY + 5}px`;
        tooltipDiv.style.display = "block";
    },

    hideTooltip: function() {
        const tooltipDiv = document.querySelector(".custom-tooltip");
        if (tooltipDiv) {
            tooltipDiv.remove();
        }
    }
};


window.PaymentIntegration = {
    init: function() {
        console.log("Initializing payment integration...");
        this.attachEventListeners();
    },

    attachEventListeners: function() {
        // This is where you would attach event listeners for payment buttons
        // For now, the PayFast integration handles the primary payment flow
    },

    // This function would be called to initiate a payment process
    initiatePayment: function(amount, description, userDetails) {
        console.log(`Initiating payment for ${amount} - ${description}`);
        // Here you would typically call a payment gateway API
        // For this application, we are using PayFast via window.taxEasyPayFast
        window.taxEasyPayFast.processProfessionalReportPayment();
    },

    // Handle payment success callback
    handleSuccess: function(transactionId, amount) {
        console.log(`Payment successful! Transaction ID: ${transactionId}, Amount: ${amount}`);
        // Update UI, generate report, etc.
    },

    // Handle payment failure callback
    handleFailure: function(errorMessage) {
        console.error(`Payment failed: ${errorMessage}`);
        // Display error message to user
    }
};

