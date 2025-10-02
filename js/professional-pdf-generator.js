// TaxEasy ZA 2025 - Professional PDF Report Generator
// Enhanced to use HTML template, include SARS eFiling codes, and specific disclaimers
// Updated with TaxEasy_ZA branding elements

class ProfessionalPDFGenerator {
    constructor() {
        this.sarsCodes = window.TaxEasySarsCompliance.getSarsCodes();
        this.htmlTemplate = 
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaxEasy_ZA Professional Tax Report</title>
    <style>
        /* Enhanced PDF Template Styles - Incorporating TaxEasy_ZA Branding */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; /* Primary font */
            font-size: 12px;
            line-height: 1.6;
            color: #2E3A45; /* Warm Charcoal for secondary text */
            background: #fff;
        }

        .report-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Header Styles */
        .report-header {
            background: linear-gradient(135deg, #0B1B2B 0%, #2E3A45 100%); /* Deep Midnight to Warm Charcoal */
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .report-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            color: #8BD34A; /* Lime Green for emphasis */
        }

        .report-header .subtitle {
            font-size: 18px;
            opacity: 0.9;
            font-weight: 300;
        }

        .report-header .report-id {
            font-size: 14px;
            margin-top: 10px;
            padding: 8px 16px;
            background: rgba(255,255,255,0.2);
            border-radius: 20px;
            display: inline-block;
        }

        /* Client Information */
        .client-info {
            background: #FFF2E0; /* Soft Sand */
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 30px;
            border-left: 5px solid #8BD34A; /* Lime Green accent */
        }

        .client-info h2 {
            color: #0B1B2B; /* Deep Midnight */
            font-size: 20px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .client-info h2 i {
            margin-right: 10px;
            font-size: 22px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .info-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .info-item .label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 5px;
            letter-spacing: 0.5px;
        }

        .info-item .value {
            font-size: 16px;
            font-weight: 600;
            color: #0B1B2B; /* Deep Midnight */
        }

        /* Executive Summary */
        .executive-summary {
            background: linear-gradient(135deg, #FFF2E0 0%, #f8f9fa 100%); /* Soft Sand */
            border: 2px solid #0B1B2B; /* Deep Midnight */
            border-radius: 10px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
        }

        .executive-summary h2 {
            color: #0B1B2B; /* Deep Midnight */
            font-size: 24px;
            margin-bottom: 25px;
            font-weight: 700;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }

        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #8BD34A; /* Lime Green accent */
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .summary-card .label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .summary-card .amount {
            font-size: 20px;
            font-weight: 700;
            color: #0B1B2B; /* Deep Midnight */
            font-family: 'Source Serif Pro', Merriweather, serif; /* Secondary font for long-form reading */
        }

        .final-tax {
            background: #0B1B2B; /* Deep Midnight */
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin-top: 20px;
        }

        .final-tax .label {
            color: #8BD34A; /* Lime Green */
            font-size: 16px;
            margin-bottom: 10px;
        }

        .final-tax .amount {
            font-size: 32px;
            font-weight: 700;
            color: white;
        }

        /* Section Styles */
        .section {
            margin: 40px 0;
            page-break-inside: avoid;
        }

        .section-header {
            background: #0B1B2B; /* Deep Midnight */
            color: white;
            padding: 15px 20px;
            border-radius: 8px 8px 0 0;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
        }

        .section-header i {
            margin-right: 12px;
            font-size: 20px;
        }

        /* Table Styles */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border-radius: 0 0 8px 8px;
            overflow: hidden;
        }

        .data-table th {
            background: linear-gradient(135deg, #2E3A45 0%, #0B1B2B 100%); /* Warm Charcoal to Deep Midnight */
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
        }

        .data-table th.amount {
            text-align: right;
        }

        .data-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e9ecef;
            font-size: 12px;
        }

        .data-table td.amount {
            text-align: right;
            font-family: 'Source Serif Pro', Merriweather, serif; /* Secondary font */
            font-weight: 600;
        }

        .data-table tr:nth-child(even) {
            background: #f8f9fa;
        }

        .data-table tr:hover {
            background: #FFF2E0; /* Soft Sand */
        }

        .total-row {
            background: #0B1B2B !important; /* Deep Midnight */
            color: white !important;
            font-weight: 700;
        }

        .total-row td {
            border-bottom: none;
            padding: 15px;
        }

        .highlight-row {
            background: #FFF2E0 !important; /* Soft Sand */
            border-left: 4px solid #8BD34A; /* Lime Green */
        }

        /* SARS Code Styling */
        .sars-code {
            background: #3DB7B7; /* Sky Teal */
            color: #0B1B2B; /* Deep Midnight */
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Amount Styling */
        .amount-positive {
            color: #8BD34A; /* Lime Green */
        }

        .amount-negative {
            color: #E55353; /* Alert Red */
        }

        /* Disclaimer */
        .disclaimer {
            background: #FFF2E0;
            border: 1px solid #8BD34A;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            font-size: 11px;
            line-height: 1.6;
        }

        .disclaimer h3 {
            color: #0B1B2B;
            margin-bottom: 15px;
            font-size: 16px;
        }

        .disclaimer ul {
            margin: 10px 0;
            padding-left: 20px;
        }

        .disclaimer li {
            margin: 5px 0;
        }

        /* Signature Section */
        .signature-section {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e9ecef;
        }

        .signature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            margin-top: 30px;
        }

        .signature-line {
            border-top: 1px solid #333;
            padding-top: 8px;
            font-size: 12px;
            text-align: center;
            margin-top: 40px;
        }

        /* Footer */
        .report-footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            font-size: 10px;
            color: #666;
        }

        /* Print Styles */
        @media print {
            body {
                margin: 0;
                font-size: 11px;
            }
            
            .report-container {
                max-width: none;
                padding: 0;
            }
            
            .page-break {
                page-break-before: always;
            }
            
            .no-print {
                display: none;
            }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .info-grid,
            .summary-grid {
                grid-template-columns: 1fr;
            }
            
            .signature-grid {
                grid-template-columns: 1fr;
                gap: 30px;
            }
            
            .data-table {
                font-size: 10px;
            }
            
            .data-table th,
            .data-table td {
                padding: 8px;
            }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
            .report-header {
                background: #000;
                color: #fff;
            }
            
            .section-header {
                background: #000;
                color: #fff;
            }
            
            .data-table th {
                background: #000;
                color: #fff;
            }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <!-- This template is used by the enhanced PDF generator -->
        <!-- Content is dynamically populated by the TaxEasyPDFGenerator class -->
        
        <!-- Placeholder structure for reference -->
        <div class="report-header">
            <h1>TaxEasy_ZA</h1>
            <div class="subtitle">Professional Income Tax Report</div>
            <div class="report-id">Report ID: {{REPORT_ID}}</div>
        </div>

        <div class="client-info">
            <h2><i class="fas fa-user"></i> Taxpayer Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="label">Full Name</div>
                    <div class="value">{{TAXPAYER_NAME}}</div>
                </div>
                <div class="info-item">
                    <div class="label">ID / Passport</div>
                    <div class="value">{{ID_NUMBER}}</div>
                </div>
                <div class="info-item">
                    <div class="label">Age</div>
                    <div class="value">{{AGE}} years</div>
                </div>
                <div class="info-item">
                    <div class="label">Tax Year</div>
                    <div class="value">2025</div>
                </div>
            </div>
        </div>

        <div class="executive-summary">
            <h2>Tax Calculation Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <div class="label">Gross Income</div>
                    <div class="amount">{{GROSS_INCOME}}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Total Deductions</div>
                    <div class="amount">{{TOTAL_DEDUCTIONS}}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Taxable Income</div>
                    <div class="amount">{{TAXABLE_INCOME}}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Effective Rate</div>
                    <div class="amount">{{EFFECTIVE_RATE}}%</div>
                </div>
            </div>
            <div class="final-tax">
                <div class="label">Final Tax Payable</div>
                <div class="amount">{{FINAL_TAX}}</div>
            </div>
        </div>

        <!-- Income Section -->
        <div class="section">
            <div class="section-header">
                <i class="fas fa-money-bill-wave"></i>
                Income Summary
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>SARS Code</th>
                        <th>Reference</th>
                        <th class="amount">Amount (ZAR)</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Income rows populated by JavaScript -->
                </tbody>
            </table>
        </div>

        <!-- Deductions Section -->
        <div class="section">
            <div class="section-header">
                <i class="fas fa-minus-circle"></i>
                Deductions Summary
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>SARS Code</th>
                        <th>Reference</th>
                        <th class="amount">Amount (ZAR)</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Deduction rows populated by JavaScript -->
                </tbody>
            </table>
        </div>

        <!-- Tax Calculation Section -->
        <div class="section">
            <div class="section-header">
                <i class="fas fa-calculator"></i>
                Tax Calculation
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Reference</th>
                        <th class="amount">Amount (ZAR)</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Tax calculation rows populated by JavaScript -->
                </tbody>
            </table>
        </div>

        <div class="disclaimer">
            <h3>Important Disclaimer</h3>
            <p><strong>This report is for estimation purposes only.</strong> TaxEasy_ZA provides tax calculations based on the information you provided and current SARS tax tables for the 2025 tax year.</p>
            
            <h4 style="margin-top: 15px; margin-bottom: 10px;">Important Notes:</h4>
            <ul>
                <li>This should not be considered as professional tax advice</li>
                <li>Please consult with a qualified tax practitioner for complex situations</li>
                <li>Always verify calculations with official SARS resources</li>
                <li>No personal information was stored during report generation</li>
                <li>All calculations were performed locally in your browser</li>
            </ul>
            
            <h4 style="margin-top: 15px; margin-bottom: 10px;">SARS Contact Information:</h4>
            <ul>
                <li>SARS Contact Centre: 0800 00 7277</li>
                <li>Website: <a href="https://www.sars.gov.za" target="_blank">www.sars.gov.za</a></li>
                <li>eFiling: <a href="https://www.sarsefiling.co.za" target="_blank">www.sarsefiling.co.za</a></li>
            </ul>
            <h4 style="margin-top: 15px; margin-bottom: 10px;">Tax Tip:</h4>
            <p>Remember to keep all your supporting documents (IRP5, medical aid certificates, logbooks, invoices) for at least five years, as SARS may request them for verification.</p>
        </div>

        <div class="signature-section">
            <h3>Taxpayer Declaration</h3>
            <p>I declare that the information contained in this calculation is true and correct to the best of my knowledge.</p>
            
            <div class="signature-grid">
                <div>
                    <div class="signature-line">Taxpayer Signature</div>
                </div>
                <div>
                    <div class="signature-line">Date</div>
                </div>
            </div>
        </div>

        <div class="report-footer">
            <p>Generated by TaxEasy_ZA on {{GENERATION_DATE}} at {{GENERATION_TIME}}</p>
            <p>© 2025 TaxEasy_ZA • This is a computer-generated document</p>
            <p>For support, visit our website or contact our help desk</p>
        </div>
    </div>
</body>
</html>
`;
    }

    generateReport(formData, results, isPaid, isPromoCodeUsed) {
        if (!isPaid && !isPromoCodeUsed) {
            alert("Payment required or promotional code needed to generate professional report.");
            return;
        }

        // Populate the HTML template with dynamic data
        let populatedHtml = this.htmlTemplate;

        // Basic User Info
        const fullName = formData.fullName || "N/A";
        const idNumber = formData.idNumber || "N/A";
        const age = formData.ageGroup ? formData.ageGroup.replace("-", " to ") : "N/A";

        populatedHtml = populatedHtml.replace(/{{REPORT_ID}}/g, this.generateReportId());
        populatedHtml = populatedHtml.replace(/{{TAXPAYER_NAME}}/g, fullName);
        populatedHtml = populatedHtml.replace(/{{ID_NUMBER}}/g, idNumber);
        populatedHtml = populatedHtml.replace(/{{AGE}}/g, age);
        populatedHtml = populatedHtml.replace(/{{GENERATION_DATE}}/g, new Date().toLocaleDateString());
        populatedHtml = populatedHtml.replace(/{{GENERATION_TIME}}/g, new Date().toLocaleTimeString());

        // Executive Summary
        populatedHtml = populatedHtml.replace(/{{GROSS_INCOME}}/g, `R${results.grossIncome.toFixed(2)}`);
        populatedHtml = populatedHtml.replace(/{{TOTAL_DEDUCTIONS}}/g, `R${results.totalDeductions.toFixed(2)}`);
        populatedHtml = populatedHtml.replace(/{{TAXABLE_INCOME}}/g, `R${results.taxableIncome.toFixed(2)}`);
        populatedHtml = populatedHtml.replace(/{{EFFECTIVE_RATE}}/g, results.effectiveRate.toFixed(2));
        populatedHtml = populatedHtml.replace(/{{FINAL_TAX}}/g, `R${results.finalAmount.toFixed(2)}`);

        // Income Summary Table
        let incomeRows = ``;
        // Example income items - you'll need to map your actual form data to these
        if (formData.basicSalary && formData.basicSalary > 0) {
            incomeRows += this.generateTableRow("Basic Salary", this.sarsCodes["3601"], "IRP5", formData.basicSalary);
        }
        if (formData.bonus && formData.bonus > 0) {
            incomeRows += this.generateTableRow("Bonus", this.sarsCodes["3601"], "IRP5", formData.bonus);
        }
        if (formData.overtime && formData.overtime > 0) {
            incomeRows += this.generateTableRow("Overtime", this.sarsCodes["3601"], "IRP5", formData.overtime);
        }
        // Add other income types as per your application's data structure
        // Example for travel allowance (assuming it's income before deduction)
        if (formData.travelAllowance && formData.travelAllowance > 0) {
            incomeRows += this.generateTableRow("Travel Allowance", this.sarsCodes["3701"], "IRP5", formData.travelAllowance);
        }
        // Rental Income
        if (formData.rentalIncome && formData.rentalIncome > 0) {
            incomeRows += this.generateTableRow("Rental Income", this.sarsCodes["4201"], "Rental Schedule", formData.rentalIncome);
        }
        populatedHtml = populatedHtml.replace(/<!-- Income rows populated by JavaScript -->/g, incomeRows);

        // Deductions Summary Table
        let deductionRows = ``;
        // Example deduction items
        if (formData.pensionFund && formData.pensionFund > 0) {
            deductionRows += this.generateTableRow("Pension Fund Contributions", this.sarsCodes["4001"], "IRP5", formData.pensionFund);
        }
        if (formData.medicalAid && formData.medicalAid > 0) {
            deductionRows += this.generateTableRow("Medical Aid Contributions", this.sarsCodes["4005"], "Medical Aid Cert", formData.medicalAid);
        }
        if (formData.additionalMedicalExpenses && formData.additionalMedicalExpenses > 0) {
            deductionRows += this.generateTableRow("Additional Medical Expenses", this.sarsCodes["4005"], "Medical Receipts", formData.additionalMedicalExpenses);
        }
        // Travel Allowance Deduction (if applicable)
        if (formData.travelDeduction && formData.travelDeduction > 0) {
            deductionRows += this.generateTableRow("Travel Allowance Deduction", this.sarsCodes["4003"], "Logbook/Records", formData.travelDeduction);
        }
        // Rental Deductions
        if (formData.rental_management && formData.rental_management > 0) {
            deductionRows += this.generateTableRow("Property Management Fees", this.sarsCodes["4006"], "Invoice", formData.rental_management);
        }
        if (formData.rental_repairs && formData.rental_repairs > 0) {
            deductionRows += this.generateTableRow("Repairs & Maintenance", this.sarsCodes["4006"], "Invoice", formData.rental_repairs);
        }
        if (formData.rental_insurance && formData.rental_insurance > 0) {
            deductionRows += this.generateTableRow("Property Insurance", this.sarsCodes["4006"], "Policy", formData.rental_insurance);
        }
        if (formData.rental_rates && formData.rental_rates > 0) {
            deductionRows += this.generateTableRow("Municipal Rates & Taxes", this.sarsCodes["4006"], "Statement", formData.rental_rates);
        }
        if (formData.rental_bond_interest && formData.rental_bond_interest > 0) {
            deductionRows += this.generateTableRow("Bond Interest", this.sarsCodes["4006"], "Bond Statement", formData.rental_bond_interest);
        }
        if (formData.rental_advertising && formData.rental_advertising > 0) {
            deductionRows += this.generateTableRow("Advertising Costs", this.sarsCodes["4006"], "Invoice", formData.rental_advertising);
        }
        if (formData.rental_legal && formData.rental_legal > 0) {
            deductionRows += this.generateTableRow("Legal Fees (Rental)", this.sarsCodes["4006"], "Invoice", formData.rental_legal);
        }
        if (formData.rental_depreciation && formData.rental_depreciation > 0) {
            deductionRows += this.generateTableRow("Property Depreciation", this.sarsCodes["4006"], "Calculation", formData.rental_depreciation);
        }
        if (formData.rental_other && formData.rental_other > 0) {
            deductionRows += this.generateTableRow("Other Rental Expenses", this.sarsCodes["4006"], "Receipts", formData.rental_other);
        }
        populatedHtml = populatedHtml.replace(/<!-- Deduction rows populated by JavaScript -->/g, deductionRows);

        // Tax Calculation Table
        let taxCalcRows = ``;
        taxCalcRows += this.generateTaxCalcRow("Gross Income", `R${results.grossIncome.toFixed(2)}`);
        taxCalcRows += this.generateTaxCalcRow("Less: Total Deductions", `R${results.totalDeductions.toFixed(2)}`);
        taxCalcRows += this.generateTaxCalcRow("Taxable Income", `R${results.taxableIncome.toFixed(2)}`);
        taxCalcRows += this.generateTaxCalcRow("Tax per Tax Tables", `R${results.taxBeforeRebates.toFixed(2)}`);
        taxCalcRows += this.generateTaxCalcRow("Less: Primary Rebate", `R${results.primaryRebate.toFixed(2)}`);
        if (results.secondaryRebate > 0) {
            taxCalcRows += this.generateTaxCalcRow("Less: Secondary Rebate", `R${results.secondaryRebate.toFixed(2)}`);
        }
        if (results.tertiaryRebate > 0) {
            taxCalcRows += this.generateTaxCalcRow("Less: Tertiary Rebate", `R${results.tertiaryRebate.toFixed(2)}`);
        }
        taxCalcRows += this.generateTaxCalcRow("Less: Medical Aid Credits", `R${results.medicalCredits.toFixed(2)}`);
        taxCalcRows += this.generateTaxCalcRow("Net Tax Payable", `R${results.netTax.toFixed(2)}`);
        taxCalcRows += this.generateTaxCalcRow("Less: PAYE Paid", `R${results.payePaid.toFixed(2)}`);
        taxCalcRows += `<tr class="total-row"><td>Final Amount</td><td></td><td class="amount">R${results.finalAmount.toFixed(2)}</td></tr>`;
        populatedHtml = populatedHtml.replace(/<!-- Tax calculation rows populated by JavaScript -->/g, taxCalcRows);

        // Generate PDF from HTML
        const opt = {
            margin: 10,
            filename: `TaxEasy_ZA_Professional_Report_${new Date().getFullYear()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(populatedHtml).save();
    }

    generateReportId() {
        return `TEZA-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    }

    generateTableRow(description, sarsCode, reference, amount) {
        return `
            <tr>
                <td>${description}</td>
                <td><span class="sars-code">${sarsCode}</span></td>
                <td>${reference}</td>
                <td class="amount">R${amount.toFixed(2)}</td>
            </tr>
        `;
    }

    generateTaxCalcRow(description, amount) {
        return `
            <tr>
                <td>${description}</td>
                <td></td>
                <td class="amount">${amount}</td>
            </tr>
        `;
    }
}

window.ProfessionalPDFGenerator = new ProfessionalPDFGenerator();

console.log("Professional PDF Generator loaded.");

