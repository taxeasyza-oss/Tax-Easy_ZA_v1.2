const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.payfast.co.za", "https://sandbox.payfast.co.za"]
        }
    }
}));

// Enable CORS for PayFast and other integrations
app.use(cors({
    origin: [
        'https://api.payfast.co.za',
        'https://sandbox.payfast.co.za',
        'https://www.payfast.co.za'
    ],
    credentials: true
}));

// Compression middleware
app.use(compression());

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true
}));

// API Routes for PayFast integration
app.post('/api/payfast/generate-signature', (req, res) => {
    try {
        const { merchant_id, merchant_key, amount, item_name } = req.body;
        
        // In production, use environment variables for PayFast credentials
        const payfastData = {
            merchant_id: process.env.PAYFAST_MERCHANT_ID || merchant_id,
            merchant_key: process.env.PAYFAST_MERCHANT_KEY || merchant_key,
            return_url: `${req.protocol}://${req.get('host')}/payment-success`,
            cancel_url: `${req.protocol}://${req.get('host')}/payment-cancelled`,
            notify_url: `${req.protocol}://${req.get('host')}/api/payfast/notify`,
            amount: amount,
            item_name: item_name,
            custom_str1: req.body.email || '',
            custom_str2: req.body.discount_code || ''
        };

        // Generate signature (simplified - in production use proper crypto)
        const crypto = require('crypto');
        const signature = crypto
            .createHash('md5')
            .update(Object.values(payfastData).join('&'))
            .digest('hex');

        res.json({
            success: true,
            signature: signature,
            data: payfastData
        });
    } catch (error) {
        console.error('PayFast signature generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate payment signature'
        });
    }
});

// PayFast notification handler
app.post('/api/payfast/notify', (req, res) => {
    try {
        console.log('PayFast notification received:', req.body);
        
        // Verify the payment notification
        const { payment_status, custom_str1, custom_str2 } = req.body;
        
        if (payment_status === 'COMPLETE') {
            // Payment successful - trigger PDF generation
            console.log(`Payment successful for email: ${custom_str1}`);
            // Here you would typically:
            // 1. Generate the professional PDF report
            // 2. Send it via email
            // 3. Update your database
        }
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('PayFast notification error:', error);
        res.status(500).send('Error processing notification');
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Serve main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve other HTML pages
app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    const allowedPages = ['faq', 'efiling-guide', 'privacy-policy', 'terms-of-service'];
    
    if (allowedPages.includes(page)) {
        res.sendFile(path.join(__dirname, `${page}.html`));
    } else {
        res.status(404).sendFile(path.join(__dirname, 'index.html'));
    }
});

// Payment success page
app.get('/payment-success', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Successful - TaxEasy ZA</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .success { color: #10b981; font-size: 24px; margin-bottom: 20px; }
                .message { font-size: 16px; line-height: 1.6; }
                .btn { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="success">✅ Payment Successful!</div>
            <div class="message">
                <p>Thank you for your purchase! Your professional tax report will be generated and sent to your email address within the next few minutes.</p>
                <p>Please check your inbox (and spam folder) for the detailed tax report.</p>
            </div>
            <a href="/" class="btn">Return to Calculator</a>
        </body>
        </html>
    `);
});

// Payment cancelled page
app.get('/payment-cancelled', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Cancelled - TaxEasy ZA</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .cancelled { color: #ef4444; font-size: 24px; margin-bottom: 20px; }
                .message { font-size: 16px; line-height: 1.6; }
                .btn { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="cancelled">❌ Payment Cancelled</div>
            <div class="message">
                <p>Your payment was cancelled. No charges have been made to your account.</p>
                <p>You can still download the free basic report or try the payment again.</p>
            </div>
            <a href="/" class="btn">Return to Calculator</a>
        </body>
        </html>
    `);
});

// Catch-all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.listen(PORT, () => {
    console.log(`TaxEasy ZA 2025 server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Access the application at: http://localhost:${PORT}`);
});

module.exports = app;
