# TaxEasy ZA 2025 - Professional South African Tax Calculator

## Overview

TaxEasy ZA 2025 is a professional, SARS-compliant tax calculator designed for the South African 2025 tax year (1 March 2024 - 28 February 2025). The application provides accurate tax calculations using official SARS tax tables and offers both free basic reports and premium professional reports with detailed analysis.

## Features

### ✅ Core Functionality
- **100% SARS Compliant** - Uses official 2025 tax tables and rates
- **Multi-step Wizard** - User-friendly 5-step process (Personal → Income → Deductions → Advanced → Summary)
- **Accurate Tax Calculations** - Includes all rebates, medical credits, and deductions
- **Professional UI** - Modern, responsive design with excellent UX
- **Comprehensive Tooltips** - Clear guidance for every field
- **POPIA Compliant** - Privacy banner and data protection

### 📊 Tax Calculation Features
- Personal tax rebates (age-based: Under 65, 65-74, 75+)
- Medical aid tax credits
- Retirement fund contributions (pension, provident, RA)
- Standard deductions (donations, travel, home office)
- Advanced deductions (solar PV, renewable energy)
- Occupation-specific deductions

### 📄 Report Generation
- **Free Basic Report** - Tax calculation summary, basic breakdown
- **Professional Report (R129)** - Comprehensive analysis, tax planning, eFiling instructions
- **Discount Code System** - Support for promotional codes
- **PDF Generation** - Professional formatting for both report types

### 💳 Payment Integration
- **PayFast Integration** - Secure South African payment gateway
- **Discount Code Support** - Automatic price adjustments
- **Payment Success/Failure Handling** - Proper user feedback

## Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express.js
- **Payment**: PayFast integration
- **PDF Generation**: Client-side PDF creation
- **Deployment**: Render-ready with Express server

## Deployment Instructions

### Deploy to Render

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
   - **Instance Type**: Starter (sufficient for most usage)

4. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PAYFAST_MERCHANT_ID=your_merchant_id
   PAYFAST_MERCHANT_KEY=your_merchant_key
   PAYFAST_PASSPHRASE=your_passphrase
   ```

5. **Deploy** - Render will automatically build and deploy

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

## File Structure

```
taxeasy-fixed/
├── index.html              # Main application page
├── server.js               # Express server for Render
├── package.json            # Node.js dependencies
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   ├── main.js             # Application initialization
│   ├── tax-constants.js    # SARS 2025 tax rates and constants
│   ├── tax-calculator.js   # Core tax calculation engine
│   ├── tax-optimizer.js    # Tax optimization logic
│   ├── wizard-navigation.js # Multi-step form navigation
│   ├── tooltip-system.js   # Tooltip functionality
│   ├── pdf-generator.js    # PDF report generation
│   └── payment-integration.js # PayFast payment handling
├── images/
│   ├── logo.png            # Application logo
│   └── favicon.png         # Favicon
├── faq.html                # FAQ page
├── efiling-guide.html      # eFiling instructions
├── privacy-policy.html     # Privacy policy
├── terms-of-service.html   # Terms of service
└── manifest.json           # PWA manifest
```

## SARS Compliance

This calculator uses the official SARS tax tables for 2025:

### Tax Brackets (2025)
- R0 - R237,100: 18%
- R237,101 - R370,500: 26%
- R370,501 - R512,800: 31%
- R512,801 - R673,000: 36%
- R673,001 - R857,900: 39%
- R857,901 - R1,817,000: 41%
- R1,817,001+: 45%

### Tax Rebates (2025)
- Under 65: R17,235
- 65-74: R26,679 (R17,235 + R9,444)
- 75+: R29,841 (R17,235 + R9,444 + R3,162)

### Medical Aid Tax Credits (2025)
- Main member: R364 per month
- First dependant: R364 per month
- Additional dependants: R246 per month each

## Important Disclaimers

⚠️ **This calculator provides estimates only.** While we strive for 100% SARS compliance using official 2025 tax tables, your actual tax liability may differ based on individual circumstances. This tool does not constitute professional tax advice. For complex tax situations, consult a registered tax practitioner. Always verify calculations with official SARS resources.

## Support

- **FAQ**: Available in the application
- **eFiling Guide**: Step-by-step SARS eFiling instructions
- **SARS Contact**: 0800 00 7277
- **SARS eFiling**: www.sarsefiling.co.za

## License

MIT License - See LICENSE file for details.

## Version History

- **v1.0.0** - Initial release with full SARS 2025 compliance
- Professional tax calculator with PayFast integration
- Multi-step wizard interface
- Free and premium report generation

---

**TaxEasy ZA 2025** - Simplifying tax, one click at a time.
